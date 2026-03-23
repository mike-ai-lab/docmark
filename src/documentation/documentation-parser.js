/**
 * Documentation Parser
 * Handles parsing of SUMMARY.md (GitBook format) and config files
 */

export class DocumentationParser {
    
    /**
     * Parse SUMMARY.md file (GitBook format)
     * Creates a structure compatible with the navigation UI
     */
    parseSummary(summaryContent) {
        console.log('🔍 [PARSER] Starting SUMMARY.md parse...');
        const lines = summaryContent.split('\n');
        const structure = {
            name: 'root',
            type: 'folder',
            children: []
        };
        
        // Track parent stack for nesting
        const stack = [{ node: structure, level: -1 }];
        
        lines.forEach((line, lineNum) => {
            // Skip empty lines and headers
            if (!line.trim() || line.trim().startsWith('#')) return;
            
            // Match markdown list items: * [Title](path.md)
            const match = line.match(/^(\s*)\*\s*\[([^\]]+)\]\(([^)]+)\)/);
            if (!match) return;
            
            const indent = match[1].length;
            const title = match[2].trim();
            const path = match[3].trim();
            
            // Calculate nesting level (2 spaces = 1 level)
            const level = Math.floor(indent / 2);
            
            console.log(`🔍 [PARSER] Line ${lineNum}: "${title}" -> ${path} (level ${level}, indent ${indent})`);
            
            // Create node
            const node = {
                name: title,
                type: 'file',
                path: path,
                children: [] // Always initialize children array
            };
            
            // Pop stack to find correct parent
            while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                stack.pop();
            }
            
            const parent = stack[stack.length - 1].node;
            
            // Add to parent
            parent.children.push(node);
            
            // Push this node to stack for potential children
            stack.push({ node: node, level: level });
            
            console.log(`🔍 [PARSER] Added "${title}" to parent (stack depth: ${stack.length})`);
        });
        
        // Post-process: Convert nodes with children to folders
        this.convertNodesToFolders(structure);
        
        console.log('✓ Parsed SUMMARY.md with', this.countNodes(structure), 'items');
        console.log('🔍 [PARSER] Final structure:', JSON.stringify(structure, null, 2));
        return structure;
    }
    
    /**
     * Convert nodes with children to folder type
     */
    convertNodesToFolders(node) {
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                // If child has children, it's a folder
                if (child.children && child.children.length > 0) {
                    child.type = 'folder';
                    console.log(`🔍 [PARSER] Converted "${child.name}" to folder (has ${child.children.length} children)`);
                } else {
                    // Remove empty children array from files
                    delete child.children;
                }
                // Recurse
                this.convertNodesToFolders(child);
            });
        }
    }
    
    /**
     * Parse book.json or config.json
     */
    parseConfig(configContent) {
        try {
            const config = JSON.parse(configContent);
            
            const parsed = {
                title: config.title || 'Documentation',
                description: config.description || '',
                author: config.author || '',
                language: config.language || 'en',
                links: config.links || {},
                plugins: config.plugins || [],
                pluginsConfig: config.pluginsConfig || {}
            };
            
            console.log('✓ Parsed config:', parsed.title);
            return parsed;
            
        } catch (error) {
            console.error('Failed to parse config:', error);
            return this.getDefaultConfig();
        }
    }
    
    /**
     * Get default configuration
     */
    getDefaultConfig() {
        return {
            title: 'Documentation',
            description: '',
            author: '',
            language: 'en',
            links: {},
            plugins: [],
            pluginsConfig: {}
        };
    }
    
    /**
     * Count total nodes in tree
     */
    countNodes(node) {
        let count = node.children ? node.children.length : 0;
        if (node.children) {
            node.children.forEach(child => {
                count += this.countNodes(child);
            });
        }
        return count;
    }
    
    /**
     * Validate SUMMARY.md format
     */
    validateSummary(summaryContent) {
        const lines = summaryContent.split('\n').filter(l => l.trim());
        
        // Check if it has list items
        const hasListItems = lines.some(line => line.match(/^\s*\*\s*\[/));
        
        if (!hasListItems) {
            return {
                valid: false,
                error: 'No valid list items found in SUMMARY.md'
            };
        }
        
        return { valid: true };
    }
}
