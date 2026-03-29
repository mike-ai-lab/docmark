# Quick Start Guide - Pagination PDF Export

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install express cors puppeteer
```

### Step 2: Start Server
```bash
node pagination-pdf-server.js
```

### Step 3: Open Browser
```
http://localhost:3001/pagination-test-merged.html
```

---

## 📝 Quick Commands

### Windows PowerShell
```powershell
.\start-pagination-test.ps1
```

### Windows CMD
```cmd
start-pagination-test.bat
```

### Manual Start
```bash
node pagination-pdf-server.js
```

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Real-time Preview** | See pagination as you type |
| **Margin Control** | Adjust all 4 margins independently |
| **Page Formats** | A4 (210×297mm) or US Letter (8.5×11in) |
| **Margin Guides** | Visual red lines showing margins |
| **PDF Export** | Generate PDF with exact pagination |
| **Markdown Support** | Full markdown rendering with syntax highlighting |
| **Plain Text Mode** | Disable markdown for raw text |

---

## 🔧 Configuration

### Margins (in millimeters)
- **Top:** 0-50mm (default: 25mm)
- **Bottom:** 0-50mm (default: 25mm)
- **Left:** 0-50mm (default: 20mm)
- **Right:** 0-50mm (default: 20mm)

### Page Formats
- **A4:** 210 × 297 mm
- **US Letter:** 215.9 × 279.4 mm (8.5 × 11 in)

---

## 📤 Export PDF

1. Click **"Export to PDF"** button (green)
2. Wait for generation (3-5 seconds)
3. Check **Downloads** folder
4. File format: `Pagination_Test_YYYY-MM-DDTHH-MM-SS.pdf`

---

## ⚠️ Troubleshooting

### Server Not Running
```
Error: PDF server not running
```
**Fix:** Run `node pagination-pdf-server.js` in terminal

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Fix:** Kill process on port 3001 or change PORT in server file

### Dependencies Missing
```
Error: Cannot find module 'puppeteer'
```
**Fix:** Run `npm install express cors puppeteer`

### PDF Not Downloading
**Fix:** Check browser's download settings and popup blocker

---

## 📊 Page Calculations

### Content Area Formula
```
contentHeight = pageHeight - topMargin - bottomMargin - footerHeight
contentWidth = pageWidth - leftMargin - rightMargin
```

### Example (A4 with default margins)
```
Page: 297mm height
Top margin: 25mm
Bottom margin: 25mm
Footer: 25mm
─────────────────
Content: 222mm (297 - 25 - 25 - 25)
```

---

## 🎨 Markdown Support

### Supported Elements
- ✅ Headings (H1-H6)
- ✅ Paragraphs
- ✅ Lists (ordered & unordered)
- ✅ Code blocks with syntax highlighting
- ✅ Inline code
- ✅ Blockquotes
- ✅ Tables
- ✅ Links
- ✅ Images
- ✅ Horizontal rules
- ✅ Bold & italic text

### Syntax Highlighting
Powered by highlight.js - supports 190+ languages

---

## 📁 File Structure

```
pagination-test-merged.html          # Main test page
pagination-pdf-server.js             # PDF generation server
pagination-test-package.json         # NPM dependencies
start-pagination-test.ps1            # PowerShell launcher
start-pagination-test.bat            # CMD launcher
PAGINATION-PDF-TEST-README.md        # Full documentation
PAGINATION-PDF-EXPORT-IMPLEMENTATION.md  # Technical details
QUICK-START-GUIDE.md                 # This file
```

---

## 🔍 Verification Checklist

Before exporting PDF, verify:

- [ ] Content displays correctly in preview
- [ ] Pagination looks good (no orphaned text)
- [ ] Margins are set as desired
- [ ] Page format is correct (A4 or Letter)
- [ ] Server is running (check terminal)
- [ ] No errors in browser console (F12)

---

## 💡 Tips & Tricks

### Tip 1: Test with Simple Content First
Start with a few paragraphs to verify everything works before testing complex documents.

### Tip 2: Use Margin Guides
Enable "Show Margin Guides" to visualize exactly where content will appear.

### Tip 3: Check Console Logs
Open browser console (F12) to see detailed pagination logs and debug issues.

### Tip 4: Compare Preview to PDF
The PDF should match the preview exactly - if not, check margin settings.

### Tip 5: Keep Server Running
Leave the server running while testing - no need to restart between exports.

---

## 📞 Support

### Check Logs
- **Browser Console:** F12 → Console tab
- **Server Terminal:** Where you ran `node pagination-pdf-server.js`

### Common Issues
1. **Server not starting:** Check Node.js is installed (`node --version`)
2. **PDF not generating:** Verify Puppeteer installed (`npm list puppeteer`)
3. **Margins wrong:** Ensure values are in millimeters (mm)
4. **Content missing:** Check pagination logs in console

---

## 🎓 Learn More

- **Full Documentation:** See `PAGINATION-PDF-TEST-README.md`
- **Technical Details:** See `PAGINATION-PDF-EXPORT-IMPLEMENTATION.md`
- **Main Application:** Check `src/main.js` for original implementation

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| Server startup | 2-3 seconds |
| PDF generation | 3-5 seconds |
| Memory usage | ~200MB |
| Max page count | ~100 pages (recommended) |

---

## 🎉 You're Ready!

Everything is set up and ready to use. Start the server and begin testing!

```bash
node pagination-pdf-server.js
```

Then open: `http://localhost:3001/pagination-test-merged.html`

Happy testing! 🚀
