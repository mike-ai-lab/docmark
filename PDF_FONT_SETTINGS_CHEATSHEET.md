# PDF Font Settings Cheatsheet

## Font Size Calibration

### The Problem
HTML uses pixels (px) while PDF uses points (pt). Direct conversion doesn't work because:
- 1px ≈ 0.75pt (theoretical)
- But visual rendering differs between browsers and PDF viewers
- Font families render at different sizes even with same pt value

### The Solution
Through testing, we found that **10.5pt in PDF ≈ 14px in HTML** when using Roboto font.

## Font Size Mapping

| Element | HTML Size | PDF Size (pt) | Multiplier | Notes |
|---------|-----------|---------------|------------|-------|
| Base text (p, li) | 14px | 10.5 | 1.0x | Body text |
| H1 | 28px | 21 | 2.0x | Main title |
| H2 | 21px | 16 | 1.5x | Section headers |
| H3 | 17.5px | 13 | 1.25x | Subsection headers |
| H4 | 16px | 11.5 | 1.1x | Minor headers |
| H5 | 14px | 10.5 | 1.0x | Same as body |
| H6 | 13px | 10 | 0.95x | Smallest header |

## Line Height Settings

| Element | HTML | PDF | Purpose |
|---------|------|-----|---------|
| Body text | 1.6 | 1.6 | Comfortable reading |
| Headings | 1.25 | 1.25 | Tighter spacing |
| Lists | 1.6 | 1.6 | Match body text |

## Spacing (Margins)

All margins in PDF are in points [left, top, right, bottom]:

| Element | Top | Bottom | Notes |
|---------|-----|--------|-------|
| H1 | 15pt | 10pt | Large breathing room |
| H2 | 12pt | 8pt | Section separation |
| H3 | 10pt | 6pt | Subsection separation |
| Paragraph | 0pt | 10pt | Space after only |
| List | 5pt | 10pt | Compact but readable |
| List item | 3pt | 3pt | Tight spacing |

## Color Palette

```javascript
{
    bodyText: '#24292f',      // GitHub dark gray
    headings: '#1a1a1a',      // Near black
    links: '#0969da',         // GitHub blue
    mutedText: '#666666',     // Gray for quotes/meta
    lightText: '#999999'      // Very light for footers
}
```

## Font Weights

pdfmake uses Roboto with these variants:
- **Regular**: Default body text
- **Bold**: Headings, strong, b tags
- **Italic**: em, i tags, blockquotes
- **BoldItalic**: Combined formatting

## Quick Reference Code

```javascript
const FONT_CONFIG = {
    baseFontSize: 10.5,  // Calibrated to match HTML 14px
    
    defaultStyle: {
        font: 'Roboto',
        fontSize: 10.5,
        lineHeight: 1.6,
        color: '#24292f'
    },
    
    styles: {
        h1: {fontSize: 21, bold: true, lineHeight: 1.25},
        h2: {fontSize: 16, bold: true, lineHeight: 1.25},
        h3: {fontSize: 13, bold: true, lineHeight: 1.25},
        body: {fontSize: 10.5, lineHeight: 1.6}
    }
};
```

## Testing Checklist

When adjusting fonts, verify:
- [ ] Body text is readable (not too small/large)
- [ ] Heading hierarchy is clear (size differences visible)
- [ ] Line spacing prevents text from feeling cramped
- [ ] Bold and italic render correctly
- [ ] Links are distinguishable
- [ ] Page margins feel balanced
- [ ] Text is selectable in PDF viewer
- [ ] File size is reasonable (<1MB for typical docs)

## Common Issues & Fixes

### Issue: Text too small in PDF
**Fix**: Increase `baseFontSize` from 10.5 to 11 or 11.5

### Issue: Headings not prominent enough
**Fix**: Increase multipliers (e.g., H2 from 1.5x to 1.75x)

### Issue: Text feels cramped
**Fix**: Increase `lineHeight` from 1.6 to 1.8

### Issue: Too much whitespace
**Fix**: Reduce bottom margins on paragraphs and lists

### Issue: Font looks different from HTML
**Fix**: Ensure HTML uses Roboto or similar system font

## Browser vs PDF Rendering

| Aspect | Browser (HTML) | PDF (pdfmake) |
|--------|----------------|---------------|
| Font rendering | Anti-aliased, subpixel | Vector-based |
| Font source | System fonts, web fonts | Embedded Roboto |
| Sizing unit | px (pixels) | pt (points) |
| Line breaking | Dynamic, responsive | Fixed width |
| Zoom behavior | Reflows content | Scales proportionally |

## Recommendations

1. **Always test with actual content** - Lorem ipsum doesn't reveal real-world issues
2. **Test on multiple PDF viewers** - Adobe, Chrome, Edge render slightly differently
3. **Print test pages** - Physical output may differ from screen
4. **Keep base size at 10.5pt** - This is the sweet spot for readability
5. **Use consistent line heights** - 1.6 for body, 1.25 for headings
6. **Don't go below 9pt** - Anything smaller is hard to read
7. **Maintain heading hierarchy** - Each level should be noticeably different

## Advanced: Custom Font Sizes

If you need to override for specific elements:

```javascript
const customConfig = {
    ...PDFMAKE_CONFIG,
    defaultStyles: {
        ...PDFMAKE_CONFIG.defaultStyles,
        h2: {
            ...PDFMAKE_CONFIG.defaultStyles.h2,
            fontSize: 18  // Custom size
        }
    }
};
```

## Integration Example

```javascript
// In your export function
const computedStyle = window.getComputedStyle(element);
const htmlFontSize = parseFloat(computedStyle.fontSize);

console.log(`HTML base font: ${htmlFontSize}px`);
console.log(`PDF base font: ${PDFMAKE_CONFIG.baseFontSize}pt`);

// Use the config
await exportWithPDFMake(element, 'document.pdf', PDFMAKE_CONFIG);
```
