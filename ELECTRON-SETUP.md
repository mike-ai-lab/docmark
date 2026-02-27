# Electron Setup for DocMark

## Prerequisites

You have Electron installed on your device. We'll use that instead of installing it locally.

## Setup Steps

### 1. Build the App
```bash
npm run build
```

### 2. Run with Your System Electron

**Option A: Using electron command directly**
```bash
electron .
```

**Option B: If electron is in PATH**
```bash
electron electron-main.js
```

**Option C: Full path to your Electron installation**
```bash
/path/to/your/electron .
```

## Files Created

- `electron-main.js` - Main Electron process
- `electron-preload.js` - Preload script for security

## Development Mode

To run in development with hot reload:

```bash
# Terminal 1: Start Vite dev server
npm run dev:vite-only

# Terminal 2: Run Electron
electron .
```

## Production Build

```bash
npm run build
electron .
```

## Features

✅ Full DocMark functionality  
✅ PDF import working  
✅ All export features  
✅ Dark mode  
✅ Auto-save  
✅ Developer tools (in dev mode)  

## Troubleshooting

**Electron not found:**
- Use full path to your Electron installation
- Or add Electron to PATH

**Blank window:**
- Check that `npm run build` completed successfully
- Verify `dist/index.html` exists

**PDF import not working:**
- Backend server must be running: `node pdf-server.js`
- Or use web version at https://mimevents.com

## Notes

- The app runs entirely in Electron
- No backend server needed for basic features
- PDF import requires backend (optional)
- All data stored locally in app storage
