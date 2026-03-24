/**
 * Documentation Integration
 * Connects documentation mode with the main app
 */

import { DocumentationManager } from './documentation-manager.js';
import { DocumentationUI } from './documentation-ui.js';
import { documentationHeader } from './documentation-header.js';

export class DocumentationIntegration {
    constructor() {
        this.manager = new DocumentationManager();
        this.ui = new DocumentationUI(this.manager);
        this.header = documentationHeader;
        this.isInitialized = false;
    }

    /**
     * Initialize documentation mode
     */
    initialize() {
        if (this.isInitialized) return;

        // Initialize UI
        this.ui.initialize();

        // Initialize header
        this.header.initialize();

        // Setup mode toggle buttons
        this.setupModeToggle();

        // Setup upload button
        this.setupUploadButton();

        // Setup delete button
        this.setupDeleteButton();

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
            
            // Show editor buttons, hide docs buttons
            this.header.showEditorButtons();
        });

        // Switch to documentation mode
        docsModeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Always allow switching to documentation mode
            // If no documentation loaded, show placeholder template
            if (!this.manager.isActive()) {
                this.loadPlaceholderTemplate();
            }
            
            this.activateDocumentationMode();
            
            // Update button states
            docsModeBtn.classList.add('active');
            singleModeBtn.classList.remove('active');
            
            // Show docs buttons, hide editor buttons
            this.header.showDocsButtons();
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
                    // Show success toast
                    this.header.showToast(`Documentation loaded: ${result.pageCount} pages`, 'success');
                    
                    // Switch to docs mode
                    const docsModeBtn = document.getElementById('docs-mode-btn');
                    if (docsModeBtn) docsModeBtn.click();
                } else {
                    this.header.showToast(`Failed to load documentation: ${result.error}`, 'error');
                }
            } catch (error) {
                console.error('Upload error:', error);
                this.header.showToast(`Error: ${error.message}`, 'error');
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
     * Setup delete documentation button
     */
    setupDeleteButton() {
        const deleteBtn = document.getElementById('delete-docs-btn');

        if (!deleteBtn) {
            console.warn('Delete button not found');
            return;
        }

        deleteBtn.addEventListener('click', () => {
            // Show confirmation modal
            this.header.showDeleteConfirmation(() => {
                // Clear documentation
                this.clearDocumentation();
                
                // Show success toast
                this.header.showToast('Documentation deleted successfully', 'success');
            });
        });

        console.log('Delete button configured');
    }

    /**
     * Clear documentation and show empty state
     */
    clearDocumentation() {
        // Clear manager state
        this.manager.state.isActive = false;
        this.manager.state.files.clear();
        this.manager.state.structure = null;
        this.manager.state.currentPage = null;

        // Clear UI
        this.ui.elements.nav.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8;">No documentation loaded</div>';
        this.ui.elements.page.innerHTML = '<div style="padding: 48px; text-align: center; color: #94a3b8;"><h2>No Documentation</h2><p>Upload a ZIP file to get started</p></div>';
        this.ui.elements.breadcrumb.innerHTML = '';
        this.ui.elements.footer.innerHTML = '';
        this.ui.elements.tocList.innerHTML = '';

        console.log('✓ Documentation cleared');
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
        const singleFileLayout = document.getElementById('container');
        if (singleFileLayout) {
            singleFileLayout.classList.add('hidden');
        }

        this.ui.show();
    }

    /**
     * Switch to single file mode
     */
    activateSingleFileMode() {
        const singleFileLayout = document.getElementById('container');
        if (singleFileLayout) {
            singleFileLayout.classList.remove('hidden');
        }

        this.ui.hide();
        this.manager.deactivate();
    }

    /**
     * Load documentation from ZIP file
     */
    async loadDocumentation(zipFile) {
        const result = await this.manager.loadFromZip(zipFile);
        
        if (result.success) {
            // Set documentation title from config
            if (result.config && result.config.title) {
                this.ui.setTitle(result.config.title);
            }
            
            // Render navigation
            this.ui.renderNavigation(this.manager.getStructure());
            
            // Render first page
            this.ui.renderCurrentPage();
            
            // Switch to documentation mode
            this.activateDocumentationMode();
            
            // Log info
            console.log('📚 Documentation loaded:', {
                pages: result.pageCount,
                hasSummary: result.hasSummary,
                hasConfig: result.hasConfig,
                title: result.config.title
            });
        }

        return result;
    }

    /**
     * Load placeholder template (GitBook-style empty state)
     */
    loadPlaceholderTemplate() {
        // Create placeholder structure
        const placeholderStructure = {
            name: 'root',
            type: 'folder',
            children: [
                {
                    name: 'Getting Started',
                    type: 'folder',
                    path: 'getting-started/README.md',
                    children: [
                        {
                            name: 'Introduction',
                            type: 'file',
                            path: 'getting-started/introduction.md'
                        },
                        {
                            name: 'Quick Start',
                            type: 'file',
                            path: 'getting-started/quick-start.md'
                        }
                    ]
                },
                {
                    name: 'Guides',
                    type: 'folder',
                    path: 'guides/README.md',
                    children: [
                        {
                            name: 'Basic Usage',
                            type: 'file',
                            path: 'guides/basic-usage.md'
                        },
                        {
                            name: 'Advanced Features',
                            type: 'file',
                            path: 'guides/advanced-features.md'
                        }
                    ]
                },
                {
                    name: 'API Reference',
                    type: 'folder',
                    path: 'api/README.md',
                    children: [
                        {
                            name: 'API Overview',
                            type: 'file',
                            path: 'api/overview.md'
                        }
                    ]
                }
            ]
        };

        // Create placeholder content
        const placeholderFiles = new Map([
            ['getting-started/README.md', `# Getting Started

Welcome to your documentation!

This is a placeholder template to help you get started. You can:

- **Upload your own documentation** using the upload button above
- **Start writing** by clicking on any page in the sidebar
- **Organize your content** into folders and pages

## What's Next?

1. Explore the sidebar navigation
2. Click on any page to view its content
3. Upload your own documentation ZIP file when ready

---

*Tip: This template follows the GitBook structure with folders and markdown files.*`],
            
            ['getting-started/introduction.md', `# Introduction

## Welcome

This is a placeholder page to demonstrate the documentation mode.

### Features

- **Multi-page navigation** - Organize content into folders and files
- **Table of contents** - Automatic TOC generation for each page
- **Search functionality** - Find content across all pages (coming soon)
- **Breadcrumb navigation** - Always know where you are
- **Previous/Next links** - Easy navigation between pages

### Getting Started

To replace this placeholder with your own documentation:

1. Click the **upload button** in the header
2. Select a ZIP file containing your markdown files
3. Your documentation will be loaded automatically

### Supported Formats

- **SUMMARY.md** - Define custom navigation order
- **book.json** - Configure documentation settings
- **Markdown files** - Standard .md files with your content
- **Assets** - Images, CSS, and other resources`],
            
            ['getting-started/quick-start.md', `# Quick Start

## 5-Minute Setup

Get your documentation up and running in minutes!

### Step 1: Prepare Your Files

Create a folder structure like this:

\`\`\`
my-docs/
├── README.md
├── SUMMARY.md (optional)
├── getting-started/
│   ├── introduction.md
│   └── quick-start.md
└── guides/
    └── basic-usage.md
\`\`\`

### Step 2: Write Your Content

Each markdown file becomes a page in your documentation.

\`\`\`markdown
# Page Title

Your content here...

## Section 1
## Section 2
\`\`\`

### Step 3: Create SUMMARY.md (Optional)

Define your navigation structure:

\`\`\`markdown
# Summary

* [Getting Started](getting-started/README.md)
  * [Introduction](getting-started/introduction.md)
  * [Quick Start](getting-started/quick-start.md)
* [Guides](guides/README.md)
\`\`\`

### Step 4: Zip and Upload

1. Compress your folder into a ZIP file
2. Click the upload button
3. Select your ZIP file
4. Done!`],
            
            ['guides/README.md', `# Guides

## Documentation Guides

Learn how to make the most of your documentation.

### Available Guides

- **Basic Usage** - Learn the fundamentals
- **Advanced Features** - Explore powerful features

### Tips for Great Documentation

1. **Keep it simple** - Write clear, concise content
2. **Use headings** - Structure your content with H1-H6
3. **Add examples** - Show, don't just tell
4. **Include images** - Visual aids help understanding
5. **Link between pages** - Create a connected knowledge base

---

*Click on a guide in the sidebar to continue.*`],
            
            ['guides/basic-usage.md', `# Basic Usage

## Writing Documentation

### Markdown Basics

Use standard markdown syntax:

- **Bold text**: \`**bold**\`
- *Italic text*: \`*italic*\`
- \`Code\`: \`\\\`code\\\`\`
- [Links](https://example.com): \`[text](url)\`

### Headings

\`\`\`markdown
# H1 - Page Title
## H2 - Major Section
### H3 - Subsection
#### H4 - Minor Section
\`\`\`

### Lists

**Unordered:**
- Item 1
- Item 2
  - Nested item

**Ordered:**
1. First
2. Second
3. Third

### Code Blocks

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Tables

| Feature | Status |
|---------|--------|
| Navigation | Active |
| Search | In Progress |
| TOC | Active |`],
            
            ['guides/advanced-features.md', `# Advanced Features

## Power User Tips

### Custom Navigation

Use SUMMARY.md to control the exact order and structure of your navigation.

### Nested Folders

Organize content into deep folder hierarchies:

\`\`\`
docs/
├── getting-started/
│   ├── README.md
│   └── installation/
│       ├── windows.md
│       ├── mac.md
│       └── linux.md
└── api/
    └── reference/
        └── methods.md
\`\`\`

### Cross-Page Links

Link to other pages in your documentation:

\`\`\`markdown
See [Quick Start](../getting-started/quick-start.md) for details.
\`\`\`

### Images and Assets

Include images in your ZIP file:

\`\`\`markdown
![Screenshot](../images/screenshot.png)
\`\`\`

### Configuration

Add a \`book.json\` file to customize:

\`\`\`json
{
  "title": "My Documentation",
  "description": "Awesome docs",
  "author": "Your Name"
}
\`\`\``],
            
            ['api/README.md', `# API Reference

## API Documentation

Complete reference for all API endpoints and methods.

### Overview

This section contains detailed API documentation including:

- **Endpoints** - All available API routes
- **Methods** - Function signatures and parameters
- **Examples** - Code samples and use cases
- **Responses** - Expected return values

### Getting Started with the API

1. Review the API overview
2. Check authentication requirements
3. Explore available endpoints
4. Test with example requests

---

*Click on API Overview in the sidebar to continue.*`],
            
            ['api/overview.md', `# API Overview

## REST API Reference

### Base URL

\`\`\`
https://api.example.com/v1
\`\`\`

### Authentication

All API requests require authentication:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://api.example.com/v1/endpoint
\`\`\`

### Endpoints

#### GET /users

Retrieve a list of users.

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\`

#### POST /users

Create a new user.

**Request:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "created_at": "2026-03-24T10:00:00Z"
}
\`\`\`

### Error Handling

The API uses standard HTTP status codes:

- \`200\` - Success
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`404\` - Not Found
- \`500\` - Server Error`]
        ]);

        // Load placeholder into manager
        this.manager.loadPlaceholder(placeholderStructure, placeholderFiles);

        // Set title
        this.ui.setTitle('Documentation Template');

        // Render navigation
        this.ui.renderNavigation(placeholderStructure);

        // Render first page
        this.ui.renderCurrentPage();

        console.log('✓ Loaded placeholder template');
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
