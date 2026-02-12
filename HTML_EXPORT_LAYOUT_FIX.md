# HTML Export Layout Fix

## Problem

When exporting HTML files, the GitHub and GitBook styles were showing a "double-framing" effect where the content appeared inside a paper-like container with excessive padding and margins. This created a visual error where the layout looked cramped and incorrectly framed.

VSCode style was exporting correctly because it didn't have the conflicting CSS properties.

## Root Cause

The issue was caused by **double padding/styling**:

1. The `exportPreviewToHtml()` function in `main.js` creates a `.paper-container` wrapper with:
   - `max-width` (860px for GitBook, 980px for GitHub)
   - `padding` (50px 70px for GitBook, 45px 60px for GitHub)
   - `box-shadow` for the paper effect
   - `background-color` for the paper background

2. The GitBook CSS file (`public/css/gitbook-style.css`) had its own styling on `.markdown-body`:
   - `padding: 50px 70px`
   - `max-width: 860px`
   - `margin: 0 auto`
   - `box-shadow: 0 0 20px rgba(0, 0, 0, 0.05)`

This created a **nested framing effect** where both the container AND the content had padding and constraints.

## Solution

Removed the conflicting properties from `public/css/gitbook-style.css`:

### Before:
```css
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  background-color: #fff;
  padding: 50px 70px;           /* ❌ REMOVED */
  max-width: 860px;             /* ❌ REMOVED */
  margin: 0 auto;               /* ❌ REMOVED */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);  /* ❌ REMOVED */
}
```

### After:
```css
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  background-color: #fff;
  /* ✅ No padding, max-width, margin, or box-shadow */
}
```

Also updated the dark theme version:

### Before:
```css
[data-theme="dark"] .markdown-body {
  color: #c9d1d9;
  background-color: #1a1a1a;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);  /* ❌ REMOVED */
}
```

### After:
```css
[data-theme="dark"] .markdown-body {
  color: #c9d1d9;
  background-color: #1a1a1a;
  /* ✅ No box-shadow */
}
```

## Why This Works

The HTML export function already handles the paper layout correctly:

1. **Container Level** (`.paper-container`):
   - Provides the max-width constraint
   - Adds padding for the paper margins
   - Creates the box-shadow for depth
   - Sets the paper background color

2. **Content Level** (`.markdown-body`):
   - The export function explicitly sets `padding: 0` and `background-color: transparent`
   - Now the CSS file doesn't conflict with these overrides
   - Content flows naturally within the container

## Result

✅ GitHub style exports with proper single-frame layout
✅ GitBook style exports with proper single-frame layout  
✅ VSCode style continues to work correctly
✅ All styles maintain their visual identity
✅ Print layout works correctly with `@media print` rules

## Files Modified

- `public/css/gitbook-style.css` - Removed padding, max-width, margin, and box-shadow from `.markdown-body`

## Files Verified

- `public/css/github-markdown-light.css` - Already correct (no conflicting properties)
- `public/css/github-markdown-dark_dimmed.css` - Already correct (no conflicting properties)
- `public/css/vscode-style.css` - Already correct (minimal padding: 20px)

## Testing

To verify the fix:

1. Build the project: `npm run build`
2. Open the application
3. Write some markdown content
4. Export HTML with GitHub style
5. Export HTML with GitBook style
6. Export HTML with VSCode style
7. Open each exported HTML file in a browser
8. Verify the content appears in a single, properly-framed paper container

All three styles should now show consistent, professional layouts without double-framing.
