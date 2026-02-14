/**
 * PDF STYLER - PDFMake Solution (FINAL)
 * 
 * This is the REAL solution - creates actual text-based PDFs
 * using pdfmake + html-to-pdfmake
 * 
 * Dependencies:
 * - pdfmake (https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js)
 * - vfs_fonts (https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js)
 * - html-to-pdfmake (https://unpkg.com/html-to-pdfmake@2.5.1/browser.js)
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const PDFMAKE_CONFIG = {
    // Base font size - calibrated to match HTML 14px rendering
    // HTML uses 14px, PDF uses 10.5pt for similar visual size
    baseFontSize: 10.5,
    
    // Default styles for HTML elements
    // Font sizes are calculated as multipliers of baseFontSize
    defaultStyles: {
        h1: {fontSize: 21, bold: true, margin: [0, 15, 0, 10], color: '#1a1a1a', lineHeight: 1.25},      // 2.0x base
        h2: {fontSize: 16, bold: true, margin: [0, 12, 0, 8], color: '#1a1a1a', lineHeight: 1.25},       // 1.5x base
        h3: {fontSize: 13, bold: true, margin: [0, 10, 0, 6], color: '#1a1a1a', lineHeight: 1.25},       // 1.25x base
        h4: {fontSize: 11.5, bold: true, margin: [0, 8, 0, 5], color: '#1a1a1a', lineHeight: 1.25},      // 1.1x base
        h5: {fontSize: 10.5, bold: true, margin: [0, 6, 0, 4], color: '#1a1a1a', lineHeight: 1.25},      // 1.0x base
        h6: {fontSize: 10, bold: true, margin: [0, 5, 0, 3], color: '#666666', lineHeight: 1.25},        // 0.95x base
        p: {fontSize: 10.5, margin: [0, 0, 0, 10], lineHeight: 1.6},
        ul: {margin: [0, 5, 0, 10]},
        ol: {margin: [0, 5, 0, 10]},
        li: {fontSize: 10.5, margin: [0, 3, 0, 3], lineHeight: 1.6},
        strong: {bold: true},
        b: {bold: true},
        em: {italics: true},
        i: {italics: true},
        a: {color: '#0969da', decoration: 'underline'},
        hr: {margin: [0, 10, 0, 10]},
        blockquote: {margin: [10, 5, 0, 10], italics: true, color: '#666666', fontSize: 10.5}
    },
    
    // Document settings
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 40, 40, 40], // [left, top, right, bottom]
    
    // Default font and styling
    defaultStyle: {
        font: 'Roboto',
        fontSize: 10.5,  // Matches HTML 14px
        lineHeight: 1.6,  // Matches typical HTML line-height
        color: '#24292f'  // GitHub text color
    },
    
    // Options for html-to-pdfmake
    htmlToPdfmakeOptions: {
        tableAutoSize: true,
        removeExtraBlanks: true,
        ignoreStyles: []
    }
};

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Export HTML to PDF using pdfmake
 * @param {HTMLElement} element - The element to export
 * @param {string} filename - Output filename
 * @param {object} options - Additional options
 */
async function exportWithPDFMake(element, filename = 'document.pdf', options = {}) {
    // Check dependencies
    if (!window.pdfMake) {
        throw new Error('pdfMake not loaded. Add: <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>');
    }
    
    if (!window.htmlToPdfmake) {
        throw new Error('html-to-pdfmake not loaded. Add: <script src="https://unpkg.com/html-to-pdfmake@2.5.1/browser.js"></script>');
    }
    
    console.log('[pdfmake] Starting export');
    
    try {
        // Get HTML content
        const html = element.innerHTML;
        
        // Merge options
        const config = {
            ...PDFMAKE_CONFIG,
            ...options
        };
        
        // Convert HTML to pdfmake format
        console.log('[pdfmake] Converting HTML to pdfmake format');
        const pdfContent = htmlToPdfmake(html, {
            ...config.htmlToPdfmakeOptions,
            defaultStyles: config.defaultStyles
        });
        
        // Create document definition
        const docDefinition = {
            content: pdfContent,
            defaultStyle: config.defaultStyle,
            pageSize: config.pageSize,
            pageOrientation: config.pageOrientation,
            pageMargins: config.pageMargins,
            info: {
                title: filename.replace('.pdf', ''),
                author: 'DocMark',
                creator: 'DocMark PDF Export',
                producer: 'pdfmake'
            },
            // Add page numbers
            footer: function(currentPage, pageCount) {
                return {
                    text: 'Page ' + currentPage + ' of ' + pageCount,
                    alignment: 'center',
                    fontSize: 9,
                    color: '#999999',
                    margin: [0, 10, 0, 0]
                };
            }
        };
        
        console.log('[pdfmake] Creating PDF');
        
        // Create and download PDF
        pdfMake.createPdf(docDefinition).download(filename);
        
        console.log('[pdfmake] ✅ Export complete');
        
    } catch (error) {
        console.error('[pdfmake] Export failed:', error);
        throw error;
    }
}

/**
 * Export with paper layout support
 * For .paper-container elements, export each as a separate page
 */
async function exportPaperLayoutPDFMake(containerElement, filename = 'document.pdf', options = {}) {
    if (!window.pdfMake || !window.htmlToPdfmake) {
        throw new Error('Required libraries not loaded');
    }
    
    console.log('[pdfmake] Paper layout export');
    
    // Find paper containers
    const pages = containerElement.querySelectorAll('.paper-container');
    
    if (pages.length === 0) {
        // No paper layout, use regular export
        return exportWithPDFMake(containerElement, filename, options);
    }
    
    console.log(`[pdfmake] Found ${pages.length} paper pages`);
    
    const config = {
        ...PDFMAKE_CONFIG,
        ...options
    };
    
    // Convert each page
    const allContent = [];
    
    pages.forEach((page, index) => {
        console.log(`[pdfmake] Processing page ${index + 1}/${pages.length}`);
        
        const html = page.innerHTML;
        const pageContent = htmlToPdfmake(html, {
            ...config.htmlToPdfmakeOptions,
            defaultStyles: config.defaultStyles
        });
        
        // Add page content
        allContent.push(...pageContent);
        
        // Add page break after each page except the last
        if (index < pages.length - 1) {
            allContent.push({text: '', pageBreak: 'after'});
        }
    });
    
    // Create document definition
    const docDefinition = {
        content: allContent,
        defaultStyle: config.defaultStyle,
        pageSize: config.pageSize,
        pageOrientation: config.pageOrientation,
        pageMargins: config.pageMargins,
        info: {
            title: filename.replace('.pdf', ''),
            author: 'DocMark',
            creator: 'DocMark PDF Export',
            producer: 'pdfmake'
        },
        footer: function(currentPage, pageCount) {
            return {
                text: 'Page ' + currentPage + ' of ' + pageCount,
                alignment: 'center',
                fontSize: 9,
                color: '#999999',
                margin: [0, 10, 0, 0]
            };
        }
    };
    
    console.log('[pdfmake] Creating PDF with', pages.length, 'pages');
    
    // Create and download PDF
    pdfMake.createPdf(docDefinition).download(filename);
    
    console.log('[pdfmake] ✅ Paper layout export complete');
}

/**
 * Smart export - detects paper layout automatically
 */
async function exportToPDF(element, filename = 'document.pdf', options = {}) {
    const hasPaperLayout = element.querySelector('.paper-container') !== null;
    
    if (hasPaperLayout) {
        return exportPaperLayoutPDFMake(element, filename, options);
    } else {
        return exportWithPDFMake(element, filename, options);
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        exportToPDF, 
        exportWithPDFMake, 
        exportPaperLayoutPDFMake,
        PDFMAKE_CONFIG 
    };
} else {
    window.PDFMakeStyler = { 
        exportToPDF, 
        exportWithPDFMake, 
        exportPaperLayoutPDFMake,
        PDFMAKE_CONFIG 
    };
}
