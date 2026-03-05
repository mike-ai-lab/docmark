/**
 * PDF Import UI Integration
 * Handles file upload, preview, page selection, and editor insertion
 */

class PDFImportUI {
  constructor(editor) {
    this.editor = editor;
    this.currentPreview = null;
    this.selectedPages = [];
    this.init();
  }

  init() {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.createUploadButton();
        this.createPreviewModal();
      });
    } else {
      // DOM already loaded
      this.createUploadButton();
      this.createPreviewModal();
    }
  }

  /**
   * Create PDF upload button in toolbar
   */
  createUploadButton() {
    // Find the header-right section where import buttons are
    const headerRight = document.querySelector('.header-right');
    if (!headerRight) {
      console.error('❌ Could not find .header-right to add PDF import button');
      return;
    }

    // Create button with icon-button class to match other buttons
    const uploadBtn = document.createElement('button');
    uploadBtn.className = 'icon-button';
    uploadBtn.id = 'import-pdf-button';
    uploadBtn.title = 'Import PDF as editable Markdown';
    uploadBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="11" x2="12" y2="17"></line>
        <polyline points="9 14 12 11 15 14"></polyline>
        <text x="7" y="16" font-size="5" font-weight="bold" fill="currentColor">PDF</text>
      </svg>
    `;
    uploadBtn.onclick = () => this.openFileDialog();

    // Insert before the import-html-button
    const importHtmlBtn = document.getElementById('import-html-button');
    if (importHtmlBtn) {
      headerRight.insertBefore(uploadBtn, importHtmlBtn);
    } else {
      headerRight.appendChild(uploadBtn);
    }

    console.log('✅ PDF Import button added to header');
  }

  /**
   * Open file dialog
   */
  openFileDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => this.handleFileSelect(e);
    input.click();
  }

  /**
   * Handle file selection
   */
  async handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.showLoadingModal('Processing PDF...');

    try {
      // Send file to backend for processing
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/pdf-import', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('PDF import failed');

      const result = await response.json();
      this.currentPreview = result;

      this.hideLoadingModal();
      this.showPreviewModal(result);

    } catch (error) {
      this.hideLoadingModal();
      this.showErrorModal(error.message);
    }
  }

  /**
   * Create preview modal
   */
  createPreviewModal() {
    const modal = document.createElement('div');
    modal.id = 'pdf-preview-modal';
    modal.className = 'modal pdf-preview-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>PDF Import Preview</h2>
          <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="preview-controls">
            <button id="select-all-pages">Select All Pages</button>
            <button id="deselect-all-pages">Deselect All</button>
          </div>
          <div class="page-selector"></div>
          <div class="preview-content"></div>
        </div>
        <div class="modal-footer">
          <button id="cancel-import" class="btn-secondary">Cancel</button>
          <button id="confirm-import" class="btn-primary">Insert into Editor</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close-btn').onclick = () => this.hidePreviewModal();
    modal.querySelector('#cancel-import').onclick = () => this.hidePreviewModal();
    modal.querySelector('#confirm-import').onclick = () => this.insertIntoEditor();
    modal.querySelector('#select-all-pages').onclick = () => this.selectAllPages();
    modal.querySelector('#deselect-all-pages').onclick = () => this.deselectAllPages();
  }

  /**
   * Show preview modal with imported content
   */
  showPreviewModal(result) {
    const modal = document.getElementById('pdf-preview-modal');
    const previewContent = modal.querySelector('.preview-content');
    const pageSelector = modal.querySelector('.page-selector');

    // Show page selection if multiple pages
    if (result.metadata.pageCount > 1) {
      pageSelector.innerHTML = this.createPageSelector(result.metadata.pageCount);
      this.selectedPages = Array.from({ length: result.metadata.pageCount }, (_, i) => i + 1);
    }

    // Show markdown preview
    previewContent.innerHTML = `
      <div class="markdown-preview">
        <h3>Preview (first 500 characters)</h3>
        <pre>${this.escapeHTML(result.markdown.substring(0, 500))}...</pre>
        <div class="import-stats">
          <p><strong>Pages:</strong> ${result.metadata.pageCount}</p>
          <p><strong>Images:</strong> ${result.images.length}</p>
          <p><strong>Validation:</strong> ${result.metadata.validation.valid ? '✅ Passed' : '⚠️ Warnings'}</p>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  /**
   * Create page selector checkboxes
   */
  createPageSelector(pageCount) {
    let html = '<div class="page-checkboxes">';
    for (let i = 1; i <= pageCount; i++) {
      html += `
        <label>
          <input type="checkbox" class="page-checkbox" value="${i}" checked>
          Page ${i}
        </label>
      `;
    }
    html += '</div>';
    return html;
  }

  selectAllPages() {
    document.querySelectorAll('.page-checkbox').forEach(cb => {
      cb.checked = true;
    });
    this.updateSelectedPages();
  }

  deselectAllPages() {
    document.querySelectorAll('.page-checkbox').forEach(cb => {
      cb.checked = false;
    });
    this.updateSelectedPages();
  }

  updateSelectedPages() {
    this.selectedPages = Array.from(document.querySelectorAll('.page-checkbox:checked'))
      .map(cb => parseInt(cb.value));
  }

  /**
   * Insert imported content into editor
   */
  async insertIntoEditor() {
    if (!this.currentPreview) return;

    this.updateSelectedPages();

    // Get current cursor position
    const position = this.editor.getPosition();
    
    // Insert markdown at cursor using editor's model
    const model = this.editor.getModel();
    const lineNumber = position.lineNumber;
    const column = position.column;
    
    // Create edit operation
    model.pushEditOperations(
      [],
      [{
        range: {
          startLineNumber: lineNumber,
          startColumn: column,
          endLineNumber: lineNumber,
          endColumn: column
        },
        text: '\n\n' + this.currentPreview.markdown + '\n\n'
      }],
      () => null
    );

    // Show success message
    this.showSuccessMessage('PDF imported successfully!');

    this.hidePreviewModal();
  }

  hidePreviewModal() {
    const modal = document.getElementById('pdf-preview-modal');
    modal.style.display = 'none';
    this.currentPreview = null;
  }

  showLoadingModal(message) {
    // Create or show loading modal
    let modal = document.getElementById('loading-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'loading-modal';
      modal.className = 'modal loading-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="spinner"></div>
          <p class="loading-message">${message}</p>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
  }

  hideLoadingModal() {
    const modal = document.getElementById('loading-modal');
    if (modal) modal.style.display = 'none';
  }

  showErrorModal(message) {
    alert(`PDF Import Error: ${message}`);
  }

  showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

  escapeHTML(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }
}

// Export for use in main.js (ES6 module)
export default PDFImportUI;
