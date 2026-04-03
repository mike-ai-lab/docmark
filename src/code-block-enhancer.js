/**
 * Code Block Enhancer
 * Adds syntax highlighting and copy buttons to code blocks
 */

export function enhanceCodeBlocks() {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
        const pre = codeBlock.parentElement;
        
        // Skip if already enhanced
        if (pre.classList.contains('code-block-enhanced')) return;
        
        // Mark as enhanced
        pre.classList.add('code-block-enhanced');
        
        // Wrap in container for positioning
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        wrapper.style.cssText = 'position: relative;';
        
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        
        // Apply syntax highlighting if hljs is available
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(codeBlock);
        }
        
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="8" height="10" rx="1"/>
                <path d="M8 4V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2"/>
            </svg>
        `;
        copyBtn.title = 'Copy code';
        
        copyBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: transparent;
            border: none;
            border-radius: 4px;
            padding: 6px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            z-index: 10;
        `;
        
        // Adapt to theme
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            copyBtn.style.color = '#cbd5e1';
        }
        
        // Show button on hover
        wrapper.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });
        
        wrapper.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });
        
        // Copy functionality
        copyBtn.addEventListener('click', async () => {
            const code = codeBlock.textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                
                // Show success feedback
                copyBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 8l3 3 7-7"/>
                    </svg>
                `;
                copyBtn.style.color = '#10b981';
                
                setTimeout(() => {
                    copyBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="4" y="4" width="8" height="10" rx="1"/>
                            <path d="M8 4V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2"/>
                        </svg>
                    `;
                    copyBtn.style.color = '#64748b';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
            }
        });
        
        wrapper.appendChild(copyBtn);
    });
}

// Auto-enhance on content changes
export function initCodeBlockEnhancer() {
    // Initial enhancement
    enhanceCodeBlocks();
    
    // Watch for content changes
    const observer = new MutationObserver(() => {
        enhanceCodeBlocks();
    });
    
    // Observe the preview area (single file mode)
    const previewArea = document.querySelector('#output');
    if (previewArea) {
        observer.observe(previewArea, {
            childList: true,
            subtree: true
        });
    }
    
    // Observe the documentation content area (documentation mode)
    const docsContent = document.querySelector('.docs-content');
    if (docsContent) {
        observer.observe(docsContent, {
            childList: true,
            subtree: true
        });
    }
    
    // Re-enhance when switching modes or themes
    document.addEventListener('themeChanged', enhanceCodeBlocks);
    document.addEventListener('documentationModeChanged', enhanceCodeBlocks);
    
    console.log('✅ Code block enhancer initialized');
}
