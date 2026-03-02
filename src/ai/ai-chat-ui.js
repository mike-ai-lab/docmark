// AI Chat UI - Side panel chat interface
// Manages chat conversations with AI

import { enhanceSelect } from '../ui/custom-select.js';

class AIChatUI {
    constructor(aiManager) {
        this.aiManager = aiManager;
        this.panel = null;
        this.isVisible = false;
        this.messages = [];
        this.currentSessionId = null;
        this.contextText = null; // Store context
        
        this.init();
    }

    init() {
        this.createPanel();
        this.attachEventListeners();
        this.loadChatHistory();
    }

    createPanel() {
        // Find or create chat panel container
        let chatPanel = document.getElementById('ai-chat-panel');
        
        if (!chatPanel) {
            // Create new panel
            chatPanel = document.createElement('div');
            chatPanel.id = 'ai-chat-panel';
            chatPanel.className = 'column ai-chat-pane hidden';
            chatPanel.innerHTML = `
                <div class="ai-chat-header">
                    <div class="ai-chat-header-left">
                        <select id="ai-chat-provider-select" class="ai-chat-provider-select">
                            ${this.renderProviderOptions()}
                        </select>
                    </div>
                    <div class="ai-chat-controls">
                        <button class="ai-chat-control-btn" id="ai-chat-new-chat" title="New chat">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                        </button>
                        <button class="ai-chat-control-btn" id="ai-chat-collapse" title="Collapse chat panel">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="ai-chat-messages" id="ai-chat-messages">
                    <div class="ai-chat-welcome">
                        <p>Hi! I'm your AI writing assistant. I can help you improve your markdown content, fix grammar, generate new text, or answer questions.</p>
                        <p>What would you like to do?</p>
                    </div>
                </div>
                
                <div class="ai-chat-input-area">
                    <div id="ai-chat-context" class="ai-chat-context hidden"></div>
                    <div class="ai-chat-input-row">
                        <button class="ai-chat-context-btn" id="ai-chat-add-context" title="Add selected text as context">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </button>
                        <textarea class="ai-chat-input" id="ai-chat-input" placeholder="Type your message..." rows="2"></textarea>
                        <button class="ai-chat-send-btn" id="ai-chat-send" title="Send message">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="ai-chat-resizer" id="ai-chat-resizer"></div>
            `;
            
            // Insert before TOC panel or at end of container
            const container = document.getElementById('container');
            const tocPanel = document.getElementById('toc-panel');
            if (tocPanel) {
                container.insertBefore(chatPanel, tocPanel);
            } else {
                container.appendChild(chatPanel);
            }
        }
        
        this.panel = chatPanel;
        
        // Enhance provider select with custom dropdown
        const providerSelect = this.panel.querySelector('#ai-chat-provider-select');
        if (providerSelect) {
            enhanceSelect(providerSelect);
        }
    }

    renderProviderOptions() {
        const providers = this.aiManager.getAvailableProviders();
        const currentProvider = this.aiManager.getCurrentProviderName();
        
        return providers.map(provider => {
            const selected = provider.id === currentProvider ? 'selected' : '';
            return `<option value="${provider.id}" ${selected}>${provider.name}</option>`;
        }).join('');
    }

    attachEventListeners() {
        if (!this.panel) return;
        const closeBtn = this.panel.querySelector('#ai-chat-collapse');
        closeBtn?.addEventListener('click', () => this.hide());

        // New chat button (behaves like clear + new session)
        const newChatBtn = this.panel.querySelector('#ai-chat-new-chat');
        newChatBtn?.addEventListener('click', () => this.clearChat());

        // Provider selector
        const providerSelect = this.panel.querySelector('#ai-chat-provider-select');
        providerSelect?.addEventListener('change', (e) => {
            try {
                this.aiManager.setProvider(e.target.value);
            } catch (error) {
                this.addMessage('system', `Error: ${error.message}`);
            }
        });

        // Send button
        const sendBtn = this.panel.querySelector('#ai-chat-send');
        sendBtn?.addEventListener('click', () => this.sendMessage());

        // Add context button
        const addContextBtn = this.panel.querySelector('#ai-chat-add-context');
        addContextBtn?.addEventListener('click', () => this.addContext());

        // Input enter key
        const input = this.panel.querySelector('#ai-chat-input');
        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Listen for open chat event from AI panel
        document.addEventListener('ai-open-chat', () => this.show());
        
        // Expose globally for context button
        window.aiChatUI = this;

        // Setup independent resize behavior for the chat panel
        this.setupResizeHandle();
    }

    setupResizeHandle() {
        if (!this.panel) return;

        const resizer = this.panel.querySelector('#ai-chat-resizer');
        if (!resizer) return;

        let isDragging = false;
        let startX = 0;
        let startWidth = 0;

        const MIN_WIDTH = 280;
        const MAX_WIDTH = 800;

        const onPointerMove = (event) => {
            if (!isDragging) return;

            const dx = event.clientX - startX;
            // Dragging to the left should INCREASE chat width
            let newWidth = startWidth - dx;
            newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));

            this.panel.style.width = `${newWidth}px`;
        };

        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false;

            resizer.classList.remove('dragging');

            document.body.classList.remove('dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', stopDragging);
            window.removeEventListener('pointercancel', stopDragging);
        };

        resizer.addEventListener('pointerdown', (event) => {
            if (!this.panel) return;

            event.preventDefault();
            event.stopPropagation();

            isDragging = true;
            startX = event.clientX;
            startWidth = this.panel.getBoundingClientRect().width;

            resizer.classList.add('dragging');

            // Improve UX during drag
            document.body.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            try {
                resizer.setPointerCapture(event.pointerId);
            } catch {
                // Pointer capture not critical; safe to ignore errors
            }

            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', stopDragging);
            window.addEventListener('pointercancel', stopDragging);
        });
    }

    async sendMessage() {
        const input = this.panel.querySelector('#ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Check if provider has API key
        const currentProvider = this.aiManager.getCurrentProviderName();
        if (!this.aiManager.hasApiKey(currentProvider)) {
            this.addMessage('system', 'Please add API key in settings');
            return;
        }

        // Build full message with context if present
        let fullMessage = message;
        if (this.contextText) {
            // Make it clear this is a task to perform on the context
            fullMessage = `Task: ${message}

Apply this task to the following text:

\`\`\`
${this.contextText}
\`\`\`

IMPORTANT: Return ONLY the result text. Do NOT wrap in code blocks. No explanations.`;
        }

        // Add user message (show with context indicator if present)
        if (this.contextText) {
            this.addMessageWithContext('user', message, this.contextText);
        } else {
            this.addMessage('user', message);
        }
        
        input.value = '';
        this.clearContext(); // Clear context after sending
        
        // Show loading
        const loadingId = this.addMessage('assistant', '', true);

        try {
            const settings = this.aiManager.getStorage().getSettings();
            
            if (settings.streaming) {
                // Streaming mode
                let fullResponse = '';
                await this.aiManager.chat(fullMessage, this.messages, {
                    onStream: (chunk, full) => {
                        fullResponse = full;
                        this.updateMessage(loadingId, full);
                    }
                });
                
                // Add to messages array
                this.messages.push({ role: 'assistant', content: fullResponse });
            } else {
                // Non-streaming mode
                const response = await this.aiManager.chat(fullMessage, this.messages);
                this.updateMessage(loadingId, response);
                this.messages.push({ role: 'assistant', content: response });
            }

            // Save to history
            this.saveChatSession();
        } catch (error) {
            this.updateMessage(loadingId, `Error: ${error.message}`, true);
        }
    }

    addContext() {
        const selectedText = this.aiManager.getSelectedText();
        
        if (!selectedText) {
            alert('Please select text in the editor first');
            return;
        }

        this.contextText = selectedText;
        this.showContextPreview();
    }

    showContextPreview() {
        const contextDiv = this.panel.querySelector('#ai-chat-context');
        if (!this.contextText) {
            contextDiv.classList.add('hidden');
            return;
        }

        const lineCount = this.contextText.split('\n').length;
        const preview = this.contextText.length > 100 
            ? this.contextText.substring(0, 100) + '...' 
            : this.contextText;

        contextDiv.innerHTML = `
            <div class="context-preview">
                <div class="context-header">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                        <polyline points="13 2 13 9 20 9"/>
                    </svg>
                    <span>Context added (${lineCount} ${lineCount === 1 ? 'line' : 'lines'})</span>
                    <button class="context-remove" onclick="window.aiChatUI.clearContext()">×</button>
                </div>
                <div class="context-text">${this.escapeHtml(preview)}</div>
            </div>
        `;
        contextDiv.classList.remove('hidden');
    }

    clearContext() {
        this.contextText = null;
        const contextDiv = this.panel.querySelector('#ai-chat-context');
        contextDiv.classList.add('hidden');
        contextDiv.innerHTML = '';
    }

    addMessageWithContext(role, message, context) {
        const messagesDiv = this.panel.querySelector('#ai-chat-messages');
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Remove welcome message if exists
        const welcome = messagesDiv.querySelector('.ai-chat-welcome');
        if (welcome) welcome.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.id = messageId;
        
        const lineCount = context.split('\n').length;
        
        messageDiv.innerHTML = `
            <span class="message-label">You</span>
            <div class="message-bubble user-message">
                <details class="message-context">
                    <summary>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                        </svg>
                        Context (${lineCount} ${lineCount === 1 ? 'line' : 'lines'})
                    </summary>
                    <pre class="context-content">${this.escapeHtml(context)}</pre>
                </details>
                <div class="message-text">${this.escapeHtml(message)}</div>
            </div>
        `;
        
        messagesDiv.appendChild(messageDiv);
        this.messages.push({ role: 'user', content: message });
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        return messageId;
    }

    addMessage(role, content, isLoading = false) {
        const messagesDiv = this.panel.querySelector('#ai-chat-messages');
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Remove welcome message if exists
        const welcome = messagesDiv.querySelector('.ai-chat-welcome');
        if (welcome) welcome.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.id = messageId;
        
        if (role === 'user') {
            messageDiv.innerHTML = `
                <span class="message-label">You</span>
                <div class="message-bubble user-message">${this.escapeHtml(content)}</div>
            `;
            this.messages.push({ role: 'user', content });
        } else if (role === 'assistant') {
            const renderedContent = isLoading ? '<div class="ai-spinner"></div>' : this.renderMarkdown(content);
            messageDiv.innerHTML = `
                <span class="message-label">AI Assistant</span>
                <div class="message-bubble assistant-message">
                    ${renderedContent}
                </div>
                ${!isLoading && content ? `
                <div class="message-actions">
                    <button class="message-action-btn" data-action="replace" data-content="${this.escapeAttribute(content)}" title="Replace selected text">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                        Replace
                    </button>
                    <button class="message-action-btn" data-action="insert" data-content="${this.escapeAttribute(content)}" title="Insert at cursor">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Insert
                    </button>
                    <button class="message-action-btn" data-action="copy" data-content="${this.escapeAttribute(content)}" title="Copy to clipboard">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    </button>
                </div>
                ` : ''}
            `;
        } else if (role === 'system') {
            messageDiv.innerHTML = `
                <div class="message-bubble system-message">${this.escapeHtml(content)}</div>
            `;
        }
        
        messagesDiv.appendChild(messageDiv);
        
        // Attach action button listeners
        if (role === 'assistant' && !isLoading && content) {
            this.attachMessageActions(messageDiv);
        }
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        return messageId;
    }

    updateMessage(messageId, content, isError = false) {
        const messageDiv = document.getElementById(messageId);
        if (!messageDiv) return;
        
        const bubble = messageDiv.querySelector('.message-bubble');
        if (bubble) {
            if (isError) {
                bubble.className = 'message-bubble error-message';
                bubble.textContent = content;
            } else {
                bubble.className = 'message-bubble assistant-message';
                bubble.innerHTML = this.renderMarkdown(content);
            }
        }
        
        // Add action buttons if not error
        if (!isError && content) {
            const existingActions = messageDiv.querySelector('.message-actions');
            if (!existingActions) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'message-actions';
                actionsDiv.innerHTML = `
                    <button class="message-action-btn" data-action="insert" data-content="${this.escapeAttribute(content)}" title="Insert to Editor">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Insert
                    </button>
                    <button class="message-action-btn" data-action="copy" data-content="${this.escapeAttribute(content)}" title="Copy to Clipboard">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    </button>
                `;
                messageDiv.appendChild(actionsDiv);
                this.attachMessageActions(messageDiv);
            }
        }
        
        const messagesDiv = this.panel.querySelector('#ai-chat-messages');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    attachMessageActions(messageDiv) {
        const replaceBtn = messageDiv.querySelector('[data-action="replace"]');
        const insertBtn = messageDiv.querySelector('[data-action="insert"]');
        const copyBtn = messageDiv.querySelector('[data-action="copy"]');
        
        if (replaceBtn) {
            replaceBtn.addEventListener('click', (e) => {
                const content = e.currentTarget.dataset.content;
                this.replaceInEditor(content);
                
                // Visual feedback
                const originalText = replaceBtn.innerHTML;
                replaceBtn.innerHTML = '<span style="color: #10b981;">✓ Replaced</span>';
                setTimeout(() => {
                    replaceBtn.innerHTML = originalText;
                }, 2000);
            });
        }
        
        if (insertBtn) {
            insertBtn.addEventListener('click', (e) => {
                const content = e.currentTarget.dataset.content;
                this.insertToEditor(content);
                
                // Visual feedback
                const originalText = insertBtn.innerHTML;
                insertBtn.innerHTML = '<span style="color: #10b981;">✓ Inserted</span>';
                setTimeout(() => {
                    insertBtn.innerHTML = originalText;
                }, 2000);
            });
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                const content = e.currentTarget.dataset.content;
                navigator.clipboard.writeText(content).then(() => {
                    // Visual feedback
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<span style="color: #10b981;">✓ Copied</span>';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                });
            });
        }
    }

    replaceInEditor(content) {
        const editor = this.aiManager.editor;
        if (!editor) return;
        
        const selection = editor.getSelection();
        if (!selection || selection.isEmpty()) {
            // No selection, just insert at cursor
            this.insertToEditor(content);
            return;
        }
        
        // Strip markdown code blocks if present
        let cleanContent = content.trim();
        cleanContent = cleanContent.replace(/^```[\w]*\n?/, '');
        cleanContent = cleanContent.replace(/\n?```$/, '');
        
        // Replace selected text
        editor.executeEdits('ai-chat-replace', [{
            range: selection,
            text: cleanContent
        }]);
        
        editor.focus();
    }

    insertToEditor(content) {
        const editor = this.aiManager.editor;
        if (!editor) return;
        
        const position = editor.getPosition();
        if (!position) return;
        
        // Strip markdown code blocks if present
        let cleanContent = content.trim();
        
        // Remove opening code block (```markdown, ```javascript, etc.)
        cleanContent = cleanContent.replace(/^```[\w]*\n?/, '');
        
        // Remove closing code block
        cleanContent = cleanContent.replace(/\n?```$/, '');
        
        // Insert at cursor position using editor's executeEdits
        editor.executeEdits('ai-chat-insert', [{
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            },
            text: cleanContent
        }]);
        
        // Move cursor to end of inserted text
        const lines = cleanContent.split('\n');
        const lastLine = lines[lines.length - 1];
        const newPosition = {
            lineNumber: position.lineNumber + lines.length - 1,
            column: lines.length === 1 ? position.column + cleanContent.length : lastLine.length + 1
        };
        editor.setPosition(newPosition);
        editor.focus();
    }

    renderMarkdown(text) {
        if (!text) return '';
        
        // Use marked library (already loaded in main app)
        if (typeof marked !== 'undefined') {
            try {
                return marked.parse(text);
            } catch (error) {
                console.error('Markdown rendering error:', error);
                return this.escapeHtml(text);
            }
        }
        
        // Fallback: simple markdown rendering
        return this.simpleMarkdownRender(text);
    }

    simpleMarkdownRender(text) {
        // Basic markdown rendering as fallback
        let html = this.escapeHtml(text);
        
        // Headers
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Code
        html = html.replace(/`(.+?)`/g, '<code>$1</code>');
        
        // Lists
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        
        return html;
    }

    escapeAttribute(text) {
        return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    clearChat() {
        this.messages = [];
        this.currentSessionId = null;
        
        const messagesDiv = this.panel.querySelector('#ai-chat-messages');
        messagesDiv.innerHTML = `
            <div class="ai-chat-welcome">
                <p>Chat cleared. How can I help you?</p>
            </div>
        `;
    }

    saveChatSession() {
        const settings = this.aiManager.getStorage().getSettings();
        if (!settings.saveChatHistory) return;

        const storage = this.aiManager.getStorage();
        
        if (this.currentSessionId) {
            // Update existing session
            storage.updateChatSession(this.currentSessionId, {
                messages: this.messages,
                updatedAt: Date.now()
            });
        } else {
            // Create new session
            const session = {
                provider: this.aiManager.getCurrentProviderName(),
                messages: this.messages
            };
            storage.addChatSession(session);
            
            // Get the last session ID
            const history = storage.getChatHistory();
            if (history.length > 0) {
                this.currentSessionId = history[history.length - 1].id;
            }
        }
    }

    loadChatHistory() {
        // Load last session if exists
        const storage = this.aiManager.getStorage();
        const history = storage.getChatHistory();
        
        if (history.length > 0) {
            const lastSession = history[history.length - 1];
            this.currentSessionId = lastSession.id;
            this.messages = lastSession.messages || [];
            
            // Render messages
            const messagesDiv = this.panel.querySelector('#ai-chat-messages');
            messagesDiv.innerHTML = '';
            
            this.messages.forEach(msg => {
                this.addMessage(msg.role, msg.content);
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    show() {
        if (this.panel) {
            this.panel.classList.remove('hidden');
            this.isVisible = true;
            
            // Focus input
            const input = this.panel.querySelector('#ai-chat-input');
            setTimeout(() => input?.focus(), 100);
        }
    }

    hide() {
        if (this.panel) {
            this.panel.classList.add('hidden');
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

    destroy() {
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
        }
    }
}

export default AIChatUI;
