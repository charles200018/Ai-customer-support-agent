

import cors from 'cors';
import dotenv from 'dotenv';
import { getDb } from '../config/database.js';
import { selectRelevantChunks } from '../utils/rag.js';

dotenv.config();

const corsHandler = cors();

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const { userMessage, documentId } = req.body;
    if (!userMessage || !documentId) {
      return res.status(400).json({ error: 'userMessage and documentId are required' });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY not set' });
    }
    try {
      // Fetch document from Firestore
      const db = getDb();
      const docRef = db.collection('documents').doc(documentId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ error: 'Document not found' });
      }
      const docData = docSnap.data();
      const chunks = Array.isArray(docData.chunks) ? docData.chunks : [];
      const contextChunks = selectRelevantChunks(chunks, userMessage, 3);
      const contextText = contextChunks.length > 0 ? contextChunks.join('\n---\n') : '';

      // Compose system prompt with context
      const systemPrompt = contextText
        ? `You are a helpful customer support agent. Answer based on the provided document context.\n\nDocument context:\n${contextText}`
        : `You are a helpful customer support agent. No document context was found.`;

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!groqRes.ok) {
        const errorBody = await groqRes.text();
        console.error('Groq API error:', groqRes.status, errorBody);
        return res.status(500).json({ error: 'Groq API error', status: groqRes.status, body: errorBody });
      }

      const data = await groqRes.json();
      const aiMessage = data.choices?.[0]?.message?.content || '';
      return res.status(200).json({ answer: aiMessage });
    } catch (err) {
      console.error('Groq API exception:', err);
      return res.status(500).json({ error: 'Groq API exception', details: err.message, stack: err.stack });
    }
  });
}
