// backend/routes/chat.js
// Handles the /api/chat POST endpoint for AI chat completions

import express from 'express';
const fetch = require('node-fetch');

console.log('chatRoutes file loaded');
const router = express.Router();

/**
 * POST /api/chat
 * Accepts: { "userMessage": "..." }
 * Calls Groq API and returns the AI response.
 */
router.post('/chat', async (req, res) => {
  try {
    // 1. Extract user message and documentId from request body
    const { userMessage, documentId } = req.body;
    if (!userMessage || !documentId) {
      return res.status(400).json({ error: 'Missing userMessage or documentId' });
    }

    // 2. Prepare Groq API request
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not set in environment.');
      return res.status(500).json({ error: 'GROQ_API_KEY not set in environment.' });
    }

    const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
    const payload = {
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'user', content: userMessage }
      ]
    };

    // 3. Call Groq API using fetch
    const groqRes = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // 4. Handle Groq API response
    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error('Groq API error:', errorText);
      return res.status(groqRes.status).json({ error: 'Groq API error', details: errorText });
    }
    const data = await groqRes.json();
    const aiMessage = data.choices?.[0]?.message?.content;
    if (!aiMessage) {
      console.error('No AI response from Groq:', data);
      return res.status(502).json({ error: 'No AI response from Groq.' });
    }

    // 5. Return AI response to frontend
    res.json({ answer: aiMessage });
  } catch (err) {
    // 6. Handle unexpected errors
    console.error('Error in /api/chat:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
