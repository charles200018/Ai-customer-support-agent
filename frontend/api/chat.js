// Vercel Serverless Function: /api/chat
// Handles POST requests for AI chat completions

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    // 1. Extract user message and documentId from request body
    const { userMessage, documentId } = req.body;
    if (!userMessage || !documentId) {
      res.status(400).json({ error: 'Missing userMessage or documentId' });
      return;
    }

    // 2. Prepare Groq API request
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      res.status(500).json({ error: 'GROQ_API_KEY not set in environment.' });
      return;
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

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      res.status(groqRes.status).json({ error: 'Groq API error', details: errorText });
      return;
    }
    const data = await groqRes.json();
    const aiMessage = data.choices?.[0]?.message?.content;
    if (!aiMessage) {
      res.status(502).json({ error: 'No AI response from Groq.' });
      return;
    }
    res.json({ answer: aiMessage });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
}
