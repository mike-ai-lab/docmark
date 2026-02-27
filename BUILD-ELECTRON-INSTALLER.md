# 🚀 Build Electron Installer & Executable

## Quick Start

### Option 1: Using electron-builder (Recommended)

**Step 1: Install electron-builder**
```bash
npm install --save-dev electron-builder
```

**Step 2: Build the installer**
```bash
npm run build
electron-builder --win --publish never
```

**Step 3: Find your files**
- Installer: `dist-electron/DocMark Setup 1.0.0.exe`
- Portable: `dist-electron/DocMark-1.0.0-portable.exe`
- Unpacked: `dist-electron/win-unpacked/`

### Option 2: Using the build script

```bash
npm install --save-dev electron-builder
node build-electron.js
```

## What Gets Built

### 1. NSIS Installer
- **File:** `DocMark Setup 1.0.0.exe`
- **Size:** ~150-200 MB
- **Features:**
  - Custom installation directory
  - Desktop shortcut
  - Start menu shortcut
  - Uninstaller

### 2. Portable Executable
- **File:** `DocMark-1.0.0-portable.exe`
- **Size:** ~150-200 MB
- **Features:**
  - No installation needed
  - Run directly
  - Portable (can move to USB)

### 3. Unpacked Version
- **Folder:** `win-unpacked/`
- **Contents:**
  - All app files
  - Executable: `DocMark.exe`
  - Resources and dependencies

## File Structure After Build

```
dist-electron/
├── DocMark Setup 1.0.0.exe          # NSIS Installer
├── DocMark-1.0.0-portable.exe       # Portable version
├── win-unpacked/                    # Unpacked files
│   ├── DocMark.exe                  # Main executable
│   ├── resources/
│   ├── locales/
│   └── ...
└── builder-effective-config.json    # Build config used
```

## Installation Methods

### Method 1: NSIS Installer
1. Download `DocMark Setup 1.0.0.exe`
2. Run the installer
3. Follow the wizard
4. App installed to `C:\Program Files\DocMark\`

### Method 2: Portable Executable
1. Download `DocMark-1.0.0-portable.exe`
2. Run directly (no installation)
3. Can be moved to USB or any folder

### Method 3: Unpacked Version
1. Extract `win-unpacked/` folder
2. Run `DocMark.exe` directly
3. Useful for development or custom deployment

## Configuration

Edit `electron-builder.json` to customize:

```json
{
  "appId": "com.docmark.app",
  "productName": "DocMark",
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

## Troubleshooting

### Build fails with "electron-builder not found"
```bash
npm install --save-dev electron-builder
```

### Large file size
- Expected: 150-200 MB
- Includes: Electron, Node.js, all dependencies
- Normal for Electron apps

### Installer won't run
- Ensure Windows Defender/antivirus allows it
- Try running as Administrator
- Check Windows version (Windows 7+)

## Advanced Options

### Code Signing (Optional)
For production, add code signing:
```json
{
  "win": {
    "certificateFile": "path/to/cert.pfx",
    "certificatePassword": "password",
    "signingHashAlgorithms": ["sha256"]
  }
}
```

### Custom Icon
Add icon to `assets/icon.ico` (256x256 or larger)

### Auto-Update
Configure in `electron-builder.json`:
```json
{
  "publish": {
    "provider": "github",
    "owner": "your-username",
    "repo": "docmark"
  }
}
```

## Distribution

### Share Installer
- Upload `DocMark Setup 1.0.0.exe` to your website
- Users download and run installer
- App installs to Program Files

### Share Portable
- Upload `DocMark-1.0.0-portable.exe`
- Users run directly
- No installation needed

### Share Unpacked
- Zip `win-unpacked/` folder
- Users extract and run `DocMark.exe`
- Useful for portable USB deployment

## Next Steps

1. **Build:** `npm run build && electron-builder --win`
2. **Test:** Run the installer and portable version
3. **Distribute:** Upload to your website
4. **Update:** Increment version in `package.json` for next release

## Support

- **Electron Builder Docs:** https://www.electron.build/
- **Electron Docs:** https://www.electronjs.org/docs
- **Issues:** Check electron-builder GitHub

---

**Ready to build!** 🚀
