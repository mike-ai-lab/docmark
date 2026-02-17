/**
 * Inspector Group Module
 * Handles grouping and ungrouping of elements
 */

import inspector from './inspector-core.js';

class InspectorGroup {
    constructor() {
        this.groupButton = null;
        this.ungroupButton = null;
    }
    
    /**
     * Initialize group functionality
     */
    init() {
        this.groupButton = document.getElementById('inspector-group-btn');
        this.ungroupButton = document.getElementById('inspector-ungroup-btn');
        
        if (!this.groupButton) {
            console.warn('Group button not found');
            return false;
        }
        
        this.setupEventListeners();
        
        // Listen for selection changes
        document.addEventListener('inspector:selectionchange', this.updateButtonState.bind(this));
        
        console.log('Inspector group module initialized');
        return true;
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (this.groupButton) {
            this.groupButton.addEventListener('click', () => {
                this.createGroup();
            });
        }
        
        if (this.ungroupButton) {
            this.ungroupButton.addEventListener('click', () => {
                this.removeGroup();
            });
        }
    }
    
    /**
     * Create a group from selected elements
     */
    createGroup() {
        const elements = inspector.selectedElements;
        
        if (elements.length < 2) {
            this.showMessage('Select at least 2 elements to group');
            return;
        }
        
        // Check if any elements are locked
        const hasLocked = elements.some(el => inspector.isElementLocked(el));
        if (hasLocked) {
            this.showMessage('Cannot group locked elements');
            return;
        }
        
        // Create group ID
        const groupId = 'group-' + (++inspector.groupIdCounter);
        
        // Add elements to group
        inspector.groups.set(groupId, [...elements]);
        
        // Mark elements as grouped
        elements.forEach(el => {
            el.classList.add('inspector-grouped');
            el.setAttribute('data-inspector-group', groupId);
        });
        
        this.showMessage(`Grouped ${elements.length} elements`);
        this.updateButtonState();
        
        // Dispatch event
        const event = new CustomEvent('inspector:group', {
            detail: { groupId, elements }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Remove group from selected element
     */
    removeGroup() {
        const element = inspector.selectedElement;
        
        if (!element) {
            this.showMessage('No element selected');
            return;
        }
        
        const groupId = element.getAttribute('data-inspector-group');
        
        if (!groupId) {
            this.showMessage('Element is not grouped');
            return;
        }
        
        // Get all elements in group
        const groupElements = inspector.groups.get(groupId);
        
        if (groupElements) {
            // Remove group markers
            groupElements.forEach(el => {
                el.classList.remove('inspector-grouped');
                el.removeAttribute('data-inspector-group');
            });
            
            // Remove group
            inspector.groups.delete(groupId);
            
            this.showMessage('Group removed');
            this.updateButtonState();
            
            // Dispatch event
            const event = new CustomEvent('inspector:ungroup', {
                detail: { groupId, elements: groupElements }
            });
            document.dispatchEvent(event);
        }
    }
    
    /**
     * Select entire group when clicking grouped element
     */
    selectGroup(element) {
        const groupId = element.getAttribute('data-inspector-group');
        
        if (!groupId) return false;
        
        const groupElements = inspector.groups.get(groupId);
        
        if (!groupElements) return false;
        
        // Enter multi-select mode and select all group elements
        inspector.multiSelectMode = true;
        inspector.selectedElements = [...groupElements];
        
        // Add visual indicators
        groupElements.forEach(el => {
            el.classList.add('inspector-multi-selected');
        });
        
        inspector.notifySelectionChange();
        inspector.notifyModeChange('multiselect', true);
        
        return true;
    }
    
    /**
     * Update button state based on selection
     */
    updateButtonState() {
        // Group button
        if (this.groupButton) {
            const canGroup = inspector.multiSelectMode && inspector.selectedElements.length >= 2;
            this.groupButton.disabled = !canGroup;
            
            if (canGroup) {
                this.groupButton.style.display = 'block';
            } else {
                this.groupButton.style.display = 'none';
            }
        }
        
        // Ungroup button
        if (this.ungroupButton) {
            const element = inspector.selectedElement;
            const isGrouped = element && element.hasAttribute('data-inspector-group');
            
            this.ungroupButton.disabled = !isGrouped;
            
            if (isGrouped) {
                this.ungroupButton.style.display = 'block';
            } else {
                this.ungroupButton.style.display = 'none';
            }
        }
    }
    
    /**
     * Show message to user
     */
    showMessage(message) {
        const event = new CustomEvent('inspector:message', {
            detail: { message }
        });
        document.dispatchEvent(event);
    }
}

// Export singleton instance
export const inspectorGroup = new InspectorGroup();
export default inspectorGroup;
