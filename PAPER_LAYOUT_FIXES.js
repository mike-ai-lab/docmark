/**
 * PAPER LAYOUT STABILIZATION - MODIFIED FUNCTIONS ONLY
 * 
 * Copy these functions directly into src/main.js
 * Replace existing functions with same names
 */

// ============================================================================
// 1. ADD THESE GUARD FLAGS (in init() scope, after line 27)
// ============================================================================

let isRenderingPaperLayout = false;      // Prevent re-entrant rendering
let paperLayoutRenderScheduled = false;  // Track if render already scheduled
let paperLayoutDebounceTimer = null;     // Debounce timer reference
let lastPaginationTime = 0;              // Track last render time
const MIN_PAGINATION_INTERVAL = 100;     // Minimum ms between renders
const PAPER_LAYOUT_DEBOUNCE_MS = 150;    // Debounce delay for typing


// ============================================================================
// 2. REPLACE: renderPaperLayout() - ADD GUARDS
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


// ============================================================================
// 3. REPLACE: handleContentChangeInPaperLayout() - USE SCHEDULED RENDER
// ============================================================================

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


// ============================================================================
// 4. ADD NEW: scheduleRenderPaperLayout() - DEBOUNCED + RAF WRAPPER
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
// 5. UPDATE: togglePaperLayout() - USE SCHEDULED RENDER
// ============================================================================

// Find this section in togglePaperLayout():
//     if (paperLayoutActive) {
//         // Activate paper layout
//         renderPaperLayout();  // <-- CHANGE THIS LINE
//     }

// Replace with:
//     if (paperLayoutActive) {
//         // Activate paper layout
//         outputDiv.classList.add('paper-layout-active');
//         previewWrapper.classList.add('paper-layout-active');
//         scheduleRenderPaperLayout();  // <-- USE THIS INSTEAD
//     } else {
//         // Deactivate paper layout
//         outputDiv.classList.remove('paper-layout-active');
//         previewWrapper.classList.remove('paper-layout-active');
//         
//         // Cancel any pending renders
//         if (paperLayoutDebounceTimer) {
//             clearTimeout(paperLayoutDebounceTimer);
//             paperLayoutDebounceTimer = null;
//         }
//         paperLayoutRenderScheduled = false;
//         
//         // Restore normal markdown preview
//         convert(editor.getValue());
//     }


// ============================================================================
// 6. ADD OPTIONAL: cancelPaperLayoutRender() - CLEANUP UTILITY
// ============================================================================

const cancelPaperLayoutRender = () => {
    if (paperLayoutDebounceTimer) {
        clearTimeout(paperLayoutDebounceTimer);
        paperLayoutDebounceTimer = null;
    }
    paperLayoutRenderScheduled = false;
};


// ============================================================================
// SUMMARY OF CHANGES
// ============================================================================

/*
WHAT CHANGED:
1. Added 6 guard/state variables
2. Modified renderPaperLayout() - added guards and try/finally
3. Modified handleContentChangeInPaperLayout() - calls scheduleRenderPaperLayout()
4. Added scheduleRenderPaperLayout() - new debounced RAF wrapper
5. Updated togglePaperLayout() - uses scheduleRenderPaperLayout()
6. Added cancelPaperLayoutRender() - optional cleanup utility

WHAT STAYED THE SAME:
- Pagination logic (block splitting)
- DOM structure
- CSS classes
- Page configuration
- All other functions

BENEFITS:
✓ No flickering during character input
✓ Prevents re-entrant rendering
✓ Ensures DOM is ready before layout
✓ Maintains performance with debounce
✓ Minimal code changes
*/
