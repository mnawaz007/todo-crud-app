const express = require('express');
const TodoService = require('../services/todoService');
const {
  asyncHandler,
  validationError,
  notFoundError
} = require('./middleware');

const router = express.Router();
const todoService = new TodoService();

/**
 * POST /api/todos
 * Create a new todo
 */
router.post('/todos', asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  // Validate input
  if (!text) {
    return next(validationError('Text is required'));
  }

  if (typeof text !== 'string') {
    return next(validationError('Text must be a string'));
  }

  // Create todo
  const result = todoService.create(text);

  if (!result.success) {
    return next(validationError(result.error));
  }

  // Return created todo with 201 status
  res.status(201).json({
    data: result.data,
    status: 201
  });
}));

/**
 * GET /api/todos
 * Get all todos with optional status filter
 * Query params: status=pending|completed|all (default: all)
 */
router.get('/todos', asyncHandler(async (req, res, next) => {
  const status = req.query.status || 'all';

  // Get todos
  const result = todoService.getAll(status);

  if (!result.success) {
    return next(validationError(result.error));
  }

  res.status(200).json({
    data: result.data,
    status: 200
  });
}));

/**
 * GET /api/todos/:id
 * Get a single todo by ID
 */
router.get('/todos/:id', asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Get todo
  const result = todoService.getById(id);

  if (!result.success) {
    return next(notFoundError(result.error));
  }

  res.status(200).json({
    data: result.data,
    status: 200
  });
}));

/**
 * PATCH /api/todos/:id
 * Update a todo (text and/or completed status)
 * Body: { text?: string, completed?: boolean }
 */
router.patch('/todos/:id', asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  // Validate that at least one update is provided
  if (text === undefined && completed === undefined) {
    return next(validationError('At least one of text or completed must be provided'));
  }

  // Create updates object
  const updates = {};
  if (text !== undefined) updates.text = text;
  if (completed !== undefined) updates.completed = completed;

  // Update todo
  const result = todoService.update(id, updates);

  if (!result.success) {
    if (result.error === 'Todo not found') {
      return next(notFoundError(result.error));
    }
    return next(validationError(result.error));
  }

  res.status(200).json({
    data: result.data,
    status: 200
  });
}));

/**
 * DELETE /api/todos/:id
 * Delete a todo
 */
router.delete('/todos/:id', asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Delete todo
  const result = todoService.delete(id);

  if (!result.success) {
    return next(notFoundError(result.error));
  }

  // Return 204 No Content for successful delete
  res.status(204).send();
}));

/**
 * GET /api/stats
 * Get todo statistics (total, pending, completed counts)
 */
router.get('/stats', asyncHandler(async (req, res, next) => {
  const stats = todoService.getStats();

  res.status(200).json({
    data: stats,
    status: 200
  });
}));

module.exports = router;
