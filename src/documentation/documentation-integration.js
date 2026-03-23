/**
 * Documentation Integration
 * Connects documentation mode with the main app
 */

import { DocumentationManager } from './documentation-manager.js';
import { DocumentationUI } from './documentation-ui.js';

export class DocumentationIntegration {
    constructor() {
        this.manager = new DocumentationManager();
        this.ui = new DocumentationUI(this.manager);
        this.isInitialized = false;
    }

    /**
     * Initialize documentation mode
     */
    initialize() {
        if (this.isInitialized) return;

        // Initialize UI
        this.ui.initialize();

        // Setup mode toggle buttons
        this.setupModeToggle();

        // Setup upload button
        this.setupUploadButton();

        this.isInitialized = true;
        console.log('Documentation mode initialized');
    }

    /**
     * Setup mode toggle buttons
     */
    setupModeToggle() {
        const singleModeBtn = document.getElementById('single-file-mode-btn');
        const docsModeBtn = document.getElementById('docs-mode-btn');
        const uploadBtn = document.getElementById('upload-docs-btn');

        if (!singleModeBtn || !docsModeBtn) {
            console.warn('Mode toggle buttons not found');
            return;
        }

        // Switch to single file mode
        singleModeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.activateSingleFileMode();
            
            // Update button states
            singleModeBtn.classList.add('active');
            docsModeBtn.classList.remove('active');
            
            // Hide upload button
            if (uploadBtn) uploadBtn.classList.add('hidden');
        });

        // Switch to documentation mode
        docsModeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Only activate if we have documentation loaded
            if (this.manager.isActive()) {
                this.activateDocumentationMode();
            } else {
                // Show upload prompt
                alert('Please upload a documentation ZIP file first!');
                this.promptUpload();
                return;
            }
            
            // Update button states
            docsModeBtn.classList.add('active');
            singleModeBtn.classList.remove('active');
            
            // Show upload button
            if (uploadBtn) uploadBtn.classList.remove('hidden');
        });

        console.log('Mode toggle buttons configured');
    }

    /**
     * Setup upload documentation button
     */
    setupUploadButton() {
        const uploadBtn = document.getElementById('upload-docs-btn');
        const uploadInput = document.getElementById('upload-docs-input');

        if (!uploadBtn || !uploadInput) {
            console.warn('Upload button or input not found');
            return;
        }

        // Click upload button
        uploadBtn.addEventListener('click', () => {
            uploadInput.click();
        });

        // Handle file selection
        uploadInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.name.endsWith('.zip')) {
                alert('Please select a ZIP file');
                return;
            }

            console.log('Loading documentation from:', file.name);
            
            // Show loading state
            uploadBtn.disabled = true;
            uploadBtn.style.opacity = '0.5';

            try {
                const result = await this.loadDocumentation(file);
                
                if (result.success) {
                    alert(`✅ Documentation loaded!\n${result.pageCount} pages found.`);
                    
                    // Switch to docs mode
                    const docsModeBtn = document.getElementById('docs-mode-btn');
                    if (docsModeBtn) docsModeBtn.click();
                } else {
                    alert('❌ Failed to load documentation:\n' + result.error);
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('❌ Error: ' + error.message);
            } finally {
                // Reset upload button
                uploadBtn.disabled = false;
                uploadBtn.style.opacity = '1';
                uploadInput.value = ''; // Reset input
            }
        });

        console.log('Upload button configured');
    }

    /**
     * Prompt user to upload documentation
     */
    promptUpload() {
        const uploadInput = document.getElementById('upload-docs-input');
        if (uploadInput) {
            uploadInput.click();
        }
    }

    /**
     * Switch to documentation mode
     */
    activateDocumentationMode() {
        // Hide single file editor
        const singleFileLayout = document.querySelector('.split-container');
        if (singleFileLayout) {
            singleFileLayout.classList.add('hidden');
        }

        // Show documentation layout
        this.ui.show();

        console.log('Documentation mode activated');
    }

    /**
     * Switch to single file mode
     */
    activateSingleFileMode() {
        // Show single file editor
        const singleFileLayout = document.querySelector('.split-container');
        if (singleFileLayout) {
            singleFileLayout.classList.remove('hidden');
        }

        // Hide documentation layout
        this.ui.hide();

        // Deactivate manager
        this.manager.deactivate();

        console.log('Single file mode activated');
    }

    /**
     * Load documentation from ZIP file
     */
    async loadDocumentation(zipFile) {
        const result = await this.manager.loadFromZip(zipFile);
        
        if (result.success) {
            // Render navigation
            this.ui.renderNavigation(this.manager.getStructure());
            
            // Render first page
            this.ui.renderCurrentPage();
            
            // Switch to documentation mode
            this.activateDocumentationMode();
        }

        return result;
    }

    /**
     * Check if documentation mode is active
     */
    isActive() {
        return this.manager.isActive();
    }
}

// Export singleton instance
export const documentationIntegration = new DocumentationIntegration();
