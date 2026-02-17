/**
 * Inspector UI Module
 * Manages the inspector panel UI and updates
 */

import inspector from './inspector-core.js';

class InspectorUI {
    constructor() {
        this.panel = null;
        this.editorSection = null;
        this.emptySection = null;
        this.inputs = {};
    }
    
    /**
     * Initialize UI bindings
     */
    init() {
        this.panel = document.getElementById('inspector-panel');
        this.editorSection = document.getElementById('inspector-editor');
        this.emptySection = document.getElementById('inspector-empty');
        
        if (!this.panel) {
            console.error('Inspector panel not found');
            return false;
        }
        
        // Cache input references
        this.cacheInputs();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Listen for inspector events
        document.addEventListener('inspector:selectionchange', this.handleSelectionChange.bind(this));
        document.addEventListener('inspector:modechange', this.handleModeChange.bind(this));
        
        console.log('Inspector UI initialized');
        return true;
    }
    
    /**
     * Cache input element references
     */
    cacheInputs() {
        this.inputs = {
            tag: document.getElementById('inspector-tag'),
            text: document.getElementById('inspector-text'),
            fontFamily: document.getElementById('inspector-font-family'),
            fontSize: document.getElementById('inspector-font-size'),
            fontWeight: document.getElementById('inspector-font-weight'),
            textAlign: document.getElementById('inspector-text-align'),
            color: document.getElementById('inspector-color'),
            backgroundColor: document.getElementById('inspector-bg-color'),
            padding: document.getElementById('inspector-padding'),
            margin: document.getElementById('inspector-margin'),
            width: document.getElementById('inspector-width'),
            height: document.getElementById('inspector-height'),
            display: document.getElementById('inspector-display'),
            borderWidth: document.getElementById('inspector-border-width'),
            borderStyle: document.getElementById('inspector-border-style'),
            borderColor: document.getElementById('inspector-border-color'),
            borderRadius: document.getElementById('inspector-border-radius')
        };
    }
    
    /**
     * Setup event listeners for inputs
     */
    setupEventListeners() {
        // Text content
        if (this.inputs.text) {
            this.inputs.text.addEventListener('input', (e) => {
                if (inspector.selectedElement && !inspector.isElementLocked(inspector.selectedElement)) {
                    inspector.selectedElement.textContent = e.target.value;
                }
            });
        }
        
        // Font family
        if (this.inputs.fontFamily) {
            this.inputs.fontFamily.addEventListener('change', (e) => {
                this.updateStyle('fontFamily', e.target.value);
            });
        }
        
        // Font size
        if (this.inputs.fontSize) {
            this.inputs.fontSize.addEventListener('input', (e) => {
                this.updateStyle('fontSize', e.target.value + 'px');
            });
        }
        
        // Font weight
        if (this.inputs.fontWeight) {
            this.inputs.fontWeight.addEventListener('change', (e) => {
                this.updateStyle('fontWeight', e.target.value);
            });
        }
        
        // Text align
        if (this.inputs.textAlign) {
            this.inputs.textAlign.addEventListener('change', (e) => {
                this.updateStyle('textAlign', e.target.value);
            });
        }
        
        // Color
        if (this.inputs.color) {
            this.inputs.color.addEventListener('input', (e) => {
                this.updateStyle('color', e.target.value);
            });
        }
        
        // Background color
        if (this.inputs.backgroundColor) {
            this.inputs.backgroundColor.addEventListener('input', (e) => {
                this.updateStyle('backgroundColor', e.target.value);
            });
        }
        
        // Padding
        if (this.inputs.padding) {
            this.inputs.padding.addEventListener('input', (e) => {
                this.updateStyle('padding', e.target.value + 'px');
            });
        }
        
        // Margin
        if (this.inputs.margin) {
            this.inputs.margin.addEventListener('input', (e) => {
                this.updateStyle('margin', e.target.value + 'px');
            });
        }
        
        // Width
        if (this.inputs.width) {
            this.inputs.width.addEventListener('input', (e) => {
                const value = e.target.value;
                this.updateStyle('width', value === 'auto' ? 'auto' : value + 'px');
            });
        }
        
        // Height
        if (this.inputs.height) {
            this.inputs.height.addEventListener('input', (e) => {
                const value = e.target.value;
                this.updateStyle('height', value === 'auto' ? 'auto' : value + 'px');
            });
        }
        
        // Display
        if (this.inputs.display) {
            this.inputs.display.addEventListener('change', (e) => {
                this.updateStyle('display', e.target.value);
            });
        }
        
        // Border width
        if (this.inputs.borderWidth) {
            this.inputs.borderWidth.addEventListener('input', (e) => {
                this.updateStyle('borderWidth', e.target.value + 'px');
            });
        }
        
        // Border style
        if (this.inputs.borderStyle) {
            this.inputs.borderStyle.addEventListener('change', (e) => {
                this.updateStyle('borderStyle', e.target.value);
            });
        }
        
        // Border color
        if (this.inputs.borderColor) {
            this.inputs.borderColor.addEventListener('input', (e) => {
                this.updateStyle('borderColor', e.target.value);
            });
        }
        
        // Border radius
        if (this.inputs.borderRadius) {
            this.inputs.borderRadius.addEventListener('input', (e) => {
                this.updateStyle('borderRadius', e.target.value + 'px');
            });
        }
    }
    
    /**
     * Update element style
     */
    updateStyle(property, value) {
        if (!inspector.selectedElement) return;
        if (inspector.isElementLocked(inspector.selectedElement)) return;
        
        inspector.selectedElement.style[property] = value;
    }
    
    /**
     * Handle selection change
     */
    handleSelectionChange(e) {
        const { selectedElement, selectedElements, multiSelectMode } = e.detail;
        
        if (multiSelectMode && selectedElements.length > 0) {
            this.showMultiSelectInfo(selectedElements);
        } else if (selectedElement) {
            this.showElementEditor(selectedElement);
        } else {
            this.showEmpty();
        }
    }
    
    /**
     * Show element editor
     */
    showElementEditor(element) {
        if (!this.editorSection || !this.emptySection) return;
        
        this.emptySection.style.display = 'none';
        this.editorSection.style.display = 'block';
        
        // Get computed styles from the element's document window
        const elementWindow = element.ownerDocument.defaultView || window;
        const computed = elementWindow.getComputedStyle(element);
        
        // Update inputs
        if (this.inputs.tag) {
            this.inputs.tag.value = element.tagName.toLowerCase();
        }
        
        if (this.inputs.text) {
            this.inputs.text.value = element.textContent || '';
        }
        
        if (this.inputs.fontFamily) {
            this.inputs.fontFamily.value = computed.fontFamily;
        }
        
        if (this.inputs.fontSize) {
            this.inputs.fontSize.value = parseInt(computed.fontSize);
        }
        
        if (this.inputs.fontWeight) {
            this.inputs.fontWeight.value = computed.fontWeight;
        }
        
        if (this.inputs.textAlign) {
            this.inputs.textAlign.value = computed.textAlign;
        }
        
        if (this.inputs.color) {
            this.inputs.color.value = this.rgbToHex(computed.color);
        }
        
        if (this.inputs.backgroundColor) {
            this.inputs.backgroundColor.value = this.rgbToHex(computed.backgroundColor);
        }
        
        if (this.inputs.padding) {
            this.inputs.padding.value = parseInt(computed.padding) || 0;
        }
        
        if (this.inputs.margin) {
            this.inputs.margin.value = parseInt(computed.margin) || 0;
        }
        
        if (this.inputs.width) {
            this.inputs.width.value = computed.width === 'auto' ? 'auto' : parseInt(computed.width);
        }
        
        if (this.inputs.height) {
            this.inputs.height.value = computed.height === 'auto' ? 'auto' : parseInt(computed.height);
        }
        
        if (this.inputs.display) {
            this.inputs.display.value = computed.display;
        }
        
        if (this.inputs.borderWidth) {
            this.inputs.borderWidth.value = parseInt(computed.borderWidth) || 0;
        }
        
        if (this.inputs.borderStyle) {
            this.inputs.borderStyle.value = computed.borderStyle;
        }
        
        if (this.inputs.borderColor) {
            this.inputs.borderColor.value = this.rgbToHex(computed.borderColor);
        }
        
        if (this.inputs.borderRadius) {
            this.inputs.borderRadius.value = parseInt(computed.borderRadius) || 0;
        }
    }
    
    /**
     * Show multi-select info
     */
    showMultiSelectInfo(elements) {
        if (!this.editorSection || !this.emptySection) return;
        
        this.emptySection.style.display = 'none';
        this.editorSection.style.display = 'block';
        
        // Show multi-select message
        if (this.inputs.tag) {
            this.inputs.tag.value = `${elements.length} elements selected`;
        }
    }
    
    /**
     * Show empty state
     */
    showEmpty() {
        if (!this.editorSection || !this.emptySection) return;
        
        this.editorSection.style.display = 'none';
        this.emptySection.style.display = 'block';
    }
    
    /**
     * Handle mode change
     */
    handleModeChange(e) {
        const { mode, active } = e.detail;
        console.log(`Inspector mode: ${mode} = ${active}`);
    }
    
    /**
     * Convert RGB to Hex
     */
    rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) {
            return '#ffffff';
        }
        const match = rgb.match(/\d+/g);
        if (!match) return '#ffffff';
        
        return '#' + match.slice(0, 3)
            .map(x => parseInt(x).toString(16).padStart(2, '0'))
            .join('');
    }
}

// Export singleton instance
export const inspectorUI = new InspectorUI();
export default inspectorUI;
