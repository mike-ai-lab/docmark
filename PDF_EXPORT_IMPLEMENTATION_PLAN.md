# PDF Export Implementation Plan

## Current Issues

### Problems with existing `pdf-styler.js`:
1. ❌ Footer positioning incorrect (middle of page instead of bottom)
2. ❌ Character encoding issues (special chars not rendering)
3. ❌ Not WYSIWYG - PDF doesn't match HTML preview
4. ❌ Line breaks not preserved
5. ❌ Some formatting lost

### What Works:
✅ Basic text rendering
✅ Bold/italic detection
✅ Link detection
✅ Table rendering logic
✅ Unicode sanitization map

## New Approach: Enhanced PDF Export

### Key Improvements:

1. **WYSIWYG Layout Matching**
   - Process HTML exactly as displayed
   - Preserve visual spacing
   - Match line breaks from preview

2. **Better Text Handling**
   - Mixed formatting in same paragraph (bold + italic + links)
   - Proper line break preservation (`<br>` tags)
   - Better word wrapping

3. **Smart Page Breaks**
   - Estimate element heights before rendering
   - Avoid orphan lines
   - Keep related content together

4. **Footer Positioning**
   - Always at bottom of page
   - Independent of content height
   - Proper spacing from content

5. **Page Numbers**
   - Centered at bottom
   - Gray color
   - On every page

6. **Enhanced Character Support**
   - Better Unicode handling
   - Preserve special characters where possible
   - Fallback to ASCII only when necessary

## Implementation Strategy

### Phase 1: Create New Module
- File: `pdf-styler-v2.js`
- Keep existing `pdf-styler.js` as fallback
- Implement all enhancements

### Phase 2: Integration
- Add feature flag in main.js: `USE_ENHANCED_PDF_EXPORT`
- Try new approach first
- Fallback to old approach on error

### Phase 3: Testing
- Test with various markdown documents
- Verify character encoding
- Check footer positioning
- Validate page breaks

### Phase 4: Deployment
- Set enhanced as default
- Keep fallback for 1-2 releases
- Remove old approach after validation

## Code Structure

```javascript
// pdf-styler-v2.js

const PDF_CONFIG_V2 = {
    // A4 dimensions in cm
    width: 21.0,
    height: 29.7,
    marginTop: 2.54,
    marginBottom: 2.54,
    marginLeft: 2.54,
    marginRight: 2.54,
    
    // Font sizes (in points)
    fontSize: {
        h1: 20,
        h2: 16,
        h3: 13,
        h4: 12,
        paragraph: 10,
        list: 10,
        footer: 9,
        pageNumber: 9
    },
    
    // Spacing (in cm)
    spacing: {
        afterH1: 0.8,
        afterH2: 0.7,
        afterH3: 0.6,
        afterParagraph: 0.3,
        afterList: 0.3,
        lineHeight: 0.5
    }
};

// Main export function
async function exportToPDFV2(previewElement, filename, options = {}) {
    // 1. Initialize jsPDF
    // 2. Process HTML elements
    // 3. Handle page breaks
    // 4. Add footers
    // 5. Add page numbers
    // 6. Save PDF
}

// Helper: Process mixed formatting
function processTextWithFormatting(doc, element, x, y, maxWidth) {
    // Handle bold, italic, links in same paragraph
}

// Helper: Estimate element height
function estimateElementHeight(element) {
    // Calculate space needed before rendering
}

// Helper: Add footer at bottom
function addFooter(doc, footerElement, pageNumber, totalPages) {
    // Position at bottom regardless of content
}

// Fallback wrapper
async function exportToPDF(previewElement, filename, options = {}) {
    try {
        await exportToPDFV2(previewElement, filename, options);
    } catch (error) {
        console.warn('Enhanced PDF export failed, using fallback:', error);
        await exportToPDFV1(previewElement, filename, options);
    }
}
```

## Testing Checklist

- [ ] Basic markdown (headings, paragraphs, lists)
- [ ] Mixed formatting (bold + italic + links in same line)
- [ ] Line breaks (`<br>` tags)
- [ ] Special characters (em dash, en dash, quotes)
- [ ] Tables with various column widths
- [ ] Long documents (10+ pages)
- [ ] Footer positioning
- [ ] Page numbers
- [ ] Links clickable
- [ ] Unicode characters (Arabic, symbols)
- [ ] Code blocks
- [ ] Blockquotes
- [ ] Horizontal rules

## Rollout Plan

1. **Week 1**: Implement `pdf-styler-v2.js`
2. **Week 2**: Integration with feature flag
3. **Week 3**: Testing with real documents
4. **Week 4**: Deploy with fallback enabled
5. **Week 5-6**: Monitor for issues
6. **Week 7**: Remove fallback if stable

## Success Criteria

✅ PDF matches HTML preview visually
✅ All characters render correctly
✅ Footer always at bottom of page
✅ Page breaks are smart (no orphans)
✅ Links are clickable
✅ Page numbers on all pages
✅ No crashes or errors
✅ Performance acceptable (<5s for 10-page doc)
