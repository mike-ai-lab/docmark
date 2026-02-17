/**
 * CLEAN PROFESSIONAL INSPECTOR PANEL UI
 * Wires the panel to InspectorActions
 */

import { getInspector, getCurrentDoc } from './inspector-integration.js';

let panelVisible = false;
let currentElement = null;

export function initInspectorPanel() {
    const panel = document.getElementById('inspector-panel');
    const toggleBtn = document.getElementById('inspector-toggle-btn');
    const closeBtn = document.getElementById('inspector-close-btn');
    const undoBtn = document.getElementById('inspector-undo-btn');
    const redoBtn = document.getElementById('inspector-redo-btn');
    const emptyState = document.getElementById('inspector-empty');
    const editorState = document.getElementById('inspector-editor');
    
    if (!panel || !toggleBtn) {
        console.warn('Inspector panel elements not found');
        return;
    }
    
    // Toggle panel
    toggleBtn.addEventListener('click', () => {
        panelVisible = !panelVisible;
        if (panelVisible) {
            panel.classList.remove('hidden');
            toggleBtn.classList.add('active');
        } else {
            panel.classList.add('hidden');
            toggleBtn.classList.remove('active');
        }
    });
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panelVisible = false;
            panel.classList.add('hidden');
            toggleBtn.classList.remove('active');
        });
    }
    
    // Undo button
    if (undoBtn) {
        undoBtn.addEventListener('click', () => {
            const inspector = getInspector();
            const doc = getCurrentDoc();
            if (inspector && doc) {
                inspector.undo(doc);
                updateUndoRedoButtons();
            }
        });
    }
    
    // Redo button
    if (redoBtn) {
        redoBtn.addEventListener('click', () => {
            const inspector = getInspector();
            const doc = getCurrentDoc();
            if (inspector && doc) {
                inspector.redo(doc);
                updateUndoRedoButtons();
            }
        });
    }
    
    // Wire up all action buttons
    wireActionButtons();
    
    // Wire up style inputs
    wireStyleInputs();
    
    // Update undo/redo buttons periodically
    setInterval(updateUndoRedoButtons, 500);
    
    console.log('✅ Inspector panel UI initialized');
}

function updateUndoRedoButtons() {
    const inspector = getInspector();
    const undoBtn = document.getElementById('inspector-undo-btn');
    const redoBtn = document.getElementById('inspector-redo-btn');
    
    if (inspector && undoBtn && redoBtn) {
        undoBtn.disabled = inspector.historyIndex <= 0;
        redoBtn.disabled = inspector.historyIndex >= inspector.history.length - 1;
    }
}

export function showInspectorToggle() {
    const toggleBtn = document.getElementById('inspector-toggle-btn');
    if (toggleBtn) {
        toggleBtn.style.display = 'flex';
    }
}

export function hideInspectorToggle() {
    const toggleBtn = document.getElementById('inspector-toggle-btn');
    const panel = document.getElementById('inspector-panel');
    if (toggleBtn) {
        toggleBtn.style.display = 'none';
        toggleBtn.classList.remove('active');
    }
    if (panel) {
        panel.classList.add('hidden');
    }
    panelVisible = false;
}

export function updatePanelForElement(element) {
    if (!element) return;
    
    // Store element reference globally so inputs can access it
    currentElement = element;
    window.__inspectorCurrentElement = element; // Make it globally accessible
    
    const emptyState = document.getElementById('inspector-empty');
    const editorState = document.getElementById('inspector-editor');
    
    if (emptyState) emptyState.classList.add('hidden');
    if (editorState) editorState.classList.remove('hidden');
    
    // Populate fields
    populateFields(element);
    
    // Update button states
    updateButtonStates();
    
    // Show toast with element info
    showToast(`Selected: ${element.tagName.toLowerCase()}`, 'info');
}

export function showEmptyState() {
    const emptyState = document.getElementById('inspector-empty');
    const editorState = document.getElementById('inspector-editor');
    
    if (emptyState) emptyState.classList.remove('hidden');
    if (editorState) editorState.classList.add('hidden');
    
    currentElement = null;
}

function populateFields(element) {
    const computed = window.getComputedStyle(element);
    
    // Element info
    const tagInput = document.getElementById('insp-tag');
    const textInput = document.getElementById('insp-text');
    if (tagInput) tagInput.value = element.tagName.toLowerCase();
    if (textInput) textInput.value = element.textContent || '';
    
    // Typography
    const fontSizeInput = document.getElementById('insp-font-size');
    const fontWeightInput = document.getElementById('insp-font-weight');
    if (fontSizeInput) fontSizeInput.value = parseInt(computed.fontSize);
    if (fontWeightInput) fontWeightInput.value = computed.fontWeight;
    
    // Colors
    const colorInput = document.getElementById('insp-color');
    const bgInput = document.getElementById('insp-bg');
    if (colorInput) colorInput.value = rgbToHex(computed.color);
    if (bgInput) bgInput.value = rgbToHex(computed.backgroundColor);
    
    // Spacing
    const paddingInput = document.getElementById('insp-padding');
    const marginInput = document.getElementById('insp-margin');
    if (paddingInput) paddingInput.value = parseInt(computed.padding) || 0;
    if (marginInput) marginInput.value = parseInt(computed.margin) || 0;
    
    // Border
    const borderWidthInput = document.getElementById('insp-border-width');
    const borderStyleInput = document.getElementById('insp-border-style');
    const borderColorInput = document.getElementById('insp-border-color');
    const borderRadiusInput = document.getElementById('insp-border-radius');
    if (borderWidthInput) borderWidthInput.value = parseInt(computed.borderWidth) || 0;
    if (borderStyleInput) borderStyleInput.value = computed.borderStyle;
    if (borderColorInput) borderColorInput.value = rgbToHex(computed.borderColor);
    if (borderRadiusInput) borderRadiusInput.value = parseInt(computed.borderRadius) || 0;
}

function updateButtonStates() {
    const inspector = window.getInspector ? window.getInspector() : getInspector();
    const element = window.__inspectorCurrentElement || currentElement;
    if (!inspector || !element) return;
    
    // Update lock button
    const lockBtn = document.getElementById('btn-lock');
    if (lockBtn) {
        const isLocked = inspector.isElementLocked(element);
        lockBtn.textContent = isLocked ? '🔓 Unlock Element' : '🔒 Lock Element';
        lockBtn.classList.toggle('active', isLocked);
    }
    
    // Show paste button if styles are copied
    const pasteBtn = document.getElementById('btn-paste-style');
    if (pasteBtn) {
        pasteBtn.classList.toggle('hidden', !inspector.copiedStyles);
    }
}

function wireActionButtons() {
    console.log('🔧 Wiring action buttons...');
    // Get fresh references for each button click
    const getReferences = () => ({
        inspector: window.getInspector ? window.getInspector() : getInspector(),
        doc: window.getCurrentDoc ? window.getCurrentDoc() : getCurrentDoc(),
        element: window.__inspectorCurrentElement || currentElement
    });
    
    // Arrange buttons
    const btnToFront = document.getElementById('btn-to-front');
    console.log('🔧 btn-to-front:', btnToFront);
    btnToFront?.addEventListener('click', () => {
        console.log('🔥 TO FRONT CLICKED!');
        const { inspector, doc, element } = getReferences();
        console.log('🔧 References:', { inspector, doc, element });
        if (inspector && element && doc) {
            inspector.bringToFront(element, doc);
            showToast('Brought to front');
        }
    });
    
    document.getElementById('btn-forward')?.addEventListener('click', () => {
        const { inspector, doc, element } = getReferences();
        if (inspector && element && doc) {
            inspector.bringForward(element, doc);
            showToast('Brought forward');
        }
    });
    
    document.getElementById('btn-backward')?.addEventListener('click', () => {
        const { inspector, doc, element } = getReferences();
        if (inspector && element && doc) {
            inspector.sendBackward(element, doc);
            showToast('Sent backward');
        }
    });
    
    document.getElementById('btn-to-back')?.addEventListener('click', () => {
        const { inspector, doc, element } = getReferences();
        if (inspector && element && doc) {
            inspector.sendToBack(element, doc);
            showToast('Sent to back');
        }
    });
    
    document.getElementById('btn-arrange-mode')?.addEventListener('click', () => {
        const { inspector, element } = getReferences();
        if (inspector && element) {
            inspector.startArrangeMode(element);
            showToast('Arrange mode: Click elements to position above them');
        }
    });
    
    // Action buttons
    document.getElementById('btn-lock')?.addEventListener('click', () => {
        const { inspector, element } = getReferences();
        if (inspector && element) {
            inspector.toggleLock(element);
            updateButtonStates();
        }
    });
    
    document.getElementById('btn-multi-select')?.addEventListener('click', () => {
        const { inspector } = getReferences();
        if (inspector) {
            inspector.startMultiSelectMode();
            showToast('Multi-select mode: Click elements to select multiple');
        }
    });
    
    document.getElementById('btn-copy-style')?.addEventListener('click', () => {
        const { inspector, element } = getReferences();
        if (inspector && element) {
            inspector.showCopyStyleModal();
        }
    });
    
    document.getElementById('btn-paste-style')?.addEventListener('click', () => {
        const { inspector, doc, element } = getReferences();
        if (inspector && element && doc) {
            inspector.showPasteStyleModal();
        }
    });
    
    document.getElementById('btn-delete')?.addEventListener('click', () => {
        const { inspector, doc, element } = getReferences();
        if (inspector && element && doc) {
            if (confirm('Delete this element?')) {
                inspector.deleteElement(element, doc);
                showEmptyState();
                showToast('Element deleted');
            }
        }
    });
    
    document.getElementById('btn-copy-html')?.addEventListener('click', () => {
        const { inspector, element } = getReferences();
        if (inspector && element) {
            const html = inspector.copyHTML(element);
            navigator.clipboard.writeText(html).then(() => {
                showToast('HTML copied to clipboard!');
            });
        }
    });
}

function wireStyleInputs() {
    // Wire inputs with live updates
    const inputs = [
        { id: 'insp-text', prop: 'textContent', isText: true },
        { id: 'insp-font-size', prop: 'fontSize', unit: 'px' },
        { id: 'insp-font-weight', prop: 'fontWeight' },
        { id: 'insp-color', prop: 'color' },
        { id: 'insp-bg', prop: 'backgroundColor' },
        { id: 'insp-padding', prop: 'padding', unit: 'px' },
        { id: 'insp-margin', prop: 'margin', unit: 'px' },
        { id: 'insp-border-width', prop: 'borderWidth', unit: 'px' },
        { id: 'insp-border-style', prop: 'borderStyle' },
        { id: 'insp-border-color', prop: 'borderColor' },
        { id: 'insp-border-radius', prop: 'borderRadius', unit: 'px' }
    ];
    
    inputs.forEach(({ id, prop, unit, isText }) => {
        const input = document.getElementById(id);
        if (!input) return;
        
        // Live update on input
        input.addEventListener('input', (e) => {
            // Get fresh references each time
            const element = window.__inspectorCurrentElement || currentElement;
            const inspector = window.getInspector ? window.getInspector() : getInspector();
            const doc = window.getCurrentDoc ? window.getCurrentDoc() : getCurrentDoc();
            
            console.log('🔧 Input changed:', id, 'value:', e.target.value);
            console.log('🔧 element:', element);
            console.log('🔧 inspector:', inspector);
            console.log('🔧 doc:', doc);
            
            if (!element || !inspector || !doc) {
                console.error('❌ Missing:', { element, inspector, doc });
                return;
            }
            
            if (inspector.isElementLocked(element)) {
                showToast('Element is locked!', 'error');
                console.warn('⚠️ Element is locked');
                return;
            }
            
            const value = e.target.value;
            console.log('✅ Applying:', prop, '=', value);
            
            if (isText) {
                element.textContent = value;
                console.log('✅ Set textContent to:', value);
            } else {
                const finalValue = unit ? value + unit : value;
                element.style[prop] = finalValue;
                console.log('✅ Set style.' + prop + ' to:', finalValue);
            }
        });
        
        // Save state on change
        input.addEventListener('change', () => {
            const inspector = window.getInspector ? window.getInspector() : getInspector();
            const doc = window.getCurrentDoc ? window.getCurrentDoc() : getCurrentDoc();
            if (inspector && doc) {
                inspector.saveState(doc);
            }
        });
    });
}

function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
    const res = rgb.match(/\d+/g);
    return res ? "#" + res.slice(0,3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : '#ffffff';
}

function showToast(message) {
    // Use existing toast system if available
    if (typeof window.showToast === 'function') {
        window.showToast(message, 'success');
    } else {
        console.log('✅', message);
    }
}
