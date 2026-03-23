/**
 * Mermaid.js Renderer Module
 * Handles automatic rendering of mermaid diagrams in markdown preview
 */

const MermaidRenderer = (() => {
    let mermaidLoaded = false;
    let mermaidInitialized = false;
    let mermaidInstance = null;
    let renderQueue = [];
    let renderTimeout = null;
    const DEBOUNCE_DELAY = 300;

    // Load Mermaid.js v11 from CDN as ES module
    const loadMermaid = async () => {
        if (mermaidLoaded && mermaidInstance) {
            return mermaidInstance;
        }

        try {
            // Import Mermaid v11 as ES module
            const module = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
            mermaidInstance = module.default;
            mermaidLoaded = true;
            console.log('✅ Mermaid.js v11 loaded');
            
            // Start banner remover
            setupBannerRemover();
            
            return mermaidInstance;
        } catch (error) {
            console.error('❌ Failed to load Mermaid.js v11:', error);
            throw error;
        }
    };

    // Initialize Mermaid with theme support
    const initMermaid = async (theme = 'default') => {
        if (!mermaidInstance) {
            console.error('Mermaid.js not loaded');
            return false;
        }

        // Mermaid v11 configuration
        const config = {
            startOnLoad: false,
            theme: theme,
            securityLevel: 'loose',
            fontFamily: 'inherit',
            logLevel: 'fatal',
            suppressErrorRendering: true,
            deterministicIds: true,
            deterministicIDSeed: 'mermaid-diagram'
        };

        mermaidInstance.initialize(config);
        mermaidInitialized = true;
        console.log('✅ Mermaid v11 initialized with theme:', theme);
        return true;
    };

    // Detect current theme (dark/light)
    const detectTheme = () => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;
        
        // Check data-theme attribute
        const dataTheme = htmlElement.getAttribute('data-theme') || bodyElement.getAttribute('data-theme');
        if (dataTheme === 'dark') return 'dark';
        
        // Check class names
        if (htmlElement.classList.contains('dark-mode') || 
            htmlElement.classList.contains('dark-theme') ||
            bodyElement.classList.contains('dark-mode') ||
            bodyElement.classList.contains('dark-theme')) {
            return 'dark';
        }
        
        return 'default';
    };

    // Aggressively remove Mermaid error banners
    const removeErrorBanners = () => {
        // Remove all known Mermaid error containers
        const selectors = [
            '#d2l-error-container',
            '.mermaid-error-notification',
            '[id^="d2l-"]',
            '[class*="error-icon"]',
            'body > div[style*="position: fixed"]',
            'body > div[style*="z-index: 9999"]',
            'body > div[style*="z-index: 10000"]'
        ];

        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el && el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            } catch (e) {
                // Ignore errors
            }
        });
    };

    // Set up mutation observer to catch and remove error banners immediately
    const setupBannerRemover = () => {
        const observer = new MutationObserver((mutations) => {
            removeErrorBanners();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: false
        });

        // Also run periodically as backup
        setInterval(removeErrorBanners, 100);
    };

    // Convert ```mermaid blocks to <div class="mermaid">
    const processMermaidBlocks = (container) => {
        if (!container) return;

        // Find all <pre><code class="language-mermaid"> blocks
        const codeBlocks = container.querySelectorAll('pre code.language-mermaid');
        
        let validCount = 0;
        
        codeBlocks.forEach((codeBlock, index) => {
            const preElement = codeBlock.parentElement;
            const mermaidCode = codeBlock.textContent.trim();

            // Skip empty or whitespace-only diagrams
            if (!mermaidCode || mermaidCode.length === 0) {
                console.log(`⚠️ Skipping empty mermaid block ${index + 1}`);
                return;
            }

            // Create mermaid container
            const mermaidDiv = document.createElement('div');
            mermaidDiv.className = 'mermaid';
            mermaidDiv.setAttribute('data-mermaid-index', validCount);
            mermaidDiv.textContent = mermaidCode;

            // Copy data-source-line if exists
            if (preElement.hasAttribute('data-source-line')) {
                mermaidDiv.setAttribute('data-source-line', preElement.getAttribute('data-source-line'));
            }

            // Replace the <pre> with mermaid div
            preElement.replaceWith(mermaidDiv);
            validCount++;
        });

        return validCount;
    };

    // Render all mermaid diagrams
    const renderDiagrams = async (container) => {
        if (!container) return;

        try {
            // Ensure Mermaid is loaded
            if (!mermaidLoaded || !mermaidInstance) {
                await loadMermaid();
            }

            // Initialize with current theme
            const theme = detectTheme();
            await initMermaid(theme);

            // Process mermaid blocks
            const diagramCount = processMermaidBlocks(container);
            
            if (diagramCount === 0) {
                console.log('🔍 No valid mermaid diagrams found');
                return;
            }

            console.log(`🔍 Found ${diagramCount} mermaid diagram(s)`);

            // Get all mermaid elements
            const mermaidElements = container.querySelectorAll('.mermaid');
            
            // Filter out empty elements
            const validElements = Array.from(mermaidElements).filter(el => {
                const code = el.textContent.trim();
                return code && code.length > 0;
            });

            if (validElements.length === 0) {
                console.log('🔍 No valid mermaid content to render');
                return;
            }

            // Render each diagram
            for (let i = 0; i < validElements.length; i++) {
                const element = validElements[i];
                const mermaidCode = element.textContent.trim();

                // Double-check not empty
                if (!mermaidCode) {
                    console.log(`⚠️ Skipping empty diagram ${i + 1}`);
                    continue;
                }

                try {
                    // Generate unique ID
                    const id = `mermaid-${Date.now()}-${i}`;
                    
                    // Render diagram using mermaid instance
                    const { svg } = await mermaidInstance.render(id, mermaidCode);
                    
                    // Replace content with SVG
                    element.innerHTML = svg;
                    element.classList.add('mermaid-rendered');
                    
                    console.log(`✅ Rendered mermaid diagram ${i + 1}/${validElements.length}`);
                } catch (error) {
                    console.error(`❌ Failed to render mermaid diagram ${i + 1}:`, error);
                    
                    // Show error with original code
                    element.innerHTML = `
                        <div class="mermaid-error">
                            <div class="mermaid-error-title">⚠️ Mermaid Rendering Error</div>
                            <div class="mermaid-error-message">${error.message || 'Unknown error'}</div>
                            <pre class="mermaid-error-code"><code>${mermaidCode}</code></pre>
                        </div>
                    `;
                    element.classList.add('mermaid-error-state');
                }
            }
        } catch (error) {
            console.error('❌ Mermaid rendering failed:', error);
        }
    };

    // Debounced render function
    const debouncedRender = (container) => {
        if (renderTimeout) {
            clearTimeout(renderTimeout);
        }

        renderTimeout = setTimeout(() => {
            renderDiagrams(container);
        }, DEBOUNCE_DELAY);
    };

    // Public API
    return {
        // Render diagrams immediately
        render: (container) => {
            return renderDiagrams(container);
        },

        // Render with debounce (for live typing)
        renderDebounced: (container) => {
            debouncedRender(container);
        },

        // Check if mermaid is loaded
        isLoaded: () => mermaidLoaded,

        // Reinitialize with new theme
        updateTheme: (theme) => {
            if (mermaidLoaded && mermaidInstance) {
                initMermaid(theme);
            }
        }
    };
})();

// ES Module export
export default MermaidRenderer;
