import cors from 'cors';
import dotenv from 'dotenv';
import { getDb } from '../config/database.js';

dotenv.config();

const corsHandler = cors();

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
      const db = getDb();
      // Assuming you have a 'chats' collection with user chat history
      const chatsSnap = await db.collection('chats').orderBy('created_at', 'desc').limit(20).get();
      const history = [];
      chatsSnap.forEach(doc => {
        const data = doc.data();
        history.push({
          id: doc.id,
          title: data.title || '',
          firstMessage: data.messages?.[0]?.text || '',
          documentName: data.documentName || '',
          date: data.created_at ? new Date(data.created_at).toLocaleString() : '',
        });
      });
      return res.status(200).json({ history });
    } catch (err) {
      console.error('Chat history error:', err);
      return res.status(500).json({ error: 'Failed to fetch chat history', details: err.message });
    }
  });
}
