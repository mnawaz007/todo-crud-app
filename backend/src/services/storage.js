const fs = require('fs');
const path = require('path');
const Todo = require('../models/todo');

/**
 * File-Based Storage Service
 * Handles reading and writing todos to JSON file
 */
class StorageService {
  constructor(filePath = path.join(__dirname, '../../data/todos.json')) {
    this.filePath = filePath;
    this.todos = [];
    this.ensureFileExists();
    this.load();
  }

  /**
   * Ensure data directory and file exist
   */
  ensureFileExists() {
    const dir = path.dirname(this.filePath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create file if it doesn't exist
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]', 'utf-8');
      console.log(`Created storage file: ${this.filePath}`);
    }
  }

  /**
   * Load todos from file into memory
   */
  load() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        console.warn('Storage file is not an array, initializing empty');
        this.todos = [];
        this.save();
        return;
      }

      // Convert plain objects to Todo instances
      this.todos = parsed.map(obj => {
        try {
          return Todo.fromJSON(obj);
        } catch (err) {
          console.warn(`Invalid todo object in storage, skipping:`, obj);
          return null;
        }
      }).filter(todo => todo !== null);

      console.log(`Loaded ${this.todos.length} todos from storage`);
    } catch (err) {
      console.error('Error loading todos from storage:', err.message);
      this.todos = [];
    }
  }

  /**
   * Save todos to file
   */
  save() {
    try {
      const data = JSON.stringify(this.todos.map(todo => todo.toJSON()), null, 2);
      fs.writeFileSync(this.filePath, data, 'utf-8');
    } catch (err) {
      console.error('Error saving todos to storage:', err.message);
      throw new Error('Failed to save todos');
    }
  }

  /**
   * Get all todos from memory
   * @returns {Todo[]} - Array of todos
   */
  getAll() {
    return this.todos;
  }

  /**
   * Get todo by ID
   * @param {string} id - Todo ID
   * @returns {Todo|null} - Todo or null if not found
   */
  getById(id) {
    return this.todos.find(todo => todo.id === id) || null;
  }

  /**
   * Add a new todo
   * @param {Todo} todo - Todo instance to add
   * @returns {Todo} - Added todo
   */
  add(todo) {
    if (!todo || !todo.id) {
      throw new Error('Invalid todo object');
    }

    // Check for duplicate ID
    if (this.todos.some(t => t.id === todo.id)) {
      throw new Error('Todo with this ID already exists');
    }

    this.todos.push(todo);
    this.save();
    return todo;
  }

  /**
   * Update a todo
   * @param {string} id - Todo ID
   * @param {Object} updates - Updates to apply (text, completed)
   * @returns {Todo|null} - Updated todo or null if not found
   */
  update(id, updates) {
    const todo = this.getById(id);

    if (!todo) {
      return null;
    }

    // Update text if provided
    if (updates.text !== undefined) {
      todo.updateText(updates.text);
    }

    // Update completed if provided
    if (updates.completed !== undefined) {
      todo.setCompleted(updates.completed);
    }

    this.save();
    return todo;
  }

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {boolean} - True if deleted, false if not found
   */
  delete(id) {
    const index = this.todos.findIndex(todo => todo.id === id);

    if (index === -1) {
      return false;
    }

    this.todos.splice(index, 1);
    this.save();
    return true;
  }

  /**
   * Get todos filtered by status
   * @param {string} status - 'pending', 'completed', or 'all'
   * @returns {Todo[]} - Filtered todos
   */
  getByStatus(status = 'all') {
    if (status === 'pending') {
      return this.todos.filter(todo => !todo.completed);
    }

    if (status === 'completed') {
      return this.todos.filter(todo => todo.completed);
    }

    return this.todos;
  }

  /**
   * Clear all todos (dangerous - use with caution)
   * @returns {number} - Number of todos deleted
   */
  clear() {
    const count = this.todos.length;
    this.todos = [];
    this.save();
    return count;
  }
}

module.exports = StorageService;
