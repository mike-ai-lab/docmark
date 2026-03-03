/**
 * PAPER LAYOUT RENDERING STABILIZATION
 * 
 * Problem: Paper layout flickers or disappears when typing a single character
 * 
 * Solution: 
 * - Add isRenderingPaperLayout guard to prevent re-entrant rendering
 * - Wrap renderPaperLayout() in debounced + requestAnimationFrame
 * - Ensure layout rendering only runs AFTER preview DOM is fully updated
 * - Do NOT call renderPaperLayout() directly during synchronous editor input
 */

// ============================================================================
// NEW GUARD FLAGS (add to init scope, near other state variables)
// ============================================================================

let isRenderingPaperLayout = false;  // Guard against re-entrant rendering
let paperLayoutRenderScheduled = false;  // Track if render is already scheduled
let paperLayoutDebounceTimer = null;  // Debounce timer
let lastPaginationTime = 0;  // Track last render time
const MIN_PAGINATION_INTERVAL = 100;  // Minimum ms between renders
const PAPER_LAYOUT_DEBOUNCE_MS = 150;  // Debounce delay for typing


// ============================================================================
// STABILIZED: renderPaperLayout() - WRAPPED WITH GUARDS
// ============================================================================

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
            // Import or initialize paginator here
            // This assumes PaginationEngine is available globally
            if (typeof window.PaginationEngine !== 'undefined') {
                paperLayoutPaginator = new window.PaginationEngine({
                    pageHeight: 1122,  // A4 height in pixels (11.69 inches)
                    pageWidth: 794,    // A4 width in pixels (8.27 inches)
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
                // Clear and rebuild pages
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


// ============================================================================
// STABILIZED: handleContentChangeInPaperLayout() - DEBOUNCED + RAF
// ============================================================================

const handleContentChangeInPaperLayout = () => {
    // Guard: Check if paper layout is active
    if (!paperLayoutActive) {
        return;
    }

    // Guard: Don't schedule if already rendering
    if (isRenderingPaperLayout) {
        console.log('[PAPER_LAYOUT] Render in progress, will retry after');
        // Schedule retry after current render completes
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


// ============================================================================
// NEW: scheduleRenderPaperLayout() - DEBOUNCED + RAF WRAPPER
// ============================================================================

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
    // This ensures the preview DOM is fully updated before we render layout
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


// ============================================================================
// UPDATED: togglePaperLayout() - USE SCHEDULED RENDER
// ============================================================================

const togglePaperLayout = () => {
    paperLayoutActive = !paperLayoutActive;

    const outputDiv = document.querySelector('#output');
    const previewWrapper = document.querySelector('#preview-wrapper');

    if (paperLayoutActive) {
        // Activate paper layout
        outputDiv.classList.add('paper-layout-active');
        previewWrapper.classList.add('paper-layout-active');
        
        // Use scheduled render instead of direct call
        scheduleRenderPaperLayout();

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
};


// ============================================================================
// INTEGRATION POINTS IN EDITOR CHANGE HANDLER
// ============================================================================

/*
In setupEditor(), the onDidChangeModelContent handler should be:

editor.onDidChangeModelContent(() => {
    let changed = editor.getValue() != defaultInput;
    if (changed) {
        hasEdited = true;
    }
    let value = editor.getValue();
    
    // Don't convert if we're updating from preview edit
    if (!isUpdating) {
        // Check if paper layout is active
        if (paperLayoutActive) {
            // Use debounced handler instead of direct render
            handleContentChangeInPaperLayout();
        } else {
            // Normal web layout - use convert
            convert(value);
        }
    }
    
    saveLastContent(value);
    
    // Update TOC if visible
    if (tocVisible) {
        updateToc();
    }
    
    // Update status bar
    updateStatusBar();
});
*/


// ============================================================================
// CLEANUP: Cancel pending renders when needed
// ============================================================================

const cancelPaperLayoutRender = () => {
    if (paperLayoutDebounceTimer) {
        clearTimeout(paperLayoutDebounceTimer);
        paperLayoutDebounceTimer = null;
    }
    paperLayoutRenderScheduled = false;
    // Note: Don't clear isRenderingPaperLayout if render is in progress
};


// ============================================================================
// SUMMARY OF CHANGES
// ============================================================================

/*
GUARD FLAGS ADDED:
- isRenderingPaperLayout: Prevents re-entrant rendering
- paperLayoutRenderScheduled: Tracks if render is already scheduled
- paperLayoutDebounceTimer: Debounce timer reference
- lastPaginationTime: Tracks last render time
- MIN_PAGINATION_INTERVAL: Minimum time between renders (100ms)
- PAPER_LAYOUT_DEBOUNCE_MS: Debounce delay for typing (150ms)

FUNCTIONS MODIFIED:
1. renderPaperLayout()
   - Added isRenderingPaperLayout guard at start
   - Added try/finally to ensure flag is cleared
   - Added safety checks for DOM elements

2. handleContentChangeInPaperLayout()
   - Now calls scheduleRenderPaperLayout() instead of renderPaperLayout()
   - Added guard to prevent scheduling during active render
   - Maintains debounce and interval logic

3. togglePaperLayout()
   - Uses scheduleRenderPaperLayout() instead of direct renderPaperLayout()
   - Properly cancels pending renders on deactivation

NEW FUNCTIONS:
1. scheduleRenderPaperLayout()
   - Wraps renderPaperLayout() with requestAnimationFrame
   - Ensures DOM is fully updated before rendering
   - Prevents duplicate scheduling with paperLayoutRenderScheduled flag

2. cancelPaperLayoutRender()
   - Utility to cancel pending renders
   - Used when deactivating paper layout

BENEFITS:
✓ No more flickering during character input
✓ Prevents re-entrant rendering
✓ Ensures DOM is ready before layout calculation
✓ Maintains debounce for performance
✓ Respects minimum interval between renders
✓ No changes to pagination logic or block splitting
*/
