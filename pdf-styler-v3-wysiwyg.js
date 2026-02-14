/**
 * PDF STYLER V3 - TRUE WYSIWYG Export
 * 
 * This approach uses html2canvas to capture the exact visual appearance
 * of the HTML preview, then embeds it in the PDF.
 * 
 * Advantages:
 * - Perfect visual match with HTML preview
 * - Preserves all CSS styling (colors, fonts, spacing)
 * - Preserves layout exactly as rendered
 * - No manual text positioning needed
 * 
 * Dependencies: 
 * - jsPDF library (window.jspdf)
 * - html2canvas library (window.html2canvas)
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const PDF_CONFIG_V3 = {
    // A4 dimensions in mm
    width: 210,
    height: 297,
    
    // Canvas settings
    scale: 2, // Higher = better quality, but larger file
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    
    // Page detection
    pageSelector: '.paper-container', // For paper layout mode
    
    // Quality settings
    imageFormat: 'PNG', // PNG for quality, JPEG for smaller files
    imageQuality: 0.95 // 0-1, only for JPEG
};

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Export HTML to PDF with perfect visual fidelity
 * @param {HTMLElement} previewElement - The preview container
 * @param {string} filename - Output filename
 * @param {object} options - Additional options
 */
async function exportToPDFV3(previewElement, filename = 'document.pdf', options = {}) {
    // Wait for required libraries
    let attempts = 0;
    while ((!window.jspdf || !window.html2canvas) && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.jspdf) {
        throw new Error('jsPDF library not loaded');
    }
    
    if (!window.html2canvas) {
        throw new Error('html2canvas library not loaded. Please add: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>');
    }
    
    console.log('[PDF V3] Starting WYSIWYG export');
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
    });
    
    // Check if we have paper layout (multiple .paper-container elements)
    const paperContainers = previewElement.querySelectorAll(PDF_CONFIG_V3.pageSelector);
    
    if (paperContainers.length > 0) {
        // Paper layout mode - each container is a page
        console.log(`[PDF V3] Paper layout detected: ${paperContainers.length} pages`);
        
        for (let i = 0; i < paperContainers.length; i++) {
            const container = paperContainers[i];
            
            console.log(`[PDF V3] Rendering page ${i + 1}/${paperContainers.length}`);
            
            // Capture this page as canvas
            const canvas = await window.html2canvas(container, {
                scale: PDF_CONFIG_V3.scale,
                useCORS: PDF_CONFIG_V3.useCORS,
                allowTaint: PDF_CONFIG_V3.allowTaint,
                backgroundColor: PDF_CONFIG_V3.backgroundColor,
                logging: false,
                windowWidth: container.scrollWidth,
                windowHeight: container.scrollHeight
            });
            
            // Convert canvas to image
            const imgData = canvas.toDataURL(`image/${PDF_CONFIG_V3.imageFormat.toLowerCase()}`, PDF_CONFIG_V3.imageQuality);
            
            // Add page if not first
            if (i > 0) {
                doc.addPage();
            }
            
            // Calculate dimensions to fit A4
            const imgWidth = PDF_CONFIG_V3.width;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add image to PDF
            doc.addImage(imgData, PDF_CONFIG_V3.imageFormat, 0, 0, imgWidth, imgHeight);
            
            console.log(`[PDF V3] Page ${i + 1} added (${imgWidth}x${imgHeight}mm)`);
        }
        
    } else {
        // Single page mode - capture entire preview
        console.log('[PDF V3] Single page mode');
        
        const canvas = await window.html2canvas(previewElement, {
            scale: PDF_CONFIG_V3.scale,
            useCORS: PDF_CONFIG_V3.useCORS,
            allowTaint: PDF_CONFIG_V3.allowTaint,
            backgroundColor: PDF_CONFIG_V3.backgroundColor,
            logging: false
        });
        
        const imgData = canvas.toDataURL(`image/${PDF_CONFIG_V3.imageFormat.toLowerCase()}`, PDF_CONFIG_V3.imageQuality);
        
        // Calculate how many pages we need
        const imgWidth = PDF_CONFIG_V3.width;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageHeight = PDF_CONFIG_V3.height;
        
        let heightLeft = imgHeight;
        let position = 0;
        let pageNum = 0;
        
        while (heightLeft > 0) {
            if (pageNum > 0) {
                doc.addPage();
            }
            
            doc.addImage(imgData, PDF_CONFIG_V3.imageFormat, 0, position, imgWidth, imgHeight);
            
            heightLeft -= pageHeight;
            position -= pageHeight;
            pageNum++;
            
            console.log(`[PDF V3] Page ${pageNum} added`);
        }
    }
    
    console.log('[PDF V3] Export complete');
    doc.save(filename);
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { exportToPDFV3, PDF_CONFIG_V3 };
} else {
    window.PDFStylerV3 = { exportToPDFV3, PDF_CONFIG_V3 };
}
