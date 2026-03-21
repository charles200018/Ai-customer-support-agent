// Set a dummy GROQ_API_KEY for tests
process.env.GROQ_API_KEY = 'test-key';

// backend/__tests__/chat.e2e.test.js
// E2E tests for /api/chat endpoint using Jest and supertest (CommonJS version)

const request = require('supertest');
const express = require('express');
const chatRoutes = require('../routes/chat.js');
const fetch = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());

// Create an Express app instance for testing
const app = express();
app.use(express.json());
app.use('/api', chatRoutes);

describe('/api/chat endpoint E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return AI response for valid userMessage', async () => {
    // Mock Groq API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Mocked AI reply' } }]
      })
    });


    const payload = { userMessage: 'Hello from E2E test!', documentId: 'test-doc-1' };
    const res = await request(app)
      .post('/api/chat')
      .send(payload)
      .set('Content-Type', 'application/json');

    // Log request/response for debugging
    console.log('Request:', payload);
    console.log('Response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('answer', 'Mocked AI reply');
  });

  it('should return 400 if userMessage is missing', async () => {

    const res = await request(app)
      .post('/api/chat')
      .send({})
      .set('Content-Type', 'application/json');

    console.log('Request: {}');
    console.log('Response:', res.body);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 500 if Groq API fails', async () => {
    // Simulate Groq API failure
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Groq API error'
    });


    const payload = { userMessage: 'Trigger API failure', documentId: 'test-doc-2' };
    const res = await request(app)
      .post('/api/chat')
      .send(payload)
      .set('Content-Type', 'application/json');

    console.log('Request:', payload);
    console.log('Response:', res.body);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Groq API error');
  });
});
