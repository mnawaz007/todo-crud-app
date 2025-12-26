# Quick Start Guide: Simple Todo CRUD Application

**Feature**: Simple Todo CRUD Application
**Created**: 2025-12-27
**Audience**: Developers implementing frontend and backend

## Overview

This quick start guide describes the minimal setup to get the todo application running locally. Both backend and frontend run together to support the full user experience.

## Prerequisites

- Node.js 18+ (backend)
- Modern browser (frontend): Chrome, Firefox, Safari, Edge (2021+)
- Git

## Backend Setup (Express.js + File Storage)

### 1. Initialize Backend Project

```bash
mkdir backend
cd backend
npm init -y
npm install express cors uuid
```

### 2. Create Backend Structure

```
backend/
├── src/
│   ├── app.js
│   ├── models/
│   │   └── todo.js
│   ├── services/
│   │   └── todoService.js
│   ├── api/
│   │   ├── routes.js
│   │   └── middleware.js
├── data/
│   └── todos.json
├── tests/
│   ├── unit/
│   │   └── models.test.js
│   └── integration/
│       └── api.test.js
├── package.json
└── README.md
```

### 3. Core Backend Responsibilities

**`src/models/todo.js`** — Todo entity and validation
```javascript
// Validate todo creation/update
// Ensure text is non-empty, id is unique
// Generate timestamps
```

**`src/services/todoService.js`** — CRUD business logic
```javascript
// Create: generate id, validate text, add to array, sync to file
// Read: return all or filtered todos
// Update: modify text or completed status, update updatedAt
// Delete: remove from array, sync to file
```

**`src/api/routes.js`** — Express route handlers
```javascript
// POST /api/todos → Create
// GET /api/todos?status=pending|completed|all → Read with filter
// GET /api/todos/:id → Get single
// PATCH /api/todos/:id → Update
// DELETE /api/todos/:id → Delete
// GET /api/health → Health check
```

**`src/api/middleware.js`** — Error handling and logging
```javascript
// Global error handler
// Request logging
// CORS middleware
// JSON parsing
```

### 4. Run Backend

```bash
node src/app.js
# Server should start on http://localhost:3000
# Test: curl http://localhost:3000/api/health
```

## Frontend Setup (Vanilla HTML/CSS/JavaScript)

### 1. Create Frontend Project

```
frontend/
├── src/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── api-client.js
│   ├── ui.js
│   └── storage.js
├── public/
└── README.md
```

### 2. HTML Structure (Single Page)

**`src/index.html`** — Main page
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>My Todos</h1>

    <!-- Add Todo Form -->
    <form id="addForm" class="add-form">
      <input type="text" id="todoInput" placeholder="Add a new todo..." required>
      <button type="submit">Add</button>
    </form>

    <!-- Filter Options -->
    <div class="filters">
      <button class="filter-btn active" data-status="all">All</button>
      <button class="filter-btn" data-status="pending">Pending</button>
      <button class="filter-btn" data-status="completed">Completed</button>
    </div>

    <!-- Todo List -->
    <div id="todoList" class="todo-list"></div>

    <!-- Status Bar -->
    <div class="status-bar">
      <span id="pendingCount">0</span> pending |
      <span id="completedCount">0</span> completed
    </div>

    <!-- Error Toast -->
    <div id="errorToast" class="error-toast"></div>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

### 3. Frontend Modules

**`src/api-client.js`** — API fetch wrapper
```javascript
// Wrapper around fetch() for CRUD operations
// Handles JSON serialization/deserialization
// Error response parsing
```

**`src/ui.js`** — DOM manipulation and rendering
```javascript
// Render todo items from data
// Add event listeners (edit, delete, complete, filter)
// Update UI on state changes
// Show/hide error messages
```

**`src/storage.js`** — localStorage management
```javascript
// Cache todos in browser localStorage
// Sync with API on mutations
// Fallback if API unavailable
```

**`src/app.js`** — Main app logic
```javascript
// Initialize: load todos from API
// Handle user interactions
// Dispatch API calls
// Update UI after responses
// Show errors to user
```

### 4. CSS Responsive Layout

**`src/styles.css`** — Responsive design
```css
/* Container: centered, max-width */
/* Form: flex layout, responsive */
/* Todo items: hover effects, strikethrough for completed */
/* Filters: button group */
/* Mobile: <640px - stack vertically */
/* Desktop: >1024px - side-by-side layout */
/* Accessibility: focus states, contrast */
```

### 5. Run Frontend

```bash
cd frontend
# Serve static files (e.g., with Python)
python -m http.server 8000
# Or use any static server
# Open http://localhost:8000
```

## User Flows (Key Interactions)

### Create Todo
1. User types text in input field
2. User clicks "Add" button
3. Frontend validates (non-empty) → shows error if empty
4. Frontend POSTs to `/api/todos` with text
5. Backend creates todo, returns full object
6. Frontend appends to DOM list (no page reload)
7. Input field cleared, cursor focused
8. Status counts updated

### Read Todos (Initial Load)
1. Page loads
2. Frontend calls `GET /api/todos?status=all`
3. Backend returns array of all todos
4. Frontend renders list
5. Status counts updated
6. Filter buttons active/inactive

### Update Todo (Edit Text)
1. User clicks "Edit" button on todo item
2. Frontend shows inline edit or modal with current text
3. User edits text, clicks "Save"
4. Frontend validates (non-empty) → shows error if empty
5. Frontend PATCHes `/api/todos/{id}` with new text
6. Backend updates todo, returns full object
7. Frontend updates DOM item immediately
8. Edit mode closed

### Mark Complete
1. User clicks checkbox on todo item
2. Frontend PATCHes `/api/todos/{id}` with `{ completed: true }`
3. Backend updates todo, returns full object
4. Frontend toggles strikethrough on item
5. Status counts updated
6. Item might move if filtered view

### Delete Todo
1. User clicks "Delete" button on todo item
2. Frontend shows confirmation (optional but recommended)
3. User confirms
4. Frontend DELETEs `/api/todos/{id}`
5. Backend removes todo, returns 204 No Content
6. Frontend removes item from DOM
7. Status counts updated

### Filter Todos
1. User clicks filter button ("Pending", "Completed", or "All")
2. Frontend calls `GET /api/todos?status=pending|completed|all`
3. Backend returns filtered array
4. Frontend re-renders list with matching todos
5. Filter button state updated (active/inactive)

## Error Handling Strategy

### Backend Errors
- **Empty text**: Return 400 with `{ error: "Text is required", code: "VALIDATION_ERROR" }`
- **Missing ID**: Return 404 with `{ error: "Todo not found", code: "NOT_FOUND" }`
- **Invalid JSON**: Return 400 with `{ error: "Invalid JSON", code: "PARSE_ERROR" }`
- **Server crash**: Return 500 with generic error (never expose stack traces)

### Frontend Error Display
1. All API calls wrapped in try/catch
2. On error, show user-friendly message in error toast (bottom of screen)
3. Toast disappears after 5 seconds or on user click
4. User can retry action

### Example Error Messages
- "Cannot create empty todo"
- "Failed to update todo. Please try again."
- "Todo not found. It may have been deleted."
- "Connection lost. Please check your internet."

## Testing Checklist (Manual)

### Before Merge
- [ ] Create a todo → appears in list
- [ ] Create multiple todos → all visible, consistent order
- [ ] Refresh page → todos still there
- [ ] Edit a todo → text changes, persists
- [ ] Mark complete → strikethrough shows
- [ ] Mark incomplete → strikethrough removed
- [ ] Delete a todo → removed from list, not in localStorage
- [ ] Filter pending → only incomplete todos show
- [ ] Filter completed → only complete todos show
- [ ] Filter all → all todos show
- [ ] Empty text validation → error message shown
- [ ] Edit cancel → original text restored
- [ ] Responsive on mobile (320px) and desktop (1024px)
- [ ] No JS console errors
- [ ] All interactions feel instant (<100ms)

## Deployment Considerations

### Development
- Backend: `node src/app.js` (port 3000)
- Frontend: static server (port 8000) with CORS to localhost:3000

### Production
- Backend: Deploy to Node.js hosting (Heroku, Railway, DigitalOcean, etc.)
- Frontend: Deploy to static hosting (GitHub Pages, Vercel, Netlify, etc.)
- Update API base URL in frontend to point to production backend
- CORS headers must allow production frontend domain

### Environment Variables
```
# backend/.env
PORT=3000
DATA_FILE=data/todos.json
LOG_LEVEL=info

# frontend/.env (or hardcoded)
API_BASE_URL=http://localhost:3000
```

## Next Steps

1. Implement backend (models → services → routes → app)
2. Implement frontend (HTML → styles → modules)
3. Manual testing per checklist
4. Deploy and celebrate!
