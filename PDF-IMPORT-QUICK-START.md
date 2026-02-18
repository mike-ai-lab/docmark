# PDF Import - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install
```

This installs the new `multer` dependency for file uploads.

### Step 2: Start the Server

```bash
npm run dev
```

This starts both Vite (frontend) and the PDF server (backend) with the new PDF import endpoint.

### Step 3: Use the Feature

1. Open the app in your browser
2. Click the **"📄 Import PDF"** button in the toolbar
3. Select a PDF file
4. Preview and insert into editor

That's it! ✅

---

## 📋 What Was Implemented

### Backend (Node.js)
- ✅ Puppeteer PDF extractor
- ✅ HTML normalizer (strips styles, converts to semantic HTML)
- ✅ Markdown converter (semantic HTML → Markdown)
- ✅ Full pipeline orchestration
- ✅ Express API endpoints

### Frontend (Browser)
- ✅ File upload UI
- ✅ Preview modal with page selection
- ✅ Editor integration
- ✅ Loading indicators
- ✅ Success/error notifications

### Integration
- ✅ CSS added to `index.html`
- ✅ UI initialized in `src/main.js`
- ✅ Server routes added to `pdf-server.js`
- ✅ Dependencies added to `package.json`

---

## 🧪 Test It

### Quick Test

1. Find any PDF file on your computer
2. Click "📄 Import PDF" in the toolbar
3. Upload the PDF
4. Watch it convert to Markdown
5. Click "Insert into Editor"

### Full Test Suite

```bash
# Test HTML normalizer
node test-html-normalizer.js

# Test Markdown converter
node test-markdown-converter.js

# Test full pipeline (requires test-sample.pdf)
node test-pdf-import.js
```

---

## 🎯 How It Works

### Pipeline

```
PDF → Puppeteer → Raw HTML → Normalizer → Semantic HTML → Converter → Markdown
```

### Example

**Input PDF:**
```
Title: My Document
This is a paragraph.
• Item 1
• Item 2
```

**Output Markdown:**
```markdown
---
title: My Document
source: pdf-import
date: 2026-02-18
pages: 1
---

# My Document

This is a paragraph.

- Item 1
- Item 2
```

---

## 🔧 Configuration

### Change Image Storage Location

Edit `src/pdf-import/pdf-import-pipeline.js`:

```javascript
const outputDir = './my-custom-path'; // Default: './pdf-imports'
```

### Change Server Port

Edit `pdf-server.js`:

```javascript
const PORT = 3000; // Change to your preferred port
```

### Change Upload Size Limit

Edit `pdf-server.js`:

```javascript
app.use(express.json({ limit: '50mb' })); // Change limit
```

---

## ⚠️ Known Issues

1. **Scanned PDFs**: OCR not yet implemented (text-based PDFs only)
2. **Large Files**: PDFs >100 pages may be slow
3. **Complex Layouts**: May need manual adjustment

---

## 🐛 Troubleshooting

### Button doesn't appear
- Check browser console for errors
- Verify `npm run dev` is running
- Clear browser cache

### Upload fails
- Check file size (<50MB)
- Verify PDF is not corrupted
- Check server logs in terminal

### Markdown looks wrong
- Try a different PDF
- Check if PDF is scanned (not supported yet)
- Report issue with sample PDF

---

## 📚 Documentation

- **Full Integration Guide**: `PDF-IMPORT-INTEGRATION-GUIDE.md`
- **Feature README**: `src/pdf-import/README.md`
- **API Reference**: See integration guide

---

## ✅ Ready to Use

The feature is fully integrated and ready to use. Just run `npm install` and `npm run dev`!

For detailed documentation, see `PDF-IMPORT-INTEGRATION-GUIDE.md`.
