---
description: "Implementation tasks for Simple Todo CRUD Application"
---

# Tasks: Simple Todo CRUD Application

**Input**: Design documents from `/specs/001-todo-crud/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Manual browser testing only (not automated tests). Focus on user journey validation.

**Organization**: Tasks are grouped by user story (US1-US5) to enable independent implementation and testing. Backend and frontend tasks are coordinated within each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files/components, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- File paths: absolute paths to source files being created/modified

## Path Conventions

- **Backend**: `backend/src/` (models, services, api), `backend/data/` (storage)
- **Frontend**: `frontend/src/` (HTML, CSS, JS modules)
- **Tests**: `tests/` for E2E manual test scripts

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure

- [ ] T001 Create backend project structure: `backend/src/models/`, `backend/src/services/`, `backend/src/api/`, `backend/tests/`, `backend/data/`
- [ ] T002 Create frontend project structure: `frontend/src/`, `frontend/public/`
- [ ] T003 [P] Initialize Node.js backend with `backend/package.json` (Express, uuid, cors)
- [ ] T004 [P] Create `backend/src/app.js` - Express app setup with middleware
- [ ] T005 [P] Create `frontend/src/index.html` - HTML skeleton with form, list, filters, error toast
- [ ] T006 [P] Create `backend/.gitignore` and `frontend/.gitignore`
- [ ] T007 Create `backend/README.md` with setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and APIs that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can proceed until this phase is complete

- [ ] T008 Implement Todo model validation in `backend/src/models/todo.js` (UUID generation, text validation, timestamps)
- [ ] T009 [P] Implement file-based storage service in `backend/src/services/storage.js` (load, save, read todos.json)
- [ ] T010 [P] Create `backend/src/api/middleware.js` - error handler, CORS, JSON parser, request logger
- [ ] T011 [P] Create `backend/src/api/routes.js` - route definitions (POST/GET/PATCH/DELETE /todos, GET /health)
- [ ] T012 Implement TodoService in `backend/src/services/todoService.js` with CRUD methods (create, read, update, delete)
- [ ] T013 [P] Create `frontend/src/api-client.js` - fetch wrapper for API calls (POST, GET, PATCH, DELETE)
- [ ] T014 [P] Create `frontend/src/storage.js` - localStorage caching and sync logic
- [ ] T015 [P] Create `frontend/src/styles.css` - responsive layout (desktop 1024px+, mobile 320px+), form, list, buttons
- [ ] T016 Create `backend/data/todos.json` - initial empty array for storage

**Checkpoint**: Foundation ready - all 6 API endpoints functional, frontend modules initialized, data model validated

---

## Phase 3: User Story 1 - Create and View Todos (Priority: P1) 🎯 MVP

**Goal**: Users can create todos with text, see them displayed in a persistent list, and todos survive page refresh

**Independent Test**:
1. Create todo with text "Buy groceries" → appears in list
2. Refresh page → todo still visible
3. Create 3 more todos → all displayed, consistent order

### Implementation for User Story 1

- [ ] T017 [P] [US1] Implement POST `/api/todos` handler in `backend/src/api/routes.js` - create endpoint
- [ ] T018 [P] [US1] Implement `create()` method in `backend/src/services/todoService.js` - validation, UUID generation, save to file
- [ ] T019 [P] [US1] Implement GET `/api/todos` handler in `backend/src/api/routes.js` - read all endpoint
- [ ] T020 [P] [US1] Implement `getAll()` method in `backend/src/services/todoService.js` - return all todos from file
- [ ] T021 [P] [US1] Create `frontend/src/ui.js` - renderTodoList(), createTodoElement(), appendToDOM()
- [ ] T022 [P] [US1] Create `frontend/src/app.js` - main orchestration: init, load todos, attach form listener
- [ ] T023 [US1] Connect form submit to API: validate → POST /api/todos → renderTodoList (depends on T017, T018, T021, T022)
- [ ] T024 [US1] Connect page load to API: GET /api/todos → renderTodoList and cache in localStorage (depends on T019, T020, T021, T022)
- [ ] T025 [US1] Add form input reset after successful create
- [ ] T026 [US1] Add error handling toast for empty text validation on frontend
- [ ] T027 [US1] Test User Story 1 end-to-end: create todos, refresh, verify persistence in `tests/manual-user-story-1.md`

**Checkpoint**: User Story 1 complete - users can create and view persistent todos (MVP!)

---

## Phase 4: User Story 2 - Update Existing Todos (Priority: P1)

**Goal**: Users can edit todo text, save changes, and have updates persist and display immediately

**Independent Test**:
1. Create todo "Buy milk"
2. Click Edit → change to "Buy almond milk" → Save
3. Todo text updated immediately on screen
4. Refresh page → updated text still there
5. Click Edit → Cancel → original text retained

### Implementation for User Story 2

- [ ] T028 [P] [US2] Implement PATCH `/api/todos/:id` handler in `backend/src/api/routes.js` - update endpoint
- [ ] T029 [P] [US2] Implement `update()` method in `backend/src/services/todoService.js` - find, validate, update text/completed, save
- [ ] T030 [P] [US2] Implement `getById()` method in `backend/src/services/todoService.js` - retrieve single todo
- [ ] T031 [P] [US2] Create edit UI in `frontend/src/ui.js` - showEditForm(), updateTodoInDOM(), closeEditForm()
- [ ] T032 [P] [US2] Add edit button/click handler in `frontend/src/app.js` - attach listeners to edit buttons
- [ ] T033 [US2] Connect edit form submit to PATCH API call (depends on T028, T029, T031, T032)
- [ ] T034 [US2] Implement Cancel button to discard changes without API call
- [ ] T035 [US2] Add form validation: reject empty text with error toast
- [ ] T036 [US2] Update localStorage cache after successful PATCH
- [ ] T037 [US2] Test User Story 2 end-to-end in `tests/manual-user-story-2.md`

**Checkpoint**: User Stories 1 and 2 complete - users can create and edit todos

---

## Phase 5: User Story 3 - Mark Todos Complete (Priority: P1)

**Goal**: Users can mark todos as complete/incomplete with visual feedback (strikethrough), completion state persists

**Independent Test**:
1. Create todo "Write report"
2. Click checkbox → strikethrough appears, visual change immediate
3. Click checkbox again → strikethrough removed, status returns to pending
4. Refresh page → completion state persists
5. Can toggle multiple todos independently

### Implementation for User Story 3

- [ ] T038 [P] [US3] Add checkbox to todo item in `frontend/src/ui.js` - createTodoElement() updates with checkbox
- [ ] T039 [P] [US3] Add checkbox change listener in `frontend/src/app.js` - detect checkbox toggle
- [ ] T040 [P] [US3] Add CSS styling for completed state in `frontend/src/styles.css` - strikethrough, color change
- [ ] T041 [US3] Connect checkbox to PATCH `/api/todos/:id` with `{ completed: true/false }` (depends on T028, T029)
- [ ] T042 [US3] Update todo item DOM immediately after checkbox (optimistic update)
- [ ] T043 [US3] Update localStorage cache after PATCH success
- [ ] T044 [US3] Add error handling if PATCH fails - revert checkbox and show error toast
- [ ] T045 [US3] Test User Story 3 end-to-end in `tests/manual-user-story-3.md`

**Checkpoint**: User Stories 1, 2, 3 complete - users can manage todo completion status

---

## Phase 6: User Story 4 - Delete Todos (Priority: P1)

**Goal**: Users can delete todos, with confirmation to prevent accidents; deleted todos don't reappear

**Independent Test**:
1. Create 3 todos
2. Click delete on first todo → confirmation prompt
3. Confirm → todo removed immediately from list
4. Refresh page → deleted todo doesn't return
5. Test cancel on confirmation → todo remains

### Implementation for User Story 4

- [ ] T046 [P] [US4] Add delete button to todo item in `frontend/src/ui.js` - createTodoElement() adds button
- [ ] T047 [P] [US4] Implement confirmation dialog in `frontend/src/ui.js` - showDeleteConfirm()
- [ ] T048 [P] [US4] Add delete button listener in `frontend/src/app.js`
- [ ] T049 [P] [US4] Implement DELETE `/api/todos/:id` handler in `backend/src/api/routes.js`
- [ ] T050 [P] [US4] Implement `delete()` method in `backend/src/services/todoService.js` - find, remove from array, save
- [ ] T051 [US4] Connect delete button to DELETE API call (depends on T049, T050)
- [ ] T052 [US4] Remove todo from DOM immediately after delete success
- [ ] T053 [US4] Update localStorage cache after DELETE success
- [ ] T054 [US4] Add error handling if DELETE fails - show error toast, todo remains
- [ ] T055 [US4] Test User Story 4 end-to-end in `tests/manual-user-story-4.md`

**Checkpoint**: User Stories 1-4 complete - full CRUD functional

---

## Phase 7: User Story 5 - Filter and View Todos by Status (Priority: P2)

**Goal**: Users can filter list to show pending, completed, or all todos; filtering is instant

**Independent Test**:
1. Create 5 todos, mark 2 as complete
2. Click "Show Pending" → only 3 incomplete todos visible
3. Click "Show Completed" → only 2 complete todos visible
4. Click "Show All" → all 5 todos visible
5. Completion counts accurate in status bar

### Implementation for User Story 5

- [ ] T056 [P] [US5] Add filter buttons to HTML in `frontend/src/index.html` - All, Pending, Completed buttons
- [ ] T057 [P] [US5] Add filter button styling in `frontend/src/styles.css` - active/inactive states
- [ ] T058 [P] [US5] Implement filterTodos() in `frontend/src/ui.js` - client-side filtering logic
- [ ] T059 [P] [US5] Add filter button click handler in `frontend/src/app.js`
- [ ] T060 [US5] Add status bar element to HTML in `frontend/src/index.html` - pending/completed counts
- [ ] T061 [US5] Implement updateStatusCounts() in `frontend/src/ui.js` - calculate and display counts
- [ ] T062 [US5] Call updateStatusCounts() after every CRUD operation (depends on T056-T061)
- [ ] T063 [US5] Add query param to GET `/api/todos?status=pending|completed|all` in `backend/src/api/routes.js` (optional server-side support)
- [ ] T064 [US5] Update `getAll()` in `backend/src/services/todoService.js` to filter by status if requested
- [ ] T065 [US5] Test User Story 5 end-to-end in `tests/manual-user-story-5.md`

**Checkpoint**: All 5 user stories complete - full feature set functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements, validation, and final checks

- [ ] T066 [P] Run manual test checklist from `tests/manual-test-checklist.md` - all user journeys
- [ ] T067 [P] Test responsive design on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] T068 [P] Test in multiple browsers: Chrome, Firefox, Safari (if available)
- [ ] T069 [P] Verify keyboard navigation (Tab through form, buttons, etc.)
- [ ] T070 [P] Verify error messages are visible and clear
- [ ] T071 Test offline behavior: disable network, verify localStorage fallback
- [ ] T072 Create `backend/README.md` with setup, running, testing instructions
- [ ] T073 Create `frontend/README.md` with setup and usage instructions
- [ ] T074 Add comments to complex functions in `backend/src/services/todoService.js`
- [ ] T075 Add comments to main app orchestration in `frontend/src/app.js`
- [ ] T076 Verify performance: API response <100ms, page load <3s
- [ ] T077 Run through quickstart.md guide to verify all steps work

**Checkpoint**: Feature complete and validated - ready for deployment

---

## Manual Testing Artifacts

### User Story 1 Test Script: `tests/manual-user-story-1.md`

```
## User Story 1: Create and View Todos

### Test Case 1: Create Single Todo
1. Open app at http://localhost:8000
2. Enter "Buy groceries" in input
3. Click "Add"
4. Verify: todo appears below with text "Buy groceries"
5. Verify: input cleared and focused for next entry

### Test Case 2: Create Multiple Todos
1. Add 3 todos: "Buy groceries", "Write report", "Call mom"
2. Verify: all 3 appear in list
3. Verify: consistent order (newest first or oldest first)

### Test Case 3: Persistence After Refresh
1. With 3 todos in list
2. Refresh page (F5)
3. Verify: all 3 todos still visible
4. Verify: order unchanged

### Test Case 4: Empty Text Validation
1. Click "Add" without entering text
2. Verify: error message appears ("Cannot create empty todo")
3. Verify: no empty todo added
```

### User Story 2 Test Script: `tests/manual-user-story-2.md`

```
## User Story 2: Update Existing Todos

### Test Case 1: Edit Todo Text
1. With "Buy groceries" in list
2. Click "Edit" button on that todo
3. Change text to "Buy almond milk"
4. Click "Save"
5. Verify: text updates immediately
6. Refresh page
7. Verify: updated text persists ("Buy almond milk")

### Test Case 2: Edit Cancel
1. Click "Edit" on a todo
2. Change text
3. Click "Cancel"
4. Verify: text reverts to original
5. Verify: no API call made (check network tab)

### Test Case 3: Edit Validation
1. Click "Edit" on a todo
2. Clear all text
3. Click "Save"
4. Verify: error toast appears
5. Verify: todo text unchanged
```

### User Story 3 Test Script: `tests/manual-user-story-3.md`

```
## User Story 3: Mark Todos Complete

### Test Case 1: Mark as Complete
1. With "Buy groceries" in list
2. Click checkbox on that todo
3. Verify: strikethrough appears immediately
4. Verify: visual change (color, icon) shows completion
5. Refresh page
6. Verify: strikethrough still visible

### Test Case 2: Toggle Completion
1. With completed todo
2. Click checkbox again
3. Verify: strikethrough removed
4. Verify: returns to pending visual style

### Test Case 3: Independent Toggle
1. With 3 todos (2 pending, 1 complete)
2. Mark different todos as complete/incomplete
3. Verify: each toggles independently
4. Verify: order doesn't change unexpectedly
```

### User Story 4 Test Script: `tests/manual-user-story-4.md`

```
## User Story 4: Delete Todos

### Test Case 1: Delete with Confirmation
1. Click delete button on a todo
2. Verify: confirmation prompt appears
3. Click confirm
4. Verify: todo removed immediately from list
5. Refresh page
6. Verify: deleted todo doesn't reappear

### Test Case 2: Delete Cancel
1. Click delete button on a todo
2. Confirmation prompt appears
3. Click cancel
4. Verify: todo remains in list
5. Verify: no API DELETE call made

### Test Case 3: Delete Multiple
1. Delete several todos one by one
2. Verify: each removes cleanly
3. Verify: list updates correctly
```

### User Story 5 Test Script: `tests/manual-user-story-5.md`

```
## User Story 5: Filter Todos by Status

### Test Case 1: Filter Pending
1. With 5 todos (3 pending, 2 complete)
2. Click "Show Pending"
3. Verify: only 3 pending todos visible
4. Verify: completed todos hidden

### Test Case 2: Filter Completed
1. Click "Show Completed"
2. Verify: only 2 completed todos visible
3. Verify: pending todos hidden

### Test Case 3: Show All
1. Click "Show All"
2. Verify: all 5 todos visible
3. Verify: no filtering applied

### Test Case 4: Status Counts
1. Status bar shows: "X pending | Y completed"
2. As you toggle completion on todos
3. Verify: counts update correctly
4. Verify: counts match visible todos
```

### Complete Manual Test Checklist: `tests/manual-test-checklist.md`

```
# Manual Test Checklist: Simple Todo CRUD

## Before Merge Requirements
- [ ] Create todo → appears in list
- [ ] Create multiple todos → all visible, consistent order
- [ ] Refresh page → todos persist
- [ ] Edit todo → text changes, persists after refresh
- [ ] Mark complete → strikethrough shows, persists
- [ ] Mark incomplete → strikethrough removed, persists
- [ ] Delete todo → removed from list, doesn't reappear after refresh
- [ ] Delete confirm → confirmation prompt prevents accident
- [ ] Filter pending → only incomplete todos shown
- [ ] Filter completed → only complete todos shown
- [ ] Filter all → all todos shown
- [ ] Status bar → pending/completed counts accurate
- [ ] Empty text validation → error message shown
- [ ] Edit cancel → original text restored, no API call
- [ ] Responsive on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] Keyboard navigation: Tab through form, buttons, checkboxes
- [ ] No console JS errors
- [ ] All interactions feel instant (<100ms)
- [ ] Error messages are clear and visible
- [ ] Page loads and is interactive within 3 seconds
```

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phase 3-7)**: All depend on Foundational completion
  - US1 (Phase 3) - Can start first (MVP)
  - US2 (Phase 4) - Can start after US1 or in parallel after Foundational
  - US3 (Phase 5) - Can start after Foundational or in parallel
  - US4 (Phase 6) - Can start after Foundational or in parallel
  - US5 (Phase 7) - Can start after Foundational or in parallel
- **Polish (Phase 8)**: Depends on desired user stories being complete

### Parallel Opportunities

**Phase 1 (Setup)**:
- T003, T004, T005, T006, T007 can run in parallel (different files)

**Phase 2 (Foundational)**:
- T009, T010, T011, T013, T014, T015 can run in parallel (different components)
- T012 depends on T008
- T016 creates empty file (no dependencies)

**User Stories (after Foundational)**:
- **US1**: T017-T027 sequential within story (dependencies marked)
- **US2**: T028-T037 sequential within story (dependencies marked)
- **US3**: T038-T045 can run mostly in parallel, dependency on US1 for PATCH endpoint
- **US4**: T046-T055 can run mostly in parallel, dependency on US1 for DELETE endpoint
- **US5**: T056-T065 can run mostly in parallel, dependencies on US1 for GET and counts

**Across Stories** (after Foundational):
- Different teams can work on different user stories simultaneously
- Each story is independently testable before merge

---

## Implementation Strategy

### MVP First (Recommended Path)

1. **Complete Phase 1** (Setup) - ~30 mins
2. **Complete Phase 2** (Foundational) - ~2 hours
   - All 6 API endpoints operational
   - Storage, models, API routes ready
   - Frontend modules initialized
3. **Complete Phase 3** (User Story 1) - ~1.5 hours
   - Users can create and view todos ✅ **MVP ACHIEVED**
4. **Manual test US1 thoroughly**
5. Deploy or get feedback before continuing

### Incremental Delivery (Sequential)

1. Setup + Foundational → MVP ready
2. Add US1 → Test independently → Deploy/Demo
3. Add US2 → Test independently → Deploy/Demo (with US1)
4. Add US3 → Test independently → Deploy/Demo (with US1-2)
5. Add US4 → Test independently → Deploy/Demo (with US1-3)
6. Add US5 → Test independently → Deploy/Demo (with US1-4)
7. Each story adds value independently

### Parallel Team Strategy (4 developers)

1. Developer 1 + 2: Complete Setup + Foundational together
2. Once Foundational done:
   - Developer 1: User Story 1 (MVP)
   - Developer 2: User Story 2
   - Developer 3: User Story 3
   - Developer 4: User Story 4
3. Developer 5: User Story 5 (lower priority)
4. Parallel integration testing
5. Polish and deployment when all stories done

---

## Notes

- **[P] tasks**: Can run in parallel (different files, no blocking dependencies)
- **[US#] labels**: Map tasks to specific user story for traceability
- **Each user story**: Should be independently completable and testable
- **Manual tests first**: Write test scenarios before implementation
- **Commit strategy**: Commit after each task or logical group (e.g., T017-T020 for POST endpoint)
- **Stop at checkpoints**: Validate each user story independently before proceeding
- **Dependencies in descriptions**: If task depends on others, it's noted in brackets like `(depends on T010, T015)`
- **Avoid**: Cross-story dependencies that break independence (stories should be parallelizable)
