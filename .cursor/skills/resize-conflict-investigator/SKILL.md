---
name: resize-conflict-investigator
description: Deeply investigate and fix UI resize/splitter conflicts (e.g. editor/preview divider affecting an independent chat panel, or chat resize disabled). Use when the user mentions resize conflicts, splitters/dividers, drag handles, activeResizer, mousedown/mousemove/mouseup, pointer events, layout width bugs, or panels resizing unexpectedly.
---

# Resize Conflict Investigator

## Goal

Find and fix **cross-interference** between independent resize systems (split panes vs separate side panels). Deliver a **clean architectural fix** with a clear mental model, not a patchwork of flags.

## Non-negotiables

- Do a **codebase-wide inventory** of resize code before changing behavior.
- Explain the **actual root cause** in concrete terms (shared state, shared listeners, layout coupling, etc.).
- Prefer **pointer events + pointer capture** and **scoped state** over global mutable resize state.
- Add or keep **minimum necessary** global listeners. Never overwrite `document.onmousemove` / `window.onmousemove`.

## Quick start workflow (do this in order)

1. **Reproduce + characterize**
   - Confirm two symptoms independently:
     - Drag editor/preview divider → chat panel width changes (should not).
     - Drag chat panel left edge → does nothing (should resize).
   - Note exact interaction details: which element you grab, cursor changes, whether text selection occurs, whether the drag continues outside the handle, and whether the resize “snaps” or lags.

2. **Inventory all resize entry points (entire repo)**
   - Find all handlers and shared state by searching for:
     - `activeResizer`, `resizer`, `splitter`, `divider`, `drag`, `resizeHandle`, `panelWidth`, `setWidth`, `minWidth`, `maxWidth`
     - `mousedown`, `mousemove`, `mouseup`, `pointerdown`, `pointermove`, `pointerup`
     - `document.addEventListener(`, `window.addEventListener(`, `onmousemove`, `onmouseup`
     - CSS: `cursor: col-resize`, `resize: horizontal`, `flex`, `width:`, `min-width`, `max-width`, `overflow`
   - Produce a short map:
     - **Handles**: which DOM nodes begin a resize.
     - **State**: what variable(s) track the active drag.
     - **Listeners**: where move/up are attached and how they’re removed.
     - **Targets**: which elements’ widths (or flex-basis) are modified.

3. **Build the architecture model**
   - Write a 1-page model (in your response) answering:
     - What are the **independent resize domains**? (e.g., main split vs chat width)
     - Who owns the layout? (CSS flex grid vs manual widths)
     - What is the drag state machine? (idle → dragging handle X → apply deltas → end)
   - Identify exactly where the domains leak into each other.

4. **Root-cause diagnosis checklist**
   - Check each of these, and only then choose a fix:
     - **Shared global drag state**: a single `activeResizer` or `isResizing` toggled by multiple handles.
     - **Shared global move listener**: one `document`-level mousemove handler applies resizing based on stale/ambiguous state.
     - **Event propagation collision**: chat handle events bubble and trigger the main divider, or vice versa (handle contained within another draggable area).
     - **Layout coupling**: changing editor/preview widths changes the flex container so the chat width is implicitly recomputed.
     - **Disabled handle**: CSS (`pointer-events: none`, overlay) or JS never attaches listeners / removes them immediately / wrong selector.
     - **Z-index / overlay**: an invisible element intercepts pointer events so chat drag never starts.

5. **Implement the architectural fix**
   - Target outcome:
     - Main divider drag modifies only editor/preview sizing.
     - Chat drag modifies only chat sizing.
     - The two can’t start each other’s drags and can’t “steal” move events mid-drag.
   - Preferred implementation pattern:
     - Use `pointerdown` on each handle.
     - On `pointerdown`, call `setPointerCapture(pointerId)` on the handle, store drag state on that resizer instance (not global).
     - On `pointermove`, if (and only if) that instance is dragging, apply delta to its own target(s).
     - On `pointerup/pointercancel`, end drag and release capture.
   - If a centralized controller is necessary, enforce **namespacing**:
     - A single controller may exist, but it must track **exactly one active handle** with a unique ID and strictly route moves only to that handle’s domain.
     - No “if activeResizer then resize everything” logic.

6. **Verify with a focused test matrix**
   - **Isolation tests**
     - Drag main divider: chat width remains constant.
     - Drag chat edge: editor/preview widths remain constant.
   - **Boundary tests**
     - Drag beyond min/max widths: clamps correctly without jitter.
     - Drag quickly; release outside window; drag ends reliably.
   - **Ergonomics**
     - Cursor changes correctly over each handle.
     - No text selection during drag; no accidental scroll capture.
   - **Regression scan**
     - Search for leftover global `mousemove` handlers or stale `activeResizer` mutations.

## Output expectations (what to deliver)

In the final response for a resize-conflict task:
- **Root cause**: one paragraph explaining the exact coupling mechanism.
- **What changed**: list of the specific architectural changes (state, listeners, layout).
- **Why it can’t regress easily**: explain the enforced separation between domains.
- **How to test**: quick manual steps + any automated checks you added.

## Additional resources

For common failure modes and fix patterns, see [reference.md](reference.md).

