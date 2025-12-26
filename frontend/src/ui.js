/**
 * UI Module
 * Handles all DOM manipulation, rendering, and user interface updates
 */

/**
 * Create a todo item element
 * @param {Object} todo - Todo object
 * @returns {HTMLElement} - The todo item element
 */
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  li.id = `todo-${todo.id}`;
  li.setAttribute('role', 'listitem');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.completed ? 'pending' : 'complete'}`);
  checkbox.dataset.id = todo.id;

  const textSpan = document.createElement('span');
  textSpan.className = 'todo-text';
  textSpan.textContent = todo.text;
  textSpan.setAttribute('title', todo.text);

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'todo-actions';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn-secondary btn-sm';
  editBtn.textContent = 'Edit';
  editBtn.setAttribute('aria-label', `Edit "${todo.text}"`);
  editBtn.dataset.id = todo.id;
  editBtn.dataset.action = 'edit';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn-danger btn-sm';
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('aria-label', `Delete "${todo.text}"`);
  deleteBtn.dataset.id = todo.id;
  deleteBtn.dataset.action = 'delete';

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(actionsDiv);

  return li;
}

/**
 * Render todos in the list
 * @param {Array} todos - Array of todo objects
 */
function renderTodoList(todos) {
  const todoList = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');

  // Clear current list
  todoList.innerHTML = '';

  if (!todos || todos.length === 0) {
    emptyState.style.display = 'block';
    todoList.appendChild(emptyState);
    return;
  }

  emptyState.style.display = 'none';

  // Render todos
  todos.forEach(todo => {
    const element = createTodoElement(todo);
    todoList.appendChild(element);
  });
}

/**
 * Update todo in DOM after state change
 * @param {string} id - Todo ID
 * @param {Object} updates - Updates to apply
 */
function updateTodoInDOM(id, updates) {
  const element = document.getElementById(`todo-${id}`);
  if (!element) return;

  // Update text if provided
  if (updates.text !== undefined) {
    const textSpan = element.querySelector('.todo-text');
    textSpan.textContent = updates.text;
    textSpan.setAttribute('title', updates.text);
  }

  // Update completed status if provided
  if (updates.completed !== undefined) {
    const checkbox = element.querySelector('.todo-checkbox');
    checkbox.checked = updates.completed;

    // Update visual state
    if (updates.completed) {
      element.classList.add('completed');
    } else {
      element.classList.remove('completed');
    }
  }
}

/**
 * Remove todo from DOM
 * @param {string} id - Todo ID
 */
function removeTodoFromDOM(id) {
  const element = document.getElementById(`todo-${id}`);
  if (element) {
    element.remove();
  }

  // Show empty state if no more todos
  const todoList = document.getElementById('todoList');
  if (todoList.children.length === 0) {
    const emptyState = document.getElementById('emptyState');
    emptyState.style.display = 'block';
    todoList.appendChild(emptyState);
  }
}

/**
 * Add a todo to DOM
 * @param {Object} todo - Todo object
 */
function addTodoToDOM(todo) {
  const todoList = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');

  // Remove empty state if visible
  if (emptyState.parentElement === todoList) {
    emptyState.remove();
  }

  // Create and add new element
  const element = createTodoElement(todo);
  todoList.appendChild(element);
}

/**
 * Clear form input
 */
function clearFormInput() {
  const input = document.getElementById('todoInput');
  if (input) {
    input.value = '';
    input.focus();
  }
}

/**
 * Get form input value
 * @returns {string} - Trimmed input value
 */
function getFormInput() {
  const input = document.getElementById('todoInput');
  return input ? input.value.trim() : '';
}

/**
 * Show error toast notification
 * @param {string} message - Error message
 * @param {number} duration - How long to show (ms), default 5000
 */
function showError(message, duration = 5000) {
  const toast = document.getElementById('errorToast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  // Auto-hide after duration
  const timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);

  // Allow click to dismiss
  toast.onclick = () => {
    clearTimeout(timeoutId);
    toast.classList.remove('show');
  };
}

/**
 * Update status counts
 * @param {number} pending - Pending count
 * @param {number} completed - Completed count
 */
function updateStatusCounts(pending, completed) {
  const pendingEl = document.getElementById('pendingCount');
  const completedEl = document.getElementById('completedCount');

  if (pendingEl) pendingEl.textContent = pending;
  if (completedEl) completedEl.textContent = completed;
}

/**
 * Set active filter button
 * @param {string} status - Filter status (all, pending, completed)
 */
function setActiveFilter(status) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    const isActive = btn.dataset.status === status;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}

/**
 * Show edit modal
 * @param {string} id - Todo ID
 * @param {string} text - Current todo text
 * @returns {Promise<Object>} - { cancelled: boolean, text?: string }
 */
function showEditModal(id, text) {
  return new Promise((resolve) => {
    const modal = document.getElementById('editModal');
    const input = document.getElementById('editInput');
    const form = document.getElementById('editForm');
    const cancelBtn = document.getElementById('editCancel');

    if (!modal || !input) {
      resolve({ cancelled: true });
      return;
    }

    // Set up modal
    input.value = text;
    input.focus();
    input.select();
    modal.classList.add('show');

    // Handle submit
    const handleSubmit = (e) => {
      e.preventDefault();
      const newText = input.value.trim();
      cleanup();
      resolve({ cancelled: false, text: newText });
    };

    // Handle cancel
    const handleCancel = () => {
      cleanup();
      resolve({ cancelled: true });
    };

    // Handle escape key
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    // Cleanup
    const cleanup = () => {
      form.removeEventListener('submit', handleSubmit);
      cancelBtn.removeEventListener('click', handleCancel);
      document.removeEventListener('keydown', handleKeydown);
      modal.classList.remove('show');
    };

    form.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    document.addEventListener('keydown', handleKeydown);
  });
}

/**
 * Show delete confirmation modal
 * @returns {Promise<boolean>} - true if confirmed, false if cancelled
 */
function showDeleteConfirmation() {
  return new Promise((resolve) => {
    const modal = document.getElementById('deleteModal');
    const confirmBtn = document.getElementById('deleteConfirm');
    const cancelBtn = document.getElementById('deleteCancel');

    if (!modal) {
      resolve(false);
      return;
    }

    modal.classList.add('show');

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    const cleanup = () => {
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);
      document.removeEventListener('keydown', handleKeydown);
      modal.classList.remove('show');
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    document.addEventListener('keydown', handleKeydown);
  });
}

/**
 * Get all visible todos from DOM
 * @returns {Array} - Array of todo IDs currently displayed
 */
function getVisibleTodos() {
  const items = document.querySelectorAll('.todo-item');
  return Array.from(items).map(item => item.id.replace('todo-', ''));
}

/**
 * Disable form while loading
 * @param {boolean} disabled - Whether to disable
 */
function setFormDisabled(disabled) {
  const form = document.getElementById('addForm');
  const input = document.getElementById('todoInput');
  const button = form?.querySelector('button[type="submit"]');

  if (input) input.disabled = disabled;
  if (button) button.disabled = disabled;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createTodoElement,
    renderTodoList,
    updateTodoInDOM,
    removeTodoFromDOM,
    addTodoToDOM,
    clearFormInput,
    getFormInput,
    showError,
    updateStatusCounts,
    setActiveFilter,
    showEditModal,
    showDeleteConfirmation,
    getVisibleTodos,
    setFormDisabled
  };
}
