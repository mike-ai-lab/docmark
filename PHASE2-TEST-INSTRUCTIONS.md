# Phase 2 Testing Instructions

## ✅ What Was Added

1. **Mode Toggle Buttons** - Switch between Single File and Documentation modes
2. **Upload Button** - Upload ZIP files with documentation
3. **ZIP Extraction** - Extract and parse markdown files
4. **Navigation Tree** - Build folder structure from files
5. **Markdown Rendering** - Render pages with marked.js

## 🧪 How to Test

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Look for Mode Toggle
In the header, you should see two buttons:
- 📄 Single File (active by default)
- 📚 Documentation

### Step 3: Click "📚 Documentation"
You should see an alert: "Please upload a documentation ZIP file first!"

### Step 4: Upload Test ZIP
1. A file picker should open automatically
2. Select `test-documentation.zip` from the project root
3. Wait for processing (should be quick)
4. You should see: "✅ Documentation loaded! 3 pages found."

### Step 5: Verify Documentation Mode
After upload, you should see:
- ✅ Left sidebar with navigation tree
- ✅ Main content area showing README.md
- ✅ Right sidebar with TOC
- ✅ Upload button visible in header

### Step 6: Test Navigation
Click on items in the left sidebar:
- "getting-started" folder
- "installation.md" file
- "api" folder
- "reference.md" file

Each click should load and render that page.

### Step 7: Switch Back to Single File
Click "📄 Single File" button
- Should return to normal editor
- Upload button should hide

## 📊 Expected Console Output

```
Documentation mode initialized
Mode toggle buttons configured
Upload button configured
Loading documentation from: test-documentation.zip
Loaded markdown: README.md
Loaded markdown: getting-started/installation.md
Loaded markdown: api/reference.md
Extracted 3 markdown files, 0 assets
```

## ✅ Success Criteria

- [ ] Mode toggle buttons visible
- [ ] Can switch between modes
- [ ] Upload button appears in docs mode
- [ ] ZIP file uploads successfully
- [ ] Navigation tree displays correctly
- [ ] Pages render with proper markdown
- [ ] Can navigate between pages
- [ ] Breadcrumb updates
- [ ] No console errors

## 🐛 Troubleshooting

### "Cannot find module 'jszip'"
Run: `npm install`

### ZIP doesn't upload
- Check file is actually .zip
- Check console for errors
- Try smaller ZIP file

### Pages don't render
- Check console for markdown errors
- Verify files are .md format

## 📝 What to Report

Please confirm:
- [ ] All steps completed successfully
- [ ] Navigation works
- [ ] Pages render correctly
- [ ] Any errors or issues

Once confirmed, we proceed to Phase 3! 🚀
