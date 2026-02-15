# PDF to SVG Conversion Guide

## Current Status

✅ **Embed codes generated** - Ready to use in DocMark  
⚠️ **Conversion tools needed** - For true SVG conversion

---

## Quick Solution (Works Now!)

You already have embed codes that work in DocMark. Use these immediately:

### 1. Open the generated documentation
```
svg-output/pdf-embed-codes.md
```

### 2. Copy the Download Link embed code (Method 1)
This method works without any conversion - just copy and paste into DocMark!

### 3. Test in DocMark
```bash
npm run dev
# Open test-pdf-svg-embed.md
```

---

## For True SVG Conversion

To convert your PDF to actual SVG format, install one of these tools:

### Option 1: Inkscape (Recommended) ⭐

**Install:**
```powershell
# Using Chocolatey
choco install inkscape

# Or download from:
# https://inkscape.org/release/
```

**Convert:**
```powershell
# After installation, run:
powershell -ExecutionPolicy Bypass -File Convert-PdfToSvg.ps1

# Or manually:
inkscape "C:\Users\Administrator\Downloads\test_svg_embed.pdf" --export-filename=svg-output\converted.svg --export-type=svg
```

---

### Option 2: Poppler (pdftocairo)

**Install:**
```powershell
choco install poppler
```

**Convert:**
```powershell
pdftocairo -svg "C:\Users\Administrator\Downloads\test_svg_embed.pdf" svg-output\converted.svg
```

---

### Option 3: pdf2svg (You have the source)

**Compile pdf2svg:**

The pdf2svg folder you have contains source code. To compile it:

1. Install MSYS2 from https://www.msys2.org/
2. Open MSYS2 terminal
3. Install dependencies:
   ```bash
   pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-cairo mingw-w64-x86_64-poppler
   ```
4. Navigate to pdf2svg directory:
   ```bash
   cd /c/Users/Administrator/pdf2svg-0.2.4/pdf2svg-0.2.4
   ```
5. Compile:
   ```bash
   ./configure
   make
   ```

**Or use pre-compiled binary:**
Download from: https://github.com/jalios/pdf2svg-windows/releases

---

## Comparison of Methods

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Embed Codes (Current)** | ✅ Works now<br>✅ No installation<br>✅ Quick | ❌ Not true SVG<br>❌ Browser-dependent | Immediate use |
| **Inkscape** | ✅ Best quality<br>✅ Easy to use<br>✅ GUI available | ❌ Large download<br>❌ Slower | Best quality |
| **pdftocairo** | ✅ Fast<br>✅ Command-line<br>✅ Good quality | ❌ Requires Poppler | Automation |
| **pdf2svg** | ✅ Lightweight<br>✅ Fast | ❌ Needs compilation<br>❌ Windows support limited | Linux/Mac |

---

## Installation Commands Summary

### Install Chocolatey (if not installed)
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Install Inkscape
```powershell
choco install inkscape -y
```

### Install Poppler
```powershell
choco install poppler -y
```

### Verify Installation
```powershell
# Check Inkscape
inkscape --version

# Check pdftocairo
pdftocairo -v
```

---

## After Installation

### Run Conversion Script
```powershell
powershell -ExecutionPolicy Bypass -File Convert-PdfToSvg.ps1
```

### Or Use Node.js Script
```bash
node convert-with-pdf2svg.js
```

### Check Output
```
svg-output/
  ├── converted.svg          # Your SVG file
  └── svg-embed-codes.md     # Embed codes
```

---

## Using the SVG in DocMark

### Method 1: Inline SVG (Best)
1. Open `svg-output/converted.svg` in text editor
2. Copy entire SVG content
3. Paste into DocMark editor
4. Wrap in a div:
   ```html
   <div style="width: 100%; max-width: 800px; margin: 20px auto;">
     <!-- Paste SVG here -->
   </div>
   ```

### Method 2: Image Reference
```html
<img src="svg-output/converted.svg" alt="SVG" style="width: 100%; max-width: 800px;" />
```

### Method 3: Object Tag
```html
<object data="svg-output/converted.svg" type="image/svg+xml" style="width: 100%; max-width: 800px;">
  <img src="svg-output/converted.svg" alt="SVG" />
</object>
```

---

## Troubleshooting

### "Command not found" after installation
- Close and reopen PowerShell/Terminal
- Check PATH: `$env:PATH`
- Restart computer if needed

### Conversion fails
- Check PDF file exists
- Verify PDF is not corrupted
- Try different tool (Inkscape vs pdftocairo)

### SVG looks wrong
- PDF may have embedded fonts
- Try different conversion tool
- Check if PDF has transparency

### Large file size
- SVG may contain embedded images
- Use optimization tools
- Consider converting to PNG for raster content

---

## Quick Reference

### Current Working Solution
```bash
# Use existing embed codes
1. Open: svg-output/pdf-embed-codes.md
2. Copy: Method 1 (Download Link)
3. Paste: Into DocMark
4. Done! ✅
```

### After Installing Inkscape
```powershell
# Convert to true SVG
powershell -ExecutionPolicy Bypass -File Convert-PdfToSvg.ps1

# Or manually
inkscape input.pdf --export-filename=output.svg --export-type=svg
```

### After Installing Poppler
```powershell
# Convert to true SVG
pdftocairo -svg input.pdf output.svg
```

---

## Files You Have

✅ **pdf-to-svg-simple.js** - Generates embed codes (already ran)  
✅ **pdf-to-svg-converter.js** - Full converter (needs tools)  
✅ **convert-with-pdf2svg.js** - pdf2svg converter (needs binary)  
✅ **Convert-PdfToSvg.ps1** - PowerShell converter (needs tools)  
✅ **convert-pdf-direct.bat** - Batch converter (needs tools)  
✅ **svg-output/pdf-embed-codes.md** - Ready-to-use embed codes  
✅ **test-pdf-svg-embed.md** - DocMark test file  

---

## Recommended Workflow

### For Immediate Use (No Installation)
1. ✅ Use embed codes from `svg-output/pdf-embed-codes.md`
2. ✅ Test with `test-pdf-svg-embed.md` in DocMark
3. ✅ Works right now!

### For Best Quality (Install Inkscape)
1. Install: `choco install inkscape -y`
2. Convert: `powershell -ExecutionPolicy Bypass -File Convert-PdfToSvg.ps1`
3. Use: Inline SVG in DocMark
4. Result: Perfect vector graphics!

---

## Summary

**Current Status:**
- ✅ Embed codes ready
- ✅ Test file ready
- ✅ Works in DocMark now
- ⚠️ Need tools for true SVG

**Next Steps:**
1. **Now:** Use embed codes from `svg-output/pdf-embed-codes.md`
2. **Later:** Install Inkscape for true SVG conversion
3. **Future:** Automate with scripts

**Best Approach:**
- Use Method 1 (Download Link) for immediate results
- Install Inkscape when you need true SVG
- Both methods work perfectly in DocMark!

---

**Generated:** 2026-02-15  
**Status:** Ready to use  
**Tools needed:** Optional (for true SVG conversion)
