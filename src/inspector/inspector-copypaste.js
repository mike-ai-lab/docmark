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
    }
    
    init() {
        this.copyButton = document.getElementById('inspector-copy-style-btn');
        this.pasteButton = document.getElementById('inspector-paste-style-btn');
        
        if (!this.copyButton) return false;
        
        this.setupEventListeners();
        document.addEventListener('inspector:selectionchange', this.updateButtonState.bind(this));
        
        return true;
    }
    
    setupEventListeners() {
        this.copyButton.addEventListener('click', () => this.copyStyles());
        if (this.pasteButton) {
            this.pasteButton.addEventListener('click', () => this.pasteStyles());
        }
    }
    
    copyStyles() {
        const element = inspector.selectedElement;
        if (!element) return;
        
        const elementWindow = element.ownerDocument.defaultView || window;
        const computed = elementWindow.getComputedStyle(element);
        
        this.copiedStyles = {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontFamily: computed.fontFamily,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            textAlign: computed.textAlign,
            padding: computed.padding,
            margin: computed.margin,
            width: computed.width,
            height: computed.height,
            display: computed.display,
            borderWidth: computed.borderWidth,
            borderStyle: computed.borderStyle,
            borderColor: computed.borderColor,
            borderRadius: computed.borderRadius
        };
        
        this.addToHistory(this.copiedStyles);
        this.updateButtonState();
        
        const event = new CustomEvent('inspector:message', {
            detail: { message: 'Styles copied' }
        });
        document.dispatchEvent(event);
    }
    
    pasteStyles() {
        const element = inspector.selectedElement;
        if (!element || !this.copiedStyles) return;
        if (inspector.isElementLocked(element)) {
            const event = new CustomEvent('inspector:message', {
                detail: { message: 'Cannot paste to locked element' }
            });
            document.dispatchEvent(event);
            return;
        }
        
        Object.keys(this.copiedStyles).forEach(prop => {
            element.style[prop] = this.copiedStyles[prop];
        });
        
        const event = new CustomEvent('inspector:message', {
            detail: { message: 'Styles pasted' }
        });
        document.dispatchEvent(event);
        
        inspector.notifySelectionChange();
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
