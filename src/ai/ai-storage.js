// AI Storage Manager - LocalStorage utilities for AI assistant
// Handles API keys, chat history, and user preferences

const AI_STORAGE_KEYS = {
    SETTINGS: 'com.markdownlivepreview.ai_settings',
    CHAT_HISTORY: 'com.markdownlivepreview.ai_chat_history',
    PREFERENCES: 'com.markdownlivepreview.ai_preferences'
};

class AIStorage {
    constructor() {
        this.initializeDefaults();
    }

    // Initialize default settings if not present
    initializeDefaults() {
        if (!this.getSettings()) {
            this.saveSettings({
                defaultProvider: 'openai',
                apiKeys: {},
                streaming: true,
                autoSave: true,
                showTokenUsage: false,
                saveChatHistory: true
            });
        }

        if (!this.getPreferences()) {
            this.savePreferences({
                panelPosition: 'right',
                chatPanelWidth: 400,
                lastUsedProvider: 'openai',
                favoriteActions: [],
                autoOpenChat: false
            });
        }

        if (!this.getChatHistory()) {
            this.saveChatHistory([]);
        }
    }

    // Settings management
    getSettings() {
        try {
            const data = localStorage.getItem(AI_STORAGE_KEYS.SETTINGS);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading AI settings:', e);
            return null;
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(AI_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Error saving AI settings:', e);
            return false;
        }
    }

    updateSettings(updates) {
        const current = this.getSettings() || {};
        const updated = { ...current, ...updates };
        return this.saveSettings(updated);
    }

    // API Key management
    getApiKey(provider) {
        const settings = this.getSettings();
        return settings?.apiKeys?.[provider] || null;
    }

    saveApiKey(provider, key) {
        const settings = this.getSettings() || {};
        if (!settings.apiKeys) settings.apiKeys = {};
        settings.apiKeys[provider] = key;
        return this.saveSettings(settings);
    }

    removeApiKey(provider) {
        const settings = this.getSettings() || {};
        if (settings.apiKeys) {
            delete settings.apiKeys[provider];
        }
        return this.saveSettings(settings);
    }

    // Chat history management
    getChatHistory() {
        try {
            const data = localStorage.getItem(AI_STORAGE_KEYS.CHAT_HISTORY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading chat history:', e);
            return [];
        }
    }

    saveChatHistory(history) {
        try {
            localStorage.setItem(AI_STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
            return true;
        } catch (e) {
            console.error('Error saving chat history:', e);
            return false;
        }
    }

    addChatSession(session) {
        const history = this.getChatHistory();
        history.push({
            id: this.generateId(),
            timestamp: Date.now(),
            ...session
        });
        // Keep only last 50 sessions
        if (history.length > 50) {
            history.shift();
        }
        return this.saveChatHistory(history);
    }

    updateChatSession(sessionId, updates) {
        const history = this.getChatHistory();
        const index = history.findIndex(s => s.id === sessionId);
        if (index !== -1) {
            history[index] = { ...history[index], ...updates };
            return this.saveChatHistory(history);
        }
        return false;
    }

    deleteChatSession(sessionId) {
        const history = this.getChatHistory();
        const filtered = history.filter(s => s.id !== sessionId);
        return this.saveChatHistory(filtered);
    }

    clearChatHistory() {
        return this.saveChatHistory([]);
    }

    // Preferences management
    getPreferences() {
        try {
            const data = localStorage.getItem(AI_STORAGE_KEYS.PREFERENCES);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading preferences:', e);
            return null;
        }
    }

    savePreferences(preferences) {
        try {
            localStorage.setItem(AI_STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
            return true;
        } catch (e) {
            console.error('Error saving preferences:', e);
            return false;
        }
    }

    updatePreferences(updates) {
        const current = this.getPreferences() || {};
        const updated = { ...current, ...updates };
        return this.savePreferences(updated);
    }

    // Utility methods
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    exportData() {
        return {
            settings: this.getSettings(),
            chatHistory: this.getChatHistory(),
            preferences: this.getPreferences(),
            exportedAt: new Date().toISOString()
        };
    }

    importData(data) {
        try {
            if (data.settings) this.saveSettings(data.settings);
            if (data.chatHistory) this.saveChatHistory(data.chatHistory);
            if (data.preferences) this.savePreferences(data.preferences);
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    }

    clearAllData() {
        localStorage.removeItem(AI_STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(AI_STORAGE_KEYS.CHAT_HISTORY);
        localStorage.removeItem(AI_STORAGE_KEYS.PREFERENCES);
        this.initializeDefaults();
    }
}

export default AIStorage;
