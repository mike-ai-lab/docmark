# Quick Test Guide - PDF Import

## ✅ Server is Running!

Your dev server is up and ready:
- **Frontend**: http://localhost:5174/
- **Backend**: http://localhost:3000

## Step-by-Step Test

### Step 1: Open the App
```
Open your browser and go to:
http://localhost:5174/
```

### Step 2: Find the Button
Look in the **top-right corner** of the header for a button with a PDF icon (📄)

```
Header Layout:
┌─────────────────────────────────────────────────────────┐
│ [Logo] [Paste] [Copy] ... [PDF📄] [HTML] [AI] [⚙️]    │
└─────────────────────────────────────────────────────────┘
                              ↑
                         Look here!
```

### Step 3: Click and Upload
1. Click the PDF icon button
2. File dialog opens
3. Select any PDF file
4. Click "Open"

### Step 4: Watch the Magic
1. **Loading modal** appears: "Processing PDF..."
2. **Server logs** show extraction progress
3. **Preview modal** appears with:
   - Markdown preview
   - Page selection checkboxes
   - Stats (pages, images, validation)

### Step 5: Insert
1. Review the preview
2. Select pages to import (or keep all selected)
3. Click **"Insert into Editor"**
4. Markdown appears in the editor!

## What You'll See

### In Browser
```
┌─────────────────────────────────────────┐
│  PDF Import Preview                     │
├─────────────────────────────────────────┤
│  Page Selection:                        │
│  ☑ Page 1  ☑ Page 2  ☑ Page 3         │
├─────────────────────────────────────────┤
│  Preview:                               │
│  # Document Title                       │
│  Content preview...                     │
├─────────────────────────────────────────┤
│  Stats:                                 │
│  Pages: 3 | Images: 2 | Valid: ✅      │
├─────────────────────────────────────────┤
│  [Cancel]  [Insert into Editor]        │
└─────────────────────────────────────────┘
```

### In Server Logs
```
📄 [PDF Import] Received upload request
   File: { fieldname: 'pdf', originalname: 'document.pdf', ... }
   PDF path: uploads\abc123
   Output dir: uploads\pdf-imports\1234567890
📄 Loading PDF: file:///C:/Users/.../document.pdf
✅ Extraction complete
```

### In Editor
```markdown
---
title: Document Title
source: pdf-import
date: 2026-02-18
pages: 3
---

# Document Title

Content from your PDF appears here...
```

## Troubleshooting

### "Button not visible"
- Hard refresh: **Ctrl+Shift+R**
- Check console (F12) for errors
- Look for: "✅ PDF Import UI initialized"

### "Upload fails"
- Check file size (<50MB)
- Check server terminal for errors
- Try a different PDF

### "Preview is empty"
- Check server logs for extraction errors
- PDF might be scanned (OCR not yet implemented)
- Try a text-based PDF

## Test PDFs to Try

### Good Test PDFs
- ✅ Simple text documents
- ✅ Documents with headings
- ✅ Documents with paragraphs
- ✅ Small PDFs (1-10 pages)

### Not Yet Supported
- ❌ Scanned PDFs (need OCR)
- ❌ Complex tables (basic support only)
- ❌ Multi-column layouts (linearized)
- ❌ Very large PDFs (>100 pages slow)

## Expected Results

### Text Extraction
- ✅ Paragraphs extracted
- ✅ Headings detected by font size
- ✅ Reading order preserved (top to bottom, left to right)
- ✅ Basic structure maintained

### What's Coming
- ⏳ Table detection (grid pattern analysis)
- ⏳ List detection (bullet/number patterns)
- ⏳ Column detection (X-axis clustering)
- ⏳ Better image extraction

## Success Criteria

After testing, you should have:
- [x] Server running
- [x] Routes working
- [ ] Button visible in header
- [ ] File dialog opens on click
- [ ] PDF uploads successfully
- [ ] Preview shows content
- [ ] Markdown inserts into editor

## Ready?

**Open the app now**: http://localhost:5174/

Look for the PDF button and try uploading a document!

---

**Everything is ready. Time to test!** 🚀
