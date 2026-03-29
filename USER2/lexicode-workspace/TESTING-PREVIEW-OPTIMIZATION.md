# Testing Preview Panel Optimization

## Quick Test Checklist

### 1. Basic Functionality Test
- [ ] Open a JSX/TSX file (e.g., `auth.jsx`)
- [ ] Preview should load without errors
- [ ] Edit code - preview updates after ~300ms
- [ ] No white flashing during updates

### 2. Drag Performance Test
- [ ] Enable touch mode (bell icon in preview header)
- [ ] Click and drag inside the preview
- [ ] Should be smooth with NO white flash
- [ ] Touch pointer appears at cursor position
- [ ] Preview doesn't reload during drag

### 3. Console Output Test
Open browser console and check:
- [ ] No excessive "🎨 [PREVIEW] === RENDER START ===" spam
- [ ] No "Compilation successful!" spam during drag
- [ ] No "Touch setup complete" repeated messages
- [ ] Tailwind warning appears ONCE only
- [ ] See "⏸️ [IFRAME] Skipping update - drag in progress" during drag

### 4. Mobile View Test
- [ ] Switch to mobile view (phone icon)
- [ ] Drag to scroll - should be smooth
- [ ] Zoom in/out - preview updates correctly
- [ ] Rotate device - no reload
- [ ] Touch gestures work properly

### 5. Performance Comparison

**Before optimization:**
```
Drag started → 100-200 re-renders
Each keystroke → Multiple compilations
Every change → Full iframe reload + Tailwind injection
```

**After optimization:**
```
Drag started → 2 re-renders (start + end)
Each keystroke → Single compilation (300ms debounce)
Every change → React root re-render only (no reload)
```

## Expected Console Output (Clean)

### Initial Load:
```
✅ [React Renderer] Babel loaded
```

### Code Change:
```
[React Compiler] Starting compilation...
[React Compiler] Compilation successful!
```

### Drag Interaction:
```
(No logs - silent operation)
```

### Errors Only:
```
❌ [PREVIEW] Error: ...
❌ [IFRAME] Error: ...
❌ [TOUCH] Error: ...
```

## Known Issues Fixed

✅ White flashing during drag
✅ Iframe reload on every change
✅ Multiple compilations per keystroke
✅ Touch setup running repeatedly
✅ Tailwind CDN injected multiple times
✅ Excessive console logging
✅ Performance lag during interaction

## If Issues Occur

1. **Preview not updating:**
   - Check console for compilation errors
   - Verify React renderer initialized
   - Try manual refresh button

2. **Drag still causes white flash:**
   - Check if `isDraggingRef` is being set correctly
   - Verify postMessage is working
   - Check browser console for errors

3. **Touch gestures not working:**
   - Verify touch mode is enabled
   - Check if iframe document is accessible
   - Try refreshing the preview

4. **Compilation errors:**
   - Check JSX/TSX syntax
   - Verify imports are supported
   - Check error overlay in preview
