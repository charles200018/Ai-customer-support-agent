import dotenv from 'dotenv';
dotenv.config();

import { getAuth } from '../../../config/firebase.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { googleToken } = req.body;
  if (!googleToken) {
    return res.status(400).json({ error: 'googleToken is required' });
  }
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(googleToken);
    const { uid, email } = decodedToken;
    const token = jwt.sign({ userId: uid, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token, user: { uid, email } });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Google token', details: err.message });
  }
}
