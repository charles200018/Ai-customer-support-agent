// Vercel Serverless Function: /api/auth
// Handles login, verify, logout, and status endpoints

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { getDb } from '../../backend/config/database.js';
import { authenticateToken } from '../../backend/middleware/auth.js';

export default async function handler(req, res) {
  if (req.method === 'POST' && req.url === '/login') {
    const { googleToken } = req.body;
    if (!googleToken) {
      res.status(400).json({ error: 'googleToken is required' });
      return;
    }
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
      res.status(500).json({ error: 'Missing GOOGLE_CLIENT_ID or JWT_SECRET on server' });
      return;
    }
    let payload;
    try {
      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
      if (!payload?.email || !payload?.sub) {
        res.status(401).json({ error: 'Invalid Google token payload' });
        return;
      }
    } catch (error) {
      res.status(401).json({ error: 'Google authentication failed' });
      return;
    }
    try {
      const db = getDb();
      const usersRef = db.collection('users');
      const existingSnapshot = await usersRef.where('email', '==', payload.email).limit(1).get();
      let user;
      if (!existingSnapshot.empty) {
        const doc = existingSnapshot.docs[0];
        const data = doc.data();
        user = {
          id: doc.id,
          email: data.email,
          name: data.name || null,
          picture_url: data.picture_url || null,
          created_at: data.createdAt?.toDate?.().toISOString?.() || null,
        };
      } else {
        const now = new Date();
        const newUser = {
          google_id: payload.sub,
          email: payload.email,
          name: payload.name || null,
          picture_url: payload.picture || null,
          createdAt: now,
          updatedAt: now,
        };
        const insertRef = await usersRef.add(newUser);
        user = {
          id: insertRef.id,
          email: newUser.email,
          name: newUser.name,
          picture_url: newUser.picture_url,
          created_at: now.toISOString(),
        };
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save or load user from database' });
    }
    return;
  }
  if (req.method === 'GET' && req.url === '/verify') {
    await authenticateToken(req, res, async () => {
      try {
        const db = getDb();
        const docRef = db.collection('users').doc(req.user.userId);
        const snapshot = await docRef.get();
        if (!snapshot.exists) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        const data = snapshot.data();
        const user = {
          id: snapshot.id,
          email: data.email,
          name: data.name || null,
          picture_url: data.picture_url || null,
          created_at: data.createdAt?.toDate?.().toISOString?.() || null,
        };
        res.json({ user });
      } catch (error) {
        res.status(500).json({ error: 'Failed to verify session' });
      }
    });
    return;
  }
  if (req.method === 'POST' && req.url === '/logout') {
    await authenticateToken(req, res, () => {
      res.json({ message: 'Logged out successfully' });
    });
    return;
  }
  if (req.method === 'GET' && req.url === '/status') {
    res.json({ message: 'Auth routes are active' });
    return;
  }
  res.status(404).json({ error: 'Not found' });
}
