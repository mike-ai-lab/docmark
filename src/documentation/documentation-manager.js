/**
 * Documentation Manager - Core module for handling multi-file documentation
 * Handles ZIP extraction, file management, and state
 */

import JSZip from 'jszip';
import { DocumentationParser } from './documentation-parser.js';

export class DocumentationManager {
    constructor() {
        this.state = {
            isActive: false,
            files: new Map(),           // path -> content
            structure: null,            // navigation tree
            currentPage: null,          // active file path
            assets: new Map(),          // path -> blob (images, etc)
            config: {},                 // documentation config
            metadata: {},               // title, description, etc
            hasSummary: false,          // whether SUMMARY.md exists
            hasConfig: false            // whether config file exists
        };
        
        this.parser = new DocumentationParser();
    }

    /**
     * Initialize documentation from ZIP file
     */
    async loadFromZip(zipFile) {
        try {
            console.log('Loading ZIP file:', zipFile.name);
            
            // Extract files
            const extracted = await this.extractZip(zipFile);
            
            // Check for special files
            const hasSummary = this.state.files.has('SUMMARY.md');
            const hasConfig = this.state.files.has('book.json') || this.state.files.has('config.json');
            
            this.state.hasSummary = hasSummary;
            this.state.hasConfig = hasConfig;
            
            // Parse config if exists
            if (hasConfig) {
                const configPath = this.state.files.has('book.json') ? 'book.json' : 'config.json';
                const configContent = this.state.files.get(configPath);
                this.state.config = this.parser.parseConfig(configContent);
                console.log('✓ Loaded config:', this.state.config.title);
            } else {
                this.state.config = this.parser.getDefaultConfig();
            }
            
            // Build structure from SUMMARY.md or auto-generate
            if (hasSummary) {
                const summaryContent = this.state.files.get('SUMMARY.md');
                const validation = this.parser.validateSummary(summaryContent);
                
                if (validation.valid) {
                    this.state.structure = this.parser.parseSummary(summaryContent);
                    console.log('✓ Using SUMMARY.md for navigation');
                    
                    // Debug: Verify all paths in SUMMARY exist in files
                    console.log('🔍 [MANAGER] Verifying SUMMARY.md paths...');
                    const summaryPaths = this.extractAllPaths(this.state.structure);
                    const filePaths = Array.from(this.state.files.keys());
                    console.log('🔍 [MANAGER] SUMMARY paths:', summaryPaths);
                    console.log('🔍 [MANAGER] Available files:', filePaths);
                    
                    summaryPaths.forEach(path => {
                        if (!this.state.files.has(path)) {
                            console.warn(`⚠️ [MANAGER] SUMMARY references missing file: ${path}`);
                        } else {
                            console.log(`✓ [MANAGER] Found file: ${path}`);
                        }
                    });
                } else {
                    console.warn('Invalid SUMMARY.md, auto-generating structure');
                    this.state.structure = this.buildNavigationTree(extracted.files);
                }
            } else {
                this.state.structure = this.buildNavigationTree(extracted.files);
                console.log('✓ Auto-generated navigation structure');
            }
            
            // Set first page as active
            this.state.currentPage = this.findFirstPage();
            
            // Mark as active
            this.state.isActive = true;
            
            return {
                success: true,
                pageCount: this.state.files.size,
                structure: this.state.structure,
                hasSummary: hasSummary,
                hasConfig: hasConfig,
                config: this.state.config
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
            
            // Normalize path to use forward slashes (Unix-style)
            const normalizedPath = path.replace(/\\/g, '/');
            
            // Skip hidden files and system files
            if (normalizedPath.startsWith('.') || normalizedPath.includes('/.') || normalizedPath.startsWith('__MACOSX')) continue;
            
            // Check file type
            if (normalizedPath.endsWith('.md')) {
                // Markdown file
                const content = await zipEntry.async('text');
                files.set(normalizedPath, content);
                console.log('Loaded markdown:', normalizedPath);
            } else if (normalizedPath.endsWith('.json') && (normalizedPath === 'book.json' || normalizedPath === 'config.json')) {
                // Config file
                const content = await zipEntry.async('text');
                files.set(normalizedPath, content);
                console.log('Loaded config:', normalizedPath);
            } else if (this.isAsset(normalizedPath)) {
                // Asset file (image, css, etc)
                const blob = await zipEntry.async('blob');
                assets.set(normalizedPath, blob);
                console.log('Loaded asset:', normalizedPath);
            }
        }
        
        // Store in state
        this.state.files = files;
        this.state.assets = assets;
        
        console.log(`Extracted ${files.size} files, ${assets.size} assets`);
        
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

        // Convert Map to array of paths, excluding config files
        const paths = Array.from(files.keys())
            .filter(path => {
                // Exclude config files and SUMMARY.md from navigation
                return !path.endsWith('book.json') && 
                       !path.endsWith('config.json') && 
                       path !== 'SUMMARY.md';
            })
            .sort();
        
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
        const parts = path.split('/').filter(p => p); // Remove empty parts
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
     * Get all file paths (excluding config files)
     */
    getAllPaths() {
        return Array.from(this.state.files.keys()).filter(path => {
            // Exclude config files and SUMMARY.md
            return !path.endsWith('book.json') && 
                   !path.endsWith('config.json') && 
                   path !== 'SUMMARY.md';
        });
    }
    
    /**
     * Extract all paths from navigation structure in order
     * For SUMMARY.md: preserves exact order from structure
     * For auto-generated: depth-first traversal
     */
    extractAllPaths(node, paths = []) {
        // Process children in order (preserves SUMMARY.md order)
        if (node.children) {
            node.children.forEach(child => {
                // If it's a file, add its path
                if (child.type === 'file' && child.path) {
                    paths.push(child.path);
                }
                // If it's a folder with a path (like README.md), add it
                else if (child.type === 'folder' && child.path) {
                    paths.push(child.path);
                }
                
                // Recurse into children (for nested items)
                if (child.children) {
                    this.extractAllPaths(child, paths);
                }
            });
        }
        
        return paths;
    }
    
    /**
     * Get ordered paths (respects SUMMARY.md order if available)
     */
    getOrderedPaths() {
        if (this.state.hasSummary && this.state.structure) {
            // Use SUMMARY.md order
            const orderedPaths = this.extractAllPaths(this.state.structure);
            console.log('🔍 [MANAGER] Using SUMMARY.md order:');
            orderedPaths.forEach((path, index) => {
                console.log(`  ${index + 1}. ${path}`);
            });
            return orderedPaths;
        } else {
            // Use file system order
            const paths = this.getAllPaths();
            console.log('🔍 [MANAGER] Using file system order:');
            paths.forEach((path, index) => {
                console.log(`  ${index + 1}. ${path}`);
            });
            return paths;
        }
    }

    /**
     * Load placeholder template (for empty documentation mode)
     */
    loadPlaceholder(structure, files) {
        this.state.structure = structure;
        this.state.files = files;
        this.state.currentPage = 'getting-started/README.md';
        this.state.isActive = true;
        this.state.hasSummary = false;
        this.state.hasConfig = false;
        this.state.config = this.parser.getDefaultConfig();
        this.state.config.title = 'Documentation Template';
        
        console.log('✓ Placeholder template loaded');
    }
}
