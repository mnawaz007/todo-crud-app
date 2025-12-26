# Manual Test Script: User Story 1 - Create and View Todos

**Feature**: Simple Todo CRUD Application
**User Story 1**: Create and View Todos (Priority: P1) 🎯 MVP
**Created**: 2025-12-27

---

## Prerequisites

1. **Backend running**:
   ```bash
   cd backend
   npm start
   ```
   Expected: Server listening on http://localhost:3000

2. **Frontend running**:
   ```bash
   # In another terminal, serve frontend (Windows)
   cd frontend
   python -m http.server 8000

   # Or use any static server (Node.js example)
   npx http-server src -p 8000 -c-1
   ```
   Expected: Frontend accessible at http://localhost:8000/src/index.html

3. **Browser ready**: Chrome, Firefox, Safari, or Edge (modern version)
   - Open: http://localhost:8000/src/index.html
   - Check browser console (F12) for any errors

---

## Test Case 1: Create Single Todo

### Steps

1. **Open the app** at http://localhost:8000/src/index.html
2. **Verify page loads**:
   - ✓ "My Todos" heading visible
   - ✓ "Add a new todo..." input field visible
   - ✓ "Add" button visible
   - ✓ Empty state message visible (📝 No todos yet)
   - ✓ Filter buttons visible: All, Pending, Completed
   - ✓ Status bar shows: "0 pending | 0 completed"

3. **Create a todo**:
   - Click in the "Add a new todo..." input field
   - Type: `Buy groceries`
   - Click "Add" button (or press Enter)

4. **Verify todo appears**:
   - ✓ Todo "Buy groceries" appears in the list below
   - ✓ Todo has checkbox (unchecked)
   - ✓ Todo has "Edit" button
   - ✓ Todo has "Delete" button
   - ✓ Input field is cleared and ready for next entry
   - ✓ Cursor is focused in input field
   - ✓ Status bar updates: "1 pending | 0 completed"
   - ✓ Empty state message disappears

5. **Check browser console**:
   - ✓ No JavaScript errors (check red X in console)
   - ✓ Log message: "Todo created: [uuid]"

### Expected Result: ✅ PASS

---

## Test Case 2: Create Multiple Todos

### Steps

1. **Add 4 more todos** (continue from Test Case 1):
   - Type: `Write report` → Click Add
   - Type: `Call mom` → Click Add
   - Type: `Exercise 30 mins` → Click Add
   - Type: `Review pull requests` → Click Add

2. **Verify all todos appear**:
   - ✓ All 5 todos visible in list
   - ✓ Each todo is a separate list item
   - ✓ Each has checkbox, text, Edit, Delete buttons
   - ✓ Todos appear in order (newest last or oldest first - consistent)
   - ✓ Status bar shows: "5 pending | 0 completed"

3. **Verify IDs are unique**:
   - Inspect each todo in developer tools (right-click → Inspect)
   - ✓ Each `id="todo-[uuid]"` is unique
   - ✓ UUIDs are valid (36-character alphanumeric with dashes)

### Expected Result: ✅ PASS

---

## Test Case 3: Persistence After Page Refresh

### Steps

1. **With 5 todos in list** (from Test Case 2):
   - Verify status bar shows: "5 pending | 0 completed"

2. **Refresh the page**:
   - Press F5 or Ctrl+R (Cmd+R on Mac)
   - Wait for page to fully load (watch console for "App initialized")

3. **Verify todos persist**:
   - ✓ All 5 todos still visible after refresh
   - ✓ Same order as before refresh
   - ✓ Same text content
   - ✓ Same IDs (inspect to verify)
   - ✓ Status bar still shows: "5 pending | 0 completed"

4. **Check localStorage**:
   - Open browser DevTools (F12)
   - Go to "Storage" tab → "Local Storage" → http://localhost:8000
   - ✓ Find key: `todo_app_todos`
   - ✓ Value is valid JSON array with 5 todo objects
   - ✓ Each object has: id, text, completed, createdAt, updatedAt

5. **Check backend storage**:
   - Open: `backend/data/todos.json`
   - ✓ File contains JSON array with 5 todos
   - ✓ Same IDs and text as in browser
   - ✓ timestamps are ISO 8601 format

### Expected Result: ✅ PASS

---

## Test Case 4: Empty Text Validation

### Steps

1. **Try to submit empty form**:
   - Click "Add" button without entering text
   - OR: Type only spaces and click "Add"

2. **Verify validation**:
   - ✓ Error toast appears at bottom right
   - ✓ Error message: "Please enter a todo text"
   - ✓ Toast is red background with white text
   - ✓ Toast auto-dismisses after ~5 seconds
   - ✓ No empty todo is added to list
   - ✓ Input field is cleared and focused

3. **Dismiss error manually**:
   - Click the error toast
   - ✓ Toast immediately disappears

4. **Try 500+ character text**:
   - Enter a very long text (copy-paste Lorem Ipsum multiple times)
   - Click "Add"
   - ✓ Error appears: "Todo text cannot exceed 500 characters"

### Expected Result: ✅ PASS

---

## Test Case 5: Filter Display (with pending/completed mixed)

### Steps

1. **Mark 2 todos as complete** (you'll do this manually or in next story):
   - For now, assume you marked 2 out of 5 as complete
   - Status bar would show: "3 pending | 2 completed"

   **Note**: User Story 1 only covers Create/View, not completing.
   If you want to test filtering, either:
   - Manually edit `backend/data/todos.json` to set some `completed: true`, or
   - Proceed to User Story 3 (Mark Complete)

2. **For now, verify "All" filter works**:
   - "All" button is active (primary color)
   - All todos are displayed
   - Click "Pending" button
   - ✓ Button becomes active
   - ✓ Button states change (aria-pressed updates)

### Expected Result: ✅ PASS (filter UI works, filtering waits for US3)

---

## Test Case 6: API Integration Check

### Steps

1. **With todos created**, open browser DevTools (F12)

2. **Go to "Network" tab**

3. **Create a new todo**:
   - Type "Test API" and click Add
   - Watch Network tab

4. **Verify API calls**:
   - ✓ POST request to http://localhost:3000/api/todos
   - ✓ Status: 201 Created
   - ✓ Request body: `{ "text": "Test API" }`
   - ✓ Response: 201 with todo object including id

5. **Verify localStorage sync**:
   - Go to Storage tab → Local Storage
   - ✓ "Test API" todo appears in `todo_app_todos`

### Expected Result: ✅ PASS

---

## Test Case 7: Error Handling - Network Issues

### Steps

1. **Simulate network error** (optional):
   - Stop backend server (Ctrl+C)
   - Try to create a new todo
   - ✓ Error toast appears: "Failed to create todo: Network error..."
   - ✓ Todo is still cached locally (see localStorage)
   - Restart backend server

2. **Verify fallback to cache**:
   - Refresh page with backend stopped
   - ✓ Todos load from localStorage (console shows warning)
   - ✓ Todos are displayed
   - "Connection lost" toast appears (if offline)

### Expected Result: ✅ PASS

---

## Acceptance Criteria Checklist

### MVP Requirements for User Story 1

- [ ] User can create a todo with text description
- [ ] Todos appear immediately in the list (no page reload)
- [ ] Input field clears after creating todo
- [ ] Cursor returns to input field after create
- [ ] Multiple todos can be created
- [ ] Each todo has unique ID
- [ ] Todos persist after page refresh
- [ ] Todos are stored in backend (`todos.json`)
- [ ] Todos are cached in browser (`localStorage`)
- [ ] Empty text is rejected with error message
- [ ] Error messages are visible and clear
- [ ] Status bar shows accurate pending/completed counts
- [ ] API integration works (POST /api/todos, GET /api/todos)
- [ ] Graceful fallback if API unavailable

### Additional Quality Checks

- [ ] No JavaScript console errors
- [ ] Page is responsive on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] Keyboard navigation works (Tab through form, buttons)
- [ ] Accessible color contrast
- [ ] All buttons have aria-labels
- [ ] List items have role="listitem"
- [ ] Form input has proper label text

---

## Browser Testing

Test in multiple browsers to ensure compatibility:

| Browser | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Chrome (latest) | ✓ | ✓ | |
| Firefox (latest) | ✓ | ✓ | |
| Safari (latest) | ✓ | ✓ | |
| Edge (latest) | ✓ | ✓ | |

---

## Performance Check

- **Page load time**: Should be under 3 seconds
- **Create todo**: Should feel instant (<100ms)
- **No lag**: Typing in input should be responsive
- **Memory**: No memory leaks (check DevTools Memory tab)

---

## Notes

- **Timestamps**: Check that `createdAt` and `updatedAt` are in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
- **IDs**: Verify UUIDs are valid (use online UUID validator if needed)
- **Persistence**: Data should survive browser restarts (close browser tab and reopen)
- **Logging**: Check console logs for "Todo created: [id]" messages

---

## Sign-Off

After completing all test cases above:

- [ ] All test cases PASS
- [ ] No console errors
- [ ] No broken features
- [ ] User Story 1 is complete and ready for User Story 2

**Tested By**: _______________
**Date**: _______________
**Result**: PASS / FAIL

---

## If Tests Fail

1. **Check backend logs**: Are POST/GET requests reaching the server?
2. **Check browser console**: Are there JavaScript errors?
3. **Check network tab**: Are API calls being made with correct status codes?
4. **Check localStorage**: Is data being cached?
5. **Check todos.json**: Is data being persisted to file?

If any test fails, create an issue with:
- Browser and OS version
- Exact steps to reproduce
- Expected vs. actual result
- Screenshot or console error
