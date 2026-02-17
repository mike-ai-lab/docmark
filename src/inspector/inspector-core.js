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
        
        // Constants
        this.DRAG_THRESHOLD = 5;
        this.MAX_CLIPBOARD_HISTORY = 10;
        
        // Target document
        this.targetDocument = null;
        this.targetWindow = null;
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
                outline: 2px solid #007acc !important; 
                outline-offset: -2px; 
            }
            *.inspector-hover:not(.inspector-selected) { 
                outline: 1px dashed #007acc !important; 
                outline-offset: -1px;
                cursor: pointer;
            }
            *.inspector-locked { 
                outline: 2px dashed #d32f2f !important; 
                outline-offset: -2px; 
            }
            *.inspector-multi-selected { 
                outline: 2px solid #2196f3 !important; 
                outline-offset: -2px; 
                background: rgba(33, 150, 243, 0.05) !important; 
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
        `;
        
        this.targetDocument.head.appendChild(style);
    }
    
    /**
     * Setup event listeners on target document
     */
    setupEventListeners() {
        const body = this.targetDocument.body;
        
        // Click handler
        body.addEventListener('click', this.handleClick.bind(this), true);
        
        // Hover handlers
        body.addEventListener('mouseover', this.handleMouseOver.bind(this), true);
        body.addEventListener('mouseout', this.handleMouseOut.bind(this), true);
        
        // Drag handlers (for Ctrl+Drag selection)
        body.addEventListener('mousedown', this.handleMouseDown.bind(this), true);
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }
    
    /**
     * Handle click on element
     */
    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const element = e.target;
        
        // Skip non-inspectable elements
        if (this.isNonInspectable(element)) return;
        
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
        const element = e.target;
        
        if (this.isNonInspectable(element)) return;
        if (element === this.selectedElement) return;
        if (this.isDragging) return;
        
        element.classList.add('inspector-hover');
    }
    
    /**
     * Handle mouse out of element
     */
    handleMouseOut(e) {
        const element = e.target;
        element.classList.remove('inspector-hover');
    }
    
    /**
     * Handle mouse down (for drag selection)
     */
    handleMouseDown(e) {
        if (!e.ctrlKey) return;
        if (this.multiSelectMode || this.batchPasteMode || this.arrangeMode) return;
        
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
        
        e.preventDefault();
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
