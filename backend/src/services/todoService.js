const Todo = require('../models/todo');
const StorageService = require('./storage');

/**
 * TodoService
 * Business logic layer for todo CRUD operations
 * Coordinates between API layer and storage layer
 */
class TodoService {
  constructor(storage = null) {
    this.storage = storage || new StorageService();
  }

  /**
   * Create a new todo
   * @param {string} text - Todo text
   * @returns {Object} - { success: boolean, data: Todo | null, error: string | null }
   */
  create(text) {
    try {
      // Validate input
      if (!text || typeof text !== 'string') {
        return {
          success: false,
          data: null,
          error: 'Text is required and must be a string'
        };
      }

      // Create todo (validates text internally)
      const todo = new Todo(text);

      // Add to storage
      this.storage.add(todo);

      return {
        success: true,
        data: todo,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        data: null,
        error: err.message
      };
    }
  }

  /**
   * Get all todos or filtered by status
   * @param {string} status - 'pending', 'completed', or 'all' (default: 'all')
   * @returns {Object} - { success: boolean, data: Todo[], error: string | null }
   */
  getAll(status = 'all') {
    try {
      const validStatuses = ['pending', 'completed', 'all'];

      if (!validStatuses.includes(status)) {
        return {
          success: false,
          data: null,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        };
      }

      const todos = this.storage.getByStatus(status);

      return {
        success: true,
        data: todos,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        data: null,
        error: err.message
      };
    }
  }

  /**
   * Get a single todo by ID
   * @param {string} id - Todo ID
   * @returns {Object} - { success: boolean, data: Todo | null, error: string | null }
   */
  getById(id) {
    try {
      if (!id || typeof id !== 'string') {
        return {
          success: false,
          data: null,
          error: 'Valid todo ID is required'
        };
      }

      const todo = this.storage.getById(id);

      if (!todo) {
        return {
          success: false,
          data: null,
          error: 'Todo not found'
        };
      }

      return {
        success: true,
        data: todo,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        data: null,
        error: err.message
      };
    }
  }

  /**
   * Update a todo's text and/or completed status
   * @param {string} id - Todo ID
   * @param {Object} updates - { text?: string, completed?: boolean }
   * @returns {Object} - { success: boolean, data: Todo | null, error: string | null }
   */
  update(id, updates) {
    try {
      if (!id || typeof id !== 'string') {
        return {
          success: false,
          data: null,
          error: 'Valid todo ID is required'
        };
      }

      if (!updates || typeof updates !== 'object') {
        return {
          success: false,
          data: null,
          error: 'Updates object is required'
        };
      }

      // Check if todo exists
      const existing = this.storage.getById(id);
      if (!existing) {
        return {
          success: false,
          data: null,
          error: 'Todo not found'
        };
      }

      // Validate updates
      if (updates.text !== undefined && typeof updates.text !== 'string') {
        return {
          success: false,
          data: null,
          error: 'Text must be a string'
        };
      }

      if (updates.completed !== undefined && typeof updates.completed !== 'boolean') {
        return {
          success: false,
          data: null,
          error: 'Completed must be a boolean'
        };
      }

      // Apply updates
      const updated = this.storage.update(id, updates);

      return {
        success: true,
        data: updated,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        data: null,
        error: err.message
      };
    }
  }

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {Object} - { success: boolean, data: null, error: string | null }
   */
  delete(id) {
    try {
      if (!id || typeof id !== 'string') {
        return {
          success: false,
          error: 'Valid todo ID is required'
        };
      }

      const deleted = this.storage.delete(id);

      if (!deleted) {
        return {
          success: false,
          error: 'Todo not found'
        };
      }

      return {
        success: true,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Get statistics about todos
   * @returns {Object} - { total, pending, completed }
   */
  getStats() {
    const all = this.storage.getAll();
    const pending = all.filter(t => !t.completed).length;
    const completed = all.filter(t => t.completed).length;

    return {
      total: all.length,
      pending,
      completed
    };
  }
}

module.exports = TodoService;
