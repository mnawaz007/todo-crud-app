const { v4: uuidv4 } = require('uuid');

/**
 * Todo Model
 * Represents a single task item with validation and entity logic
 */
class Todo {
  constructor(text, id = null, completed = false, createdAt = null, updatedAt = null) {
    this.id = id || uuidv4();
    this.text = this.validateAndTrimText(text);
    this.completed = Boolean(completed);
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  /**
   * Validate and trim todo text
   * @param {string} text - The todo text
   * @returns {string} - Trimmed text
   * @throws {Error} - If text is empty or invalid
   */
  validateAndTrimText(text) {
    if (typeof text !== 'string') {
      throw new Error('Text must be a string');
    }

    const trimmed = text.trim();

    if (trimmed.length === 0) {
      throw new Error('Text is required and cannot be empty');
    }

    if (trimmed.length > 500) {
      throw new Error('Text cannot exceed 500 characters');
    }

    return trimmed;
  }

  /**
   * Update todo text
   * @param {string} newText - New text value
   */
  updateText(newText) {
    this.text = this.validateAndTrimText(newText);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Toggle completion status
   * @param {boolean} completed - New completion status
   */
  setCompleted(completed) {
    this.completed = Boolean(completed);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert to plain object (for JSON serialization)
   * @returns {Object} - Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create Todo from plain object
   * @param {Object} obj - Plain object with todo properties
   * @returns {Todo} - Todo instance
   */
  static fromJSON(obj) {
    return new Todo(obj.text, obj.id, obj.completed, obj.createdAt, obj.updatedAt);
  }

  /**
   * Validate a todo object
   * @param {Object} obj - Object to validate
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  static validate(obj) {
    const errors = [];

    if (!obj) {
      errors.push('Todo object is required');
      return { valid: false, errors };
    }

    if (!obj.id || typeof obj.id !== 'string') {
      errors.push('Todo must have a valid id');
    }

    if (!obj.text || typeof obj.text !== 'string' || obj.text.trim().length === 0) {
      errors.push('Todo must have non-empty text');
    }

    if (obj.text && obj.text.length > 500) {
      errors.push('Text cannot exceed 500 characters');
    }

    if (typeof obj.completed !== 'boolean') {
      errors.push('Completed must be a boolean');
    }

    if (!obj.createdAt || isNaN(Date.parse(obj.createdAt))) {
      errors.push('Todo must have a valid createdAt timestamp');
    }

    if (!obj.updatedAt || isNaN(Date.parse(obj.updatedAt))) {
      errors.push('Todo must have a valid updatedAt timestamp');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = Todo;
