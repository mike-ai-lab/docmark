// AI Panel UI - Floating panel with quick actions
// Manages the AI assistant panel interface

import { enhanceSelect, refreshEnhancedSelect } from '../ui/custom-select.js';

class AIPanelUI {
    constructor(aiManager) {
        this.aiManager = aiManager;
        this.panel = null;
        this.isVisible = false;
        this.currentAction = null;
        
        this.init();
    }

    init() {
        this.createPanel();
        this.attachEventListeners();
        this.loadProviderState();
    }

    createPanel() {
        // Create panel HTML
        const panel = document.createElement('div');
        panel.className = 'ai-panel';
        panel.id = 'ai-assistant-panel';
        panel.innerHTML = `
            <div class="ai-panel-header">
                <h3>AI Assistant</h3>
                <button class="ai-close-btn" id="ai-panel-close">×</button>
            </div>
            <div class="ai-panel-content">
                <div class="ai-provider-selector">
                    <label>AI Provider</label>
                    <select id="ai-provider-select">
                        ${this.renderProviderOptions()}
                    </select>
                </div>

                <div id="ai-panel-messages"></div>

                <div class="ai-section-title">Text Actions</div>
                <button class="ai-action-btn" data-action="improve">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Improve Text
                </button>
                <button class="ai-action-btn" data-action="grammar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Fix Grammar
                </button>
                <button class="ai-action-btn" data-action="paraphrase">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="23 4 23 10 17 10"/>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                    Paraphrase
                </button>
                <button class="ai-action-btn" data-action="simplify">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Simplify
                </button>
                <button class="ai-action-btn" data-action="formalize">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="9" y1="9" x2="15" y2="9"/>
                        <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                    Formalize
                </button>
                <button class="ai-action-btn" data-action="expand">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 3 21 3 21 9"/>
                        <polyline points="9 21 3 21 3 15"/>
                        <line x1="21" y1="3" x2="14" y2="10"/>
                        <line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                    Expand
                </button>
                <button class="ai-action-btn" data-action="summarize">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 11 12 14 22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    Summarize
                </button>
                
                <div class="ai-section-title" style="margin-top: 16px;">Markdown</div>
                <button class="ai-action-btn" data-action="fixMarkdown">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                    Fix Markdown
                </button>
                
                <div class="ai-section-title" style="margin-top: 16px;">Code Actions</div>
                <button class="ai-action-btn" data-action="fixCode">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Fix Code
                </button>
                <button class="ai-action-btn" data-action="improveCode">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    Improve Code
                </button>
                <button class="ai-action-btn" data-action="optimizeCode">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    Optimize Code
                </button>
                <button class="ai-action-btn" data-action="documentCode">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    Document Code
                </button>
                <button class="ai-action-btn" data-action="testCode">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Generate Tests
                </button>
                
                <div class="ai-section-title" style="margin-top: 16px;">Generate</div>
                <button class="ai-action-btn" data-action="generate">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                    Generate Content
                </button>

                <div class="ai-divider"></div>

                <button class="ai-chat-toggle" id="ai-chat-toggle">Open AI Chat</button>
            </div>
        `;

        // Append to preview pane
        const previewPane = document.querySelector('#preview');
        if (previewPane) {
            previewPane.appendChild(panel);
            this.panel = panel;

            // Enhance provider select with custom dropdown
            const providerSelect = this.panel.querySelector('#ai-provider-select');
            if (providerSelect) {
                enhanceSelect(providerSelect);
            }
        } else {
            console.error('Preview pane not found');
        }
    }

    renderProviderOptions() {
        const providers = this.aiManager.getAvailableProviders();
        const currentProvider = this.aiManager.getCurrentProviderName();
        
        return providers.map(provider => {
            const hasKey = this.aiManager.hasApiKey(provider.id);
            const selected = provider.id === currentProvider ? 'selected' : '';
            // Don't disable providers - let users select them to see the error message
            const label = hasKey ? provider.name : `${provider.name} (No API Key)`;
            
            return `<option value="${provider.id}" ${selected}>${label}</option>`;
        }).join('');
    }

    attachEventListeners() {
        if (!this.panel) return;

        // Close button
        const closeBtn = this.panel.querySelector('#ai-panel-close');
        closeBtn?.addEventListener('click', () => this.hide());

        // Provider selector
        const providerSelect = this.panel.querySelector('#ai-provider-select');
        providerSelect?.addEventListener('change', (e) => this.handleProviderChange(e.target.value));

        // Action buttons
        const actionButtons = this.panel.querySelectorAll('.ai-action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleAction(action);
            });
        });

        // Chat toggle
        const chatToggle = this.panel.querySelector('#ai-chat-toggle');
        chatToggle?.addEventListener('click', () => this.openChat());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    handleProviderChange(providerName) {
        // Clear any existing messages first
        this.clearMessages();
        
        try {
            this.aiManager.setProvider(providerName);
            this.showSuccess('Provider changed successfully');
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleAction(action) {
        // Get selected text
        const selectedText = this.aiManager.getSelectedText();
        
        if (!selectedText) {
            if (action === 'generate') {
                // For generate, prompt user for input
                this.promptForGenerate();
                return;
            } else {
                this.showError('Please select text first');
                return;
            }
        }

        // Check if provider has API key
        const currentProvider = this.aiManager.getCurrentProviderName();
        if (!this.aiManager.hasApiKey(currentProvider)) {
            this.showError('Please add API key in settings');
            return;
        }

        this.currentAction = action;
        this.setLoading(true);
        this.clearMessages();
        this.showStatusToast('Processing with AI...');

        try {
            const settings = this.aiManager.getStorage().getSettings();
            
            if (settings.streaming) {
                // Streaming mode
                let fullResponse = '';
                await this.aiManager.executeAction(action, selectedText, {
                    onStream: (chunk, full) => {
                        fullResponse = full;
                        this.showStreamingResponse(full);
                    }
                });
                
                // Show preview before applying
                this.showPreview(selectedText, fullResponse, action);
            } else {
                // Non-streaming mode
                const result = await this.aiManager.executeAction(action, selectedText);
                
                // Show preview before applying
                this.showPreview(selectedText, result, action);
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
            this.currentAction = null;
            this.hideStatusToast();
        }
    }

    showPreview(originalText, previewText, action) {
        // Get or create preview system
        if (!this.previewSystem) {
            const previewPane = document.querySelector('#output');
            import('./ai-preview-system.js').then(module => {
                const AIPreviewSystem = module.default;
                this.previewSystem = new AIPreviewSystem(this.aiManager.editor, previewPane);
                this.displayPreview(originalText, previewText, action);
            });
            return;
        }
        
        this.displayPreview(originalText, previewText, action);
    }

    displayPreview(originalText, previewText, action) {
        // Show preview with confirm/regenerate handlers
        this.previewSystem.show(
            originalText,
            previewText,
            (confirmedText) => {
                // Apply confirmed text
                this.aiManager.replaceSelectedText(confirmedText);
                this.showSuccess('Changes applied successfully');
            },
            async () => {
                // Regenerate - call action again
                this.setLoading(true);
                try {
                    const result = await this.aiManager.executeAction(action, originalText);
                    this.displayPreview(originalText, result, action);
                } catch (error) {
                    this.showError('Regeneration failed: ' + error.message);
                } finally {
                    this.setLoading(false);
                }
            }
        );
    }

    promptForGenerate() {
        // Create custom modal instead of browser prompt
        this.showGenerateModal();
    }

    showGenerateModal() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'ai-modal-overlay';
        overlay.innerHTML = `
            <div class="ai-modal">
                <div class="ai-modal-header">
                    <h3>Generate Content</h3>
                    <button class="ai-modal-close">×</button>
                </div>
                <div class="ai-modal-body">
                    <label>What would you like to generate?</label>
                    <textarea class="ai-modal-input" placeholder="e.g., Write a README for a React project..." rows="4"></textarea>
                </div>
                <div class="ai-modal-footer">
                    <button class="ai-modal-btn ai-modal-btn-cancel">Cancel</button>
                    <button class="ai-modal-btn ai-modal-btn-primary">Generate</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const input = overlay.querySelector('.ai-modal-input');
        const closeBtn = overlay.querySelector('.ai-modal-close');
        const cancelBtn = overlay.querySelector('.ai-modal-btn-cancel');
        const generateBtn = overlay.querySelector('.ai-modal-btn-primary');
        
        // Focus input
        setTimeout(() => input.focus(), 100);
        
        // Close handlers
        const close = () => overlay.remove();
        closeBtn.addEventListener('click', close);
        cancelBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
        
        // Generate handler
        generateBtn.addEventListener('click', () => {
            const prompt = input.value.trim();
            if (prompt) {
                this.generateContent(prompt);
                close();
            }
        });
        
        // Enter to submit
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                const prompt = input.value.trim();
                if (prompt) {
                    this.generateContent(prompt);
                    close();
                }
            }
        });
    }

    async generateContent(prompt) {
        const currentProvider = this.aiManager.getCurrentProviderName();
        if (!this.aiManager.hasApiKey(currentProvider)) {
            this.showError('Please add API key in settings');
            return;
        }

        this.currentAction = 'generate';
        this.setLoading(true);
        this.clearMessages();
        this.showStatusToast('Generating content...');

        try {
            const settings = this.aiManager.getStorage().getSettings();
            
            if (settings.streaming) {
                let fullResponse = '';
                await this.aiManager.generateContent(prompt, {
                    onStream: (chunk, full) => {
                        fullResponse = full;
                        this.showStreamingResponse(full);
                    }
                });
                
                this.aiManager.insertTextAtCursor(fullResponse);
                this.showSuccess('Content generated successfully');
            } else {
                const result = await this.aiManager.generateContent(prompt);
                this.aiManager.insertTextAtCursor(result);
                this.showSuccess('Content generated successfully');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
            this.currentAction = null;
            this.hideStatusToast();
        }
    }

    setLoading(loading) {
        const actionButtons = this.panel.querySelectorAll('.ai-action-btn');
        const providerSelect = this.panel.querySelector('#ai-provider-select');
        const chatToggle = this.panel.querySelector('#ai-chat-toggle');

        actionButtons.forEach(btn => btn.disabled = loading);
        if (providerSelect) providerSelect.disabled = loading;
        if (chatToggle) chatToggle.disabled = loading;

        if (loading) {
            this.showLoading();
        }
    }

    showLoading() {
        const messagesDiv = this.panel.querySelector('#ai-panel-messages');
        messagesDiv.innerHTML = `
            <div class="ai-loading">
                <div class="ai-spinner"></div>
                <span>Processing...</span>
            </div>
        `;
    }

    showStreamingResponse(text) {
        const messagesDiv = this.panel.querySelector('#ai-panel-messages');
        messagesDiv.innerHTML = `
            <div class="ai-loading">
                <div class="ai-spinner"></div>
                <span>Generating...</span>
            </div>
        `;
    }

    showError(message) {
        const messagesDiv = this.panel.querySelector('#ai-panel-messages');
        messagesDiv.innerHTML = `
            <div class="ai-error">${message}</div>
        `;
        
        // Auto-clear after 5 seconds
        setTimeout(() => this.clearMessages(), 5000);
    }

    showSuccess(message) {
        const messagesDiv = this.panel.querySelector('#ai-panel-messages');
        messagesDiv.innerHTML = `
            <div class="ai-success">${message}</div>
        `;
        
        // Auto-clear after 3 seconds
        setTimeout(() => this.clearMessages(), 3000);
    }

    clearMessages() {
        const messagesDiv = this.panel.querySelector('#ai-panel-messages');
        if (messagesDiv) {
            messagesDiv.innerHTML = '';
        }
    }

    openChat() {
        // Close AI panel first
        this.hide();
        
        // Dispatch event to open chat panel
        const event = new CustomEvent('ai-open-chat');
        document.dispatchEvent(event);
    }

    show() {
        if (this.panel) {
            this.panel.classList.add('visible');
            this.isVisible = true;
            this.loadProviderState();
        }
    }

    hide() {
        if (this.panel) {
            this.panel.classList.remove('visible');
            this.isVisible = false;
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    loadProviderState() {
        // Refresh provider dropdown
        const providerSelect = this.panel?.querySelector('#ai-provider-select');
        if (providerSelect) {
            providerSelect.innerHTML = this.renderProviderOptions();
            refreshEnhancedSelect(providerSelect);
        }
    }

    // Status toast methods (bottom center indicator)
    showStatusToast(message) {
        const toast = document.getElementById('ai-status-toast');
        if (toast) {
            const textSpan = toast.querySelector('.ai-status-text');
            if (textSpan) {
                textSpan.textContent = message;
            }
            toast.classList.add('visible');
        }
    }

    hideStatusToast() {
        const toast = document.getElementById('ai-status-toast');
        if (toast) {
            toast.classList.remove('visible');
        }
    }

    destroy() {
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
        }
    }
}

export default AIPanelUI;