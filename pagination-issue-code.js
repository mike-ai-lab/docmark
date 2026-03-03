/**
 * PAGINATION SYSTEM CODE EXTRACTION
 * Issue: Content overflowing bottom margins and inefficient page breaks
 * 
 * PROBLEM SUMMARY:
 * - Content was overflowing beyond bottom page margins
 * - Pages were being created with only ~55% fill, creating 5 pages instead of expected ~1.8 pages
 * - Mathematical logic error in overflow detection
 * 
 * ROOT CAUSES IDENTIFIED:
 * 1. Overflow check happening AFTER content accumulation (guarantees overflow)
 * 2. No handling for oversized single blocks that exceed page limits
 * 3. Page completion triggered too late (after overflow already occurred)
 */

// CURRENT IMPLEMENTATION (FIXED VERSION)
function createPhysicalPages(html) {
    // Create temporary container for height measurement
    const tempContainer = document.createElement('div');
    
    // Get page dimensions
    const pageSize = document.getElementById('page-size').value;
    const pageWidth = pageSize === 'a4' ? 210 : 216; // mm
    const pageHeight = pageSize === 'a4' ? 297 : 279; // mm
    const contentWidth = pageWidth - currentMargins.left - currentMargins.right;
    const contentHeight = pageHeight - currentMargins.top - currentMargins.bottom;
    
    // Match exact styling of actual page content for accurate measurement
    tempContainer.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: ${contentWidth}mm;
        padding: ${currentMargins.top}mm ${currentMargins.right}mm ${currentMargins.bottom}mm ${currentMargins.left}mm;
        box-sizing: border-box;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        visibility: hidden;
        overflow: hidden;
        max-height: ${contentHeight}mm;
    `;
    document.body.appendChild(tempContainer);
    
    // Use full available height (247mm for A4 with 25mm margins)
    const maxContentHeight = contentHeight;
    
    // Split content into blocks (paragraphs, headers, lists)
    const contentBlocks = html.split(/(<h[1-6]>.*?<\/h[1-6]>|<p>.*?<\/p>|<ul>.*?<\/ul>|<li>.*?<\/li>)/g)
        .filter(block => block.trim().length > 0);
    
    const pages = [];
    let currentPageContent = '';
    let pageNumber = 1;
    
    // CRITICAL LOGIC: Check BEFORE adding content, not after
    for (let i = 0; i < contentBlocks.length; i++) {
        const block = contentBlocks[i];
        
        // Test if adding this block would exceed limit BEFORE adding it
        const testContent = currentPageContent + block;
        tempContainer.innerHTML = testContent;
        const testHeightPx = tempContainer.scrollHeight;
        const testHeightMM = (testHeightPx * 0.264583); // Convert px to mm
        
        // If adding this block would exceed limit AND we have existing content
        if (testHeightMM > maxContentHeight && currentPageContent.trim()) {
            // Finalize current page WITHOUT the new block (prevents overflow)
            tempContainer.innerHTML = currentPageContent;
            const currentHeightMM = (tempContainer.scrollHeight * 0.264583);
            
            pages.push({
                content: currentPageContent,
                pageNumber: pageNumber,
                heightMM: currentHeightMM
            });
            pageNumber++;
            
            // Start new page with the current block
            currentPageContent = block;
            
            // Check if single block exceeds page limit (needs paragraph-level splitting)
            tempContainer.innerHTML = block;
            const blockHeightMM = (tempContainer.scrollHeight * 0.264583);
            if (blockHeightMM > maxContentHeight) {
                console.warn(`Block ${i + 1} is ${blockHeightMM.toFixed(1)}mm - exceeds page limit of ${maxContentHeight}mm`);
                // TODO: Implement paragraph-level splitting for oversized blocks
            }
        } else {
            // Block fits, add it to current page
            currentPageContent = testContent;
        }
    }
    
    // Add final page
    if (currentPageContent.trim()) {
        tempContainer.innerHTML = currentPageContent;
        const finalHeight = (tempContainer.scrollHeight * 0.264583);
        pages.push({
            content: currentPageContent,
            pageNumber: pageNumber,
            heightMM: finalHeight
        });
    }
    
    // Cleanup
    document.body.removeChild(tempContainer);
    
    return pages;
}

// CSS STYLING FOR PAGE CONTENT (CRITICAL FOR MARGIN ENFORCEMENT)
const pageContentCSS = `
.page-content {
    flex: 1;
    overflow: hidden;
    position: relative;
    padding: 25mm 20mm; /* Will be overridden by dynamic margins */
    z-index: 5;
    box-sizing: border-box;
    overflow-y: hidden;
    word-wrap: break-word;
    hyphens: auto;
    max-height: 247mm; /* Will be overridden by inline styles */
    display: block;
}
`;

// PAGE HTML GENERATION
function createPageHTML(content, pageNumber, totalPagesCount, heightMM = 0) {
    const pageSize = document.getElementById('page-size').value;
    const pageWidth = pageSize === 'a4' ? 210 : 216; // mm
    const pageHeight = pageSize === 'a4' ? 297 : 279; // mm
    const contentHeight = pageHeight - currentMargins.top - currentMargins.bottom;
    
    return `
        <div class="page" style="--margin-top: ${currentMargins.top}mm; --margin-right: ${currentMargins.right}mm; --margin-bottom: ${currentMargins.bottom}mm; --margin-left: ${currentMargins.left}mm;">
            <div class="page-header">Sample Document</div>
            <div class="page-content" style="
                padding: ${currentMargins.top}mm ${currentMargins.right}mm ${currentMargins.bottom}mm ${currentMargins.left}mm; 
                height: ${contentHeight}mm; 
                max-height: ${contentHeight}mm;
                overflow: hidden; 
                box-sizing: border-box;
            ">
                ${content}
            </div>
            <div class="page-number-float">DocMark Page ${pageNumber} of ${totalPagesCount}</div>
        </div>
    `;
}

/**
 * PREVIOUS PROBLEMATIC LOGIC (FOR REFERENCE):
 * 
 * // WRONG: Check after adding content (guarantees overflow)
 * const testContent = currentPageContent + block;
 * tempContainer.innerHTML = testContent;
 * const contentHeightMM = (tempContainer.scrollHeight * 0.264583);
 * 
 * if (contentHeightMM > maxContentHeight && currentPageContent.trim()) {
 *     // Page is finalized AFTER overflow already occurred
 *     pages.push({
 *         content: testContent, // This content already exceeds the limit!
 *         pageNumber: pageNumber,
 *         heightMM: contentHeightMM // This height is > maxContentHeight
 *     });
 * }
 * 
 * ISSUES WITH OLD LOGIC:
 * 1. Content was added first, then checked - guaranteeing overflow
 * 2. Pages were finalized with content that already exceeded limits
 * 3. No handling for single blocks larger than page capacity
 * 4. Artificial height reduction (95% of available space) caused premature breaks
 */

/**
 * RECOMMENDATIONS FOR CONSULTANT:
 * 
 * 1. MATHEMATICAL CORRECTNESS:
 *    - Always check height BEFORE adding content to page
 *    - Finalize pages BEFORE they exceed limits, not after
 *    - Use full available height (247mm for A4) without artificial reductions
 * 
 * 2. OVERSIZED CONTENT HANDLING:
 *    - Implement paragraph-level splitting for blocks > page height
 *    - Consider word-level splitting for extremely long paragraphs
 *    - Provide user feedback when content cannot fit on single page
 * 
 * 3. MEASUREMENT ACCURACY:
 *    - Temporary container must match exact styling of target container
 *    - Use scrollHeight for accurate content height measurement
 *    - Account for box-sizing, padding, and margins in calculations
 * 
 * 4. PERFORMANCE OPTIMIZATION:
 *    - Cache DOM measurements where possible
 *    - Consider binary search for optimal content fitting
 *    - Implement content chunking for very large documents
 * 
 * 5. USER EXPERIENCE:
 *    - Provide visual feedback during pagination process
 *    - Allow manual page break insertion
 *    - Offer different pagination strategies (tight/loose packing)
 */