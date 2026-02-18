/**
 * Semantic HTML → Markdown Converter
 * Deterministic conversion with overrides for tables, images, headings, lists
 */

const { JSDOM } = require('jsdom');

class MarkdownConverter {
  constructor() {
    this.imageMap = new Map();
  }

  /**
   * Convert semantic HTML to Markdown
   * @param {string} html - Clean semantic HTML
   * @param {Array} images - Array of image objects with paths
   * @returns {string} - Markdown content
   */
  convert(html, images = []) {
    // Build image map for reference
    images.forEach(img => {
      this.imageMap.set(img.id, img);
    });

    const dom = new JSDOM(html);
    const body = dom.window.document.body;
    
    let markdown = '';
    
    // Process each child element
    Array.from(body.children).forEach((child, index) => {
      markdown += this._processElement(child, 0);
    });

    // Post-process: normalize blank lines
    markdown = this._normalizeBlankLines(markdown);
    
    // Validate heading hierarchy
    markdown = this._fixHeadingHierarchy(markdown);
    
    return markdown.trim();
  }

  /**
   * Process individual element
   */
  _processElement(element, depth) {
    if (!element) return '';

    const tagName = element.tagName.toLowerCase();
    let result = '';

    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        result = this._convertHeading(element);
        break;
      
      case 'p':
        result = this._convertParagraph(element);
        break;
      
      case 'ul':
      case 'ol':
        result = this._convertList(element, depth);
        break;
      
      case 'table':
        result = this._convertTable(element);
        break;
      
      case 'img':
      case 'canvas':
        result = this._convertImage(element);
        break;
      
      case 'blockquote':
        result = this._convertBlockquote(element);
        break;
      
      case 'pre':
      case 'code':
        result = this._convertCode(element);
        break;
      
      case 'hr':
        result = '\n---\n\n';
        break;
      
      case 'div':
        // Process children
        Array.from(element.children).forEach(child => {
          result += this._processElement(child, depth);
        });
        break;
      
      default:
        // Process children for unknown elements
        Array.from(element.children).forEach(child => {
          result += this._processElement(child, depth);
        });
    }

    return result;
  }

  /**
   * Convert heading
   */
  _convertHeading(element) {
    const level = parseInt(element.tagName[1]);
    const text = this._getTextContent(element);
    return `${'#'.repeat(level)} ${text}\n\n`;
  }

  /**
   * Convert paragraph
   */
  _convertParagraph(element) {
    // Check if paragraph contains block-level elements (invalid HTML that JSDOM might create)
    const blockElements = element.querySelectorAll('table, div, ul, ol, h1, h2, h3, h4, h5, h6');
    
    if (blockElements.length > 0) {
      // Process block elements separately
      let result = '';
      Array.from(element.childNodes).forEach(node => {
        if (node.nodeType === 1) { // Element node
          result += this._processElement(node, 0);
        } else if (node.nodeType === 3 && node.textContent.trim()) { // Text node
          result += node.textContent.trim() + '\n\n';
        }
      });
      return result;
    }
    
    const formatted = this._getInlineFormatting(element);
    if (!formatted.trim()) return '';
    
    return `${formatted}\n\n`;
  }

  /**
   * Convert list
   */
  _convertList(element, depth) {
    const isOrdered = element.tagName.toLowerCase() === 'ol';
    let result = '';
    let index = 1;

    Array.from(element.children).forEach(li => {
      if (li.tagName.toLowerCase() === 'li') {
        const indent = '  '.repeat(depth);
        const marker = isOrdered ? `${index}.` : '-';
        const text = this._getTextContent(li);
        
        result += `${indent}${marker} ${text}\n`;
        index++;

        // Handle nested lists
        const nestedList = li.querySelector('ul, ol');
        if (nestedList) {
          result += this._convertList(nestedList, depth + 1);
        }
      }
    });

    return result + '\n';
  }

  /**
   * Convert table to Markdown table
   */
  _convertTable(element) {
    const rows = Array.from(element.querySelectorAll('tr'));
    if (rows.length === 0) return '';

    let markdown = '\n';
    
    // Determine number of columns from first row
    const firstRow = rows[0];
    const firstCells = Array.from(firstRow.querySelectorAll('th, td'));
    const numColumns = firstCells.length;
    
    // Process header row (first row is always header)
    const headerTexts = firstCells.map(h => this._getInlineFormatting(h).trim() || ' ');
    
    markdown += '| ' + headerTexts.join(' | ') + ' |\n';
    
    // Add alignment row with left alignment
    markdown += '| ' + headerTexts.map(() => ':---').join(' | ') + ' |\n';
    
    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].querySelectorAll('td, th'));
      
      // Ensure we have the right number of columns
      const cellTexts = [];
      for (let j = 0; j < numColumns; j++) {
        if (cells[j]) {
          cellTexts.push(this._getInlineFormatting(cells[j]).trim() || ' ');
        } else {
          cellTexts.push(' ');
        }
      }
      
      markdown += '| ' + cellTexts.join(' | ') + ' |\n';
    }
    
    return markdown + '\n';
  }

  /**
   * Get text content with inline formatting (bold, italic, links)
   */
  _getInlineFormatting(element) {
    let result = '';
    
    // Process child nodes to preserve formatting
    element.childNodes.forEach(node => {
      if (node.nodeType === 3) { // Text node
        result += node.textContent;
      } else if (node.nodeType === 1) { // Element node
        const tag = node.tagName.toLowerCase();
        const text = node.textContent;
        
        switch (tag) {
          case 'strong':
          case 'b':
            result += `**${text}**`;
            break;
          case 'em':
          case 'i':
            result += `*${text}*`;
            break;
          case 'a':
            const href = node.getAttribute('href') || '';
            result += `[${text}](${href})`;
            break;
          case 'code':
            result += `\`${text}\``;
            break;
          default:
            result += text;
        }
      }
    });
    
    return result;
  }

  /**
   * Convert image
   */
  _convertImage(element) {
    const id = element.getAttribute('data-image-id') || 
               element.getAttribute('id') || 
               `img_${Date.now()}`;
    
    const alt = element.getAttribute('alt') || 'Image';
    
    // Check if we have this image in our map
    const imageData = this.imageMap.get(id);
    const imagePath = imageData ? imageData.filename : id;
    
    return `![${alt}](${imagePath})\n\n`;
  }

  /**
   * Convert blockquote
   */
  _convertBlockquote(element) {
    const text = this._getTextContent(element);
    const lines = text.split('\n');
    return lines.map(line => `> ${line}`).join('\n') + '\n\n';
  }

  /**
   * Convert code block
   */
  _convertCode(element) {
    const text = element.textContent;
    const language = element.getAttribute('data-language') || '';
    
    if (element.tagName.toLowerCase() === 'pre') {
      return `\`\`\`${language}\n${text}\n\`\`\`\n\n`;
    } else {
      return `\`${text}\``;
    }
  }

  /**
   * Get text content with inline formatting preserved
   */
  _getTextContent(element) {
    return element.textContent.trim();
  }

  /**
   * Normalize blank lines (max 2 consecutive)
   */
  _normalizeBlankLines(markdown) {
    return markdown.replace(/\n{3,}/g, '\n\n');
  }

  /**
   * Fix heading hierarchy (no jumps from H1 to H3)
   */
  _fixHeadingHierarchy(markdown) {
    const lines = markdown.split('\n');
    let lastLevel = 0;
    
    const fixed = lines.map(line => {
      const match = line.match(/^(#{1,6})\s/);
      if (match) {
        const currentLevel = match[1].length;
        
        // If jump is too large, reduce it
        if (currentLevel > lastLevel + 1 && lastLevel > 0) {
          const newLevel = lastLevel + 1;
          lastLevel = newLevel;
          return '#'.repeat(newLevel) + line.substring(currentLevel);
        }
        
        lastLevel = currentLevel;
      }
      return line;
    });
    
    return fixed.join('\n');
  }
}

module.exports = MarkdownConverter;
