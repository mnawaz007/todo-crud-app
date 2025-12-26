/**
 * API Client
 * Wrapper around fetch API for todo CRUD operations
 * Handles JSON serialization, error parsing, and response normalization
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Parse API response and throw on errors
 */
async function parseResponse(response) {
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  // 204 No Content (successful delete)
  if (response.status === 204) {
    return { success: true, data: null };
  }

  // 2xx success
  if (response.ok) {
    return { success: true, data: data?.data || data };
  }

  // Error response
  const error = data?.error || 'Request failed';
  const code = data?.code || 'ERROR';

  const err = new Error(error);
  err.status = response.status;
  err.code = code;
  err.response = data;

  throw err;
}

/**
 * Make a fetch request with error handling
 */
async function request(method, path, body = null) {
  const url = `${API_BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    return await parseResponse(response);
  } catch (err) {
    if (err instanceof TypeError) {
      // Network error
      throw new Error('Network error: Unable to reach server');
    }
    throw err;
  }
}

/**
 * API Client Object
 */
const apiClient = {
  /**
   * Create a new todo
   * @param {string} text - Todo text
   * @returns {Promise<Object>} - { success, data: Todo, error }
   */
  async createTodo(text) {
    try {
      const result = await request('POST', '/api/todos', { text });
      return result;
    } catch (err) {
      return { success: false, data: null, error: err.message };
    }
  },

  /**
   * Get all todos
   * @param {string} status - 'pending', 'completed', or 'all' (default: 'all')
   * @returns {Promise<Object>} - { success, data: Todo[], error }
   */
  async getTodos(status = 'all') {
    try {
      let path = '/api/todos';
      if (status && status !== 'all') {
        path += `?status=${status}`;
      }
      const result = await request('GET', path);
      return result;
    } catch (err) {
      return { success: false, data: null, error: err.message };
    }
  },

  /**
   * Get a single todo
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} - { success, data: Todo, error }
   */
  async getTodo(id) {
    try {
      const result = await request('GET', `/api/todos/${id}`);
      return result;
    } catch (err) {
      return { success: false, data: null, error: err.message };
    }
  },

  /**
   * Update a todo
   * @param {string} id - Todo ID
   * @param {Object} updates - { text?, completed? }
   * @returns {Promise<Object>} - { success, data: Todo, error }
   */
  async updateTodo(id, updates) {
    try {
      const result = await request('PATCH', `/api/todos/${id}`, updates);
      return result;
    } catch (err) {
      return { success: false, data: null, error: err.message };
    }
  },

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} - { success, error }
   */
  async deleteTodo(id) {
    try {
      const result = await request('DELETE', `/api/todos/${id}`);
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Check API health
   * @returns {Promise<boolean>} - true if API is healthy
   */
  async checkHealth() {
    try {
      const result = await request('GET', '/api/health');
      return result.success;
    } catch (err) {
      return false;
    }
  }
};

// Expose API client globally
if (typeof window !== 'undefined') {
  window.apiClient = apiClient;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = apiClient;
}
