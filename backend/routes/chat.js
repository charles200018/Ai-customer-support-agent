// backend/routes/chat.js
// POST /api/chat – authenticated, RAG-enabled AI chat

import express from 'express';
import { getDb } from '../config/database.js';
import { selectRelevantChunks } from '../utils/rag.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userMessage, documentId } = req.body;
    if (!userMessage || !documentId) {
      return res.status(400).json({ error: 'Missing userMessage or documentId' });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY not set in environment.' });
    }

    // Fetch document from Firestore, verify ownership
    const db = getDb();
    const docRef = db.collection('documents').doc(documentId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const docData = docSnap.data();
    if (docData.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // RAG: select most relevant chunks
    const chunks = Array.isArray(docData.chunks) ? docData.chunks : [];
    const contextChunks = selectRelevantChunks(chunks, userMessage, 3);
    const contextText = contextChunks.length > 0 ? contextChunks.join('\n---\n') : '';

    const systemPrompt = contextText
      ? `You are a helpful customer support agent. Answer based on the provided document context.\n\nDocument context:\n${contextText}`
      : `You are a helpful customer support agent. No relevant document context was found.`;

    // Call Groq API (native fetch – Node 18+)
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error('Groq API error:', errorText);
      return res.status(groqRes.status).json({ error: 'Groq API error', details: errorText });
    }

    const data = await groqRes.json();
    const aiMessage = data.choices?.[0]?.message?.content;
    if (!aiMessage) {
      return res.status(502).json({ error: 'No AI response from Groq.' });
    }

    res.json({ answer: aiMessage });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
