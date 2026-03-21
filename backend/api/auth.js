import dotenv from 'dotenv';
dotenv.config();

import { getAuth } from '../config/firebase.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Google OAuth login
    const { googleToken } = req.body;
    if (!googleToken) {
      return res.status(400).json({ error: 'googleToken is required' });
    }
    try {
      const auth = getAuth();
      const decodedToken = await auth.verifyIdToken(googleToken);
      const { uid, email } = decodedToken;
      const token = jwt.sign({ userId: uid, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ token });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid Google token', details: err.message });
    }
  } else if (req.method === 'GET') {
    // Verify JWT
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ valid: true, user: decoded });
    } catch (err) {
      return res.status(401).json({ valid: false, error: 'Invalid token', details: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
