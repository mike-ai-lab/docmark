/**
 * PDF STYLER V2 - Enhanced Markdown to PDF Export
 * 
 * Major improvements over V1:
 * - WYSIWYG layout matching
 * - Better character encoding
 * - Smart page breaks
 * - Footer positioning at bottom
 * - Page numbers
 * - Mixed formatting support (bold+italic+links in same paragraph)
 * - Line break preservation
 * 
 * Dependencies: jsPDF library (window.jspdf)
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const PDF_CONFIG_V2 = {
    // Page dimensions (A4 in cm)
    width: 21.0,
    height: 29.7,
    marginTop: 2.54,
    marginBottom: 2.54,
    marginLeft: 2.54,
    marginRight: 2.54,
    
    // Font sizes (in points)
    fontSize: {
        h1: 20,
        h2: 16,
        h3: 13,
        h4: 12,
        h5: 11,
        h6: 10,
        paragraph: 10,
        list: 10,
        blockquote: 10,
        code: 9,
        footer: 9,
        pageNumber: 9
    },
    
    // Spacing (in cm)
    spacing: {
        afterH1: 0.8,
        afterH2: 0.7,
        afterH3: 0.6,
        afterH4: 0.5,
        afterParagraph: 0.3,
        afterList: 0.3,
        afterBlockquote: 0.4,
        afterCode: 0.4,
        afterHr: 0.6,
        lineHeight: 0.5,
        listIndent: 0.5
    },
    
    // Colors (RGB)
    colors: {
        text: [0, 0, 0],
        link: [9, 105, 218],
        blockquote: [100, 100, 100],
        hr: [225, 228, 232],
        pageNumber: [150, 150, 150]
    }
};

// ============================================================================
// UNICODE & CHARACTER HANDLING
// ============================================================================

/**
 * Enhanced character sanitization with better Unicode support
 */
function sanitizeTextV2(text) {
    if (!text) return '';
    
    // Character replacement map
    const charMap = {
        // Dashes
        '\u2010': '-',      // hyphen
        '\u2011': '-',      // non-breaking hyphen
        '\u2012': '-',      // figure dash
        '\u2013': '-',      // en dash
        '\u2014': '--',     // em dash
        '\u2015': '--',     // horizontal bar
        
        // Quotes
        '\u2018': "'",      // left single quote
        '\u2019': "'",      // right single quote
        '\u201A': ',',      // single low-9 quote
        '\u201B': "'",      // single high-reversed-9 quote
        '\u201C': '"',      // left double quote
        '\u201D': '"',      // right double quote
        '\u201E': ',,',     // double low-9 quote
        '\u201F': '"',      // double high-reversed-9 quote
        
        // Spaces
        '\u00A0': ' ',      // non-breaking space
        '\u2000': ' ',      // en quad
        '\u2001': ' ',      // em quad
        '\u2002': ' ',      // en space
        '\u2003': ' ',      // em space
        '\u2004': ' ',      // three-per-em space
        '\u2005': ' ',      // four-per-em space
        '\u2006': ' ',      // six-per-em space
        '\u2007': ' ',      // figure space
        '\u2008': ' ',      // punctuation space
        '\u2009': ' ',      // thin space
        '\u200A': ' ',      // hair space
        '\u202F': ' ',      // narrow no-break space
        '\u205F': ' ',      // medium mathematical space
        
        // Other symbols
        '…': '...',         // ellipsis
        '•': '*',           // bullet
        '°': ' deg',        // degree
        '±': '+/-',         // plus-minus
        '×': 'x',           // multiplication
        '÷': '/',           // division
        '≈': '~',           // approximately equal
        '→': '->',          // right arrow
        '←': '<-',          // left arrow
        '↔': '<->',         // left-right arrow
        '²': '2',           // superscript 2
        '³': '3',           // superscript 3
        '€': 'EUR',         // euro
        '£': 'GBP',         // pound
        '¥': 'JPY',         // yen
    };
    
    let result = text;
    for (const [unicode, ascii] of Object.entries(charMap)) {
        result = result.split(unicode).join(ascii);
    }
    
    // Remove control characters but preserve printable characters
    result = result.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
    
    return result;
}

// ============================================================================
// TEXT PROCESSING WITH MIXED FORMATTING
// ============================================================================

/**
 * Process text with mixed formatting (bold, italic, links)
 * Returns array of segments with formatting info
 */
function extractFormattedSegments(element) {
    const segments = [];
    
    function processNode(node, inheritBold = false, inheritItalic = false) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (text) {
                segments.push({
                    text: sanitizeTextV2(text),
                    bold: inheritBold,
                    italic: inheritItalic,
                    link: null
                });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            const isBold = inheritBold || tag === 'strong' || tag === 'b';
            const isItalic = inheritItalic || tag === 'em' || tag === 'i';
            
            if (tag === 'br') {
                segments.push({ text: '\n', bold: false, italic: false, link: null });
            } else if (tag === 'a') {
                const href = node.getAttribute('href');
                segments.push({
                    text: sanitizeTextV2(node.textContent),
                    bold: isBold,
                    italic: isItalic,
                    link: href || null
                });
            } else if (tag === 'code' && node.parentElement.tagName.toLowerCase() !== 'pre') {
                segments.push({
                    text: sanitizeTextV2(node.textContent),
                    bold: false,
                    italic: false,
                    link: null,
                    code: true
                });
            } else {
                // Recursively process children
                Array.from(node.childNodes).forEach(child => 
                    processNode(child, isBold, isItalic)
                );
            }
        }
    }
    
    Array.from(element.childNodes).forEach(child => processNode(child));
    return segments;
}

/**
 * Render formatted text segments to PDF
 */
function renderFormattedText(doc, segments, fontSize, state) {
    if (!segments || segments.length === 0) return;
    
    doc.setFontSize(fontSize);
    const lineHeight = state.config.spacing.lineHeight * 10; // Convert cm to mm
    let currentX = state.marginLeft * 10; // Convert cm to mm
    const maxX = (state.config.width - state.config.marginRight) * 10;
    
    segments.forEach(seg => {
        if (!seg.text) return;
        
        // Handle newlines
        if (seg.text === '\n') {
            state.yPosition += lineHeight;
            currentX = state.marginLeft * 10;
            checkPageBreak(doc, state, lineHeight);
            return;
        }
        
        // Set font style
        if (seg.code) {
            doc.setFont('courier', 'normal');
        } else if (seg.bold && seg.italic) {
            doc.setFont('helvetica', 'bolditalic');
        } else if (seg.bold) {
            doc.setFont('helvetica', 'bold');
        } else if (seg.italic) {
            doc.setFont('helvetica', 'italic');
        } else {
            doc.setFont('helvetica', 'normal');
        }
        
        // Set color
        if (seg.link) {
            doc.setTextColor(...state.config.colors.link);
        } else {
            doc.setTextColor(...state.config.colors.text);
        }
        
        // Word wrap
        const words = seg.text.split(' ');
        words.forEach((word, wordIdx) => {
            if (!word) return;
            
            const spaceWidth = currentX === state.marginLeft * 10 ? 0 : doc.getTextWidth(' ');
            const wordWidth = doc.getTextWidth(word);
            const totalWidth = spaceWidth + wordWidth;
            
            // Check if word fits on current line
            if (currentX + totalWidth > maxX && currentX > state.marginLeft * 10) {
                // Wrap to next line
                state.yPosition += lineHeight;
                currentX = state.marginLeft * 10;
                checkPageBreak(doc, state, lineHeight);
            }
            
            // Add space before word (except at line start)
            if (currentX > state.marginLeft * 10) {
                doc.text(' ', currentX, state.yPosition);
                currentX += spaceWidth;
            }
            
            // Draw word
            const wordX = currentX;
            doc.text(word, currentX, state.yPosition);
            currentX += wordWidth;
            
            // Add link if applicable
            if (seg.link) {
                doc.link(wordX, state.yPosition - fontSize * 0.8, wordWidth, fontSize, { url: seg.link });
                // Underline
                doc.setDrawColor(...state.config.colors.link);
                doc.setLineWidth(0.1);
                doc.line(wordX, state.yPosition + 0.5, wordX + wordWidth, state.yPosition + 0.5);
            }
        });
        
        // Reset color
        doc.setTextColor(...state.config.colors.text);
    });
    
    // Move to next line after all segments
    state.yPosition += lineHeight;
}

// ============================================================================
// PAGE MANAGEMENT
// ============================================================================

/**
 * Check if we need a new page and add one if necessary
 */
function checkPageBreak(doc, state, requiredSpace) {
    const spaceInMm = requiredSpace || 10;
    const bottomMargin = state.config.marginBottom * 10;
    const pageHeight = state.config.height * 10;
    
    if (state.yPosition + spaceInMm > pageHeight - bottomMargin) {
        // Add page number to current page before creating new one
        addPageNumber(doc, state);
        
        doc.addPage();
        state.yPosition = state.config.marginTop * 10;
        state.currentPage++;
        return true;
    }
    return false;
}

/**
 * Add page number at bottom center of page
 */
function addPageNumber(doc, state) {
    const pageHeight = state.config.height * 10;
    const pageWidth = state.config.width * 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(state.config.fontSize.pageNumber);
    doc.setTextColor(...state.config.colors.pageNumber);
    
    const pageText = `Page ${state.currentPage}`;
    const textWidth = doc.getTextWidth(pageText);
    const x = (pageWidth - textWidth) / 2;
    const y = pageHeight - 15; // 15mm from bottom
    
    doc.text(pageText, x, y);
    doc.setTextColor(...state.config.colors.text);
}

/**
 * Estimate height needed for an element
 */
function estimateElementHeight(element, doc, state) {
    const tag = element.tagName.toLowerCase();
    const config = state.config;
    
    // Base estimates in mm
    if (tag === 'h1') return 15;
    if (tag === 'h2') return 12;
    if (tag === 'h3') return 10;
    if (tag === 'h4') return 8;
    if (tag === 'hr') return 5;
    
    if (tag === 'p') {
        const textLength = element.textContent.length;
        const linesEstimate = Math.ceil(textLength / 90);
        return linesEstimate * 5 + 3;
    }
    
    if (tag === 'ul' || tag === 'ol') {
        const items = element.querySelectorAll('li');
        return items.length * 6 + 3;
    }
    
    if (tag === 'blockquote') {
        const textLength = element.textContent.length;
        const linesEstimate = Math.ceil(textLength / 80);
        return linesEstimate * 5 + 4;
    }
    
    if (tag === 'pre') {
        const lines = element.textContent.split('\n').length;
        return lines * 4 + 4;
    }
    
    if (tag === 'table') {
        const rows = element.querySelectorAll('tr');
        return rows.length * 8 + 5;
    }
    
    if (tag === 'div' && element.getAttribute('data-pdf-footer') === 'true') {
        return 25; // Footer needs fixed space
    }
    
    return 10; // Default
}

// ============================================================================
// ELEMENT RENDERERS
// ============================================================================

function renderHeading(doc, element, level, state) {
    const fontSize = state.config.fontSize[`h${level}`] || state.config.fontSize.h4;
    const spacing = state.config.spacing[`afterH${level}`] || state.config.spacing.afterH4;
    
    checkPageBreak(doc, state, 15);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize);
    doc.setTextColor(...state.config.colors.text);
    
    const text = sanitizeTextV2(element.textContent);
    doc.text(text, state.marginLeft * 10, state.yPosition);
    
    state.yPosition += fontSize * 0.5;
    
    // Add underline for h1 and h2
    if (level <= 2) {
        const lineY = state.yPosition;
        doc.setDrawColor(229, 229, 229);
        doc.setLineWidth(0.2);
        doc.line(
            state.marginLeft * 10,
            lineY,
            (state.config.width - state.config.marginRight) * 10,
            lineY
        );
        state.yPosition += 2;
    }
    
    state.yPosition += spacing * 10;
}

function renderParagraph(doc, element, state) {
    checkPageBreak(doc, state, 10);
    
    const segments = extractFormattedSegments(element);
    renderFormattedText(doc, segments, state.config.fontSize.paragraph, state);
    
    state.yPosition += state.config.spacing.afterParagraph * 10;
}

function renderList(doc, element, state) {
    const isOrdered = element.tagName.toLowerCase() === 'ol';
    const items = element.querySelectorAll('li');
    
    checkPageBreak(doc, state, items.length * 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(state.config.fontSize.list);
    doc.setTextColor(...state.config.colors.text);
    
    const lineHeight = state.config.spacing.lineHeight * 10;
    const indent = state.config.spacing.listIndent * 10;
    
    items.forEach((item, idx) => {
        const bullet = isOrdered ? `${idx + 1}. ` : '• ';
        const text = sanitizeTextV2(bullet + item.textContent);
        
        // Word wrap for list items
        const maxWidth = (state.config.width - state.config.marginLeft - state.config.marginRight - state.config.spacing.listIndent) * 10;
        const lines = doc.splitTextToSize(text, maxWidth);
        
        lines.forEach(line => {
            checkPageBreak(doc, state, lineHeight);
            doc.text(line, (state.marginLeft * 10) + indent, state.yPosition);
            state.yPosition += lineHeight;
        });
    });
    
    state.yPosition += state.config.spacing.afterList * 10;
}

function renderBlockquote(doc, element, state) {
    checkPageBreak(doc, state, 10);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(state.config.fontSize.blockquote);
    doc.setTextColor(...state.config.colors.blockquote);
    
    const text = sanitizeTextV2('| ' + element.textContent);
    const maxWidth = (state.config.width - state.config.marginLeft - state.config.marginRight) * 10;
    const lines = doc.splitTextToSize(text, maxWidth);
    const lineHeight = state.config.spacing.lineHeight * 10;
    
    lines.forEach(line => {
        checkPageBreak(doc, state, lineHeight);
        doc.text(line, state.marginLeft * 10, state.yPosition);
        state.yPosition += lineHeight;
    });
    
    doc.setTextColor(...state.config.colors.text);
    state.yPosition += state.config.spacing.afterBlockquote * 10;
}

function renderCodeBlock(doc, element, state) {
    const lines = element.textContent.split('\n');
    checkPageBreak(doc, state, lines.length * 4);
    
    doc.setFont('courier', 'normal');
    doc.setFontSize(state.config.fontSize.code);
    doc.setTextColor(...state.config.colors.text);
    
    const lineHeight = 4;
    
    lines.forEach(line => {
        checkPageBreak(doc, state, lineHeight);
        doc.text(sanitizeTextV2(line || ' '), state.marginLeft * 10, state.yPosition);
        state.yPosition += lineHeight;
    });
    
    doc.setFont('helvetica', 'normal');
    state.yPosition += state.config.spacing.afterCode * 10;
}

function renderHorizontalRule(doc, state) {
    checkPageBreak(doc, state, 5);
    
    doc.setDrawColor(...state.config.colors.hr);
    doc.setLineWidth(0.7);
    doc.line(
        state.marginLeft * 10,
        state.yPosition,
        (state.config.width - state.config.marginRight) * 10,
        state.yPosition
    );
    
    state.yPosition += state.config.spacing.afterHr * 10;
}

function renderTable(doc, element, state) {
    // Simple table rendering - can be enhanced later
    const rows = element.querySelectorAll('tr');
    checkPageBreak(doc, state, rows.length * 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(state.config.fontSize.paragraph);
    
    rows.forEach((row, rowIdx) => {
        const cells = row.querySelectorAll('td, th');
        const isHeader = row.parentElement.tagName.toLowerCase() === 'thead';
        
        if (isHeader) {
            doc.setFont('helvetica', 'bold');
        } else {
            doc.setFont('helvetica', 'normal');
        }
        
        let cellText = '';
        cells.forEach((cell, cellIdx) => {
            cellText += sanitizeTextV2(cell.textContent);
            if (cellIdx < cells.length - 1) cellText += ' | ';
        });
        
        checkPageBreak(doc, state, 6);
        doc.text(cellText, state.marginLeft * 10, state.yPosition);
        state.yPosition += 6;
    });
    
    state.yPosition += 8;
}

function renderFooter(doc, element, state) {
    // Position footer at bottom of page
    const pageHeight = state.config.height * 10;
    const footerY = pageHeight - state.config.marginBottom * 10 - 20;
    
    // Draw HR line
    doc.setDrawColor(...state.config.colors.hr);
    doc.setLineWidth(0.7);
    doc.line(
        state.marginLeft * 10,
        footerY,
        (state.config.width - state.config.marginRight) * 10,
        footerY
    );
    
    // Process footer content
    const flexDiv = element.querySelector('div[style*="flex"]');
    if (flexDiv) {
        const leftDiv = flexDiv.children[0];
        const rightDiv = flexDiv.children[1];
        
        if (leftDiv && rightDiv) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(state.config.fontSize.footer);
            
            // Left side
            const leftStrong = leftDiv.querySelector('strong')?.textContent || '';
            doc.text(sanitizeTextV2(leftStrong), state.marginLeft * 10, footerY + 7);
            
            // Right side
            const rightStrong = rightDiv.querySelector('strong')?.textContent || '';
            const rightWidth = doc.getTextWidth(rightStrong);
            doc.text(
                sanitizeTextV2(rightStrong),
                (state.config.width - state.config.marginRight) * 10 - rightWidth,
                footerY + 7
            );
            
            // Subtext
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            
            const leftSpan = leftDiv.querySelector('span')?.textContent || '';
            doc.text(sanitizeTextV2(leftSpan), state.marginLeft * 10, footerY + 12);
            
            const rightSpan = rightDiv.querySelector('span')?.textContent || '';
            const rightSpanWidth = doc.getTextWidth(rightSpan);
            doc.text(
                sanitizeTextV2(rightSpan),
                (state.config.width - state.config.marginRight) * 10 - rightSpanWidth,
                footerY + 12
            );
            
            doc.setTextColor(...state.config.colors.text);
        }
    }
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Export preview to PDF with enhanced features
 * @param {HTMLElement} previewElement - The preview container
 * @param {string} filename - Output filename
 * @param {object} options - Additional options
 */
async function exportToPDFV2(previewElement, filename = 'document.pdf', options = {}) {
    // Wait for jsPDF
    let attempts = 0;
    while (!window.jspdf && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.jspdf) {
        throw new Error('jsPDF library not loaded');
    }
    
    console.log('[PDF V2] Starting enhanced export');
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    // Initialize state
    const state = {
        config: PDF_CONFIG_V2,
        yPosition: PDF_CONFIG_V2.marginTop * 10, // Convert cm to mm
        marginLeft: PDF_CONFIG_V2.marginLeft,
        currentPage: 1
    };
    
    // Get all elements
    const elements = Array.from(previewElement.children);
    console.log(`[PDF V2] Processing ${elements.length} elements`);
    
    // Process each element
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const tag = element.tagName.toLowerCase();
        
        try {
            // Check if this is a footer - handle specially
            if (tag === 'div' && element.getAttribute('data-pdf-footer') === 'true') {
                renderFooter(doc, element, state);
                continue;
            }
            
            // Estimate space and check page break
            const estimatedHeight = estimateElementHeight(element, doc, state);
            checkPageBreak(doc, state, estimatedHeight);
            
            // Render element
            if (tag === 'h1') renderHeading(doc, element, 1, state);
            else if (tag === 'h2') renderHeading(doc, element, 2, state);
            else if (tag === 'h3') renderHeading(doc, element, 3, state);
            else if (tag === 'h4') renderHeading(doc, element, 4, state);
            else if (tag === 'h5') renderHeading(doc, element, 5, state);
            else if (tag === 'h6') renderHeading(doc, element, 6, state);
            else if (tag === 'p') renderParagraph(doc, element, state);
            else if (tag === 'ul' || tag === 'ol') renderList(doc, element, state);
            else if (tag === 'blockquote') renderBlockquote(doc, element, state);
            else if (tag === 'pre') renderCodeBlock(doc, element, state);
            else if (tag === 'table') renderTable(doc, element, state);
            else if (tag === 'hr') renderHorizontalRule(doc, state);
            
        } catch (error) {
            console.error(`[PDF V2] Error rendering ${tag}:`, error);
            // Continue with next element
        }
    }
    
    // Add page number to last page
    addPageNumber(doc, state);
    
    console.log(`[PDF V2] Export complete - ${state.currentPage} pages`);
    doc.save(filename);
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { exportToPDFV2, PDF_CONFIG_V2, sanitizeTextV2 };
} else {
    window.PDFStylerV2 = { exportToPDFV2, PDF_CONFIG_V2, sanitizeTextV2 };
}
