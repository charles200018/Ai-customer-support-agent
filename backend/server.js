// backend/server.js
// Main Express server setup for AI Customer Support Agent

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import documentRoutes from './routes/documents.js';
import uploadRoutes from './routes/upload.js';
import chatHistoryRoutes from './routes/chatHistory.js';

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend API is running' });
});

// Register all API routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat-history', chatHistoryRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// 404 handler – must be after all routes and app.listen
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler – must be last and have 4 params
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
