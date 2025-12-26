/**
 * Todo App
 * Main application logic and orchestration
 * Coordinates between API, storage, and UI
 */

// Global state
let currentFilter = 'all';
let allTodos = [];
let isLoading = false;

/**
 * Initialize the application
 */
async function initApp() {
  console.log('Initializing Todo App...');

  // Check if API is available
  const healthOk = await apiClient.checkHealth();
  if (!healthOk) {
    console.warn('API not available, using cached todos');
  }

  // Load todos from API or cache
  await loadTodos();

  // Attach event listeners
  attachEventListeners();

  console.log('App initialized. Ready for user interaction.');
}

/**
 * Load todos from API and cache
 */
async function loadTodos() {
  try {
    isLoading = true;

    // Try to load from API
    const result = await apiClient.getTodos(currentFilter);

    if (result.success) {
      allTodos = result.data || [];

      // Cache in localStorage
      storageModule.saveAll(allTodos);
    } else {
      // Fall back to cached todos
      console.warn('Failed to load from API, using cache:', result.error);
      allTodos = storageModule.getAll();
    }

    // Render the todos
    renderFilteredTodos();
    updateStats();
  } catch (err) {
    console.error('Error loading todos:', err);
    showError('Failed to load todos. Using cached data.');

    // Fall back to cache
    allTodos = storageModule.getAll();
    renderFilteredTodos();
    updateStats();
  } finally {
    isLoading = false;
  }
}

/**
 * Render todos based on current filter
 */
function renderFilteredTodos() {
  const filtered = allTodos.filter(todo => {
    if (currentFilter === 'pending') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  renderTodoList(filtered);
}

/**
 * Update status counts
 */
function updateStats() {
  const pending = allTodos.filter(t => !t.completed).length;
  const completed = allTodos.filter(t => t.completed).length;

  updateStatusCounts(pending, completed);
}

/**
 * Create a new todo
 */
async function createTodo(text) {
  if (!text || text.trim().length === 0) {
    showError('Please enter a todo text');
    return;
  }

  if (text.length > 500) {
    showError('Todo text cannot exceed 500 characters');
    return;
  }

  try {
    setFormDisabled(true);

    // Create via API
    const result = await apiClient.createTodo(text);

    if (result.success) {
      // Add to local list
      allTodos.push(result.data);

      // Cache
      storageModule.add(result.data);

      // Clear form and re-render
      clearFormInput();
      renderFilteredTodos();
      updateStats();

      console.log('Todo created:', result.data.id);
    } else {
      showError(result.error || 'Failed to create todo');
    }
  } catch (err) {
    console.error('Error creating todo:', err);
    showError('Failed to create todo: ' + err.message);
  } finally {
    setFormDisabled(false);
  }
}

/**
 * Toggle todo completion status
 */
async function toggleTodo(id) {
  const todo = allTodos.find(t => t.id === id);
  if (!todo) return;

  const newStatus = !todo.completed;

  try {
    // Update via API
    const result = await apiClient.updateTodo(id, { completed: newStatus });

    if (result.success) {
      // Update local state
      todo.completed = newStatus;

      // Cache
      storageModule.update(id, { completed: newStatus });

      // Update DOM
      updateTodoInDOM(id, { completed: newStatus });
      updateStats();

      console.log(`Todo ${id} marked as ${newStatus ? 'complete' : 'pending'}`);
    } else {
      showError(result.error || 'Failed to update todo');
      // Revert checkbox in UI
      updateTodoInDOM(id, { completed: !newStatus });
    }
  } catch (err) {
    console.error('Error toggling todo:', err);
    showError('Failed to update todo: ' + err.message);
    // Revert checkbox in UI
    updateTodoInDOM(id, { completed: !newStatus });
  }
}

/**
 * Delete a todo
 */
async function deleteTodo(id) {
  try {
    // Delete via API
    const result = await apiClient.deleteTodo(id);

    if (result.success) {
      // Remove from local state
      allTodos = allTodos.filter(t => t.id !== id);

      // Cache
      storageModule.delete(id);

      // Remove from DOM
      removeTodoFromDOM(id);
      updateStats();

      console.log('Todo deleted:', id);
    } else {
      showError(result.error || 'Failed to delete todo');
    }
  } catch (err) {
    console.error('Error deleting todo:', err);
    showError('Failed to delete todo: ' + err.message);
  }
}

/**
 * Attach event listeners to DOM elements
 */
function attachEventListeners() {
  // Form submission
  const form = document.getElementById('addForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = getFormInput();
      createTodo(text);
    });
  }

  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.status;
      setActiveFilter(currentFilter);
      renderFilteredTodos();
    });
  });

  // Todo list delegated event listeners
  const todoList = document.getElementById('todoList');
  if (todoList) {
    // Checkbox change
    todoList.addEventListener('change', (e) => {
      if (e.target.classList.contains('todo-checkbox')) {
        const id = e.target.dataset.id;
        toggleTodo(id);
      }
    });

    // Edit button click
    todoList.addEventListener('click', async (e) => {
      if (e.target.dataset.action === 'edit') {
        const id = e.target.dataset.id;
        const todo = allTodos.find(t => t.id === id);
        if (todo) {
          const result = await showEditModal(id, todo.text);
          if (!result.cancelled && result.text && result.text !== todo.text) {
            await updateTodoText(id, result.text);
          }
        }
      }
    });

    // Delete button click
    todoList.addEventListener('click', async (e) => {
      if (e.target.dataset.action === 'delete') {
        const confirmed = await showDeleteConfirmation();
        if (confirmed) {
          const id = e.target.dataset.id;
          await deleteTodo(id);
        }
      }
    });
  }
}

/**
 * Update todo text
 */
async function updateTodoText(id, newText) {
  if (!newText || newText.trim().length === 0) {
    showError('Todo text cannot be empty');
    return;
  }

  if (newText.length > 500) {
    showError('Todo text cannot exceed 500 characters');
    return;
  }

  try {
    // Update via API
    const result = await apiClient.updateTodo(id, { text: newText });

    if (result.success) {
      // Update local state
      const todo = allTodos.find(t => t.id === id);
      if (todo) {
        todo.text = newText;
      }

      // Cache
      storageModule.update(id, { text: newText });

      // Update DOM
      updateTodoInDOM(id, { text: newText });

      console.log('Todo text updated:', id);
    } else {
      showError(result.error || 'Failed to update todo');
    }
  } catch (err) {
    console.error('Error updating todo:', err);
    showError('Failed to update todo: ' + err.message);
  }
}

/**
 * Handle page visibility changes (sync when tab becomes visible)
 */
function setupPageVisibilityListener() {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('Page became visible, syncing todos...');
      loadTodos();
    }
  });
}

/**
 * Handle offline/online events
 */
function setupNetworkListeners() {
  window.addEventListener('offline', () => {
    console.warn('Connection lost');
    showError('You are offline. Changes will be cached locally.', 3000);
  });

  window.addEventListener('online', () => {
    console.log('Connection restored');
    showError('Back online! Syncing...', 2000);
    loadTodos();
  });
}

/**
 * Check if page is ready before initializing
 */
function waitForDOM() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

/**
 * Main entry point
 */
(async () => {
  try {
    // Wait for DOM to be ready
    await waitForDOM();

    // Setup event listeners
    setupPageVisibilityListener();
    setupNetworkListeners();

    // Initialize app
    await initApp();
  } catch (err) {
    console.error('Failed to initialize app:', err);
    showError('Failed to initialize app. Please refresh the page.');
  }
})();
