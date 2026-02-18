// AI Manager - Main orchestrator for AI assistant
// Manages providers, executes actions, handles errors

import AIStorage from './ai-storage.js';
import { createProvider } from './ai-providers.js';
import { getPrompt } from './ai-prompts.js';

class AIManager {
    constructor(editor) {
        this.editor = editor;
        this.storage = new AIStorage();
        this.currentProvider = null;
        this.abortController = null;
        
        // Initialize with default provider
        this.initializeProvider();
    }

    // Initialize provider from settings
    initializeProvider() {
        const settings = this.storage.getSettings();
        const providerName = settings.defaultProvider || 'openai';
        try {
            this.setProvider(providerName);
        } catch (error) {
            // No API key yet - this is fine, user will add it in settings
            console.log('AI Assistant ready - please add API key in settings');
        }
    }

    // Set active provider
    setProvider(providerName) {
        const apiKey = this.storage.getApiKey(providerName);
        if (!apiKey) {
            throw new Error(`No API key found for ${providerName}. Please add it in settings.`);
        }

        try {
            this.currentProvider = createProvider(providerName, apiKey);
            this.storage.updatePreferences({ lastUsedProvider: providerName });
            return true;
        } catch (error) {
            console.error('Error setting provider:', error);
            throw error;
        }
    }

    // Get current provider name
    getCurrentProviderName() {
        const preferences = this.storage.getPreferences();
        return preferences?.lastUsedProvider || 'openai';
    }

    // Test API key for a provider
    async testProvider(providerName, apiKey) {
        try {
            const provider = createProvider(providerName, apiKey);
            await provider.generate('Hello', { maxTokens: 10 });
            return { success: true, message: 'API key is valid' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Execute quick action
    async executeAction(action, text, options = {}) {
        if (!this.currentProvider) {
            throw new Error('No AI provider configured');
        }

        if (!text || text.trim().length === 0) {
            throw new Error('No text provided');
        }

        const prompt = getPrompt(action, text);
        const settings = this.storage.getSettings();

        try {
            if (settings.streaming && options.onStream) {
                return await this.streamResponse(prompt, options.onStream, options);
            } else {
                return await this.currentProvider.generate(prompt, options);
            }
        } catch (error) {
            console.error('Error executing action:', error);
            throw error;
        }
    }

    // Stream response
    async streamResponse(prompt, onChunk, options = {}) {
        if (!this.currentProvider) {
            throw new Error('No AI provider configured');
        }

        this.abortController = new AbortController();
        let fullResponse = '';

        try {
            await this.currentProvider.stream(
                prompt,
                (chunk) => {
                    if (this.abortController.signal.aborted) {
                        throw new Error('Request aborted');
                    }
                    fullResponse += chunk;
                    onChunk(chunk, fullResponse);
                },
                options
            );

            return fullResponse;
        } catch (error) {
            if (error.message === 'Request aborted') {
                return fullResponse; // Return partial response
            }
            throw error;
        } finally {
            this.abortController = null;
        }
    }

    // Cancel ongoing request
    cancelRequest() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    // Chat with AI (with markdown output instruction)
    async chat(message, conversationHistory = [], options = {}) {
        if (!this.currentProvider) {
            throw new Error('No AI provider configured');
        }

        if (!message || message.trim().length === 0) {
            throw new Error('No message provided');
        }

        // Build conversation context with markdown instruction
        let prompt = `You are a helpful AI writing assistant for a Markdown editor. Always format your responses in valid Markdown.

CRITICAL MARKDOWN RULES:
- Use dash (-) for unordered lists, NEVER asterisk (*) or plus (+)
- Add space after # in headings
- Use proper markdown formatting for code blocks, links, images, etc.
- If generating HTML, output it directly without wrapping in code blocks
- Structure your response clearly with headings, lists, and formatting

`;

        if (conversationHistory.length > 0) {
            const context = conversationHistory
                .slice(-10) // Keep last 10 messages for context
                .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
                .join('\n\n');
            prompt += `${context}\n\n`;
        }

        prompt += `User: ${message}\n\nAssistant:`;

        const settings = this.storage.getSettings();

        try {
            if (settings.streaming && options.onStream) {
                return await this.streamResponse(prompt, options.onStream, options);
            } else {
                return await this.currentProvider.generate(prompt, options);
            }
        } catch (error) {
            console.error('Error in chat:', error);
            throw error;
        }
    }

    // Improve selected text
    async improveText(text, options = {}) {
        return await this.executeAction('improve', text, options);
    }

    // Fix grammar
    async fixGrammar(text, options = {}) {
        return await this.executeAction('grammar', text, options);
    }

    // Expand text
    async expandText(text, options = {}) {
        return await this.executeAction('expand', text, options);
    }

    // Summarize text
    async summarizeText(text, options = {}) {
        return await this.executeAction('summarize', text, options);
    }

    // Generate content
    async generateContent(prompt, options = {}) {
        return await this.executeAction('generate', prompt, options);
    }

    // Get selected text from editor
    getSelectedText() {
        if (!this.editor) return '';
        
        const selection = this.editor.getSelection();
        if (!selection || selection.isEmpty()) {
            return '';
        }

        return this.editor.getModel().getValueInRange(selection);
    }

    // Replace selected text in editor
    replaceSelectedText(newText) {
        if (!this.editor) return false;

        const selection = this.editor.getSelection();
        if (!selection) return false;

        this.editor.executeEdits('ai-assistant', [{
            range: selection,
            text: newText
        }]);

        return true;
    }

    // Insert text at cursor
    insertTextAtCursor(text) {
        if (!this.editor) return false;

        const position = this.editor.getPosition();
        if (!position) return false;

        this.editor.executeEdits('ai-assistant', [{
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            },
            text: text
        }]);

        return true;
    }

    // Get storage instance
    getStorage() {
        return this.storage;
    }

    // Get available providers
    getAvailableProviders() {
        return [
            { id: 'openai', name: 'OpenAI (GPT-4)' },
            { id: 'claude', name: 'Anthropic Claude' },
            { id: 'cerebras', name: 'Cerebras' },
            { id: 'groq', name: 'Groq' },
            { id: 'mistral', name: 'Mistral AI' },
            { id: 'openrouter', name: 'OpenRouter' },
            { id: 'google', name: 'Google AI Studio' },
            { id: 'cohere', name: 'Cohere' },
            { id: 'huggingface', name: 'Hugging Face' }
        ];
    }

    // Check if provider has API key
    hasApiKey(providerName) {
        return !!this.storage.getApiKey(providerName);
    }

    // Get provider status
    getProviderStatus() {
        const providers = this.getAvailableProviders();
        return providers.map(provider => ({
            ...provider,
            hasApiKey: this.hasApiKey(provider.id),
            isActive: provider.id === this.getCurrentProviderName()
        }));
    }
}

export default AIManager;
