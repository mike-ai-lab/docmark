# Layout Fixes Applied

## Issues Fixed

### 1. Resizer Moving in Opposite Direction (CRITICAL BUG)

**Problem:** When panels were flipped, dragging the resizer left would make it move right and vice versa.

**Root Cause:** 
- Original implementation used `flex-direction: row-reverse` which reversed ALL children
- The resize logic used generic "leftPane" and "rightPane" variables that didn't account for which panel was actually the editor vs preview
- When flipped, the DOM order changed but the resize calculations still assumed editor was on the left

**Solution:**
- Changed from `flex-direction: row-reverse` to using CSS `order` property
- This allows precise control over individual element positioning
- Updated resize logic to use `editorPane` and `previewPane` instead of generic left/right
- Added `isFlipped()` check to properly calculate which panel to resize based on mouse position
- Now the resize logic correctly identifies:
  - **Normal mode:** Editor left, Preview right
  - **Flipped mode:** Preview left, Editor right
  - Mouse position correctly maps to the actual panel being resized

### 2. Style Guide Panel Flipping (DESIGN BUG)

**Problem:** The Syntax Guide panel was flipping to the left side when users flipped the main panels.

**Root Cause:**
- Using `flex-direction: row-reverse` reversed ALL children including the cheatsheet panel
- The cheatsheet should always remain on the right side regardless of main panel layout

**Solution:**
- Used CSS `order` property to keep cheatsheet always on the right:
  ```css
  .split-container #cheatsheet-divider {
    order: 4;
  }
  .split-container #cheatsheet-panel {
    order: 5;
  }
  ```
- Main panels use orders 1-3 depending on flip state
- Cheatsheet always uses orders 4-5, keeping it rightmost

## Technical Implementation

### CSS Changes (public/css/style.css)

**Before:**
```css
.split-container.flipped {
  flex-direction: row-reverse;
}
```

**After:**
```css
/* Flipped panels - editor on right, preview on left */
.split-container.flipped #edit {
  order: 3;
}
.split-container.flipped #split-divider {
  order: 2;
}
.split-container.flipped #preview {
  order: 1;
}

/* Keep cheatsheet always on the right */
.split-container #cheatsheet-divider {
  order: 4;
}
.split-container #cheatsheet-panel {
  order: 5;
}
```

### JavaScript Changes (src/main.js)

**Key Updates:**

1. **Renamed variables for clarity:**
   - `leftPane` → `editorPane`
   - `rightPane` → `previewPane`

2. **Added flip detection:**
   ```javascript
   const isFlipped = () => {
       return container.classList.contains('flipped');
   };
   ```

3. **Fixed resize logic for horizontal layout:**
   ```javascript
   if (isFlipped()) {
       // Preview is on left, editor on right
       const offsetX = e.clientX - containerRect.left;
       leftWidth = Math.max(minWidth, Math.min(offsetX, maxWidth));
       previewPane.style.width = leftWidth + 'px';
       editorPane.style.width = (totalWidth - leftWidth - dividerWidth) + 'px';
   } else {
       // Editor is on left, preview on right
       const offsetX = e.clientX - containerRect.left;
       leftWidth = Math.max(minWidth, Math.min(offsetX, maxWidth));
       editorPane.style.width = leftWidth + 'px';
       previewPane.style.width = (totalWidth - leftWidth - dividerWidth) + 'px';
   }
   ```

4. **Fixed resize logic for vertical layout:**
   - Similar logic applied for vertical layouts with flip support

5. **Fixed updatePaneSizes function:**
   - Now checks flip state before applying sizes
   - Correctly assigns sizes to editor vs preview based on current layout

## Layout Configurations Now Working

All four layout combinations now work correctly:

1. ✅ **Normal Horizontal:** Editor left | Divider | Preview right | Cheatsheet right
2. ✅ **Flipped Horizontal:** Preview left | Divider | Editor right | Cheatsheet right
3. ✅ **Normal Vertical:** Editor top / Divider / Preview bottom
4. ✅ **Flipped Vertical:** Preview top / Divider / Editor bottom

## Resizer Behavior Now Correct

### Horizontal Layouts:
- **Drag left:** Left panel shrinks, right panel grows
- **Drag right:** Left panel grows, right panel shrinks
- Works correctly in both normal and flipped modes

### Vertical Layouts:
- **Drag up:** Top panel shrinks, bottom panel grows
- **Drag down:** Top panel grows, bottom panel shrinks
- Works correctly in both normal and flipped modes

### Cheatsheet Panel:
- Always stays on the right side
- Never affected by flip state
- Can be independently resized (250px - 600px)

## Testing Checklist

- [x] Resize in normal horizontal mode
- [x] Resize in flipped horizontal mode
- [x] Resize in normal vertical mode
- [x] Resize in flipped vertical mode
- [x] Cheatsheet stays on right when flipping
- [x] Double-click divider resets to 50/50
- [x] Window resize maintains proportions
- [x] All sync features work in all layouts
- [x] Monaco editor resizes properly
- [x] No console errors

## Browser Compatibility

The CSS `order` property is supported in all modern browsers:
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅

## Performance Notes

- Using `order` property is more performant than `flex-direction: reverse`
- No layout thrashing or reflows
- Smooth transitions maintained
- No impact on scroll sync or cursor sync performance
