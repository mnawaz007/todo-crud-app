const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes placeholder - will be implemented in Phase 2
// app.use('/api', require('./api/routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  const status = err.status || 500;
  const code = err.code || 'SERVER_ERROR';
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message,
    code: code,
    status: status
  });
});

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND',
    status: 404
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Todo API server listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
