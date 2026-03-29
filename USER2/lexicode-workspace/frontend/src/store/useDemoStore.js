import { create } from 'zustand';

// Demo store that works without Supabase - uses localStorage
export const useDemoStore = create((set, get) => ({
    projects: [],
    currentProject: null,
    files: [],
    activeFileId: null,
    isSaving: false,
    error: null,
    isDemo: true,
    availableModels: [],
    selectedModel: 'llama-3.3-70b',
    showPreview: false,
    conversationHistory: [],
    tokenUsage: { prompt: 0, completion: 0, total: 0 },
    aiPanelOpen: true,
    fileTreeOpen: true,
    chatSessions: [],
    activeChatSession: null,
    user: null,
    useFirebase: false, // Toggle between localStorage and Firebase

    setUser: (user) => {
        set({ user });
        if (user) {
            // Load user's data when logged in
            get().fetchProjects();
        }
    },

    setUseFirebase: (useFirebase) => {
        set({ useFirebase });
    },

    toggleAiPanel: () => {
        set((state) => ({ aiPanelOpen: !state.aiPanelOpen }));
    },

    toggleFileTree: () => {
        set((state) => ({ fileTreeOpen: !state.fileTreeOpen }));
    },

    addToConversation: (role, content) => {
        set((state) => ({
            conversationHistory: [...state.conversationHistory, { role, content, timestamp: Date.now() }]
        }));
    },

    clearConversation: () => {
        set({ conversationHistory: [] });
    },

    createNewChatSession: () => {
        const newSession = {
            id: `session-${Date.now()}`,
            name: `Chat ${new Date().toLocaleTimeString()}`,
            history: [],
            createdAt: Date.now()
        };
        
        set((state) => ({
            chatSessions: [...state.chatSessions, newSession],
            activeChatSession: newSession.id,
            conversationHistory: []
        }));
        
        get().saveChatSessions();
    },

    loadChatSession: (sessionId) => {
        const { chatSessions } = get();
        const session = chatSessions.find(s => s.id === sessionId);
        
        if (session) {
            set({
                activeChatSession: sessionId,
                conversationHistory: session.history
            });
        }
    },

    saveChatSessions: () => {
        const { chatSessions, activeChatSession, conversationHistory } = get();
        
        // Update current session history
        const updatedSessions = chatSessions.map(session => 
            session.id === activeChatSession 
                ? { ...session, history: conversationHistory }
                : session
        );
        
        localStorage.setItem('lexicode-chat-sessions', JSON.stringify(updatedSessions));
        set({ chatSessions: updatedSessions });
    },

    loadChatSessions: () => {
        const stored = localStorage.getItem('lexicode-chat-sessions');
        if (stored) {
            const sessions = JSON.parse(stored);
            set({ chatSessions: sessions });
            
            if (sessions.length > 0) {
                const lastSession = sessions[sessions.length - 1];
                set({
                    activeChatSession: lastSession.id,
                    conversationHistory: lastSession.history
                });
            }
        }
    },

    deleteChatSession: (sessionId) => {
        const { chatSessions, activeChatSession } = get();
        const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
        
        set({ chatSessions: updatedSessions });
        
        if (activeChatSession === sessionId) {
            if (updatedSessions.length > 0) {
                get().loadChatSession(updatedSessions[updatedSessions.length - 1].id);
            } else {
                set({ activeChatSession: null, conversationHistory: [] });
            }
        }
        
        localStorage.setItem('lexicode-chat-sessions', JSON.stringify(updatedSessions));
    },

    chatWithAI: async (userMessage) => {
        const { files, activeFileId, selectedModel, conversationHistory } = get();
        const activeFile = files.find(f => f.id === activeFileId);
        
        console.log('🤖 [AI REQUEST] Starting AI chat request');
        console.log('📝 User Message:', userMessage);
        console.log('📂 Active File:', activeFile?.name || 'None');
        console.log('🎯 Model:', selectedModel);
        
        // Add user message to history
        get().addToConversation('user', userMessage);
        
        try {
            // Clean conversation history - remove timestamps for API
            const cleanHistory = conversationHistory.map(({ role, content }) => ({ role, content }));
            
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationHistory: [...cleanHistory, { role: 'user', content: userMessage }],
                    currentFile: activeFile ? {
                        name: activeFile.name,
                        type: activeFile.type,
                        content: activeFile.content || ''
                    } : null,
                    modelId: selectedModel
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ [AI ERROR] Server returned error:', errorData);
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            console.log('✅ [AI RESPONSE] Received response from AI');
            console.log('🎬 Action:', data.action);
            console.log('💬 Message:', data.message);
            console.log('📊 Token Usage:', data.usage);
            
            // Update token usage
            if (data.usage) {
                set((state) => ({
                    tokenUsage: {
                        prompt: state.tokenUsage.prompt + (data.usage.prompt_tokens || 0),
                        completion: state.tokenUsage.completion + (data.usage.completion_tokens || 0),
                        total: state.tokenUsage.total + (data.usage.total_tokens || 0)
                    }
                }));
            }
            
            // Add assistant response to history
            get().addToConversation('assistant', data.message);
            
            // Save chat session
            get().saveChatSessions();
            
            // Handle different actions
            if (data.action === 'edit' && data.updatedContent && activeFile) {
                console.log('✏️ [AI ACTION] Editing file:', activeFile.name);
                await get().updateFileContent(activeFileId, data.updatedContent);
                console.log('✅ [AI ACTION] File updated successfully');
            } else if (data.action === 'create' && data.createdFiles) {
                console.log('📁 [AI ACTION] Creating files...');
                console.log('📋 Files to create:', data.createdFiles);
                
                let currentProject = get().currentProject;
                
                // Auto-create default project if none exists
                if (!currentProject) {
                    console.log('⚠️ [AI ACTION] No project selected. Auto-creating default project...');
                    const defaultProject = {
                        id: `project-${Date.now()}`,
                        name: 'My Workspace',
                        created_at: new Date().toISOString()
                    };
                    
                    set((state) => ({
                        projects: [...state.projects, defaultProject],
                        currentProject: defaultProject.id
                    }));
                    
                    currentProject = defaultProject.id;
                    get().saveToLocalStorage();
                    console.log('✅ [AI ACTION] Default project created:', defaultProject.name);
                }
                
                console.log('📂 Current Project ID:', currentProject);
                
                const newFiles = data.createdFiles.map((fileData, index) => {
                    const newFile = {
                        id: `file-${Date.now()}-${Math.random()}`,
                        project_id: currentProject,
                        name: fileData.name,
                        path: fileData.path || fileData.name,
                        type: fileData.type,
                        content: fileData.content,
                        last_modified: new Date().toISOString()
                    };
                    console.log(`📄 [${index + 1}/${data.createdFiles.length}] Creating file:`, {
                        name: newFile.name,
                        type: newFile.type,
                        path: newFile.path,
                        contentLength: newFile.content?.length || 0
                    });
                    return newFile;
                });
                
                set((state) => ({
                    files: [...state.files, ...newFiles],
                    activeFileId: newFiles[0].id
                }));
                
                get().saveToLocalStorage();
                console.log('✅ [AI ACTION] All files created successfully!');
                console.log('📊 Total files in project:', get().files.filter(f => f.project_id === currentProject).length);
            } else {
                console.log('ℹ️ [AI ACTION] No file action required (action:', data.action, ')');
            }
            
            return data;
        } catch (error) {
            console.error('❌ [AI ERROR] Error chatting with AI:', error);
            set({ error: error.message });
            throw error;
        }
    },

    fetchAvailableModels: async () => {
        try {
            const response = await fetch('/api/ai/models');
            const data = await response.json();
            set({ availableModels: data.models });
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    },

    setSelectedModel: (modelId) => {
        set({ selectedModel: modelId });
        localStorage.setItem('lexicode-selected-model', modelId);
    },

    initDemo: () => {
        const stored = localStorage.getItem('lexicode-demo-data');
        const savedModel = localStorage.getItem('lexicode-selected-model');
        
        if (savedModel) {
            set({ selectedModel: savedModel });
        }
        
        // Load chat sessions
        get().loadChatSessions();
        
        if (stored) {
            const data = JSON.parse(stored);
            set({ projects: data.projects, files: data.files });
        } else {
            // Create default demo project
            const demoProject = {
                id: 'demo-project-1',
                name: 'Demo Project',
                created_at: new Date().toISOString()
            };
            
            const demoFiles = [
                {
                    id: 'demo-file-1',
                    project_id: 'demo-project-1',
                    name: 'index.html',
                    path: 'src/index.html',
                    type: 'html',
                    content: '<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n  <p>Welcome to LexiCode!</p>\n</body>\n</html>',
                    last_modified: new Date().toISOString()
                },
                {
                    id: 'demo-file-2',
                    project_id: 'demo-project-1',
                    name: 'README.md',
                    path: 'README.md',
                    type: 'md',
                    content: '# Demo Project\n\nThis is a demo project to showcase LexiCode Workspace.\n\n## Features\n\n- AI-powered editing\n- Monaco Editor\n- Export to DOCX',
                    last_modified: new Date().toISOString()
                }
            ];
            
            set({ projects: [demoProject], files: demoFiles });
            get().saveToLocalStorage();
        }
    },

    saveToLocalStorage: () => {
        const { projects, files } = get();
        localStorage.setItem('lexicode-demo-data', JSON.stringify({ projects, files }));
    },

    fetchProjects: async () => {
        get().initDemo();
    },

    openProject: async (projectId) => {
        const { files } = get();
        const projectFiles = files.filter(f => f.project_id === projectId);
        set({ 
            currentProject: projectId, 
            activeFileId: projectFiles.length > 0 ? projectFiles[0].id : null 
        });
    },

    updateFileContent: async (fileId, newContent) => {
        set({ isSaving: true });
        
        setTimeout(() => {
            set((state) => ({
                files: state.files.map(f => 
                    f.id === fileId ? { ...f, content: newContent, last_modified: new Date().toISOString() } : f
                ),
                isSaving: false
            }));
            get().saveToLocalStorage();
        }, 300);
    },

    resetTokenUsage: () => {
        set({ tokenUsage: { prompt: 0, completion: 0, total: 0 } });
    },

    setActiveFile: (fileId) => {
        set({ activeFileId: fileId });
    },

    createProject: (name) => {
        const newProject = {
            id: `project-${Date.now()}`,
            name,
            created_at: new Date().toISOString()
        };
        
        set((state) => ({
            projects: [...state.projects, newProject]
        }));
        
        get().saveToLocalStorage();
        get().openProject(newProject.id);
    },

    createFile: (projectId, name, type) => {
        const newFile = {
            id: `file-${Date.now()}`,
            project_id: projectId,
            name: `${name}.${type}`,
            path: `${name}.${type}`,
            type,
            content: getDefaultContent(type, name),
            last_modified: new Date().toISOString()
        };
        
        set((state) => ({
            files: [...state.files, newFile],
            activeFileId: newFile.id
        }));
        
        get().saveToLocalStorage();
    },

    togglePreview: () => {
        set((state) => ({ showPreview: !state.showPreview }));
    }
}));

function getDefaultContent(type, name) {
    const templates = {
        txt: '',
        md: `# ${name}\n\nStart writing your markdown here...`,
        docx: `# ${name}\n\nThis is a Word document. You can write formatted text here.\n\n## Features\n- Rich text formatting\n- Headers and paragraphs\n- Lists and tables\n\nExport this file as DOCX to get a proper Word document.`,
        xlsx: `Product,Quantity,Price,Total\nLaptop,2,999.99,1999.98\nMouse,5,29.99,149.95\nKeyboard,3,79.99,239.97\n\nNote: This is Excel data in CSV format. Export as Excel to get a proper spreadsheet.`,
        csv: `Name,Email,Phone,Company\nJohn Doe,john@example.com,555-0100,Acme Corp\nJane Smith,jane@example.com,555-0101,Tech Inc\nBob Johnson,bob@example.com,555-0102,Data LLC`,
        html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${name}</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>`,
        css: `/* ${name} Styles */\n\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n}`,
        js: `// ${name}\n\nfunction main() {\n    console.log('Hello World');\n}\n\nmain();`,
        json: `{\n    "name": "${name}",\n    "version": "1.0.0",\n    "description": "Sample JSON document"\n}`,
        svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">\n    <circle cx="100" cy="100" r="80" fill="#4F46E5" />\n    <text x="100" y="110" text-anchor="middle" fill="white" font-size="20" font-family="Arial">${name}</text>\n</svg>`,
        xml: `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n    <item>Hello World</item>\n</root>`,
        py: `# ${name}\n\ndef main():\n    print("Hello World")\n\nif __name__ == "__main__":\n    main()`,
        java: `public class ${name.replace(/[^a-zA-Z0-9]/g, '')} {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`,
        cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}`,
        yaml: `# ${name}\nname: ${name}\nversion: 1.0.0\ndescription: Sample YAML document`,
        sql: `-- ${name}\n\nCREATE TABLE users (\n    id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100)\n);\n\nSELECT * FROM users;`
    };
    
    return templates[type] || '';
}
