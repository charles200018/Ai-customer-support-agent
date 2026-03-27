// backend/routes/chatHistory.js
import express from 'express';
import { getDb } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/chat-history – get latest 20 chat history items for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    // Only return chats for the current user
    const chatsSnap = await db.collection('chats')
      .where('userId', '==', req.user.userId)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();
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

export default router;
