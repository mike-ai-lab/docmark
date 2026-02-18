# PDF Import Button Not Showing - Quick Fix

## Issue
The "Import PDF" button is not appearing in the toolbar.

## Quick Diagnosis

### Step 1: Check Browser Console
1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Look for:
   - ✅ "PDF Import UI initialized" message
   - ❌ Any error messages about PDFImportUI

### Step 2: Run Debug Script
1. Open browser console (F12)
2. Copy and paste the contents of `debug-pdf-button.js`
3. Press Enter
4. Check the output for issues

### Step 3: Manual Test
Open browser console and run:
```javascript
// Check if header-right exists
document.querySelector('.header-right')

// Check if button exists
document.getElementById('import-pdf-button')

// Manually add button
const headerRight = document.querySelector('.header-right');
const btn = document.createElement('button');
btn.className = 'icon-button';
btn.textContent = 'PDF';
btn.onclick = () => alert('PDF Import!');
headerRight.insertBefore(btn, headerRight.firstChild);
```

## Common Causes & Fixes

### Cause 1: Module Not Loading
**Symptom**: Console shows "PDFImportUI is not defined"

**Fix**: Check that `src/main.js` has the import:
```javascript
import PDFImportUI from './pdf-import/pdf-import-ui.js';
```

### Cause 2: Timing Issue
**Symptom**: Button appears after page reload but not on first load

**Fix**: Already implemented - the code now waits for DOM ready

### Cause 3: CSS Not Loaded
**Symptom**: Button exists in DOM but not visible

**Fix**: Check that `index.html` has:
```html
<link rel="stylesheet" type="text/css" href="./src/pdf-import/pdf-import.css">
```

### Cause 4: Server Not Running
**Symptom**: Page loads but features don't work

**Fix**: Make sure you ran:
```bash
npm run dev
```

## Verification Steps

### 1. Check Files Exist
```bash
# Check if files are present
ls src/pdf-import/pdf-import-ui.js
ls src/pdf-import/pdf-import.css
```

### 2. Check Integration
```bash
# Verify integration
node verify-pdf-import.js
```

### 3. Check Browser
1. Open `http://localhost:5173`
2. Open DevTools (F12)
3. Go to Network tab
4. Reload page
5. Check if `pdf-import-ui.js` loads successfully

### 4. Check Console
Look for:
- ✅ "PDF Import UI initialized"
- ✅ "PDF Import button added to header"
- ❌ Any error messages

## Manual Button Addition (Temporary)

If you need the button immediately while debugging, add this to browser console:

```javascript
// Create button manually
const headerRight = document.querySelector('.header-right');
const pdfBtn = document.createElement('button');
pdfBtn.className = 'icon-button';
pdfBtn.id = 'import-pdf-button';
pdfBtn.title = 'Import PDF';
pdfBtn.innerHTML = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="11" x2="12" y2="17"></line>
    <polyline points="9 14 12 11 15 14"></polyline>
  </svg>
`;
pdfBtn.onclick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf';
  input.click();
};

const importHtmlBtn = document.getElementById('import-html-button');
if (importHtmlBtn) {
  headerRight.insertBefore(pdfBtn, importHtmlBtn);
} else {
  headerRight.appendChild(pdfBtn);
}

console.log('✅ PDF button added manually');
```

## Still Not Working?

### Check Module Type
The app uses ES6 modules. Verify `src/pdf-import/pdf-import-ui.js` ends with:

```javascript
// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFImportUI;
}
```

### Check Import Path
In `src/main.js`, verify the import path is correct:
```javascript
import PDFImportUI from './pdf-import/pdf-import-ui.js';
```

### Restart Dev Server
Sometimes Vite needs a restart:
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the reload button
3. Select "Empty Cache and Hard Reload"

## Expected Result

After fixing, you should see:
1. A button with a PDF icon in the header-right section
2. Button appears before the "Import HTML" button
3. Clicking it opens a file dialog
4. Console shows "✅ PDF Import UI initialized"

## Need More Help?

1. Run `node verify-pdf-import.js` and share the output
2. Check browser console for errors
3. Run the debug script (`debug-pdf-button.js`) in console
4. Share any error messages
