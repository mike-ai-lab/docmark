# Current Issues with Preview Panel

## Problem 1: Mobile View Not Rendering
- When switching to mobile view, the iframe shows completely blank
- Desktop view works fine and renders React components correctly
- The iframe exists in mobile view but has no content
- Likely issue: iframe initialization happens once per file type, but mobile view needs the iframe to be accessible/visible

## Problem 2: Touch Pointer Position Wrong
- Touch pointer appears outside the mobile phone frame
- In small preview panel (initial state): pointer shows near explorer panel (far left)
- In maximized view: pointer works correctly
- In mobile view: pointer is enabled but positioned outside the mobile layout frame
- Issue: pointer uses `clientX/clientY` which are relative to viewport, not to the iframe or mobile frame container

## What Works
- Desktop view with touch mode enabled/disabled works correctly
- Rendering works in desktop view
- Drag gestures work in desktop view when maximized
- Monaco Editor works (worker errors suppressed)

## Root Causes
1. **Mobile rendering**: iframe might not be receiving postMessage updates when inside the mobile frame wrapper, or iframe isn't properly initialized when view mode changes
2. **Pointer positioning**: using absolute viewport coordinates (`clientX/clientY`) instead of coordinates relative to the iframe's bounding rectangle

## Expected Behavior
- Mobile view should show the same React component as desktop view
- Touch pointer should appear at cursor position within the iframe bounds, regardless of panel size or mobile frame
- Pointer should be contained within the mobile phone frame in mobile view
