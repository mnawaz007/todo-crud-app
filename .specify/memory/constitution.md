# Todo App Constitution

## Core Principles

### I. Simplicity First
Every feature must solve a single, well-defined problem. Avoid premature abstraction and scope creep. If a component can be deleted without breaking core functionality, it should be deleted. Complexity requires explicit justification.

### II. CRUD-Centric Design
All data operations align to Create, Read, Update, Delete. The API and UI expose these operations clearly. Avoid implicit side effects; every action must have explicit intent and visibility to the user.

### III. Test-First Development
All business logic must have passing tests before implementation is considered complete. Tests validate the happy path, error conditions, and edge cases. Manual testing is always required before a feature is deemed "done."

### IV. Accessible User Interface
The frontend uses standard HTML/CSS/JavaScript patterns. Avoid complex frameworks for simple tasks. The UI must be responsive, keyboard-navigable, and work on modern browsers. Accessibility (WCAG 2.1 AA) is non-negotiable.

### V. Transparent Error Handling
Errors must be visible to the user with clear, actionable messages. No silent failures. Logging must capture enough context for debugging but not expose sensitive data. Client and server errors must be distinguishable.

## Technical Requirements

- **Backend**: REST API exposing standard CRUD endpoints for todos (/todos, /todos/{id})
- **Frontend**: Single-page application or server-rendered pages with minimal client-side state
- **Data Storage**: Persistent storage (database, file, or in-memory with serialization) with schema validation
- **No External Authentication**: Simple bearer token or session-based auth is acceptable; OAuth/SSO deferred
- **Dependencies**: Minimize third-party libraries; use standard language/framework features where possible

## Development Workflow

1. **Feature Branch**: Create branches with descriptive names (e.g., `feat/add-todo`, `fix/delete-button`)
2. **Test Before Code**: Write test cases and get approval before implementation
3. **Code Review**: All code must be reviewed for correctness, simplicity, and adherence to principles
4. **Integration Testing**: Test complete user journeys (e.g., create → read → update → delete)
5. **Manual QA**: Verify all changes in the UI before merging to main

## Governance

Constitution supersedes all other practices. All PRs must explicitly verify compliance with the five core principles. Amendments require documentation of rationale, impact analysis, and user consent. Code should be reviewed for simplicity and adherence to principles first, correctness second.

**Version**: 1.0.0 | **Ratified**: 2025-12-27 | **Last Amended**: 2025-12-27
