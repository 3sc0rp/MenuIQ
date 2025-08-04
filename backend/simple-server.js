const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is working!' });
});

const port = 3005;

console.log('Starting server...');

const server = app.listen(port, '127.0.0.1', (err) => {
  if (err) {
    console.error('Error starting server:', err);
    return;
  }
  console.log(`Simple server running on port ${port}`);
});

server.on('listening', () => {
  console.log(`Server is actually listening on port ${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 