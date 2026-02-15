# PDF/SVG Embed Test for DocMark

This document tests embedding PDF files with vector drawings in DocMark's HTML renderer.

---

## Method 1: Download Link with Icon (Always Works)

This method provides a styled download button - guaranteed to work in DocMark.

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
  <a href="C:/Users/Administrator/Downloads/test_svg_embed.pdf" 
     download="test_svg_embed.pdf"
     style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; transition: transform 0.2s;"
     onmouseover="this.style.transform='translateY(-2px)'"
     onmouseout="this.style.transform='translateY(0)'">
    📥 Download PDF
  </a>
</div>

---

## Method 2: Object Tag Embed

Attempts to display the PDF inline (browser-dependent).

<!-- PDF Embed - Object Tag -->
<div class="pdf-container" style="width: 100%; max-width: 800px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
  <object data="C:/Users/Administrator/Downloads/test_svg_embed.pdf" type="application/pdf" width="100%" height="600px" style="border: none;">
    <p style="padding: 40px; text-align: center; color: #64748b;">
      Your browser does not support inline PDF viewing. 
      <a href="C:/Users/Administrator/Downloads/test_svg_embed.pdf" style="color: #3b82f6; text-decoration: underline;">Download the PDF</a> instead.
    </p>
  </object>
</div>

---

## Method 3: Iframe Embed

Alternative inline display method.

<!-- PDF Embed - Iframe -->
<div class="pdf-container" style="width: 100%; max-width: 800px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <iframe src="C:/Users/Administrator/Downloads/test_svg_embed.pdf" width="100%" height="600px" style="border: none;"></iframe>
</div>

---

## Method 4: SVG Wrapper with PDF

Embeds PDF inside an SVG foreignObject element.

<!-- SVG Wrapper with PDF -->
<div class="svg-container" style="width: 100%; max-width: 800px; margin: 20px auto;">
  <svg xmlns="http://www.w3.org/2000/svg" 
       xmlns:xlink="http://www.w3.org/1999/xlink"
       viewBox="0 0 800 1000" 
       style="width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%; height:100%;">
        <object data="C:/Users/Administrator/Downloads/test_svg_embed.pdf" type="application/pdf" width="100%" height="100%" style="border: none;">
          <p style="padding: 40px; text-align: center; color: #64748b;">PDF cannot be displayed in this view.</p>
        </object>
      </div>
    </foreignObject>
  </svg>
</div>

---

## Example: Pure SVG (Vector Graphics)

Here's an example of a pure SVG graphic that will definitely work:

<div style="width: 100%; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" style="width: 100%; height: auto;">
    <!-- Background -->
    <rect width="400" height="300" fill="#f8fafc"/>
    
    <!-- Grid -->
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="400" height="300" fill="url(#grid)"/>
    
    <!-- Circle -->
    <circle cx="100" cy="100" r="50" fill="#3b82f6" opacity="0.8"/>
    
    <!-- Rectangle -->
    <rect x="200" y="50" width="100" height="100" fill="#ef4444" opacity="0.8" rx="10"/>
    
    <!-- Triangle -->
    <polygon points="100,250 50,200 150,200" fill="#10b981" opacity="0.8"/>
    
    <!-- Line -->
    <line x1="200" y1="200" x2="300" y2="250" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    
    <!-- Text -->
    <text x="200" y="280" font-family="Arial, sans-serif" font-size="20" fill="#1e293b" text-anchor="middle">
      SVG Vector Graphics
    </text>
  </svg>
</div>

---

## Instructions for True SVG Conversion

If you need to convert the PDF to actual SVG format, use one of these tools:

### Windows (Recommended: Inkscape)

1. **Install Inkscape:**
   - Download from: https://inkscape.org/release/
   - Or use Chocolatey: `choco install inkscape`

2. **Convert PDF to SVG:**
   ```bash
   inkscape "C:\Users\Administrator\Downloads\test_svg_embed.pdf" --export-filename=output.svg --export-type=svg
   ```

### Windows (Alternative: pdftocairo)

1. **Install Poppler:**
   ```bash
   choco install poppler
   ```

2. **Convert PDF to SVG:**
   ```bash
   pdftocairo -svg "C:\Users\Administrator\Downloads\test_svg_embed.pdf" output.svg
   ```

### After Conversion

Once you have the SVG file, you can embed it directly:

```html
<!-- Inline SVG (paste SVG content here) -->
<div style="width: 100%; max-width: 800px; margin: 20px auto;">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
    <!-- SVG content from converted file -->
  </svg>
</div>
```

Or reference it as an image:

```html
<img src="output.svg" alt="Converted SVG" style="width: 100%; max-width: 800px; margin: 20px auto; display: block;" />
```

---

## Testing Checklist

- [ ] Download link button appears and is styled correctly
- [ ] Clicking download button downloads the PDF
- [ ] Object tag shows PDF or fallback message
- [ ] Iframe shows PDF (if browser supports)
- [ ] SVG wrapper displays correctly
- [ ] Pure SVG example renders with shapes and text
- [ ] All containers are responsive and centered
- [ ] Borders and styling appear correctly
- [ ] Dark theme support works (if applicable)

---

## Notes

- **Method 1 (Download Link)** is guaranteed to work in DocMark
- **Methods 2-4** depend on browser PDF support
- For best results with vector graphics, convert PDF to SVG using Inkscape
- All HTML is compatible with DocMark's HTML renderer
- Inline styles ensure consistent appearance

---

**Generated by:** pdf-to-svg-simple.js  
**Test Date:** 2026-02-15  
**DocMark Version:** 1.0.0
