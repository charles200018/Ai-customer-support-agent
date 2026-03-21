import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

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
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: `You are a helpful customer support agent. Use the provided document context to answer user questions. Document ID: ${documentId}` },
            { role: 'user', content: userMessage }
          ]
        })
      });
      const data = await groqRes.json();
      const aiMessage = data.choices?.[0]?.message?.content || '';
      return res.status(200).json({ answer: aiMessage });
    } catch (err) {
      return res.status(500).json({ error: 'Groq API error', details: err.message });
    }
  });
}
