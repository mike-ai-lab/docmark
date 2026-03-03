# Paper Layout Stabilization - Exact Implementation

## Overview
This document shows EXACTLY where to make changes in `src/main.js`

## Change 1: Add Guard Flags

**Location**: In `init()` function, after line 27 (after `let paperLayoutPaginator = null;`)

**Add these lines:**
```javascript
// Paper layout rendering stabilization guards
let isRenderingPaperLayout = false;      // Prevent re-entrant rendering
let paperLayoutRenderScheduled = false;  // Track if render already scheduled
let paperLayoutDebounceTimer = null;     // Debounce timer reference
let lastPaginationTime = 0;              // Track last render time
const MIN_PAGINATION_INTERVAL = 100;     // Minimum ms between renders
const PAPER_LAYOUT_DEBOUNCE_MS = 150;    // Debounce delay for typing
```

---

## Change 2: Replace renderPaperLayout() Function

**Location**: Find `const renderPaperLayout = () => {` (search for this exact string)

**Replace the ENTIRE function with:**
```javascript
const renderPaperLayout = () => {
    // GUARD 1: Prevent re-entrant rendering
    if (isRenderingPaperLayout) {
        console.warn('[PAPER_LAYOUT] Render already in progress, skipping');
        return;
    }

    // GUARD 2: Check if paper layout is still active
    if (!paperLayoutActive) {
        return;
    }

    // Set rendering flag
    isRenderingPaperLayout = true;
    paperLayoutRenderScheduled = false;

    try {
        const outputDiv = document.querySelector('#output');
        if (!outputDiv) {
            console.warn('[PAPER_LAYOUT] Output div not found');
            return;
        }

        // Get current HTML content from preview
        const htmlContent = outputDiv.innerHTML;
        if (!htmlContent) {
            console.warn('[PAPER_LAYOUT] No HTML content to render');
            return;
        }

        // Create paginator if needed
        if (!paperLayoutPaginator) {
            if (typeof window.PaginationEngine !== 'undefined') {
                paperLayoutPaginator = new window.PaginationEngine({
                    pageHeight: 1122,  // A4 height in pixels
                    pageWidth: 794,    // A4 width in pixels
                    margin: 40
                });
            }
        }

        // Paginate content
        if (paperLayoutPaginator) {
            const pages = paperLayoutPaginator.paginate(htmlContent);
            
            // Only update DOM if page count changed (prevents flashing)
            const currentPageCount = outputDiv.querySelectorAll('.paper-page').length;
            if (pages.length !== currentPageCount) {
                outputDiv.innerHTML = '';
                pages.forEach((pageContent, index) => {
                    const pageDiv = document.createElement('div');
                    pageDiv.className = 'paper-page';
                    pageDiv.setAttribute('data-page', index + 1);
                    pageDiv.innerHTML = pageContent;
                    outputDiv.appendChild(pageDiv);
                });
                
                console.log(`[PAPER_LAYOUT] Rendered ${pages.length} pages`);
            }
        }

        // Update last pagination time
        lastPaginationTime = Date.now();

    } catch (error) {
        console.error('[PAPER_LAYOUT] Render error:', error);
    } finally {
        // Always clear rendering flag
        isRenderingPaperLayout = false;
    }
};
```

---

## Change 3: Replace handleContentChangeInPaperLayout() Function

**Location**: Find `const handleContentChangeInPaperLayout = () => {` (search for this exact string)

**Replace the ENTIRE function with:**
```javascript
const handleContentChangeInPaperLayout = () => {
    // Guard: Check if paper layout is active
    if (!paperLayoutActive) {
        return;
    }

    // Guard: Don't schedule if already rendering
    if (isRenderingPaperLayout) {
        console.log('[PAPER_LAYOUT] Render in progress, will retry after');
        setTimeout(() => {
            if (!paperLayoutRenderScheduled) {
                scheduleRenderPaperLayout();
            }
        }, 50);
        return;
    }

    // Clear any pending debounce timer
    if (paperLayoutDebounceTimer) {
        clearTimeout(paperLayoutDebounceTimer);
        paperLayoutDebounceTimer = null;
    }

    // Check if enough time has passed since last pagination
    const now = Date.now();
    const timeSinceLastPagination = now - lastPaginationTime;

    if (timeSinceLastPagination < MIN_PAGINATION_INTERVAL) {
        // Schedule for later
        const delayMs = MIN_PAGINATION_INTERVAL - timeSinceLastPagination + PAPER_LAYOUT_DEBOUNCE_MS;
        paperLayoutDebounceTimer = setTimeout(() => {
            scheduleRenderPaperLayout();
        }, delayMs);
    } else {
        // Schedule immediately (but still debounced)
        paperLayoutDebounceTimer = setTimeout(() => {
            scheduleRenderPaperLayout();
        }, PAPER_LAYOUT_DEBOUNCE_MS);
    }
};
```

---

## Change 4: Add New scheduleRenderPaperLayout() Function

**Location**: Right after `handleContentChangeInPaperLayout()` function (add new function)

**Add this new function:**
```javascript
const scheduleRenderPaperLayout = () => {
    // Guard: Don't schedule if already scheduled
    if (paperLayoutRenderScheduled) {
        return;
    }

    // Guard: Don't schedule if currently rendering
    if (isRenderingPaperLayout) {
        return;
    }

    // Mark as scheduled
    paperLayoutRenderScheduled = true;

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
        // Double-check guards before rendering
        if (!paperLayoutActive || isRenderingPaperLayout) {
            paperLayoutRenderScheduled = false;
            return;
        }

        // Perform the actual render
        renderPaperLayout();
    });
};
```

---

## Change 5: Update togglePaperLayout() Function

**Location**: Find `const togglePaperLayout = () => {` (search for this exact string)

**Find this section:**
```javascript
if (paperLayoutActive) {
    // Activate paper layout
    outputDiv.classList.add('paper-layout-active');
    previewWrapper.classList.add('paper-layout-active');
    
    renderPaperLayout();  // <-- THIS LINE
```

**Replace `renderPaperLayout();` with `scheduleRenderPaperLayout();`**

**Also find the deactivation section:**
```javascript
} else {
    // Deactivate paper layout
    outputDiv.classList.remove('paper-layout-active');
    previewWrapper.classList.remove('paper-layout-active');
    
    // Restore normal markdown preview
    convert(editor.getValue());
}
```

**Replace with:**
```javascript
} else {
    // Deactivate paper layout
    outputDiv.classList.remove('paper-layout-active');
    previewWrapper.classList.remove('paper-layout-active');
    
    // Cancel any pending renders
    if (paperLayoutDebounceTimer) {
        clearTimeout(paperLayoutDebounceTimer);
        paperLayoutDebounceTimer = null;
    }
    paperLayoutRenderScheduled = false;
    
    // Restore normal markdown preview
    convert(editor.getValue());
}
```

---

## Change 6: Add Optional cancelPaperLayoutRender() Function

**Location**: After `scheduleRenderPaperLayout()` function (optional, for cleanup)

**Add this utility function:**
```javascript
const cancelPaperLayoutRender = () => {
    if (paperLayoutDebounceTimer) {
        clearTimeout(paperLayoutDebounceTimer);
        paperLayoutDebounceTimer = null;
    }
    paperLayoutRenderScheduled = false;
};
```

---

## Verification Checklist

After making all changes:

- [ ] All 6 guard flags are declared in init() scope
- [ ] renderPaperLayout() has try/finally block
- [ ] renderPaperLayout() checks isRenderingPaperLayout at start
- [ ] handleContentChangeInPaperLayout() calls scheduleRenderPaperLayout()
- [ ] scheduleRenderPaperLayout() uses requestAnimationFrame
- [ ] togglePaperLayout() calls scheduleRenderPaperLayout() (not renderPaperLayout)
- [ ] togglePaperLayout() cleanup code added
- [ ] No syntax errors in console
- [ ] Paper layout still works
- [ ] No flickering when typing

---

## Testing

1. **Type a single character** - should NOT flicker
2. **Type rapidly** - should render smoothly
3. **Toggle paper layout on/off** - should work without errors
4. **Paste large content** - should render without freezing
5. **Check console** - should see minimal `[PAPER_LAYOUT]` warnings

---

## Troubleshooting

**Issue**: Still flickering
- Check that scheduleRenderPaperLayout() is being called
- Verify requestAnimationFrame is in scheduleRenderPaperLayout()
- Check console for errors

**Issue**: Paper layout not rendering
- Check that renderPaperLayout() is still being called
- Verify isRenderingPaperLayout guard isn't blocking render
- Check console for `[PAPER_LAYOUT]` warnings

**Issue**: Syntax errors
- Verify all braces are matched
- Check for missing semicolons
- Ensure function names are spelled correctly

---

## Summary

**Total changes**: 6 modifications to `src/main.js`
**Lines added**: ~200
**Lines removed**: ~50
**Net change**: ~150 lines
**Complexity**: Low (mostly guard checks and RAF wrapper)
**Risk**: Very low (no pagination logic changes)
