# Verify Which Code Version is Running

## Quick Test

### Step 1: Open Browser Console
1. Open your app in browser
2. Press `F12` to open DevTools
3. Go to Console tab

### Step 2: Run This Command
Paste this into the console and press Enter:

```javascript
// Check which PDF export code is loaded
const testExport = exportPreviewToPdf.toString();
if (testExport.includes('Puppeteer')) {
    console.log('✅ NEW CODE: Puppeteer implementation loaded');
    console.log('✅ Should see: localhost:3000/generate-pdf');
} else if (testExport.includes('jsPDF')) {
    console.log('❌ OLD CODE: jsPDF implementation still loaded');
    console.log('❌ Browser is using cached version');
    console.log('');
    console.log('SOLUTION:');
    console.log('1. Press Ctrl+Shift+R (hard refresh)');
    console.log('2. Or clear browser cache');
    console.log('3. Or use incognito mode');
} else {
    console.log('⚠️ UNKNOWN: Cannot determine version');
}
```

### Step 3: Interpret Results

#### ✅ If you see "NEW CODE"
The Puppeteer implementation is loaded correctly. 

**Next steps:**
1. Click "Export PDF"
2. Check console for: `🚀 [PUPPETEER PDF EXPORT] Starting export...`
3. Verify PDF fonts match preview

#### ❌ If you see "OLD CODE"
The browser is still using the cached jsPDF version.

**Fix it:**

**Option 1: Hard Refresh**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**Option 2: Incognito Mode**
```
Chrome/Edge: Ctrl + Shift + N
Firefox: Ctrl + Shift + P
```

**Option 3: Clear Cache**
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Disable cache"
4. Refresh page

**Option 4: Delete dist folder**
```bash
# Stop dev server first (Ctrl+C)
rm -rf dist
# Or on Windows:
rmdir /s /q dist

# Then restart:
npm run dev
```

## Alternative: Check Network Tab

### Step 1: Open Network Tab
1. Open DevTools (`F12`)
2. Click "Network" tab
3. Refresh page (`F5`)

### Step 2: Find main.js
1. Filter by "main.js"
2. Click on the main.js file
3. Go to "Response" tab

### Step 3: Search for Code
Press `Ctrl+F` and search for:
- `"Puppeteer"` - Should find it if new code
- `"jsPDF"` - Should NOT find it if new code
- `"localhost:3000/generate-pdf"` - Should find it if new code

## Check Server is Running

### PDF Server
```bash
node pdf-server.js
```

Should see:
```
🚀 PDF Export Server Started
📍 Server running at http://localhost:3000
🏥 Health check: http://localhost:3000/health
📄 Generate PDF: POST http://localhost:3000/generate-pdf

✨ Ready to generate PDFs with perfect layout!
```

### Dev Server
```bash
npm run dev
```

Should see:
```
VITE v6.4.1  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Test Export

### Step 1: Click Export PDF

### Step 2: Check Console Output

**Expected (NEW CODE):**
```
🚀 [PUPPETEER PDF EXPORT] Starting export...
[PDF Export] Using Puppeteer server at localhost:3000
[PDF Export] Using margins: {top: 25.4, right: 25.4, bottom: 25.4, left: 25.4}
[PDF Export] Collecting HTML and CSS for Puppeteer...
[PDF Export] Fetching CSS from: http://localhost:5173/css/github-markdown-light.css
[PDF Export] CSS fetched successfully, length: 45678
[PDF Export] Success!
```

**Wrong (OLD CODE):**
```
[PDF Export] Using margins: ...
(No mention of Puppeteer)
(No mention of fetching CSS)
(No 🚀 emoji)
```

### Step 3: Check Server Output

**Expected:**
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

**Wrong:**
```
(No output - server not being called)
```

## Checklist

- [ ] Ran console test command
- [ ] Saw "✅ NEW CODE" message
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Checked Network tab for main.js
- [ ] Searched for "Puppeteer" in main.js response
- [ ] Both servers are running
- [ ] Clicked Export PDF
- [ ] Saw "🚀 [PUPPETEER PDF EXPORT]" in console
- [ ] Server showed "📥 Received PDF generation request"
- [ ] PDF downloaded successfully
- [ ] Fonts match HTML preview

## Still Not Working?

### Nuclear Option 1: Use Different Port
Create `vite.config.js`:
```javascript
export default {
  server: {
    port: 5174
  }
}
```

Access: `http://localhost:5174`

### Nuclear Option 2: Incognito Mode
Always use incognito/private browsing for testing

### Nuclear Option 3: Different Browser
Try a different browser you haven't used yet

### Nuclear Option 4: Check File Directly
```bash
# Search for Puppeteer in the source file
grep -n "Puppeteer" src/main.js

# Should show line numbers with Puppeteer mentions
```

On Windows:
```powershell
Select-String -Path "src/main.js" -Pattern "Puppeteer"
```

Should see:
```
2185:    // ===== PDF EXPORT WITH PUPPETEER =====
2186:    let exportPreviewToPdf = async () => {
2187:        console.log('🚀 [PUPPETEER PDF EXPORT] Starting export...');
...
```

---

## Summary

1. Run console test: `exportPreviewToPdf.toString().includes('Puppeteer')`
2. If false: Hard refresh (Ctrl+Shift+R)
3. Check console for "🚀 [PUPPETEER PDF EXPORT]"
4. Check server for "📥 Received PDF generation request"
5. Verify fonts match

If still failing, use incognito mode or delete dist folder.
