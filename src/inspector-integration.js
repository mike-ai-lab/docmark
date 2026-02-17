/**
 * INSPECTOR INTEGRATION - CLEAN IMPLEMENTATION
 * Replaces buggy panel with modular actions
 */

import InspectorActions from './inspector-actions.js';
import { updatePanelForElement, showEmptyState } from './inspector-panel-ui.js';

let inspectorInstance = null;
let currentDoc = null;

// Make inspector globally accessible for testing AND console
window.getInspector = () => inspectorInstance;
window.getCurrentDoc = () => currentDoc;
window.inspector = null; // Will be set after initialization
window.doc = null; // Will be set after initialization

export function initializeInspector(iframeDoc) {
    if (!iframeDoc) return;
    
    currentDoc = iframeDoc;
    
    // Initialize inspector actions
    if (!inspectorInstance) {
        inspectorInstance = new InspectorActions({
            maxHistory: 50,
            maxClipboardHistory: 10,
            dragThreshold: 5,
            onFeedback: (message, type) => {
                showToast(message, type);
            },
            onStateChange: (action, index, total) => {
                console.log(`Inspector: ${action} - ${index}/${total}`);
            }
        });
        
        // Expose globally for console testing
        window.inspector = inspectorInstance;
        window.doc = currentDoc;
    }
    
    // Add inspector styles to iframe
    addInspectorStyles(iframeDoc);
    
    // Setup click handler
    setupClickHandler(iframeDoc);
    
    // Initialize drag & drop
    inspectorInstance.initDragDrop(iframeDoc);
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    console.log('✅ Inspector initialized with panel UI');
}

function addInspectorStyles(doc) {
    const existingStyle = doc.querySelector('style[data-inspector="true"]');
    if (existingStyle) existingStyle.remove();
    
    const style = doc.createElement('style');
    style.setAttribute('data-inspector', 'true');
    style.textContent = `
        * { transition: outline 0.1s; }
        *.active-inspect { outline: 3px solid #ff9800 !important; outline-offset: -3px; z-index: 9999; }
        *.locked-element { outline: 2px dashed #ff5722 !important; outline-offset: -2px; pointer-events: none; }
        *.multi-selected { outline: 3px solid #2196f3 !important; outline-offset: -3px; background: rgba(33, 150, 243, 0.1) !important; }
        *.grouped-element { outline: 2px solid #9c27b0 !important; outline-offset: -2px; }
        *.batch-pasted { outline: 3px solid #4caf50 !important; outline-offset: -3px; }
        *.arrange-applied { outline: 3px solid #4caf50 !important; outline-offset: 2px; }
        *.arrange-hover { outline: 3px solid #0288d1 !important; outline-offset: 2px; background: rgba(2, 136, 209, 0.1) !important; }
        *.dragging { opacity: 0.8; cursor: move !important; box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important; }
    `;
    doc.head.appendChild(style);
}

function setupClickHandler(doc) {
    // Left click - select element
    doc.body.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const clickedElement = e.target;
        
        // Handle multi-select mode
        if (inspectorInstance.multiSelectMode) {
            inspectorInstance.toggleMultiSelect(clickedElement);
            return;
        }
        
        // Handle arrange mode
        if (inspectorInstance.arrangeMode) {
            inspectorInstance.arrangeAboveElement(clickedElement, doc);
            return;
        }
        
        // Handle batch paste mode
        if (inspectorInstance.batchPasteMode) {
            inspectorInstance.batchPasteToElement(clickedElement, doc);
            return;
        }

        // Normal selection
        inspectorInstance.selectElement(clickedElement);
        updatePanelForElement(clickedElement);
    });
    
    // Right click - context menu
    doc.body.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const clickedElement = e.target;
        
        // Select element first
        inspectorInstance.selectElement(clickedElement);
        updatePanelForElement(clickedElement);
        
        // Convert iframe coordinates to window coordinates
        const iframe = doc.defaultView.frameElement;
        const iframeRect = iframe.getBoundingClientRect();
        const windowX = iframeRect.left + e.clientX;
        const windowY = iframeRect.top + e.clientY;
        
        // Show context menu at cursor position
        inspectorInstance.showContextMenu(windowX, windowY, clickedElement, doc);
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!currentDoc || !inspectorInstance) return;
        
        // Undo/Redo
        if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            inspectorInstance.undo(currentDoc);
        } else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            inspectorInstance.redo(currentDoc);
        }
        
        // Delete
        if (e.key === 'Delete' && inspectorInstance.selectedElement) {
            e.preventDefault();
            if (confirm('Delete this element?')) {
                inspectorInstance.deleteElement(inspectorInstance.selectedElement, currentDoc);
                showEmptyState();
            }
        }
        
        // Escape to exit modes
        if (e.key === 'Escape') {
            if (inspectorInstance.batchPasteMode) {
                inspectorInstance.cancelBatchPasteMode();
            }
            if (inspectorInstance.arrangeMode) {
                inspectorInstance.cancelArrangeMode();
            }
            if (inspectorInstance.multiSelectMode) {
                inspectorInstance.exitMultiSelectMode();
            }
        }
    });
}

function showToast(message, type = 'success') {
    // Use existing toast system if available
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Export inspector instance for external access
export function getInspector() {
    return inspectorInstance;
}

export function getCurrentDoc() {
    return currentDoc;
}
