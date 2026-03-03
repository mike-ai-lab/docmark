/* ============================================================================
   PAPER LAYOUT SYSTEM - CLEAN IMPLEMENTATION FROM WORKING MOCKUP
   ============================================================================ */

// Load PDF layout settings from localStorage
function loadPdfLayoutSettings() {
    try {
        const raw = localStorage.getItem('com.markdownlivepreview.pdf_layout_settings');
        if (raw) {
            return JSON.parse(raw);
        }
    } catch (e) {
        console.error('Failed to load PDF layout settings', e);
    }
    // Return defaults
    return {
        textAlign: 'left',
        pageNumberPosition: 'center',
        margins: { top: 15, right: 15, bottom: 15, left: 15 }
    };
}

// Save PDF layout settings to localStorage
function savePdfLayoutSettings(settings) {
    try {
        localStorage.setItem('com.markdownlivepreview.pdf_layout_settings', JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save PDF layout settings', e);
    }
}

// Apply margins to paper pages
function applyPdfSettingsToPreview() {
    const settings = loadPdfLayoutSettings();
    const paperPages = document.querySelectorAll('.paper-page');
    const paperContents = document.querySelectorAll('.paper-content');
    
    if (paperPages.length === 0) return;
    
    // Convert mm to pixels: 1mm ≈ 3.78px at 96 DPI
    const mmToPx = 3.78;
    
    paperPages.forEach(page => {
        const pageContent = page.querySelector('.paper-content');
        if (!pageContent) return;
        
        // Apply margins to CONTENT, not page container
        pageContent.style.padding = `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`;
        
        // Update visual margin guides using CSS custom properties
        page.style.setProperty('--margin-top', `${settings.margins.top * mmToPx}px`);
        page.style.setProperty('--margin-right', `${settings.margins.right * mmToPx}px`);
        page.style.setProperty('--margin-bottom', `${settings.margins.bottom * mmToPx}px`);
        page.style.setProperty('--margin-left', `${settings.margins.left * mmToPx}px`);
        
        // Apply text alignment
        pageContent.style.textAlign = settings.textAlign || 'left';
    });
    
    // Apply page number positioning
    const pageNumbers = document.querySelectorAll('.paper-page-number');
    pageNumbers.forEach(pageNum => {
        pageNum.classList.remove('align-left', 'align-center', 'align-right');
        pageNum.classList.add(`align-${settings.pageNumberPosition || 'center'}`);
    });
    
    console.log('✅ Applied PDF settings to preview:', settings);
}

// Create physical pages with proper pagination
function createPhysicalPages(html) {
    const settings = loadPdfLayoutSettings();
    
    // Create temporary container for measurement
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;
    tempContainer.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        visibility: hidden;
        width: 170mm;
        padding: 0;
        margin: 0;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    `;
    document.body.appendChild(tempContainer);
    
    // Calculate available content height (A4 height - margins - page number space)
    const pageHeightMm = 297;
    const marginsMm = settings.margins.top + settings.margins.bottom;
    const pageNumberSpaceMm = 20;
    const contentHeightMm = pageHeightMm - marginsMm - pageNumberSpaceMm;
    const contentHeightPx = contentHeightMm * 3.78; // Convert to pixels
    
    const pages = [];
    let currentPageContent = '';
    let currentPageHeightPx = 0;
    let pageNumber = 1;
    
    // Get all top-level elements
    const elements = Array.from(tempContainer.children);
    
    // Process each element
    elements.forEach((element, i) => {
        const elementHTML = element.outerHTML;
        
        // Measure element height
        const measureDiv = document.createElement('div');
        measureDiv.innerHTML = elementHTML;
        measureDiv.style.cssText = tempContainer.style.cssText;
        document.body.appendChild(measureDiv);
        const elementHeightPx = measureDiv.offsetHeight;
        document.body.removeChild(measureDiv);
        
        // Check if element fits on current page
        if (currentPageHeightPx + elementHeightPx > contentHeightPx && currentPageContent.trim()) {
            // Finalize current page
            pages.push({
                content: currentPageContent,
                pageNumber: pageNumber,
                heightPx: currentPageHeightPx
            });
            pageNumber++;
            
            // Start new page
            currentPageContent = elementHTML;
            currentPageHeightPx = elementHeightPx;
        } else {
            // Add to current page
            currentPageContent += elementHTML;
            currentPageHeightPx += elementHeightPx;
        }
    });
    
    // Add final page
    if (currentPageContent.trim()) {
        pages.push({
            content: currentPageContent,
            pageNumber: pageNumber,
            heightPx: currentPageHeightPx
        });
    }
    
    // Cleanup
    document.body.removeChild(tempContainer);
    
    // Create empty page if no content
    if (pages.length === 0) {
        pages.push({
            content: '<p style="color: #94a3b8; font-style: italic;">Preview will appear here...</p>',
            pageNumber: 1,
            heightPx: 20
        });
    }
    
    const totalPages = pages.length;
    console.log(`📄 Paginated into ${totalPages} pages (content area: ${contentHeightPx.toFixed(2)}px)`);
    
    // Generate HTML for all pages
    return pages.map(page => createPageHTML(page.content, page.pageNumber, totalPages)).join('');
}

// Create individual page HTML
function createPageHTML(content, pageNumber, totalPages) {
    const settings = loadPdfLayoutSettings();
    const mmToPx = 3.78;
    
    return `
        <div class="paper-page" style="
            --margin-top: ${settings.margins.top * mmToPx}px;
            --margin-right: ${settings.margins.right * mmToPx}px;
            --margin-bottom: ${settings.margins.bottom * mmToPx}px;
            --margin-left: ${settings.margins.left * mmToPx}px;
        ">
            <div class="paper-content" style="
                padding: ${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm;
                text-align: ${settings.textAlign || 'left'};
            ">
                ${content}
            </div>
            <div class="paper-page-number align-${settings.pageNumberPosition || 'center'}">
                Page ${pageNumber} of ${totalPages}
            </div>
        </div>
    `;
}
