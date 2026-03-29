# PDF Export Page Size Information

## Page Size Used: A4

Both the paper layout preview and PDF export use **A4** page size.

### A4 Dimensions:

**Physical Size:**
- Width: 210mm (8.27 inches)
- Height: 297mm (11.69 inches)

**Pixel Dimensions (at 96 DPI):**
- Width: 794 pixels
- Height: 1123 pixels

**Conversion Factor:**
- 1mm ≈ 3.7795275591 pixels (at 96 DPI)

## Paper Layout Preview

The paper layout mode in the editor uses these exact A4 dimensions:

```javascript
const pageWidth = 794;   // 210mm in pixels
const pageHeight = 1123; // 297mm in pixels
```

This ensures that what you see in the paper layout preview matches the final PDF export.

## PDF Export Settings

When exporting to PDF, the system uses:

```javascript
// In pdf-server.js
const pdfBuffer = await page.pdf({
    format: 'A4',           // Standard A4 page size
    printBackground: true,  // Include background colors/images
    preferCSSPageSize: false, // Use format setting, not CSS
    margin: pdfMargins      // User-defined margins
});
```

And in the HTML/CSS:

```css
@page {
    size: A4;              /* Standard A4 page size */
    margin: 0;             /* Margins handled via body padding */
}
```

## Margins

The PDF export uses **manual margins via CSS padding** instead of Puppeteer's margin settings. This prevents viewport shrinking and coordinate system issues.

Default margins (can be customized in PDF settings):
- Top: 15mm + 15mm safety padding
- Bottom: 15mm + 15mm safety padding  
- Left: 10mm + 10mm safety padding
- Right: 10mm + 10mm safety padding

## Why A4?

A4 is the international standard paper size (ISO 216) used in most countries except the US/Canada. It provides:
- Good readability with standard fonts
- Efficient paper usage
- Wide compatibility with printers worldwide
- Professional document appearance

## Changing Page Size

If you need a different page size (Letter, Legal, etc.), you would need to modify:

1. **Paper Layout Preview** (`src/main.js` - renderPaperLayout function):
   ```javascript
   const pageWidth = 794;   // Change for different size
   const pageHeight = 1123; // Change for different size
   ```

2. **PDF Export** (`pdf-server.js`):
   ```javascript
   format: 'A4',  // Change to 'Letter', 'Legal', 'A3', etc.
   ```

3. **CSS** (`src/main.js` - collectHtmlForPuppeteer function):
   ```css
   @page {
       size: A4;  /* Change to match */
   }
   ```

## Common Page Sizes

For reference:
- **A4**: 210 × 297mm (794 × 1123px at 96 DPI)
- **Letter**: 8.5 × 11 inches (816 × 1056px at 96 DPI)
- **Legal**: 8.5 × 14 inches (816 × 1344px at 96 DPI)
- **A3**: 297 × 420mm (1123 × 1587px at 96 DPI)
