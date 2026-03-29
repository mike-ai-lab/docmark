# Preview Panel Optimization Plan

## Problem
The PreviewPanel is recompiling and reloading the iframe on every interaction, causing:
- White flashing during drag
- Performance lag
- Multiple compilations per drag
- Touch setup running repeatedly
- Tailwind CDN injected on every render

## Solution Architecture

### 1. Persistent Iframe with postMessage
Instead of regenerating HTML and setting `iframe.srcdoc` on every change, we:
- Create iframe ONCE with a persistent HTML shell
- Send compiled code updates via `postMessage`
- Iframe listens for messages and re-renders React root only

### 2. Debounced Compilation (300ms)
- Clear pending compilations before scheduling new ones
- Respect drag state - don't compile while dragging

### 3. Drag State Management
- Use `isDraggingRef` to prevent stale closures
- Block all compilations during drag
- Resume after drag ends

### 4. Single Touch Setup
- Use `touchInitializedRef` to run setup only once
- Don't re-attach listeners on every render

### 5. Static Tailwind Injection
- Include Tailwind CDN in initial iframe HTML only
- Never re-inject on updates

## Implementation Steps

1. Create persistent iframe HTML template (in ReactComponentRenderer)
2. Add postMessage listener in iframe
3. Modify compile flow to use postMessage instead of srcdoc
4. Add debouncing with drag state checks
5. Ensure touch setup runs once
6. Remove excessive logging

## Expected Results
- No white flashing
- No iframe reload
- No lag while dragging
- Single compile per change
- Stable interaction
- Clean console output
