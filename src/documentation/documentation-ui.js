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
        if (!container) {
            console.error('Container not found');
            return;
        }

        // Create docs layout as a SIBLING to container (not inside it)
        const docsLayout = document.createElement('div');
        docsLayout.id = 'docs-layout';
        docsLayout.className = 'docs-layout hidden';
        docsLayout.innerHTML = `
            <!-- Documentation Content Wrapper -->
            <div class="docs-content-wrapper">
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
            </div>
        `;

        // Insert AFTER the container, not inside it
        container.parentNode.insertBefore(docsLayout, container.nextSibling);
        
        console.log('✓ Documentation layout created as sibling to container');
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

        if (node.type === 'folder' && node.name !== 'root') {
            const hasChildren = node.children && node.children.length > 0;
            const folderId = `folder-${Math.random().toString(36).substr(2, 9)}`;
            const safeName = this.escapeHtml(node.name);
            const path = node.path || '';
            
            console.log(`🔍 [UI] Building folder: "${node.name}" (path: "${path}", hasChildren: ${hasChildren})`);
            
            html += `<div class="nav-section">`;
            html += `<div class="nav-folder ${hasChildren ? 'has-children' : ''}" data-folder-id="${folderId}" data-path="${path}">`;
            html += `<span class="nav-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${hasChildren ? '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>' : '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline>'}
                </svg>
            </span>`;
            html += `<span>${safeName}</span>`;
            if (hasChildren) {
                html += `<span class="nav-toggle">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>`;
            }
            html += `</div>`;

            if (hasChildren) {
                html += `<div class="nav-children" id="${folderId}">`;
                node.children.forEach(child => {
                    html += this.buildNavigationHTML(child, level + 1);
                });
                html += `</div>`;
            }
            html += `</div>`;
        } else if (node.type === 'file') {
            const safeName = this.escapeHtml(node.name);
            const path = node.path || '';
            console.log(`🔍 [UI] Building file: "${node.name}" (path: "${path}")`);
            html += `<div class="nav-file" data-path="${path}">`;
            html += `<span class="nav-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
            </span>`;
            html += `<span>${safeName}</span>`;
            html += `</div>`;
        } else if (node.name === 'root') {
            // Root node - just render children
            console.log(`🔍 [UI] Building root with ${node.children ? node.children.length : 0} children`);
            if (node.children) {
                node.children.forEach(child => {
                    html += this.buildNavigationHTML(child, level);
                });
            }
        }

        return html;
    }
    
    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Attach click handlers to navigation items
     */
    attachNavigationHandlers() {
        // File click handlers
        const navFiles = this.elements.nav.querySelectorAll('.nav-file');
        console.log(`🔍 [UI] Attaching handlers to ${navFiles.length} files`);
        navFiles.forEach((file, index) => {
            const path = file.getAttribute('data-path');
            console.log(`🔍 [UI] File ${index}: path="${path}"`);
            file.addEventListener('click', () => {
                console.log(`🔍 [UI] File clicked: "${path}"`);
                if (path && path.trim()) {
                    this.handlePageNavigation(path);
                } else {
                    console.error(`❌ [UI] File has no path!`);
                }
            });
        });
        
        // Folder click handlers (for folders that are also pages)
        const navFolders = this.elements.nav.querySelectorAll('.nav-folder');
        console.log(`🔍 [UI] Attaching handlers to ${navFolders.length} folders`);
        navFolders.forEach((folder, index) => {
            const path = folder.getAttribute('data-path');
            const folderId = folder.getAttribute('data-folder-id');
            console.log(`🔍 [UI] Folder ${index}: path="${path}", folderId="${folderId}"`);
            
            folder.addEventListener('click', (e) => {
                console.log(`🔍 [UI] Folder clicked: path="${path}", folderId="${folderId}"`);
                
                // Toggle children visibility
                if (folderId) {
                    const children = document.getElementById(folderId);
                    const toggle = folder.querySelector('.nav-toggle');
                    
                    if (children) {
                        const isHidden = children.style.display === 'none';
                        children.style.display = isHidden ? 'block' : 'none';
                        if (toggle) {
                            const svg = toggle.querySelector('svg');
                            if (svg) {
                                svg.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
                            }
                        }
                        console.log(`🔍 [UI] Toggled children: ${isHidden ? 'shown' : 'hidden'}`);
                    }
                }
                
                // If folder has a path, navigate to it
                if (path && path.trim()) {
                    console.log(`🔍 [UI] Navigating to folder path: "${path}"`);
                    this.handlePageNavigation(path);
                } else {
                    console.log(`🔍 [UI] Folder has no path, just toggling`);
                }
            });
        });
    }

    /**
     * Handle page navigation
     */
    handlePageNavigation(path) {
        console.log(`🔍 [UI] handlePageNavigation called with: "${path}"`);
        const fileExists = this.manager.state.files.has(path);
        console.log(`🔍 [UI] File exists in manager: ${fileExists}`);
        
        if (fileExists) {
            const success = this.manager.navigateTo(path);
            console.log(`🔍 [UI] Navigation success: ${success}`);
            if (success) {
                this.renderCurrentPage();
                this.updateActiveNavItem(path);
            }
        } else {
            console.error(`❌ [UI] File not found: "${path}"`);
            console.log(`🔍 [UI] Available files:`, Array.from(this.manager.state.files.keys()));
        }
    }

    /**
     * Render current page content
     */
    renderCurrentPage() {
        const content = this.manager.getCurrentPage();
        if (!content || !this.elements.page) return;

        // Render markdown
        const html = this.renderMarkdown(content);
        this.elements.page.innerHTML = html;

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
        // Remove active class from all items (files and folders)
        const navFiles = this.elements.nav.querySelectorAll('.nav-file');
        const navFolders = this.elements.nav.querySelectorAll('.nav-folder');
        
        navFiles.forEach(file => file.classList.remove('active'));
        navFolders.forEach(folder => folder.classList.remove('active'));
        
        // Add active class to matching item
        navFiles.forEach(file => {
            if (file.getAttribute('data-path') === path) {
                file.classList.add('active');
                console.log(`🔍 [UI] Activated file: ${path}`);
            }
        });
        
        navFolders.forEach(folder => {
            if (folder.getAttribute('data-path') === path) {
                folder.classList.add('active');
                console.log(`🔍 [UI] Activated folder: ${path}`);
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

        const parts = path.split('/').filter(p => p);
        const breadcrumbHTML = ['Home'].concat(parts).map((part, index, arr) => {
            const isLast = index === arr.length - 1;
            // Remove .md extension from display
            const display = part.replace('.md', '');
            return isLast ? `<strong>${display}</strong>` : display;
        }).join(' / ');

        this.elements.breadcrumb.innerHTML = breadcrumbHTML;
    }

    /**
     * Update table of contents
     */
    updateTOC() {
        if (!this.elements.tocList || !this.elements.page) return;
        
        // Extract all headings from the rendered page
        const headings = this.elements.page.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        if (headings.length === 0) {
            this.elements.tocList.innerHTML = '<div class="toc-item">No headings found</div>';
            return;
        }
        
        let tocHTML = '';
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1));
            const text = heading.textContent;
            const id = `heading-${index}`;
            
            // Add ID to heading for linking
            heading.id = id;
            
            // Create TOC item with indentation based on level
            const indent = (level - 1) * 12;
            tocHTML += `<div class="toc-item" data-target="${id}" style="padding-left: ${indent}px">${text}</div>`;
        });
        
        this.elements.tocList.innerHTML = tocHTML;
        
        // Attach click handlers
        this.elements.tocList.querySelectorAll('.toc-item').forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.getAttribute('data-target');
                const target = document.getElementById(targetId);
                if (target) {
                    // Get the scrollable container (docs-content)
                    const scrollContainer = document.querySelector('.docs-content');
                    if (scrollContainer) {
                        // Calculate position relative to container
                        const containerRect = scrollContainer.getBoundingClientRect();
                        const targetRect = target.getBoundingClientRect();
                        const scrollTop = scrollContainer.scrollTop;
                        const offset = targetRect.top - containerRect.top + scrollTop - 20; // 20px padding
                        
                        // Smooth scroll within container
                        scrollContainer.scrollTo({
                            top: offset,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /**
     * Update footer navigation (prev/next)
     */
    updateFooterNavigation() {
        if (!this.elements.footer) return;
        
        // Use ordered paths (respects SUMMARY.md order)
        const allPaths = this.manager.getOrderedPaths();
        const currentPath = this.manager.state.currentPage;
        const currentIndex = allPaths.indexOf(currentPath);
        
        console.log(`🔍 [UI] Footer nav: current="${currentPath}", index=${currentIndex}, total=${allPaths.length}`);
        console.log(`🔍 [UI] All paths:`, allPaths);
        
        if (currentIndex === -1) {
            console.warn(`⚠️ [UI] Current page not found in ordered paths!`);
            this.elements.footer.innerHTML = '';
            return;
        }
        
        const prevPath = currentIndex > 0 ? allPaths[currentIndex - 1] : null;
        const nextPath = currentIndex < allPaths.length - 1 ? allPaths[currentIndex + 1] : null;
        
        console.log(`🔍 [UI] Prev: ${prevPath}, Next: ${nextPath}`);
        
        let html = '<div class="nav-links">';
        
        if (prevPath) {
            const prevName = this.getPageTitle(prevPath);
            html += `
                <a href="#" class="nav-link nav-prev" data-path="${prevPath}">
                    <span class="nav-link-label">← Previous</span>
                    <span class="nav-link-title">${prevName}</span>
                </a>
            `;
        } else {
            html += '<span></span>'; // Spacer
        }
        
        if (nextPath) {
            const nextName = this.getPageTitle(nextPath);
            html += `
                <a href="#" class="nav-link nav-next" data-path="${nextPath}">
                    <span class="nav-link-label">Next →</span>
                    <span class="nav-link-title">${nextName}</span>
                </a>
            `;
        }
        
        html += '</div>';
        
        this.elements.footer.innerHTML = html;
        
        // Attach click handlers
        this.elements.footer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('data-path');
                console.log(`🔍 [UI] Footer link clicked: "${path}"`);
                this.handlePageNavigation(path);
            });
        });
    }
    
    /**
     * Get page title from path (try to find in structure, fallback to filename)
     */
    getPageTitle(path) {
        // Try to find the title in the navigation structure
        const title = this.findTitleInStructure(this.manager.state.structure, path);
        if (title) return title;
        
        // Fallback: use filename without extension
        return path.split('/').pop().replace('.md', '');
    }
    
    /**
     * Find title for a path in the navigation structure
     */
    findTitleInStructure(node, targetPath) {
        if (node.path === targetPath) {
            return node.name;
        }
        if (node.children) {
            for (const child of node.children) {
                const found = this.findTitleInStructure(child, targetPath);
                if (found) return found;
            }
        }
        return null;
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
