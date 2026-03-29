# AI Debug Logging Guide

## Console Logging Added

The AI chat system now includes detailed console logging to help debug file creation and editing issues.

## Log Format

All logs use emoji prefixes for easy identification:

- 🤖 `[AI REQUEST]` - Initial request information
- ✅ `[AI RESPONSE]` - Successful response received
- ✏️ `[AI ACTION]` - File editing action
- 📁 `[AI ACTION]` - File creation action
- ❌ `[AI ERROR]` - Error occurred
- ℹ️ `[AI ACTION]` - Informational message

## What Gets Logged

### Request Phase
```javascript
🤖 [AI REQUEST] Starting AI chat request
📝 User Message: "create a boq and put it in the folder 'boq'"
📂 Active File: None
🎯 Model: llama-3.3-70b
```

### Response Phase
```javascript
✅ [AI RESPONSE] Received response from AI
🎬 Action: create
💬 Message: "I've created a Bill of Quantities..."
📊 Token Usage: { prompt_tokens: 234, completion_tokens: 815, total_tokens: 1049 }
```

### File Creation Phase
```javascript
📁 [AI ACTION] Creating files...
📋 Files to create: [{ name: "boq.xlsx", type: "xlsx", ... }]
📂 Current Project ID: demo-project-1
📄 [1/1] Creating file: {
  name: "boq/boq.xlsx",
  type: "xlsx",
  path: "boq/boq.xlsx",
  contentLength: 1234
}
✅ [AI ACTION] All files created successfully!
📊 Total files in project: 3
```

### Error Phase
```javascript
❌ [AI ERROR] No project selected! Cannot create files.
```

## How to Use for Debugging

1. **Open Browser Console** (F12 or Ctrl+Shift+I)
2. **Ask AI to create files**
3. **Copy the entire console log**
4. **Share with developer**

## Common Issues to Check

### Issue: Files Not Created

**Check the logs for:**
```javascript
❌ [AI ERROR] No project selected! Cannot create files.
```
**Solution:** Select or create a project first

**Check the logs for:**
```javascript
ℹ️ [AI ACTION] No file action required (action: undefined)
```
**Solution:** AI didn't return proper file creation data - backend issue

### Issue: Wrong File Location

**Check the logs for:**
```javascript
📄 [1/1] Creating file: {
  name: "boq.xlsx",
  path: "boq.xlsx",  // Should be "boq/boq.xlsx"
  ...
}
```
**Solution:** AI didn't include folder path - prompt issue

### Issue: Empty Files

**Check the logs for:**
```javascript
📄 [1/1] Creating file: {
  ...
  contentLength: 0  // Should be > 0
}
```
**Solution:** AI didn't generate content - backend issue

## Example Debug Session

```javascript
// User asks: "create a boq and put it in the folder 'boq'"

🤖 [AI REQUEST] Starting AI chat request
📝 User Message: create a boq and put it in the folder "boq"
📂 Active File: None
🎯 Model: llama-3.3-70b

✅ [AI RESPONSE] Received response from AI
🎬 Action: create
💬 Message: I've created a Bill of Quantities (BOQ) template...
📊 Token Usage: {prompt_tokens: 234, completion_tokens: 815, total_tokens: 1049}

📁 [AI ACTION] Creating files...
📋 Files to create: [{
  name: "boq.xlsx",
  type: "xlsx",
  path: "boq/boq.xlsx",
  content: "..."
}]
📂 Current Project ID: demo-project-1
📄 [1/1] Creating file: {
  name: "boq.xlsx",
  type: "xlsx",
  path: "boq/boq.xlsx",
  contentLength: 2456
}
✅ [AI ACTION] All files created successfully!
📊 Total files in project: 3
```

## Backend Response Format

The backend should return:
```json
{
  "success": true,
  "action": "create",
  "message": "I've created...",
  "createdFiles": [
    {
      "name": "boq.xlsx",
      "type": "xlsx",
      "path": "boq/boq.xlsx",
      "content": "..."
    }
  ],
  "usage": {
    "prompt_tokens": 234,
    "completion_tokens": 815,
    "total_tokens": 1049
  }
}
```

## Troubleshooting Steps

1. **Check if project is selected**
   - Look for: `📂 Current Project ID: demo-project-1`
   - If missing: Select a project first

2. **Check if AI returned files**
   - Look for: `📋 Files to create: [...]`
   - If empty array: Backend didn't parse AI response correctly

3. **Check file details**
   - Look for: `📄 [1/1] Creating file: {...}`
   - Verify: name, type, path, contentLength

4. **Check for errors**
   - Look for: `❌ [AI ERROR]`
   - Read error message for details

5. **Verify file was saved**
   - Look for: `✅ [AI ACTION] All files created successfully!`
   - Check: `📊 Total files in project: X`

---

**Note:** Always copy the ENTIRE console log when reporting issues, from `🤖 [AI REQUEST]` to the final success/error message.
