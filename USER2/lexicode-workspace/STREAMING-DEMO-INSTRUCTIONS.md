# Streaming Demo - Testing Instructions

## Purpose

This demo tests the file creation streaming logic WITHOUT using the AI API. It simulates an AI response to debug the frontend file creation and streaming functionality.

## How to Access

1. Start the frontend dev server:
   ```bash
   cd USER2/lexicode-workspace/frontend
   npm run dev
   ```

2. Open the demo URL in your browser:
   ```
   http://localhost:5173/?demo=streaming
   ```

## What the Demo Does

The demo simulates creating 3 files in a nested folder structure:
- `streaming-test/README.md` (markdown file)
- `streaming-test/app.js` (JavaScript file)
- `streaming-test/config.json` (JSON file)

### Demo Flow

1. **Click "Run Demo"** button
2. Watch the debug console log every step
3. Files are created sequentially with streaming animation
4. Each file takes ~4 seconds to stream
5. Final state is displayed in the right panel

### What to Watch For

#### ✅ Success Indicators
- Files appear in explorer immediately
- Files are clickable after creation
- Content streams character-by-character smoothly
- Final content is complete (not just first line)
- Files persist after refresh
- Downloaded folder contains full content

#### ❌ Failure Indicators
- Files not clickable
- Only first line of content appears
- Content jumps or skips
- Files disappear after refresh
- Empty downloads

## Debug Console

The left panel shows detailed logs:
- 🚀 Demo start
- 📁 Folder creation
- 📄 File creation steps
- ✓ Success checkpoints
- 📝 Streaming progress (every 50 chars)
- ✅ Completion status
- ❌ Errors (if any)

## State Inspector

The right panel shows real-time state:
- **File Tree Nodes**: Number of root nodes
- **Active File ID**: Currently open file
- **Open Tabs**: Number of tabs
- **Tree Structure**: Full JSON of file tree

## Testing Checklist

### Basic Functionality
- [ ] Click "Run Demo" - demo starts
- [ ] Logs appear in console
- [ ] Folder "streaming-test" appears in explorer
- [ ] 3 files appear under folder
- [ ] Files are clickable
- [ ] Clicking file opens it in editor
- [ ] Content is complete (not truncated)

### Streaming Animation
- [ ] Content appears character-by-character
- [ ] Typing speed feels natural (~4 seconds per file)
- [ ] No jumps or skips in content
- [ ] Progress logs show streaming (every 50 chars)
- [ ] Each file completes before next starts

### State Persistence
- [ ] Refresh page (remove ?demo=streaming from URL)
- [ ] Login to main app
- [ ] Check if "streaming-test" folder exists
- [ ] Click files - content should be complete
- [ ] Download folder - ZIP should contain full files

### Edge Cases
- [ ] Run demo multiple times - no duplicates
- [ ] Clear logs - logs clear but files remain
- [ ] Close demo - returns to main app
- [ ] Files remain accessible in main app

## Common Issues & Solutions

### Issue: Files Not Clickable
**Symptom**: Files appear in explorer but clicking does nothing

**Debug**:
1. Check console logs for "Tree updated and saved"
2. Check State Inspector - verify file IDs exist
3. Check if `saveTreeToLocalStorage()` is called
4. Verify file has `id`, `name`, `type`, `content` properties

**Fix**: Ensure tree is saved BEFORE opening file

### Issue: Only First Line Appears
**Symptom**: Files show only first few characters

**Debug**:
1. Check streaming progress logs - should show multiple updates
2. Check if loop completes (should see "Streaming complete!")
3. Verify `charDelay` calculation
4. Check if `updateContent` function is called repeatedly

**Fix**: Ensure character-by-character loop completes

### Issue: Content Disappears
**Symptom**: Content streams but then disappears

**Debug**:
1. Check if final content is set after streaming
2. Verify `finalizeFile` function is called
3. Check localStorage - should contain full content
4. Look for state overwrites in logs

**Fix**: Ensure final content is saved after streaming

### Issue: Empty Downloads
**Symptom**: Downloaded ZIP is empty or files have no content

**Debug**:
1. Check State Inspector - verify content exists in tree
2. Check localStorage - should have full content
3. Verify download happens AFTER streaming completes
4. Check if content is properly serialized

**Fix**: Ensure content is saved to tree before download

## Expected Log Output

```
[HH:MM:SS] 🚀 Starting streaming demo...
[HH:MM:SS] 📋 Mock AI response created with 3 files
[HH:MM:SS] 📝 Adding user message to conversation...
[HH:MM:SS] 🤖 Adding AI message to conversation...
[HH:MM:SS] 📁 Starting file creation process...
[HH:MM:SS] 📊 Current tree has X root nodes

[HH:MM:SS] 📄 [1/3] Creating: README.md
[HH:MM:SS]    Path: streaming-test/README.md
[HH:MM:SS]    Content length: XXX chars
[HH:MM:SS] 📁 Created folder: streaming-test
[HH:MM:SS]    ✓ Added to folder: streaming-test
[HH:MM:SS]    ✓ Tree updated and saved
[HH:MM:SS]    ✓ File opened in editor (ID: file-...)
[HH:MM:SS]    ⏳ Starting content stream...
[HH:MM:SS]    📝 Streamed 50 chars (XX%) in X.Xs
[HH:MM:SS]    📝 Streamed 100 chars (XX%) in X.Xs
[HH:MM:SS]    ✅ Streaming complete! XXX chars in X.XXs
[HH:MM:SS]    ✓ Final content saved to localStorage

[HH:MM:SS] ⏸️  Pausing 800ms before next file...

[HH:MM:SS] 📄 [2/3] Creating: app.js
... (repeat for each file)

[HH:MM:SS] ✅ All files created successfully!
[HH:MM:SS] 📊 Total files: 3
[HH:MM:SS] 📊 File IDs: file-..., file-..., file-...

[HH:MM:SS] 🔍 Final State Check:
[HH:MM:SS]    Tree nodes: X
[HH:MM:SS]    Active file ID: file-...
[HH:MM:SS]    Open tabs: 3

[HH:MM:SS] ✅ Folder found with 3 children
[HH:MM:SS]    1. README.md (XXX chars)
[HH:MM:SS]    2. app.js (XXX chars)
[HH:MM:SS]    3. config.json (XXX chars)

[HH:MM:SS] 🏁 Demo complete!
```

## Next Steps

### If Demo Works
1. The frontend logic is correct
2. Issue is likely in AI API response format
3. Check backend logs for AI response structure
4. Verify `createdFiles` array format matches demo

### If Demo Fails
1. Issue is in frontend file creation logic
2. Use debug logs to identify exact failure point
3. Check State Inspector for state inconsistencies
4. Fix identified issue in `useDemoStore.js`
5. Re-run demo to verify fix

## Cleanup

After testing, you can:
1. Delete the `streaming-test` folder from explorer
2. Clear localStorage: `localStorage.clear()`
3. Refresh page to reset state

---

**Demo Component**: `frontend/src/components/StreamingDemo.jsx`
**Access URL**: `http://localhost:5173/?demo=streaming`
**Purpose**: Debug file streaming WITHOUT using AI API
