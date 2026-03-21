dotenv.config();
// backend/server.js
// Main Express server setup for AI Customer Support Agent

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const chatRoutes = require('./routes/chat.js');

// Debug: Confirm chatRoutes is loaded
console.log('chatRoutes loaded:', typeof chatRoutes);

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins (customize as needed)
app.use(cors());

// Register /api/chat route
app.use('/api', chatRoutes);

// Debug: Print all registered routes after mounting chatRoutes
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log('Route:', layer.route.path);
  } else if (layer.name === 'router') {
    console.log('Router mounted');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
