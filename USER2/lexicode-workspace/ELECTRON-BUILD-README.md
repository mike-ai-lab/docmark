# LexiCode Electron Build Guide

## Quick Start

Simply run the build script:

```bash
BUILD-ELECTRON.bat
```

This will:
1. ✅ Check and install all dependencies
2. ✅ Build the frontend React app
3. ✅ Package the Electron app for Windows
4. ✅ Create installer and portable versions

## Output

After building, you'll find your app in the `electron-dist/` folder:

- **Installer**: `LexiCode-1.0.0-x64.exe` (NSIS installer)
- **Portable**: `LexiCode-1.0.0-x64.exe` (portable version)

## Requirements

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Windows OS (for Windows builds)

## Build Options

### Windows Only (Default)
```bash
BUILD-ELECTRON.bat
```

### All Platforms (Manual)
```bash
npm run electron:build
```

### Specific Platforms (Manual)
```bash
npm run electron:build-win    # Windows
npm run electron:build-mac    # macOS
npm run electron:build-linux  # Linux
```

## Development Mode

To run the app in development mode with hot reload:

```bash
# Terminal 1: Start frontend dev server
npm run start:frontend

# Terminal 2: Start Electron
npm run electron:dev
```

## Custom Icon

To add a custom app icon:

1. Place your icon files in the `build/` folder:
   - `icon.ico` - Windows icon (256x256 or larger)
   - `icon.icns` - macOS icon
   - `icon.png` - Linux icon (512x512 or larger)

2. Rebuild the app

## Troubleshooting

### Build fails with "electron-builder not found"
```bash
npm install
```

### Frontend build fails
```bash
cd frontend
npm install
npm run build
cd ..
```

### Port 5173 already in use
Close any running Vite dev servers or change the port in `frontend/vite.config.js`

## Configuration

Edit `package.json` to customize:
- App name (`productName`)
- Version (`version`)
- App ID (`build.appId`)
- Build targets (`build.win.target`)

## File Structure

```
lexicode-workspace/
├── electron-main.js          # Main Electron process
├── electron-preload.js       # Preload script (security)
├── package.json              # Root config with Electron
├── BUILD-ELECTRON.bat        # Build script
├── build/                    # Icon assets
│   ├── icon.ico
│   ├── icon.icns
│   └── icon.png
├── frontend/                 # React app
│   ├── dist/                 # Built frontend (generated)
│   └── package.json
└── electron-dist/            # Built Electron app (generated)
    ├── LexiCode-1.0.0-x64.exe
    └── win-unpacked/
```

## Distribution

After building, you can distribute:

1. **Installer** - Users run the .exe and install normally
2. **Portable** - Users can run directly without installation

Both versions are fully functional and include all dependencies.

## Notes

- The app uses Electron 28.x for stability
- Frontend is built with Vite for optimal performance
- All dependencies are bundled in the final app
- No internet connection required to run the app
- App data is stored in the user's AppData folder

## Support

For issues or questions, check:
- `TROUBLESHOOTING.md`
- `README.md`
- GitHub Issues (if applicable)
