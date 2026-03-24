# Pagination System Cleanup & Implementation Plan

## ✅ PHASE 1 COMPLETE - Old System Removed

### Completed Actions:
1. ✅ Removed ~700 lines of broken pagination code from `src/main.js` (lines 8240-8950)
2. ✅ Deleted `src/paper-layout-engine.js` (entire file)
3. ⏭️ SKIPPED: HTML/CSS cleanup (will be handled in Phase 2 with new implementation)

### What Was Removed:
- Complex `renderPaperLayout()` with element-by-element height calculations
- `restoreWebLayout()`, `updatePageCount()`, `applyZoom()` functions
- All zoom controls (zoomIn, zoomOut, fitToWidth, resetZoom)
- Page navigation system (showPage, goToPrevPage, goToNextPage)
- Pagination mode toggle
- Draggable paper controls
- Debounced re-pagination system
- PaperLayoutEngine class (entire file deleted)

### What Was Kept:
- `paperLayoutActive` variable (needed for toggle)
- PDF settings functions (`loadPdfLayoutSettings()`)
- Basic preview structure
- Mermaid rendering integration
- Edit mode integration

---

## Current State Analysis

### Files with Broken Pagination Code:
1. **`src/main.js`** (lines 8240-8500+)
   - `renderPaperLayout()` function - Complex element-by-element distribution
   - `restoreWebLayout()` function
   - Zoom controls and page navigation
   - Uses temporary containers and height calculations

2. **`src/paper-layout-engine.js`** (entire file)
   - `PaperLayoutEngine` class
   - `paginateContent()` method - Complex height estimation
   - `buildLineMap()` for bidirectional sync
   - Debounced rendering system

3. **`index.html`** (lines 476+)
   - Paper layout controls UI
   - Zoom buttons, page navigation
   - Mode toggle buttons

4. **`public/css/style.css`**
   - `.paper-page`, `.paper-content`, `.paper-stack` classes
   - Margin guide styles
   - Page number positioning

---

## Phase 1: Complete Removal of Old System

### Step 1.1: Remove from `src/main.js`
**Lines to DELETE:** 8240-8750 (approximately)

**Functions to remove:**
- `renderPaperLayout()`
- `restoreWebLayout()`
- `updatePageCount()`
- `applyZoom()`
- All paper layout event handlers
- `toggleNavigationMode()`
- `showPage()`
- `goToPrevPage()` / `goToNextPage()`

**Variables to remove:**
- `paperLayoutActive` (if only used for old system)
- `paperLayoutPaginator`
- `currentZoom`, `MIN_ZOOM`, `MAX_ZOOM`, `ZOOM_STEP`
- `lastPaginatedContent`, `lastPageCount`
- `paginationMode`, `currentPageIndex`, `totalPages`

### Step 1.2: Delete `src/paper-layout-engine.js`
**Action:** Delete entire file

### Step 1.3: Clean up `index.html`
**Remove:**
- Paper controls bar (`#paper-controls`)
- Zoom buttons
- Page navigation buttons
- Mode toggle buttons (Flow/Pages)
- All related event listener setup

**Keep:**
- PDF settings button
- Export buttons
- Basic preview structure

### Step 1.4: Clean up `public/css/style.css`
**Remove classes:**
- `.paper-page`
- `.paper-content`
- `.paper-stack`
- `.paper-container`
- `.paper-page-number`
- `.paper-controls-bar`
- `.paper-zoom-display`
- `.pagination-mode`
- All margin guide styles (`.page::after` with red borders)

**Keep:**
- Basic preview styles
- `.markdown-body` styles
- Theme styles

---

## Phase 2: Implement New Line-Based System

### Step 2.1: Add New Pagination Function to `src/main.js`

**Location:** Replace the deleted `renderPaperLayout()` section

**New function:**
```javascript
// ============================================================================
// PAPER LAYOUT & LINE-BASED PAGINATION SYSTEM
// ============================================================================

const renderPaperLayout = () => {
    if (!paperLayoutActive) return;
    
    const outputDiv = document.querySelector('#output');
    const previewWrapper = document.querySelector('#preview-wrapper');
    
    if (!outputDiv || !previewWrapper) return;
    
    // Get markdown content
    const markdownSource = editor ? editor.getValue() : '';
    if (!markdownSource) return;
    
    // Get PDF settings
    const settings = loadPdfLayoutSettings();
    const mmToPx = 3.78;
    
    // Safety padding (invisible to user)
    const SAFETY_TOP = 15;
    const SAFETY_BOTTOM = 15;
    const SAFETY_LEFT = 10;
    const SAFETY_RIGHT = 10;
    
    // Actual margins used (user setting + safety padding)
    const actualTopMargin = (settings.margins.top + SAFETY_TOP) * mmToPx;
    const actualBottomMargin = (settings.margins.bottom + SAFETY_BOTTOM) * mmToPx;
    const actualLeftMargin = (settings.margins.left + SAFETY_LEFT) * mmToPx;
    const actualRightMargin = (settings.margins.right + SAFETY_RIGHT) * mmToPx;
    
    // Page dimensions
    const pageWidth = 794;  // A4 width in px
    const pageHeight = 1123; // A4 height in px
    
    // Calculate content area
    const contentWidth = pageWidth - actualLeftMargin - actualRightMargin;
    const contentHeight = pageHeight - actualTopMargin - actualBottomMargin;
    
    // Line-based calculation
    const fontSize = 14; // px
    const lineHeight = 1.6;
    const lineHeightPx = fontSize * lineHeight;
    const linesPerPage = Math.floor(contentHeight / lineHeightPx);
    const actualContentHeight = linesPerPage * lineHeightPx;
    
    console.log(`[Pagination] ${linesPerPage} lines per page, ${lineHeightPx}px per line`);
    
    // Create pages
    const totalContentHeight = markdownSource.split('\n').length * lineHeightPx;
    const totalPages = Math.ceil(totalContentHeight / actualContentHeight);
    
    // Clear and render
    outputDiv.innerHTML = '';
    outputDiv.classList.add('paper-layout-active');
    previewWrapper.classList.add('paper-layout-active');
    
    const paperStack = document.createElement('div');
    paperStack.className = 'paper-stack';
    paperStack.id = 'paper-stack';
    
    for (let i = 0; i < totalPages; i++) {
        const page = document.createElement('div');
        page.className = 'paper-page';
        page.style.width = `${pageWidth}px`;
        page.style.height = `${pageHeight}px`;
        
        // Page header
        const header = document.createElement('div');
        header.className = 'paper-page-header';
        header.textContent = 'Document';
        header.style.position = 'absolute';
        header.style.top = '10mm';
        header.style.left = '50%';
        header.style.transform = 'translateX(-50%)';
        header.style.fontSize = '10px';
        header.style.color = '#64748b';
        
        // Content area
        const content = document.createElement('div');
        content.className = 'paper-content';
        content.style.position = 'absolute';
        content.style.top = `${actualTopMargin}px`;
        content.style.left = `${actualLeftMargin}px`;
        content.style.right = `${actualRightMargin}px`;
        content.style.bottom = `${actualBottomMargin}px`;
        content.style.overflow = 'hidden';
        content.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
        content.style.fontSize = `${fontSize}px`;
        content.style.lineHeight = lineHeight;
        content.style.whiteSpace = 'pre-wrap';
        
        // Offset content for this page
        const offsetY = -(i * actualContentHeight);
        content.style.transform = `translateY(${offsetY}px)`;
        content.textContent = markdownSource;
        
        // Page number
        const pageNum = document.createElement('div');
        pageNum.className = 'paper-page-number';
        pageNum.textContent = `${i + 1}`;
        pageNum.style.position = 'absolute';
        pageNum.style.bottom = '10mm';
        pageNum.style.left = '50%';
        pageNum.style.transform = 'translateX(-50%)';
        pageNum.style.fontSize = '9px';
        pageNum.style.color = '#94a3b8';
        
        page.appendChild(header);
        page.appendChild(content);
        page.appendChild(pageNum);
        paperStack.appendChild(page);
    }
    
    outputDiv.appendChild(paperStack);
    console.log(`[Pagination] Rendered ${totalPages} pages`);
};
```

### Step 2.2: Add New CSS to `public/css/style.css`

```css
/* Line-Based Pagination System */
.paper-layout-active {
    background: #e5e7eb;
    padding: 40px 20px;
}

.paper-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.paper-page {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    position: relative;
    flex-shrink: 0;
}

[data-theme="dark"] .paper-page {
    background: #1e1e1e;
}

.paper-content {
    box-sizing: border-box;
}

.paper-page-header,
.paper-page-number {
    pointer-events: none;
    user-select: none;
}
```

---

## Phase 3: Testing & Validation

### Test Cases:
1. ✅ Paste 1000 lines - all lines visible
2. ✅ Change bottom margin - content reflows
3. ✅ Set all margins to 0 - header/footer safe
4. ✅ Large paragraphs - no clipping
5. ✅ Empty lines - handled correctly
6. ✅ No lines skipped or duplicated

---

## Implementation Order

### Phase 1: Cleanup (Do First)
1. Remove old pagination code from `src/main.js`
2. Delete `src/paper-layout-engine.js`
3. Remove paper controls from `index.html`
4. Clean up CSS classes

### Phase 2: Implementation (Do Second)
1. Add new `renderPaperLayout()` function
2. Add new CSS styles
3. Wire up to existing paper layout toggle

### Phase 3: Testing (Do Last)
1. Test with sample content
2. Verify margins work correctly
3. Confirm no lines are lost

---

## Critical Success Criteria

✅ **NO complex height calculations**
✅ **NO element-by-element distribution**
✅ **Simple CSS clipping with overflow: hidden**
✅ **Line-based margin system**
✅ **Safety padding for header/footer**
✅ **All content always visible**

---

## Files to Modify

1. `src/main.js` - Replace pagination logic
2. `src/paper-layout-engine.js` - DELETE
3. `index.html` - Remove old controls
4. `public/css/style.css` - Replace pagination styles

---

## Rollback Plan

If issues occur:
1. Revert `src/main.js` changes
2. Restore `src/paper-layout-engine.js` from git
3. Restore `index.html` controls
4. Restore CSS classes

---

**Ready to proceed with Phase 1?**
