import dotenv from 'dotenv';
dotenv.config();

import { OAuth2Client } from 'google-auth-library';
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
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: 'GOOGLE_CLIENT_ID not set' });
  }
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    const token = jwt.sign({ email, name, picture }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token, user: { email, name, picture } });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Google token', details: err.message });
  }
}
