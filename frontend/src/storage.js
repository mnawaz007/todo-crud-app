/**
 * Frontend Storage Module
 * Manages localStorage for offline caching and performance
 * Syncs with API when available
 */

const STORAGE_KEY = 'todo_app_todos';
const SYNC_PENDING_KEY = 'todo_app_sync_pending';

/**
 * Storage Module
 */
const storageModule = {
  /**
   * Get all cached todos from localStorage
   * @returns {Array} - Array of todo objects or empty array
   */
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('Error reading from localStorage:', err);
      return [];
    }
  },

  /**
   * Get a single todo from cache
   * @param {string} id - Todo ID
   * @returns {Object|null} - Todo object or null
   */
  getById(id) {
    const todos = this.getAll();
    return todos.find(t => t.id === id) || null;
  },

  /**
   * Save all todos to localStorage
   * @param {Array} todos - Array of todo objects
   */
  saveAll(todos) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
      console.error('Error writing to localStorage:', err);
      if (err.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
      }
    }
  },

  /**
   * Add a todo to cache
   * @param {Object} todo - Todo object
   */
  add(todo) {
    const todos = this.getAll();
    todos.push(todo);
    this.saveAll(todos);
  },

  /**
   * Update a todo in cache
   * @param {string} id - Todo ID
   * @param {Object} updates - Updates to apply
   */
  update(id, updates) {
    const todos = this.getAll();
    const todo = todos.find(t => t.id === id);

    if (todo) {
      Object.assign(todo, updates);
      this.saveAll(todos);
    }
  },

  /**
   * Delete a todo from cache
   * @param {string} id - Todo ID
   */
  delete(id) {
    const todos = this.getAll();
    const filtered = todos.filter(t => t.id !== id);
    this.saveAll(filtered);
  },

  /**
   * Clear all cached todos
   */
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
  },

  /**
   * Get todos filtered by status
   * @param {string} status - 'pending', 'completed', or 'all'
   * @returns {Array} - Filtered todos
   */
  getByStatus(status = 'all') {
    const todos = this.getAll();

    if (status === 'pending') {
      return todos.filter(t => !t.completed);
    }

    if (status === 'completed') {
      return todos.filter(t => t.completed);
    }

    return todos;
  },

  /**
   * Get statistics about cached todos
   * @returns {Object} - { total, pending, completed }
   */
  getStats() {
    const todos = this.getAll();
    const pending = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;

    return {
      total: todos.length,
      pending,
      completed
    };
  },

  /**
   * Track pending sync operations (for offline support)
   * @param {string} operation - 'create', 'update', 'delete'
   * @param {Object} data - Operation data
   */
  addPendingSync(operation, data) {
    try {
      let pending = this.getPendingSync();
      pending.push({
        id: Math.random().toString(36).substr(2, 9),
        operation,
        data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(SYNC_PENDING_KEY, JSON.stringify(pending));
    } catch (err) {
      console.error('Error adding pending sync:', err);
    }
  },

  /**
   * Get pending sync operations
   * @returns {Array} - Array of pending operations
   */
  getPendingSync() {
    try {
      const data = localStorage.getItem(SYNC_PENDING_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('Error reading pending sync:', err);
      return [];
    }
  },

  /**
   * Clear pending sync operations
   */
  clearPendingSync() {
    try {
      localStorage.removeItem(SYNC_PENDING_KEY);
    } catch (err) {
      console.error('Error clearing pending sync:', err);
    }
  },

  /**
   * Check if localStorage is available
   * @returns {boolean} - true if localStorage works
   */
  isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (err) {
      return false;
    }
  }
};

// Expose storage module globally
if (typeof window !== 'undefined') {
  window.storageModule = storageModule;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = storageModule;
}
