# Quick Test Guide

## ✅ Backend Server Restarted

The backend server has been restarted and now includes the new `/api/ai/create-files` endpoint.

**Server Status**: Running on http://localhost:3001

## 🧪 Test the New Features

### 1. Test File Creation (Manual)

1. Open http://localhost:5173 in your browser
2. Click the **folder+** icon to create a project
3. Click the **file+** icon to create a file
4. **Verify**: You should see **DOCX** and **XLSX** in the dropdown
5. Create a file and verify it appears in the sidebar

### 2. Test AI File Creation

1. In the AI panel, click **Create Files** mode
2. Enter a prompt like:
   ```
   Create a simple invoice template in Excel format
   ```
3. Click **Create Files** button
4. **Expected**: AI generates an XLSX file with invoice structure
5. **Check**: Token counter should update

### 3. Test AI File Editing

1. Select an existing file from the sidebar
2. Switch to **Edit File** mode in AI panel
3. Enter a prompt like:
   ```
   Add a header section at the top
   ```
4. Click **Apply Edit** button
5. **Expected**: File content is updated
6. **Check**: Token counter increases

### 4. Test Preview & Scrolling

1. Create or open a Markdown file
2. Click the **eye icon** to show preview
3. **Verify**: Both editor and preview are scrollable
4. Add lots of content to test scrolling
5. Toggle preview off and on
6. **Expected**: Scrolling works in all scenarios

### 5. Test Export

1. Select any file
2. Click **Export** dropdown in header
3. Choose a format (PDF, DOCX, Excel, CSV, TXT)
4. **Expected**: File downloads successfully

## 🔍 Troubleshooting

### If AI Create Files Fails

**Check Backend Logs**:
```bash
# The backend should show:
🚀 LexiCode Server running on http://localhost:3001
```

**Check Browser Console**:
- Should NOT see 404 errors for `/api/ai/create-files`
- Should see successful API calls

**Verify Environment Variable**:
```bash
# Windows PowerShell
echo $env:GROQ_API_KEY

# Should show your API key
```

### If Scrolling Issues Persist

1. Hard refresh browser: `Ctrl + Shift + R`
2. Clear browser cache
3. Close and reopen browser tab

### If Token Counter Not Updating

- Backend must return `usage` object in API response
- Check browser console for errors
- Verify Groq API is responding correctly

## 📊 Expected Token Usage

### File Creation (Create Mode)
- Simple file: 500-1000 tokens
- Complex file: 1000-2000 tokens
- Multiple files: 2000-5000 tokens

### File Editing (Edit Mode)
- Small edit: 100-300 tokens
- Medium edit: 300-800 tokens
- Large edit: 800-1500 tokens

## ✨ Example Prompts to Try

### Create Mode Examples:
```
"Create a business proposal in DOCX with 3 sections"
"Generate a sales report in Excel with sample data"
"Create a project with README.md and package.json"
"Make a contact form in HTML with CSS styling"
```

### Edit Mode Examples:
```
"Add a table of contents at the top"
"Create a function to validate email addresses"
"Add error handling to this code"
"Format this as a professional document"
```

## 🎯 Success Criteria

- ✅ DOCX and XLSX appear in file type dropdown
- ✅ AI Create mode generates files successfully
- ✅ AI Edit mode modifies files correctly
- ✅ Token counter updates in real-time
- ✅ Preview toggle works without breaking scroll
- ✅ Export works for all formats
- ✅ No 404 errors in console

## 🚀 All Systems Ready!

Both servers are running and all features are implemented. Start testing!
