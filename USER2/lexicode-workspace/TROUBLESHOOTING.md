# Troubleshooting - AI Panel Not Showing

## Issue
The AI Assistant toggle button is not visible in the header, or clicking it doesn't show/hide the panel.

## Solution Steps

### 1. Hard Refresh Browser
The most common issue is browser cache. Do a **hard refresh**:
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### 2. Clear Browser Cache
If hard refresh doesn't work:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 3. Check Console for Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any red errors
4. Common errors:
   - `toggleAiPanel is not defined` → Store not loaded properly
   - `aiPanelOpen is not defined` → State not initialized
   - Module import errors → Restart dev server

### 4. Restart Dev Server
If the above doesn't work, restart the frontend server:

```bash
# Stop the current process (Ctrl+C in the terminal)
# Then restart:
cd USER2/lexicode-workspace/frontend
npm run dev
```

### 5. Verify Files Are Correct

Check these files have the correct code:

**Header.jsx** - Should have:
```jsx
import { MessageSquare } from 'lucide-react';
const { aiPanelOpen, toggleAiPanel } = useDemoStore();

<button onClick={toggleAiPanel} ...>
  <MessageSquare className="w-3 h-3" />
  <span>AI Assistant</span>
</button>
```

**App.jsx** - Should have:
```jsx
const { aiPanelOpen } = useDemoStore();

<aside className={`transition-all duration-300 ease-in-out ${
  aiPanelOpen ? 'w-96' : 'w-0'
}`}>
```

**useDemoStore.js** - Should have:
```javascript
aiPanelOpen: true,
toggleAiPanel: () => {
  set((state) => ({ aiPanelOpen: !state.aiPanelOpen }));
},
```

### 6. Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for failed requests (red)
5. Check if all JS files are loading (200 status)

### 7. Test in Incognito/Private Window
Open the app in an incognito/private window to rule out extension conflicts:
- **Chrome**: `Ctrl + Shift + N`
- **Firefox**: `Ctrl + Shift + P`
- **Edge**: `Ctrl + Shift + N`

### 8. Check localStorage
The panel state is stored in localStorage. Clear it if needed:
```javascript
// In browser console (F12):
localStorage.clear();
location.reload();
```

## Expected Behavior

When working correctly:
1. You should see "AI Assistant" button in the header (purple when open, gray when closed)
2. Clicking it should smoothly slide the panel in/out from the right
3. Animation should take 300ms
4. No jumping or layout shifts

## Still Not Working?

If none of the above works, there might be a deeper issue. Check:
1. Node.js version (should be 16+)
2. npm packages installed correctly (`npm install`)
3. No conflicting global CSS
4. Browser supports CSS transitions

## Quick Test

Open browser console (F12) and run:
```javascript
// Check if store is accessible
console.log(window.useDemoStore);

// Check if state exists
const state = window.useDemoStore?.getState();
console.log('aiPanelOpen:', state?.aiPanelOpen);
console.log('toggleAiPanel:', state?.toggleAiPanel);
```

If these return `undefined`, the store is not loading properly.
