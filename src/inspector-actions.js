/**
 * INSPECTOR ACTIONS MODULE
 * Modular action functions for element manipulation
 * Ready for integration into any app
 */

class InspectorActions {
    constructor(config = {}) {
        // Configuration
        this.config = {
            maxHistory: config.maxHistory || 50,
            maxClipboardHistory: config.maxClipboardHistory || 10,
            dragThreshold: config.dragThreshold || 5,
            onStateChange: config.onStateChange || null,
            onFeedback: config.onFeedback || null,
            ...config
        };

        // State management
        this.selectedElement = null;
        this.selectedElements = [];
        this.lockedElements = new Set();
        this.groups = new Map();
        this.groupIdCounter = 0;
        
        // History
        this.history = [];
        this.historyIndex = -1;
        
        // Clipboard
        this.copiedStyles = null;
        this.styleClipboardHistory = [];
        
        // Modes
        this.batchPasteMode = false;
        this.batchPastedElements = [];
        this.arrangeMode = false;
        this.arrangeTargetElement = null;
        this.arrangedElements = [];
        this.multiSelectMode = false;
        
        // Drag & Drop
        this.draggedElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStartPos = { x: 0, y: 0 };
        this.hasMoved = false;
    }

    // ===== UTILITY METHODS =====

    showFeedback(message, type = 'success') {
        if (this.config.onFeedback) {
            this.config.onFeedback(message, type);
        }
    }

    saveState(doc) {
        if (!doc || !doc.documentElement) return;
        
        const state = doc.documentElement.outerHTML;
        
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(state);
        if (this.history.length > this.config.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
        
        if (this.config.onStateChange) {
            this.config.onStateChange('save', this.historyIndex, this.history.length);
        }
    }

    isElementLocked(element) {
        return this.lockedElements.has(element);
    }

    rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
        const res = rgb.match(/\d+/g);
        return res ? "#" + res.slice(0,3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : '#ffffff';
    }

    normalizeZIndex(element) {
        const computed = window.getComputedStyle(element);
        let zIndex = parseInt(element.style.zIndex) || parseInt(computed.zIndex) || 0;
        if (isNaN(zIndex)) zIndex = 0;
        return zIndex;
    }

    // ===== SELECTION METHODS =====

    selectElement(element) {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('active-inspect');
        }
        this.selectedElement = element;
        element.classList.add('active-inspect');
        return element;
    }

    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('active-inspect');
            this.selectedElement = null;
        }
    }

    // ===== HISTORY ACTIONS =====

    undo(doc) {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(doc, this.history[this.historyIndex]);
            if (this.config.onStateChange) {
                this.config.onStateChange('undo', this.historyIndex, this.history.length);
            }
            return true;
        }
        return false;
    }

    redo(doc) {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(doc, this.history[this.historyIndex]);
            if (this.config.onStateChange) {
                this.config.onStateChange('redo', this.historyIndex, this.history.length);
            }
            return true;
        }
        return false;
    }

    restoreState(doc, html) {
        doc.open();
        doc.write(html);
        doc.close();
    }

    canUndo() {
        return this.historyIndex > 0;
    }

    canRedo() {
        return this.historyIndex < this.history.length - 1;
    }

    // ===== ARRANGE (Z-INDEX) ACTIONS =====

    bringToFront(element, doc) {
        if (!element) return false;
        
        const parent = element.parentElement;
        const siblings = Array.from(parent.children);
        
        let maxZ = 0;
        siblings.forEach(el => {
            const z = this.normalizeZIndex(el);
            if (z > maxZ) maxZ = z;
        });
        
        element.style.zIndex = maxZ + 1;
        this.saveState(doc);
        this.showFeedback('BROUGHT TO FRONT!');
        return true;
    }

    bringForward(element, doc) {
        if (!element) return false;
        
        const currentZ = this.normalizeZIndex(element);
        element.style.zIndex = currentZ + 1;
        this.saveState(doc);
        this.showFeedback('BROUGHT FORWARD!');
        return true;
    }

    sendBackward(element, doc) {
        if (!element) return false;
        
        const currentZ = this.normalizeZIndex(element);
        element.style.zIndex = currentZ - 1;
        this.saveState(doc);
        this.showFeedback('SENT BACKWARD!');
        return true;
    }

    sendToBack(element, doc) {
        if (!element) return false;
        
        const parent = element.parentElement;
        const siblings = Array.from(parent.children);
        
        let minZ = 0;
        siblings.forEach(el => {
            const z = this.normalizeZIndex(el);
            if (z < minZ) minZ = z;
        });
        
        element.style.zIndex = minZ - 1;
        this.saveState(doc);
        this.showFeedback('SENT TO BACK!');
        return true;
    }

    startArrangeMode(element) {
        if (!element) return false;
        
        this.arrangeMode = true;
        this.arrangeTargetElement = element;
        this.arrangedElements = [];
        
        this.showFeedback('ARRANGE MODE: Click elements to bring selected above them', 'info');
        return true;
    }

    arrangeAboveElement(targetElement, doc) {
        if (!this.arrangeMode || !this.arrangeTargetElement) return false;
        if (targetElement === this.arrangeTargetElement) return false;
        if (this.isElementLocked(this.arrangeTargetElement)) {
            this.showFeedback('Cannot arrange locked element!', 'error');
            return false;
        }
        
        // Save original z-index for undo
        if (this.arrangeTargetElement.dataset.originalZIndex === undefined) {
            this.arrangeTargetElement.dataset.originalZIndex = this.arrangeTargetElement.style.zIndex || '';
        }
        
        const targetZ = this.normalizeZIndex(targetElement);
        this.arrangeTargetElement.style.zIndex = targetZ + 1;
        
        if (!this.arrangedElements.includes(this.arrangeTargetElement)) {
            this.arrangedElements.push(this.arrangeTargetElement);
        }
        
        this.arrangeTargetElement.classList.add('arrange-applied');
        return true;
    }

    exitArrangeMode(save = true, doc = null) {
        this.arrangedElements.forEach(el => {
            el.classList.remove('arrange-applied');
        });
        
        if (save && doc) {
            this.saveState(doc);
            this.showFeedback(`ARRANGED ${this.arrangedElements.length} ELEMENTS!`);
        }
        
        this.arrangeMode = false;
        this.arrangeTargetElement = null;
        this.arrangedElements = [];
    }

    cancelArrangeMode() {
        this.arrangedElements.forEach(el => {
            if (el.dataset.originalZIndex !== undefined) {
                el.style.zIndex = el.dataset.originalZIndex;
                delete el.dataset.originalZIndex;
            }
            el.classList.remove('arrange-applied');
        });
        
        this.arrangeMode = false;
        this.arrangeTargetElement = null;
        this.arrangedElements = [];
        this.showFeedback('ARRANGE CANCELLED');
    }

    undoLastArrange() {
        if (this.arrangedElements.length === 0) return false;
        
        const lastElement = this.arrangedElements.pop();
        if (lastElement.dataset.originalZIndex !== undefined) {
            lastElement.style.zIndex = lastElement.dataset.originalZIndex;
            delete lastElement.dataset.originalZIndex;
        }
        lastElement.classList.remove('arrange-applied');
        
        this.showFeedback('UNDONE!');
        return true;
    }

    // ===== LOCK ACTIONS =====

    toggleLock(element) {
        if (!element) return false;
        
        if (this.lockedElements.has(element)) {
            this.lockedElements.delete(element);
            element.classList.remove('locked-element');
            this.showFeedback('ELEMENT UNLOCKED');
            return false; // unlocked
        } else {
            this.lockedElements.add(element);
            element.classList.add('locked-element');
            this.showFeedback('ELEMENT LOCKED');
            return true; // locked
        }
    }

    lockElement(element) {
        if (!element) return false;
        this.lockedElements.add(element);
        element.classList.add('locked-element');
        this.showFeedback('ELEMENT LOCKED');
        return true;
    }

    unlockElement(element) {
        if (!element) return false;
        this.lockedElements.delete(element);
        element.classList.remove('locked-element');
        this.showFeedback('ELEMENT UNLOCKED');
        return true;
    }

    unlockAll() {
        this.lockedElements.forEach(el => {
            el.classList.remove('locked-element');
        });
        const count = this.lockedElements.size;
        this.lockedElements.clear();
        this.showFeedback(`UNLOCKED ${count} ELEMENTS`);
        return count;
    }

    // ===== MULTI-SELECT ACTIONS =====

    startMultiSelectMode() {
        this.multiSelectMode = true;
        this.selectedElements = [];
        this.showFeedback('MULTI-SELECT MODE: Click elements to select', 'info');
        return true;
    }

    exitMultiSelectMode() {
        this.selectedElements.forEach(el => {
            el.classList.remove('multi-selected');
        });
        this.multiSelectMode = false;
        this.selectedElements = [];
        this.showFeedback('MULTI-SELECT MODE EXITED');
    }

    toggleMultiSelect(element) {
        if (!this.multiSelectMode) return false;
        if (this.isElementLocked(element)) {
            this.showFeedback('Cannot select locked element!', 'error');
            return false;
        }
        
        const index = this.selectedElements.indexOf(element);
        
        if (index > -1) {
            this.selectedElements.splice(index, 1);
            element.classList.remove('multi-selected');
        } else {
            this.selectedElements.push(element);
            element.classList.add('multi-selected');
        }
        
        return this.selectedElements.length;
    }

    clearMultiSelection() {
        this.selectedElements.forEach(el => {
            el.classList.remove('multi-selected');
        });
        const count = this.selectedElements.length;
        this.selectedElements = [];
        this.showFeedback(`CLEARED ${count} SELECTIONS`);
        return count;
    }

    distributeElements(direction = 'horizontal', gap = 50, alignment = 'start', doc) {
        if (this.selectedElements.length < 2) {
            this.showFeedback('Need at least 2 elements to distribute', 'error');
            return false;
        }
        
        const elements = [...this.selectedElements];
        
        // Sort by position
        if (direction === 'horizontal') {
            elements.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
        } else {
            elements.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
        }
        
        // Get first element position
        const firstRect = elements[0].getBoundingClientRect();
        let currentPos = direction === 'horizontal' ? firstRect.left : firstRect.top;
        
        elements.forEach((el, index) => {
            if (index === 0) return; // Skip first
            
            const rect = el.getBoundingClientRect();
            const computed = window.getComputedStyle(el);
            
            // Make absolute if not already
            if (computed.position === 'static') {
                el.style.position = 'absolute';
            }
            
            if (direction === 'horizontal') {
                const prevRect = elements[index - 1].getBoundingClientRect();
                currentPos = prevRect.right + gap;
                el.style.left = currentPos + 'px';
                
                // Alignment
                if (alignment === 'center') {
                    el.style.top = (firstRect.top + firstRect.height / 2 - rect.height / 2) + 'px';
                } else if (alignment === 'end') {
                    el.style.top = (firstRect.bottom - rect.height) + 'px';
                } else {
                    el.style.top = firstRect.top + 'px';
                }
            } else {
                const prevRect = elements[index - 1].getBoundingClientRect();
                currentPos = prevRect.bottom + gap;
                el.style.top = currentPos + 'px';
                
                // Alignment
                if (alignment === 'center') {
                    el.style.left = (firstRect.left + firstRect.width / 2 - rect.width / 2) + 'px';
                } else if (alignment === 'end') {
                    el.style.left = (firstRect.right - rect.width) + 'px';
                } else {
                    el.style.left = firstRect.left + 'px';
                }
            }
        });
        
        this.saveState(doc);
        this.showFeedback(`DISTRIBUTED ${elements.length} ELEMENTS`);
        return true;
    }

    // ===== GROUP ACTIONS =====

    groupSelectedElements(doc) {
        if (this.selectedElements.length < 2) {
            this.showFeedback('Need at least 2 elements to group', 'error');
            return false;
        }
        
        const groupId = 'group-' + (++this.groupIdCounter);
        
        this.selectedElements.forEach(el => {
            el.setAttribute('data-group-id', groupId);
            el.classList.add('grouped-element');
        });
        
        this.groups.set(groupId, [...this.selectedElements]);
        
        this.saveState(doc);
        this.showFeedback(`GROUPED ${this.selectedElements.length} ELEMENTS`);
        return groupId;
    }

    ungroupElement(element, doc) {
        const groupId = element.getAttribute('data-group-id');
        if (!groupId) return false;
        
        const groupElements = this.groups.get(groupId);
        if (groupElements) {
            groupElements.forEach(el => {
                el.classList.remove('grouped-element');
                el.removeAttribute('data-group-id');
            });
            this.groups.delete(groupId);
        }
        
        this.saveState(doc);
        this.showFeedback('GROUP UNGROUPED!');
        return true;
    }

    selectGroup(element) {
        const groupId = element.getAttribute('data-group-id');
        if (!groupId) return false;
        
        const groupElements = this.groups.get(groupId);
        if (!groupElements) return false;
        
        this.multiSelectMode = true;
        this.selectedElements = [...groupElements];
        
        this.selectedElements.forEach(el => el.classList.add('multi-selected'));
        
        this.showFeedback(`GROUP SELECTED - ${this.selectedElements.length} elements`, 'info');
        return true;
    }

    // ===== COPY/PASTE STYLE ACTIONS =====

    copyStyle(element, categories = {}) {
        if (!element) return false;
        
        const style = window.getComputedStyle(element);
        const inlineStyle = element.style;
        
        this.copiedStyles = {
            categories: {},
            element: element.tagName
        };
        
        // Colors
        if (categories.colors !== false) {
            this.copiedStyles.categories.colors = {
                color: inlineStyle.color || style.color,
                backgroundColor: inlineStyle.backgroundColor || style.backgroundColor
            };
        }
        
        // Typography
        if (categories.typography !== false) {
            this.copiedStyles.categories.typography = {
                fontFamily: inlineStyle.fontFamily || style.fontFamily,
                fontSize: inlineStyle.fontSize || style.fontSize,
                fontWeight: inlineStyle.fontWeight || style.fontWeight,
                textAlign: inlineStyle.textAlign || style.textAlign
            };
        }
        
        // Spacing
        if (categories.spacing !== false) {
            this.copiedStyles.categories.spacing = {
                padding: inlineStyle.padding || style.padding,
                margin: inlineStyle.margin || style.margin
            };
        }
        
        // Dimensions
        if (categories.dimensions !== false) {
            this.copiedStyles.categories.dimensions = {
                width: inlineStyle.width || style.width,
                height: inlineStyle.height || style.height
            };
        }
        
        // Border
        if (categories.border !== false) {
            this.copiedStyles.categories.border = {
                borderWidth: inlineStyle.borderWidth || style.borderWidth,
                borderStyle: inlineStyle.borderStyle || style.borderStyle,
                borderColor: inlineStyle.borderColor || style.borderColor
            };
        }
        
        // Border Radius
        if (categories.radius !== false) {
            this.copiedStyles.categories.radius = {
                borderRadius: inlineStyle.borderRadius || style.borderRadius
            };
        }
        
        // Display
        if (categories.display !== false) {
            this.copiedStyles.categories.display = {
                display: inlineStyle.display || style.display
            };
        }
        
        // Add to clipboard history
        this.addToClipboardHistory(this.copiedStyles);
        
        this.showFeedback('STYLE COPIED!');
        return this.copiedStyles;
    }

    pasteStyle(element, categories = null, doc) {
        if (!this.copiedStyles || !element) return false;
        if (this.isElementLocked(element)) {
            this.showFeedback('Cannot paste to locked element!', 'error');
            return false;
        }
        
        // If no categories specified, paste all
        const categoriesToPaste = categories || Object.keys(this.copiedStyles.categories);
        
        categoriesToPaste.forEach(cat => {
            const styles = this.copiedStyles.categories[cat];
            if (styles) {
                Object.keys(styles).forEach(prop => {
                    element.style[prop] = styles[prop];
                });
            }
        });
        
        this.saveState(doc);
        this.showFeedback('STYLE PASTED!');
        return true;
    }

    checkCompatibility(element, styles) {
        const warnings = [];
        const display = window.getComputedStyle(element).display;
        const tagName = element.tagName.toLowerCase();
        
        if (display === 'inline' && styles.categories.spacing) {
            warnings.push('This element is inline. Padding and margin may not work as expected.');
        }
        
        if (display === 'inline' && styles.categories.dimensions) {
            warnings.push('Width and height don\'t apply to inline elements.');
        }
        
        if (styles.categories.display && styles.categories.display.display === 'none') {
            warnings.push('This will hide the element completely (display: none).');
        }
        
        if (styles.categories.typography && ['img', 'hr', 'br', 'input'].includes(tagName)) {
            warnings.push('Typography styles may not apply to this element type.');
        }
        
        return warnings;
    }

    // ===== BATCH PASTE MODE =====

    startBatchPasteMode(categories = null) {
        if (!this.copiedStyles) {
            this.showFeedback('No styles copied!', 'error');
            return false;
        }
        
        this.batchPasteMode = true;
        this.batchPastedElements = [];
        this.batchPasteCategories = categories;
        this.showFeedback('BATCH PASTE MODE: Click elements to paste', 'info');
        return true;
    }

    batchPasteToElement(element, doc) {
        if (!this.batchPasteMode || !this.copiedStyles) return false;
        if (this.isElementLocked(element)) {
            this.showFeedback('Cannot paste to locked element!', 'error');
            return false;
        }
        
        // Store original styles for undo
        if (!element.dataset.originalStyles) {
            const originalInlineStyles = {};
            
            const categoriesToPaste = this.batchPasteCategories || Object.keys(this.copiedStyles.categories);
            
            categoriesToPaste.forEach(cat => {
                const styles = this.copiedStyles.categories[cat];
                if (styles) {
                    Object.keys(styles).forEach(prop => {
                        originalInlineStyles[prop] = element.style[prop] || '';
                    });
                }
            });
            
            element.dataset.originalStyles = JSON.stringify(originalInlineStyles);
        }
        
        // Apply styles
        const categoriesToPaste = this.batchPasteCategories || Object.keys(this.copiedStyles.categories);
        
        categoriesToPaste.forEach(cat => {
            const styles = this.copiedStyles.categories[cat];
            if (styles) {
                Object.keys(styles).forEach(prop => {
                    element.style[prop] = styles[prop];
                });
            }
        });
        
        this.batchPastedElements.push(element);
        element.classList.add('batch-pasted');
        
        return this.batchPastedElements.length;
    }

    exitBatchPasteMode(save = true, doc = null) {
        this.batchPastedElements.forEach(el => {
            el.classList.remove('batch-pasted');
            delete el.dataset.originalStyles;
        });
        
        if (save && doc) {
            this.saveState(doc);
            this.showFeedback(`PASTED TO ${this.batchPastedElements.length} ELEMENTS!`);
        }
        
        this.batchPasteMode = false;
        this.batchPastedElements = [];
        this.batchPasteCategories = null;
    }

    cancelBatchPasteMode() {
        this.batchPastedElements.forEach(el => {
            if (el.dataset.originalStyles) {
                try {
                    const originalStyles = JSON.parse(el.dataset.originalStyles);
                    Object.keys(originalStyles).forEach(prop => {
                        if (originalStyles[prop] === '') {
                            el.style[prop] = '';
                        } else {
                            el.style[prop] = originalStyles[prop];
                        }
                    });
                    delete el.dataset.originalStyles;
                } catch (e) {
                    console.error('Failed to restore styles:', e);
                }
            }
            el.classList.remove('batch-pasted');
        });
        
        this.batchPasteMode = false;
        this.batchPastedElements = [];
        this.batchPasteCategories = null;
        this.showFeedback('BATCH PASTE CANCELLED!');
    }

    undoLastBatchPaste() {
        if (this.batchPastedElements.length === 0) return false;
        
        const lastElement = this.batchPastedElements.pop();
        
        if (!lastElement || !lastElement.parentNode) {
            return false;
        }
        
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
        this.showFeedback('UNDONE!');
        return true;
    }

    // ===== CLIPBOARD HISTORY =====

    addToClipboardHistory(styleData) {
        const name = this.generateStyleName(styleData);
        
        const historyItem = {
            id: Date.now(),
            name: name,
            data: JSON.parse(JSON.stringify(styleData)),
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.styleClipboardHistory.unshift(historyItem);
        
        if (this.styleClipboardHistory.length > this.config.maxClipboardHistory) {
            this.styleClipboardHistory.pop();
        }
        
        return historyItem;
    }

    generateStyleName(styleData) {
        const cats = Object.keys(styleData.categories);
        if (cats.length === 0) return 'Empty Style';
        if (cats.length === 7) return 'Complete Style';
        
        let colorInfo = '';
        if (styleData.categories.colors) {
            const bg = styleData.categories.colors.backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                colorInfo = bg.includes('rgb') ? 'Colored ' : '';
            }
        }
        
        return colorInfo + cats.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' + ');
    }

    getClipboardHistory() {
        return this.styleClipboardHistory;
    }

    pasteFromHistory(id, element, doc) {
        const item = this.styleClipboardHistory.find(i => i.id === id);
        if (!item || !element) return false;
        
        this.copiedStyles = item.data;
        return this.pasteStyle(element, null, doc);
    }

    deleteFromHistory(id) {
        this.styleClipboardHistory = this.styleClipboardHistory.filter(i => i.id !== id);
        return true;
    }

    renameHistoryItem(id, newName) {
        const item = this.styleClipboardHistory.find(i => i.id === id);
        if (!item) return false;
        
        item.name = newName.trim();
        return true;
    }

    // ===== DELETE ACTION =====

    deleteElement(element, doc) {
        if (!element) return false;
        if (this.isElementLocked(element)) {
            this.showFeedback('Cannot delete locked element! Unlock it first.', 'error');
            return false;
        }
        
        this.lockedElements.delete(element);
        element.remove();
        
        if (this.selectedElement === element) {
            this.selectedElement = null;
        }
        
        this.saveState(doc);
        this.showFeedback('ELEMENT DELETED!');
        return true;
    }

    // ===== COPY HTML ACTION =====

    copyHTML(element) {
        if (!element) return false;
        
        element.classList.remove('active-inspect');
        const code = element.outerHTML;
        element.classList.add('active-inspect');
        
        return code;
    }

    // ===== EXPORT ACTION =====

    exportDocument(doc, filename = 'edited-design.html') {
        const inspectorStyle = doc.querySelector('style[data-inspector="true"]');
        if (inspectorStyle) inspectorStyle.remove();
        
        const html = doc.documentElement.outerHTML;
        
        return {
            html: html,
            filename: filename,
            blob: new Blob([html], { type: 'text/html' })
        };
    }

    // ===== DRAG & DROP ACTIONS =====

    initDragDrop(doc) {
        doc.body.addEventListener('mousedown', (e) => this.handleDragStart(e, doc));
        doc.body.addEventListener('mousemove', (e) => this.handleDragMove(e, doc));
        doc.body.addEventListener('mouseup', (e) => this.handleDragEnd(e, doc));
    }

    handleDragStart(e, doc) {
        if (this.batchPasteMode || this.multiSelectMode) return;
        if (e.button !== 0) return;
        
        const element = e.target;
        
        if (this.isElementLocked(element)) return;
        if (['BODY', 'HTML', 'SCRIPT', 'STYLE'].includes(element.tagName)) return;
        
        this.draggedElement = element;
        this.dragStartPos.x = e.clientX;
        this.dragStartPos.y = e.clientY;
        this.hasMoved = false;
        
        const rect = element.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        
        e.preventDefault();
    }

    handleDragMove(e, doc) {
        if (!this.draggedElement) return;
        
        const deltaX = Math.abs(e.clientX - this.dragStartPos.x);
        const deltaY = Math.abs(e.clientY - this.dragStartPos.y);
        
        if (!this.isDragging && (deltaX > this.config.dragThreshold || deltaY > this.config.dragThreshold)) {
            this.isDragging = true;
            this.hasMoved = true;
            
            const computed = window.getComputedStyle(this.draggedElement);
            if (computed.position === 'static' || computed.position === 'relative') {
                const rect = this.draggedElement.getBoundingClientRect();
                const scrollX = doc.documentElement.scrollLeft || doc.body.scrollLeft;
                const scrollY = doc.documentElement.scrollTop || doc.body.scrollTop;
                
                const spacer = doc.createElement('div');
                spacer.className = 'drag-spacer';
                spacer.style.width = rect.width + 'px';
                spacer.style.height = rect.height + 'px';
                spacer.style.visibility = 'hidden';
                spacer.style.pointerEvents = 'none';
                this.draggedElement.parentNode.insertBefore(spacer, this.draggedElement);
                this.draggedElement.dataset.spacerId = 'spacer-' + Date.now();
                spacer.dataset.spacerId = this.draggedElement.dataset.spacerId;
                
                this.draggedElement.dataset.originalPosition = computed.position;
                this.draggedElement.dataset.originalTop = this.draggedElement.style.top || '';
                this.draggedElement.dataset.originalLeft = this.draggedElement.style.left || '';
                this.draggedElement.dataset.originalMargin = this.draggedElement.style.margin || '';
                this.draggedElement.dataset.originalWidth = this.draggedElement.style.width || '';
                this.draggedElement.dataset.originalHeight = this.draggedElement.style.height || '';
                
                this.draggedElement.style.position = 'absolute';
                this.draggedElement.style.left = (rect.left + scrollX) + 'px';
                this.draggedElement.style.top = (rect.top + scrollY) + 'px';
                this.draggedElement.style.margin = '0';
                this.draggedElement.style.width = rect.width + 'px';
                this.draggedElement.style.height = rect.height + 'px';
            }
            
            this.draggedElement.classList.add('dragging');
            this.draggedElement.style.cursor = 'move';
            this.draggedElement.style.zIndex = '9999';
        }
        
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        const scrollX = doc.documentElement.scrollLeft || doc.body.scrollLeft;
        const scrollY = doc.documentElement.scrollTop || doc.body.scrollTop;
        
        const newLeft = e.clientX - this.dragOffset.x + scrollX;
        const newTop = e.clientY - this.dragOffset.y + scrollY;
        
        this.draggedElement.style.left = newLeft + 'px';
        this.draggedElement.style.top = newTop + 'px';
    }

    handleDragEnd(e, doc) {
        if (!this.draggedElement) return;
        
        if (!this.hasMoved) {
            this.draggedElement = null;
            this.isDragging = false;
            return;
        }
        
        if (this.isDragging) {
            this.isDragging = false;
            this.draggedElement.classList.remove('dragging');
            this.draggedElement.style.cursor = '';
            
            if (this.draggedElement.dataset.spacerId) {
                const spacer = doc.querySelector(`[data-spacer-id="${this.draggedElement.dataset.spacerId}"]`);
                if (spacer) spacer.remove();
                delete this.draggedElement.dataset.spacerId;
            }
            
            this.saveState(doc);
            this.showFeedback('ELEMENT MOVED!');
        }
        
        this.draggedElement = null;
    }

    // ===== UTILITY: GET ELEMENT STYLES =====

    getElementStyles(element) {
        if (!element) return null;
        
        const computed = window.getComputedStyle(element);
        const inline = element.style;
        
        return {
            text: element.innerText || "",
            fontFamily: computed.fontFamily,
            fontSize: parseInt(computed.fontSize),
            fontWeight: computed.fontWeight,
            color: this.rgbToHex(computed.color),
            backgroundColor: this.rgbToHex(computed.backgroundColor),
            padding: parseInt(computed.padding),
            margin: parseInt(computed.margin),
            width: computed.width === 'auto' ? 'auto' : parseInt(computed.width),
            height: computed.height === 'auto' ? 'auto' : parseInt(computed.height),
            borderWidth: parseInt(computed.borderWidth) || 0,
            borderStyle: computed.borderStyle,
            borderColor: this.rgbToHex(computed.borderColor),
            borderRadius: parseInt(computed.borderRadius) || 0,
            textAlign: computed.textAlign,
            display: computed.display,
            zIndex: this.normalizeZIndex(element)
        };
    }

    applyElementStyles(element, styles, doc) {
        if (!element || !styles) return false;
        if (this.isElementLocked(element)) {
            this.showFeedback('Cannot modify locked element!', 'error');
            return false;
        }
        
        if (styles.text !== undefined) element.innerText = styles.text;
        if (styles.fontFamily) element.style.fontFamily = styles.fontFamily;
        if (styles.fontSize) element.style.fontSize = styles.fontSize + 'px';
        if (styles.fontWeight) element.style.fontWeight = styles.fontWeight;
        if (styles.color) element.style.color = styles.color;
        if (styles.backgroundColor) element.style.backgroundColor = styles.backgroundColor;
        if (styles.padding !== undefined) element.style.padding = styles.padding + 'px';
        if (styles.margin !== undefined) element.style.margin = styles.margin + 'px';
        if (styles.width) element.style.width = styles.width === 'auto' ? 'auto' : styles.width + 'px';
        if (styles.height) element.style.height = styles.height === 'auto' ? 'auto' : styles.height + 'px';
        if (styles.borderWidth !== undefined) element.style.borderWidth = styles.borderWidth + 'px';
        if (styles.borderStyle) element.style.borderStyle = styles.borderStyle;
        if (styles.borderColor) element.style.borderColor = styles.borderColor;
        if (styles.borderRadius !== undefined) element.style.borderRadius = styles.borderRadius + 'px';
        if (styles.textAlign) element.style.textAlign = styles.textAlign;
        if (styles.display) element.style.display = styles.display;
        if (styles.zIndex !== undefined) element.style.zIndex = styles.zIndex;
        
        this.saveState(doc);
        return true;
    }
}

// Export for ES6 modules
export { InspectorActions };
export default InspectorActions;

// Also support CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InspectorActions;
    module.exports.InspectorActions = InspectorActions;
}
