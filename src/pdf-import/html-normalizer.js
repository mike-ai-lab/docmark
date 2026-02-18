/**
 * HTML Normalizer
 * Converts messy PDF HTML → clean semantic HTML
 */

const { JSDOM } = require('jsdom');

class HTMLNormalizer {
  constructor() {
    this.headerFooterPatterns = [];
  }

  /**
   * Normalize raw PDF HTML into semantic HTML
   * @param {string} rawHTML - Raw HTML from PDF
   * @returns {string} - Clean semantic HTML
   */
  normalize(rawHTML) {
    console.log('🔧 Starting HTML normalization...');
    console.log(`   Input HTML length: ${rawHTML.length}`);
    
    const dom = new JSDOM(rawHTML);
    const document = dom.window.document;
    const body = document.body;

    console.log(`   Initial tables: ${body.querySelectorAll('table').length}`);

    // Step 1: Remove inline styles and transforms
    this._stripStyles(body);
    console.log(`   After stripStyles - tables: ${body.querySelectorAll('table').length}`);

    // Step 2: Detect and remove headers/footers
    this._detectHeadersFooters(body);
    this._removeHeadersFooters(body);
    console.log(`   After removeHeaders - tables: ${body.querySelectorAll('table').length}`);

    // Step 3: Convert div/span soup to semantic tags
    this._convertToSemantic(body);
    console.log(`   After convertToSemantic - tables: ${body.querySelectorAll('table').length}`);

    // Step 4: Merge fragmented text nodes
    this._mergeTextNodes(body);
    console.log(`   After mergeTextNodes - tables: ${body.querySelectorAll('table').length}`);

    // Step 5: Detect and convert tables
    this._detectTables(body);
    console.log(`   After detectTables - tables: ${body.querySelectorAll('table').length}`);

    // Step 6: Linearize multi-column layouts
    this._linearizeColumns(body);
    console.log(`   After linearizeColumns - tables: ${body.querySelectorAll('table').length}`);

    // Step 7: Normalize whitespace
    this._normalizeWhitespace(body);
    console.log(`   After normalizeWhitespace - tables: ${body.querySelectorAll('table').length}`);

    // Step 8: Clean up empty elements
    this._removeEmptyElements(body);
    console.log(`   After removeEmptyElements - tables: ${body.querySelectorAll('table').length}`);

    console.log(`✅ Normalization complete - Output HTML length: ${body.innerHTML.length}`);
    
    return body.innerHTML;
  }

  /**
   * Strip inline styles, transforms, absolute positioning
   */
  _stripStyles(element) {
    const allElements = element.querySelectorAll('*');
    
    allElements.forEach(el => {
      // Remove style attribute
      el.removeAttribute('style');
      
      // Remove positioning classes
      const classes = el.className.split(' ').filter(c => 
        !c.includes('absolute') && 
        !c.includes('fixed') && 
        !c.includes('transform')
      );
      el.className = classes.join(' ');
    });
  }

  /**
   * Detect repeated headers/footers across pages
   */
  _detectHeadersFooters(body) {
    const pages = body.querySelectorAll('.pdf-page');
    if (pages.length < 2) return;

    const firstElements = [];
    const lastElements = [];

    pages.forEach(page => {
      const children = Array.from(page.children);
      if (children.length > 0) {
        firstElements.push(children[0].textContent.trim());
        lastElements.push(children[children.length - 1].textContent.trim());
      }
    });

    // Find repeated patterns
    const headerPattern = this._findRepeatedPattern(firstElements);
    const footerPattern = this._findRepeatedPattern(lastElements);

    if (headerPattern) this.headerFooterPatterns.push({ type: 'header', text: headerPattern });
    if (footerPattern) this.headerFooterPatterns.push({ type: 'footer', text: footerPattern });
  }

  _findRepeatedPattern(texts) {
    if (texts.length < 2) return null;
    
    const first = texts[0];
    const allMatch = texts.every(t => t === first || t.includes(first.substring(0, 20)));
    
    return allMatch ? first : null;
  }

  /**
   * Remove detected headers/footers
   */
  _removeHeadersFooters(body) {
    if (this.headerFooterPatterns.length === 0) return;

    const pages = body.querySelectorAll('.pdf-page');
    
    pages.forEach(page => {
      const children = Array.from(page.children);
      
      this.headerFooterPatterns.forEach(pattern => {
        if (pattern.type === 'header' && children.length > 0) {
          const first = children[0];
          if (first.textContent.trim().includes(pattern.text.substring(0, 20))) {
            first.remove();
          }
        }
        if (pattern.type === 'footer' && children.length > 0) {
          const last = children[children.length - 1];
          if (last.textContent.trim().includes(pattern.text.substring(0, 20))) {
            last.remove();
          }
        }
      });
    });
  }

  /**
   * Convert div/span soup into semantic HTML
   * IMPORTANT: Skip elements inside tables!
   */
  _convertToSemantic(body) {
    const allElements = body.querySelectorAll('div, span');
    
    allElements.forEach(el => {
      // Skip if inside a table
      if (el.closest('table')) {
        return;
      }
      
      const text = el.textContent.trim();
      if (!text) return;

      // Detect headings (bold, larger font, short text)
      if (this._isHeading(el)) {
        const level = this._detectHeadingLevel(el);
        const heading = body.ownerDocument.createElement(`h${level}`);
        heading.textContent = text;
        el.replaceWith(heading);
        return;
      }

      // Detect lists
      if (this._isList(el)) {
        this._convertToList(el);
        return;
      }

      // Convert to paragraph if it contains substantial text
      if (text.length > 20 && el.tagName === 'DIV') {
        const p = body.ownerDocument.createElement('p');
        p.innerHTML = el.innerHTML;
        el.replaceWith(p);
      }
    });
  }

  _isHeading(element) {
    const text = element.textContent.trim();
    const style = element.getAttribute('data-font-size') || '';
    
    // Short text, bold, or larger font
    return (
      text.length < 100 &&
      text.length > 0 &&
      (element.querySelector('b, strong') || style.includes('bold') || parseInt(style) > 16)
    );
  }

  _detectHeadingLevel(element) {
    const text = element.textContent.trim();
    const fontSize = parseInt(element.getAttribute('data-font-size') || '12');
    
    if (fontSize >= 24) return 1;
    if (fontSize >= 20) return 2;
    if (fontSize >= 18) return 3;
    if (fontSize >= 16) return 4;
    if (text.length < 30) return 2;
    return 3;
  }

  _isList(element) {
    const text = element.textContent.trim();
    return /^[\-\*\•]\s/.test(text) || /^\d+[\.\)]\s/.test(text);
  }

  _convertToList(element) {
    const text = element.textContent.trim();
    const isOrdered = /^\d+[\.\)]/.test(text);
    
    const listItem = element.ownerDocument.createElement('li');
    listItem.textContent = text.replace(/^[\-\*\•\d+\.\)]\s*/, '');
    
    const list = element.ownerDocument.createElement(isOrdered ? 'ol' : 'ul');
    list.appendChild(listItem);
    
    element.replaceWith(list);
  }

  /**
   * Merge fragmented text nodes
   */
  _mergeTextNodes(body) {
    const paragraphs = body.querySelectorAll('p');
    
    paragraphs.forEach(p => {
      const spans = p.querySelectorAll('span');
      if (spans.length > 1) {
        const mergedText = Array.from(spans).map(s => s.textContent).join(' ');
        p.textContent = mergedText;
      }
    });
  }

  /**
   * Detect and preserve tables
   */
  _detectTables(body) {
    // Tables are usually already <table> elements from PDF
    // Just ensure they're properly structured
    const tables = body.querySelectorAll('table');
    
    tables.forEach(table => {
      // Ensure thead/tbody structure
      if (!table.querySelector('thead') && table.querySelector('tr')) {
        const firstRow = table.querySelector('tr');
        const thead = body.ownerDocument.createElement('thead');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
      }
    });
    
    // Also detect table-like structures from list items
    // Look for patterns like "Column1 | Column2" or "Item: Value"
    const listItems = body.querySelectorAll('li');
    const tablePatterns = [];
    
    listItems.forEach(li => {
      const text = li.textContent;
      // Check if it looks like a table row (has pipes or colons)
      if (text.includes('|') || /\w+:\s*\w+/.test(text)) {
        tablePatterns.push(li);
      }
    });
    
    // If we found table-like patterns, group them
    if (tablePatterns.length > 2) {
      // Convert to actual table
      const table = body.ownerDocument.createElement('table');
      const tbody = body.ownerDocument.createElement('tbody');
      
      tablePatterns.forEach(li => {
        const tr = body.ownerDocument.createElement('tr');
        const cells = li.textContent.split(/\||:/).map(c => c.trim());
        
        cells.forEach(cell => {
          const td = body.ownerDocument.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
        li.remove();
      });
      
      table.appendChild(tbody);
      if (tablePatterns[0].parentNode) {
        tablePatterns[0].parentNode.appendChild(table);
      }
    }
  }

  /**
   * Linearize multi-column layouts
   */
  _linearizeColumns(body) {
    // Detect side-by-side divs and linearize them
    const pages = body.querySelectorAll('.pdf-page');
    
    pages.forEach(page => {
      const children = Array.from(page.children);
      
      // Simple heuristic: if multiple divs at same level, linearize
      children.forEach(child => {
        if (child.children.length > 1) {
          const subChildren = Array.from(child.children);
          subChildren.forEach(sub => {
            page.appendChild(sub);
          });
          child.remove();
        }
      });
    });
  }

  /**
   * Normalize whitespace
   */
  _normalizeWhitespace(body) {
    const textNodes = this._getTextNodes(body);
    
    textNodes.forEach(node => {
      node.textContent = node.textContent.replace(/\s+/g, ' ').trim();
    });
  }

  _getTextNodes(element) {
    const textNodes = [];
    const walker = element.ownerDocument.createTreeWalker(
      element,
      4, // NodeFilter.SHOW_TEXT
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        textNodes.push(node);
      }
    }
    
    return textNodes;
  }

  /**
   * Remove empty elements
   */
  _removeEmptyElements(body) {
    const allElements = body.querySelectorAll('*');
    
    allElements.forEach(el => {
      if (!el.textContent.trim() && !el.querySelector('img, canvas, table')) {
        el.remove();
      }
    });
  }
}

module.exports = HTMLNormalizer;
