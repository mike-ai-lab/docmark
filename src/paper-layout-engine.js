/**
 * CLEAN PAPER LAYOUT & BIDIRECTIONAL SYNC ENGINE
 * 
 * A deterministic, race-condition-free implementation of:
 * - Paper (paginated) layout rendering
 * - Bidirectional editor ↔ preview synchronization
 * - Contenteditable preview with real-time editor updates
 * 
 * Based on: bidirectional-edit-realtime.html mockup
 * 
 * Key Design Principles:
 * 1. Single writer: Only this module writes to preview DOM when paper layout is active
 * 2. Debounced pagination: Prevents thrashing during typing
 * 3. Idempotent handlers: Event listeners attached once, never duplicated
 * 4. Lock-based sync: Prevents circular updates between editor and preview
 */

export class PaperLayoutEngine {
    constructor(config = {}) {
        // Dependencies
        this.editor = config.editor;
        this.previewElement = config.previewElement;
        this.marked = config.marked;
        this.DOMPurify = config.DOMPurify;
        
        // Page dimensions (A4 at 96 DPI)
        this.PAGE_WIDTH = 794;  // 210mm
        this.PAGE_HEIGHT = 1123; // 297mm
        this.PAGE_MARGIN = 75;   // 20mm
        
        // State
        this.isActive = false;
        this.isRendering = false;
        this.isPaginationScheduled = false;
        this.lastPaginatedContent = '';
        
        // Sync locks
        this.isUpdatingFromPreview = false;
        this.isUpdatingFromEditor = false;
        this.userIsTyping = false;
        
        // Line mapping
        this.blockLineMap = new Map();
        this.lineBlockMap = new Map();
        
        // Debounce timers
        this.paginationTimer = null;
        this.typingTimer = null;
        this.PAGINATION_DEBOUNCE = 500;
        this.TYPING_TIMEOUT = 1000;
        
        // Event handlers (stored for cleanup)
        this.handlers = {
            editorChange: null,
            previewInput: null,
            previewClick: null
        };
    }
    
    /**
     * Activate paper layout mode
     */
    activate() {
        console.log('[PaperLayout] Activating paper layout mode');
        this.isActive = true;
        
        // Add paper layout class
        this.previewElement.classList.add('paper-layout-active');
        
        // Attach event handlers (idempotent)
        this.attachHandlers();
        
        // ALWAYS render immediately - no conditions
        if (this.editor && typeof this.editor.getValue === 'function') {
            // Use setTimeout to ensure DOM is ready
            setTimeout(() => {
                this.paginateNow();
            }, 10);
        } else {
            console.error('[PaperLayout] Editor not available');
        }
    }
    
    /**
     * Deactivate paper layout mode
     */
    deactivate() {
        console.log('[PaperLayout] Deactivating paper layout mode');
        this.isActive = false;
        
        // Remove paper layout class
        this.previewElement.classList.remove('paper-layout-active');
        
        // Detach event handlers
        this.detachHandlers();
        
        // Clear state
        this.lastPaginatedContent = '';
        this.blockLineMap.clear();
        this.lineBlockMap.clear();
        
        // Clear timers
        if (this.paginationTimer) {
            clearTimeout(this.paginationTimer);
            this.paginationTimer = null;
        }
    }
    
    /**
     * Render paper layout (main entry point)
     * Debounced to prevent thrashing
     */
    render() {
        if (!this.isActive) return;
        
        // Clear existing timer
        if (this.paginationTimer) {
            clearTimeout(this.paginationTimer);
        }
        
        // Schedule pagination
        this.paginationTimer = setTimeout(() => {
            this.paginateNow();
        }, this.PAGINATION_DEBOUNCE);
    }
    
    /**
     * Immediate pagination (internal)
     */
    paginateNow() {
        if (!this.isActive || this.isRendering) {
            console.log('[PaperLayout] Skipping pagination:', { isActive: this.isActive, isRendering: this.isRendering });
            return;
        }
        if (!this.editor || typeof this.editor.getValue !== 'function') {
            console.error('[PaperLayout] Editor not available or getValue not a function');
            return;
        }
        
        const content = this.editor.getValue();
        
        console.log('[PaperLayout] Paginating content...');
        this.isRendering = true;
        this.lastPaginatedContent = content;
        
        try {
            // Parse markdown to HTML
            const html = this.marked.parse(content);
            const sanitized = this.DOMPurify.sanitize(html);
            
            // Create temporary container
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = sanitized;
            
            // Build line map
            this.buildLineMap(tempDiv, content);
            
            // Paginate content
            const pages = this.paginateContent(tempDiv);
            
            // Render pages to DOM
            this.renderPages(pages);
            
            // Make content editable
            this.makeEditable();
            
            console.log(`[PaperLayout] Paginated into ${pages.length} pages`);
        } catch (error) {
            console.error('[PaperLayout] Pagination error:', error);
        } finally {
            this.isRendering = false;
        }
    }
    
    /**
     * Build line mapping between markdown source and HTML elements
     */
    buildLineMap(container, markdown) {
        this.blockLineMap.clear();
        this.lineBlockMap.clear();
        
        const lines = markdown.split('\n');
        const elements = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, table'));
        
        let currentLine = 0;
        
        elements.forEach(element => {
            const text = element.textContent.trim();
            if (!text || text.length < 3) return;
            
            // Search for matching line
            const searchText = text.substring(0, 30).toLowerCase().replace(/[^a-z0-9\s]/g, '');
            
            for (let i = currentLine; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const cleanLine = line.replace(/^#+\s*/, '')
                    .replace(/^[*+-]\s*/, '')
                    .replace(/^>\s*/, '')
                    .replace(/\*\*/g, '')
                    .replace(/[^a-z0-9\s]/g, '')
                    .toLowerCase();
                
                if (cleanLine.includes(searchText) || searchText.includes(cleanLine)) {
                    element.dataset.sourceLine = i + 1;
                    this.blockLineMap.set(element, i + 1);
                    this.lineBlockMap.set(i + 1, element);
                    currentLine = i + 1;
                    break;
                }
            }
        });
    }
    
    /**
     * Paginate content into pages - NEVER hide content, always show everything
     */
    paginateContent(container) {
        // Get ALL block-level elements that will render (including nested ones)
        const elements = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, pre, table, hr, div'));
        
        // Filter out nested list items and other duplicates
        const topLevelElements = elements.filter(el => {
            // Keep if parent is the container or another allowed block
            const parent = el.parentElement;
            return parent === container || parent.tagName === 'BLOCKQUOTE' || parent.tagName === 'DIV';
        });
        
        if (topLevelElements.length === 0) return [[]];
        
        const pages = [];
        let currentPage = [];
        let currentHeight = 0;
        
        // Get user-configured margins
        const settings = this.loadPdfSettings();
        const mmToPx = 3.78;
        const topMargin = settings.margins.top * mmToPx;
        const bottomMargin = settings.margins.bottom * mmToPx;
        const leftMargin = settings.margins.left * mmToPx;
        const rightMargin = settings.margins.right * mmToPx;
        
        // Available height for content (page height minus margins)
        const availableHeight = this.PAGE_HEIGHT - topMargin - bottomMargin;
        const contentWidth = this.PAGE_WIDTH - leftMargin - rightMargin;
        
        console.log('[Pagination] Available height:', availableHeight, 'Content width:', contentWidth);
        
        // Create measurement container with EXACT same styling as real pages
        const measureDiv = document.createElement('div');
        measureDiv.style.cssText = `
            position: absolute;
            visibility: hidden;
            left: -9999px;
            top: -9999px;
            width: ${this.PAGE_WIDTH}px;
            padding: ${topMargin}px ${rightMargin}px ${bottomMargin}px ${leftMargin}px;
            box-sizing: border-box;
        `;
        measureDiv.className = 'markdown-body paper-content';
        document.body.appendChild(measureDiv);
        
        topLevelElements.forEach((element, idx) => {
            // Measure element height INCLUDING all margins and padding
            measureDiv.innerHTML = '';
            const clone = element.cloneNode(true);
            measureDiv.appendChild(clone);
            
            // Get computed style to include margins
            const computedStyle = window.getComputedStyle(clone);
            const marginTop = parseFloat(computedStyle.marginTop) || 0;
            const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
            const height = clone.offsetHeight + marginTop + marginBottom;
            
            console.log(`[${idx}] ${element.tagName}: ${height}px`);
            
            // If adding this element exceeds page height AND we have content, start new page
            if (currentHeight + height > availableHeight && currentPage.length > 0) {
                console.log(`  -> New page (${currentHeight + height}px > ${availableHeight}px)`);
                pages.push(currentPage);
                currentPage = [element];
                currentHeight = height;
            } else {
                currentPage.push(element);
                currentHeight += height;
            }
        });
        
        // Add final page
        if (currentPage.length > 0) {
            pages.push(currentPage);
        }
        
        document.body.removeChild(measureDiv);
        
        console.log(`[Pagination] Result: ${pages.length} pages`);
        return pages;
    }
    
    /**
     * Estimate element height for pagination
     */
    estimateHeight(element) {
        const tag = element.tagName.toLowerCase();
        
        const heights = {
            h1: 60,
            h2: 50,
            h3: 40,
            h4: 35,
            h5: 30,
            h6: 30,
            p: 25,
            ul: 30,
            ol: 30,
            blockquote: 40,
            pre: 50,
            table: 60
        };
        
        return heights[tag] || 25;
    }
    
    /**
     * Render pages to DOM
     */
    renderPages(pages) {
        // Clear preview
        this.previewElement.innerHTML = '';
        
        // Create page container
        const container = document.createElement('div');
        container.className = 'paper-container';
        
        // Load PDF settings
        const settings = this.loadPdfSettings();
        const mmToPx = 3.78;
        
        console.log(`[PaperLayout] Rendering ${pages.length} pages with margins:`, settings.margins);
        
        // Render each page
        pages.forEach((pageElements, index) => {
            const page = document.createElement('div');
            page.className = 'paper-page';
            page.dataset.pageNumber = index + 1;
            
            // Set margin guide positions using CSS custom properties
            page.style.setProperty('--margin-top', `${settings.margins.top * mmToPx}px`);
            page.style.setProperty('--margin-right', `${settings.margins.right * mmToPx}px`);
            page.style.setProperty('--margin-bottom', `${settings.margins.bottom * mmToPx}px`);
            page.style.setProperty('--margin-left', `${settings.margins.left * mmToPx}px`);
            
            if (settings.showMarginGuides === false) {
                page.classList.add('hide-margin-guides');
            }
            
            // Add page content
            const content = document.createElement('div');
            content.className = 'paper-content';
            // Apply margins as padding
            content.style.padding = `${settings.margins.top * mmToPx}px ${settings.margins.right * mmToPx}px ${settings.margins.bottom * mmToPx}px ${settings.margins.left * mmToPx}px`;
            content.style.textAlign = settings.textAlign || 'left';
            content.style.boxSizing = 'border-box';
            content.style.width = '100%';
            content.style.overflowWrap = 'break-word';
            content.style.wordWrap = 'break-word';
            
            // Add all elements to this page
            pageElements.forEach((element) => {
                const clone = element.cloneNode(true);
                content.appendChild(clone);
            });
            
            page.appendChild(content);
            
            // Add page number
            const pageNum = document.createElement('div');
            pageNum.className = 'paper-page-number';
            pageNum.textContent = `Page ${index + 1} of ${pages.length}`;
            
            // Position page number based on settings
            if (settings.pageNumberPosition === 'left') {
                pageNum.style.left = `${settings.margins.left * mmToPx}px`;
                pageNum.style.right = 'auto';
                pageNum.style.textAlign = 'left';
                pageNum.style.transform = 'none';
            } else if (settings.pageNumberPosition === 'right') {
                pageNum.style.right = `${settings.margins.right * mmToPx}px`;
                pageNum.style.left = 'auto';
                pageNum.style.textAlign = 'right';
                pageNum.style.transform = 'none';
            } else {
                pageNum.style.left = '50%';
                pageNum.style.transform = 'translateX(-50%)';
            }
            
            page.appendChild(pageNum);
            
            container.appendChild(page);
        });
        
        this.previewElement.appendChild(container);
        console.log(`[PaperLayout] Rendered ${pages.length} pages to DOM`);
    }
    
    /**
     * Make preview content editable
     */
    makeEditable() {
        const editableElements = this.previewElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote');
        
        editableElements.forEach(element => {
            element.setAttribute('contenteditable', 'true');
            element.classList.add('editable-block');
        });
    }
    
    /**
     * Attach event handlers (idempotent)
     */
    attachHandlers() {
        // Detach first to ensure no duplicates
        this.detachHandlers();
        
        // Editor change handler
        this.handlers.editorChange = () => {
            if (this.isUpdatingFromPreview) return;
            
            console.log('[PaperLayout] Editor changed, scheduling render');
            
            this.userIsTyping = true;
            clearTimeout(this.typingTimer);
            
            this.render();
            
            this.typingTimer = setTimeout(() => {
                this.userIsTyping = false;
            }, this.TYPING_TIMEOUT);
        };
        
        // Preview input handler (contenteditable)
        this.handlers.previewInput = (e) => {
            const element = e.target;
            if (!element.hasAttribute('contenteditable')) return;
            
            this.isUpdatingFromPreview = true;
            
            // Debounce update to editor
            clearTimeout(this.previewInputTimer);
            this.previewInputTimer = setTimeout(() => {
                this.syncPreviewToEditor(element);
                this.isUpdatingFromPreview = false;
            }, 300);
        };
        
        // Preview click handler (cursor sync)
        this.handlers.previewClick = (e) => {
            const element = e.target.closest('[data-source-line]');
            if (!element) return;
            
            const lineNumber = parseInt(element.dataset.sourceLine);
            if (lineNumber && this.editor && typeof this.editor.revealLineInCenter === 'function') {
                this.editor.revealLineInCenter(lineNumber);
                this.editor.setPosition({ lineNumber, column: 1 });
            }
        };
        
        // Attach handlers
        if (this.editor && this.editor.onDidChangeModelContent) {
            this.editorDisposable = this.editor.onDidChangeModelContent(this.handlers.editorChange);
        }
        
        this.previewElement.addEventListener('input', this.handlers.previewInput);
        this.previewElement.addEventListener('click', this.handlers.previewClick);
    }
    
    /**
     * Detach event handlers
     */
    detachHandlers() {
        if (this.editorDisposable) {
            this.editorDisposable.dispose();
            this.editorDisposable = null;
        }
        
        if (this.handlers.previewInput) {
            this.previewElement.removeEventListener('input', this.handlers.previewInput);
        }
        
        if (this.handlers.previewClick) {
            this.previewElement.removeEventListener('click', this.handlers.previewClick);
        }
    }
    
    /**
     * Sync preview changes back to editor
     */
    syncPreviewToEditor(element) {
        const lineNumber = parseInt(element.dataset.sourceLine);
        if (!lineNumber || !this.editor) return;
        
        const newText = element.textContent.trim();
        const model = this.editor.getModel();
        const line = model.getLineContent(lineNumber);
        
        // Preserve markdown formatting
        let updatedLine = line;
        
        // Handle headings
        const headingMatch = line.match(/^(#{1,6}\s+)/);
        if (headingMatch) {
            updatedLine = headingMatch[1] + newText;
        }
        // Handle list items
        else if (line.match(/^(\s*[*+-]\s+)/)) {
            const listMatch = line.match(/^(\s*[*+-]\s+)/);
            updatedLine = listMatch[1] + newText;
        }
        // Handle blockquotes
        else if (line.match(/^(>\s+)/)) {
            updatedLine = '> ' + newText;
        }
        // Plain paragraph
        else {
            updatedLine = newText;
        }
        
        // Update editor
        const range = {
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1
        };
        
        this.editor.executeEdits('preview-edit', [{
            range,
            text: updatedLine
        }]);
        
        console.log(`[PaperLayout] Synced preview → editor (line ${lineNumber})`);
    }
    
    /**
     * Load PDF settings from localStorage
     */
    loadPdfSettings() {
        try {
            const raw = localStorage.getItem('com.markdownlivepreview.pdf_layout_settings');
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.error('[PaperLayout] Failed to load PDF settings', e);
        }
        return {
            textAlign: 'left',
            pageNumberPosition: 'center',
            margins: { top: 15, right: 15, bottom: 15, left: 15 }
        };
    }
    
    /**
     * Cleanup
     */
    destroy() {
        this.deactivate();
        
        if (this.paginationTimer) {
            clearTimeout(this.paginationTimer);
        }
        
        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }
        
        if (this.previewInputTimer) {
            clearTimeout(this.previewInputTimer);
        }
    }
}
