// AI Preview System - Ghost preview with inline action buttons
// Minimal, non-intrusive design - shows preview in editor and preview pane

class AIPreviewSystem {
    constructor(editor, previewPane) {
        this.editor = editor;
        this.previewPane = previewPane;
        this.isActive = false;
        this.currentPreview = null;
        this.originalContent = null;
        this.previewDecorations = [];
        this.controlsBar = null;
        this.originalPreviewHTML = null;
    }

    show(originalContent, previewContent, onConfirm, onRegenerate) {
        this.originalContent = originalContent;
        this.currentPreview = previewContent;
        this.onConfirm = onConfirm;
        this.onRegenerate = onRegenerate;
        this.isActive = true;

        // Apply ghost preview to editor
        this.applyEditorGhostPreview(previewContent);

        // Apply ghost preview to preview pane
        this.applyPreviewPaneGhostPreview(previewContent);

        // Show inline control buttons
        this.showControlButtons();
    }

    applyEditorGhostPreview(content) {
        const selection = this.editor.getSelection();
        if (!selection) return;

        const range = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn
        };

        // Add ghost text decoration with diff-style highlighting
        this.previewDecorations = this.editor.deltaDecorations(
            this.previewDecorations,
            [
                {
                    range: range,
                    options: {
                        isWholeLine: true,
                        className: 'ai-preview-ghost-diff',
                        glyphMarginClassName: 'ai-preview-glyph-marker'
                    }
                }
            ]
        );

        // Replace content with preview (ghost)
        this.editor.executeEdits('ai-preview', [
            {
                range: range,
                text: content
            }
        ]);
    }

    applyPreviewPaneGhostPreview(content) {
        if (!this.previewPane) return;

        // Store original HTML
        this.originalPreviewHTML = this.previewPane.innerHTML;

        // Create temporary container to render preview
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        // Add ghost class to preview
        tempDiv.classList.add('ai-preview-ghost-render');

        // Replace preview content
        this.previewPane.innerHTML = '';
        this.previewPane.appendChild(tempDiv);
    }

    showControlButtons() {
        // Remove existing controls
        this.removeControlButtons();

        // Create minimal control bar
        this.controlsBar = document.createElement('div');
        this.controlsBar.className = 'ai-preview-controls-bar';
        this.controlsBar.innerHTML = `
            <div class="ai-preview-controls">
                <button class="ai-preview-control-btn ai-preview-btn-discard" title="Discard (Esc)">✕</button>
                <button class="ai-preview-control-btn ai-preview-btn-regenerate" title="Regenerate">↻</button>
                <button class="ai-preview-control-btn ai-preview-btn-confirm" title="Confirm (Enter)">✓</button>
            </div>
        `;

        // Position at top-right of editor
        const editorContainer = this.editor.getDomNode();
        if (editorContainer) {
            editorContainer.parentElement.style.position = 'relative';
            editorContainer.parentElement.appendChild(this.controlsBar);
        }

        // Attach event listeners
        const discardBtn = this.controlsBar.querySelector('.ai-preview-btn-discard');
        const regenerateBtn = this.controlsBar.querySelector('.ai-preview-btn-regenerate');
        const confirmBtn = this.controlsBar.querySelector('.ai-preview-btn-confirm');

        discardBtn?.addEventListener('click', () => this.hide());
        regenerateBtn?.addEventListener('click', () => this.onRegenerate?.());
        confirmBtn?.addEventListener('click', () => this.confirm());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            if (e.key === 'Escape') this.hide();
            if (e.key === 'Enter' && e.ctrlKey) this.confirm();
        });
    }

    removeControlButtons() {
        if (this.controlsBar) {
            this.controlsBar.remove();
            this.controlsBar = null;
        }
    }

    confirm() {
        if (this.onConfirm) {
            this.onConfirm(this.currentPreview);
        }
        this.hide();
    }

    hide() {
        this.isActive = false;

        // Clear editor ghost preview
        this.previewDecorations = this.editor.deltaDecorations(this.previewDecorations, []);

        // Undo editor changes
        this.editor.trigger('keyboard', 'undo', {});

        // Restore preview pane
        if (this.originalPreviewHTML) {
            this.previewPane.innerHTML = this.originalPreviewHTML;
            this.originalPreviewHTML = null;
        }

        // Remove control buttons
        this.removeControlButtons();

        this.originalContent = null;
        this.currentPreview = null;
        this.onConfirm = null;
        this.onRegenerate = null;
    }
}

export default AIPreviewSystem;
