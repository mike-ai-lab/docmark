/**
 * Inspector Lock Module
 * Handles locking and unlocking of elements
 */

import inspector from './inspector-core.js';

class InspectorLock {
    constructor() {
        this.lockButton = null;
    }
    
    /**
     * Initialize lock functionality
     */
    init() {
        this.lockButton = document.getElementById('inspector-lock-btn');
        
        if (!this.lockButton) {
            console.warn('Lock button not found');
            return false;
        }
        
        this.setupEventListeners();
        
        // Listen for selection changes to update button state
        document.addEventListener('inspector:selectionchange', this.updateButtonState.bind(this));
        
        console.log('Inspector lock module initialized');
        return true;
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.lockButton.addEventListener('click', () => {
            this.toggleLock();
        });
    }
    
    /**
     * Toggle lock state of selected element
     */
    toggleLock() {
        const element = inspector.selectedElement;
        
        if (!element) {
            this.showMessage('No element selected');
            return;
        }
        
        const isLocked = inspector.isElementLocked(element);
        
        if (isLocked) {
            this.unlockElement(element);
        } else {
            this.lockElement(element);
        }
    }
    
    /**
     * Lock an element
     */
    lockElement(element) {
        inspector.lockedElements.add(element);
        element.setAttribute('data-inspector-locked', 'true');
        element.classList.add('inspector-locked');
        
        this.updateButtonState();
        this.showMessage('Element locked');
        
        // Dispatch event
        const event = new CustomEvent('inspector:lock', {
            detail: { element, locked: true }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Unlock an element
     */
    unlockElement(element) {
        inspector.lockedElements.delete(element);
        element.removeAttribute('data-inspector-locked');
        element.classList.remove('inspector-locked');
        
        this.updateButtonState();
        this.showMessage('Element unlocked');
        
        // Dispatch event
        const event = new CustomEvent('inspector:lock', {
            detail: { element, locked: false }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Update button state based on selection
     */
    updateButtonState() {
        if (!this.lockButton) return;
        
        const element = inspector.selectedElement;
        
        if (!element) {
            this.lockButton.disabled = true;
            this.lockButton.textContent = 'Lock Element';
            return;
        }
        
        this.lockButton.disabled = false;
        
        const isLocked = inspector.isElementLocked(element);
        this.lockButton.textContent = isLocked ? 'Unlock Element' : 'Lock Element';
    }
    
    /**
     * Show message to user
     */
    showMessage(message) {
        // Dispatch message event for UI to handle
        const event = new CustomEvent('inspector:message', {
            detail: { message }
        });
        document.dispatchEvent(event);
    }
}

// Export singleton instance
export const inspectorLock = new InspectorLock();
export default inspectorLock;
