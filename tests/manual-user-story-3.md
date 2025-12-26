# Manual Test Script: User Story 3 - Mark Todos Complete

**Feature**: Simple Todo CRUD Application
**User Story 3**: Mark Todos Complete (Priority: P1)
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

## Test Case 1: Mark Single Todo as Complete

### Steps

1. **Open the app** with existing todos

2. **Identify a todo to mark complete**:
   - Find the todo: "Buy groceries"
   - Note the checkbox is currently unchecked
   - Note status bar shows: "5 pending | 0 completed"

3. **Click the checkbox** on "Buy groceries":
   - ✓ Checkbox becomes checked (checked state visible)
   - ✓ Todo text changes appearance (strikethrough, dimmed)
   - ✓ Todo item opacity reduces slightly
   - ✓ Status bar updates immediately: "4 pending | 1 completed"
   - ✓ No page reload occurred
   - ✓ Other todos remain unchanged

4. **Verify persistence**:
   - Refresh page (F5)
   - ✓ Todo "Buy groceries" still has checkbox checked
   - ✓ Text still shows strikethrough
   - ✓ Status bar still shows: "4 pending | 1 completed"
   - ✓ localStorage updated (F12 → Storage → Local Storage → todo_app_todos)
   - ✓ `completed: true` in todo object
   - ✓ backend/data/todos.json shows `completed: true` for this todo

5. **Check API call** (optional, F12 Network tab):
   - ✓ PATCH request sent to http://localhost:3000/api/todos/[id]
   - ✓ Request body: `{ "completed": true }`
   - ✓ Response: 200 OK with updated todo object

### Expected Result: ✅ PASS

---

## Test Case 2: Mark Multiple Todos as Complete

### Steps

1. **From previous state**, mark 3 more todos as complete:
   - Click checkbox on "Write report" → ✓ Immediately checks and dims
   - Click checkbox on "Call mom" → ✓ Immediately checks and dims
   - Click checkbox on "Exercise 30 mins" → ✓ Immediately checks and dims

2. **Verify counts update correctly**:
   - ✓ Status bar shows: "1 pending | 4 completed"
   - ✓ Visual distinction clear between completed and pending
   - ✓ All completed todos have strikethrough text

3. **Verify all changes persist**:
   - Refresh page
   - ✓ All 4 completed todos still checked
   - ✓ 1 pending todo still unchecked
   - ✓ Status bar still shows: "1 pending | 4 completed"

### Expected Result: ✅ PASS

---

## Test Case 3: Unmark Todo - Toggle Back to Pending

### Steps

1. **With completed todos visible** (from Test Case 2):
   - Find the completed todo: "Buy groceries"
   - Checkbox is currently checked

2. **Click the checkbox again** to unmark:
   - ✓ Checkbox becomes unchecked
   - ✓ Strikethrough text removed
   - ✓ Todo opacity returns to normal
   - ✓ Status bar updates: "2 pending | 3 completed"
   - ✓ No page reload

3. **Toggle multiple times**:
   - Click same todo checkbox 3 more times
   - ✓ Alternates between checked/unchecked
   - ✓ Each toggle updates counts correctly
   - ✓ 1st click → checked "1 pending | 4 completed"
   - ✓ 2nd click → unchecked "2 pending | 3 completed"
   - ✓ 3rd click → checked "1 pending | 4 completed"

4. **Verify persistence after multiple toggles**:
   - Refresh page
   - ✓ Final state persisted correctly

### Expected Result: ✅ PASS

---

## Test Case 4: Checkbox Visual States and Styling

### Steps

1. **Inspect todo item styling**:
   - Open DevTools (F12)
   - Right-click on a completed todo → Inspect
   - ✓ Element has class `todo-item completed`
   - ✓ Element has `opacity: 0.7` or similar
   - ✓ `.todo-text` has `text-decoration: line-through`
   - ✓ `.todo-text` has reduced color (muted)

2. **Inspect pending todo**:
   - Right-click on pending todo → Inspect
   - ✓ Element has class `todo-item` (no completed)
   - ✓ Normal opacity (1.0)
   - ✓ No text-decoration

3. **Inspect checkbox states**:
   - Right-click on checked checkbox → Inspect
   - ✓ Input element has `checked` attribute
   - ✓ Input type is `checkbox`
   - ✓ Has `class="todo-checkbox"`

4. **Visual verification**:
   - ✓ Completed todos visually distinct from pending
   - ✓ Strikethrough clear and readable
   - ✓ Unchecked checkboxes have proper border/appearance
   - ✓ Checked checkboxes filled/marked clearly
   - ✓ Focus state visible when tabbing through checkboxes

### Expected Result: ✅ PASS

---

## Test Case 5: Status Counts Update Correctly

### Steps

1. **Start fresh** (ideally with known state):
   - Create exactly 5 new todos (or modify backend/data/todos.json)
   - All should be pending
   - Status bar shows: "5 pending | 0 completed"

2. **Mark todos and verify counts each time**:

   **Action 1**: Mark 1st todo
   - ✓ Counts: "4 pending | 1 completed"

   **Action 2**: Mark 2nd todo
   - ✓ Counts: "3 pending | 2 completed"

   **Action 3**: Mark 3rd todo
   - ✓ Counts: "2 pending | 3 completed"

   **Action 4**: Unmark 2nd todo
   - ✓ Counts: "3 pending | 2 completed"

   **Action 5**: Mark 5th todo
   - ✓ Counts: "2 pending | 3 completed"

3. **Verify GET /api/stats endpoint** (optional):
   - DevTools → Network tab
   - Check latest stats response after a toggle
   - ✓ Response shows correct counts

### Expected Result: ✅ PASS

---

## Test Case 6: Checkbox with Filter Integration

### Prerequisites
- At least 5 todos, mix of pending and completed
- Example: "Buy groceries" (complete), "Write report" (pending), "Call mom" (complete), "Exercise" (pending), "Review PRs" (pending)

### Steps

1. **Filter to "All"**:
   - Click "All" button
   - ✓ All 5 todos visible
   - ✓ Status bar shows: "3 pending | 2 completed"
   - Mark "Review PRs" as complete
   - ✓ Checkbox checks
   - ✓ Status bar updates: "2 pending | 3 completed"

2. **Filter to "Pending"**:
   - Click "Pending" button
   - ✓ Only 2 pending todos visible
   - ✓ Completed todos hidden
   - ✓ Status bar still shows: "2 pending | 3 completed"
   - Try to check a pending todo checkbox
   - ✓ Checkbox marks complete
   - ✓ Todo disappears from filtered view
   - ✓ Status bar updates: "1 pending | 4 completed"

3. **Filter to "Completed"**:
   - Click "Completed" button
   - ✓ Only 4 completed todos visible
   - ✓ Pending todos hidden
   - Uncheck one completed todo
   - ✓ Checkbox unchecks
   - ✓ Todo disappears from filtered view
   - ✓ Status bar updates: "2 pending | 3 completed"

4. **Return to "All"**:
   - Click "All" button
   - ✓ All todos visible again with correct states
   - ✓ Counts accurate

### Expected Result: ✅ PASS

---

## Test Case 7: Checkbox Keyboard Accessibility

### Steps

1. **Focus on checkboxes using Tab**:
   - Press Tab repeatedly to cycle through page elements
   - ✓ Focus reaches each checkbox
   - ✓ Focus rectangle/outline visible around checkbox
   - ✓ Focus order is logical (top to bottom)

2. **Toggle with Space key**:
   - Tab to an unchecked checkbox
   - Press Space
   - ✓ Checkbox toggles to checked
   - ✓ Todo styling updates
   - ✓ Status bar updates
   - Press Space again
   - ✓ Checkbox toggles back to unchecked

3. **Toggle with Enter key** (if supported):
   - Some browsers allow Enter to toggle checkboxes
   - ✓ Should work same as Space if implemented

4. **Shift+Tab to go backwards**:
   - After checking a checkbox with Space
   - Press Shift+Tab to go to previous element
   - ✓ Focus moves backwards
   - Tab forward again
   - ✓ Can re-focus checkbox

### Expected Result: ✅ PASS

---

## Test Case 8: API Error Handling During Toggle

### Steps

1. **Stop the backend server** (Ctrl+C in backend terminal)

2. **Try to toggle a todo**:
   - Click a checkbox
   - ✓ Error toast appears: "Failed to update todo: Network error..."
   - ✓ Checkbox reverts to original state (optimistic update is undone)
   - ✓ Status bar reverts to previous counts
   - ✓ Original todo state unchanged

3. **Check localStorage**:
   - F12 → Storage → Local Storage
   - ✓ Old state is preserved in `todo_app_todos`
   - ✓ `completed` value matches what's displayed (not the attempted change)

4. **Restart backend**:
   - Run `npm start` in backend terminal
   - ✓ Server comes back up

5. **Toggle again successfully**:
   - Click same checkbox
   - ✓ This time it succeeds
   - ✓ Checkbox checks/unchecks
   - ✓ Status bar updates
   - ✓ Syncs to backend

### Expected Result: ✅ PASS

---

## Test Case 9: Concurrent Toggle Operations

### Steps

1. **Edit with network throttling**:
   - DevTools → Network tab → Throttle to "Slow 3G"
   - Click checkbox to mark a todo complete
   - While PATCH request is pending, try clicking another checkbox
   - ✓ UI remains responsive
   - ✓ Both toggles eventually complete successfully
   - ✓ Status bar shows final correct count

2. **Rapid successive clicks**:
   - Remove throttling
   - Quickly click same checkbox multiple times
   - ✓ Only final state matters
   - ✓ Status bar eventually reflects correct count
   - ✓ No duplicate requests visible in Network tab (debounced or deduplicated)

3. **Toggle different todos quickly**:
   - Click checkbox on Todo A
   - Immediately click checkbox on Todo B
   - ✓ Both toggle successfully
   - ✓ Counts update correctly

### Expected Result: ✅ PASS

---

## Test Case 10: Completed Todo with Edit/Delete

### Prerequisites
- Several completed todos in list
- Some pending todos

### Steps

1. **Edit a completed todo**:
   - Find a completed todo (with strikethrough)
   - Click "Edit" button
   - Modal opens with current text
   - Change text to: "Modified text"
   - Click Save
   - ✓ Modal closes
   - ✓ Todo text updates
   - ✓ Checkbox still checked
   - ✓ Strikethrough still visible
   - ✓ Status bar unchanged (still shows same completed count)

2. **Delete a completed todo**:
   - Find another completed todo
   - Click "Delete" button
   - Confirmation modal appears
   - Click "Confirm"
   - ✓ Todo removed from list
   - ✓ Status bar updates: "X pending | (Y-1) completed"
   - ✓ Other completed todos remain with strikethrough

3. **Mark an edited todo as incomplete**:
   - Find the todo you edited
   - Click its checkbox to uncheck it
   - ✓ Checkbox unchecks
   - ✓ Strikethrough disappears
   - ✓ Text returns to normal color
   - ✓ Opacity returns to normal
   - ✓ Status bar updates

4. **Delete a pending todo that was previously complete**:
   - Delete this todo
   - ✓ Removed from list
   - ✓ Status bar updates: "(X-1) pending | Y completed"

### Expected Result: ✅ PASS

---

## Test Case 11: Checkbox with Special Characters and Long Text

### Steps

1. **Create todos with special content** (if not already present):
   - Todo 1: "Buy 🥬 vegetables & 🍎 apples"
   - Todo 2: `<script>alert('test')</script>` (should be safe)
   - Todo 3: Very long text (near 500 char limit)

2. **Toggle these todos**:
   - Mark Todo 1 as complete
   - ✓ Emoji displays correctly with strikethrough
   - ✓ Ampersand displays correctly with strikethrough

   - Mark Todo 2 as complete
   - ✓ Script tag displays as literal text with strikethrough
   - ✓ No XSS attack (text is safe)

   - Mark Todo 3 as complete
   - ✓ Long text displays with strikethrough
   - ✓ Text wraps correctly if needed
   - ✓ Strikethrough spans entire text

3. **Verify persistence**:
   - Refresh page
   - ✓ All special characters and long text preserved
   - ✓ Completed state persisted
   - ✓ Styling correct

### Expected Result: ✅ PASS

---

## Test Case 12: Complete All, Then Uncheck All

### Prerequisites
- At least 5 todos, all pending

### Steps

1. **Mark all as complete**:
   - Click checkboxes on all 5 todos
   - After each click, status bar updates
   - ✓ Final state: "0 pending | 5 completed"
   - ✓ All todos have strikethrough
   - ✓ All have reduced opacity

2. **Switch to "Pending" filter**:
   - Click "Pending" button
   - ✓ No todos visible
   - ✓ Empty state message shows
   - ✓ Status bar still shows: "0 pending | 5 completed"

3. **Switch to "Completed" filter**:
   - Click "Completed" button
   - ✓ All 5 todos visible
   - ✓ All have checked checkboxes and strikethrough

4. **Uncheck all**:
   - Go back to "All" filter
   - Click checkboxes on all 5 todos to uncheck them
   - ✓ Final state: "5 pending | 0 completed"
   - ✓ All strikethroughs removed
   - ✓ All opacity returns to normal

5. **Switch to "Completed" filter**:
   - Click "Completed" button
   - ✓ No todos visible (all are pending now)
   - ✓ Status bar shows: "5 pending | 0 completed"

### Expected Result: ✅ PASS

---

## Acceptance Criteria Checklist

### Core Features (US3)

- [ ] Users can click checkbox to mark todo as complete
- [ ] Checkbox checked state reflects todo completion status
- [ ] Completed todos show strikethrough text
- [ ] Completed todos have reduced opacity
- [ ] Clicking checkbox toggles between complete/pending
- [ ] Checkbox state persists after page refresh
- [ ] Checkbox state syncs to localStorage
- [ ] Checkbox state syncs to backend (PATCH request)
- [ ] Status counts update immediately on toggle
- [ ] Status counts accurate (pending + completed = total)
- [ ] API PATCH request sent with correct data: { completed: boolean }
- [ ] Response status is 200 OK
- [ ] Completed todos work with edit functionality
- [ ] Completed todos work with delete functionality
- [ ] Filter shows/hides completed todos correctly
- [ ] Error handling when API unavailable
- [ ] Checkbox resets if API call fails
- [ ] No visual glitches during toggle

### Quality Standards

- [ ] No JavaScript console errors
- [ ] No page reloads during toggle
- [ ] Checkbox visually distinct when checked vs unchecked
- [ ] Strikethrough text is readable
- [ ] Opacity change is subtle but clear
- [ ] Keyboard navigation works (Tab to checkbox)
- [ ] Space/Enter toggles checkbox correctly
- [ ] Focus visible on checkboxes
- [ ] Focus outline proper size and color
- [ ] No duplicate API requests
- [ ] Special characters/emojis safe (no XSS)
- [ ] Works on mobile (320px+) and desktop (1024px+)
- [ ] Responsive design maintained with strikethrough

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

- **Checkbox click response**: <100ms visual feedback
- **Status bar update**: Immediate (<50ms)
- **API response**: <100ms
- **No lag**: Clicking rapid checkboxes should feel responsive
- **No visual stutter**: Animations smooth (strikethrough, opacity transitions)

---

## Network Testing

### Throttle Network (F12 → Network tab):

1. **Fast 3G**:
   - Toggle checkbox
   - ✓ Works, may take 1-2 seconds
   - ✓ Visual feedback immediate (optimistic update)
   - ✓ Eventually syncs to server

2. **Slow 3G**:
   - Toggle checkbox
   - ✓ Works, takes 5-10 seconds
   - ✓ Visual feedback immediate
   - ✓ Status bar updates immediately (optimistic)
   - ✓ Eventually consistent with server

3. **Offline**:
   - Offline mode in DevTools
   - Toggle checkbox
   - ✓ Error message appears
   - ✓ Checkbox reverts to original state
   - ✓ Status bar reverts to original counts

---

## Accessibility Testing

### Keyboard Only (no mouse):

1. **Tab Navigation**:
   - Tab through entire page
   - ✓ Can reach every checkbox
   - ✓ Focus outline visible on each checkbox
   - ✓ Tab order is logical

2. **Toggle Checkboxes**:
   - Tab to checkbox, press Space
   - ✓ Toggles successfully
   - ✓ Status bar updates
   - ✓ Todo styling updates

3. **Screen Reader** (if testing with NVDA/JAWS/VoiceOver):
   - ✓ Checkbox announced as "checkbox"
   - ✓ Checked/unchecked state announced
   - ✓ Todo text announced
   - ✓ Status counts announced clearly

### Color Contrast:

- [ ] Strikethrough text has sufficient contrast with background
- [ ] Normal and completed todos distinguished by more than color alone
- [ ] Works in high contrast mode

---

## Troubleshooting

### Checkbox doesn't toggle when clicked
- ✓ Check that checkbox has `data-id` attribute with todo ID
- ✓ Check app.js has change event listener on `.todo-checkbox`
- ✓ Check browser console for JavaScript errors
- ✓ Try refreshing page

### Counts don't update after toggle
- ✓ Check that updateStats() is called in toggleTodo()
- ✓ Check that status bar elements exist in HTML
- ✓ Verify updateStatusCounts() function is called
- ✓ Check Network tab for PATCH request

### Strikethrough not visible
- ✓ Check CSS has `.todo-item.completed .todo-text { text-decoration: line-through; }`
- ✓ Check element has completed class added after toggle
- ✓ Browser DevTools → Inspect → Check computed styles

### State doesn't persist after refresh
- ✓ Check that PATCH request succeeded (Network tab)
- ✓ Check localStorage has updated value (F12 Storage tab)
- ✓ Check backend/data/todos.json has updated value
- ✓ Verify storageModule.update() is called

### Checkbox reverts after toggle
- ✓ Usually means API call failed
- ✓ Check Network tab for failed PATCH request
- ✓ Check backend is running (`npm start`)
- ✓ Check error toast message for details

---

## Sign-Off

After completing all test cases:

- [ ] All test cases PASS
- [ ] No console errors
- [ ] No broken features
- [ ] User Story 3 is complete and ready for User Story 4

**Tested By**: _______________
**Date**: _______________
**Result**: PASS / FAIL

---

## Notes

- **API Integration**: PATCH /api/todos/:id with { completed: boolean } payload
- **Status Code**: 200 OK on success, 400 on validation error, 404 if not found
- **Timestamps**: updatedAt should update, createdAt should NOT change
- **Idempotency**: Toggling multiple times should be safe
- **Consistency**: Same toggle repeated should produce same result every time
- **Performance**: Toggle should feel instant (<100ms)
- **Optimistic Updates**: UI updates immediately, reverts if API fails

---

## Related User Stories

- **User Story 1** (Create/View): Must be working for this to test
- **User Story 2** (Edit): Can edit completed todos
- **User Story 4** (Delete): Can delete completed todos
- **User Story 5** (Filter): Filters work with completed todos

---

## Links

- **Spec**: `/specs/001-todo-crud/spec.md`
- **Implementation Plan**: `/specs/001-todo-crud/plan.md`
- **All Tasks**: `/specs/001-todo-crud/tasks.md`
- **US1 Tests**: `/tests/manual-user-story-1.md`
- **US2 Tests**: `/tests/manual-user-story-2.md`
