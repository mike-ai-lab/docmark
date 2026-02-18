// AI Panel UI - Floating panel with quick actions
// Manages the AI assistant panel interface

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

                <div class="ai-section-title">Quick Actions</div>
                <button class="ai-action-btn" data-action="improve">Improve Text</button>
                <button class="ai-action-btn" data-action="grammar">Fix Grammar</button>
                <button class="ai-action-btn" data-action="expand">Expand</button>
                <button class="ai-action-btn" data-action="summarize">Summarize</button>
                <button class="ai-action-btn" data-action="generate">Generate Content</button>

                <div class="ai-divider"></div>

                <button class="ai-chat-toggle" id="ai-chat-toggle">Open AI Chat</button>
            </div>
        `;

        // Append to preview pane
        const previewPane = document.querySelector('#preview');
        if (previewPane) {
            previewPane.appendChild(panel);
            this.panel = panel;
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
                
                // Replace selected text with result
                this.aiManager.replaceSelectedText(fullResponse);
                this.showSuccess('Text updated successfully');
            } else {
                // Non-streaming mode
                const result = await this.aiManager.executeAction(action, selectedText);
                this.aiManager.replaceSelectedText(result);
                this.showSuccess('Text updated successfully');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
            this.currentAction = null;
            this.hideStatusToast();
        }
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