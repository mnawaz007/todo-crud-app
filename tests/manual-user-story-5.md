# Manual Test Script: User Story 5 - Filter Todos

**Feature**: Simple Todo CRUD Application
**User Story 5**: Filter Todos (Priority: P2)
**Created**: 2025-12-27
**Dependencies**: User Stories 1-3 must be complete (create/view/toggle working)

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

4. **Test data prepared**:
   - Should have at least 5 todos
   - Mix of pending and completed: at least 3 pending, 2-3 completed
   - Example:
     - Pending: "Buy groceries", "Write report", "Call mom"
     - Completed: "Exercise 30 mins", "Review PRs"

---

## Test Case 1: Filter Buttons Initial State

### Steps

1. **Open the app** with mixed pending/completed todos

2. **Verify filter buttons exist**:
   - ✓ "All" button visible
   - ✓ "Pending" button visible
   - ✓ "Completed" button visible
   - ✓ Buttons are clearly labeled
   - ✓ Buttons are clickable

3. **Check initial active state**:
   - ✓ "All" button is active (highlighted/primary color)
   - ✓ "Pending" and "Completed" buttons are inactive
   - ✓ aria-pressed="true" on "All" button
   - ✓ aria-pressed="false" on others

4. **Verify all todos visible**:
   - ✓ All todos displayed (both pending and completed)
   - ✓ Status bar shows total: "3 pending | 2 completed"

### Expected Result: ✅ PASS

---

## Test Case 2: Filter to Pending - Show Only Uncompleted

### Steps

1. **From "All" view**, click "Pending" button:
   - ✓ Button becomes active (highlighted)
   - ✓ aria-pressed="true" on Pending button
   - ✓ "All" button becomes inactive
   - ✓ aria-pressed="false" on All button

2. **Verify filtered display**:
   - ✓ Only pending todos visible: "Buy groceries", "Write report", "Call mom"
   - ✓ Completed todos hidden: "Exercise 30 mins", "Review PRs" not visible
   - ✓ List shows 3 todos (only pending ones)
   - ✓ No empty state message (still have pending todos)

3. **Check status bar**:
   - ✓ Status bar still shows: "3 pending | 2 completed" (total counts, not filtered)
   - ✓ Counts reflect full list state, not filtered view

4. **Verify visual distinction**:
   - ✓ Visible todos have no strikethrough
   - ✓ Visible todos have normal opacity
   - ✓ All visible checkboxes are unchecked

### Expected Result: ✅ PASS

---

## Test Case 3: Filter to Completed - Show Only Done

### Steps

1. **From "Pending" view**, click "Completed" button:
   - ✓ Button becomes active
   - ✓ "Pending" button becomes inactive
   - ✓ aria-pressed updates accordingly

2. **Verify filtered display**:
   - ✓ Only completed todos visible: "Exercise 30 mins", "Review PRs"
   - ✓ Pending todos hidden: "Buy groceries", "Write report", "Call mom"
   - ✓ List shows 2 todos (only completed ones)

3. **Check status bar**:
   - ✓ Status bar still shows: "3 pending | 2 completed" (full list totals)

4. **Verify visual state**:
   - ✓ All visible todos have strikethrough text
   - ✓ All visible todos have reduced opacity
   - ✓ All visible checkboxes are checked

### Expected Result: ✅ PASS

---

## Test Case 4: Filter Back to All - Show Everything

### Steps

1. **From "Completed" view**, click "All" button:
   - ✓ "All" button becomes active
   - ✓ "Completed" button becomes inactive

2. **Verify all todos visible again**:
   - ✓ All 5 todos displayed
   - ✓ Pending todos visible without strikethrough
   - ✓ Completed todos visible with strikethrough
   - ✓ Status bar: "3 pending | 2 completed"

3. **Visual verification**:
   - ✓ Mixed display: some with strikethrough, some without
   - ✓ Mixed checkboxes: some checked, some unchecked
   - ✓ Proper ordering maintained

### Expected Result: ✅ PASS

---

## Test Case 5: Filter Does NOT Affect Counts

### Steps

1. **Start with "All" filter** (5 todos: 3 pending, 2 completed):
   - Status bar: "3 pending | 2 completed"
   - All 5 todos visible

2. **Switch to "Pending" filter**:
   - Only 3 todos visible
   - Status bar STILL shows: "3 pending | 2 completed" ← **Full counts, not filtered**

3. **Switch to "Completed" filter**:
   - Only 2 todos visible
   - Status bar STILL shows: "3 pending | 2 completed" ← **Full counts, not filtered**

4. **Switch back to "All"**:
   - Status bar: "3 pending | 2 completed"

5. **Create new todo** (while in any filter):
   - Type: "New task"
   - Click Add
   - ✓ New todo appears in current filter (if pending)
   - ✓ Status bar updates: "4 pending | 2 completed"

### Expected Result: ✅ PASS

---

## Test Case 6: Toggle Todo While Filtered

### Prerequisites
- Todos filtered to "Pending" view
- Show only pending todos

### Steps

1. **Mark a pending todo as complete**:
   - Find "Buy groceries" in Pending filter view
   - Click its checkbox
   - ✓ Checkbox checked
   - ✓ Text gets strikethrough
   - ✓ Status bar updates: "2 pending | 3 completed"
   - ✓ Todo immediately disappears from Pending filtered view

2. **Verify it appears in Completed filter**:
   - Click "Completed" button
   - ✓ "Buy groceries" now visible in Completed view
   - ✓ Has checkbox checked and strikethrough

3. **Mark completed todo back to pending**:
   - Click checkbox on "Buy groceries"
   - ✓ Checkbox unchecked
   - ✓ Strikethrough removed
   - ✓ Status bar updates: "3 pending | 2 completed"
   - ✓ Todo disappears from Completed view

4. **Verify it reappears in Pending filter**:
   - Click "Pending" button
   - ✓ "Buy groceries" visible again
   - ✓ No strikethrough, unchecked

### Expected Result: ✅ PASS

---

## Test Case 7: Create Todo While Filtered

### Steps

1. **Filter to "Pending" view**:
   - Shows only pending todos (3)
   - Status bar: "3 pending | 2 completed"

2. **Create new pending todo**:
   - Type: "New pending task"
   - Click Add
   - ✓ Input field clears
   - ✓ New todo appears at end of filtered list
   - ✓ Status bar updates: "4 pending | 2 completed"
   - ✓ New todo has unchecked checkbox

3. **Switch to "Completed" filter**:
   - ✓ New todo NOT visible (it's pending, not completed)
   - ✓ Still shows 2 completed todos
   - ✓ Status bar: "4 pending | 2 completed"

4. **Switch to "All" filter**:
   - ✓ New pending task now visible
   - ✓ All 6 todos displayed (4 pending, 2 completed)

### Expected Result: ✅ PASS

---

## Test Case 8: Delete Todo While Filtered

### Prerequisites
- Todos visible in a filtered view

### Steps

1. **Filter to "Pending" view**:
   - Shows 3 pending todos

2. **Delete a pending todo**:
   - Click Delete on "Write report"
   - Click Confirm
   - ✓ Todo removed from Pending filtered view
   - ✓ List now shows 2 pending todos
   - ✓ Status bar updates: "2 pending | 2 completed"

3. **Switch to "Completed" filter**:
   - ✓ Still shows 2 completed todos
   - ✓ Deleted todo (Write report) not here (it was pending anyway)

4. **Switch to "All" filter**:
   - ✓ Now shows 4 todos (2 pending, 2 completed)
   - ✓ "Write report" permanently gone

5. **Filter back to "Pending"**:
   - ✓ Shows 2 pending todos (Write report gone)

### Expected Result: ✅ PASS

---

## Test Case 9: Edit Todo While Filtered - Text Change

### Prerequisites
- Todos in "Pending" filtered view

### Steps

1. **Filter to "Pending" view**

2. **Edit a pending todo's text**:
   - Click Edit on "Call mom"
   - Change to: "Call mom on Sunday"
   - Save
   - ✓ Text updates immediately in Pending view
   - ✓ Todo remains in Pending view
   - ✓ Status bar unchanged: "2 pending | 2 completed"

3. **Switch to "All" filter**:
   - ✓ "Call mom on Sunday" visible
   - ✓ Still pending (no strikethrough)

4. **Switch to "Completed" filter**:
   - ✓ Not visible (it's still pending)

5. **Filter back to "Pending"**:
   - ✓ Shows updated text: "Call mom on Sunday"

### Expected Result: ✅ PASS

---

## Test Case 10: Empty Pending Filter (All Todos Completed)

### Steps

1. **Start with todos: 1 pending, 4 completed**

2. **Filter to "Pending"**:
   - ✓ Shows 1 pending todo
   - ✓ Status bar: "1 pending | 4 completed"

3. **Mark last pending todo as complete**:
   - Click checkbox on pending todo
   - ✓ Status bar updates: "0 pending | 5 completed"
   - ✓ Todo disappears from Pending view
   - ✓ Empty state appears: "📝 No todos yet"

4. **Try filtering**:
   - Click "Completed" button
   - ✓ Shows 5 completed todos
   - Click "Pending" button
   - ✓ Shows empty state: "📝 No todos yet"

5. **Still in "Pending" filter, create new todo**:
   - Type: "New task"
   - Click Add
   - ✓ New pending todo appears in Pending view
   - ✓ Empty state disappears
   - ✓ Status bar: "1 pending | 5 completed"

### Expected Result: ✅ PASS

---

## Test Case 11: Empty Completed Filter (No Completed Todos)

### Steps

1. **Mark all todos as pending**:
   - Complete todos only exist from Test Case 10
   - Create 5 new todos and leave all pending

2. **Filter to "Completed"**:
   - ✓ Empty state appears: "📝 No todos yet"
   - ✓ Status bar: "5 pending | 0 completed"

3. **Create new todo while in "Completed" filter**:
   - Type: "New task"
   - Click Add
   - ✓ Empty state disappears (new todo appears... wait, it's pending!)
   - Actually, new todo is pending, so it stays in empty state

4. **Complete one of the pending todos**:
   - First, switch to "All" or "Pending" filter
   - Mark a pending todo as complete
   - ✓ Status bar: "4 pending | 1 completed"
   - Switch to "Completed" filter
   - ✓ Now shows 1 completed todo
   - ✓ Empty state gone

### Expected Result: ✅ PASS

---

## Test Case 12: Filter Button States and Styling

### Steps

1. **Visual inspection of filter buttons**:
   - ✓ Three buttons visible: "All", "Pending", "Completed"
   - ✓ Active button has primary color (blue or highlight)
   - ✓ Inactive buttons have secondary color (gray)
   - ✓ Buttons are large enough to click (mobile-friendly)
   - ✓ Text is clear and readable

2. **Interactive state changes**:
   - Click "Pending"
   - ✓ "Pending" button highlights
   - ✓ "All" button returns to normal color
   - Click "All"
   - ✓ "All" button highlights again
   - ✓ "Pending" returns to normal

3. **Focus and accessibility**:
   - Tab to first filter button
   - ✓ Focus outline visible
   - Tab through buttons
   - ✓ Can reach all three buttons
   - ✓ Focus order is logical

4. **Inspect element states**:
   - Right-click on "Pending" button
   - Inspect
   - ✓ Has class `active` (or aria-pressed="true")
   - When inactive:
   - ✓ Class removed (or aria-pressed="false")

### Expected Result: ✅ PASS

---

## Test Case 13: Filter Persistence on Page Refresh

### Steps

1. **Filter to "Pending"**:
   - Shows only pending todos
   - "Pending" button is active

2. **Refresh page**:
   - Press F5
   - Wait for page to load

3. **Check filter state**:
   - ✓ "Pending" button is still active (OR defaults back to "All")
   - **Note**: Design choice if filter persists or resets to "All"
   - ✓ List displays correctly based on current filter
   - ✓ Todos loaded correctly (from localStorage/API)

4. **Test with other filters**:
   - Filter to "Completed"
   - Refresh
   - ✓ Either "Completed" persists or resets to "All"
   - Either behavior is acceptable if consistent

### Expected Result: ✅ PASS (behavior depends on design)

---

## Test Case 14: Rapid Filter Switching

### Steps

1. **Click filter buttons rapidly**:
   - "All" → "Pending" → "Completed" → "All" → "Pending"
   - ✓ UI updates correctly for each filter
   - ✓ No lag or glitches
   - ✓ Active button state correct each time
   - ✓ List displays correct todos each time

2. **Spam click same button**:
   - Click "Pending" multiple times
   - ✓ Stays on "Pending"
   - ✓ List doesn't flicker or re-render unnecessarily
   - ✓ No error messages

3. **Click while todos updating**:
   - Start creating/deleting/toggling todo
   - While operation pending, switch filters
   - ✓ Filters still work
   - ✓ List updates correctly
   - ✓ Counts eventually correct

### Expected Result: ✅ PASS

---

## Test Case 15: Filter with Different Viewport Sizes

### Steps

1. **Test on desktop (1024px+)**:
   - Filter buttons visible and usable
   - ✓ All buttons clearly visible in row
   - ✓ Styling appropriate for desktop
   - ✓ List responsive to filter changes

2. **Test on tablet (768px)**:
   - Resize browser or use DevTools device emulation
   - ✓ Filter buttons visible
   - ✓ May stack or adjust layout for tablet
   - ✓ Still clickable and functional
   - ✓ Filter switching works

3. **Test on mobile (320px-480px)**:
   - Use DevTools mobile emulation (iPhone SE, etc.)
   - ✓ Filter buttons visible (may be stacked or smaller)
   - ✓ Buttons are tap-friendly (44px+ minimum)
   - ✓ Filter works correctly
   - ✓ Todo list displays correctly filtered

4. **Resize browser window**:
   - Drag to resize from desktop → tablet → mobile
   - ✓ Filter buttons adjust responsively
   - ✓ Filter state maintained during resize
   - ✓ List continues to work correctly

### Expected Result: ✅ PASS

---

## Test Case 16: Filter with Network Simulation

### Steps

1. **Set network to "Slow 3G"** (F12 → Network tab)

2. **Switch filters rapidly**:
   - Click "All" → "Pending" → "Completed"
   - ✓ Buttons respond to clicks immediately
   - ✓ UI updates (not waiting for network)
   - ✓ List shows filtered todos from cache (localStorage)

3. **Toggle todo while on slow network**:
   - In "Pending" filter
   - Mark a pending todo as complete
   - While API request pending, switch to "Completed" filter
   - ✓ Switch works immediately
   - ✓ Completed filter shows the todo once API responds

4. **Create todo while filtered on slow network**:
   - Filter to "Pending"
   - Type and submit new todo
   - While API call pending, switch filters
   - ✓ Can switch filters
   - ✓ New todo appears in correct filter once API responds

### Expected Result: ✅ PASS

---

## Test Case 17: Filter with Offline Mode

### Steps

1. **Enable offline mode** (F12 → Network → Offline)

2. **Try switching filters**:
   - Click "Pending"
   - ✓ Works (local state, no network needed)
   - Click "Completed"
   - ✓ Works
   - Click "All"
   - ✓ Works

3. **Verify todos displayed**:
   - ✓ Todos load from localStorage
   - ✓ Filtering works from cached todos
   - ✓ Status bar shows counts from cache

4. **Try creating todo while offline**:
   - While in "Pending" filter
   - Type: "Offline task"
   - Click Add
   - ✓ Error toast appears (network error)
   - ✓ Todo not added to list (or added locally with sync pending)
   - ✓ Filter state maintained

5. **Go back online**:
   - Remove offline mode
   - ✓ Page syncs with server
   - ✓ Filtering still works
   - ✓ Status bar updates if any changes synced

### Expected Result: ✅ PASS

---

## Test Case 18: Filter Button Accessibility

### Steps

1. **Screen reader testing**:
   - ✓ Filter buttons announced as buttons
   - ✓ Button text "All", "Pending", "Completed" announced
   - ✓ Active/pressed state announced ("pressed" for active button)
   - ✓ Changing filter is announced to screen reader

2. **Keyboard-only navigation**:
   - Tab to filter buttons
   - ✓ Focus reaches each button
   - ✓ Focus outline visible
   - Press Enter or Space on button
   - ✓ Filter changes
   - ✓ Screen reader announces new state

3. **Focus management**:
   - Click a filter button
   - ✓ Focus remains on button (or moves appropriately)
   - Filter switches
   - ✓ List updates without moving focus away

### Expected Result: ✅ PASS

---

## Acceptance Criteria Checklist

### Core Features (US5)

- [ ] Filter buttons visible: "All", "Pending", "Completed"
- [ ] "All" button shows all todos (pending + completed)
- [ ] "Pending" button shows only uncompleted todos
- [ ] "Completed" button shows only completed todos
- [ ] Active filter button is visually distinct (highlighted)
- [ ] Clicking filter button changes active state
- [ ] List updates immediately to show filtered todos
- [ ] Filter does NOT affect status bar counts (shows full totals)
- [ ] Toggling todo while filtered: updates correctly, disappears if no longer matches filter
- [ ] Creating todo while filtered: appears if matches filter, status bar updates with full count
- [ ] Deleting todo while filtered: removes from list and updates counts
- [ ] Editing todo while filtered: text updates, remains in current filter
- [ ] Empty state shows when filtered view has no todos
- [ ] Filter state has proper aria-pressed attributes
- [ ] Filter buttons are keyboard accessible
- [ ] Filter works on all viewport sizes (mobile, tablet, desktop)
- [ ] Filter buttons are touch-friendly (44px+ minimum on mobile)
- [ ] Filter state transitions are smooth (no flashing)

### Quality Standards

- [ ] No JavaScript console errors
- [ ] Filter switching is instant (no lag)
- [ ] No page reloads when filtering
- [ ] Button states update correctly
- [ ] aria-pressed attribute updates correctly
- [ ] Focus management appropriate
- [ ] Keyboard navigation works (Tab through buttons, Enter to activate)
- [ ] Works offline (filters from cached todos)
- [ ] Works on slow network (immediate visual feedback)
- [ ] Responsive design: buttons adjust layout for mobile
- [ ] Works in all modern browsers
- [ ] Filter persists appropriately (or resets, if that's the design)

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

- **Filter button click response**: Immediate (<50ms)
- **List update on filter change**: <100ms
- **No lag**: Rapid filter switching should be smooth
- **Mobile performance**: Buttons responsive on 3G networks

---

## Network Testing

### Throttle Network (F12 → Network tab):

1. **Fast 3G**:
   - Switch filters
   - ✓ Buttons respond immediately
   - ✓ List updates from cache (no wait)
   - ✓ API calls in background

2. **Slow 3G**:
   - Switch filters
   - ✓ Buttons respond immediately
   - ✓ List shows cached todos
   - ✓ No perceived delay

3. **Offline**:
   - Offline mode
   - Switch filters
   - ✓ Works completely (from localStorage)
   - ✓ Filtering functional

---

## Troubleshooting

### Filter buttons don't exist
- ✓ Check index.html has filter button elements
- ✓ Check they have `class="filter-btn"`
- ✓ Check they have `data-status="all|pending|completed"`
- ✓ Check styles.css has .filter-btn styles

### Clicking filter doesn't change display
- ✓ Check app.js has filter button event listener
- ✓ Check renderFilteredTodos() function exists
- ✓ Check currentFilter global is updated
- ✓ Check console for JavaScript errors

### Active button doesn't highlight
- ✓ Check setActiveFilter() function in ui.js
- ✓ Check CSS has .filter-btn.active styling
- ✓ Check aria-pressed attribute is being set
- ✓ Inspect element to see if class is actually added

### Filter doesn't hide correct todos
- ✓ Check renderFilteredTodos() logic for filtering
- ✓ Check that completed property is correctly set on todos
- ✓ Verify the filter condition in app.js:
     - pending: !todo.completed
     - completed: todo.completed
- ✓ Check console logs for actual vs expected filtered todos

### Counts show filtered counts instead of total
- ✓ Status bar should always show full list counts, not filtered
- ✓ Check updateStats() uses allTodos, not filtered array
- ✓ Counts should reflect "3 pending | 2 completed" even when showing only Pending

---

## Sign-Off

After completing all test cases:

- [ ] All test cases PASS
- [ ] No console errors
- [ ] No broken features
- [ ] User Story 5 is complete and feature-complete

**Tested By**: _______________
**Date**: _______________
**Result**: PASS / FAIL

---

## Notes

- **Filter State**: Buttons update aria-pressed and visual styling
- **Counts**: Status bar always shows full totals, not filtered counts
- **Empty State**: Shows when filtered view has no todos
- **Performance**: Filter switching should feel instant (local state, no API)
- **Persistence**: Filter state optional (can reset to "All" on refresh)
- **Offline**: Filters work from localStorage even without API

---

## Related User Stories

- **User Story 1** (Create/View): Todos created appear in correct filter
- **User Story 2** (Edit): Edited text remains in same filter
- **User Story 3** (Mark Complete): Toggle changes filter visibility appropriately
- **User Story 4** (Delete): Deleted todo disappears from filtered view

---

## Links

- **Spec**: `/specs/001-todo-crud/spec.md`
- **Implementation Plan**: `/specs/001-todo-crud/plan.md`
- **All Tasks**: `/specs/001-todo-crud/tasks.md`
- **US1 Tests**: `/tests/manual-user-story-1.md`
- **US2 Tests**: `/tests/manual-user-story-2.md`
- **US3 Tests**: `/tests/manual-user-story-3.md`
- **US4 Tests**: `/tests/manual-user-story-4.md`
