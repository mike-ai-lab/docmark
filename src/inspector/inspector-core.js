/**
 * Inspector Core Module
 * Manages state and initialization for HTML element inspection
 */

class InspectorCore {
    constructor() {
        // State
        this.selectedElement = null;
        this.selectedElements = [];
        this.lockedElements = new Set();
        this.groups = new Map();
        this.groupIdCounter = 0;
        
        // Modes
        this.multiSelectMode = false;
        this.batchPasteMode = false;
        this.arrangeMode = false;
        this.isDragging = false;
        this.isDragSelecting = false;
        
        // Drag state
        this.draggedElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.dragStartPos = { x: 0, y: 0 };
        this.dragSelectStart = { x: 0, y: 0 };
        this.dragSelectBox = null;
        this.hasMoved = false;
        
        // Copy/Paste
        this.copiedStyles = null;
        this.clipboardHistory = [];
        
        // Deep selection state
        this.lastMousePosition = { x: 0, y: 0 };
        this.elementsAtPoint = [];
        this.currentElementIndex = 0;
        
        // History/Undo system
        this.history = [];
        this.historyIndex = -1;
        this.MAX_HISTORY = 50;
        
        // Constants
        this.DRAG_THRESHOLD = 5;
        this.MAX_CLIPBOARD_HISTORY = 10;
        
        // Storage keys
        this.STORAGE_KEY = 'inspector_clipboard_history';
        this.STORAGE_SETTINGS_KEY = 'inspector_settings';
        
        // Target document
        this.targetDocument = null;
        this.targetWindow = null;
        
        // Load saved data
        this.loadFromStorage();
    }
    
    /**
     * Load saved data from localStorage
     */
    loadFromStorage() {
        try {
            // Load clipboard history
            const savedHistory = localStorage.getItem(this.STORAGE_KEY);
            if (savedHistory) {
                this.clipboardHistory = JSON.parse(savedHistory);
                console.log('✅ Loaded clipboard history:', this.clipboardHistory.length, 'items');
            }
            
            // Load settings
            const savedSettings = localStorage.getItem(this.STORAGE_SETTINGS_KEY);
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.multiSelectMode = settings.multiSelectMode || false;
                console.log('✅ Loaded inspector settings');
            }
        } catch (e) {
            console.warn('Failed to load inspector data from storage:', e);
        }
    }
    
    /**
     * Save data to localStorage
     */
    saveToStorage() {
        try {
            // Save clipboard history
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.clipboardHistory));
            
            // Save settings
            const settings = {
                multiSelectMode: this.multiSelectMode,
                timestamp: Date.now()
            };
            localStorage.setItem(this.STORAGE_SETTINGS_KEY, JSON.stringify(settings));
            
            console.log('💾 Saved inspector data to storage');
        } catch (e) {
            console.warn('Failed to save inspector data to storage:', e);
        }
    }
    
    /**
     * Clear all saved data
     */
    clearStorage() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.STORAGE_SETTINGS_KEY);
            this.clipboardHistory = [];
            console.log('🗑️ Cleared inspector storage');
        } catch (e) {
            console.warn('Failed to clear inspector storage:', e);
        }
    }
    
    /**
     * Initialize inspector on target document
     * @param {Document} doc - Target document to inspect
     */
    init(doc) {
        if (!doc) {
            console.error('Inspector: No document provided');
            return false;
        }
        
        this.targetDocument = doc;
        this.targetWindow = doc.defaultView || window;
        
        // Inject inspector styles
        this.injectStyles();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Inspector initialized on document');
        return true;
    }
    
    /**
     * Inject inspector styles into target document
     */
    injectStyles() {
        const existingStyle = this.targetDocument.querySelector('style[data-inspector="true"]');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = this.targetDocument.createElement('style');
        style.setAttribute('data-inspector', 'true');
        style.textContent = `
            * { transition: outline 0.1s; }
            *.inspector-selected { 
                outline: 3px solid #ff9800 !important; 
                outline-offset: -3px; 
                z-index: 9998 !important;
                position: relative;
            }
            *.inspector-hover:not(.inspector-selected) { 
                outline: 2px dashed #00bcd4 !important; 
                outline-offset: -2px;
                cursor: pointer;
                z-index: 9997 !important;
                position: relative;
                background: rgba(0, 188, 212, 0.05) !important;
            }
            *.inspector-locked { 
                outline: 2px dashed #d32f2f !important; 
                outline-offset: -2px; 
                pointer-events: none !important;
            }
            *.inspector-multi-selected { 
                outline: 2px solid #2196f3 !important; 
                outline-offset: -2px; 
                background: rgba(33, 150, 243, 0.05) !important; 
                z-index: 9998 !important;
                position: relative;
            }
            *.inspector-grouped { 
                outline: 2px solid #9c27b0 !important; 
                outline-offset: -2px; 
            }
            .inspector-drag-select-box {
                position: fixed;
                border: 1px solid #2196f3;
                background: rgba(33, 150, 243, 0.1);
                z-index: 10001;
                pointer-events: none;
            }
            *.inspector-dragging {
                opacity: 0.8;
                cursor: move !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
                z-index: 9999 !important;
            }
            .inspector-depth-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10002;
                pointer-events: none;
            }
        `;
        
        this.targetDocument.head.appendChild(style);
    }
    
    /**
     * Setup event listeners on target document
     */
    setupEventListeners() {
        const body = this.targetDocument.body;
        
        // Click handler - DON'T use capture to allow scrolling
        body.addEventListener('click', this.handleClick.bind(this));
        
        // Hover handlers - passive to allow scrolling
        body.addEventListener('mouseover', this.handleMouseOver.bind(this), { passive: true });
        body.addEventListener('mouseout', this.handleMouseOut.bind(this), { passive: true });
        body.addEventListener('mousemove', this.handleMouseMoveTracking.bind(this), { passive: true });
        
        // Drag handlers (for Ctrl+Drag selection)
        body.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
        document.addEventListener('mouseup', this.handleMouseUp.bind(this), { passive: true });
        
        // Keyboard handler for cycling through elements
        this.targetDocument.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    /**
     * Track mouse position for deep element cycling
     */
    handleMouseMoveTracking(e) {
        this.lastMousePosition.x = e.clientX;
        this.lastMousePosition.y = e.clientY;
    }
    
    /**
     * Handle keyboard shortcuts
     */
    handleKeyDown(e) {
        // W: Drill down to first child of selected element
        if (e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            this.drillDown();
        }
        
        // S: Go back up to parent of selected element
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            this.drillUp();
        }
    }
    
    /**
     * Drill down to first child element
     */
    drillDown() {
        if (!this.selectedElement) {
            console.log('No element selected. Click an element first.');
            return;
        }
        
        // Find first child element that's not a script/style
        const children = Array.from(this.selectedElement.children);
        const validChild = children.find(child => !this.isNonInspectable(child));
        
        if (validChild) {
            this.selectElement(validChild);
            console.log('⬇️ Drilled down to:', validChild.tagName);
        } else {
            console.log('No child elements to drill into');
        }
    }
    
    /**
     * Drill up to parent element
     */
    drillUp() {
        if (!this.selectedElement) {
            console.log('No element selected. Click an element first.');
            return;
        }
        
        const parent = this.selectedElement.parentElement;
        
        if (parent && !this.isNonInspectable(parent)) {
            this.selectElement(parent);
            console.log('⬆️ Drilled up to:', parent.tagName);
        } else {
            console.log('Already at top level');
        }
    }
    
    /**
     * Cycle through all elements at the current mouse position
     */
    cycleDeepElements() {
        // Get all elements at current position
        this.elementsAtPoint = this.getAllElementsAtPoint(
            this.lastMousePosition.x, 
            this.lastMousePosition.y
        );
        
        if (this.elementsAtPoint.length === 0) return;
        
        // Move to next element
        this.currentElementIndex = (this.currentElementIndex + 1) % this.elementsAtPoint.length;
        const element = this.elementsAtPoint[this.currentElementIndex];
        
        // Select it
        this.selectElement(element);
        
        // Show indicator
        console.log(`Selected element ${this.currentElementIndex + 1}/${this.elementsAtPoint.length}: ${element.tagName}${element.className ? '.' + element.className : ''}`);
    }
    
    /**
     * Get ALL elements at a point (for cycling)
     */
    getAllElementsAtPoint(x, y) {
        const elements = [];
        let element = this.targetDocument.elementFromPoint(x, y);
        const hiddenElements = [];
        
        while (element && element !== this.targetDocument.body && element !== this.targetDocument.documentElement) {
            if (!this.isNonInspectable(element) && !this.isElementLocked(element)) {
                elements.push(element);
            }
            
            // Hide this element temporarily
            const originalPointerEvents = element.style.pointerEvents;
            element.style.pointerEvents = 'none';
            hiddenElements.push({ element, originalPointerEvents });
            
            // Get next element
            element = this.targetDocument.elementFromPoint(x, y);
        }
        
        // Restore all pointer events
        hiddenElements.forEach(({ element, originalPointerEvents }) => {
            element.style.pointerEvents = originalPointerEvents;
        });
        
        return elements;
    }
    
    /**
     * Handle click on element
     */
    handleClick(e) {
        // Get the deepest element at click position
        const element = this.getDeepestElementAtPoint(e.clientX, e.clientY);
        
        if (!element || this.isNonInspectable(element)) {
            // Don't interfere with normal clicks
            return;
        }
        
        // Only prevent default if we're actually selecting something
        e.preventDefault();
        e.stopPropagation();
        
        // Handle Ctrl+Click for multi-select
        if (e.ctrlKey) {
            this.toggleMultiSelect(element);
            return;
        }
        
        // Handle multi-select mode
        if (this.multiSelectMode) {
            this.toggleMultiSelect(element);
            return;
        }
        
        // Normal selection
        this.selectElement(element);
    }
    
    /**
     * Handle mouse over element
     */
    handleMouseOver(e) {
        // Get the deepest element at cursor position
        const element = this.getDeepestElementAtPoint(e.clientX, e.clientY);
        
        if (!element) return;
        if (this.isNonInspectable(element)) return;
        if (element === this.selectedElement) return;
        if (this.isDragging) return;
        
        // Remove hover from all other elements
        this.targetDocument.querySelectorAll('.inspector-hover').forEach(el => {
            el.classList.remove('inspector-hover');
        });
        
        element.classList.add('inspector-hover');
        
        // Show depth indicator
        this.showDepthIndicator(element);
    }
    
    /**
     * Handle mouse out of element
     */
    handleMouseOut(e) {
        const element = e.target;
        element.classList.remove('inspector-hover');
        this.hideDepthIndicator();
    }
    
    /**
     * Show element path indicator
     */
    showDepthIndicator(element) {
        let indicator = this.targetDocument.querySelector('.inspector-depth-indicator');
        
        if (!indicator) {
            indicator = this.targetDocument.createElement('div');
            indicator.className = 'inspector-depth-indicator';
            this.targetDocument.body.appendChild(indicator);
        }
        
        // Build element path
        const path = [];
        let current = element;
        let depth = 0;
        
        while (current && current !== this.targetDocument.body && depth < 5) {
            const tag = current.tagName.toLowerCase();
            const id = current.id ? `#${current.id}` : '';
            const classes = current.className ? `.${current.className.split(' ').join('.')}` : '';
            path.unshift(`${tag}${id}${classes}`);
            current = current.parentElement;
            depth++;
        }
        
        indicator.textContent = `🎯 ${path.join(' > ')} (Alt+Q to cycle)`;
        indicator.style.display = 'block';
    }
    
    /**
     * Hide depth indicator
     */
    hideDepthIndicator() {
        const indicator = this.targetDocument.querySelector('.inspector-depth-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
    
    /**
     * Get the deepest inspectable element at a point
     * Uses elementFromPoint with temporary pointer-events manipulation
     */
    getDeepestElementAtPoint(x, y) {
        const elements = [];
        let element = this.targetDocument.elementFromPoint(x, y);
        
        // Traverse down to find deepest inspectable element
        while (element) {
            if (!this.isNonInspectable(element) && !this.isElementLocked(element)) {
                elements.push(element);
            }
            
            // Temporarily hide this element to check what's beneath
            const originalPointerEvents = element.style.pointerEvents;
            element.style.pointerEvents = 'none';
            
            const nextElement = this.targetDocument.elementFromPoint(x, y);
            
            // Restore pointer events
            element.style.pointerEvents = originalPointerEvents;
            
            // Stop if we've reached the same element or body/html
            if (nextElement === element || !nextElement || nextElement === this.targetDocument.body) {
                break;
            }
            
            element = nextElement;
        }
        
        // Return the deepest inspectable element
        return elements.length > 0 ? elements[elements.length - 1] : null;
    }
    
    /**
     * Handle mouse down (for drag selection)
     */
    handleMouseDown(e) {
        if (!e.ctrlKey) return;
        if (this.multiSelectMode || this.batchPasteMode || this.arrangeMode) return;
        
        // Don't interfere with scrolling
        if (e.button !== 0) return; // Only left click
        
        this.isDragSelecting = true;
        this.dragSelectStart.x = e.clientX;
        this.dragSelectStart.y = e.clientY;
        
        // Create selection box
        this.dragSelectBox = document.createElement('div');
        this.dragSelectBox.className = 'inspector-drag-select-box';
        this.dragSelectBox.style.left = e.clientX + 'px';
        this.dragSelectBox.style.top = e.clientY + 'px';
        this.dragSelectBox.style.width = '0px';
        this.dragSelectBox.style.height = '0px';
        document.body.appendChild(this.dragSelectBox);
        
        // Enter multi-select mode
        if (!this.multiSelectMode) {
            this.multiSelectMode = true;
            this.notifyModeChange('multiselect', true);
        }
    }
    
    /**
     * Handle mouse move (for drag selection)
     */
    handleMouseMove(e) {
        if (!this.isDragSelecting || !this.dragSelectBox) return;
        
        const currentX = e.clientX;
        const currentY = e.clientY;
        
        const left = Math.min(this.dragSelectStart.x, currentX);
        const top = Math.min(this.dragSelectStart.y, currentY);
        const width = Math.abs(currentX - this.dragSelectStart.x);
        const height = Math.abs(currentY - this.dragSelectStart.y);
        
        this.dragSelectBox.style.left = left + 'px';
        this.dragSelectBox.style.top = top + 'px';
        this.dragSelectBox.style.width = width + 'px';
        this.dragSelectBox.style.height = height + 'px';
    }
    
    /**
     * Handle mouse up (complete drag selection)
     */
    handleMouseUp(e) {
        if (!this.isDragSelecting) return;
        
        this.isDragSelecting = false;
        
        if (this.dragSelectBox) {
            // Get all elements within selection box
            const boxRect = this.dragSelectBox.getBoundingClientRect();
            const allElements = this.targetDocument.body.querySelectorAll('*');
            
            allElements.forEach(el => {
                if (this.isElementLocked(el)) return;
                if (this.isNonInspectable(el)) return;
                
                const elRect = el.getBoundingClientRect();
                
                // Check intersection
                if (!(elRect.right < boxRect.left || 
                      elRect.left > boxRect.right || 
                      elRect.bottom < boxRect.top || 
                      elRect.top > boxRect.bottom)) {
                    
                    if (!this.selectedElements.includes(el)) {
                        this.selectedElements.push(el);
                        el.classList.add('inspector-multi-selected');
                    }
                }
            });
            
            this.notifySelectionChange();
            
            this.dragSelectBox.remove();
            this.dragSelectBox = null;
        }
    }
    
    /**
     * Select single element
     */
    selectElement(element) {
        // Clear previous selection
        if (this.selectedElement) {
            this.selectedElement.classList.remove('inspector-selected');
        }
        
        this.selectedElement = element;
        element.classList.add('inspector-selected');
        
        this.notifySelectionChange();
    }
    
    /**
     * Toggle element in multi-select
     */
    toggleMultiSelect(element) {
        const index = this.selectedElements.indexOf(element);
        
        if (index > -1) {
            // Deselect
            this.selectedElements.splice(index, 1);
            element.classList.remove('inspector-multi-selected');
        } else {
            // Select
            this.selectedElements.push(element);
            element.classList.add('inspector-multi-selected');
        }
        
        this.notifySelectionChange();
    }
    
    /**
     * Check if element is locked
     */
    isElementLocked(element) {
        return this.lockedElements.has(element) || element.hasAttribute('data-inspector-locked');
    }
    
    /**
     * Check if element should not be inspectable
     */
    isNonInspectable(element) {
        const tag = element.tagName;
        return ['HTML', 'BODY', 'SCRIPT', 'STYLE', 'LINK', 'META'].includes(tag);
    }
    
    /**
     * Notify UI of selection change
     */
    notifySelectionChange() {
        const event = new CustomEvent('inspector:selectionchange', {
            detail: {
                selectedElement: this.selectedElement,
                selectedElements: this.selectedElements,
                multiSelectMode: this.multiSelectMode
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Notify UI of mode change
     */
    notifyModeChange(mode, active) {
        const event = new CustomEvent('inspector:modechange', {
            detail: { mode, active }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Add style to clipboard history and save
     */
    addToClipboardHistory(styleData) {
        // Add to history
        this.clipboardHistory.unshift(styleData);
        
        // Limit history size
        if (this.clipboardHistory.length > this.MAX_CLIPBOARD_HISTORY) {
            this.clipboardHistory = this.clipboardHistory.slice(0, this.MAX_CLIPBOARD_HISTORY);
        }
        
        // Save to storage
        this.saveToStorage();
        
        // Notify UI
        const event = new CustomEvent('inspector:clipboardchange', {
            detail: { history: this.clipboardHistory }
        });
        document.dispatchEvent(event);
        
        console.log('💾 Saved to clipboard history:', styleData.name);
    }
    
    /**
     * Remove item from clipboard history
     */
    removeFromClipboardHistory(index) {
        if (index >= 0 && index < this.clipboardHistory.length) {
            const removed = this.clipboardHistory.splice(index, 1)[0];
            this.saveToStorage();
            
            const event = new CustomEvent('inspector:clipboardchange', {
                detail: { history: this.clipboardHistory }
            });
            document.dispatchEvent(event);
            
            console.log('🗑️ Removed from clipboard history:', removed.name);
        }
    }
    
    /**
     * Cleanup inspector
     */
    destroy() {
        // Remove styles
        const style = this.targetDocument.querySelector('style[data-inspector="true"]');
        if (style) style.remove();
        
        // Clear selections
        if (this.selectedElement) {
            this.selectedElement.classList.remove('inspector-selected');
        }
        this.selectedElements.forEach(el => {
            el.classList.remove('inspector-multi-selected');
        });
        
        // Reset state
        this.selectedElement = null;
        this.selectedElements = [];
        this.multiSelectMode = false;
        
        console.log('Inspector destroyed');
    }
}

// Export singleton instance
export const inspector = new InspectorCore();
export default inspector;
