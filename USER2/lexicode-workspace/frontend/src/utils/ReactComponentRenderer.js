/**
 * React Component Renderer for LexiCode
 * Compiles and renders React/TypeScript components in preview
 */

class ReactComponentRenderer {
  constructor(options = {}) {
    this.options = {
      babelCDN: 'https://unpkg.com/@babel/standalone/babel.min.js',
      reactCDN: 'https://unpkg.com/react@18/umd/react.production.min.js',
      reactDOMCDN: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
      tailwindCDN: 'https://cdn.tailwindcss.com',
      ...options
    };
    this.babelLoaded = false;
    this.babelLoadPromise = null;
  }

  async initialize() {
    if (this.babelLoaded) return;
    if (this.babelLoadPromise) return this.babelLoadPromise;

    this.babelLoadPromise = new Promise((resolve, reject) => {
      if (window.Babel) {
        this.babelLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = this.options.babelCDN;
      script.async = true;
      script.onload = () => {
        this.babelLoaded = true;
        console.log('✅ [React Renderer] Babel loaded');
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Babel compiler'));
      document.head.appendChild(script);
    });

    return this.babelLoadPromise;
  }

  parseImports(code) {
    const lines = code.split('\n');
    const cleanLines = [];
    const imports = [];
    let inImportBlock = false;
    let currentImport = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('import ')) {
        inImportBlock = true;
        currentImport = line;
        
        if (line.includes(';') || (line.includes('from') && line.match(/['"]/) && line.match(/['"]/).length >= 2)) {
          inImportBlock = false;
          this._parseImportLine(currentImport, imports);
          currentImport = '';
        }
        continue;
      }
      
      if (inImportBlock) {
        currentImport += ' ' + line;
        if (line.includes(';') || line.includes('from')) {
          inImportBlock = false;
          this._parseImportLine(currentImport, imports);
          currentImport = '';
        }
        continue;
      }
      
      cleanLines.push(lines[i]);
    }

    const mocks = this._generateMocks(imports);
    return { cleanCode: cleanLines.join('\n'), mocks };
  }

  _parseImportLine(importStr, importsArray) {
    const match = importStr.match(/import\s+(?:(\w+)|(?:\{([^}]+)\}))\s+from\s+['"]([^'"]+)['"]/);
    if (match) {
      const defaultImport = match[1];
      const namedImports = match[2];
      const source = match[3];
      
      if (defaultImport) importsArray.push({ name: defaultImport, source });
      if (namedImports) {
        namedImports.split(',').forEach(spec => {
          const cleaned = spec.trim().split(/\s+as\s+/).pop().trim();
          if (cleaned) importsArray.push({ name: cleaned, source });
        });
      }
    }
  }

  _generateMocks(imports) {
    const mockSet = new Set();
    const mocks = imports.map(imp => {
      if (mockSet.has(imp.name)) return '';
      mockSet.add(imp.name);
      
      // Framer Motion
      if (imp.source.includes('framer-motion')) {
        if (imp.name === 'motion') {
          return `const motion = { div: (props) => React.createElement('div', props), span: (props) => React.createElement('span', props), img: (props) => React.createElement('img', props), button: (props) => React.createElement('button', props), section: (props) => React.createElement('section', props), article: (props) => React.createElement('article', props), h1: (props) => React.createElement('h1', props), h2: (props) => React.createElement('h2', props), p: (props) => React.createElement('p', props), header: (props) => React.createElement('header', props), nav: (props) => React.createElement('nav', props), footer: (props) => React.createElement('footer', props) };`;
        }
        if (imp.name === 'AnimatePresence') {
          return `const AnimatePresence = ({ children, mode, ...props }) => React.createElement('div', props, children);`;
        }
        return `const ${imp.name} = (props) => React.createElement('div', props, props.children);`;
      }
      
      // Icon libraries
      if (imp.source.includes('lucide') || imp.source.includes('react-icons')) {
        return this._generateIconMock(imp.name);
      }
      
      return '';
    }).filter(Boolean).join('\n        ');

    return mocks;
  }

  _generateIconMock(iconName) {
    const iconPaths = {
      Heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
      Star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
      Mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
      User: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
      Search: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
      Menu: '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>',
      X: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
      Check: '<polyline points="20 6 9 17 4 12"></polyline>',
      ChevronDown: '<polyline points="6 9 12 15 18 9"></polyline>',
      ChevronUp: '<polyline points="18 15 12 9 6 15"></polyline>',
      ChevronLeft: '<polyline points="15 18 9 12 15 6"></polyline>',
      ChevronRight: '<polyline points="9 18 15 12 9 6"></polyline>',
      ArrowRight: '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
      Home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
      Settings: '<circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m-2 2l-4.2 4.2m13.2-5.2l-4.2-4.2m-2 2l-4.2-4.2"></path>',
    };
    
    const path = iconPaths[iconName] || '<circle cx="12" cy="12" r="10"></circle>';
    const escapedPath = path.replace(/"/g, '\\"');
    return `const ${iconName} = (props) => React.createElement('svg', { width: props.size || 24, height: props.size || 24, viewBox: '0 0 24 24', fill: props.fill || 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: props.className, style: props.style, ...props }, React.createElement('g', { dangerouslySetInnerHTML: { __html: "${escapedPath}" } }));`;
  }

  processExports(code) {
    let processed = code;
    
    let exportDefaultMatch = processed.match(/export\s+default\s+(?:function\s+)?([A-Z][a-zA-Z0-9]*)/);
    let componentName = exportDefaultMatch ? exportDefaultMatch[1] : null;
    
    processed = processed.replace(/export\s+default\s+/g, '');
    processed = processed.replace(/export\s+/g, '');
    
    if (!componentName) {
      const lines = processed.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const trimmed = lines[i].trim();
        const match = trimmed.match(/^(?:function|const)\s+([A-Z][a-zA-Z0-9]*)/);
        if (match) {
          componentName = match[1];
          break;
        }
      }
    }
    
    if (componentName) {
      processed = processed.replace(new RegExp(`return\\s+${componentName};?`, 'g'), '');
      processed += `\nreturn ${componentName};`;
    }
    
    return processed.trim();
  }

  async compile(sourceCode) {
    if (!this.babelLoaded) {
      await this.initialize();
    }

    try {
      console.log('[React Compiler] Starting compilation...');
      const { cleanCode, mocks } = this.parseImports(sourceCode);
      const processedCode = this.processExports(cleanCode);
      
      const wrappedCode = `(function() { 
        const React = window.React;
        const { useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext, createContext } = React;
        ${mocks}
        ${processedCode}
      })()`;
      
      const transpiledCode = window.Babel.transform(wrappedCode, {
        presets: ['react', 'typescript'],
        filename: 'component.tsx'
      }).code;

      console.log('[React Compiler] Compilation successful!');

      return {
        success: true,
        transpiledCode,
        error: null
      };
    } catch (err) {
      console.error('[React Compiler] Compilation failed:', err);
      return {
        success: false,
        transpiledCode: null,
        error: err.message
      };
    }
  }

  async generateHTML(sourceCode, customCSS = '') {
    const compileResult = await this.compile(sourceCode);
    
    if (!compileResult.success) {
      return this._generateErrorHTML(compileResult.error);
    }

    const encoded = encodeURIComponent(compileResult.transpiledCode);
    
    console.log('[React Renderer] Custom CSS length:', customCSS.length);
    if (customCSS) {
      console.log('[React Renderer] CSS preview:', customCSS.substring(0, 200));
    }
    
    // Debug: Log if we're actually injecting CSS
    if (customCSS.length > 0) {
      console.log('✅ [React Renderer] CSS WILL BE INJECTED into <style> tag');
    } else {
      console.warn('⚠️ [React Renderer] NO CSS to inject!');
    }
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="${this.options.reactCDN}"></script>
  <script crossorigin src="${this.options.reactDOMCDN}"></script>
  <style>
    /* Default styles */
    body { margin: 0; padding: 0; }
    #root { min-height: 100vh; }
    
    /* Error overlay styles */
    .error-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.95);
      color: white;
      padding: 30px;
      font-family: monospace;
      font-size: 14px;
      overflow: auto;
      z-index: 9999;
    }
    .error-title {
      color: #ef4444;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .error-content {
      background: #1f2937;
      padding: 20px;
      border-left: 4px solid #ef4444;
      white-space: pre-wrap;
      max-height: 70vh;
      overflow: auto;
    }
  </style>
  <script src="${this.options.tailwindCDN}"></script>
  <style id="custom-styles">
    /* Custom CSS from imported files - MUST come after Tailwind to override its reset */
    ${customCSS}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    (function() {
      try {
        const React = window.React;
        
        if (!React) {
          throw new Error('React library not loaded');
        }
        
        const source = decodeURIComponent("${encoded}");
        const Component = eval(source);
        
        if (typeof Component !== 'function') {
          throw new Error('Code evaluation did not return a component function');
        }

        const root = window.ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(Component));
        
        // Debug: Log rendered DOM structure after a short delay
        setTimeout(() => {
          const rootEl = document.getElementById('root');
          console.log('🔍 [Preview Debug] Root element:', rootEl);
          console.log('🔍 [Preview Debug] Root innerHTML length:', rootEl.innerHTML.length);
          console.log('🔍 [Preview Debug] First child:', rootEl.firstElementChild);
          if (rootEl.firstElementChild) {
            console.log('🔍 [Preview Debug] First child classes:', rootEl.firstElementChild.className);
            console.log('🔍 [Preview Debug] First child computed style:', window.getComputedStyle(rootEl.firstElementChild).background);
          }
          
          // Check if CSS is loaded
          const styles = document.querySelectorAll('style');
          console.log('🎨 [Preview Debug] Number of <style> tags:', styles.length);
          styles.forEach((style, i) => {
            console.log(\`🎨 [Preview Debug] Style tag \${i} length:\`, style.textContent.length);
            console.log(\`🎨 [Preview Debug] Style tag \${i} preview:\`, style.textContent.substring(0, 200));
          });
        }, 100);
      } catch (e) {
        console.error('[Preview] Error:', e);
        const overlay = document.createElement('div');
        overlay.className = 'error-overlay';
        overlay.innerHTML = '<div class="error-title">Preview Error</div><div class="error-content">' + e.message + '\\n\\nStack:\\n' + (e.stack || 'No stack trace') + '</div>';
        document.body.appendChild(overlay);
      }
    })();
  </script>
</body>
</html>`;
  }

  // Generate persistent iframe HTML that listens for postMessage updates
  generatePersistentIframeHTML() {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="${this.options.reactCDN}"></script>
  <script crossorigin src="${this.options.reactDOMCDN}"></script>
  <script src="${this.options.tailwindCDN}"></script>
  <style>
    body { margin: 0; padding: 0; background: #f8fafc; }
    #root { min-height: 100vh; }
    .error-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.95);
      color: white;
      padding: 30px;
      font-family: monospace;
      font-size: 14px;
      overflow: auto;
      z-index: 9999;
    }
    .error-title {
      color: #ef4444;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .error-content {
      background: #1f2937;
      padding: 20px;
      border-left: 4px solid #ef4444;
      white-space: pre-wrap;
      max-height: 70vh;
      overflow: auto;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    (function() {
      const React = window.React;
      let root = null;
      
      // Initialize root
      function initRoot() {
        if (!root && React && window.ReactDOM) {
          root = window.ReactDOM.createRoot(document.getElementById('root'));
        }
      }
      
      // Render component from code
      function renderComponent(code) {
        try {
          initRoot();
          
          if (!root) {
            throw new Error('React root not initialized');
          }
          
          // Clear any existing error overlays
          const existingOverlay = document.querySelector('.error-overlay');
          if (existingOverlay) {
            existingOverlay.remove();
          }
          
          const Component = eval(code);
          
          if (typeof Component !== 'function') {
            throw new Error('Code evaluation did not return a component function');
          }

          root.render(React.createElement(Component));
        } catch (e) {
          console.error('[Preview] Render error:', e);
          showError(e.message, e.stack);
        }
      }
      
      // Show error overlay
      function showError(message, stack) {
        const overlay = document.createElement('div');
        overlay.className = 'error-overlay';
        overlay.innerHTML = '<div class="error-title">Preview Error</div><div class="error-content">' + message + '\\n\\nStack:\\n' + (stack || 'No stack trace') + '</div>';
        document.body.appendChild(overlay);
      }
      
      // Listen for postMessage updates
      window.addEventListener('message', function(event) {
        if (event.data.type === 'UPDATE_CODE') {
          renderComponent(event.data.code);
        } else if (event.data.type === 'COMPILATION_ERROR') {
          showError('Compilation Error', event.data.error);
        }
      });
      
      // Signal ready
      window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    })();
  </script>
</body>
</html>`;
  }

  _generateErrorHTML(errorMessage) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: monospace;
      background: #1f2937;
      color: white;
    }
    .error-title {
      color: #ef4444;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .error-content {
      background: #111827;
      padding: 20px;
      border-left: 4px solid #ef4444;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div class="error-title">Compilation Error</div>
  <div class="error-content">${errorMessage}</div>
</body>
</html>`;
  }
}

export default ReactComponentRenderer;
