# Table Overflow Fix for Paper Layout

## Date: 2026-02-17

## Problem
Tables with many columns were overflowing the paper layout boundaries, extending beyond the page margins in both the preview and PDF export. This caused tables to be clipped when exported to PDF.

## Root Cause
- Tables had no width constraints in paper layout mode
- No `table-layout: fixed` to force column sizing
- No word wrapping enabled for table cells
- PDF export didn't include table-specific CSS constraints

## Solutions Applied

### 1. Paper Layout CSS Fixes (public/css/style.css)

Added comprehensive table constraints for paper layout:

```css
/* Table overflow fixes for paper layout */
#output.paper-layout-active table {
    width: 100% !important;
    max-width: 100% !important;
    table-layout: fixed !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
}

#output.paper-layout-active table th,
#output.paper-layout-active table td {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    word-break: break-word !important;
    white-space: normal !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 0 !important;
    padding: 8px 6px !important;
    font-size: 11px !important;
    line-height: 1.4 !important;
}

#output.paper-layout-active table thead th {
    font-size: 10px !important;
    font-weight: 600 !important;
    padding: 6px 4px !important;
}
```

### 2. General Element Overflow Prevention

Added constraints for all elements in paper layout:

```css
/* Prevent any element from overflowing paper layout */
#output.paper-layout-active * {
    max-width: 100% !important;
}

#output.paper-layout-active img,
#output.paper-layout-active video,
#output.paper-layout-active iframe {
    max-width: 100% !important;
    height: auto !important;
}

#output.paper-layout-active pre,
#output.paper-layout-active code {
    max-width: 100% !important;
    overflow-x: auto !important;
    word-wrap: break-word !important;
    white-space: pre-wrap !important;
}
```

### 3. PDF Export Fixes (src/main.js)

Added table constraints to both PDF export functions:

#### exportPreviewToPdf() - Puppeteer Export
```javascript
/* Table overflow fixes for PDF export */
table {
    width: 100% !important;
    max-width: 100% !important;
    table-layout: fixed !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    page-break-inside: auto !important;
}

table th,
table td {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    word-break: break-word !important;
    white-space: normal !important;
    overflow: hidden !important;
    max-width: 0 !important;
    padding: 8px 6px !important;
    font-size: 10px !important;
    line-height: 1.3 !important;
}
```

#### printPreviewToPdf() - Browser Print
Same table constraints added to the print preview function.

## Key CSS Properties Explained

### table-layout: fixed
Forces the table to use fixed column widths based on the first row, preventing columns from expanding beyond the table width.

### word-wrap: break-word & overflow-wrap: break-word
Allows long words to break and wrap to the next line instead of overflowing.

### word-break: break-word
Breaks words at arbitrary points if necessary to prevent overflow.

### white-space: normal
Allows text to wrap normally instead of staying on one line.

### max-width: 0 (on cells)
When combined with table-layout: fixed, this forces equal column distribution and enables proper text wrapping.

### Reduced Font Sizes
- Table cells: 11px (preview) / 10px (PDF)
- Table headers: 10px (preview) / 9px (PDF)
- Ensures more content fits within the page width

## Testing Checklist

✅ Test table with many columns (8-10 columns)
✅ Test table with long text in cells
✅ Test table in paper layout preview
✅ Test table in web layout (should not be affected)
✅ Test PDF export via Puppeteer
✅ Test PDF export via browser print
✅ Verify table stays within paper margins
✅ Verify text wraps properly in cells
✅ Verify no horizontal overflow
✅ Verify table is not clipped in PDF

## Result

Tables now properly fit within paper layout boundaries:
1. **Fixed width**: Tables are constrained to 100% of available width
2. **Word wrapping**: Long text wraps within cells
3. **Responsive sizing**: Columns distribute evenly
4. **PDF compatibility**: Same constraints apply to PDF export
5. **No clipping**: Tables are fully visible in both preview and PDF

The table in your screenshot will now fit within the paper margins with all columns visible and text properly wrapped.
