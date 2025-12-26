# Implementation Plan: Simple Todo CRUD Application

**Branch**: `001-todo-crud` | **Date**: 2025-12-27 | **Spec**: [specs/001-todo-crud/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-todo-crud/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a simple, single-user todo application with full CRUD operations (Create, Read, Update, Delete, Complete, Filter) using a modern web stack with minimal dependencies. The application stores todos locally via browser storage or file-based persistence. Frontend uses standard HTML/CSS/JavaScript; backend exposes REST API endpoints. Focus on simplicity, immediate visual feedback, and transparent error handling per constitution.

## Technical Context

**Language/Version**: JavaScript (Node.js 18+) for backend; HTML5/CSS3/ES6+ for frontend
**Primary Dependencies**: Express.js (backend), minimal client-side libraries (vanilla JS preferred)
**Storage**: File-based JSON (development) or SQLite (production); browser localStorage for client-side caching
**Testing**: Jest (backend unit/integration), manual browser testing (frontend)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge 2021+); Node.js 18+ server
**Project Type**: Web application (frontend + backend)
**Performance Goals**: API response <100ms, UI interactive <3s load time, 500+ concurrent todos
**Constraints**: <10MB total app size, offline-capable via localStorage, <50MB storage per user
**Scale/Scope**: Single-user MVP, up to 1000 todos per user, 5 core pages/screens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Alignment | Status |
|-----------|-------------|-----------------|--------|
| **I. Simplicity First** | Features solve single, well-defined problems; no premature abstraction; deletable components only | CRUD-only scope; vanilla JS frontend; minimal dependencies; direct data model | ✅ PASS |
| **II. CRUD-Centric Design** | All operations are Create, Read, Update, Delete; explicit intent; clear UI visibility | 4 core CRUD endpoints + Complete + Filter; UI buttons match actions; no side effects | ✅ PASS |
| **III. Test-First Development** | Tests before implementation; happy path + errors + edge cases; manual QA required | Plan includes unit/integration tests; edge cases documented; manual testing gates | ✅ PASS |
| **IV. Accessible User Interface** | Standard HTML/CSS/JS; responsive (1024px+, 320px+); keyboard-navigable; WCAG 2.1 AA | Vanilla HTML/CSS/JS stack; responsive grid; semantic HTML; no JS-only UI | ✅ PASS |
| **V. Transparent Error Handling** | Visible user messages; no silent failures; debug-friendly logs; client vs server errors distinct | All errors trigger user-visible toast/message; validation feedback immediate; error response codes | ✅ PASS |

**Decision**: All constitution principles align with plan. No complexity trade-offs required.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   └── todo.js              # Todo entity, validation
│   ├── services/
│   │   └── todoService.js       # CRUD business logic
│   ├── api/
│   │   ├── routes.js            # Express route handlers
│   │   └── middleware.js        # Error handling, logging
│   └── app.js                   # Express app setup
├── tests/
│   ├── unit/
│   │   ├── models.test.js
│   │   └── services.test.js
│   └── integration/
│       └── api.test.js          # Full CRUD endpoint tests
├── data/
│   └── todos.json               # File-based storage (dev)
├── package.json
└── README.md

frontend/
├── src/
│   ├── index.html               # Single HTML page
│   ├── styles.css               # Responsive layout
│   ├── app.js                   # Main app logic
│   ├── api-client.js            # API fetch wrapper
│   ├── ui.js                    # DOM manipulation, rendering
│   └── storage.js               # localStorage management
├── public/
│   └── index.html               # Served as root
└── README.md

tests/
├── e2e/
│   └── todo-crud.test.js        # Full user journey tests
└── README.md
```

**Structure Decision**: Web application with separated backend (Express.js) and frontend (vanilla HTML/CSS/JS). This aligns with constitution's simplicity principle—each layer has a single responsibility, no framework overhead, easy to test independently.

## Design Artifacts (Phase 1)

### Data Model (`data-model.md`)

**Entity: Todo**
- `id`: UUID (generated on creation)
- `text`: string (1-500 chars, required, trimmed)
- `completed`: boolean (default: false)
- `createdAt`: ISO 8601 timestamp (UTC)
- `updatedAt`: ISO 8601 timestamp (UTC)

**Storage Contract**:
- File-based JSON array in `backend/data/todos.json`
- In-memory cache with file sync on each mutation
- Validation: text required and non-empty; all fields immutable except text and completed

### API Contracts (`contracts/openapi.yaml`)

**Endpoints**:
- `POST /api/todos` — Create (title → todo object)
- `GET /api/todos` — Read all (optional query: `?status=pending|completed|all`)
- `GET /api/todos/:id` — Read one
- `PATCH /api/todos/:id` — Update text or completed status
- `DELETE /api/todos/:id` — Delete
- `GET /api/health` — Health check

**Response Format**:
- Success: `{ data: [...], status: 200 }`
- Error: `{ error: "message", code: "ERROR_CODE", status: 400|404|500 }`

### Frontend Blueprint (`quickstart.md`)

**Screens**:
1. Todo List (main page) — show all/filtered todos, add form
2. Edit Modal — inline or modal for editing single todo
3. Status Bar — shows pending/completed counts
4. Error Toast — temporary notification for validation/API errors

**Key Interactions**:
- Add: form validation → POST /api/todos → append to DOM (no reload)
- Edit: click edit → inline edit or modal → PATCH → update DOM
- Complete: click checkbox → PATCH → toggle strikethrough + re-sort
- Delete: click delete → confirm → DELETE → remove from DOM
- Filter: radio buttons/links → filter local list by status

### Testing Strategy

**Backend Tests**:
- Unit: Todo model validation (empty text, valid id, timestamps)
- Integration: CRUD endpoints (create, read, update, delete, filter)
- Edge cases: concurrent requests, missing fields, invalid JSON

**Frontend Tests**:
- Manual: Create → Read → Update → Complete → Delete → Filter
- Manual: Empty text validation, edit cancel, page refresh persistence
- Browser: Chrome, Firefox, Safari latest versions

**Gates**:
- All unit tests pass before integration tests
- All integration tests pass before manual QA
- Manual QA sign-off before merge to main
