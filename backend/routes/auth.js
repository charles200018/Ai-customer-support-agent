import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { getDb } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { googleToken } = req.body;

  if (!googleToken) {
    return res.status(400).json({ error: 'googleToken is required' });
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Missing GOOGLE_CLIENT_ID or JWT_SECRET on server' });
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
      return res.status(401).json({ error: 'Invalid Google token payload' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Google authentication failed' });
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

    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save or load user from database' });
  }
});

router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const docRef = db.collection('users').doc(req.user.userId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const data = snapshot.data();
    const user = {
      id: snapshot.id,
      email: data.email,
      name: data.name || null,
      picture_url: data.picture_url || null,
      created_at: data.createdAt?.toDate?.().toISOString?.() || null,
    };

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify session' });
  }
});

router.post('/logout', authenticateToken, (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

router.get('/status', (req, res) => {
  res.json({ message: 'Auth routes are active' });
});

export default router;
