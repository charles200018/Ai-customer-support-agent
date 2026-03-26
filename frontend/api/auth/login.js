// frontend/api/auth/login.js (Vercel serverless handler)
import { OAuth2Client } from 'google-auth-library';
import rateLimit from '../_rateLimit';
import jwt from 'jsonwebtoken';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getDb() {
  if (getApps().length === 0) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
  return getFirestore();
}

export default async function handler(req, res) {
  // Rate limit: 10 requests per 60s per IP
  if (!rateLimit(req, res, { windowMs: 60 * 1000, max: 10 })) return;
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { googleToken } = req.body;
  if (!googleToken) return res.status(400).json({ error: 'googleToken is required' });

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Missing GOOGLE_CLIENT_ID or JWT_SECRET on server' });
  }

  try {
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({ error: 'Invalid Google token payload' });
    }

    const db = getDb()
    const usersRef = db.collection('users')
    const existing = await usersRef.where('email', '==', payload.email).limit(1).get()
    let user;
    if (!existing.empty) {
      const doc = existing.docs[0];
      user = {
        id: doc.id,
        email: doc.data().email,
        name: doc.data().name || null,
        picture_url: doc.data().picture_url || null,
        created_at: doc.data().createdAt?.toDate?.()?.toISOString() || null
      };
    } else {
      const now = new Date();
      const ref = await usersRef.add({
        google_id: payload.sub,
        email: payload.email,
        name: payload.name || null,
        picture_url: payload.picture || null,
        createdAt: now,
        updatedAt: now
      });
      user = {
        id: ref.id,
        email: payload.email,
        name: payload.name || null,
        picture_url: payload.picture || null,
        created_at: now.toISOString()
      };
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    return res.status(200).json({ token, user })
  } catch (err) {
    console.error('Login error');
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
