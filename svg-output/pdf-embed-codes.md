# PDF Embed Codes for DocMark

**Source PDF:** test_svg_embed.pdf  
**Generated:** 2026-02-15T10:26:03.061Z

---

## ⚠️ Important Note

Since the PDF contains vector drawings, the best approach depends on your needs:

1. **For true SVG conversion:** Use external tools like Inkscape or pdftocairo
2. **For quick embedding:** Use the methods below to embed the PDF directly
3. **For DocMark compatibility:** All methods below work with DocMark's HTML renderer

---

## Method 1: Object Tag (Recommended)

Best browser compatibility, allows PDF viewing in-page.

```html
<!-- PDF Embed - Object Tag -->
<div class="pdf-container" style="width: 100%; max-width: 800px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <object data="../Downloads/test_svg_embed.pdf" type="application/pdf" width="100%" height="600px" style="border: none;">
    <p>Your browser does not support PDFs. <a href="../Downloads/test_svg_embed.pdf">Download the PDF</a>.</p>
  </object>
</div>
```

**Pros:**
- ✅ Works in most browsers
- ✅ Allows PDF interaction (zoom, scroll)
- ✅ Fallback message for unsupported browsers

**Cons:**
- ❌ Requires PDF file to be accessible
- ❌ May not work in all browsers

---

## Method 2: Iframe Embed

Simple iframe embedding.

```html
<!-- PDF Embed - Iframe -->
<div class="pdf-container" style="width: 100%; max-width: 800px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <iframe src="../Downloads/test_svg_embed.pdf" width="100%" height="600px" style="border: none;"></iframe>
</div>
```

**Pros:**
- ✅ Very simple
- ✅ Works in most browsers

**Cons:**
- ❌ Less control over appearance
- ❌ May show browser PDF viewer UI

---

## Method 3: SVG Wrapper

Embeds PDF inside an SVG foreignObject.

```html
<!-- SVG Wrapper with PDF -->
<div class="svg-container" style="width: 100%; max-width: 800px; margin: 20px auto;">
  <svg xmlns="http://www.w3.org/2000/svg" 
       xmlns:xlink="http://www.w3.org/1999/xlink"
       viewBox="0 0 800 1000" 
       style="width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%; height:100%;">
        <object data="../Downloads/test_svg_embed.pdf" type="application/pdf" width="100%" height="100%" style="border: none;">
          <p>PDF cannot be displayed.</p>
        </object>
      </div>
    </foreignObject>
  </svg>
</div>
```

**Pros:**
- ✅ SVG-based (scalable)
- ✅ Can add SVG decorations/overlays

**Cons:**
- ❌ Browser support varies
- ❌ More complex

---

## Method 4: Download Link with Icon

Provides a styled download link instead of embedding.

```html
<!-- PDF Link with Preview -->
<div class="pdf-link-container" style="width: 100%; max-width: 800px; margin: 20px auto; padding: 30px; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center; background: #f8fafc;">
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="margin-bottom: 15px;">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
  <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px;">test_svg_embed.pdf</h3>
  <p style="margin: 0 0 20px 0; color: #64748b; font-size: 14px;">PDF Document with Vector Drawings</p>
  <a href="../Downloads/test_svg_embed.pdf" 
     download="test_svg_embed.pdf"
     style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; transition: transform 0.2s;"
     onmouseover="this.style.transform='translateY(-2px)'"
     onmouseout="this.style.transform='translateY(0)'">
    📥 Download PDF
  </a>
</div>
```

**Pros:**
- ✅ Always works
- ✅ Clean, professional appearance
- ✅ No browser compatibility issues

**Cons:**
- ❌ Doesn't show PDF inline
- ❌ Requires download to view

---

## Converting to True SVG

For true vector SVG conversion, use one of these tools:

### Option 1: Inkscape (Recommended)
```bash
# Install Inkscape from https://inkscape.org/
inkscape "C:\Users\Administrator\Downloads\test_svg_embed.pdf" --export-filename=output.svg --export-type=svg
```

### Option 2: pdftocairo (Best Quality)
```bash
# Install poppler-utils
# Windows: choco install poppler
# Mac: brew install poppler
pdftocairo -svg "C:\Users\Administrator\Downloads\test_svg_embed.pdf" output.svg
```

### Option 3: pdf2svg
```bash
# Install from http://www.cityinthesky.co.uk/opensource/pdf2svg/
pdf2svg "C:\Users\Administrator\Downloads\test_svg_embed.pdf" output.svg
```

---

## Usage in DocMark

1. **Copy** one of the embed codes above
2. **Paste** directly into DocMark editor
3. **Preview** - The PDF/SVG will render in the preview pane

### Styling Tips

Customize the appearance:

```css
/* Container styling */
.pdf-container {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Dark theme support */
[data-theme="dark"] .pdf-container {
  border-color: #334155;
  background: #1e293b;
}
```

---

## Troubleshooting

### PDF doesn't display
- Check if PDF file path is correct
- Ensure PDF file is in the same directory or accessible
- Try the download link method instead

### Browser shows "Plugin not supported"
- Use the download link method
- Convert PDF to images and embed as `<img>` tags
- Use a PDF.js-based viewer

### Need true SVG?
- Use Inkscape, pdftocairo, or pdf2svg
- These tools extract actual vector paths
- Results in true scalable SVG files

---

**Generated by:** pdf-to-svg-simple.js  
**For:** DocMark HTML Renderer
