# Data Model: Simple Todo CRUD Application

**Feature**: Simple Todo CRUD Application
**Created**: 2025-12-27
**Status**: Approved

## Entity: Todo

Represents a single task item in the user's todo list.

### Attributes

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | UUID/String | Required, immutable, unique | Generated on create | Unique identifier (e.g., UUID v4) |
| `text` | String | Required, non-empty (1-500 chars), trimmed | N/A | Task description |
| `completed` | Boolean | Optional | `false` | Completion status |
| `createdAt` | ISO 8601 | Required, immutable | Timestamp of creation | When the todo was created (UTC) |
| `updatedAt` | ISO 8601 | Required | Current timestamp | When the todo was last modified (UTC) |

### Validation Rules

- **text**: MUST NOT be empty or whitespace-only; MUST be trimmed on save; max 500 characters
- **id**: MUST be unique; MUST NOT change after creation
- **completed**: MUST be boolean; defaults to `false` on creation
- **Timestamps**: MUST be ISO 8601 format (UTC); `updatedAt` changes on any mutation; `createdAt` never changes

### State Transitions

```
Todo Lifecycle:
┌────────────┐
│  Created   │  (completed = false, createdAt = now, updatedAt = now)
└─────┬──────┘
      │
      ├─→ Text Edited → (text = new text, updatedAt = now, completed unchanged)
      │
      ├─→ Marked Complete → (completed = true, updatedAt = now)
      │
      ├─→ Marked Incomplete → (completed = false, updatedAt = now)
      │
      └─→ Deleted → (removed from storage)
```

## Storage Contract

### File-Based Storage (Development)

**Location**: `backend/data/todos.json`

**Format**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "2025-12-27T10:30:00Z",
    "updatedAt": "2025-12-27T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "text": "Write specification",
    "completed": true,
    "createdAt": "2025-12-26T14:00:00Z",
    "updatedAt": "2025-12-27T09:15:00Z"
  }
]
```

### In-Memory Caching Strategy

1. Load entire todos.json on server startup into memory array
2. All mutations (create, update, delete) happen on in-memory array first
3. After each mutation, sync in-memory array to disk (write todos.json)
4. On startup errors, use backup or empty array; log warning

### Persistence Guarantees

- **Create**: Todo added to array, written to disk before response sent to client
- **Read**: Served from in-memory array
- **Update**: Todo updated in array, file written, then response sent
- **Delete**: Todo removed from array, file written, then response sent
- **Durability**: Synchronous file writes (no lost updates); atomic replacement of file content

## Relationships

- **Todo → User**: (Future) A todo belongs to one user. Currently, single-user application with all todos shared.
- **No inter-todo relationships**: Todos are independent; no grouping, dependencies, or ordering enforced by data model.

## Query Patterns

### Filter by Status (Implicit)

```javascript
// Client-side or server-side filtering
const pending = todos.filter(t => !t.completed);
const completed = todos.filter(t => t.completed);
const all = todos;
```

### List All Todos (with optional filter)

```
GET /api/todos?status=pending|completed|all
Returns: Array of todos matching filter
```

## Migration Path (Future)

When scaling beyond single-user or file-based storage:

1. **Database Schema** (e.g., PostgreSQL):
   ```sql
   CREATE TABLE todos (
     id UUID PRIMARY KEY,
     user_id UUID NOT NULL REFERENCES users(id),
     text VARCHAR(500) NOT NULL,
     completed BOOLEAN DEFAULT false,
     created_at TIMESTAMP NOT NULL,
     updated_at TIMESTAMP NOT NULL
   );
   CREATE INDEX idx_todos_user_id ON todos(user_id);
   ```

2. **Service Layer Changes**: Update `todoService.js` to query database instead of file
3. **No API Contract Changes**: Endpoints and response format remain identical
4. **Data Export**: Script to migrate todos.json → database

## Constraints & Assumptions

- **No soft deletes**: Deleted todos are removed from storage entirely (not marked as deleted)
- **No versioning/audit trail**: Only current state is stored; no historical changes
- **No tags/categories/priorities**: Todos are flat list with only text and completion status
- **No recurring todos**: Each todo is a one-time item
- **Single timezone**: All timestamps in UTC; client renders in local timezone
