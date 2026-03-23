/**
 * Documentation UI - Handles rendering and user interactions
 * Manages the three-panel layout (sidebar, content, toc)
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';

export class DocumentationUI {
    constructor(manager) {
        this.manager = manager;
        this.elements = {};
        this.isInitialized = false;
    }

    /**
     * Initialize UI elements
     */
    initialize() {
        if (this.isInitialized) return;

        // Create main documentation layout
        this.createLayout();
        
        // Cache element references
        this.cacheElements();
        
        // Attach event listeners
        this.attachEvents();
        
        this.isInitialized = true;
    }

    /**
     * Create documentation layout HTML
     */
    createLayout() {
        const container = document.getElementById('container');
        if (!container) return;

        // Create docs layout (hidden by default)
        const docsLayout = document.createElement('div');
        docsLayout.id = 'docs-layout';
        docsLayout.className = 'docs-layout hidden';
        docsLayout.innerHTML = `
            <!-- Left Sidebar -->
            <div class="docs-sidebar">
                <div class="docs-sidebar-header">
                    <div class="docs-title" id="docs-title">Documentation</div>
                    <input type="text" class="docs-search" id="docs-search" placeholder="Search docs...">
                </div>
                <div class="docs-nav" id="docs-nav">
                    <!-- Navigation will be inserted here -->
                </div>
            </div>

            <!-- Main Content -->
            <div class="docs-content">
                <div class="docs-breadcrumb" id="docs-breadcrumb">
                    <!-- Breadcrumb will be inserted here -->
                </div>
                <div class="docs-page" id="docs-page">
                    <!-- Page content will be rendered here -->
                </div>
                <div class="docs-navigation-footer" id="docs-footer">
                    <!-- Previous/Next links will be inserted here -->
                </div>
            </div>

            <!-- Right Sidebar TOC -->
            <div class="docs-toc">
                <div class="toc-title">On This Page</div>
                <div class="toc-list" id="docs-toc-list">
                    <!-- TOC will be inserted here -->
                </div>
            </div>
        `;

        container.appendChild(docsLayout);
    }

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            layout: document.getElementById('docs-layout'),
            title: document.getElementById('docs-title'),
            search: document.getElementById('docs-search'),
            nav: document.getElementById('docs-nav'),
            breadcrumb: document.getElementById('docs-breadcrumb'),
            page: document.getElementById('docs-page'),
            footer: document.getElementById('docs-footer'),
            tocList: document.getElementById('docs-toc-list')
        };
    }

    /**
     * Attach event listeners
     */
    attachEvents() {
        // Search functionality
        if (this.elements.search) {
            this.elements.search.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    /**
     * Show documentation layout
     */
    show() {
        if (this.elements.layout) {
            this.elements.layout.classList.remove('hidden');
        }
    }

    /**
     * Hide documentation layout
     */
    hide() {
        if (this.elements.layout) {
            this.elements.layout.classList.add('hidden');
        }
    }

    /**
     * Render navigation tree
     */
    renderNavigation(structure) {
        if (!this.elements.nav || !structure) return;

        const html = this.buildNavigationHTML(structure);
        this.elements.nav.innerHTML = html;

        // Attach click handlers to nav items
        this.attachNavigationHandlers();
    }

    /**
     * Build navigation HTML recursively
     */
    buildNavigationHTML(node, level = 0) {
        let html = '';

        if (node.type === 'folder') {
            html += `<div class="nav-section">`;
            html += `<div class="nav-folder" data-path="${node.path || ''}">`;
            html += `<span class="nav-icon">📁</span>`;
            html += `<span>${node.name}</span>`;
            html += `</div>`;

            if (node.children && node.children.length > 0) {
                html += `<div class="nav-children">`;
                node.children.forEach(child => {
                    html += this.buildNavigationHTML(child, level + 1);
                });
                html += `</div>`;
            }
            html += `</div>`;
        } else if (node.type === 'file') {
            html += `<div class="nav-file" data-path="${node.path}">`;
            html += `<span class="nav-icon">📄</span>`;
            html += `<span>${node.name}</span>`;
            html += `</div>`;
        }

        return html;
    }

    /**
     * Attach click handlers to navigation items
     */
    attachNavigationHandlers() {
        const navFiles = this.elements.nav.querySelectorAll('.nav-file');
        navFiles.forEach(file => {
            file.addEventListener('click', () => {
                const path = file.getAttribute('data-path');
                this.handlePageNavigation(path);
            });
        });
    }

    /**
     * Handle page navigation
     */
    handlePageNavigation(path) {
        if (this.manager.navigateTo(path)) {
            this.renderCurrentPage();
            this.updateActiveNavItem(path);
        }
    }

    /**
     * Render current page content
     */
    renderCurrentPage() {
        const content = this.manager.getCurrentPage();
        if (!content || !this.elements.page) return;

        // Render markdown (we'll use marked.js)
        this.elements.page.innerHTML = this.renderMarkdown(content);

        // Update breadcrumb
        this.updateBreadcrumb();

        // Update TOC
        this.updateTOC();

        // Update footer navigation
        this.updateFooterNavigation();
    }

    /**
     * Render markdown to HTML
     */
    renderMarkdown(markdown) {
        try {
            const html = marked.parse(markdown);
            const clean = DOMPurify.sanitize(html);
            return `<div class="markdown-body">${clean}</div>`;
        } catch (error) {
            console.error('Markdown render error:', error);
            return `<div class="error">Failed to render markdown</div>`;
        }
    }

    /**
     * Update active navigation item
     */
    updateActiveNavItem(path) {
        const navFiles = this.elements.nav.querySelectorAll('.nav-file');
        navFiles.forEach(file => {
            if (file.getAttribute('data-path') === path) {
                file.classList.add('active');
            } else {
                file.classList.remove('active');
            }
        });
    }

    /**
     * Update breadcrumb
     */
    updateBreadcrumb() {
        if (!this.elements.breadcrumb) return;
        
        const path = this.manager.state.currentPage;
        if (!path) return;

        const parts = path.split('/');
        const breadcrumbHTML = parts.map((part, index) => {
            const isLast = index === parts.length - 1;
            return isLast ? `<strong>${part}</strong>` : part;
        }).join(' / ');

        this.elements.breadcrumb.innerHTML = breadcrumbHTML;
    }

    /**
     * Update table of contents
     */
    updateTOC() {
        // Placeholder - will extract headings from rendered content
        if (!this.elements.tocList) return;
        this.elements.tocList.innerHTML = '<div class="toc-item">Loading...</div>';
    }

    /**
     * Update footer navigation (prev/next)
     */
    updateFooterNavigation() {
        // Placeholder - will implement prev/next logic
        if (!this.elements.footer) return;
        this.elements.footer.innerHTML = '';
    }

    /**
     * Handle search
     */
    handleSearch(query) {
        console.log('Search query:', query);
        // Will implement search functionality
    }

    /**
     * Set documentation title
     */
    setTitle(title) {
        if (this.elements.title) {
            this.elements.title.textContent = title;
        }
    }
}
