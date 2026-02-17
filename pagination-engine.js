/**
 * PAGINATION ENGINE - Reusable Paper Layout & Pagination System
 * 
 * This module provides a clean, framework-agnostic pagination system
 * that splits content into pages based on actual measured heights.
 * 
 * Usage:
 *   const paginator = new PaginationEngine(config);
 *   const pages = paginator.paginate(content);
 */

class PaginationEngine {
    constructor(config = {}) {
        // Page dimensions (in pixels, A4 at 96 DPI)
        this.PAGE_HEIGHT = config.pageHeight || 1123;  // 29.7cm
        this.PAGE_WIDTH = config.pageWidth || 794;     // 21cm
        this.MARGIN = config.margin || 80;             // 2.1cm
        
        // Calculate content area
        this.CONTENT_WIDTH = this.PAGE_WIDTH - (this.MARGIN * 2);
        this.CONTENT_HEIGHT = this.PAGE_HEIGHT - (this.MARGIN * 2);
        
        // First page header height (if different from other pages)
        this.FIRST_PAGE_HEADER_HEIGHT = config.firstPageHeaderHeight || 320;
        
        // Line spacing
        this.LINE_SPACING = config.lineSpacing || 8;
        
        // Font settings for measurement
        this.FONT_SIZE = config.fontSize || '13px';
        this.FONT_FAMILY = config.fontFamily || 'Inter, sans-serif';
        this.LINE_HEIGHT = config.lineHeight || 'relaxed';
        
        // Create hidden measurement element
        this.measuringElement = null;
        this.initMeasuringElement();
    }
    
    /**
     * Initialize the hidden DOM element used for measuring text height
     */
    initMeasuringElement() {
        if (typeof document === 'undefined') return; // Server-side safety
        
        this.measuringElement = document.createElement('div');
        this.measuringElement.style.cssText = `
            position: absolute;
            top: -5000px;
            left: -5000px;
            width: ${this.CONTENT_WIDTH}px;
            font-size: ${this.FONT_SIZE};
            font-family: ${this.FONT_FAMILY};
            line-height: ${this.LINE_HEIGHT};
            white-space: pre-wrap;
            visibility: hidden;
            pointer-events: none;
        `;
        document.body.appendChild(this.measuringElement);
    }
    
    /**
     * Measure the height of a text line
     * @param {string} text - The text to measure
     * @returns {number} Height in pixels
     */
    measureHeight(text) {
        if (!this.measuringElement) return 20; // Fallback
        
        this.measuringElement.innerText = text || ' ';
        return this.measuringElement.offsetHeight;
    }
    
    /**
     * Main pagination function
     * @param {string} content - The text content to paginate
     * @returns {Array<Array<string>>} Array of pages, each page is an array of lines
     */
    paginate(content) {
        if (!content) return [[]];
        
        const lines = content.split('\n');
        const pages = [];
        let currentPage = [];
        let currentHeight = 0;
        
        // Calculate max height for first page (with header) and subsequent pages
        const maxFirstPageHeight = this.CONTENT_HEIGHT - this.FIRST_PAGE_HEADER_HEIGHT;
        const maxStandardPageHeight = this.CONTENT_HEIGHT;
        
        lines.forEach((line) => {
            // Measure line height including spacing
            const lineHeight = this.measureHeight(line) + this.LINE_SPACING;
            
            // Determine current page limit
            const currentLimit = pages.length === 0 ? maxFirstPageHeight : maxStandardPageHeight;
            
            // Check if adding this line would exceed page height
            if (currentHeight + lineHeight > currentLimit && currentPage.length > 0) {
                // Save current page and start new one
                pages.push(currentPage);
                currentPage = [line];
                currentHeight = lineHeight;
            } else {
                // Add line to current page
                currentPage.push(line);
                currentHeight += lineHeight;
            }
        });
        
        // Add the last page
        if (currentPage.length > 0) {
            pages.push(currentPage);
        }
        
        return pages;
    }
    
    /**
     * Paginate with custom element measurement
     * Useful when you need to measure complex HTML elements
     * @param {Array<HTMLElement>} elements - Array of DOM elements to paginate
     * @returns {Array<Array<HTMLElement>>} Array of pages
     */
    paginateElements(elements) {
        const pages = [];
        let currentPage = [];
        let currentHeight = 0;
        
        const maxFirstPageHeight = this.CONTENT_HEIGHT - this.FIRST_PAGE_HEADER_HEIGHT;
        const maxStandardPageHeight = this.CONTENT_HEIGHT;
        
        elements.forEach((element) => {
            const elementHeight = element.offsetHeight + this.LINE_SPACING;
            const currentLimit = pages.length === 0 ? maxFirstPageHeight : maxStandardPageHeight;
            
            if (currentHeight + elementHeight > currentLimit && currentPage.length > 0) {
                pages.push(currentPage);
                currentPage = [element];
                currentHeight = elementHeight;
            } else {
                currentPage.push(element);
                currentHeight += elementHeight;
            }
        });
        
        if (currentPage.length > 0) {
            pages.push(currentPage);
        }
        
        return pages;
    }
    
    /**
     * Get page dimensions
     * @returns {Object} Page dimensions
     */
    getPageDimensions() {
        return {
            width: this.PAGE_WIDTH,
            height: this.PAGE_HEIGHT,
            margin: this.MARGIN,
            contentWidth: this.CONTENT_WIDTH,
            contentHeight: this.CONTENT_HEIGHT
        };
    }
    
    /**
     * Clean up - remove measuring element from DOM
     */
    destroy() {
        if (this.measuringElement && this.measuringElement.parentNode) {
            this.measuringElement.parentNode.removeChild(this.measuringElement);
            this.measuringElement = null;
        }
    }
}

/**
 * CSS Generator for Paper Layout
 * Generates the necessary CSS for paper-like pages
 */
class PaperLayoutCSS {
    static generate(config = {}) {
        const pageWidth = config.pageWidth || 794;
        const pageHeight = config.pageHeight || 1123;
        const margin = config.margin || 80;
        
        return `
/* Paper Layout Styles */
.paper-page {
    width: ${pageWidth}px;
    height: ${pageHeight}px;
    background: white;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.15);
    margin: 0 auto 48px auto;
    padding: ${margin}px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
}

.paper-page:last-child {
    margin-bottom: 0;
}

.paper-container {
    background: #EBEDF0;
    padding: 48px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.paper-stack {
    display: flex;
    flex-direction: column;
    gap: 48px;
    transform-origin: top center;
}

/* Zoom Controls */
.paper-zoom-controls {
    position: sticky;
    top: 0;
    margin-bottom: 48px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    padding: 12px 32px;
    border-radius: 9999px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 32px;
    z-index: 50;
}

/* Print Styles */
@media print {
    .paper-container {
        background: white;
        padding: 0;
    }
    
    .paper-page {
        box-shadow: none;
        margin: 0;
        page-break-after: always;
    }
    
    .paper-page:last-child {
        page-break-after: auto;
    }
    
    .paper-zoom-controls,
    .no-print {
        display: none !important;
    }
}
        `.trim();
    }
}

/**
 * React Hook for Pagination (if using React)
 */
const usePagination = (content, config = {}) => {
    const [pages, setPages] = React.useState([]);
    const paginatorRef = React.useRef(null);
    
    React.useEffect(() => {
        // Initialize paginator
        if (!paginatorRef.current) {
            paginatorRef.current = new PaginationEngine(config);
        }
        
        // Paginate content
        const paginatedPages = paginatorRef.current.paginate(content);
        setPages(paginatedPages);
        
        // Cleanup on unmount
        return () => {
            if (paginatorRef.current) {
                paginatorRef.current.destroy();
                paginatorRef.current = null;
            }
        };
    }, [content]);
    
    return pages;
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PaginationEngine, PaperLayoutCSS, usePagination };
}

if (typeof window !== 'undefined') {
    window.PaginationEngine = PaginationEngine;
    window.PaperLayoutCSS = PaperLayoutCSS;
    if (typeof React !== 'undefined') {
        window.usePagination = usePagination;
    }
}
