// Minimal OpenRouter API test script
import fetch from 'node-fetch';

async function testOpenRouter() {
  const apiKey = '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';
  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const body = {
    model: 'openai/gpt-3.5-turbo',
    messages: [
      { role: 'user', content: 'Hello from minimal script' }
    ]
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testOpenRouter();
