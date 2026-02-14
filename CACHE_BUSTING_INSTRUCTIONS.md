# Cache Busting Instructions

## Problem
Browser is caching the old JavaScript code with jsPDF implementation instead of loading the new Puppeteer implementation.

## Solution Steps

### 1. Stop All Servers
```bash
# Press Ctrl+C in both terminals to stop:
# - Vite dev server (npm run dev)
# - PDF server (node pdf-server.js)
```

### 2. Clear Browser Cache
Choose ONE method:

#### Method A: Hard Refresh (Recommended)
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

#### Method B: Clear Cache via DevTools
1. Open DevTools (`F12`)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Method C: Clear All Cache
1. Open browser settings
2. Clear browsing data
3. Select "Cached images and files"
4. Clear data

### 3. Verify Cache is Cleared
1. Open DevTools (`F12`)
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Keep DevTools open while testing

### 4. Restart Servers
```bash
# Terminal 1: Start PDF server
node pdf-server.js

# Terminal 2: Start dev server
npm run dev
```

### 5. Verify New Code is Loaded

#### Check Console Logs
When you click "Export PDF", you should see:
```
🚀 [PUPPETEER PDF EXPORT] Starting export...
[PDF Export] Using Puppeteer server at localhost:3000
[PDF Export] Using margins: {top: 25.4, right: 25.4, bottom: 25.4, left: 25.4}
[PDF Export] Collecting HTML and CSS for Puppeteer...
[PDF Export] Fetching CSS from: http://localhost:5173/css/github-markdown-light.css
[PDF Export] CSS fetched successfully, length: 12345
[PDF Export] Success!
```

#### If You See Old Logs
If you see logs about jsPDF or sanitizeForPdf, the old code is still cached:
```
❌ OLD CODE (jsPDF):
[PDF Export] Using margins: ...
(then lots of jsPDF-related logs)
```

### 6. Nuclear Option: Change Port
If cache persists, change Vite port:

**vite.config.js** (create if doesn't exist):
```javascript
export default {
  server: {
    port: 5174  // Different port
  }
}
```

Then access: `http://localhost:5174`

## Verification Checklist

- [ ] Stopped all servers
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Opened DevTools and checked "Disable cache"
- [ ] Restarted both servers
- [ ] Opened browser console
- [ ] Clicked "Export PDF"
- [ ] Saw "🚀 [PUPPETEER PDF EXPORT]" in console
- [ ] Saw "Fetching CSS from:" in console
- [ ] PDF downloaded successfully

## Expected Behavior

### Console Output
```
🚀 [PUPPETEER PDF EXPORT] Starting export...
[PDF Export] Using Puppeteer server at localhost:3000
[PDF Export] Using margins: {top: 25.4, right: 25.4, bottom: 25.4, left: 25.4}
[PDF Export] Collecting HTML and CSS for Puppeteer...
[PDF Export] Fetching CSS from: http://localhost:5173/css/github-markdown-light.css
[PDF Export] CSS fetched successfully, length: 45678
[PDF Export] Success!
```

### Server Output
```
📥 Received PDF generation request
📝 HTML length: 123456 characters
📐 Margins: 25.4/25.4/25.4/25.4mm
🚀 Launching Puppeteer...
📄 Loading HTML...
🎨 Generating PDF...
✅ PDF generated: 234567 bytes
📤 PDF sent to client
```

### PDF Output
- Fonts match HTML preview exactly
- Footer at bottom of last page
- Proper margins
- Selectable text
- Correct pagination

## Troubleshooting

### Issue: Still seeing old code
**Solution**: Try incognito/private browsing mode
```
Ctrl+Shift+N (Chrome/Edge)
Ctrl+Shift+P (Firefox)
Cmd+Shift+N (Safari)
```

### Issue: "PDF server not running" error
**Solution**: 
1. Check server is running: `node pdf-server.js`
2. Verify port 3000 is not in use
3. Check console for server startup message

### Issue: CSS not fetching
**Solution**:
1. Check Network tab in DevTools
2. Verify CSS file loads successfully
3. Check for CORS errors
4. Ensure Vite dev server is running

### Issue: Fonts still wrong
**Solution**:
1. Verify console shows "CSS fetched successfully"
2. Check CSS length is > 0
3. Inspect generated HTML in server logs
4. Verify gh-markdown-link element exists

## Quick Test

Run this in browser console after loading the page:
```javascript
// Check if new code is loaded
console.log('Testing PDF export function...');
const outputElement = document.querySelector('#output');
if (outputElement) {
    console.log('Output element found');
    const ghLink = document.getElementById('gh-markdown-link');
    console.log('CSS link:', ghLink ? ghLink.href : 'NOT FOUND');
} else {
    console.log('Output element NOT FOUND');
}
```

Expected output:
```
Testing PDF export function...
Output element found
CSS link: http://localhost:5173/css/github-markdown-light.css
```

## Version Check

The script tag in index.html should show:
```html
<script type="module" src="/src/main.js?v=2.0.0"></script>
```

If it shows `v=1.11.0`, the file wasn't updated correctly.

---

## Summary

1. Stop servers
2. Hard refresh browser (Ctrl+Shift+R)
3. Enable "Disable cache" in DevTools
4. Restart servers
5. Check console for "🚀 [PUPPETEER PDF EXPORT]"
6. Export PDF and verify fonts match

If still having issues, use incognito mode or change Vite port.
