# PDF Styler Module Documentation

## Overview
This module (`pdf-styler.js`) handles all PDF visual appearance and styling for the Markdown Live Preview editor. It's a standalone, well-documented module that can be shared with consultants for debugging.

## File Structure

### 1. Configuration (Lines 1-60)
- `PDF_CONFIG` object contains all styling constants
- Font sizes for all element types (h1-h6, paragraphs, lists, tables, etc.)
- Spacing values (before/after each element type)
- Color definitions (text, links, borders, backgrounds)

### 2. Unicode Sanitization (Lines 62-115)
- `sanitizeForPdf()` function converts Unicode characters to ASCII
- Prevents garbled text in PDF output
- Maps special characters: ≈→~, →→->, ²→2, ×→x, etc.

### 3. Text Rendering Helpers (Lines 117-380)
- `addText()` - Basic text rendering with word wrapping
- `getFormattedText()` - Extracts formatted segments (bold, italic, links, code)
- `addFormattedText()` - Renders formatted text with clickable blue links
- `addSpacing()` - Adds vertical spacing between elements

### 4. Table Rendering (Lines 382-540)
- `renderTable()` - Professional table formatting
- Dynamic column widths based on content
- Proper text wrapping in cells
- Clickable links in table cells (blue, underlined)
- **5mm spacing BEFORE tables**
- **8mm spacing AFTER tables** (critical for visual separation)

### 5. Element Rendering Functions (Lines 542-620)
- `renderHeading()` - H1-H6 with proper spacing
- `renderParagraph()` - Paragraphs with formatted text
- `renderList()` - Ordered and unordered lists
- `renderBlockquote()` - Blockquotes with gray color
- `renderCodeBlock()` - Code blocks with monospace font
- `renderHorizontalRule()` - Horizontal lines

### 6. Main Export Function (Lines 622-690)
- `exportToPDF()` - Entry point for PDF generation
- Waits for jsPDF library to load
- Processes all preview elements sequentially
- Handles errors gracefully

## Key Features

### ✅ Unicode Character Handling
Special characters are converted to ASCII equivalents to prevent corruption:
```
≈ → ~
→ → ->
² → 2
× → x
Ø → O
```

### ✅ Clickable Links
Links are rendered with:
- Blue color (#0066CC)
- Underline decoration
- Clickable URL functionality
- Works in paragraphs AND table cells

### ✅ Professional Table Formatting
- Dynamic column widths (proportional to content)
- Minimum 20mm per column
- Proper text wrapping in cells
- Header row with gray background
- Border styling

### ✅ Proper Spacing
Critical spacing values:
- **Before table: 5mm** - Clear separation from previous content
- **After table: 8mm** - Strong visual break (largest spacing!)
- After paragraphs: 2mm
- After headings: 1-3mm (varies by level)

## Usage

### In main.js:
```javascript
// Import the module
import { exportToPDF } from './pdf-styler.js';

// Or if using script tag:
// The module exports to window.PDFStyler

// Call the export function
const previewElement = document.getElementById('preview');
await exportToPDF(previewElement, 'my-document.pdf');
```

### Customization:
To change styling, modify the `PDF_CONFIG` object at the top of the file:
```javascript
const PDF_CONFIG = {
    fontSize: {
        h1: 20,  // Change heading sizes
        paragraph: 11,  // Change body text size
        table: 8  // Change table text size
    },
    spacing: {
        afterTable: 8,  // Adjust table spacing
        afterParagraph: 2  // Adjust paragraph spacing
    },
    colors: {
        link: [0, 102, 204],  // Change link color (RGB)
        text: [0, 0, 0]  // Change text color
    }
};
```

## Known Issues & Solutions

### Issue 1: Garbled Text in PDF
**Cause:** Unicode characters not supported by jsPDF default font
**Solution:** `sanitizeForPdf()` converts all special characters to ASCII

### Issue 2: Links Not Clickable
**Cause:** Missing `doc.link()` calls
**Solution:** `addFormattedText()` and `renderTable()` add clickable links with blue styling

### Issue 3: Tables Overlapping Content
**Cause:** Insufficient spacing after tables
**Solution:** `afterTable: 8mm` spacing (largest in the config)

### Issue 4: Text Overflow in Tables
**Cause:** Fixed column widths
**Solution:** Dynamic width calculation based on content with proper wrapping

## Testing Checklist

When debugging, verify:
- [ ] Special characters (≈, →, ²) render correctly
- [ ] Links are blue and clickable
- [ ] Tables have proper spacing (5mm before, 8mm after)
- [ ] Table columns have appropriate widths
- [ ] Text wraps properly in table cells
- [ ] Multi-page documents work correctly
- [ ] All heading levels render with correct sizes
- [ ] Lists (ordered and unordered) format correctly
- [ ] Blockquotes have gray color and indent
- [ ] Code blocks use monospace font

## Dependencies

- **jsPDF** (window.jspdf) - Required for PDF generation
- Loaded via CDN in index.html: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`

## File Size
- Total lines: ~690
- Well-commented and organized
- Standalone module (no external dependencies except jsPDF)

## Contact
For questions about this module, refer to:
- `FINAL_PDF_FIX.md` - Complete fix history
- `ALL_FIXES_COMPLETE.md` - Summary of all fixes
- `CLICKABLE_LINKS_FIX.md` - Link implementation details
