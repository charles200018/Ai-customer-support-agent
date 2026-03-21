import dotenv from 'dotenv';
dotenv.config();

import { getAuth } from '../config/firebase.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  // POST /login
  if (req.method === 'POST' && url.includes('login')) {
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
  }

  // GET /verify
  else if (req.method === 'GET' && url.includes('verify')) {
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
  }

  // POST /logout
  else if (req.method === 'POST' && url.includes('logout')) {
    // For stateless JWT, logout is handled client-side (token removal)
    // Optionally, you could implement token blacklisting here
    return res.status(200).json({ message: 'Logged out' });
  }

  // Method or route not allowed
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
