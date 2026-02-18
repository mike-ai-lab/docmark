// Code Paste Window - Minimizable window for pasting and rendering code
// Allows quick code testing without saving files

class CodePasteWindow {
    constructor() {
        this.window = null;
        this.headerButton = null;
        this.isMinimized = false;
        this.isHidden = false;
        this.code = '';
        this.init();
    }

    init() {
        this.createHeaderButton();
        this.createWindow();
        this.attachEventListeners();
    }

    createHeaderButton() {
        // Create button for header
        const button = document.createElement('button');
        button.id = 'code-paste-header-btn';
        button.className = 'icon-button code-paste-header-btn';
        button.title = 'Code Paste Window (Ctrl+Shift+P)';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
        `;
        
        // Insert into header-right
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            headerRight.insertBefore(button, headerRight.firstChild);
        }
        
        button.addEventListener('click', () => this.toggleFromHeader());
        this.headerButton = button;
    }

    createWindow() {
        // Create main window container
        const window = document.createElement('div');
        window.id = 'code-paste-window';
        window.className = 'code-paste-window';
        window.innerHTML = `
            <div class="code-paste-header">
                <h3>Quick Code Paste</h3>
                <div class="code-paste-controls">
                    <button class="code-paste-btn code-paste-minimize" title="Minimize">−</button>
                    <button class="code-paste-btn code-paste-close" title="Close">×</button>
                </div>
            </div>
            
            <div class="code-paste-content">
                <div class="code-paste-editor-wrapper">
                    <textarea 
                        id="code-paste-input" 
                        class="code-paste-input" 
                        placeholder="Paste your HTML, CSS, or JavaScript code here..."
                        spellcheck="false"
                    ></textarea>
                </div>
                
                <div class="code-paste-actions">
                    <button class="code-paste-action-btn code-paste-render">Render</button>
                    <button class="code-paste-action-btn code-paste-clear">Clear</button>
                </div>
            </div>
            
            <div class="code-paste-preview" id="code-paste-preview"></div>
        `;
        
        document.body.appendChild(window);
        this.window = window;
    }

    attachEventListeners() {
        const minimizeBtn = this.window.querySelector('.code-paste-minimize');
        const closeBtn = this.window.querySelector('.code-paste-close');
        const renderBtn = this.window.querySelector('.code-paste-render');
        const clearBtn = this.window.querySelector('.code-paste-clear');
        const input = this.window.querySelector('#code-paste-input');

        minimizeBtn?.addEventListener('click', () => this.minimize());
        closeBtn?.addEventListener('click', () => this.close());
        renderBtn?.addEventListener('click', () => this.render());
        clearBtn?.addEventListener('click', () => this.clear());

        // Auto-render on paste
        input?.addEventListener('paste', () => {
            setTimeout(() => this.render(), 100);
        });

        // Keyboard shortcut: Ctrl+Shift+P to toggle
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.toggleFromHeader();
            }
        });
    }

    render() {
        const input = this.window.querySelector('#code-paste-input');
        const preview = this.window.querySelector('#code-paste-preview');
        
        if (!input || !preview) return;

        this.code = input.value.trim();
        
        if (!this.code) {
            preview.innerHTML = '<div class="code-paste-empty">Paste code to render...</div>';
            return;
        }

        try {
            // Check if it's HTML
            if (this.code.includes('<') && this.code.includes('>')) {
                // Create iframe for HTML rendering
                preview.innerHTML = '';
                const iframe = document.createElement('iframe');
                iframe.className = 'code-paste-iframe';
                iframe.sandbox.add('allow-scripts');
                iframe.sandbox.add('allow-same-origin');
                
                preview.appendChild(iframe);
                
                // Write content to iframe
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(this.code);
                doc.close();
            } else {
                // For non-HTML, show as code
                preview.innerHTML = `<pre><code>${this.escapeHtml(this.code)}</code></pre>`;
            }
        } catch (error) {
            preview.innerHTML = `<div class="code-paste-error">Error: ${error.message}</div>`;
        }
    }

    clear() {
        const input = this.window.querySelector('#code-paste-input');
        const preview = this.window.querySelector('#code-paste-preview');
        
        if (input) input.value = '';
        if (preview) preview.innerHTML = '<div class="code-paste-empty">Paste code to render...</div>';
        
        this.code = '';
    }

    minimize() {
        this.window.classList.add('minimized');
        this.isMinimized = true;
        this.isHidden = false;
        this.updateHeaderButton();
    }

    expand() {
        this.window.classList.remove('minimized');
        this.isMinimized = false;
        this.isHidden = false;
        this.updateHeaderButton();
    }

    close() {
        this.window.classList.add('hidden');
        this.isHidden = true;
        this.isMinimized = false;
        this.updateHeaderButton();
    }

    show() {
        this.window.classList.remove('hidden');
        this.window.classList.remove('minimized');
        this.isHidden = false;
        this.isMinimized = false;
        this.updateHeaderButton();
    }

    toggleFromHeader() {
        if (this.isHidden) {
            this.show();
        } else if (this.isMinimized) {
            this.expand();
        } else {
            this.minimize();
        }
    }

    updateHeaderButton() {
        if (!this.headerButton) return;

        if (this.isHidden) {
            // Show button when window is hidden
            this.headerButton.style.display = 'flex';
            this.headerButton.classList.remove('minimized');
            this.headerButton.title = 'Open Code Paste Window';
        } else if (this.isMinimized) {
            // Show button with minimized indicator
            this.headerButton.style.display = 'flex';
            this.headerButton.classList.add('minimized');
            this.headerButton.title = 'Expand Code Paste Window (minimized)';
        } else {
            // Show button normally when window is visible and expanded
            this.headerButton.style.display = 'flex';
            this.headerButton.classList.remove('minimized');
            this.headerButton.title = 'Minimize Code Paste Window';
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.codePasteWindow = new CodePasteWindow();
});

export default CodePasteWindow;
