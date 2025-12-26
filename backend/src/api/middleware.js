/**
 * API Middleware
 * Centralized middleware for error handling, logging, and request processing
 */

/**
 * Request logging middleware
 * Logs all incoming requests with method, path, and timestamp
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // Log response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`);
  });

  next();
};

/**
 * Error handling middleware
 * Catches and formats errors with consistent response structure
 * MUST be used as app.use(errorHandler) after all other routes/middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default error status and code
  let status = err.status || err.statusCode || 500;
  let code = err.code || 'SERVER_ERROR';
  let message = err.message || 'Internal server error';

  // Validate status code
  if (status < 400 || status >= 600) {
    status = 500;
  }

  // Log error
  console.error(`[ERROR] ${code} (${status}): ${message}`);
  if (err.stack && status === 500) {
    console.error(err.stack);
  }

  // Never expose internal error details in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Internal server error';
  }

  // Send error response
  res.status(status).json({
    error: message,
    code: code,
    status: status
  });
};

/**
 * Validation error helper
 * Creates a standardized validation error
 */
const validationError = (message) => {
  const err = new Error(message);
  err.status = 400;
  err.code = 'VALIDATION_ERROR';
  return err;
};

/**
 * Not found error helper
 * Creates a standardized not found error
 */
const notFoundError = (message = 'Resource not found') => {
  const err = new Error(message);
  err.status = 404;
  err.code = 'NOT_FOUND';
  return err;
};

/**
 * Server error helper
 * Creates a standardized server error
 */
const serverError = (message = 'Internal server error') => {
  const err = new Error(message);
  err.status = 500;
  err.code = 'SERVER_ERROR';
  return err;
};

/**
 * Async route wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Request validation middleware
 * Validates request has JSON content-type when needed
 */
const validateJSON = (req, res, next) => {
  if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
    if (req.get('content-type') && !req.get('content-type').includes('application/json')) {
      return next(validationError('Content-Type must be application/json'));
    }
  }
  next();
};

module.exports = {
  requestLogger,
  errorHandler,
  validationError,
  notFoundError,
  serverError,
  asyncHandler,
  validateJSON
};
