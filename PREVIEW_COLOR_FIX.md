# Preview Color Fix - Match HTML Export

## Problem
The live preview had lower contrast than the HTML export:
- Preview used `#fdfdfd` (off-white) background
- Export used `#ffffff` (pure white) background
- Text colors were slightly different
- Overall appearance was washed out

## Solution
Updated preview colors to exactly match HTML export:

### Light Theme
- **Background**: `#ffffff` (pure white)
- **Text**: `#24292f` (dark gray)
- **Result**: Higher contrast, clearer text

### Dark Theme
- **Background**: `#1E1E1E` (true dark)
- **Text**: `#e6edf3` (light gray)
- **Result**: Better readability

## Changes Made

### File: `public/css/style.css`

**Before:**
```css
#preview-wrapper {
  background-color: #fdfdfd; /* Off-white */
}
```

**After:**
```css
#preview-wrapper {
  background-color: #ffffff; /* Pure white */
}

#preview-wrapper .markdown-body {
  background-color: #ffffff !important;
  color: #24292f !important;
}

[data-theme="dark"] #preview-wrapper .markdown-body {
  background-color: #1E1E1E !important;
  color: #e6edf3 !important;
}
```

## Benefits

✅ **Perfect Match**: Preview now looks identical to HTML export  
✅ **Better Contrast**: Text is easier to read  
✅ **Consistent Colors**: Same colors in preview, export, and print  
✅ **Professional Look**: Cleaner, more polished appearance  

## Color Reference

### Light Theme Colors
| Element | Color | Usage |
|---------|-------|-------|
| Background | `#ffffff` | Pure white |
| Text | `#24292f` | Dark gray |
| Links | `#0969da` | Blue |
| Code | `#1f2328` | Darker gray |

### Dark Theme Colors
| Element | Color | Usage |
|---------|-------|-------|
| Background | `#1E1E1E` | True dark |
| Text | `#e6edf3` | Light gray |
| Links | `#58a6ff` | Light blue |
| Code | `#e6edf3` | Light gray |

## Testing

To verify the fix:
1. Open any markdown file
2. View in preview
3. Click "Export ▾" → "Print to PDF"
4. Compare preview vs print window
5. Colors should match exactly!

## Notes

- Used `!important` to override GitHub CSS defaults
- Both light and dark themes updated
- Container background also updated for consistency
- All three styles (GitHub, GitBook, VSCode) benefit from this fix

---

**Result**: The preview now has the same high-contrast, professional appearance as the HTML export! 🎉
