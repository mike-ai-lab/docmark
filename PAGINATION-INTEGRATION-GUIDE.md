# Pagination System Integration Guide for DocMark

## Overview
This guide provides step-by-step instructions to replace the broken pagination system in the DocMark application with the working line-based pagination system.

---

## Current Problems in DocMark

### Issues to Fix:
1. ❌ Lines are clipped in half at page breaks
2. ❌ Lines are duplicated across pages
3. ❌ Bottom margin is violated by content overflow
4. ❌ Complex element-by-element distribution breaks with edge cases
5. ❌ Changing margins doesn't properly reflow content
6. ❌ Header/footer can overlap with content at 0mm margins

---

## Solution Architecture

### Key Components:
1. **Line-Based Pagination** - Content area height is always N × lineHeight
2. **Safety Padding** - Automatic padding protects header/footer
3. **Offset-Based Rendering** - All pages show same content, just shifted
4. **Overflow Clipping** - CSS `overflow: hidden` prevents margin violations

### Safety Padding System:
- **Vertical (Top/Bottom):** User value + 15mm (protects header/footer)
- **Horizontal (Left/Right):** User value + 10mm (visual spacing)
- **User sees:** 0-50mm in UI
- **Backend uses:** 15-65mm (vertical), 10-60mm (horizontal)

---

## Files to Modify in DocMark

### 1. Main Application File
**Location:** `src/main.js` or `index.html` (wherever pagination logic exists)

**Functions to Replace:**
- `createPhysicalPages()` - Old element distribution logic
- `createPageHTML()` - Old page rendering
- Any `applyMarginsToPages()` or similar functions

**Functions to Keep:**
- `updatePreview()` - Just update what it calls
- `parseMarkdown()` - Keep for web layout, don't use for print layout

---

## Step-by-Step Integration

### STEP 1: Backup Current Code
```bash
# Create backup of current pagination system
cp src/main.js src/main.js.backup
# Or wherever your pagination code lives
```

### STEP 2: Remove Old Pagination Code

**Search for and DELETE these patterns:**

```javascript
// OLD CODE - DELETE THIS
function createPhysicalPages(html) {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;
    
    const elements = Array.from(tempContainer.children);
    
    // Measure and distribute elements across pages
    for (const element of elements) {
        // ... complex element-by-element logic
        if (currentPageHeight + elementHeight > contentHeightPx) {
            // ... page break logic
        }
    }
}
```

**Also DELETE:**
```javascript
// OLD CODE - DELETE THIS
function applyMarginsToPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        const pageContent = page.querySelector('.page-content');
        pageContent.style.padding = `${currentMargins.top}mm ...`;
    });
}
```

### STEP 3: Add New Pagination Code

**Copy this EXACT code:**

```javascript
// LINE-BASED PAGINATION - Prevents partial line clipping
function createPhysicalPages(html) {
    const pageSize = document.getElementById('page-size').value;
    const PX_SCALE = 3.7795275591;
    const pageWidthMm = pageSize === 'a4' ? 210 : 216;
    const pageHeightMm = pageSize === 'a4' ? 297 : 279;
    const pageWidthPx = pageWidthMm * PX_SCALE;
    const pageHeightPx = pageHeightMm * PX_SCALE;
    
    // SAFETY PADDING: Different for vertical (header/footer) vs horizontal (aesthetics)
    const VERTICAL_PADDING = 15;   // Top/Bottom: Protects header and page number
    const HORIZONTAL_PADDING = 10; // Left/Right: Just for visual spacing
    
    const safeMargins = {
        top: currentMargins.top + VERTICAL_PADDING,
        bottom: currentMargins.bottom + VERTICAL_PADDING,
        left: currentMargins.left + HORIZONTAL_PADDING,
        right: currentMargins.right + HORIZONTAL_PADDING
    };
    
    // 1. MEASURE: Create probe to get line height and total content height
    const probe = document.createElement('div');
    probe.style.cssText = `
        position: absolute;
        top: -9999px;
        visibility: hidden;
        width: ${pageWidthMm - safeMargins.left - safeMargins.right}mm;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
    `;
    probe.textContent = html || 'Sample';
    document.body.appendChild(probe);
    
    const lineHeight = parseFloat(window.getComputedStyle(probe).lineHeight);
    const totalContentHeight = probe.offsetHeight;
    document.body.removeChild(probe);
    
    // 2. CALCULATE: How many complete lines fit per page
    const availableHeight = pageHeightPx - (safeMargins.top + safeMargins.bottom) * PX_SCALE;
    const linesPerPage = Math.floor(availableHeight / lineHeight);
    const exactContentHeight = linesPerPage * lineHeight;
    
    // 3. PAGES: Calculate how many pages needed
    const pageCount = Math.max(1, Math.ceil(totalContentHeight / exactContentHeight));
    
    console.log(`Pagination: ${pageCount} pages, ${linesPerPage} lines/page, safe margins: ${JSON.stringify(safeMargins)}`);
    
    // 4. RENDER: Generate pages with offset-based content
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
        pages.push(createPageHTML(html, i + 1, pageCount, i * exactContentHeight, exactContentHeight, safeMargins));
    }
    
    return pages.join('');
}

// Create individual page HTML with clipping - USES RAW TEXT
function createPageHTML(content, pageNumber, totalPagesCount, offset, contentHeight, margins) {
    const pageSize = document.getElementById('page-size').value;
    const pageSizeClass = pageSize === 'letter' ? 'letter-size' : '';
    const marginGuideClass = showMarginGuides ? '' : 'hide-margin-guides';
    
    // Escape HTML to display as plain text
    const escapedContent = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return `
        <div class="page ${pageSizeClass} ${marginGuideClass}" 
             style="--margin-top: ${margins.top}mm; --margin-right: ${margins.right}mm; --margin-bottom: ${margins.bottom}mm; --margin-left: ${margins.left}mm;">
            <div class="page-header">Sample Document</div>
            <div class="page-content" style="position: absolute; top: ${margins.top}mm; left: ${margins.left}mm; right: ${margins.right}mm; height: ${contentHeight}px; overflow: hidden;">
                <div style="position: relative; top: -${offset}px; white-space: pre-wrap; word-wrap: break-word;">
                    ${escapedContent}
                </div>
            </div>
            <div class="page-number-float">${pageNumber}</div>
        </div>
    `;
}
```

### STEP 4: Update CSS

**Find `.page-content` CSS and REPLACE with:**

```css
.page-content {
    position: absolute;
    box-sizing: border-box;
    word-wrap: break-word;
    hyphens: auto;
    overflow: hidden; /* CRITICAL: Prevents content overflow */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
}
```

**DELETE these CSS rules if they exist:**
```css
/* DELETE THIS */
.page-content p,
.page-content h1,
.page-content h2,
.page-content h3,
.page-content h4,
.page-content h5,
.page-content h6,
.page-content li {
    break-inside: avoid;
    page-break-inside: avoid;
}
```

### STEP 5: Update `updatePreview()` Function

**Find the `updatePreview()` function and UPDATE:**

```javascript
// OLD CODE - FIND THIS
function updatePreview() {
    const text = editor.value;
    const html = parseMarkdown(text); // ❌ Don't use for print layout
    
    if (currentLayout === 'print') {
        const pages = createPhysicalPages(html); // ❌ Wrong
        previewOutput.innerHTML = pages;
    }
}

// NEW CODE - REPLACE WITH THIS
function updatePreview() {
    const text = editor.value;
    
    if (currentLayout === 'print') {
        // Use RAW TEXT for print layout (not parsed markdown)
        const pages = createPhysicalPages(text); // ✅ Pass raw text
        previewOutput.innerHTML = pages;
        
        // Update page count in status
        const pageCount = document.querySelectorAll('.page').length;
        totalPages = pageCount;
        document.getElementById('current-page').textContent = currentPageIndex + 1;
        document.getElementById('total-pages').textContent = pageCount;
        
        applyViewMode();
    } else {
        // For web layout, use parsed markdown
        previewOutput.innerHTML = parseMarkdown(text);
        pageNavigation.style.display = 'none';
        preview.classList.remove('page-view');
    }
    
    // Apply current text alignment
    applyTextAlignment();
    
    // Apply current page number alignment
    applyPageNumberAlignment();
}
```

### STEP 6: Update Margin Defaults

**Find margin initialization and UPDATE:**

```javascript
// OLD CODE
let currentMargins = { top: 25, right: 20, bottom: 25, left: 20 };

// NEW CODE - Better defaults
let currentMargins = { top: 5, right: 5, bottom: 5, left: 5 };
```

**Update HTML input defaults:**

```html
<!-- OLD -->
<input type="number" id="margin-top" value="25" min="0" max="50">

<!-- NEW -->
<input type="number" id="margin-top" value="5" min="0" max="50">
```

**Update margin presets:**

```javascript
// OLD CODE
const marginPresets = {
    normal: { top: 25, right: 20, bottom: 25, left: 20 },
    narrow: { top: 12, right: 12, bottom: 12, left: 12 },
    wide: { top: 35, right: 35, bottom: 35, left: 35 },
    minimal: { top: 10, right: 10, bottom: 10, left: 10 }
};

// NEW CODE - User-facing values (safety padding added internally)
const marginPresets = {
    normal: { top: 5, right: 5, bottom: 5, left: 5 },
    narrow: { top: 2, right: 2, bottom: 2, left: 2 },
    wide: { top: 15, right: 15, bottom: 15, left: 15 },
    minimal: { top: 0, right: 0, bottom: 0, left: 0 }
};
```

### STEP 7: Update Margin Application

**Find `applyLayoutSettings()` and ENSURE it calls `updatePreview()`:**

```javascript
window.applyLayoutSettings = function() {
    // Apply text alignment
    const activeTextAlign = document.querySelector('#layout-modal .layout-btn.active[id^="text-align-"]');
    if (activeTextAlign) {
        currentTextAlign = activeTextAlign.dataset.align;
        applyTextAlignment();
    }
    
    // Apply page number alignment
    const activePageAlign = document.querySelector('#layout-modal .layout-btn.active[id^="page-align-"]');
    if (activePageAlign) {
        currentPageNumberAlign = activePageAlign.dataset.align;
        applyPageNumberAlignment();
    }
    
    // Apply margins
    currentMargins.top = parseInt(document.getElementById('margin-top').value);
    currentMargins.right = parseInt(document.getElementById('margin-right').value);
    currentMargins.bottom = parseInt(document.getElementById('margin-bottom').value);
    currentMargins.left = parseInt(document.getElementById('margin-left').value);
    
    // Update guide visibility from checkbox
    showMarginGuides = document.getElementById('show-guides-checkbox').checked;
    
    // CRITICAL: Regenerate pages with new margins
    updatePreview(); // ✅ This regenerates everything
    
    marginPresetSelect.value = 'custom';
    
    // Update toggle button appearance
    const toggleBtn = document.getElementById('toggle-margin-guides');
    if (showMarginGuides) {
        toggleBtn.style.background = '#ef4444';
        toggleBtn.style.color = 'white';
        toggleBtn.title = 'Hide Margin Guides';
    } else {
        toggleBtn.style.background = '#f1f5f9';
        toggleBtn.style.color = '#475569';
        toggleBtn.title = 'Show Margin Guides';
    }
    
    closeLayoutModal();
};
```

### STEP 8: Remove Old Helper Functions

**DELETE these functions if they exist:**

```javascript
// DELETE ALL OF THESE
function applyMarginsToPages() { ... }
function updateMarginGuidePosition() { ... }
function distributeContentAcrossPages() { ... }
function measureElementHeight() { ... }
```

### STEP 9: Update Initialization

**Find initialization code and REMOVE old margin application:**

```javascript
// OLD CODE - FIND THIS
loadVersions();
updatePreview();
updateStatusBar();
startAutoSave();
applyZoom();
applyMarginsToPages(); // ❌ DELETE THIS LINE
applyTextAlignment();
applyPageNumberAlignment();
applyViewMode();

// NEW CODE - REPLACE WITH THIS
loadVersions();
updatePreview(); // This now handles everything
updateStatusBar();
startAutoSave();
applyZoom();
applyTextAlignment();
applyPageNumberAlignment();
applyViewMode();
```

---

## Testing Checklist

After integration, test these scenarios:

### ✅ Basic Functionality
- [ ] Paste 200+ lines of text
- [ ] All lines appear (no missing lines)
- [ ] No lines are clipped in half
- [ ] No duplicate lines across pages

### ✅ Margin Changes
- [ ] Set all margins to 0mm
- [ ] Header still visible (not overlapped)
- [ ] Footer still visible (not overlapped)
- [ ] Content doesn't overflow margins

### ✅ Margin Adjustments
- [ ] Increase bottom margin → fewer lines per page
- [ ] Decrease bottom margin → more lines per page
- [ ] Changes apply immediately
- [ ] Line count updates correctly

### ✅ Edge Cases
- [ ] Empty content → 1 page
- [ ] Single line → 1 page
- [ ] Very long lines → wrap correctly
- [ ] 1000+ lines → all visible

### ✅ Page Sizes
- [ ] A4 format works correctly
- [ ] Letter format works correctly
- [ ] Switching between formats updates properly

### ✅ Visual Elements
- [ ] Red margin guides show correctly
- [ ] Toggle guides on/off works
- [ ] Page numbers positioned correctly
- [ ] Header positioned correctly

---

## Troubleshooting

### Problem: Lines still being clipped

**Solution:** Check that `.page-content` has `overflow: hidden` in CSS

```css
.page-content {
    overflow: hidden; /* Must be present */
}
```

### Problem: Margins not updating

**Solution:** Ensure `applyLayoutSettings()` calls `updatePreview()`, not `applyMarginsToPages()`

### Problem: Content looks like HTML tags

**Solution:** Make sure you're passing RAW TEXT to `createPhysicalPages()`, not parsed HTML

```javascript
// WRONG
const html = parseMarkdown(text);
createPhysicalPages(html);

// CORRECT
createPhysicalPages(text); // Pass raw text
```

### Problem: Header/footer overlapping at 0mm margins

**Solution:** Verify safety padding constants are set correctly:

```javascript
const VERTICAL_PADDING = 15;   // Must be at least 15
const HORIZONTAL_PADDING = 10; // Must be at least 10
```

### Problem: Too much white space at bottom of pages

**Solution:** This is NORMAL! The unused space is part of the margin area. It prevents line clipping.

---

## Performance Optimization

### For Large Documents (1000+ lines):

1. **Debounce input updates:**
```javascript
let updateTimeout;
editor.addEventListener('input', function() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(updatePreview, 300); // Wait 300ms
});
```

2. **Show loading indicator:**
```javascript
function updatePreview() {
    showLoadingIndicator();
    setTimeout(() => {
        // ... pagination logic
        hideLoadingIndicator();
    }, 0);
}
```

---

## Migration Checklist

- [ ] Backup current code
- [ ] Remove old `createPhysicalPages()` function
- [ ] Remove old `applyMarginsToPages()` function
- [ ] Add new `createPhysicalPages()` function
- [ ] Add new `createPageHTML()` function
- [ ] Update `.page-content` CSS
- [ ] Update `updatePreview()` to use raw text
- [ ] Update margin defaults to 5mm
- [ ] Update margin presets
- [ ] Update `applyLayoutSettings()` to call `updatePreview()`
- [ ] Remove old helper functions
- [ ] Update initialization code
- [ ] Test all scenarios from checklist
- [ ] Deploy to production

---

## Expected Results

After successful integration:

✅ **No more clipped lines** - Every line is fully visible on one page
✅ **No more duplicate lines** - Each line appears exactly once
✅ **Margins always respected** - Content never overflows
✅ **Header/footer always safe** - Even at 0mm user margins
✅ **Predictable behavior** - Works like Word/Google Docs
✅ **Better performance** - Simple offset-based rendering
✅ **Handles any content** - Large paragraphs, empty lines, etc.

---

## Support

If you encounter issues during integration:

1. Check console for error messages
2. Verify all old code was removed
3. Ensure CSS has `overflow: hidden`
4. Test with simple content first (10 lines)
5. Gradually increase complexity

---

## Summary

**What Changed:**
- Element-by-element distribution → Offset-based rendering
- Pixel-based margins → Line-based content area
- Manual padding → Automatic safety padding
- Complex logic → Simple, predictable system

**Key Insight:**
The content area height is always `N × lineHeight`, where N is an integer. This guarantees no partial lines can ever appear.

**Safety System:**
User margins + automatic padding = actual margins used internally. This protects header/footer while giving users full control.
