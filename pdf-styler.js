/**
 * PDF STYLER - Markdown to PDF Export Module
 * 
 * This module handles all PDF visual appearance and styling for the Markdown Live Preview editor.
 * It converts HTML preview content to a professionally formatted PDF document.
 * 
 * Dependencies: jsPDF library (window.jspdf)
 * 
 * Key Features:
 * - Unicode character sanitization (converts special chars to ASCII)
 * - Clickable hyperlinks with blue styling
 * - Professional table formatting with dynamic column widths
 * - Proper spacing and typography
 * - Multi-page support with automatic page breaks
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const PDF_CONFIG = {
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    margin: 15,
    
    // Font sizes
    fontSize: {
        h1: 20,
        h2: 16,
        h3: 14,
        h4: 12,
        h5: 12,
        h6: 12,
        paragraph: 11,
        list: 11,
        blockquote: 10,
        code: 9,
        table: 8
    },
    
    // Spacing (in mm)
    spacing: {
        beforeH1: 5,
        afterH1: 3,
        beforeH2: 4,
        afterH2: 2,
        beforeH3: 3,
        afterH3: 1.5,  // Reduced from 2 to bring table closer to heading
        beforeH4: 2,
        afterH4: 1,
        afterParagraph: 2,
        afterList: 2,
        afterBlockquote: 2,
        afterCode: 2,
        beforeTable: 2,  // Reduced from 5 to 2 - table closer to title
        afterTable: 8,   // Keep large spacing after table
        afterHr: 3
    },
    
    // Colors
    colors: {
        text: [0, 0, 0],
        link: [0, 102, 204],
        blockquote: [100, 100, 100],
        tableBorder: [200, 200, 200],
        tableHeaderBg: [240, 240, 240]
    }
};

// ============================================================================
// UNICODE SANITIZATION
// ============================================================================

/**
 * Sanitizes text for PDF export by converting Unicode characters to ASCII equivalents.
 * This prevents garbled text in the PDF output.
 * 
 * @param {string} text - The text to sanitize
 * @returns {string} - Sanitized text with ASCII characters
 */
function sanitizeForPdf(text) {
    if (!text) return '';
    
    // Map of Unicode characters to ASCII equivalents
    const charMap = {
        '≈': '~',           // approximately equal
        '→': '->',          // right arrow
        '←': '<-',          // left arrow
        '↔': '<->',         // left-right arrow
        '²': '2',           // superscript 2
        '³': '3',           // superscript 3
        '×': 'x',           // multiplication
        '÷': '/',           // division
        'Ø': 'O',           // diameter
        'ø': 'o',           // diameter lowercase
        '°': ' deg',        // degree
        '±': '+/-',         // plus-minus
        '–': '-',           // en dash (U+2013)
        '—': '--',          // em dash (U+2014)
        '‑': '-',           // non-breaking hyphen (U+2011)
        '\u2010': '-',      // hyphen (U+2010)
        '\u2012': '-',      // figure dash (U+2012)
        '\u2013': '-',      // en dash (U+2013)
        '\u2014': '--',     // em dash (U+2014)
        '\u2015': '--',     // horizontal bar (U+2015)
        '\u2018': "'",      // left single quote
        '\u2019': "'",      // right single quote
        '\u201C': '"',      // left double quote
        '\u201D': '"',      // right double quote
        '\u201A': ',',      // single low-9 quotation mark
        '\u201E': ',,',     // double low-9 quotation mark
        '…': '...',         // ellipsis
        '•': '*',           // bullet
        '€': 'EUR',         // euro
        '£': 'GBP',         // pound
        '¥': 'JPY',         // yen
        'ط': 'm.l',         // Arabic letter (linear meter)
        'م': 'm',           // Arabic letter
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
        // Add more as needed
    };
    
    let result = text;
    for (const [unicode, ascii] of Object.entries(charMap)) {
        result = result.split(unicode).join(ascii);
    }
    
    // Instead of removing all non-ASCII, try to preserve what we can
    // Only replace truly problematic characters
    result = result.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
    
    return result;
}

// ============================================================================
// TEXT RENDERING HELPERS
// ============================================================================

/**
 * Adds text to the PDF with word wrapping and formatting.
 * 
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {string} text - The text to add
 * @param {number} fontSize - Font size in points
 * @param {boolean} isBold - Whether text should be bold
 * @param {boolean} isItalic - Whether text should be italic
 * @param {object} state - Current PDF state (yPosition, pageWidth, pageHeight, margin, maxWidth)
 */
function addText(doc, text, fontSize, isBold, isItalic, state) {
    if (!text || text.trim() === '') return;
    
    // Sanitize text for PDF
    text = sanitizeForPdf(text);
    
    doc.setFontSize(fontSize);
    if (isBold && isItalic) {
        doc.setFont('helvetica', 'bolditalic');
    } else if (isBold) {
        doc.setFont('helvetica', 'bold');
    } else if (isItalic) {
        doc.setFont('helvetica', 'italic');
    } else {
        doc.setFont('helvetica', 'normal');
    }

    // Split text into words and wrap properly
    const words = text.split(' ');
    const lineHeight = fontSize * 0.5;
    let currentLine = '';
    
    words.forEach((word) => {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = doc.getStringUnitWidth(testLine) * fontSize / doc.internal.scaleFactor;
        
        if (testWidth > state.maxWidth && currentLine) {
            // Line is too long, output current line
            if (state.yPosition + lineHeight > state.pageHeight - state.margin) {
                doc.addPage();
                state.yPosition = state.margin;
            }
            doc.text(currentLine, state.margin, state.yPosition);
            state.yPosition += lineHeight;
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    
    // Output remaining text
    if (currentLine) {
        if (state.yPosition + lineHeight > state.pageHeight - state.margin) {
            doc.addPage();
            state.yPosition = state.margin;
        }
        doc.text(currentLine, state.margin, state.yPosition);
        state.yPosition += lineHeight;
    }
}

/**
 * Extracts formatted text segments from an HTML element.
 * Preserves bold, italic, links, and inline code formatting.
 * 
 * @param {HTMLElement} element - The HTML element to extract text from
 * @returns {Array} - Array of text segments with formatting info
 */
function getFormattedText(element) {
    let result = [];
    
    const processNode = (node, inheritBold = false, inheritItalic = false) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (text.trim()) {
                result.push({ text, bold: inheritBold, italic: inheritItalic });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            const isBold = inheritBold || tag === 'strong' || tag === 'b';
            const isItalic = inheritItalic || tag === 'em' || tag === 'i';
            
            if (tag === 'br') {
                result.push({ text: '\n', bold: false, italic: false });
            } else if (tag === 'a') {
                // For links, store the URL separately for clickable links
                const linkText = node.textContent;
                const href = node.getAttribute('href');
                result.push({ 
                    text: linkText, 
                    bold: isBold, 
                    italic: isItalic,
                    link: href || null,
                    isLink: true
                });
            } else if (tag === 'code' && node.parentElement.tagName.toLowerCase() !== 'pre') {
                // Inline code
                result.push({ text: node.textContent, bold: false, italic: false, code: true });
            } else {
                // Recursively process children
                node.childNodes.forEach(child => processNode(child, isBold, isItalic));
            }
        }
    };
    
    element.childNodes.forEach(child => processNode(child));
    return result;
}

/**
 * Renders formatted text segments with proper styling and clickable links.
 * 
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {Array} segments - Array of text segments from getFormattedText()
 * @param {number} fontSize - Font size in points
 * @param {object} state - Current PDF state
 */
function addFormattedText(doc, segments, fontSize, state) {
    if (!segments || segments.length === 0) return;
    
    doc.setFontSize(fontSize);
    const lineHeight = fontSize * 0.5;
    let currentX = state.margin;
    
    segments.forEach((seg) => {
        // Sanitize text for PDF
        let text = sanitizeForPdf(seg.text);
        
        // Set font style and color
        if (seg.isLink) {
            // Links: blue color, underlined
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...PDF_CONFIG.colors.link);
        } else if (seg.code) {
            doc.setFont('courier', 'normal');
            doc.setTextColor(...PDF_CONFIG.colors.text);
        } else if (seg.bold && seg.italic) {
            doc.setFont('helvetica', 'bolditalic');
            doc.setTextColor(...PDF_CONFIG.colors.text);
        } else if (seg.bold) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...PDF_CONFIG.colors.text);
        } else if (seg.italic) {
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(...PDF_CONFIG.colors.text);
        } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...PDF_CONFIG.colors.text);
        }
        
        // Split by newlines
        const parts = text.split('\n');
        parts.forEach((part, partIdx) => {
            if (partIdx > 0) {
                // New line
                state.yPosition += lineHeight;
                currentX = state.margin;
                if (state.yPosition > state.pageHeight - state.margin) {
                    doc.addPage();
                    state.yPosition = state.margin;
                }
            }
            
            if (part) {
                // Word wrap
                const words = part.split(' ');
                words.forEach((word) => {
                    if (!word) return;
                    
                    const spaceWidth = currentX === state.margin ? 0 : doc.getStringUnitWidth(' ') * fontSize / doc.internal.scaleFactor;
                    const wordWidth = doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor;
                    const totalWidth = spaceWidth + wordWidth;
                    
                    if (currentX + totalWidth > state.pageWidth - state.margin && currentX > state.margin) {
                        // Need to wrap
                        state.yPosition += lineHeight;
                        currentX = state.margin;
                        if (state.yPosition > state.pageHeight - state.margin) {
                            doc.addPage();
                            state.yPosition = state.margin;
                        }
                        doc.text(word, currentX, state.yPosition);
                        
                        // Add clickable link
                        if (seg.isLink && seg.link) {
                            doc.link(currentX, state.yPosition - fontSize * 0.8, wordWidth, fontSize, { url: seg.link });
                            // Add underline
                            doc.setDrawColor(...PDF_CONFIG.colors.link);
                            doc.setLineWidth(0.1);
                            doc.line(currentX, state.yPosition + 0.5, currentX + wordWidth, state.yPosition + 0.5);
                        }
                        
                        currentX += wordWidth;
                    } else {
                        const startX = currentX;
                        if (currentX > state.margin) {
                            doc.text(' ' + word, currentX, state.yPosition);
                            currentX += totalWidth;
                        } else {
                            doc.text(word, currentX, state.yPosition);
                            currentX += wordWidth;
                        }
                        
                        // Add clickable link
                        if (seg.isLink && seg.link) {
                            const linkX = startX + (startX > state.margin ? spaceWidth : 0);
                            doc.link(linkX, state.yPosition - fontSize * 0.8, wordWidth, fontSize, { url: seg.link });
                            // Add underline
                            doc.setDrawColor(...PDF_CONFIG.colors.link);
                            doc.setLineWidth(0.1);
                            doc.line(linkX, state.yPosition + 0.5, linkX + wordWidth, state.yPosition + 0.5);
                        }
                    }
                });
            }
        });
        
        // Reset color after link
        if (seg.isLink) {
            doc.setTextColor(...PDF_CONFIG.colors.text);
        }
    });
    
    // Move to next line after formatted text
    state.yPosition += lineHeight;
}

/**
 * Adds vertical spacing to the PDF.
 * 
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {number} space - Amount of space in mm
 * @param {object} state - Current PDF state
 */
function addSpacing(doc, space, state) {
    state.yPosition += space;
    if (state.yPosition > state.pageHeight - state.margin) {
        doc.addPage();
        state.yPosition = state.margin;
    }
}

// ============================================================================
// TABLE RENDERING
// ============================================================================

/**
 * Renders an HTML table element to the PDF with professional formatting.
 * Features:
 * - Dynamic column widths based on content
 * - Proper text wrapping in cells
 * - Clickable links in cells
 * - Header row styling
 * 
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {HTMLElement} tableElement - The HTML table element
 * @param {object} state - Current PDF state
 */
function renderTable(doc, tableElement, state) {
    // Add spacing before table for visual separation
    addSpacing(doc, PDF_CONFIG.spacing.beforeTable, state);
    
    const allRows = tableElement.querySelectorAll('tr');
    if (allRows.length === 0) return;
    
    // Calculate column widths based on content
    let maxCols = 0;
    const columnData = [];
    
    allRows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        maxCols = Math.max(maxCols, cells.length);
        
        cells.forEach((cell, colIndex) => {
            if (!columnData[colIndex]) {
                columnData[colIndex] = { maxWidth: 0, texts: [] };
            }
            
            // Extract text and sanitize for PDF
            let cellText = sanitizeForPdf(cell.textContent.trim());
            columnData[colIndex].texts.push(cellText);
            
            // Measure text width
            doc.setFontSize(PDF_CONFIG.fontSize.table);
            doc.setFont('helvetica', 'normal');
            const textWidth = doc.getStringUnitWidth(cellText) * PDF_CONFIG.fontSize.table / doc.internal.scaleFactor;
            columnData[colIndex].maxWidth = Math.max(columnData[colIndex].maxWidth, textWidth);
        });
    });
    
    // Calculate proportional column widths
    const totalContentWidth = columnData.reduce((sum, col) => sum + col.maxWidth, 0);
    const availableWidth = state.maxWidth - 4; // Leave some margin
    
    const colWidths = columnData.map(col => {
        const proportionalWidth = (col.maxWidth / totalContentWidth) * availableWidth;
        return Math.max(proportionalWidth, 20); // Minimum 20mm per column
    });
    
    // Adjust if total width exceeds available width
    const totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
    if (totalWidth > availableWidth) {
        const scale = availableWidth / totalWidth;
        colWidths.forEach((w, i) => colWidths[i] = w * scale);
    }
    
    // Check if we need a new page
    if (state.yPosition + 10 > state.pageHeight - state.margin) {
        doc.addPage();
        state.yPosition = state.margin;
    }
    
    let tableY = state.yPosition;
    
    // Render each row
    allRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td, th');
        const isHeader = row.parentElement.tagName.toLowerCase() === 'thead';
        
        // Calculate row height based on content
        let maxRowHeight = 7;
        const cellLines = [];
        
        cells.forEach((cell, colIndex) => {
            const cellText = sanitizeForPdf(cell.textContent.trim());
            const colWidth = colWidths[colIndex] || 30;
            
            doc.setFontSize(PDF_CONFIG.fontSize.table);
            doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
            
            // Split text to fit column width
            const words = cellText.split(' ');
            const lines = [];
            let currentLine = '';
            
            words.forEach(word => {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const testWidth = doc.getStringUnitWidth(testLine) * PDF_CONFIG.fontSize.table / doc.internal.scaleFactor;
                
                if (testWidth > colWidth - 2) {
                    if (currentLine) {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        // Word is too long, force break
                        lines.push(word);
                        currentLine = '';
                    }
                } else {
                    currentLine = testLine;
                }
            });
            
            if (currentLine) {
                lines.push(currentLine);
            }
            
            cellLines[colIndex] = lines;
            maxRowHeight = Math.max(maxRowHeight, lines.length * 4 + 3);
        });
        
        // Check if row fits on current page
        if (tableY + maxRowHeight > state.pageHeight - state.margin) {
            doc.addPage();
            tableY = state.margin;
        }
        
        // Draw cells
        let xPos = state.margin;
        cells.forEach((cell, colIndex) => {
            const colWidth = colWidths[colIndex] || 30;
            
            // Draw cell border
            doc.setDrawColor(...PDF_CONFIG.colors.tableBorder);
            doc.setLineWidth(0.1);
            doc.rect(xPos, tableY, colWidth, maxRowHeight);
            
            // Fill header background
            if (isHeader) {
               
 doc.setFillColor(...PDF_CONFIG.colors.tableHeaderBg);
                doc.rect(xPos, tableY, colWidth, maxRowHeight, 'F');
            }
            
            // Draw cell text
            const lines = cellLines[colIndex] || [];
            let textY = tableY + 4;
            
            doc.setFontSize(PDF_CONFIG.fontSize.table);
            doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
            doc.setTextColor(...PDF_CONFIG.colors.text);
            
            lines.forEach(line => {
                // Check if line contains a URL pattern
                const urlPattern = /(https?:\/\/[^\s]+)/g;
                const urlMatch = line.match(urlPattern);
                
                if (urlMatch) {
                    // Make URL clickable
                    const url = urlMatch[0];
                    const textWidth = doc.getStringUnitWidth(line) * PDF_CONFIG.fontSize.table / doc.internal.scaleFactor;
                    
                    // Draw text in blue
                    doc.setTextColor(...PDF_CONFIG.colors.link);
                    doc.text(line, xPos + 1, textY);
                    
                    // Add clickable link
                    doc.link(xPos + 1, textY - 3, textWidth, 4, { url: url });
                    
                    // Add underline
                    doc.setDrawColor(...PDF_CONFIG.colors.link);
                    doc.setLineWidth(0.1);
                    doc.line(xPos + 1, textY + 0.5, xPos + 1 + textWidth, textY + 0.5);
                    
                    // Reset color
                    doc.setTextColor(...PDF_CONFIG.colors.text);
                } else {
                    doc.text(line, xPos + 1, textY);
                }
                
                textY += 4;
            });
            
            xPos += colWidth;
        });
        
        tableY += maxRowHeight;
    });
    
    state.yPosition = tableY;
    
    // Add spacing after table for visual separation (IMPORTANT!)
    addSpacing(doc, PDF_CONFIG.spacing.afterTable, state);
}

// ============================================================================
// ELEMENT RENDERING FUNCTIONS
// ============================================================================

/**
 * Renders a heading element to the PDF.
 */
function renderHeading(doc, element, level, state) {
    const spacing = PDF_CONFIG.spacing;
    const fontSize = PDF_CONFIG.fontSize;
    
    // Add spacing before heading
    if (level === 1) addSpacing(doc, spacing.beforeH1, state);
    else if (level === 2) addSpacing(doc, spacing.beforeH2, state);
    else if (level === 3) addSpacing(doc, spacing.beforeH3, state);
    else addSpacing(doc, spacing.beforeH4, state);
    
    // Render heading text
    const text = sanitizeForPdf(element.textContent);
    const headingFontSize = fontSize[`h${level}`] || fontSize.h4;
    addText(doc, text, headingFontSize, true, false, state);
    
    // Add spacing after heading
    if (level === 1) addSpacing(doc, spacing.afterH1, state);
    else if (level === 2) addSpacing(doc, spacing.afterH2, state);
    else if (level === 3) addSpacing(doc, spacing.afterH3, state);
    else addSpacing(doc, spacing.afterH4, state);
}

/**
 * Renders a paragraph element to the PDF.
 */
function renderParagraph(doc, element, state) {
    const segments = getFormattedText(element);
    addFormattedText(doc, segments, PDF_CONFIG.fontSize.paragraph, state);
    addSpacing(doc, PDF_CONFIG.spacing.afterParagraph, state);
}

/**
 * Renders a list (ul/ol) element to the PDF.
 */
function renderList(doc, element, state) {
    const isOrdered = element.tagName.toLowerCase() === 'ol';
    const items = element.querySelectorAll('li');
    
    items.forEach((item, index) => {
        const bullet = isOrdered ? `${index + 1}. ` : '• ';
        const text = sanitizeForPdf(bullet + item.textContent);
        addText(doc, text, PDF_CONFIG.fontSize.list, false, false, state);
    });
    
    addSpacing(doc, PDF_CONFIG.spacing.afterList, state);
}

/**
 * Renders a blockquote element to the PDF.
 */
function renderBlockquote(doc, element, state) {
    doc.setTextColor(...PDF_CONFIG.colors.blockquote);
    const text = sanitizeForPdf(element.textContent);
    addText(doc, '| ' + text, PDF_CONFIG.fontSize.blockquote, false, true, state);
    doc.setTextColor(...PDF_CONFIG.colors.text);
    addSpacing(doc, PDF_CONFIG.spacing.afterBlockquote, state);
}

/**
 * Renders a code block element to the PDF.
 */
function renderCodeBlock(doc, element, state) {
    doc.setFont('courier', 'normal');
    const text = sanitizeForPdf(element.textContent);
    const lines = text.split('\n');
    
    lines.forEach(line => {
        addText(doc, line || ' ', PDF_CONFIG.fontSize.code, false, false, state);
    });
    
    doc.setFont('helvetica', 'normal');
    addSpacing(doc, PDF_CONFIG.spacing.afterCode, state);
}

/**
 * Renders a horizontal rule to the PDF.
 */
function renderHorizontalRule(doc, state) {
    if (state.yPosition + 5 > state.pageHeight - state.margin) {
        doc.addPage();
        state.yPosition = state.margin;
    }
    
    doc.setDrawColor(...PDF_CONFIG.colors.tableBorder);
    doc.setLineWidth(0.5);
    doc.line(state.margin, state.yPosition, state.pageWidth - state.margin, state.yPosition);
    
    addSpacing(doc, PDF_CONFIG.spacing.afterHr, state);
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Main function to export the markdown preview to PDF.
 * This is the entry point that should be called from main.js.
 * 
 * @param {HTMLElement} previewElement - The preview container element
 * @param {string} filename - The desired PDF filename (default: 'markdown-export.pdf')
 * @returns {Promise<void>}
 */
async function exportToPDF(previewElement, filename = 'markdown-export.pdf') {
    // Wait for jsPDF to be available
    let attempts = 0;
    while (!window.jspdf && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.jspdf) {
        throw new Error('jsPDF library is not loaded');
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF(PDF_CONFIG.orientation, PDF_CONFIG.unit, PDF_CONFIG.format);
    
    // Initialize state
    const state = {
        yPosition: PDF_CONFIG.margin,
        margin: PDF_CONFIG.margin,
        pageWidth: doc.internal.pageSize.getWidth(),
        pageHeight: doc.internal.pageSize.getHeight(),
        maxWidth: doc.internal.pageSize.getWidth() - (PDF_CONFIG.margin * 2)
    };
    
    // Process all elements in the preview
    const elements = previewElement.children;
    
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const tagName = element.tagName.toLowerCase();
        
        try {
            if (tagName === 'h1') {
                renderHeading(doc, element, 1, state);
            } else if (tagName === 'h2') {
                renderHeading(doc, element, 2, state);
            } else if (tagName === 'h3') {
                renderHeading(doc, element, 3, state);
            } else if (tagName === 'h4') {
                renderHeading(doc, element, 4, state);
            } else if (tagName === 'h5') {
                renderHeading(doc, element, 5, state);
            } else if (tagName === 'h6') {
                renderHeading(doc, element, 6, state);
            } else if (tagName === 'p') {
                renderParagraph(doc, element, state);
            } else if (tagName === 'ul' || tagName === 'ol') {
                renderList(doc, element, state);
            } else if (tagName === 'blockquote') {
                renderBlockquote(doc, element, state);
            } else if (tagName === 'pre') {
                renderCodeBlock(doc, element, state);
            } else if (tagName === 'table') {
                renderTable(doc, element, state);
            } else if (tagName === 'hr') {
                renderHorizontalRule(doc, state);
            }
        } catch (error) {
            console.error(`Error rendering ${tagName}:`, error);
            // Continue with next element
        }
    }
    
    // Save the PDF
    doc.save(filename);
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { exportToPDF, PDF_CONFIG, sanitizeForPdf };
} else {
    window.PDFStyler = { exportToPDF, PDF_CONFIG, sanitizeForPdf };
}
