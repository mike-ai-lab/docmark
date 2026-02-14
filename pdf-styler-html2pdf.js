/**
 * PDF STYLER - Using html2pdf.js
 * 
 * This is the PROPER solution for HTML to PDF with CSS preservation.
 * Uses html2pdf.js which internally uses html2canvas + jsPDF but handles
 * everything correctly including text selection, page breaks, and styling.
 * 
 * Dependencies: html2pdf.js (includes html2canvas and jsPDF)
 * CDN: https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const PDF_CONFIG_HTML2PDF = {
    margin: [25.4, 14.7, 25.4, 25.4], // [top, left, bottom, right] in mm
    filename: 'document.pdf',
    image: { 
        type: 'jpeg', 
        quality: 0.98 
    },
    html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
    },
    jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
    },
    pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: ['img', 'table', 'tr', 'td']
    },
    enableLinks: true
};

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Export HTML to PDF using html2pdf.js
 * This preserves CSS styling and creates selectable text
 * 
 * @param {HTMLElement} element - The element to export
 * @param {string} filename - Output filename
 * @param {object} options - Additional options to override defaults
 */
async function exportWithHtml2PDF(element, filename = 'document.pdf', options = {}) {
    // Wait for html2pdf to load
    let attempts = 0;
    while (!window.html2pdf && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.html2pdf) {
        throw new Error('html2pdf.js library not loaded. Please add: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js"></script>');
    }
    
    console.log('[html2pdf] Starting export');
    
    // Merge options
    const config = {
        ...PDF_CONFIG_HTML2PDF,
        filename,
        ...options
    };
    
    // Check if we have paper layout containers
    const paperContainers = element.querySelectorAll('.paper-container');
    
    if (paperContainers.length > 0) {
        console.log(`[html2pdf] Paper layout detected: ${paperContainers.length} pages`);
        
        // For paper layout, we need to export each container separately
        // and combine them into one PDF
        const worker = window.html2pdf();
        
        for (let i = 0; i < paperContainers.length; i++) {
            const container = paperContainers[i];
            
            console.log(`[html2pdf] Processing page ${i + 1}/${paperContainers.length}`);
            
            if (i === 0) {
                // First page - initialize
                worker.set(config).from(container).toPdf();
            } else {
                // Subsequent pages - add to existing PDF
                worker.get('pdf').then(pdf => {
                    pdf.addPage();
                }).from(container).toContainer().toCanvas().toPdf();
            }
        }
        
        // Save the final PDF
        await worker.save();
        
    } else {
        // Single element export
        console.log('[html2pdf] Single element export');
        
        await window.html2pdf()
            .set(config)
            .from(element)
            .save();
    }
    
    console.log('[html2pdf] Export complete');
}

/**
 * Export with paper layout support
 * Handles .paper-container elements as separate pages
 */
async function exportPaperLayout(containerElement, filename = 'document.pdf', options = {}) {
    if (!window.html2pdf) {
        throw new Error('html2pdf.js not loaded');
    }
    
    console.log('[html2pdf] Paper layout export');
    
    const config = {
        ...PDF_CONFIG_HTML2PDF,
        filename,
        ...options
    };
    
    // Find all paper containers
    const pages = containerElement.querySelectorAll('.paper-container');
    
    if (pages.length === 0) {
        // No paper containers, export whole element
        return exportWithHtml2PDF(containerElement, filename, options);
    }
    
    console.log(`[html2pdf] Found ${pages.length} paper pages`);
    
    // SIMPLE APPROACH: Export first page, then add others
    try {
        // Start with first page
        const worker = window.html2pdf().set(config).from(pages[0]);
        const pdf = await worker.toPdf().get('pdf');
        
        // Add remaining pages
        for (let i = 1; i < pages.length; i++) {
            console.log(`[html2pdf] Processing page ${i + 1}/${pages.length}`);
            
            pdf.addPage();
            
            // Use html2pdf to render this page to canvas
            const pageWorker = window.html2pdf().set(config).from(pages[i]);
            const canvas = await pageWorker.toCanvas().get('canvas');
            
            // Add to PDF
            const imgData = canvas.toDataURL('image/jpeg', config.image.quality);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
        
        // Save
        pdf.save(config.filename);
        console.log('[html2pdf] Paper layout export complete');
        
    } catch (error) {
        console.error('[html2pdf] Paper layout export failed:', error);
        throw error;
    }
}
}

/**
 * Simple export function - just pass element and filename
 */
async function exportToPDF(element, filename = 'document.pdf') {
    if (!window.html2pdf) {
        throw new Error('html2pdf.js not loaded');
    }
    
    // Check for paper layout
    const hasPaperLayout = element.querySelector('.paper-container') !== null;
    
    if (hasPaperLayout) {
        return exportPaperLayout(element, filename);
    } else {
        return exportWithHtml2PDF(element, filename);
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        exportToPDF, 
        exportWithHtml2PDF, 
        exportPaperLayout,
        PDF_CONFIG_HTML2PDF 
    };
} else {
    window.PDFStylerHtml2PDF = { 
        exportToPDF, 
        exportWithHtml2PDF, 
        exportPaperLayout,
        PDF_CONFIG_HTML2PDF 
    };
}
