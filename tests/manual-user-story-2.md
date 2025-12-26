# Manual Test Script: User Story 2 - Update Existing Todos

**Feature**: Simple Todo CRUD Application
**User Story 2**: Update Existing Todos (Priority: P1)
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
   - Should have at least 3-5 todos in the list
   - If empty, create some using US1 steps

---

## Test Case 1: Basic Edit and Save

### Steps

1. **Open the app** with existing todos

2. **Identify a todo to edit**:
   - Find the todo: "Buy groceries"
   - Note its current text exactly

3. **Click the "Edit" button** on "Buy groceries":
   - ✓ Edit modal overlay appears (dark background)
   - ✓ Modal contains input field
   - ✓ Input field has the current text: "Buy groceries"
   - ✓ Input text is pre-selected/highlighted
   - ✓ Focus is in the input field
   - ✓ Modal shows "Save" and "Cancel" buttons

4. **Modify the text**:
   - Clear the input (Ctrl+A or select all)
   - Type: `Buy almond milk`
   - Verify new text appears in input

5. **Click "Save" button**:
   - ✓ Modal closes immediately
   - ✓ Todo text in list updates to "Buy almond milk"
   - ✓ No page reload occurred
   - ✓ Other todos are unchanged
   - ✓ Status bar counts unchanged (still 5 pending | 0 completed)

6. **Verify persistence**:
   - Refresh page (F5)
   - ✓ Todo text is still "Buy almond milk"
   - ✓ Appears in the same position in list
   - ✓ localStorage updated (F12 → Storage → Local Storage → todo_app_todos)
   - ✓ backend/data/todos.json shows updated text

7. **Check API call** (optional, F12 Network tab):
   - ✓ PATCH request sent to http://localhost:3000/api/todos/[id]
   - ✓ Request body: `{ "text": "Buy almond milk" }`
   - ✓ Response: 200 OK with updated todo object

### Expected Result: ✅ PASS

---

## Test Case 2: Edit Cancel - Discard Changes

### Steps

1. **Find another todo**: e.g., "Write report"

2. **Click Edit** on "Write report":
   - ✓ Modal opens with text "Write report"
   - ✓ Input is focused and text is selected

3. **Modify the text**:
   - Delete all text
   - Type: `TEMPORARY TEXT - THIS SHOULD NOT SAVE`

4. **Click "Cancel" button**:
   - ✓ Modal closes immediately
   - ✓ Todo text remains: "Write report"
   - ✓ Change was NOT applied
   - ✓ No API request was made (check Network tab)
   - ✓ No localStorage update occurred

5. **Press Escape key test**:
   - Click Edit again on same todo
   - Modal opens
   - Type: `THIS SHOULD ALSO NOT SAVE`
   - Press Escape key
   - ✓ Modal closes
   - ✓ Text remains: "Write report"
   - ✓ Changes discarded

### Expected Result: ✅ PASS

---

## Test Case 3: Edit with Empty Text Validation

### Steps

1. **Click Edit** on any todo:
   - Modal opens with current text

2. **Clear the text completely**:
   - Select all (Ctrl+A)
   - Press Delete or Backspace
   - Input is now empty

3. **Click "Save"**:
   - ✓ Modal stays open (does not close)
   - ✓ Error toast appears: "Todo text cannot be empty"
   - ✓ Original todo text unchanged in list
   - ✓ Input field still shows empty state

4. **Enter whitespace only**:
   - Type: `     ` (5 spaces)
   - Click Save
   - ✓ Error toast appears: "Please enter a todo text"
   - ✓ Modal stays open
   - ✓ Form not submitted

5. **Clear and try again**:
   - Delete whitespace
   - Type valid text: `Valid todo text`
   - Click Save
   - ✓ Modal closes
   - ✓ Todo updates successfully

### Expected Result: ✅ PASS

---

## Test Case 4: Edit with 500+ Character Limit

### Steps

1. **Click Edit** on any todo

2. **Generate long text**:
   - Type very long text (or copy-paste Lorem Ipsum repeatedly)
   - Make it over 500 characters

3. **Click Save**:
   - ✓ Error toast appears: "Todo text cannot exceed 500 characters"
   - ✓ Modal stays open
   - ✓ Text not saved

4. **Verify character counting**:
   - Type exactly 500 characters
   - Click Save
   - ✓ Should succeed (500 is the limit, not 501)
   - ✓ Modal closes
   - ✓ Todo updated

5. **Edit again** and check the saved text:
   - ✓ Shows exactly what you entered (trimmed whitespace)

### Expected Result: ✅ PASS

---

## Test Case 5: Edit Multiple Different Todos

### Steps

1. **With your list of 5+ todos**, edit 3 different ones:

   **Todo 1**: "Buy groceries" → "Shop for groceries"
   - Click Edit
   - Change text
   - Save
   - ✓ Updates immediately
   - ✓ Other todos unchanged

   **Todo 2**: "Write report" → "Finish quarterly report"
   - Click Edit
   - Change text
   - Save
   - ✓ Updates immediately

   **Todo 3**: "Call mom" → "Call mom on Sunday"
   - Click Edit
   - Change text
   - Save
   - ✓ Updates immediately

2. **Verify all changes persisted**:
   - Refresh page
   - ✓ All 3 edited todos show new text
   - ✓ Order unchanged
   - ✓ All other todos unchanged

3. **Check final state**:
   - ✓ Pending count unchanged (still 5)
   - ✓ Completed count unchanged (still 0)

### Expected Result: ✅ PASS

---

## Test Case 6: Edit Modal Accessibility

### Steps

1. **Open Edit modal**:
   - Click Edit button
   - Modal appears

2. **Keyboard navigation**:
   - ✓ Tab key moves focus through modal elements
   - ✓ Can tab to input, Save button, Cancel button
   - ✓ Can use Shift+Tab to go backwards
   - ✓ Escape key closes modal

3. **Focus management**:
   - Open modal
   - ✓ Focus automatically moves to input field
   - ✓ Input text is selected for easy replacement
   - ✓ Closing modal: focus returns to Edit button (ideally)

4. **Screen reader** (if testing with screen reader):
   - ✓ Modal is announced as dialog
   - ✓ Input label is clear: "Edit Todo"
   - ✓ Buttons are properly announced
   - ✓ Error messages are announced as alerts

### Expected Result: ✅ PASS

---

## Test Case 7: Rapid Edits - Concurrent Operations

### Steps

1. **Edit a todo** and immediately click "Edit" on another todo:
   - First modal opens
   - Click Edit on a different todo while first modal is open
   - ✓ First modal closes
   - ✓ Second modal opens with second todo's text
   - ✓ No duplicate requests sent

2. **Edit one todo multiple times**:
   - Click Edit on "Todo A"
   - Change text
   - Save
   - ✓ Updates successfully
   - Immediately Click Edit again on same todo
   - Modal opens with NEW text (from previous edit)
   - Change again
   - Save
   - ✓ Updates successfully
   - ✓ No conflicts

3. **Edit while another API call pending**:
   - Slow down network (DevTools → Network → throttle to "Slow 3G")
   - Click Edit on Todo A
   - Change text
   - Click Save (API call starts)
   - While pending, try to edit different Todo B
   - ✓ UI remains responsive
   - ✓ First edit completes successfully
   - ✓ Second edit can start

### Expected Result: ✅ PASS

---

## Test Case 8: API Error Handling During Edit

### Steps

1. **Stop the backend server** (Ctrl+C in backend terminal)

2. **Try to edit a todo**:
   - Click Edit
   - Modal opens
   - Change text
   - Click Save
   - ✓ Error toast appears: "Failed to update todo: Network error..."
   - ✓ Modal closes (or stays open - implementation choice)
   - ✓ Original text in list is unchanged (NOT the new text)

3. **Check localStorage**:
   - F12 → Storage → Local Storage
   - ✓ Old text is still in `todo_app_todos` (not the new text)
   - ✓ Cache is consistent with what's displayed

4. **Restart backend server**:
   - Run `npm start` in backend terminal again
   - ✓ Server comes back up
   - Wait for "listening" message

5. **Try the edit again**:
   - Click Edit on same todo
   - Change text (to something different this time)
   - Click Save
   - ✓ Edit succeeds
   - ✓ Text updates
   - ✓ Syncs back to backend

### Expected Result: ✅ PASS

---

## Test Case 9: Edit with Special Characters

### Steps

1. **Click Edit** on any todo

2. **Enter special characters**:
   - Type: `Buy 🥬 vegetables & 🍎 apples! (fresh & organic)`

3. **Click Save**:
   - ✓ Modal closes
   - ✓ Text displays correctly with emojis and special chars
   - ✓ Persists to localStorage
   - Refresh page
   - ✓ Emojis and special chars still display correctly

4. **Try HTML-like characters**:
   - Type: `<script>alert('test')</script>`
   - Save
   - ✓ Displays as literal text (not executed)
   - ✓ Shows angle brackets, not HTML
   - ✓ Safe from XSS

### Expected Result: ✅ PASS

---

## Test Case 10: Edit from Different Views

### Prerequisites
User Story 3 (Mark Complete) needed for this test - skip if not implemented

### Steps

1. **If US3 available**: Mark some todos as complete:
   - Click checkboxes to create mix of pending/completed

2. **Filter to "Pending"**:
   - Click "Pending" filter button
   - Edit one of the visible pending todos
   - ✓ Modal shows current text
   - ✓ Save works
   - ✓ Todo updates in filtered view

3. **Filter to "Completed"**:
   - Click "Completed" filter button
   - (todos should be hidden if US3 not done yet)
   - Try to edit - should not be visible

4. **Filter to "All"**:
   - Click "All" filter button
   - Edit any todo
   - ✓ Works correctly
   - ✓ Counts update
   - ✓ Filter state maintained

### Expected Result: ✅ PASS

---

## Acceptance Criteria Checklist

### Core Features (US2)

- [ ] Users can click "Edit" button on any todo
- [ ] Edit modal appears with current todo text
- [ ] Input field is pre-filled with current text
- [ ] Input text is selected/highlighted for easy replacement
- [ ] Users can modify the text
- [ ] Users can save changes by clicking "Save"
- [ ] Todo updates immediately in list (no reload)
- [ ] Users can cancel edits (changes discarded)
- [ ] Escape key closes edit modal
- [ ] Changes persist after page refresh
- [ ] Changes sync to localStorage
- [ ] Changes sync to backend (todos.json)
- [ ] Empty text is rejected with error
- [ ] Whitespace-only text is rejected
- [ ] 500+ character text is rejected
- [ ] Valid edits ≤500 characters are accepted
- [ ] API PATCH request is sent with correct data
- [ ] Response status is 200 OK
- [ ] Multiple edits work correctly
- [ ] Error handling when API is unavailable

### Quality Standards

- [ ] No JavaScript console errors
- [ ] No page reloads during edit
- [ ] Modal properly styled and visible
- [ ] Buttons are clickable and responsive
- [ ] Form validation happens client-side
- [ ] Error messages are clear and visible
- [ ] Toast auto-dismisses after error
- [ ] No duplicate API requests
- [ ] Special characters/emojis safe (no XSS)
- [ ] Keyboard navigation works (Tab, Escape)
- [ ] Focus management appropriate
- [ ] Works on mobile (320px+) and desktop (1024px+)

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

- **Modal open time**: <100ms
- **Save on click**: Immediate visual feedback
- **API response**: <100ms
- **UI update**: <50ms after API response
- **No lag**: Typing in input should be fluid

---

## Network Testing

### Throttle Network (F12 → Network tab):

1. **Fast 3G**:
   - Edit and save
   - ✓ Works, maybe takes 1-2 seconds
   - ✓ Form disabled during request
   - ✓ Error message if timeout

2. **Slow 3G**:
   - Edit and save
   - ✓ Works, takes 5-10 seconds
   - ✓ Perceivable delay but works
   - ✓ Error if network drops

3. **Offline**:
   - Edit and save
   - ✓ Error message appears
   - ✓ Original todo unchanged
   - ✓ localStorage still has old value

---

## Troubleshooting

### Modal doesn't open when clicking Edit
- ✓ Check that showEditModal function exists in ui.js
- ✓ Check that Edit button has data-action="edit"
- ✓ Check browser console for JavaScript errors
- ✓ Try refreshing page

### Changes not saving
- ✓ Check backend is running (`npm start`)
- ✓ Check F12 Network tab for failed API requests
- ✓ Check browser console for errors
- ✓ Verify todos.json is writable

### Modal won't close
- ✓ Try pressing Escape key
- ✓ Check console for errors
- ✓ Verify Save/Cancel buttons are present
- ✓ Try refreshing page

### Text not updating after save
- ✓ Check Network tab - did PATCH request complete?
- ✓ Check console for errors
- ✓ Check API response status code
- ✓ Verify api-client.js is loaded

---

## Sign-Off

After completing all test cases:

- [ ] All test cases PASS
- [ ] No console errors
- [ ] No broken features
- [ ] User Story 2 is complete and ready for User Story 3

**Tested By**: _______________
**Date**: _______________
**Result**: PASS / FAIL

---

## Notes

- **API Integration**: PATCH /api/todos/:id with { text: string } payload
- **Status Code**: 200 OK on success, 400 on validation error, 404 if not found
- **Timestamps**: updatedAt should update, createdAt should NOT change
- **Idempotency**: Editing multiple times should be safe
- **Consistency**: Same text entered should produce same result every time
- **Performance**: User shouldn't notice a delay for typical operations

---

## Related User Stories

- **User Story 1** (Create/View): Must be working for this to test
- **User Story 3** (Mark Complete): Can extend tests once implemented
- **User Story 4** (Delete): Can test edit before delete
- **User Story 5** (Filter): Can test edit in different filter views

---

## Links

- **Spec**: `/specs/001-todo-crud/spec.md`
- **Implementation Plan**: `/specs/001-todo-crud/plan.md`
- **All Tasks**: `/specs/001-todo-crud/tasks.md`
- **US1 Tests**: `/tests/manual-user-story-1.md`
