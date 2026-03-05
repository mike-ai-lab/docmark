/**
 * Client-Side PDF Text Extractor
 * Uses PDF.js in the browser to extract text from PDFs
 */

import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for PDF.js - use local worker from node_modules
const pdfjsVersion = '4.10.38'; // Match package.json version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

class ClientPDFExtractor {
  /**
   * Extract text from PDF file
   * @param {File} file - PDF file from input
   * @returns {Promise<{markdown: string, metadata: Object}>}
   */
  async extractFromPDF(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      console.log('📄 PDF loaded:', pdf.numPages, 'pages');
      
      let markdown = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Group text items into lines
        const lines = this._groupIntoLines(textContent.items);
        
        // Convert lines to markdown with basic structure detection
        lines.forEach(line => {
          if (line.trim()) {
            // Basic heading detection (all caps or short lines)
            if (line.length < 60 && line === line.toUpperCase() && line.length > 3) {
              markdown += '## ' + line + '\n\n';
            } else if (line.match(/^\d+\.\s/)) {
              // Numbered list
              markdown += line + '\n';
            } else if (line.match(/^[•\-\*]\s/)) {
              // Bullet list
              markdown += line + '\n';
            } else {
              // Regular paragraph
              markdown += line + '\n\n';
            }
          }
        });
        
        // Add page separator if multiple pages
        if (pageNum < pdf.numPages) {
          markdown += '\n---\n\n';
        }
      }
      
      return {
        markdown: markdown.trim(),
        metadata: {
          pageCount: pdf.numPages,
          valid: true
        }
      };
      
    } catch (error) {
      console.error('PDF extraction failed:', error);
      throw new Error(`Failed to extract PDF: ${error.message}`);
    }
  }
  
  /**
   * Group text items into lines
   */
  _groupIntoLines(items) {
    const lines = [];
    let currentLine = '';
    let lastY = -1;
    
    items.forEach(item => {
      const y = item.transform[5];
      
      // New line if Y position changed significantly
      if (lastY !== -1 && Math.abs(y - lastY) > 5) {
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }
        currentLine = item.str;
      } else {
        // Same line - add space if needed
        if (currentLine && !currentLine.endsWith(' ') && !item.str.startsWith(' ')) {
          currentLine += ' ';
        }
        currentLine += item.str;
      }
      
      lastY = y;
    });
    
    // Add last line
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
    
    return lines;
  }
}

export default ClientPDFExtractor;
