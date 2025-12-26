# Manual Test Script: User Story 4 - Delete Todos

**Feature**: Simple Todo CRUD Application
**User Story 4**: Delete Todos (Priority: P1)
**Created**: 2025-12-27
**Dependencies**: User Story 1 must be complete (create/view working)

---

## Prerequisites

1. **Backend running**:
   ```bash
   cd backend
   npm start
   ```

2. **Frontend running**:
   ```bash
   cd frontend
   python -m http.server 8000   # or npx http-server src -p 8000 -c-1
   ```

3. **Browser**: http://localhost:8000/src/index.html

4. **Some todos created** (from US1):
   - Should have at least 5 todos in the list
   - If empty, create some using US1 steps

---

## Test Case 1: Delete Single Todo with Confirmation

### Steps

1. **Open the app** with existing todos

2. **Identify a todo to delete**:
   - Find the todo: "Buy groceries"
   - Note the current count in status bar: "5 pending | 0 completed"

3. **Click the "Delete" button** on "Buy groceries":
   - ✓ Delete confirmation modal appears (dark overlay background)
   - ✓ Modal text: "Are you sure you want to delete this todo?"
   - ✓ Modal shows "Confirm" and "Cancel" buttons
   - ✓ Focus is on the modal
   - ✓ "Buy groceries" todo is still visible in background

4. **Click "Confirm"**:
   - ✓ Modal closes immediately
   - ✓ Todo "Buy groceries" is removed from list
   - ✓ No page reload occurred
   - ✓ Other todos remain unchanged
   - ✓ Status bar updates: "4 pending | 0 completed"

5. **Verify persistence**:
   - Refresh page (F5)
   - ✓ Todo "Buy groceries" is permanently gone
   - ✓ Status bar still shows: "4 pending | 0 completed"
   - ✓ localStorage updated (F12 → Storage → Local Storage → todo_app_todos)
   - ✓ backend/data/todos.json no longer contains this todo

6. **Check API call** (optional, F12 Network tab):
   - ✓ DELETE request sent to http://localhost:3000/api/todos/[id]
   - ✓ Response: 204 No Content (or 200 OK)
   - ✓ Todo does not appear in subsequent GET requests

### Expected Result: ✅ PASS

---

## Test Case 2: Delete Confirmation Cancel - Discard Action

### Steps

1. **Find another todo**: e.g., "Write report"

2. **Click "Delete" button** on "Write report":
   - ✓ Delete confirmation modal appears
   - ✓ "Write report" still visible in background

3. **Click "Cancel" button**:
   - ✓ Modal closes immediately
   - ✓ Todo "Write report" remains in list
   - ✓ Status bar unchanged
   - ✓ No API request was made (check Network tab)
   - ✓ localStorage unchanged

4. **Press Escape key test**:
   - Click Delete again on same todo
   - Modal opens
   - Press Escape key
   - ✓ Modal closes
   - ✓ Todo remains: "Write report"
   - ✓ Action cancelled (no delete request)

5. **Try clicking outside modal** (if implemented):
   - Click Delete again
   - Modal opens
   - Click dark overlay area outside modal
   - ✓ Modal closes (or stays open depending on implementation)
   - ✓ Todo remains: "Write report"

### Expected Result: ✅ PASS

---

## Test Case 3: Delete Multiple Different Todos

### Steps

1. **With your list of 4+ remaining todos**, delete 3 different ones:

   **Delete 1**: "Call mom"
   - Click Delete
   - Click Confirm
   - ✓ Removes immediately
   - ✓ Status bar updates
   - ✓ Other todos unchanged

   **Delete 2**: "Exercise 30 mins"
   - Click Delete
   - Click Confirm
   - ✓ Removes immediately

   **Delete 3**: "Review pull requests"
   - Click Delete
   - Click Confirm
   - ✓ Removes immediately

2. **Verify all deletions persisted**:
   - Refresh page
   - ✓ All 3 deleted todos are gone
   - ✓ Only 1 remaining todo visible
   - ✓ Status bar shows: "1 pending | 0 completed"

3. **Check final state**:
   - ✓ List shows only remaining todos
   - ✓ No empty state message (still have 1 todo)

### Expected Result: ✅ PASS

---

## Test Case 4: Delete Last Todo - Empty State

### Steps

1. **With only 1 todo remaining** (from Test Case 3):
   - Status bar shows: "1 pending | 0 completed"

2. **Click Delete** on the last todo:
   - Confirmation modal appears
   - Click Confirm
   - ✓ Todo removed
   - ✓ Status bar updates: "0 pending | 0 completed"

3. **Verify empty state**:
   - ✓ Empty state message appears: "📝 No todos yet"
   - ✓ "Add a new todo..." input is visible and focused
   - ✓ Filter buttons still visible
   - ✓ List is empty (no todos)

4. **Verify persistence**:
   - Refresh page
   - ✓ Empty state still visible
   - ✓ Status bar: "0 pending | 0 completed"
   - ✓ localStorage has empty array `[]`
   - ✓ backend/data/todos.json has empty array

### Expected Result: ✅ PASS

---

## Test Case 5: Delete from Different Views (Pending/Completed)

### Prerequisites
- Recreate todos from Test Cases 1-4 (at least 5 new todos)
- Mark 2-3 as completed

### Steps

1. **Start with mixed state**:
   - Example: 3 pending, 2 completed
   - Status bar: "3 pending | 2 completed"

2. **Filter to "Pending"**:
   - Click "Pending" button
   - Delete one visible pending todo
   - Click Confirm
   - ✓ Todo removed from filtered view
   - ✓ Status bar updates: "2 pending | 2 completed"
   - ✓ Still in Pending filter view with 2 todos

3. **Filter to "Completed"**:
   - Click "Completed" button
   - Delete one visible completed todo
   - Click Confirm
   - ✓ Todo removed from filtered view
   - ✓ Status bar updates: "2 pending | 1 completed"
   - ✓ Still in Completed filter view with 1 todo

4. **Filter to "All"**:
   - Click "All" button
   - ✓ All remaining todos visible (3 total: 2 pending, 1 completed)
   - ✓ Deleted todos not present
   - ✓ Status bar: "2 pending | 1 completed"

5. **Delete from "All" view**:
   - Delete one more todo
   - Click Confirm
   - ✓ Removes immediately
   - ✓ Status bar updates: "1 pending | 1 completed"
   - ✓ Both filter and all views consistent

### Expected Result: ✅ PASS

---

## Test Case 6: Delete Modal Accessibility

### Steps

1. **Open Delete confirmation modal**:
   - Click Delete button on any todo
   - Modal appears

2. **Keyboard navigation**:
   - ✓ Tab key moves focus through modal elements
   - ✓ Can tab to Confirm button, Cancel button
   - ✓ Can use Shift+Tab to go backwards
   - ✓ Escape key closes modal (cancel action)

3. **Focus management**:
   - Open modal
   - ✓ Focus moves to modal (likely Confirm button)
   - ✓ Closing modal: focus returns to Delete button (ideally)
   - ✓ Tab doesn't cycle outside modal to page elements

4. **Screen reader** (if testing with screen reader):
   - ✓ Modal is announced as dialog
   - ✓ Confirmation message is clear and announced
   - ✓ Buttons are properly announced
   - ✓ Action taken is confirmed (deleted or cancelled)

### Expected Result: ✅ PASS

---

## Test Case 7: Delete and Edit Interaction

### Prerequisites
- Several todos in list

### Steps

1. **Edit a todo, then delete it**:
   - Click Edit on "Buy milk"
   - Change text to "Buy almond milk"
   - Save
   - ✓ Text updates to "Buy almond milk"
   - Click Delete on same todo
   - Click Confirm
   - ✓ Todo removed (including the edited text)
   - ✓ Status bar updates

2. **Delete a todo, try to edit the ID** (shouldn't exist):
   - After deletion, try to find it in DevTools
   - ✓ ID no longer exists in DOM
   - ✓ No error in console for trying to edit deleted todo

3. **Rapid delete after edit**:
   - Click Edit on a todo
   - Make changes
   - Cancel the edit modal
   - Click Delete before it fully closes
   - ✓ Delete modal opens
   - Click Confirm
   - ✓ Todo deleted with original text (edit was cancelled)

### Expected Result: ✅ PASS

---

## Test Case 8: Delete and Toggle Interaction

### Prerequisites
- Several todos, some completed

### Steps

1. **Delete a completed todo**:
   - Find a completed todo with strikethrough
   - Click Delete
   - Click Confirm
   - ✓ Removes from list
   - ✓ Status bar: "X pending | (Y-1) completed"
   - ✓ Other completed todos unaffected

2. **Delete a pending todo**:
   - Find a pending todo
   - Click Delete
   - Click Confirm
   - ✓ Removes from list
   - ✓ Status bar: "(X-1) pending | Y completed"

3. **Toggle then delete**:
   - Find a pending todo
   - Click checkbox to mark complete
   - Status bar updates
   - Click Delete
   - Click Confirm
   - ✓ Todo removed from list
   - ✓ Status bar decrements completed count

### Expected Result: ✅ PASS

---

## Test Case 9: API Error Handling During Delete

### Steps

1. **Stop the backend server** (Ctrl+C in backend terminal)

2. **Try to delete a todo**:
   - Click Delete button
   - Confirmation modal appears
   - Click Confirm
   - ✓ Error toast appears: "Failed to delete todo: Network error..."
   - ✓ Modal closes (or stays open depending on implementation)
   - ✓ Todo remains in list (NOT deleted)
   - ✓ Status bar unchanged

3. **Check localStorage**:
   - F12 → Storage → Local Storage
   - ✓ Todo still exists in `todo_app_todos`
   - ✓ Cache is consistent with displayed list

4. **Restart backend**:
   - Run `npm start` in backend terminal
   - ✓ Server comes back up

5. **Try delete again**:
   - Click Delete on same todo
   - Click Confirm
   - ✓ This time it succeeds
   - ✓ Todo removed from list
   - ✓ Status bar updates
   - ✓ Syncs to backend

### Expected Result: ✅ PASS

---

## Test Case 10: Concurrent Delete Operations

### Steps

1. **Slow network delete**:
   - DevTools → Network tab → Throttle to "Slow 3G"
   - Click Delete on Todo A
   - While modal is open, try clicking Delete on Todo B
   - Click Confirm on first todo
   - While PATCH request pending, try clicking another Delete
   - ✓ UI remains responsive
   - ✓ First delete completes successfully
   - ✓ Second delete can then be initiated
   - ✓ Status bar shows final correct count

2. **Rapid delete clicks**:
   - Remove throttling
   - Click Delete on same todo
   - While confirmation modal open, try clicking other Delete buttons
   - ✓ Only one modal visible at a time
   - ✓ Previous modal closes if new Delete is clicked
   - ✓ Only final confirmed delete executes

3. **Delete different todos quickly**:
   - Click Delete on Todo A
   - Click Confirm
   - Immediately click Delete on Todo B (while A request pending)
   - Click Confirm
   - ✓ Both delete successfully (or queue appropriately)
   - ✓ Status bar eventually shows correct count

### Expected Result: ✅ PASS

---

## Test Case 11: Delete with Special Characters and Long Text

### Steps

1. **Create todos with special content** (if not already present):
   - Todo 1: "Buy 🥬 vegetables & 🍎 apples"
   - Todo 2: `<script>alert('test')</script>` (safe, displayed as text)
   - Todo 3: Very long text (near 500 char limit)

2. **Delete these todos**:
   - Click Delete on Todo 1 (emoji)
   - Click Confirm
   - ✓ Removes successfully despite special characters
   - ✓ Status bar updates

   - Click Delete on Todo 2 (script tag as text)
   - Click Confirm
   - ✓ Removes successfully
   - ✓ No XSS attempts during deletion

   - Click Delete on Todo 3 (long text)
   - Click Confirm
   - ✓ Removes successfully despite length

3. **Verify deletion**:
   - Refresh page
   - ✓ All three todos permanently deleted
   - ✓ No orphaned data in localStorage or backend

### Expected Result: ✅ PASS

---

## Test Case 12: Delete All Todos One by One

### Prerequisites
- Create exactly 5 new todos

### Steps

1. **Delete todos sequentially**:
   - Status bar: "5 pending | 0 completed"
   - Delete Todo 1 → Status: "4 pending | 0 completed"
   - Delete Todo 2 → Status: "3 pending | 0 completed"
   - Delete Todo 3 → Status: "2 pending | 0 completed"
   - Delete Todo 4 → Status: "1 pending | 0 completed"
   - Delete Todo 5 → Status: "0 pending | 0 completed"

2. **Verify counts decrease properly**:
   - ✓ Each deletion updates counts correctly
   - ✓ No off-by-one errors
   - ✓ No duplicate deletions

3. **Final empty state**:
   - ✓ Empty state message visible: "📝 No todos yet"
   - ✓ List is completely empty
   - ✓ Status bar: "0 pending | 0 completed"

4. **Verify persistence**:
   - Refresh page
   - ✓ Empty state still visible
   - ✓ All todos permanently deleted
   - ✓ localStorage has empty array
   - ✓ backend/data/todos.json has empty array

### Expected Result: ✅ PASS

---

## Acceptance Criteria Checklist

### Core Features (US4)

- [ ] Users can click "Delete" button on any todo
- [ ] Delete confirmation modal appears when delete clicked
- [ ] Modal shows confirmation message
- [ ] Modal has "Confirm" and "Cancel" buttons
- [ ] Clicking "Confirm" deletes the todo
- [ ] Clicking "Cancel" does NOT delete the todo
- [ ] Escape key closes modal without deleting
- [ ] Todo is immediately removed from list (no reload)
- [ ] Todo is removed from DOM
- [ ] Status counts update immediately after delete
- [ ] Deleted todo syncs to localStorage
- [ ] Deleted todo syncs to backend (DELETE request)
- [ ] Changes persist after page refresh
- [ ] API DELETE request is sent with correct URL
- [ ] Response status is 204 No Content (or 200 OK)
- [ ] Error handling when API is unavailable
- [ ] Todo NOT deleted if API call fails
- [ ] Empty state shows when last todo deleted
- [ ] Delete works with pending todos
- [ ] Delete works with completed todos
- [ ] Delete works from All, Pending, and Completed filters
- [ ] No duplicate deletions

### Quality Standards

- [ ] No JavaScript console errors
- [ ] No page reloads during delete
- [ ] Modal properly styled and visible
- [ ] Buttons are clickable and responsive
- [ ] Confirmation required before destructive action
- [ ] Error messages are clear and visible
- [ ] Focus management appropriate
- [ ] Keyboard navigation works (Tab, Escape)
- [ ] No orphaned data in localStorage after delete
- [ ] No orphaned data in backend after delete
- [ ] Special characters/emojis safe (no XSS)
- [ ] Works on mobile (320px+) and desktop (1024px+)
- [ ] Modal responsive on all screen sizes
- [ ] Rapid deletes handled correctly

---

## Browser Testing Matrix

Test in multiple browsers:

| Browser | Desktop | Mobile | Keyboard | Status |
|---------|---------|--------|----------|--------|
| Chrome | ✓ | ✓ | ✓ | |
| Firefox | ✓ | ✓ | ✓ | |
| Safari | ✓ | ✓ | ✓ | |
| Edge | ✓ | ✓ | ✓ | |

---

## Performance Benchmarks

- **Delete modal open time**: <100ms
- **Todo removal from DOM**: Immediate (<50ms)
- **Status bar update**: Immediate (<50ms)
- **API request**: <100ms
- **No lag**: Multiple rapid deletes should feel responsive

---

## Network Testing

### Throttle Network (F12 → Network tab):

1. **Fast 3G**:
   - Click Delete and Confirm
   - ✓ Works, may take 1-2 seconds
   - ✓ Modal closes immediately (optimistic update)
   - ✓ Todo eventually removed from backend

2. **Slow 3G**:
   - Click Delete and Confirm
   - ✓ Works, takes 5-10 seconds
   - ✓ Modal closes immediately
   - ✓ List updates immediately (optimistic)
   - ✓ Eventually consistent with server

3. **Offline**:
   - Offline mode in DevTools
   - Click Delete and Confirm
   - ✓ Error message appears
   - ✓ Todo remains in list (NOT deleted)
   - ✓ Status bar unchanged

---

## Accessibility Testing

### Keyboard Only (no mouse):

1. **Tab Navigation**:
   - Tab through entire page
   - ✓ Can reach Delete button on each todo
   - ✓ Focus outline visible
   - Tab/Shift+Tab works to navigate

2. **Delete with Keyboard**:
   - Tab to Delete button
   - Press Enter to activate
   - ✓ Confirmation modal opens
   - Tab to Confirm button
   - Press Enter
   - ✓ Todo deleted successfully
   - ✓ Focus returns to appropriate element

3. **Cancel with Keyboard**:
   - Tab to Delete button
   - Press Enter to open modal
   - Tab to Cancel button
   - Press Enter
   - ✓ Modal closes
   - ✓ Todo not deleted
   - Press Escape instead
   - ✓ Modal closes (Escape also works)

4. **Screen Reader** (if testing with NVDA/JAWS/VoiceOver):
   - ✓ Delete button announced with aria-label
   - ✓ Confirmation message announced
   - ✓ Buttons properly announced
   - ✓ Action confirmation announced

---

## Troubleshooting

### Delete button doesn't open confirmation modal
- ✓ Check that Delete button has `data-action="delete"`
- ✓ Check app.js has click event listener for delete action
- ✓ Check ui.js has `showDeleteConfirmation()` function
- ✓ Check browser console for JavaScript errors
- ✓ Try refreshing page

### Todo not deleted after confirming
- ✓ Check backend is running (`npm start`)
- ✓ Check F12 Network tab for failed DELETE request
- ✓ Check API response status code
- ✓ Check browser console for errors
- ✓ Verify todos.json is writable by Node.js

### Status counts don't update after delete
- ✓ Check that updateStats() is called in deleteTodo()
- ✓ Check that status bar elements exist in HTML
- ✓ Verify updateStatusCounts() function is called
- ✓ Check Network tab for successful DELETE request

### Deleted todo appears again after refresh
- ✓ Check backend/data/todos.json - is it removed?
- ✓ Check localStorage (F12 Storage) - is it removed?
- ✓ If in cache but not backend, the issue is with file sync
- ✓ Check backend logs for write errors

### Confirmation modal won't close
- ✓ Try pressing Escape key
- ✓ Check console for errors
- ✓ Verify Confirm/Cancel buttons are present
- ✓ Try refreshing page

---

## Sign-Off

After completing all test cases:

- [ ] All test cases PASS
- [ ] No console errors
- [ ] No broken features
- [ ] User Story 4 is complete and ready for User Story 5

**Tested By**: _______________
**Date**: _______________
**Result**: PASS / FAIL

---

## Notes

- **API Integration**: DELETE /api/todos/:id with no body
- **Status Code**: 204 No Content (success), 404 if not found, 500 on server error
- **Timestamps**: Not applicable - deleting removes all data
- **Idempotency**: Deleting twice should only work once (second returns 404)
- **Consistency**: Deleted todos should not appear in any subsequent queries
- **Performance**: Delete should feel instant (<100ms)
- **Safety**: Confirmation required before destructive action
- **Recovery**: Deleted todos cannot be recovered (design requirement)

---

## Related User Stories

- **User Story 1** (Create/View): Must be working for this to test
- **User Story 2** (Edit): Can test edit before delete
- **User Story 3** (Mark Complete): Can delete completed todos
- **User Story 5** (Filter): Can delete from filtered views

---

## Links

- **Spec**: `/specs/001-todo-crud/spec.md`
- **Implementation Plan**: `/specs/001-todo-crud/plan.md`
- **All Tasks**: `/specs/001-todo-crud/tasks.md`
- **US1 Tests**: `/tests/manual-user-story-1.md`
- **US2 Tests**: `/tests/manual-user-story-2.md`
- **US3 Tests**: `/tests/manual-user-story-3.md`
