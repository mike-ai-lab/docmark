import { create } from 'zustand';

// Demo store that works without Supabase - uses localStorage
export const useDemoStore = create((set, get) => ({
    projects: [],
    currentProject: null,
    files: [],
    fileTree: [], // Hierarchical tree structure for explorer
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
    openTabs: [], // Array of open file IDs (just IDs, not objects)
    skipDeleteConfirmation: false,

    setSkipDeleteConfirmation: (skip) => {
        set({ skipDeleteConfirmation: skip });
        localStorage.setItem('lexicode-skip-delete-confirmation', skip.toString());
    },

    loadPreferences: () => {
        const skipDelete = localStorage.getItem('lexicode-skip-delete-confirmation');
        if (skipDelete) {
            set({ skipDeleteConfirmation: skipDelete === 'true' });
        }
    },

    moveFile: (fileId, newPath) => {
        set((state) => ({
            files: state.files.map(f => 
                f.id === fileId ? { ...f, path: newPath, name: newPath.split('/').pop() } : f
            )
        }));
        get().saveToLocalStorage();
    },

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
                
                const { fileTree } = get();
                
                // Process each file and organize by path
                const filesByPath = {};
                data.createdFiles.forEach((fileData, index) => {
                    const pathParts = fileData.path.split('/');
                    const fileName = pathParts.pop();
                    const folderPath = pathParts.join('/');
                    
                    if (!filesByPath[folderPath]) {
                        filesByPath[folderPath] = [];
                    }
                    
                    const newFile = {
                        id: `file-${Date.now()}-${index}-${Math.random()}`,
                        name: fileName,
                        type: 'file',
                        content: fileData.content || '',
                        last_modified: new Date().toISOString()
                    };
                    
                    console.log(`📄 [${index + 1}/${data.createdFiles.length}] Creating file:`, {
                        name: newFile.name,
                        path: fileData.path,
                        folderPath: folderPath || 'root',
                        contentLength: newFile.content?.length || 0
                    });
                    
                    filesByPath[folderPath].push(newFile);
                });
                
                // Build tree structure
                const updatedTree = [...fileTree];
                
                // Helper to find or create folder path in tree
                const findOrCreateFolder = (tree, pathParts, startIndex = 0) => {
                    if (startIndex >= pathParts.length) return tree;
                    
                    const folderName = pathParts[startIndex];
                    let folder = tree.find(node => node.name === folderName && node.type === 'folder');
                    
                    if (!folder) {
                        folder = {
                            id: `folder-${Date.now()}-${Math.random()}`,
                            name: folderName,
                            type: 'folder',
                            isOpen: true,
                            children: []
                        };
                        tree.push(folder);
                        console.log('📁 [AI ACTION] Created folder:', folderName);
                    }
                    
                    if (startIndex < pathParts.length - 1) {
                        findOrCreateFolder(folder.children, pathParts, startIndex + 1);
                    }
                    
                    return folder;
                };
                
                // Add files to appropriate folders
                Object.keys(filesByPath).forEach(folderPath => {
                    const files = filesByPath[folderPath];
                    
                    if (!folderPath) {
                        // Add to root
                        updatedTree.push(...files);
                    } else {
                        // Find or create folder structure
                        const pathParts = folderPath.split('/');
                        const targetFolder = findOrCreateFolder(updatedTree, pathParts);
                        targetFolder.children = [...(targetFolder.children || []), ...files];
                    }
                });
                
                // Get first created file ID
                const firstFileId = Object.values(filesByPath)[0]?.[0]?.id;
                
                set({
                    fileTree: updatedTree,
                    activeFileId: firstFileId,
                    openTabs: firstFileId ? [...get().openTabs, firstFileId] : get().openTabs
                });
                
                get().saveTreeToLocalStorage();
                console.log('✅ [AI ACTION] All files created successfully!');
                console.log('📊 Total nodes in tree:', updatedTree.length);
                console.log('🎯 Active file ID:', firstFileId);
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

    // TREE MANAGEMENT METHODS
    findNodeInTree: (tree, id) => {
        for (const node of tree) {
            if (node.id === id) return node;
            if (node.children) {
                const found = get().findNodeInTree(node.children, id);
                if (found) return found;
            }
        }
        return null;
    },

    toggleNode: (id) => {
        const updateTree = (tree) => tree.map(node => 
            node.id === id 
                ? { ...node, isOpen: !node.isOpen }
                : node.children 
                    ? { ...node, children: updateTree(node.children) }
                    : node
        );
        set({ fileTree: updateTree(get().fileTree) });
        get().saveTreeToLocalStorage();
    },

    createNode: (type, parentId) => {
        const newNode = {
            id: `node-${Date.now()}`,
            name: '',
            type: type,
            isOpen: true,
            isEditing: true,
            children: type === 'folder' ? [] : undefined,
            content: type === 'file' ? '' : undefined
        };

        if (!parentId) {
            // Add to root
            set({ fileTree: [...get().fileTree, newNode] });
        } else {
            // Add to parent folder
            const updateTree = (tree) => tree.map(node =>
                node.id === parentId
                    ? { ...node, isOpen: true, children: [...(node.children || []), newNode] }
                    : node.children
                        ? { ...node, children: updateTree(node.children) }
                        : node
            );
            set({ fileTree: updateTree(get().fileTree) });
        }
        get().saveTreeToLocalStorage();
    },

    deleteNode: (id) => {
        const { activeFileId, openTabs } = get();
        
        // Close tab if it's open
        if (activeFileId === id) {
            get().closeTab(id);
        }
        
        // Remove from tree
        const deleteFromTree = (tree) => tree
            .filter(node => node.id !== id)
            .map(node => node.children ? { ...node, children: deleteFromTree(node.children) } : node);
        
        set({ fileTree: deleteFromTree(get().fileTree) });
        get().saveTreeToLocalStorage();
    },

    renameNode: (id, newName, startEditing) => {
        const updateTree = (tree) => tree
            .filter(node => !(node.id === id && newName === null && !startEditing))
            .map(node =>
                node.id === id
                    ? { 
                        ...node, 
                        name: newName !== null ? (newName || node.name || 'unnamed') : node.name,
                        isEditing: startEditing 
                      }
                    : node.children
                        ? { ...node, children: updateTree(node.children) }
                        : node
            );
        
        set({ fileTree: updateTree(get().fileTree) });
        get().saveTreeToLocalStorage();
    },

    moveNode: (draggedId, targetId) => {
        let draggedNode = null;
        
        // Remove dragged node from tree
        const removeFromTree = (tree) => tree.filter(node => {
            if (node.id === draggedId) {
                draggedNode = node;
                return false;
            }
            if (node.children) {
                node.children = removeFromTree(node.children);
            }
            return true;
        });
        
        const tempTree = JSON.parse(JSON.stringify(get().fileTree));
        const cleanedTree = removeFromTree(tempTree);
        
        if (!draggedNode) return;
        
        // Add to target folder
        const addToTree = (tree) => tree.map(node =>
            (node.id === targetId && node.type === 'folder')
                ? { ...node, children: [...(node.children || []), draggedNode] }
                : node.children
                    ? { ...node, children: addToTree(node.children) }
                    : node
        );
        
        set({ fileTree: addToTree(cleanedTree) });
        get().saveTreeToLocalStorage();
    },

    saveTreeToLocalStorage: () => {
        const { fileTree } = get();
        localStorage.setItem('lexicode-file-tree', JSON.stringify(fileTree));
    },

    loadTreeFromLocalStorage: () => {
        const stored = localStorage.getItem('lexicode-file-tree');
        if (stored) {
            set({ fileTree: JSON.parse(stored) });
        }
    },

    initDemo: () => {
        const stored = localStorage.getItem('lexicode-demo-data');
        const savedModel = localStorage.getItem('lexicode-selected-model');
        
        if (savedModel) {
            set({ selectedModel: savedModel });
        }
        
        // Load preferences
        get().loadPreferences();
        
        // Load chat sessions
        get().loadChatSessions();
        
        // Load file tree
        get().loadTreeFromLocalStorage();
        
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
        
        // Initialize file tree if empty
        if (get().fileTree.length === 0) {
            const defaultTree = [
                {
                    id: 'demo-project-1',
                    name: 'Demo Project',
                    type: 'folder',
                    isOpen: true,
                    children: [
                        {
                            id: 'src-folder',
                            name: 'src',
                            type: 'folder',
                            isOpen: true,
                            children: [
                                {
                                    id: 'demo-file-1',
                                    name: 'index.html',
                                    type: 'file',
                                    content: '<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n  <p>Welcome to LexiCode!</p>\n</body>\n</html>'
                                }
                            ]
                        },
                        {
                            id: 'demo-file-2',
                            name: 'README.md',
                            type: 'file',
                            content: '# Demo Project\n\nThis is a demo project to showcase LexiCode Workspace.\n\n## Features\n\n- AI-powered editing\n- Monaco Editor\n- Export to DOCX'
                        }
                    ]
                }
            ];
            set({ fileTree: defaultTree });
            get().saveTreeToLocalStorage();
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
            // Update content in tree
            const updateTree = (tree) => tree.map(node =>
                node.id === fileId
                    ? { ...node, content: newContent, last_modified: new Date().toISOString() }
                    : node.children
                        ? { ...node, children: updateTree(node.children) }
                        : node
            );
            
            set({ 
                fileTree: updateTree(get().fileTree),
                isSaving: false 
            });
            get().saveTreeToLocalStorage();
        }, 300);
    },

    resetTokenUsage: () => {
        set({ tokenUsage: { prompt: 0, completion: 0, total: 0 } });
    },

    // CLEAN TAB MANAGEMENT - Based on working mockup
    setActiveFile: (fileId) => {
        const { fileTree, openTabs } = get();
        const node = get().findNodeInTree(fileTree, fileId);
        
        if (!node || node.type !== 'file') return;
        
        // Add to openTabs if not already there
        if (!openTabs.includes(fileId)) {
            set({ 
                openTabs: [...openTabs, fileId],
                activeFileId: fileId 
            });
        } else {
            // Just switch to existing tab
            set({ activeFileId: fileId });
        }
    },

    closeTab: (fileId) => {
        const { openTabs, activeFileId } = get();
        const newTabs = openTabs.filter(id => id !== fileId);
        
        let newActiveFileId = activeFileId;
        
        // If closing the active tab, switch to another
        if (activeFileId === fileId) {
            if (newTabs.length > 0) {
                const closedIndex = openTabs.indexOf(fileId);
                const nextIndex = closedIndex > 0 ? closedIndex - 1 : 0;
                newActiveFileId = newTabs[nextIndex] || null;
            } else {
                newActiveFileId = null;
            }
        }
        
        set({ openTabs: newTabs, activeFileId: newActiveFileId });
    },

    closeAllTabs: () => {
        set({ openTabs: [], activeFileId: null });
    },

    closeOtherTabs: (fileId) => {
        set({ openTabs: [fileId], activeFileId: fileId });
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

    deleteProject: (projectId) => {
        const { files } = get();
        const projectFiles = files.filter(f => f.project_id === projectId);
        
        // Close tabs for files in this project
        projectFiles.forEach(file => get().closeTab(file.id));
        
        set((state) => ({
            projects: state.projects.filter(p => p.id !== projectId),
            files: state.files.filter(f => f.project_id !== projectId),
            currentProject: state.currentProject === projectId ? null : state.currentProject
        }));
        
        get().saveToLocalStorage();
    },

    renameProject: (projectId, newName) => {
        set((state) => ({
            projects: state.projects.map(p => 
                p.id === projectId ? { ...p, name: newName } : p
            )
        }));
        
        get().saveToLocalStorage();
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
            activeFileId: newFile.id,
            openTabs: [...state.openTabs, newFile.id] // Add ID only
        }));
        
        get().saveToLocalStorage();
    },

    deleteFile: (fileId) => {
        // Close tab first
        get().closeTab(fileId);
        
        set((state) => ({
            files: state.files.filter(f => f.id !== fileId)
        }));
        
        get().saveToLocalStorage();
    },

    renameFile: (fileId, newName) => {
        set((state) => ({
            files: state.files.map(f => 
                f.id === fileId ? { ...f, name: newName, path: newName } : f
            )
        }));
        
        get().saveToLocalStorage();
    },

    duplicateFile: (fileId) => {
        const { files } = get();
        const file = files.find(f => f.id === fileId);
        
        if (file) {
            const nameParts = file.name.split('.');
            const ext = nameParts.pop();
            const baseName = nameParts.join('.');
            const newName = `${baseName}_copy.${ext}`;
            
            const newFile = {
                ...file,
                id: `file-${Date.now()}`,
                name: newName,
                path: newName,
                last_modified: new Date().toISOString()
            };
            
            set((state) => ({
                files: [...state.files, newFile],
                activeFileId: newFile.id,
                openTabs: [...state.openTabs, newFile.id] // Add ID only
            }));
            
            get().saveToLocalStorage();
        }
    },

    createFolder: (projectId, folderPath) => {
        // Create a placeholder file in the folder to ensure it exists
        const placeholderFile = {
            id: `file-${Date.now()}`,
            project_id: projectId,
            name: '.gitkeep',
            path: `${folderPath}/.gitkeep`,
            type: 'txt',
            content: '',
            last_modified: new Date().toISOString()
        };
        
        set((state) => ({
            files: [...state.files, placeholderFile]
        }));
        
        get().saveToLocalStorage();
    },

    togglePreview: () => {
        set((state) => ({ showPreview: !state.showPreview }));
    }
}));

function getDefaultContent(type, name) {
    const templates = {
        // Plain text
        txt: '',
        
        // Markdown
        md: `# ${name}\n\nStart writing your markdown here...`,
        mdx: `# ${name}\n\nimport { Component } from './Component'\n\n## Interactive Content\n\n<Component />\n\nYou can mix Markdown with JSX components.`,
        
        // JavaScript & TypeScript
        js: `// ${name}\n\nfunction main() {\n    console.log('Hello World');\n}\n\nmain();`,
        jsx: `import React from 'react';\n\nexport default function ${name.replace(/[^a-zA-Z0-9]/g, '')}() {\n    return (\n        <div className="container">\n            <h1>Hello World</h1>\n            <p>Welcome to your new React component!</p>\n        </div>\n    );\n}`,
        ts: `// ${name}\n\nfunction main(): void {\n    console.log('Hello World');\n}\n\nmain();`,
        tsx: `import React from 'react';\n\ninterface ${name.replace(/[^a-zA-Z0-9]/g, '')}Props {\n    title?: string;\n}\n\nexport default function ${name.replace(/[^a-zA-Z0-9]/g, '')}({ title = 'Hello World' }: ${name.replace(/[^a-zA-Z0-9]/g, '')}Props) {\n    return (\n        <div className="container">\n            <h1>{title}</h1>\n            <p>Welcome to your new React component!</p>\n        </div>\n    );\n}`,
        
        // Web styling
        html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${name}</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>`,
        css: `/* ${name} Styles */\n\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 20px;\n}`,
        scss: `// ${name}\n\n$primary-color: #4F46E5;\n$font-stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: $font-stack;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 20px;\n    \n    h1 {\n        color: $primary-color;\n    }\n}`,
        sass: `// ${name}\n\n$primary-color: #4F46E5\n$font-stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif\n\nbody\n    margin: 0\n    padding: 0\n    font-family: $font-stack\n\n.container\n    max-width: 1200px\n    margin: 0 auto\n    padding: 20px`,
        less: `// ${name}\n\n@primary-color: #4F46E5;\n@font-stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: @font-stack;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 20px;\n}`,
        
        // Frameworks
        vue: `<template>\n  <div class="container">\n    <h1>{{ title }}</h1>\n    <p>Welcome to your new Vue component!</p>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: '${name.replace(/[^a-zA-Z0-9]/g, '')}',\n  data() {\n    return {\n      title: 'Hello World'\n    }\n  }\n}\n</script>\n\n<style scoped>\n.container {\n  padding: 20px;\n}\n</style>`,
        svelte: `<script>\n  let title = 'Hello World';\n</script>\n\n<div class="container">\n  <h1>{title}</h1>\n  <p>Welcome to your new Svelte component!</p>\n</div>\n\n<style>\n  .container {\n    padding: 20px;\n  }\n</style>`,
        
        // Backend languages
        py: `# ${name}\n\ndef main():\n    print("Hello World")\n\nif __name__ == "__main__":\n    main()`,
        java: `public class ${name.replace(/[^a-zA-Z0-9]/g, '')} {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`,
        cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}`,
        c: `#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}`,
        cs: `using System;\n\nnamespace ${name.replace(/[^a-zA-Z0-9]/g, '')}\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Console.WriteLine("Hello World");\n        }\n    }\n}`,
        go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}`,
        rs: `fn main() {\n    println!("Hello World");\n}`,
        php: `<?php\n\nfunction main() {\n    echo "Hello World\\n";\n}\n\nmain();\n?>`,
        rb: `# ${name}\n\ndef main\n  puts "Hello World"\nend\n\nmain`,
        swift: `import Foundation\n\nfunc main() {\n    print("Hello World")\n}\n\nmain()`,
        kt: `fun main() {\n    println("Hello World")\n}`,
        
        // Data formats
        json: `{\n  "name": "${name}",\n  "version": "1.0.0",\n  "description": "Sample JSON document"\n}`,
        xml: `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <item>Hello World</item>\n</root>`,
        yaml: `# ${name}\nname: ${name}\nversion: 1.0.0\ndescription: Sample YAML document`,
        yml: `# ${name}\nname: ${name}\nversion: 1.0.0\ndescription: Sample YAML document`,
        toml: `# ${name}\n\n[package]\nname = "${name}"\nversion = "1.0.0"\ndescription = "Sample TOML document"`,
        ini: `; ${name}\n\n[settings]\nname = ${name}\nversion = 1.0.0`,
        env: `# ${name} Environment Variables\n\nNODE_ENV=development\nPORT=3000\nDATABASE_URL=postgresql://localhost:5432/mydb`,
        csv: `Name,Email,Phone,Company\nJohn Doe,john@example.com,555-0100,Acme Corp\nJane Smith,jane@example.com,555-0101,Tech Inc\nBob Johnson,bob@example.com,555-0102,Data LLC`,
        
        // Database
        sql: `-- ${name}\n\nCREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nSELECT * FROM users;`,
        graphql: `# ${name}\n\ntype Query {\n  hello: String\n  users: [User!]!\n}\n\ntype User {\n  id: ID!\n  name: String!\n  email: String!\n}`,
        prisma: `// ${name}\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  name      String?\n  createdAt DateTime @default(now())\n}`,
        
        // Shell scripts
        sh: `#!/bin/bash\n# ${name}\n\necho "Hello World"`,
        bash: `#!/bin/bash\n# ${name}\n\necho "Hello World"`,
        ps1: `# ${name}\n\nWrite-Host "Hello World"`,
        bat: `@echo off\nREM ${name}\n\necho Hello World`,
        
        // Documents
        docx: `# ${name}\n\nThis is a Word document. You can write formatted text here.\n\n## Features\n- Rich text formatting\n- Headers and paragraphs\n- Lists and tables\n\nExport this file as DOCX to get a proper Word document.`,
        xlsx: `Product,Quantity,Price,Total\nLaptop,2,999.99,1999.98\nMouse,5,29.99,149.95\nKeyboard,3,79.99,239.97\n\nNote: This is Excel data in CSV format. Export as Excel to get a proper spreadsheet.`,
        
        // Other
        svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="100" cy="100" r="80" fill="#4F46E5" />\n  <text x="100" y="110" text-anchor="middle" fill="white" font-size="20" font-family="Arial">${name}</text>\n</svg>`,
        dockerfile: `FROM node:18-alpine\n\nWORKDIR /app\n\nCOPY package*.json ./\nRUN npm install\n\nCOPY . .\n\nEXPOSE 3000\n\nCMD ["npm", "start"]`,
        gitignore: `# Dependencies\nnode_modules/\n\n# Build output\ndist/\nbuild/\n\n# Environment\n.env\n.env.local\n\n# IDE\n.vscode/\n.idea/\n\n# OS\n.DS_Store\nThumbs.db`
    };
    
    return templates[type] || '';
}
