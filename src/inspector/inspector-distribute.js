/**
 * Inspector Distribute Module
 * Handles distributing elements evenly with specified gaps
 */

import inspector from './inspector-core.js';

class InspectorDistribute {
    constructor() {
        this.distributeHBtn = null;
        this.distributeVBtn = null;
        this.modal = null;
        this.gapInput = null;
        this.currentDirection = null;
    }
    
    init() {
        this.distributeHBtn = document.getElementById('inspector-distribute-h-btn');
        this.distributeVBtn = document.getElementById('inspector-distribute-v-btn');
        
        if (!this.distributeHBtn) {
            console.warn('Distribute buttons not found');
            return false;
        }
        
        this.createModal();
        this.setupEventListeners();
        document.addEventListener('inspector:selectionchange', this.updateButtonState.bind(this));
        
        console.log('Inspector distribute module initialized');
        return true;
    }
    
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'inspector-modal';
        this.modal.innerHTML = `
            <div class="inspector-modal-content">
                <div class="inspector-modal-header">Distribute Elements</div>
                <div class="inspector-modal-body">
                    <div class="inspector-field">
                        <label>Gap between elements (px)</label>
                        <input type="number" id="distribute-gap-input" value="50" min="0" max="1000">
                    </div>
                </div>
                <div class="inspector-modal-actions">
                    <button class="inspector-modal-btn" id="distribute-cancel-btn">Cancel</button>
                    <button class="inspector-modal-btn primary" id="distribute-apply-btn">Apply</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        
        this.gapInput = document.getElementById('distribute-gap-input');
        
        document.getElementById('distribute-cancel-btn').addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('distribute-apply-btn').addEventListener('click', () => {
            this.applyDistribution();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }
    
    setupEventListeners() {
        if (this.distributeHBtn) {
            this.distributeHBtn.addEventListener('click', () => {
                this.currentDirection = 'horizontal';
                this.showModal();
            });
        }
        
        if (this.distributeVBtn) {
            this.distributeVBtn.addEventListener('click', () => {
                this.currentDirection = 'vertical';
                this.showModal();
            });
        }
    }
    
    showModal() {
        this.modal.classList.add('active');
        this.gapInput.focus();
        this.gapInput.select();
    }
    
    hideModal() {
        this.modal.classList.remove('active');
    }
    
    applyDistribution() {
        const gap = parseInt(this.gapInput.value) || 50;
        
        if (!inspector.multiSelectMode || inspector.selectedElements.length < 2) {
            this.showMessage('Select at least 2 elements to distribute');
            this.hideModal();
            return;
        }
        
        const elements = inspector.selectedElements.filter(el => !inspector.isElementLocked(el));
        
        if (elements.length < 2) {
            this.showMessage('Need at least 2 unlocked elements');
            this.hideModal();
            return;
        }
        
        if (this.currentDirection === 'horizontal') {
            this.distributeHorizontally(elements, gap);
        } else {
            this.distributeVertically(elements, gap);
        }
        
        this.hideModal();
    }
    
    distributeHorizontally(elements, gap) {
        const sorted = elements.slice().sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectA.left - rectB.left;
        });
        
        let currentX = sorted[0].getBoundingClientRect().left;
        const scrollX = inspector.targetDocument.documentElement.scrollLeft || 
                       inspector.targetDocument.body.scrollLeft;
        
        sorted.forEach((el, index) => {
            if (index === 0) {
                const elementWindow = el.ownerDocument.defaultView || window;
                const computed = elementWindow.getComputedStyle(el);
                if (computed.position === 'static') {
                    el.style.position = 'relative';
                }
                return;
            }
            
            const rect = el.getBoundingClientRect();
            const elementWindow = el.ownerDocument.defaultView || window;
            const computed = elementWindow.getComputedStyle(el);
            
            if (computed.position === 'static' || computed.position === 'relative') {
                el.style.position = 'absolute';
                el.style.left = (currentX + scrollX) + 'px';
                el.style.top = (rect.top + (inspector.targetDocument.documentElement.scrollTop || 
                                           inspector.targetDocument.body.scrollTop)) + 'px';
            } else {
                el.style.left = (currentX + scrollX) + 'px';
            }
            
            currentX += rect.width + gap;
        });
        
        this.showMessage(`Distributed ${elements.length} elements horizontally with ${gap}px gap`);
    }
    
    distributeVertically(elements, gap) {
        const sorted = elements.slice().sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectA.top - rectB.top;
        });
        
        let currentY = sorted[0].getBoundingClientRect().top;
        const scrollY = inspector.targetDocument.documentElement.scrollTop || 
                       inspector.targetDocument.body.scrollTop;
        
        sorted.forEach((el, index) => {
            if (index === 0) {
                const elementWindow = el.ownerDocument.defaultView || window;
                const computed = elementWindow.getComputedStyle(el);
                if (computed.position === 'static') {
                    el.style.position = 'relative';
                }
                return;
            }
            
            const rect = el.getBoundingClientRect();
            const elementWindow = el.ownerDocument.defaultView || window;
            const computed = elementWindow.getComputedStyle(el);
            
            if (computed.position === 'static' || computed.position === 'relative') {
                el.style.position = 'absolute';
                el.style.top = (currentY + scrollY) + 'px';
                el.style.left = (rect.left + (inspector.targetDocument.documentElement.scrollLeft || 
                                             inspector.targetDocument.body.scrollLeft)) + 'px';
            } else {
                el.style.top = (currentY + scrollY) + 'px';
            }
            
            currentY += rect.height + gap;
        });
        
        this.showMessage(`Distributed ${elements.length} elements vertically with ${gap}px gap`);
    }
    
    updateButtonState() {
        const canDistribute = inspector.multiSelectMode && inspector.selectedElements.length >= 2;
        
        if (this.distributeHBtn) {
            this.distributeHBtn.disabled = !canDistribute;
            this.distributeHBtn.style.display = canDistribute ? 'block' : 'none';
        }
        
        if (this.distributeVBtn) {
            this.distributeVBtn.disabled = !canDistribute;
            this.distributeVBtn.style.display = canDistribute ? 'block' : 'none';
        }
    }
    
    showMessage(message) {
        const event = new CustomEvent('inspector:message', {
            detail: { message }
        });
        document.dispatchEvent(event);
    }
}

export const inspectorDistribute = new InspectorDistribute();
export default inspectorDistribute;
