const express = require('express');
const cors = require('cors');

const app = express();
const port = 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working!',
    data: { test: true }
  });
});

// Start server
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`🚀 Test server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${port}/api/test`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.on('listening', () => {
  console.log(`✅ Server is listening on http://127.0.0.1:${port}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 