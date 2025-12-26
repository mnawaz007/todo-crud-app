# Todo App - Backend

Simple REST API backend for the Todo CRUD application. Built with Express.js and Node.js.

## Features

- **CRUD Operations**: Create, Read, Update, Delete todos
- **REST API**: Standard HTTP endpoints with JSON responses
- **File-Based Storage**: Todos stored in JSON file (development)
- **Error Handling**: Clear, user-friendly error messages
- **CORS Support**: Cross-origin requests for frontend
- **Logging**: Request and error logging for debugging

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This installs:
   - `express`: Web framework
   - `uuid`: Generate unique IDs for todos
   - `cors`: Enable cross-origin requests
   - `jest`: Testing framework (dev dependency)

## Running the Server

### Development Mode

```bash
npm start
```

or

```bash
npm run dev
```

The server will start on `http://localhost:3000`

**Output**:
```
Todo API server listening on http://localhost:3000
Health check: http://localhost:3000/api/health
```

### Verify Server is Running

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{ "status": "ok" }
```

## Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup, middleware
│   ├── models/
│   │   └── todo.js            # Todo entity, validation (Phase 2)
│   ├── services/
│   │   ├── storage.js         # File I/O operations (Phase 2)
│   │   └── todoService.js     # CRUD business logic (Phase 2)
│   └── api/
│       ├── middleware.js      # Error handling, logging (Phase 2)
│       └── routes.js          # Endpoint definitions (Phase 2)
├── tests/
│   ├── unit/                  # Unit tests (Phase 2)
│   └── integration/           # Integration tests (Phase 2)
├── data/
│   └── todos.json             # Data storage (Phase 2+)
├── package.json               # Dependencies
├── README.md                  # This file
└── .gitignore                 # Git ignore rules
```

## API Endpoints (Phase 2+)

All endpoints return JSON with the structure:
- **Success**: `{ data: {...}, status: 200 }`
- **Error**: `{ error: "message", code: "ERROR_CODE", status: 400 }`

### Todos Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos` | List all todos (supports `?status=pending\|completed\|all`) |
| GET | `/api/todos/:id` | Get a single todo by ID |
| PATCH | `/api/todos/:id` | Update a todo (text and/or completed) |
| DELETE | `/api/todos/:id` | Delete a todo |
| GET | `/api/health` | Health check |

### Request Examples

**Create Todo**:
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Buy groceries"}'
```

**Get All Todos**:
```bash
curl http://localhost:3000/api/todos
```

**Get Pending Todos**:
```bash
curl http://localhost:3000/api/todos?status=pending
```

**Update Todo**:
```bash
curl -X PATCH http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"text": "Buy almond milk", "completed": false}'
```

**Delete Todo**:
```bash
curl -X DELETE http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000
```

## Data Model

### Todo Object

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "text": "Buy groceries",
  "completed": false,
  "createdAt": "2025-12-27T10:30:00Z",
  "updatedAt": "2025-12-27T10:30:00Z"
}
```

**Fields**:
- `id` (string): UUID, immutable, unique
- `text` (string): Task description, required, 1-500 chars
- `completed` (boolean): Completion status, defaults to false
- `createdAt` (ISO 8601): Creation timestamp, immutable
- `updatedAt` (ISO 8601): Last modification timestamp

## Environment Variables

Create a `.env` file in the `backend/` directory:

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development, production)
- `LOG_LEVEL`: Logging level (debug, info, warn, error)

## Testing (Phase 2+)

### Unit Tests

```bash
npm test -- tests/unit/
```

Tests for:
- Todo model validation (empty text, UUID generation, timestamps)
- Storage service (file operations)
- TodoService CRUD methods

### Integration Tests

```bash
npm test -- tests/integration/
```

Tests for:
- All API endpoints
- Full CRUD workflows
- Error handling and edge cases

### Run All Tests

```bash
npm test
```

### Watch Mode (For Development)

```bash
npm run test:watch
```

## Error Handling

The API returns structured error responses:

### 400 - Bad Request (Validation Error)

```json
{
  "error": "Text is required",
  "code": "VALIDATION_ERROR",
  "status": 400
}
```

### 404 - Not Found

```json
{
  "error": "Todo not found",
  "code": "NOT_FOUND",
  "status": 404
}
```

### 500 - Server Error

```json
{
  "error": "Internal server error",
  "code": "SERVER_ERROR",
  "status": 500
}
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
PORT=3001 npm start
```

Or use a different port:

```bash
PORT=8080 npm start
```

### Module Not Found Errors

Make sure you've run:

```bash
npm install
```

### CORS Errors in Browser

The backend is configured with CORS enabled. Make sure the frontend is making requests to `http://localhost:3000` (or the correct port).

## Development Workflow

1. **Start the server**:
   ```bash
   npm start
   ```

2. **In another terminal, test endpoints**:
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Make changes to code** (auto-restart not enabled - restart server manually)

4. **Run tests**:
   ```bash
   npm test
   ```

## Architecture

### Layers

1. **API Layer** (`api/routes.js`): HTTP endpoint handlers, request parsing
2. **Service Layer** (`services/todoService.js`): Business logic, validation
3. **Storage Layer** (`services/storage.js`): File I/O, persistence
4. **Model Layer** (`models/todo.js`): Data validation, entity logic

### Middleware

- **CORS**: Allows frontend on different origin/port
- **JSON Parser**: Parses JSON request bodies
- **Logging**: Logs all requests for debugging
- **Error Handler**: Catches and formats errors

## Deployment

### To Production

1. Build: No build step needed (Node.js runs directly)

2. Deploy to hosting (e.g., Heroku, Railway, DigitalOcean):
   ```bash
   npm install --production
   npm start
   ```

3. Set environment variables in hosting platform

4. Ensure database/storage is configured for production

### Database Migration (Future)

When upgrading to a database (PostgreSQL, MongoDB), update `storage.js` to use database queries instead of file I/O. The API contract remains the same.

## Contributing

1. Create feature branch
2. Follow the implementation tasks in `/specs/001-todo-crud/tasks.md`
3. Write tests for new functionality
4. Ensure all tests pass
5. Create PR with clear description

## Next Steps

- **Phase 2**: Implement models, services, routes (foundational tasks)
- **Phase 3**: Complete User Story 1 (Create & View)
- **Phase 4-7**: Additional user stories
- **Phase 8**: Testing, polish, deployment

See `/specs/001-todo-crud/` for detailed specification and implementation plan.

## License

MIT
