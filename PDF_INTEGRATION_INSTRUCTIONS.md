# PDF Export V2 Integration Instructions

## Files Created

1. ✅ `pdf-styler-v2.js` - New enhanced PDF export module
2. ✅ `PDF_EXPORT_IMPLEMENTATION_PLAN.md` - Strategy document
3. ✅ This file - Integration instructions

## Integration Steps

### Step 1: Add V2 Script to index.html

Add the new script AFTER the existing pdf-styler.js:

```html
<!-- Existing -->
<script src="./pdf-styler.js"></script>

<!-- NEW: Add this line -->
<script src="./pdf-styler-v2.js"></script>
```

### Step 2: Modify main.js - Add Feature Flag

At the top of main.js, add a feature flag (around line 50-100):

```javascript
// PDF Export Configuration
const USE_ENHANCED_PDF_EXPORT = true; // Set to false to use old approach
```

### Step 3: Wrap the Export Function

Replace the current `exportPreviewToPdf` function (starts around line 2183) with this wrapper:

```javascript
let exportPreviewToPdf = async () => {
    const outputElement = document.querySelector('#output');
    if (!outputElement) {
        return;
    }

    // Wait for jsPDF to load
    if (typeof window.jspdf === 'undefined') {
        let attempts = 0;
        while (typeof window.jspdf === 'undefined' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (typeof window.jspdf === 'undefined') {
            window.alert('PDF export library failed to load. Please refresh the page and try again.');
            return;
        }
    }

    // Try enhanced export first, fallback to legacy on error
    if (USE_ENHANCED_PDF_EXPORT && window.PDFStylerV2) {
        try {
            console.log('[PDF] Using enhanced export (V2)');
            
            // Generate filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const styleName = currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1);
            const filename = `DocMark_${styleName}_${timestamp}.pdf`;
            
            await window.PDFStylerV2.exportToPDFV2(outputElement, filename);
            console.log('[PDF] Enhanced export completed successfully');
            return;
            
        } catch (error) {
            console.warn('[PDF] Enhanced export failed, falling back to legacy:', error);
            // Fall through to legacy export below
        }
    }

    // Legacy export (existing code)
    console.log('[PDF] Using legacy export (V1)');
    try {
        // ... KEEP ALL EXISTING CODE HERE ...
        // (The entire current exportPreviewToPdf implementation)
        
    } catch (error) {
        console.error('Failed to export PDF:', error);
        window.alert('Failed to export PDF. Please try again.');
    }
};
```

### Step 4: Testing Checklist

Test the following scenarios:

#### Basic Functionality
- [ ] Export simple markdown (headings, paragraphs, lists)
- [ ] Export with bold text
- [ ] Export with italic text
- [ ] Export with bold + italic combined
- [ ] Export with links (verify clickable)
- [ ] Export with inline code
- [ ] Export with code blocks

#### Special Characters
- [ ] Em dash (—)
- [ ] En dash (–)
- [ ] Smart quotes (" " ' ')
- [ ] Ellipsis (…)
- [ ] Degree symbol (°)
- [ ] Plus-minus (±)

#### Layout Features
- [ ] Multiple pages (10+ page document)
- [ ] Page numbers appear on all pages
- [ ] Footer positioned at bottom
- [ ] No orphan lines
- [ ] Tables render correctly
- [ ] Horizontal rules render

#### Edge Cases
- [ ] Very long paragraphs
- [ ] Very long lists
- [ ] Mixed formatting in same paragraph
- [ ] Line breaks (`<br>` tags)
- [ ] Empty elements
- [ ] Special div with `data-pdf-footer="true"`

#### Fallback Testing
- [ ] Set `USE_ENHANCED_PDF_EXPORT = false` and verify old export still works
- [ ] Temporarily break V2 (rename function) and verify fallback triggers
- [ ] Check console logs show correct export method being used

### Step 5: Gradual Rollout

**Week 1-2: Testing Phase**
- Deploy with `USE_ENHANCED_PDF_EXPORT = true`
- Monitor for user reports
- Check browser console for errors

**Week 3-4: Validation Phase**
- If no issues, keep V2 as default
- If issues found, fix and redeploy
- Can toggle flag to V1 if critical issues

**Week 5+: Cleanup Phase**
- After 2 weeks of stable V2, consider removing V1
- Keep fallback for at least 1 month
- Document any V2-specific limitations

### Step 6: Known Limitations

#### V2 Limitations:
- Table rendering is simplified (no complex column widths yet)
- Images not yet supported (will add in future update)
- No custom fonts (Helvetica only)

#### V1 Limitations (why we're upgrading):
- Footer positioning incorrect
- Character encoding issues
- Not WYSIWYG
- Line breaks not preserved

### Step 7: Rollback Plan

If V2 causes issues:

1. Set `USE_ENHANCED_PDF_EXPORT = false` in main.js
2. Rebuild: `npm run build`
3. Deploy
4. Investigate issue
5. Fix V2 and redeploy with flag = true

### Step 8: Future Enhancements

After V2 is stable, consider adding:

- [ ] Image embedding support
- [ ] Better table rendering (complex layouts)
- [ ] Custom fonts support
- [ ] Page headers
- [ ] Watermarks
- [ ] PDF metadata (author, title, keywords)
- [ ] Compression options
- [ ] A4 vs Letter format toggle

## Quick Reference

### Console Log Messages

```
[PDF] Using enhanced export (V2)          // V2 is being used
[PDF V2] Starting enhanced export         // V2 initialization
[PDF V2] Processing X elements            // V2 processing
[PDF V2] Export complete - X pages        // V2 success
[PDF] Enhanced export failed, falling back // V2 failed, using V1
[PDF] Using legacy export (V1)            // V1 is being used
```

### File Locations

- `index.html` - Add V2 script tag
- `src/main.js` - Add feature flag and wrapper
- `pdf-styler.js` - Legacy export (V1)
- `pdf-styler-v2.js` - Enhanced export (V2)

### Support

If issues arise:
1. Check browser console for error messages
2. Verify jsPDF loaded: `console.log(window.jspdf)`
3. Verify V2 loaded: `console.log(window.PDFStylerV2)`
4. Test with simple markdown first
5. Toggle feature flag to isolate V1 vs V2 issues

## Success Criteria

V2 is considered successful when:
- ✅ All test cases pass
- ✅ No user-reported issues for 2 weeks
- ✅ Console shows no errors
- ✅ PDFs match HTML preview visually
- ✅ All characters render correctly
- ✅ Footer always at bottom
- ✅ Page numbers on all pages
