/**
 * MultiFileResolver - Resolves and injects dependencies for multi-file projects
 * Handles HTML files with external CSS/JS, React components with imports, etc.
 */

export class MultiFileResolver {
    constructor(fileTree, findNodeInTree) {
        this.fileTree = fileTree;
        this.findNodeInTree = findNodeInTree;
        
        // Debug: Log the file tree structure
        console.log('🌳 [RESOLVER] File tree initialized:', this.fileTree);
        this.debugFileTree();
    }

    /**
     * Debug helper to log all files in the tree
     */
    debugFileTree() {
        const listFiles = (nodes, indent = '') => {
            const files = [];
            for (const node of nodes) {
                if (node.type === 'file') {
                    files.push(`${indent}📄 ${node.name} (path: "${node.path}", id: ${node.id})`);
                } else if (node.type === 'folder') {
                    files.push(`${indent}📁 ${node.name}/ (path: "${node.path || 'no path'}")`);
                    if (node.children && node.children.length > 0) {
                        files.push(...listFiles(node.children, indent + '  '));
                    } else {
                        files.push(`${indent}  (empty folder)`);
                    }
                }
            }
            return files;
        };
        
        const fileList = listFiles(this.fileTree);
        console.log('🌳 [RESOLVER] Available files:\n' + fileList.join('\n'));
        console.log('🌳 [RESOLVER] Total nodes in tree:', this.fileTree.length);
    }

    /**
     * Find a file by path in the file tree (case-insensitive)
     */
    findFileByPath(path) {
        const findInTree = (nodes, targetPath) => {
            const targetLower = targetPath.toLowerCase();
            
            for (const node of nodes) {
                if (node.type === 'file') {
                    // Check exact path match (case-insensitive)
                    if (node.path && node.path.toLowerCase() === targetLower) {
                        return node;
                    }
                    // Check if just the filename matches (case-insensitive)
                    if (node.name.toLowerCase() === targetLower) {
                        return node;
                    }
                    // Check if path ends with the target (case-insensitive)
                    if (node.path && node.path.toLowerCase().endsWith(targetLower)) {
                        return node;
                    }
                    // Check if name ends with the target filename (case-insensitive)
                    const targetFilename = targetPath.split('/').pop().toLowerCase();
                    if (node.name.toLowerCase() === targetFilename) {
                        return node;
                    }
                }
                if (node.type === 'folder' && node.children) {
                    const found = findInTree(node.children, targetPath);
                    if (found) return found;
                }
            }
            return null;
        };
        return findInTree(this.fileTree, path);
    }

    /**
     * Resolve relative path from current file
     */
    resolvePath(currentFilePath, relativePath) {
        // If it's just a filename (no path separators), look in the same directory
        if (!relativePath.includes('/') && !relativePath.includes('\\')) {
            const currentDir = currentFilePath.split('/').slice(0, -1).join('/');
            return currentDir ? `${currentDir}/${relativePath}` : relativePath;
        }

        const currentDir = currentFilePath.split('/').slice(0, -1).join('/');
        const parts = relativePath.split('/');
        const dirParts = currentDir ? currentDir.split('/') : [];

        for (const part of parts) {
            if (part === '..') {
                dirParts.pop();
            } else if (part !== '.' && part !== '') {
                dirParts.push(part);
            }
        }

        return dirParts.join('/');
    }

    /**
     * Extract all external file references from HTML
     */
    extractHtmlDependencies(html) {
        const dependencies = {
            css: [],
            js: [],
            images: []
        };

        console.log('🔍 [RESOLVER] Extracting dependencies from HTML (length:', html.length, ')');
        console.log('🔍 [RESOLVER] HTML preview:', html.substring(0, 500));

        // Match CSS links - more flexible regex
        const cssRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>|<link[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi;
        let match;
        let cssMatches = 0;
        while ((match = cssRegex.exec(html)) !== null) {
            cssMatches++;
            const href = match[1] || match[2];
            console.log('🔍 [RESOLVER] CSS match #' + cssMatches + ':', href, 'from:', match[0]);
            if (href && href.endsWith('.css')) {
                dependencies.css.push(href);
            }
        }
        console.log('🔍 [RESOLVER] Total CSS matches:', cssMatches);

        // Match JS scripts - more flexible regex
        const jsRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
        let jsMatches = 0;
        while ((match = jsRegex.exec(html)) !== null) {
            jsMatches++;
            console.log('🔍 [RESOLVER] JS match #' + jsMatches + ':', match[1], 'from:', match[0]);
            if (match[1]) {
                dependencies.js.push(match[1]);
            }
        }
        console.log('🔍 [RESOLVER] Total JS matches:', jsMatches);

        // Match images
        const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
        while ((match = imgRegex.exec(html)) !== null) {
            if (match[1]) {
                dependencies.images.push(match[1]);
            }
        }

        return dependencies;
    }

    /**
     * Extract imports from JavaScript/React files
     */
    extractJsImports(code) {
        const imports = [];
        
        // Match ES6 imports
        const importRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?["']([^"']+)["']/g;
        let match;
        while ((match = importRegex.exec(code)) !== null) {
            const importPath = match[1];
            // Only process relative imports, skip CSS and other non-JS files
            if ((importPath.startsWith('./') || importPath.startsWith('../')) && 
                !importPath.endsWith('.css') && 
                !importPath.endsWith('.scss') && 
                !importPath.endsWith('.sass') &&
                !importPath.endsWith('.less')) {
                imports.push(importPath);
            }
        }

        // Match require statements
        const requireRegex = /require\s*\(\s*["']([^"']+)["']\s*\)/g;
        while ((match = requireRegex.exec(code)) !== null) {
            const requirePath = match[1];
            if ((requirePath.startsWith('./') || requirePath.startsWith('../')) &&
                !requirePath.endsWith('.css') &&
                !requirePath.endsWith('.scss') &&
                !requirePath.endsWith('.sass') &&
                !requirePath.endsWith('.less')) {
                imports.push(requirePath);
            }
        }

        return imports;
    }

    /**
     * Inject CSS content into HTML
     */
    injectCss(html, currentFilePath) {
        const dependencies = this.extractHtmlDependencies(html);
        let modifiedHtml = html;

        console.log('🎨 [RESOLVER] Found CSS dependencies:', dependencies.css);
        console.log('🎨 [RESOLVER] Current file path:', currentFilePath);

        for (const cssPath of dependencies.css) {
            const resolvedPath = this.resolvePath(currentFilePath, cssPath);
            console.log('🎨 [RESOLVER] Resolving CSS:', cssPath, '→', resolvedPath);
            
            const cssFile = this.findFileByPath(resolvedPath);
            console.log('🎨 [RESOLVER] Found CSS file:', cssFile ? cssFile.name : 'NOT FOUND');

            if (cssFile && cssFile.content) {
                // Replace link tag with inline style
                const linkRegex = new RegExp(`<link[^>]+href=["']${cssPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'gi');
                modifiedHtml = modifiedHtml.replace(linkRegex, `<style>\n${cssFile.content}\n</style>`);
                console.log('✅ [RESOLVER] Injected CSS:', cssPath);
            } else {
                console.warn('⚠️ [RESOLVER] CSS file not found:', resolvedPath);
            }
        }

        return modifiedHtml;
    }

    /**
     * Inject JS content into HTML
     */
    injectJs(html, currentFilePath) {
        const dependencies = this.extractHtmlDependencies(html);
        let modifiedHtml = html;

        console.log('📜 [RESOLVER] Found JS dependencies:', dependencies.js);
        console.log('📜 [RESOLVER] Current file path:', currentFilePath);

        for (const jsPath of dependencies.js) {
            const resolvedPath = this.resolvePath(currentFilePath, jsPath);
            console.log('📜 [RESOLVER] Resolving JS:', jsPath, '→', resolvedPath);
            
            const jsFile = this.findFileByPath(resolvedPath);
            console.log('📜 [RESOLVER] Found JS file:', jsFile ? jsFile.name : 'NOT FOUND');

            if (jsFile && jsFile.content) {
                // Replace script tag with inline script
                // Use a more specific regex that handles both <script src="..."></script> and <script src="..."/>
                const scriptRegex = new RegExp(`<script[^>]*src=["']${jsPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>\\s*</script>|<script[^>]*src=["']${jsPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*/?>`, 'gi');
                
                // Wrap the script in a DOMContentLoaded event to ensure it runs after the DOM is ready
                const wrappedScript = `<script>
// Injected from ${jsPath}
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ${jsFile.content}
        });
    } else {
        ${jsFile.content}
    }
})();
</script>`;
                
                modifiedHtml = modifiedHtml.replace(scriptRegex, wrappedScript);
                console.log('✅ [RESOLVER] Injected JS:', jsPath);
            } else {
                console.warn('⚠️ [RESOLVER] JS file not found:', resolvedPath);
            }
        }

        return modifiedHtml;
    }

    /**
     * Process HTML file with all dependencies
     */
    processHtml(html, currentFilePath) {
        console.log('🔧 [RESOLVER] Processing HTML:', currentFilePath);
        let processed = html;
        
        // Inject CSS first
        processed = this.injectCss(processed, currentFilePath);
        
        // Then inject JS
        processed = this.injectJs(processed, currentFilePath);
        
        console.log('✅ [RESOLVER] HTML processing complete');
        return processed;
    }

    /**
     * Resolve React component imports
     */
    resolveReactImports(code, currentFilePath) {
        console.log('⚛️ [RESOLVER] Resolving React imports:', currentFilePath);
        const imports = this.extractJsImports(code);
        const resolvedModules = {};

        for (const importPath of imports) {
            // Add common extensions if not present
            const possiblePaths = [
                importPath,
                `${importPath}.js`,
                `${importPath}.jsx`,
                `${importPath}.ts`,
                `${importPath}.tsx`
            ];

            let resolved = false;
            for (const path of possiblePaths) {
                const resolvedPath = this.resolvePath(currentFilePath, path);
                const file = this.findFileByPath(resolvedPath);

                if (file && file.content) {
                    resolvedModules[importPath] = {
                        path: resolvedPath,
                        content: file.content
                    };
                    console.log('✅ [RESOLVER] Resolved import:', importPath, '→', resolvedPath);
                    resolved = true;
                    break;
                }
            }

            if (!resolved) {
                console.warn('⚠️ [RESOLVER] Import not found:', importPath);
            }
        }

        return resolvedModules;
    }

    /**
     * Bundle React component with all dependencies
     */
    bundleReactComponent(code, currentFilePath) {
        console.log('📦 [RESOLVER] Bundling React component:', currentFilePath);
        const imports = this.resolveReactImports(code, currentFilePath);
        
        // Build a map of all resolved modules
        const moduleMap = {};
        
        // Recursively resolve all imports
        const resolveRecursive = (filePath, fileContent) => {
            if (moduleMap[filePath]) return; // Already resolved
            
            moduleMap[filePath] = fileContent;
            
            // Find imports in this file
            const fileImports = this.extractJsImports(fileContent);
            for (const importPath of fileImports) {
                if (importPath.startsWith('./') || importPath.startsWith('../')) {
                    const possiblePaths = [
                        importPath,
                        `${importPath}.js`,
                        `${importPath}.jsx`,
                        `${importPath}.ts`,
                        `${importPath}.tsx`
                    ];
                    
                    for (const path of possiblePaths) {
                        const resolvedPath = this.resolvePath(filePath, path);
                        const file = this.findFileByPath(resolvedPath);
                        
                        if (file && file.content && !moduleMap[resolvedPath]) {
                            console.log('📦 [RESOLVER] Recursively resolving:', resolvedPath);
                            resolveRecursive(resolvedPath, file.content);
                            break;
                        }
                    }
                }
            }
        };
        
        // Start recursive resolution
        resolveRecursive(currentFilePath, code);
        
        // Now build the bundled code
        let bundled = '';
        
        // Add all modules except the main one
        for (const [path, content] of Object.entries(moduleMap)) {
            if (path !== currentFilePath) {
                // Remove import/export statements
                let moduleCode = content
                    .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
                    .replace(/export\s+default\s+/g, '')
                    .replace(/export\s+/g, '');
                
                // Extract component name from the file for logging
                const componentMatch = moduleCode.match(/function\s+(\w+)\s*\(/);
                const componentName = componentMatch ? componentMatch[1] : path.split('/').pop().replace(/\.(jsx?|tsx?)$/, '');
                
                // Just add the module code as-is (function declarations are hoisted)
                bundled += `\n// Module: ${path}\n${moduleCode}\n`;
                console.log('✅ [RESOLVER] Bundled module:', componentName, 'from', path);
            }
        }
        
        // Add the main component code (remove imports and exports)
        let mainCode = code
            .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
            .replace(/export\s+default\s+/g, '');
        
        bundled += `\n// Main component\n${mainCode}`;
        
        console.log('✅ [RESOLVER] React bundling complete');
        return bundled;
    }

    /**
     * Extract CSS content for React components
     */
    extractCssForReact(code, currentFilePath) {
        console.log('🎨 [RESOLVER] Extracting CSS for React:', currentFilePath);
        
        // Find CSS imports in the code
        const cssImportRegex = /import\s+['"]([^'"]+\.css)['"]/g;
        let match;
        let allCss = '';
        
        while ((match = cssImportRegex.exec(code)) !== null) {
            const cssPath = match[1];
            console.log('🎨 [RESOLVER] Found CSS import:', cssPath);
            
            // Try to find the CSS file
            const possiblePaths = [
                cssPath,
                cssPath.replace('./', ''),
                this.resolvePath(currentFilePath, cssPath)
            ];
            
            for (const path of possiblePaths) {
                const cssFile = this.findFileByPath(path);
                if (cssFile && cssFile.content) {
                    console.log('✅ [RESOLVER] Found CSS file:', cssFile.name);
                    allCss += `\n/* ${cssFile.name} */\n${cssFile.content}\n`;
                    break;
                }
            }
        }
        
        console.log('✅ [RESOLVER] Total CSS extracted:', allCss.length, 'characters');
        return allCss;
    }
}
