# HTML & CSS Upload Feature - Test Guide

## New Features Added

### 1. HTML File Upload Button
- **Location**: Header right section (orange icon on hover)
- **Icon**: Document with HTML lines
- **Function**: Import complete HTML files into the editor

### 2. CSS File Upload Button
- **Location**: Header right section (blue icon on hover)
- **Icon**: Document with CSS symbol
- **Function**: Import CSS files and link them to HTML

### 3. Auto CSS Detection
- When you upload an HTML file that references a CSS file (via `<link>` tag), the app will:
  - Detect the CSS filename
  - Prompt you to upload the CSS file
  - Automatically link them together

## How to Test

### Test 1: Upload HTML First, Then CSS

1. **Upload HTML File**
   - Click the HTML upload button (orange icon)
   - Select `test-html-css-upload.html`
   - The HTML will load in the editor
   - Preview will show unstyled HTML

2. **Upload CSS File**
   - Click the CSS upload button (blue icon)
   - Select `test-html-css-upload.css`
   - The app will automatically:
     - Add `<!-- CSS: test-html-css-upload.css -->` comment to the top
     - Inject the CSS content into the preview
   - Preview will now show styled HTML with purple gradient background

### Test 2: Upload CSS First, Then HTML

1. **Upload CSS File**
   - Click the CSS upload button
   - Select `test-html-css-upload.css`
   - CSS is loaded and stored in memory

2. **Upload HTML File**
   - Click the HTML upload button
   - Select `test-html-css-upload.html`
   - The CSS will automatically apply to the HTML preview

### Test 3: HTML with Existing CSS Link

1. **Create HTML with CSS reference**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <link rel="stylesheet" href="styles.css">
   </head>
   <body>
       <h1>Test</h1>
   </body>
   </html>
   ```

2. **Upload this HTML**
   - The app will detect `styles.css` reference
   - Prompt you to upload the CSS file
   - Click "OK" to upload the CSS

3. **Upload the CSS**
   - Select your CSS file
   - It will automatically link and render

## Expected Results

✅ HTML upload button appears in header (orange hover)
✅ CSS upload button appears in header (blue hover)
✅ HTML files load into editor correctly
✅ CSS files inject into HTML preview
✅ Styled HTML renders properly in preview
✅ CSS comment `<!-- CSS: filename.css -->` is added automatically
✅ Multiple CSS files can be uploaded (each adds a new comment)
✅ Works with both full HTML documents and HTML fragments

## Visual Indicators

- **HTML Button Hover**: Orange/amber background
- **CSS Button Hover**: Blue background
- **Toast Notifications**: Show upload success
- **Mofu Helper**: Provides guidance on CSS linking

## Technical Details

### CSS Comment Syntax
```html
<!-- CSS: filename.css -->
<!-- CSS: /path/to/styles.css -->
<!-- CSS: https://cdn.example.com/style.css -->
```

### How It Works
1. CSS content is stored in `loadedCSSContent` variable
2. When HTML is rendered, CSS is injected as `<style>` tag
3. CSS comments are parsed and converted to `<link>` tags
4. Both inline CSS and external links are supported

## Troubleshooting

**Problem**: CSS not applying
- **Solution**: Make sure HTML is a full document with `<html>` and `<head>` tags

**Problem**: CSS comment not added
- **Solution**: The editor content must be HTML (contain `<html>` or `<!DOCTYPE`)

**Problem**: Preview not updating
- **Solution**: Click the refresh button (blue circular arrow in HTML mode)

## Next Steps

After confirming this works, we can proceed with:
1. Locking this state as stable
2. Moving to HTML Editor Tool integration
3. Adding inspector and live editing features
