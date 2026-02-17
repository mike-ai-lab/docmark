/**
 * Inspector Drag & Drop Module
 */

import inspector from './inspector-core.js';

class InspectorDragDrop {
    constructor() {
        this.draggedElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.dragStartPos = { x: 0, y: 0 };
        this.isDragging = false;
        this.hasMoved = false;
        this.DRAG_THRESHOLD = 5;
    }
    
    init(doc) {
        if (!doc) return false;
        
        this.targetDocument = doc;
        this.setupEventListeners();
        
        return true;
    }
    
    setupEventListeners() {
        const body = this.targetDocument.body;
        
        body.addEventListener('mousedown', this.handleMouseDown.bind(this), true);
        body.addEventListener('mousemove', this.handleMouseMove.bind(this), true);
        body.addEventListener('mouseup', this.handleMouseUp.bind(this), true);
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging && this.draggedElement) {
                this.isDragging = false;
                this.draggedElement.classList.remove('inspector-dragging');
                this.draggedElement = null;
            }
        });
    }
    
    handleMouseDown(e) {
        if (inspector.multiSelectMode || inspector.batchPasteMode) return;
        if (e.button !== 0) return;
        
        const element = e.target;
        
        if (inspector.isElementLocked(element)) return;
        if (inspector.isNonInspectable(element)) return;
        
        this.draggedElement = element;
        this.dragStartPos.x = e.clientX;
        this.dragStartPos.y = e.clientY;
        this.hasMoved = false;
        
        const rect = element.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        
        e.preventDefault();
    }
    
    handleMouseMove(e) {
        if (!this.draggedElement) return;
        
        const deltaX = Math.abs(e.clientX - this.dragStartPos.x);
        const deltaY = Math.abs(e.clientY - this.dragStartPos.y);
        
        if (!this.isDragging && (deltaX > this.DRAG_THRESHOLD || deltaY > this.DRAG_THRESHOLD)) {
            this.isDragging = true;
            this.hasMoved = true;
            
            const elementWindow = this.draggedElement.ownerDocument.defaultView || window;
            const computed = elementWindow.getComputedStyle(this.draggedElement);
            if (computed.position === 'static' || computed.position === 'relative') {
                const rect = this.draggedElement.getBoundingClientRect();
                const scrollX = this.targetDocument.documentElement.scrollLeft || this.targetDocument.body.scrollLeft;
                const scrollY = this.targetDocument.documentElement.scrollTop || this.targetDocument.body.scrollTop;
                
                this.draggedElement.dataset.originalPosition = computed.position;
                this.draggedElement.dataset.originalTop = this.draggedElement.style.top || '';
                this.draggedElement.dataset.originalLeft = this.draggedElement.style.left || '';
                
                this.draggedElement.style.position = 'absolute';
                this.draggedElement.style.left = (rect.left + scrollX) + 'px';
                this.draggedElement.style.top = (rect.top + scrollY) + 'px';
                this.draggedElement.style.width = rect.width + 'px';
                this.draggedElement.style.height = rect.height + 'px';
                this.draggedElement.style.margin = '0';
            }
            
            this.draggedElement.classList.add('inspector-dragging');
            this.draggedElement.style.zIndex = '9999';
        }
        
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        const scrollX = this.targetDocument.documentElement.scrollLeft || this.targetDocument.body.scrollLeft;
        const scrollY = this.targetDocument.documentElement.scrollTop || this.targetDocument.body.scrollTop;
        
        const newLeft = e.clientX - this.dragOffset.x + scrollX;
        const newTop = e.clientY - this.dragOffset.y + scrollY;
        
        this.draggedElement.style.left = newLeft + 'px';
        this.draggedElement.style.top = newTop + 'px';
    }
    
    handleMouseUp(e) {
        if (!this.draggedElement) return;
        
        if (!this.hasMoved) {
            this.draggedElement = null;
            this.isDragging = false;
            return;
        }
        
        if (this.isDragging) {
            this.isDragging = false;
            this.draggedElement.classList.remove('inspector-dragging');
            
            const event = new CustomEvent('inspector:message', {
                detail: { message: 'Element moved' }
            });
            document.dispatchEvent(event);
        }
        
        this.draggedElement = null;
    }
}

export const inspectorDragDrop = new InspectorDragDrop();
export default inspectorDragDrop;
