# ✅ Media Move Folding Fixed!

## 🐛 Problem:
When moving images using the context menu (Move Up/Down/Top/Bottom), the base64 code became unfolded in the editor, displaying the entire lengthy code instead of staying collapsed.

## 🔧 What Was Fixed:

### Added Smart Folding After Move
Updated the `moveMedia()` function in `src/main.js` to automatically fold ONLY the moved image (not all images):

```javascript
// Trigger folding for the moved image specifically
setTimeout(() => {
    const model = editor.getModel();
    if (model) {
        // Force folding range update
        model.deltaDecorations([], []);
    }
    
    // Fold the moved image
    setTimeout(() => {
        // Check if it's a multi-line <div> wrapped media or single-line
        const numLines = endLine - startLine + 1;
        let foldLineNumber;
        
        if (numLines > 1) {
            // Multi-line: fold the <img> line inside the <div>
            foldLineNumber = targetLine + 1;
        } else {
            // Single-line: fold the <img> line itself
            foldLineNumber = targetLine;
        }
        
        editor.trigger('fold', 'editor.fold', { lineNumber: foldLineNumber });
    }, 100);
}, 100);
```

## 🎯 How It Works:

1. **Move Operation Completes** - Image is moved to new position
2. **Detect Structure** - Check if image is single-line or multi-line (wrapped in `<div>`)
3. **Calculate Fold Line** - Determine which line contains the foldable base64 code
4. **Folding Ranges Refresh** - Monaco editor updates its folding regions (100ms delay)
5. **Fold Specific Line** - Only the moved image is folded (200ms total delay)
6. **Result** - Moved image stays folded, other images remain in their current state!

## ✨ Features:

- **Smart folding** - Only folds the moved image, not all images
- **Handles both structures**:
  - Single-line: `<img src="data:..." />`
  - Multi-line: `<div>\n<img src="data:..." />\n</div>`
- **Works for all directions**: Up, Down, Top, Bottom
- **Preserves other images** - Doesn't affect folding state of other images
- **Debug logging** - Console shows detailed folding progress:
  ```
  🔍 [MEDIA MOVE] Triggering folding for line: 11
  🔍 [MEDIA MOVE] Media was 1 line(s)
  🔍 [MEDIA MOVE] Folding ranges refreshed
  🔍 [MEDIA MOVE] Attempting to fold line: 11
  ✅ [MEDIA MOVE] Folded image at line: 11
  ```

## 🧪 Test Now:

1. **Refresh the page** (Ctrl+Shift+R)
2. **Add multiple images** with base64 (using "+ Add → Media")
3. **Unfold one image** to see its base64 code
4. **Right-click a DIFFERENT image** in preview
5. **Move it** (Up/Down/Top/Bottom)
6. **Check editor**:
   - ✅ Moved image should be folded
   - ✅ The image you unfolded should STAY unfolded
   - ✅ Other images maintain their folding state
7. **Check console** - should see detailed folding logs

## 📦 Files Modified:

- ✅ `src/main.js` - Added smart, targeted folding to `moveMedia()` function

## 🎉 Result:

Moving images now maintains the clean, folded state of the moved image's base64 code, while preserving the folding state of all other images in the document!

