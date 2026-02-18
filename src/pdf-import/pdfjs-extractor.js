/**
 * PDF.js Text Extractor
 * Uses Mozilla's PDF.js to extract text with positions and font information
 */

const pdfjsLib = require('pdfjs-dist');
const fs = require('fs').promises;

class PDFJSExtractor {
  constructor() {
    // No worker needed for Node.js
  }

  /**
   * Extract text from PDF with structure information
   * @param {string} pdfPath - Path to PDF file
   * @returns {Promise<{pages: Array, metadata: Object}>}
   */
  async extractFromPDF(pdfPath) {
    try {
      // Read PDF file
      const data = await fs.readFile(pdfPath);
      
      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(data),
        useSystemFonts: true
      });
      
      const pdf = await loadingTask.promise;
      
      console.log('📄 PDF loaded:', pdf.numPages, 'pages');
      
      // Extract metadata
      const metadata = await pdf.getMetadata();
      
      // Extract text from all pages
      const pages = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const pageData = await this._extractPageContent(page, pageNum);
        pages.push(pageData);
      }
      
      return {
        pages: pages,
        metadata: {
          title: metadata.info?.Title || 'Untitled',
          author: metadata.info?.Author || '',
          subject: metadata.info?.Subject || '',
          pageCount: pdf.numPages,
          producer: metadata.info?.Producer || '',
          creationDate: metadata.info?.CreationDate || ''
        }
      };
      
    } catch (error) {
      throw new Error(`PDF.js extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract content from a single page
   */
  async _extractPageContent(page, pageNum) {
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });
    
    // Group text items by position to detect structure
    const items = textContent.items.map(item => ({
      text: item.str,
      x: item.transform[4],
      y: viewport.height - item.transform[5], // Flip Y coordinate
      width: item.width,
      height: item.height,
      fontName: item.fontName,
      fontSize: Math.round(item.transform[0]), // Font size from transform matrix
      hasEOL: item.hasEOL // End of line marker
    }));
    
    // Sort by Y position (top to bottom), then X position (left to right)
    items.sort((a, b) => {
      const yDiff = a.y - b.y;
      if (Math.abs(yDiff) > 5) return yDiff;
      return a.x - b.x;
    });
    
    // Group items into lines
    const lines = this._groupIntoLines(items);
    
    // Detect structure (headings, paragraphs, lists)
    const structuredContent = this._detectStructure(lines);
    
    return {
      pageNum: pageNum,
      width: viewport.width,
      height: viewport.height,
      items: items,
      lines: lines,
      content: structuredContent
    };
  }

  /**
   * Group text items into lines
   */
  _groupIntoLines(items) {
    const lines = [];
    let currentLine = [];
    let lastY = -1;
    
    items.forEach(item => {
      if (lastY === -1 || Math.abs(item.y - lastY) < 5) {
        // Same line (within 5 pixels vertically)
        currentLine.push(item);
      } else {
        // New line
        if (currentLine.length > 0) {
          lines.push(this._mergeLine(currentLine));
        }
        currentLine = [item];
      }
      lastY = item.y;
    });
    
    if (currentLine.length > 0) {
      lines.push(this._mergeLine(currentLine));
    }
    
    return lines;
  }

  /**
   * Merge items in a line into a single text string
   */
  _mergeLine(items) {
    const text = items.map(item => item.text).join(' ').trim();
    const avgFontSize = items.reduce((sum, item) => sum + item.fontSize, 0) / items.length;
    const maxFontSize = Math.max(...items.map(item => item.fontSize));
    const minX = Math.min(...items.map(item => item.x));
    const y = items[0].y;
    
    return {
      text: text,
      y: y,
      x: minX,
      fontSize: avgFontSize,
      maxFontSize: maxFontSize,
      items: items
    };
  }

  /**
   * Detect document structure (headings, paragraphs, lists, tables)
   */
  _detectStructure(lines) {
    const content = [];
    
    // Calculate average font size for the document
    const avgFontSize = lines.reduce((sum, line) => sum + line.fontSize, 0) / lines.length;
    
    // First pass: detect table regions
    const tableRegions = this._detectTableRegions(lines);
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const text = line.text.trim();
      
      if (text.length === 0) {
        i++;
        continue;
      }
      
      // Check if this line is part of a table
      const tableRegion = tableRegions.find(region => 
        i >= region.startIndex && i <= region.endIndex
      );
      
      if (tableRegion && i === tableRegion.startIndex) {
        // Process entire table
        content.push({
          type: 'table',
          rows: tableRegion.rows
        });
        i = tableRegion.endIndex + 1;
        continue;
      } else if (tableRegion) {
        // Skip lines that are part of a table (already processed)
        i++;
        continue;
      }
      
      // Detect heading by font size
      const isLargeFont = line.maxFontSize > avgFontSize * 1.3;
      const isMediumFont = line.maxFontSize > avgFontSize * 1.1;
      
      // Detect heading by characteristics
      const isShort = text.length < 100;
      const isAllCaps = text === text.toUpperCase() && text.length > 3;
      const hasNoEndPunctuation = !/[.!?]$/.test(text);
      
      // Detect list items
      const isBulletList = /^[•\-\*]\s/.test(text);
      const isNumberedList = /^\d+[\.\)]\s/.test(text);
      
      let type = 'paragraph';
      let level = 0;
      
      if (isBulletList || isNumberedList) {
        type = 'list-item';
        content.push({
          type: type,
          text: text.replace(/^[•\-\*\d+\.\)]\s*/, ''),
          ordered: isNumberedList,
          fontSize: line.fontSize
        });
      } else if (isLargeFont || (isAllCaps && isShort)) {
        // Large font or all caps short text = heading
        type = 'heading';
        level = isLargeFont ? (line.maxFontSize > avgFontSize * 1.5 ? 1 : 2) : 3;
        content.push({
          type: type,
          level: level,
          text: text,
          fontSize: line.fontSize
        });
      } else if (isMediumFont && isShort && hasNoEndPunctuation) {
        // Medium font, short, no punctuation = subheading
        type = 'heading';
        level = 3;
        content.push({
          type: type,
          level: level,
          text: text,
          fontSize: line.fontSize
        });
      } else {
        // Regular paragraph
        content.push({
          type: 'paragraph',
          text: text,
          fontSize: line.fontSize
        });
      }
      
      i++;
    }
    
    return content;
  }

  /**
   * Detect table regions in the document
   * Tables are detected by:
   * - Multiple items on same Y coordinate (columns)
   * - Consistent X positions across multiple lines (column alignment)
   * - Similar spacing patterns
   */
  _detectTableRegions(lines) {
    const regions = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Check if this line has multiple columns
      if (line.items.length >= 2) {
        const tableCandidate = this._analyzeTableCandidate(lines, i);
        
        if (tableCandidate && tableCandidate.rows.length >= 2) {
          regions.push(tableCandidate);
          i = tableCandidate.endIndex + 1;
          continue;
        }
      }
      
      i++;
    }
    
    return regions;
  }

  /**
   * Analyze if lines starting at index form a table
   */
  _analyzeTableCandidate(lines, startIndex) {
    const firstLine = lines[startIndex];
    
    // Use clustering to find actual column positions across multiple rows
    const allItems = [];
    let currentIndex = startIndex;
    let rowCount = 0;
    
    // Collect items from first few rows to determine column structure
    while (currentIndex < lines.length && rowCount < 5) {
      const line = lines[currentIndex];
      if (line.items.length >= 2) {
        allItems.push(...line.items);
        rowCount++;
      } else {
        break;
      }
      currentIndex++;
    }
    
    // Cluster items by X position to find columns
    const columnPositions = this._clusterColumnPositions(allItems);
    
    const rows = [];
    currentIndex = startIndex;
    let consecutiveNonMatches = 0;
    
    // Try to find rows with similar column structure
    while (currentIndex < lines.length && consecutiveNonMatches < 2) {
      const line = lines[currentIndex];
      
      // Check if this line has items at similar X positions
      const matches = this._matchesColumnStructure(line.items, columnPositions);
      
      if (matches) {
        // Extract cells for this row
        const cells = this._extractTableCells(line.items, columnPositions);
        rows.push(cells);
        consecutiveNonMatches = 0;
      } else {
        consecutiveNonMatches++;
      }
      
      currentIndex++;
      
      // Stop if we have enough rows
      if (rows.length >= 10) break;
    }
    
    // Valid table needs at least 2 rows
    if (rows.length < 2) return null;
    
    return {
      startIndex: startIndex,
      endIndex: startIndex + rows.length - 1,
      rows: rows,
      columnCount: columnPositions.length
    };
  }

  /**
   * Cluster items by X position to find column positions
   */
  _clusterColumnPositions(items) {
    if (items.length === 0) return [];
    
    // Sort items by X position first
    const sortedItems = [...items].sort((a, b) => a.x - b.x);
    
    const clusters = [];
    const minColumnWidth = 30; // Minimum pixels between columns
    
    sortedItems.forEach(item => {
      // Find if this item belongs to an existing cluster
      let foundCluster = false;
      
      for (let cluster of clusters) {
        const avgX = cluster.items.reduce((sum, i) => sum + i.x, 0) / cluster.items.length;
        const distance = Math.abs(item.x - avgX);
        
        // Items within minColumnWidth belong to same column
        if (distance < minColumnWidth) {
          cluster.items.push(item);
          foundCluster = true;
          break;
        }
      }
      
      if (!foundCluster) {
        clusters.push({
          items: [item]
        });
      }
    });
    
    // Calculate average X position for each cluster
    const positions = clusters.map(cluster => {
      return cluster.items.reduce((sum, i) => sum + i.x, 0) / cluster.items.length;
    });
    
    // Sort positions
    positions.sort((a, b) => a - b);
    
    return positions;
  }

  /**
   * Check if items match expected column positions
   */
  _matchesColumnStructure(items, columnPositions) {
    if (items.length < 1) return false;
    
    // Check if at least 40% of items are near expected column positions
    // OR if we have at least 2 items matching
    let matches = 0;
    const tolerance = 40; // Increased tolerance
    
    items.forEach(item => {
      const nearColumn = columnPositions.some(colX => 
        Math.abs(item.x - colX) < tolerance
      );
      if (nearColumn) matches++;
    });
    
    const matchRatio = matches / columnPositions.length;
    const hasMinMatches = matches >= Math.min(2, columnPositions.length);
    
    return matchRatio >= 0.4 || hasMinMatches;
  }

  /**
   * Extract table cells from items based on column positions
   */
  _extractTableCells(items, columnPositions) {
    const cells = [];
    const tolerance = 50; // Increased tolerance for better grouping
    
    // Sort items by X position
    const sortedItems = [...items].sort((a, b) => a.x - b.x);
    
    // Group items by column - use clustering approach
    const clusters = [];
    sortedItems.forEach(item => {
      // Find closest cluster
      let closestCluster = null;
      let minDistance = Infinity;
      
      clusters.forEach(cluster => {
        const distance = Math.abs(item.x - cluster.x);
        if (distance < minDistance && distance < tolerance) {
          minDistance = distance;
          closestCluster = cluster;
        }
      });
      
      if (closestCluster) {
        closestCluster.items.push(item);
      } else {
        clusters.push({
          x: item.x,
          items: [item]
        });
      }
    });
    
    // Sort clusters by X position
    clusters.sort((a, b) => a.x - b.x);
    
    // Extract text from each cluster
    clusters.forEach(cluster => {
      const cellText = cluster.items.map(item => item.text).join(' ').trim();
      cells.push(cellText || ' ');
    });
    
    // Pad to match expected column count
    while (cells.length < columnPositions.length) {
      cells.push(' ');
    }
    
    return cells;
  }

  /**
   * Old structure detection (kept for reference, now replaced by above)
   */
  _detectStructureOld(lines) {
    const content = [];
    
    lines.forEach(line => {
      const text = line.text.trim();
      if (text.length === 0) return;
      
      // Detect heading by font size
      const isLargeFont = line.maxFontSize > avgFontSize * 1.3;
      const isMediumFont = line.maxFontSize > avgFontSize * 1.1;
      
      // Detect heading by characteristics
      const isShort = text.length < 100;
      const isAllCaps = text === text.toUpperCase() && text.length > 3;
      const hasNoEndPunctuation = !/[.!?]$/.test(text);
      
      // Detect list items
      const isBulletList = /^[•\-\*]\s/.test(text);
      const isNumberedList = /^\d+[\.\)]\s/.test(text);
      
      let type = 'paragraph';
      let level = 0;
      
      if (isBulletList || isNumberedList) {
        type = 'list-item';
        content.push({
          type: type,
          text: text.replace(/^[•\-\*\d+\.\)]\s*/, ''),
          ordered: isNumberedList,
          fontSize: line.fontSize
        });
      } else if (isLargeFont || (isAllCaps && isShort)) {
        // Large font or all caps short text = heading
        type = 'heading';
        level = isLargeFont ? (line.maxFontSize > avgFontSize * 1.5 ? 1 : 2) : 3;
        content.push({
          type: type,
          level: level,
          text: text,
          fontSize: line.fontSize
        });
      } else if (isMediumFont && isShort && hasNoEndPunctuation) {
        // Medium font, short, no punctuation = subheading
        type = 'heading';
        level = 3;
        content.push({
          type: type,
          level: level,
          text: text,
          fontSize: line.fontSize
        });
      } else {
        // Regular paragraph
        content.push({
          type: 'paragraph',
          text: text,
          fontSize: line.fontSize
        });
      }
    });
    
    return content;
  }

  /**
   * Build HTML from structured content
   */
  buildHTML(pages) {
    let html = '<div class="pdf-document">\n';
    
    pages.forEach((page, index) => {
      if (pages.length > 1) {
        html += `<div class="pdf-page" data-page="${page.pageNum}">\n`;
      }
      
      page.content.forEach((item, idx) => {
        switch (item.type) {
          case 'heading':
            html += `<h${item.level}>${this._escapeHTML(item.text)}</h${item.level}>\n`;
            break;
          case 'paragraph':
            html += `<p>${this._escapeHTML(item.text)}</p>\n`;
            break;
          case 'list-item':
            html += `<li>${this._escapeHTML(item.text)}</li>\n`;
            break;
          case 'table':
            html += this._buildTableHTML(item.rows);
            break;
        }
      });
      
      if (pages.length > 1) {
        html += '</div>\n';
      }
    });
    
    html += '</div>';
    return html;
  }

  /**
   * Build HTML table from rows
   */
  _buildTableHTML(rows) {
    if (!rows || rows.length === 0) return '';
    
    let html = '<table>\n';
    
    // First row is header
    html += '<thead>\n<tr>\n';
    rows[0].forEach(cell => {
      html += `<th>${this._escapeHTML(cell)}</th>\n`;
    });
    html += '</tr>\n</thead>\n';
    
    // Rest are data rows
    if (rows.length > 1) {
      html += '<tbody>\n';
      for (let i = 1; i < rows.length; i++) {
        html += '<tr>\n';
        rows[i].forEach(cell => {
          html += `<td>${this._escapeHTML(cell)}</td>\n`;
        });
        html += '</tr>\n';
      }
      html += '</tbody>\n';
    }
    
    html += '</table>\n';
    return html;
  }

  _escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

module.exports = PDFJSExtractor;
