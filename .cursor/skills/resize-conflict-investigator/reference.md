# Reference: diagnosing resize interference

## High-probability root causes (ordered)

1. **One global drag state for multiple handles**
   - Symptoms:
     - Dragging handle A affects target B.
     - Dragging handle B never starts because handle A logic overwrites state.
   - Red flags:
     - `let activeResizer = ...` (or `isResizing`) at module/global scope.
     - Multiple `mousedown`/`pointerdown` sites mutating the same variable.
   - Fix:
     - Move drag state into a dedicated controller that routes by handle ID, or keep state per instance/closure.

2. **Document-level move handler that “guesses” the target**
   - Symptoms:
     - Any drag triggers resizing as long as mouse is down.
     - Random targets resize depending on DOM at the moment.
   - Red flags:
     - `document.addEventListener("mousemove", onMouseMove)` where `onMouseMove` reads DOM each time and applies changes broadly.
   - Fix:
     - Only apply deltas when an explicit handle is active.
     - Prefer pointer capture so you don’t rely on global mousemove for correctness.

3. **Event propagation + accidental handle overlap**
   - Symptoms:
     - Clicking chat edge triggers main divider logic (or vice versa).
   - Red flags:
     - Handles nested inside a container that also starts resize on mousedown.
   - Fix:
     - Use pointer events and stop propagation on `pointerdown` for the handle.
     - Ensure handles are not nested in other draggable elements unless intended.

4. **Layout coupling through flex sizing**
   - Symptoms:
     - Resizing one child changes another child without explicit JS changing it.
   - Red flags:
     - Chat panel uses `flex: 1` or `width` derived from remaining space.
   - Fix:
     - Make chat panel width explicit (e.g., `flex: 0 0 var(--chat-width)`), or isolate layout containers:
       - Outer container: main split area + chat as siblings.
       - Inner container: editor + preview, with their own divider.

5. **Chat resize disabled by CSS / overlays**
   - Symptoms:
     - Cursor never changes; drag never begins; clicks hit something else.
   - Red flags:
     - `pointer-events: none` on handle or ancestor.
     - Transparent overlay with higher z-index.
     - `user-select: text` causing selection instead of drag (not fatal but often correlates).
   - Fix:
     - Ensure handle has `pointer-events: auto`, adequate width (e.g., 6–10px), and highest z-index among overlapping elements.
     - During drag, set `user-select: none` on `body` and revert on end.

## Recommended implementation pattern (vanilla JS)

Use `pointerdown` on the handle; pointer capture keeps the interaction stable even when the pointer leaves the handle.

Checklist:
- Handle has `touch-action: none; cursor: col-resize;`
- On start:
  - record start X and start width
  - `handle.setPointerCapture(e.pointerId)`
  - set a local `dragging = true`
- On move:
  - if not dragging, return
  - compute delta, clamp, apply to the correct target only
- On end/cancel:
  - `dragging = false`
  - release capture (or allow implicit release)

## Verification: “can’t interfere” proof

To be confident the fix is architectural, verify these invariants:
- The main divider code has **no references** to chat DOM nodes or chat width variables.
- The chat resizer code has **no references** to editor/preview DOM nodes or their sizing variables.
- There is **no shared global** mutable state used by both resize systems.
- Move handlers route by **explicit active-handle identity**, not by DOM queries or heuristics.

