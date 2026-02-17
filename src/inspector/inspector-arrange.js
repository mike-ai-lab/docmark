/**
 * Inspector Arrange Module
 * Handles z-index arrangement of elements
 */

import inspector from './inspector-core.js';

class InspectorArrange {
    constructor() {
        this.bringFrontBtn = null;
        this.sendBackBtn = null;
        this.bringForwardBtn = null;
        this.sendBackwardBtn = null;
    }
    
    init() {
        this.bringFrontBtn = document.getElementById('inspector-bring-front-btn');
        this.sendBackBtn = document.getElementById('inspector-send-back-btn');
        this.bringForwardBtn = document.getElementById('inspector-bring-forward-btn');
        this.sendBackwardBtn = document.getElementById('inspector-send-backward-btn');
        
        if (!this.bringFrontBtn) {
            console.warn('Arrange buttons not found');
            return false;
        }
        
        this.setupEventListeners();
        document.addEventListener('inspector:selectionchange', this.updateButtonState.bind(this));
        
        console.log('Inspector arrange module initialized');
        return true;
    }
    
    setupEventListeners() {
        if (this.bringFrontBtn) {
            this.bringFrontBtn.addEventListener('click', () => this.bringToFront());
        }
        
        if (this.sendBackBtn) {
            this.sendBackBtn.addEventListener('click', () => this.sendToBack());
        }
        
        if (this.bringForwardBtn) {
            this.bringForwardBtn.addEventListener('click', () => this.bringForward());
        }
        
        if (this.sendBackwardBtn) {
            this.sendBackwardBtn.addEventListener('click', () => this.sendBackward());
        }
    }
    
    bringToFront() {
        const elements = inspector.multiSelectMode && inspector.selectedElements.length > 0
            ? inspector.selectedElements
            : (inspector.selectedElement ? [inspector.selectedElement] : []);
        
        if (elements.length === 0) return;
        
        const maxZ = this.getMaxZIndex();
        
        elements.forEach(el => {
            if (inspector.isElementLocked(el)) return;
            el.style.zIndex = maxZ + 1;
        });
        
        this.showMessage(`Brought ${elements.length} element(s) to front`);
    }
    
    sendToBack() {
        const elements = inspector.multiSelectMode && inspector.selectedElements.length > 0
            ? inspector.selectedElements
            : (inspector.selectedElement ? [inspector.selectedElement] : []);
        
        if (elements.length === 0) return;
        
        const minZ = this.getMinZIndex();
        
        elements.forEach(el => {
            if (inspector.isElementLocked(el)) return;
            el.style.zIndex = minZ - 1;
        });
        
        this.showMessage(`Sent ${elements.length} element(s) to back`);
    }
    
    bringForward() {
        const elements = inspector.multiSelectMode && inspector.selectedElements.length > 0
            ? inspector.selectedElements
            : (inspector.selectedElement ? [inspector.selectedElement] : []);
        
        if (elements.length === 0) return;
        
        elements.forEach(el => {
            if (inspector.isElementLocked(el)) return;
            const currentZ = parseInt(el.style.zIndex || 0);
            el.style.zIndex = currentZ + 1;
        });
        
        this.showMessage(`Brought ${elements.length} element(s) forward`);
    }
    
    sendBackward() {
        const elements = inspector.multiSelectMode && inspector.selectedElements.length > 0
            ? inspector.selectedElements
            : (inspector.selectedElement ? [inspector.selectedElement] : []);
        
        if (elements.length === 0) return;
        
        elements.forEach(el => {
            if (inspector.isElementLocked(el)) return;
            const currentZ = parseInt(el.style.zIndex || 0);
            el.style.zIndex = currentZ - 1;
        });
        
        this.showMessage(`Sent ${elements.length} element(s) backward`);
    }
    
    getMaxZIndex() {
        if (!inspector.targetDocument) return 0;
        
        const allElements = inspector.targetDocument.querySelectorAll('*');
        let maxZ = 0;
        
        allElements.forEach(el => {
            const z = parseInt(el.style.zIndex || 0);
            if (z > maxZ) maxZ = z;
        });
        
        return maxZ;
    }
    
    getMinZIndex() {
        if (!inspector.targetDocument) return 0;
        
        const allElements = inspector.targetDocument.querySelectorAll('*');
        let minZ = 0;
        
        allElements.forEach(el => {
            const z = parseInt(el.style.zIndex || 0);
            if (z < minZ) minZ = z;
        });
        
        return minZ;
    }
    
    updateButtonState() {
        const hasSelection = inspector.selectedElement || 
                           (inspector.multiSelectMode && inspector.selectedElements.length > 0);
        
        if (this.bringFrontBtn) this.bringFrontBtn.disabled = !hasSelection;
        if (this.sendBackBtn) this.sendBackBtn.disabled = !hasSelection;
        if (this.bringForwardBtn) this.bringForwardBtn.disabled = !hasSelection;
        if (this.sendBackwardBtn) this.sendBackwardBtn.disabled = !hasSelection;
    }
    
    showMessage(message) {
        const event = new CustomEvent('inspector:message', {
            detail: { message }
        });
        document.dispatchEvent(event);
    }
}

export const inspectorArrange = new InspectorArrange();
export default inspectorArrange;
