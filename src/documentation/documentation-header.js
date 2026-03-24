/**
 * Documentation Header Management
 * Handles button visibility and mode switching
 */

export class DocumentationHeader {
    constructor() {
        this.editorButtons = null;
        this.docsButtons = null;
    }

    /**
     * Initialize header management
     */
    initialize() {
        // Cache button groups
        this.editorButtons = document.querySelectorAll('.editor-only-buttons');
        this.docsButtons = document.querySelectorAll('.docs-only-buttons');

        console.log('✓ Documentation header initialized');
    }

    /**
     * Show editor buttons, hide docs buttons
     */
    showEditorButtons() {
        this.editorButtons.forEach(group => group.classList.remove('hidden'));
        this.docsButtons.forEach(group => group.classList.add('hidden'));
    }

    /**
     * Show docs buttons, hide editor buttons
     */
    showDocsButtons() {
        this.editorButtons.forEach(group => group.classList.add('hidden'));
        this.docsButtons.forEach(group => group.classList.remove('hidden'));
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        // Remove existing toast
        const existing = document.querySelector('.docs-toast');
        if (existing) {
            existing.remove();
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = `docs-toast ${type}`;
        
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="docs-toast-icon">${icon}</div>
            <div>${message}</div>
        `;

        document.body.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Get SVG icon for toast type
     */
    getToastIcon(type) {
        const icons = {
            success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`,
            error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`
        };
        return icons[type] || icons.info;
    }

    /**
     * Show delete confirmation modal
     */
    showDeleteConfirmation(onConfirm) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'docs-delete-modal';
        modal.innerHTML = `
            <div class="docs-delete-modal-content">
                <div class="docs-delete-modal-header">
                    <div class="docs-delete-modal-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <div class="docs-delete-modal-title">Delete Documentation?</div>
                </div>
                <div class="docs-delete-modal-body">
                    This will remove all loaded documentation files. You can upload new documentation anytime. This action cannot be undone.
                </div>
                <div class="docs-delete-modal-actions">
                    <button class="docs-delete-modal-btn docs-delete-modal-btn-cancel" id="delete-cancel-btn">
                        Cancel
                    </button>
                    <button class="docs-delete-modal-btn docs-delete-modal-btn-delete" id="delete-confirm-btn">
                        Delete Documentation
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle cancel
        modal.querySelector('#delete-cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Handle confirm
        modal.querySelector('#delete-confirm-btn').addEventListener('click', () => {
            modal.remove();
            onConfirm();
        });

        // Handle backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Export singleton
export const documentationHeader = new DocumentationHeader();
