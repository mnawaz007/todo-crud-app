const express = require('express');
const cors = require('cors');
const path = require('path');
const { requestLogger, errorHandler, validateJSON } = require('./api/middleware');
const todoRoutes = require('./api/routes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - order matters!
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(validateJSON);
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api', todoRoutes);

// 404 Not Found handler (must be before error handler)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND',
    status: 404
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Todo API server listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Endpoints: POST/GET /api/todos, PATCH/DELETE /api/todos/:id`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
