/**
 * Inspector Copy/Paste Module
 */

import inspector from './inspector-core.js';

class InspectorCopyPaste {
    constructor() {
        this.copyButton = null;
        this.pasteButton = null;
        this.copiedStyles = null;
        this.clipboardHistory = [];
        this.MAX_HISTORY = 10;
        this.batchPasteMode = false;
        this.batchPastedElements = [];
        this.copyModal = null;
        this.pasteModal = null;
        this.batchBanner = null;
    }
    
    init() {
        this.copyButton = document.getElementById('inspector-copy-style-btn');
        this.pasteButton = document.getElementById('inspector-paste-style-btn');
        
        if (!this.copyButton) return false;
        
        this.createModals();
        this.createBatchBanner();
        this.setupEventListeners();
        document.addEventListener('inspector:selectionchange', this.updateButtonState.bind(this));
        
        console.log('Inspector copy/paste module initialized with modals');
        return true;
    }
    
    setupEventListeners() {
        this.copyButton.addEventListener('click', () => this.showCopyModal());
        if (this.pasteButton) {
            this.pasteButton.addEventListener('click', () => this.showPasteModal());
        }
    }
    
    createModals() {
        // Copy Style Modal
        this.copyModal = document.createElement('div');
        this.copyModal.className = 'inspector-modal';
        this.copyModal.innerHTML = `
            <div class="inspector-modal-content">
                <h3>📋 Copy Styles From Element</h3>
                <div class="inspector-style-categories">
                    <label><input type="checkbox" id="inspector-cat-colors" checked> Colors (text, background)</label>
                    <label><input type="checkbox" id="inspector-cat-typography" checked> Typography (font, size, weight)</label>
                    <label><input type="checkbox" id="inspector-cat-spacing" checked> Spacing (padding, margin)</label>
                    <label><input type="checkbox" id="inspector-cat-dimensions" checked> Dimensions (width, height)</label>
                    <label><input type="checkbox" id="inspector-cat-border" checked> Border (width, style, color)</label>
                    <label><input type="checkbox" id="inspector-cat-radius" checked> Border Radius (corners)</label>
                    <label><input type="checkbox" id="inspector-cat-display" checked> Display & Alignment</label>
                </div>
                <div class="inspector-modal-actions">
                    <button id="inspector-select-all-btn" class="inspector-modal-btn">Select All</button>
                    <button id="inspector-select-none-btn" class="inspector-modal-btn">Select None</button>
                </div>
                <div class="inspector-modal-actions">
                    <button id="inspector-copy-selected-btn" class="inspector-modal-btn inspector-modal-btn-primary">Copy Selected</button>
                    <button id="inspector-cancel-copy-btn" class="inspector-modal-btn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.copyModal);
        
        // Paste Style Modal
        this.pasteModal = document.createElement('div');
        this.pasteModal.className = 'inspector-modal';
        this.pasteModal.innerHTML = `
            <div class="inspector-modal-content">
                <h3>📋 Paste Styles To Element</h3>
                <p style="color: #aaa; font-size: 12px; margin-bottom: 15px;">Select which properties to paste:</p>
                <div id="inspector-compat-warning" class="inspector-compat-warning"></div>
                <div id="inspector-paste-categories" class="inspector-style-categories"></div>
                <div class="inspector-modal-actions">
                    <button id="inspector-paste-selected-btn" class="inspector-modal-btn inspector-modal-btn-primary">Paste Selected</button>
                    <button id="inspector-paste-all-btn" class="inspector-modal-btn">Paste All</button>
                    <button id="inspector-batch-paste-btn" class="inspector-modal-btn" style="background: #9c27b0; color: white;">Batch Paste</button>
                    <button id="inspector-cancel-paste-btn" class="inspector-modal-btn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.pasteModal);
        
        // Setup modal event listeners
        this.setupModalListeners();
    }
    
    setupModalListeners() {
        // Copy modal
        document.getElementById('inspector-select-all-btn').addEventListener('click', () => {
            document.querySelectorAll('.inspector-style-categories input[type="checkbox"]').forEach(cb => cb.checked = true);
        });
        
        document.getElementById('inspector-select-none-btn').addEventListener('click', () => {
            document.querySelectorAll('.inspector-style-categories input[type="checkbox"]').forEach(cb => cb.checked = false);
        });
        
        document.getElementById('inspector-copy-selected-btn').addEventListener('click', () => this.copySelectedStyles());
        document.getElementById('inspector-cancel-copy-btn').addEventListener('click', () => this.hideCopyModal());
        
        // Paste modal
        document.getElementById('inspector-paste-selected-btn').addEventListener('click', () => this.pasteSelectedStyles());
        document.getElementById('inspector-paste-all-btn').addEventListener('click', () => this.pasteAllStyles());
        document.getElementById('inspector-batch-paste-btn').addEventListener('click', () => this.startBatchPaste());
        document.getElementById('inspector-cancel-paste-btn').addEventListener('click', () => this.hidePasteModal());
        
        // Click outside to close
        this.copyModal.addEventListener('click', (e) => {
            if (e.target === this.copyModal) this.hideCopyModal();
        });
        this.pasteModal.addEventListener('click', (e) => {
            if (e.target === this.pasteModal) this.hidePasteModal();
        });
    }
    
    showCopyModal() {
        if (!inspector.selectedElement) return;
        this.copyModal.classList.add('active');
    }
    
    hideCopyModal() {
        this.copyModal.classList.remove('active');
    }
    
    showPasteModal() {
        if (!inspector.selectedElement || !this.copiedStyles) return;
        
        // Check compatibility
        this.checkCompatibility(inspector.selectedElement);
        
        // Populate paste categories
        const pasteCategories = document.getElementById('inspector-paste-categories');
        pasteCategories.innerHTML = '';
        
        const catNames = {
            colors: 'Colors',
            typography: 'Typography',
            spacing: 'Spacing',
            dimensions: 'Dimensions',
            border: 'Border',
            radius: 'Border Radius',
            display: 'Display & Alignment'
        };
        
        Object.keys(this.copiedStyles.categories).forEach(cat => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.dataset.category = cat;
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + catNames[cat]));
            pasteCategories.appendChild(label);
        });
        
        this.pasteModal.classList.add('active');
    }
    
    hidePasteModal() {
        this.pasteModal.classList.remove('active');
    }
    
    copySelectedStyles() {
        const element = inspector.selectedElement;
        if (!element) return;
        
        const elementWindow = element.ownerDocument.defaultView || window;
        const computed = elementWindow.getComputedStyle(element);
        const inlineStyle = element.style;
        
        this.copiedStyles = {
            categories: {},
            element: element.tagName
        };
        
        // Colors
        if (document.getElementById('inspector-cat-colors').checked) {
            this.copiedStyles.categories.colors = {
                color: inlineStyle.color || computed.color,
                backgroundColor: inlineStyle.backgroundColor || computed.backgroundColor
            };
        }
        
        // Typography
        if (document.getElementById('inspector-cat-typography').checked) {
            this.copiedStyles.categories.typography = {
                fontFamily: inlineStyle.fontFamily || computed.fontFamily,
                fontSize: inlineStyle.fontSize || computed.fontSize,
                fontWeight: inlineStyle.fontWeight || computed.fontWeight,
                textAlign: inlineStyle.textAlign || computed.textAlign
            };
        }
        
        // Spacing
        if (document.getElementById('inspector-cat-spacing').checked) {
            this.copiedStyles.categories.spacing = {
                padding: inlineStyle.padding || computed.padding,
                margin: inlineStyle.margin || computed.margin
            };
        }
        
        // Dimensions
        if (document.getElementById('inspector-cat-dimensions').checked) {
            this.copiedStyles.categories.dimensions = {
                width: inlineStyle.width || computed.width,
                height: inlineStyle.height || computed.height
            };
        }
        
        // Border
        if (document.getElementById('inspector-cat-border').checked) {
            this.copiedStyles.categories.border = {
                borderWidth: inlineStyle.borderWidth || computed.borderWidth,
                borderStyle: inlineStyle.borderStyle || computed.borderStyle,
                borderColor: inlineStyle.borderColor || computed.borderColor
            };
        }
        
        // Border Radius
        if (document.getElementById('inspector-cat-radius').checked) {
            this.copiedStyles.categories.radius = {
                borderRadius: inlineStyle.borderRadius || computed.borderRadius
            };
        }
        
        // Display
        if (document.getElementById('inspector-cat-display').checked) {
            this.copiedStyles.categories.display = {
                display: inlineStyle.display || computed.display
            };
        }
        
        this.hideCopyModal();
        this.addToHistory(this.copiedStyles);
        this.updateButtonState();
        
        const event = new CustomEvent('inspector:message', {
            detail: { message: 'Style copied!' }
        });
        document.dispatchEvent(event);
    }
    
    pasteSelectedStyles() {
        const element = inspector.selectedElement;
        if (!element || !this.copiedStyles) return;
        if (inspector.isElementLocked(element)) {
            const event = new CustomEvent('inspector:message', {
                detail: { message: 'Cannot paste to locked element' }
            });
            document.dispatchEvent(event);
            return;
        }
        
        const checkboxes = document.querySelectorAll('#inspector-paste-categories input[type="checkbox"]:checked');
        
        checkboxes.forEach(cb => {
            const cat = cb.dataset.category;
            const styles = this.copiedStyles.categories[cat];
            
            Object.keys(styles).forEach(prop => {
                element.style[prop] = styles[prop];
            });
        });
        
        this.hidePasteModal();
        
        const event = new CustomEvent('inspector:message', {
            detail: { message: 'Style pasted!' }
        });
        document.dispatchEvent(event);
        
        inspector.notifySelectionChange();
    }
    
    pasteAllStyles() {
        const element = inspector.selectedElement;
        if (!element || !this.copiedStyles) return;
        if (inspector.isElementLocked(element)) {
            const event = new CustomEvent('inspector:message', {
                detail: { message: 'Cannot paste to locked element' }
            });
            document.dispatchEvent(event);
            return;
        }
        
        Object.keys(this.copiedStyles.categories).forEach(cat => {
            const styles = this.copiedStyles.categories[cat];
            Object.keys(styles).forEach(prop => {
                element.style[prop] = styles[prop];
            });
        });
        
        this.hidePasteModal();
        
        const event = new CustomEvent('inspector:message', {
            detail: { message: 'All styles pasted!' }
        });
        document.dispatchEvent(event);
        
        inspector.notifySelectionChange();
    }
    
    checkCompatibility(element) {
        const warnings = [];
        const elementWindow = element.ownerDocument.defaultView || window;
        const display = elementWindow.getComputedStyle(element).display;
        const tagName = element.tagName.toLowerCase();
        
        // Check if element is inline
        if (display === 'inline' && this.copiedStyles.categories.spacing) {
            warnings.push('This element is inline. Padding and margin may not work as expected.');
        }
        
        // Check if pasting dimensions to inline
        if (display === 'inline' && this.copiedStyles.categories.dimensions) {
            warnings.push('Width and height don\'t apply to inline elements.');
        }
        
        // Check if hiding element
        if (this.copiedStyles.categories.display && this.copiedStyles.categories.display.display === 'none') {
            warnings.push('This will hide the element completely (display: none).');
        }
        
        // Show warnings
        const warningDiv = document.getElementById('inspector-compat-warning');
        
        if (warnings.length > 0) {
            warningDiv.innerHTML = '<strong>⚠️ Warning:</strong><br>' + warnings.join('<br>');
            warningDiv.style.display = 'block';
        } else {
            warningDiv.style.display = 'none';
        }
    }
    
    addToHistory(styles) {
        this.clipboardHistory.unshift({
            styles: {...styles},
            timestamp: Date.now()
        });
        
        if (this.clipboardHistory.length > this.MAX_HISTORY) {
            this.clipboardHistory.pop();
        }
    }
    
    updateButtonState() {
        if (this.copyButton) {
            this.copyButton.disabled = !inspector.selectedElement;
        }
        
        if (this.pasteButton) {
            this.pasteButton.disabled = !inspector.selectedElement || !this.copiedStyles;
            this.pasteButton.style.display = this.copiedStyles ? 'block' : 'none';
        }
    }
}

export const inspectorCopyPaste = new InspectorCopyPaste();
export default inspectorCopyPaste;

    
    createBatchBanner() {
        this.batchBanner = document.createElement('div');
        this.batchBanner.className = 'inspector-batch-banner';
        this.batchBanner.innerHTML = `
            <div class="inspector-batch-info">
                <span style="font-size: 20px;">📋</span>
                <div>
                    <div style="font-weight: bold;">BATCH PASTE MODE</div>
                    <div style="font-size: 12px; opacity: 0.9;">Click elements to paste styles</div>
                </div>
                <div class="inspector-batch-counter">
                    <span id="inspector-batch-counter">0</span> elements
                </div>
            </div>
            <div class="inspector-batch-actions">
                <button class="inspector-batch-btn inspector-batch-undo" id="inspector-batch-undo-btn">↶ Undo Last</button>
                <button class="inspector-batch-btn inspector-batch-done" id="inspector-batch-done-btn">✓ Done</button>
                <button class="inspector-batch-btn inspector-batch-cancel" id="inspector-batch-cancel-btn">✗ Cancel</button>
            </div>
        `;
        document.body.appendChild(this.batchBanner);
        
        // Setup banner listeners
        document.getElementById('inspector-batch-done-btn').addEventListener('click', () => this.finishBatchPaste());
        document.getElementById('inspector-batch-cancel-btn').addEventListener('click', () => this.cancelBatchPaste());
        document.getElementById('inspector-batch-undo-btn').addEventListener('click', () => this.undoBatchPasteLast());
    }
    
    startBatchPaste() {
        if (!this.copiedStyles) return;
        
        this.hidePasteModal();
        
        // Store selected categories
        const checkboxes = document.querySelectorAll('#inspector-paste-categories input[type="checkbox"]:checked');
        this.batchCategories = Array.from(checkboxes).map(cb => cb.dataset.category);
        
        // Start batch mode in inspector
        if (inspector.startBatchPasteMode) {
            inspector.startBatchPasteMode(this.batchCategories);
        }
        
        this.batchPasteMode = true;
        this.batchBanner.classList.add('active');
        document.getElementById('inspector-batch-counter').textContent = '0';
        
        const event = new CustomEvent('inspector:message', {
            detail: { message: 'Batch paste mode active - click elements to paste' }
        });
        document.dispatchEvent(event);
    }
    
    batchPasteToElement(element, doc) {
        if (!this.batchPasteMode || !this.copiedStyles) return;
        if (inspector.isElementLocked(element)) return;
        
        // Use inspector's batch paste method
        if (inspector.batchPasteToElement) {
            inspector.batchPasteToElement(element, doc);
            document.getElementById('inspector-batch-counter').textContent = inspector.batchPastedElements.length;
        }
    }
    
    finishBatchPaste() {
        if (inspector.exitBatchPasteMode) {
            inspector.exitBatchPasteMode(true, inspector.targetDocument);
        }
        
        this.exitBatchMode();
        
        const event = new CustomEvent('inspector:message', {
            detail: { message: `Pasted to ${inspector.batchPastedElements.length} elements!` }
        });
        document.dispatchEvent(event);
    }
    
    cancelBatchPaste() {
        if (inspector.cancelBatchPasteMode) {
            inspector.cancelBatchPasteMode();
        }
        
        this.exitBatchMode();
        
        const event = new CustomEvent('inspector:message', {
            detail: { message: 'Batch paste cancelled' }
        });
        document.dispatchEvent(event);
    }
    
    undoBatchPasteLast() {
        if (inspector.batchPastedElements && inspector.batchPastedElements.length > 0) {
            const lastElement = inspector.batchPastedElements.pop();
            
            if (lastElement && lastElement.parentNode) {
                // Restore original styles
                if (lastElement.dataset.originalStyles) {
                    try {
                        const originalStyles = JSON.parse(lastElement.dataset.originalStyles);
                        Object.keys(originalStyles).forEach(prop => {
                            if (originalStyles[prop] === '') {
                                lastElement.style[prop] = '';
                            } else {
                                lastElement.style[prop] = originalStyles[prop];
                            }
                        });
                        delete lastElement.dataset.originalStyles;
                    } catch (e) {
                        console.error('Failed to restore styles:', e);
                    }
                }
                lastElement.classList.remove('batch-pasted');
            }
            
            document.getElementById('inspector-batch-counter').textContent = inspector.batchPastedElements.length;
        }
    }
    
    exitBatchMode() {
        this.batchPasteMode = false;
        this.batchPastedElements = [];
        this.batchBanner.classList.remove('active');
    }
