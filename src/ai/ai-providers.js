// AI Providers - Unified interface for all AI providers
// Supports: OpenAI, Claude, Cerebras, Groq, Mistral, OpenRouter, Google, Cohere, Hugging Face

// Base provider class
class AIProvider {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async generate(prompt, options = {}) {
        throw new Error('generate() must be implemented by provider');
    }

    async stream(prompt, onChunk, options = {}) {
        throw new Error('stream() must be implemented by provider');
    }

    validateApiKey() {
        return !!this.apiKey;
    }
}

// OpenAI Provider
class OpenAIProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.endpoint = 'https://api.openai.com/v1/chat/completions';
        this.defaultModel = 'gpt-4o-mini';
    }

    async generate(prompt, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async stream(prompt, onChunk, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000,
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) {
                            onChunk(content);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    }
}

// Anthropic Claude Provider
class ClaudeProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.endpoint = 'https://api.anthropic.com/v1/messages';
        this.defaultModel = 'claude-3-5-sonnet-20241022';
    }

    async generate(prompt, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: options.maxTokens || 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Claude API error');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async stream(prompt, onChunk, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: options.maxTokens || 2000,
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Claude API error');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.type === 'content_block_delta') {
                            const content = parsed.delta?.text;
                            if (content) {
                                onChunk(content);
                            }
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    }
}

// Cerebras Provider
class CerebrasProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.endpoint = 'https://api.cerebras.ai/v1/chat/completions';
        this.defaultModel = 'llama3.1-8b';
    }

    async generate(prompt, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Cerebras API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async stream(prompt, onChunk, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000,
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Cerebras API error');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) {
                            onChunk(content);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    }
}

// Groq Provider
class GroqProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        this.defaultModel = 'llama-3.1-70b-versatile';
    }

    async generate(prompt, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Groq API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async stream(prompt, onChunk, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000,
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Groq API error');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) {
                            onChunk(content);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    }
}

// Mistral Provider
class MistralProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.endpoint = 'https://api.mistral.ai/v1/chat/completions';
        this.defaultModel = 'mistral-large-latest';
    }

    async generate(prompt, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Mistral API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async stream(prompt, onChunk, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000,
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Mistral API error');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) {
                            onChunk(content);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    }
}

// OpenRouter Provider
class OpenRouterProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.endpoint = 'https://openrouter.ai/api/v1/chat/completions';
        this.defaultModel = 'openai/gpt-4o-mini';
    }

    async generate(prompt, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenRouter API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async stream(prompt, onChunk, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: options.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenRouter API error');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) {
                            onChunk(content);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    }
}

// Google AI Provider
class GoogleProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.defaultModel = 'gemini-pro';
    }

    async generate(prompt, options = {}) {
        const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Google AI API error');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async stream(prompt, onChunk, options = {}) {
        // Google AI doesn't support streaming in the same way, fallback to generate
        const result = await this.generate(prompt, options);
        onChunk(result);
    }
}

// Cohere Provider
class CohereProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.endpoint = 'https://api.cohere.ai/v1/chat';
        this.defaultModel = 'command';
    }

    async generate(prompt, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: prompt,
                model: options.model || this.defaultModel
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Cohere API error');
        }

        const data = await response.json();
        return data.text;
    }

    async stream(prompt, onChunk, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: prompt,
                model: options.model || this.defaultModel,
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Cohere API error');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.event_type === 'text-generation') {
                        onChunk(parsed.text);
                    }
                } catch (e) {
                    // Skip invalid JSON
                }
            }
        }
    }
}

// Hugging Face Provider
class HuggingFaceProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.endpoint = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf';
        this.defaultModel = 'meta-llama/Llama-2-70b-chat-hf';
    }

    async generate(prompt, options = {}) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: options.maxTokens || 2000,
                    temperature: options.temperature || 0.7
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Hugging Face API error');
        }

        const data = await response.json();
        return data[0].generated_text;
    }

    async stream(prompt, onChunk, options = {}) {
        // Hugging Face doesn't support streaming, fallback to generate
        const result = await this.generate(prompt, options);
        onChunk(result);
    }
}

// Provider factory
export function createProvider(providerName, apiKey) {
    const providers = {
        'openai': OpenAIProvider,
        'claude': ClaudeProvider,
        'cerebras': CerebrasProvider,
        'groq': GroqProvider,
        'mistral': MistralProvider,
        'openrouter': OpenRouterProvider,
        'google': GoogleProvider,
        'cohere': CohereProvider,
        'huggingface': HuggingFaceProvider
    };

    const ProviderClass = providers[providerName];
    if (!ProviderClass) {
        throw new Error(`Unknown provider: ${providerName}`);
    }

    return new ProviderClass(apiKey);
}

export {
    AIProvider,
    OpenAIProvider,
    ClaudeProvider,
    CerebrasProvider,
    GroqProvider,
    MistralProvider,
    OpenRouterProvider,
    GoogleProvider,
    CohereProvider,
    HuggingFaceProvider
};
