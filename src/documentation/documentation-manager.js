/**
 * Documentation Manager - Core module for handling multi-file documentation
 * Handles ZIP extraction, file management, and state
 */

import JSZip from 'jszip';

export class DocumentationManager {
    constructor() {
        this.state = {
            isActive: false,
            files: new Map(),           // path -> content
            structure: null,            // navigation tree
            currentPage: null,          // active file path
            assets: new Map(),          // path -> blob (images, etc)
            config: {},                 // documentation config
            metadata: {}                // title, description, etc
        };
    }

    /**
     * Initialize documentation from ZIP file
     */
    async loadFromZip(zipFile) {
        try {
            // We'll implement ZIP extraction in next step
            console.log('Loading ZIP file:', zipFile.name);
            
            // Extract files
            const extracted = await this.extractZip(zipFile);
            
            // Parse structure
            this.state.structure = this.buildNavigationTree(extracted.files);
            
            // Set first page as active
            this.state.currentPage = this.findFirstPage();
            
            // Mark as active
            this.state.isActive = true;
            
            return {
                success: true,
                pageCount: this.state.files.size,
                structure: this.state.structure
            };
        } catch (error) {
            console.error('Failed to load documentation:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Extract ZIP file contents
     */
    async extractZip(zipFile) {
        const zip = new JSZip();
        const contents = await zip.loadAsync(zipFile);
        
        const files = new Map();
        const assets = new Map();
        
        // Process each file in the ZIP
        for (const [path, zipEntry] of Object.entries(contents.files)) {
            // Skip directories
            if (zipEntry.dir) continue;
            
            // Skip hidden files and system files
            if (path.startsWith('.') || path.includes('/.')) continue;
            
            // Check file type
            if (path.endsWith('.md')) {
                // Markdown file
                const content = await zipEntry.async('text');
                files.set(path, content);
                console.log('Loaded markdown:', path);
            } else if (this.isAsset(path)) {
                // Asset file (image, css, etc)
                const blob = await zipEntry.async('blob');
                assets.set(path, blob);
                console.log('Loaded asset:', path);
            }
        }
        
        // Store in state
        this.state.files = files;
        this.state.assets = assets;
        
        console.log(`Extracted ${files.size} markdown files, ${assets.size} assets`);
        
        return { files, assets };
    }

    /**
     * Check if file is an asset
     */
    isAsset(path) {
        const assetExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', 
                                '.css', '.js', '.json', '.pdf'];
        return assetExtensions.some(ext => path.toLowerCase().endsWith(ext));
    }

    /**
     * Build navigation tree from files
     */
    buildNavigationTree(files) {
        const tree = {
            name: 'root',
            type: 'folder',
            children: []
        };

        // Convert Map to array of paths
        const paths = Array.from(files.keys()).sort();
        
        // Build tree structure
        paths.forEach(path => {
            this.addPathToTree(tree, path);
        });

        return tree;
    }

    /**
     * Add a file path to the tree structure
     */
    addPathToTree(tree, path) {
        const parts = path.split('/');
        let current = tree;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            
            // Find or create node
            let node = current.children.find(child => child.name === part);
            
            if (!node) {
                node = {
                    name: part,
                    type: isFile ? 'file' : 'folder',
                    path: parts.slice(0, index + 1).join('/'),
                    children: isFile ? undefined : []
                };
                current.children.push(node);
            }
            
            if (!isFile) {
                current = node;
            }
        });
    }

    /**
     * Find first page to display
     */
    findFirstPage() {
        // Look for README.md or index.md first
        if (this.state.files.has('README.md')) return 'README.md';
        if (this.state.files.has('index.md')) return 'index.md';
        
        // Return first file
        const firstFile = Array.from(this.state.files.keys())[0];
        return firstFile || null;
    }

    /**
     * Get current page content
     */
    getCurrentPage() {
        if (!this.state.currentPage) return null;
        return this.state.files.get(this.state.currentPage);
    }

    /**
     * Navigate to a specific page
     */
    navigateTo(path) {
        if (this.state.files.has(path)) {
            this.state.currentPage = path;
            return true;
        }
        return false;
    }

    /**
     * Get navigation structure
     */
    getStructure() {
        return this.state.structure;
    }

    /**
     * Check if documentation mode is active
     */
    isActive() {
        return this.state.isActive;
    }

    /**
     * Deactivate documentation mode
     */
    deactivate() {
        this.state.isActive = false;
        this.state.currentPage = null;
    }

    /**
     * Get all file paths
     */
    getAllPaths() {
        return Array.from(this.state.files.keys());
    }
}
