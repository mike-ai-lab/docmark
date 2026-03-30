import { create } from 'zustand';

// Helper for default file content based on extension
const getDefaultContent = (type, name) => {
    switch (type) {
        case 'html': return `<!DOCTYPE html>\n<html>\n<head>\n  <title>${name}</title>\n</head>\n<body>\n  <h1>${name}</h1>\n</body>\n</html>`;
        case 'css': return `/* Styles for ${name} */\nbody {\n  margin: 0;\n  font-family: sans-serif;\n}`;
        case 'js': return `// JavaScript for ${name}\nconsole.log('Hello from ${name}');`;
        default: return `# ${name}\n\nStart typing...`;
    }
};

export const useDemoStore = create((set, get) => ({
    projects: [],
    currentProject: null,
    files: [],
    fileTree: [], 
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
    useFirebase: false, 
    openTabs: [], 
    streamingFileIds: [], // Track which files are currently streaming
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
        
        get().addToConversation('user', userMessage);
        
        try {
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
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.usage) {
                set((state) => ({
                    tokenUsage: {
                        prompt: state.tokenUsage.prompt + (data.usage.prompt_tokens || 0),
                        completion: state.tokenUsage.completion + (data.usage.completion_tokens || 0),
                        total: state.tokenUsage.total + (data.usage.total_tokens || 0)
                    }
                }));
            }
            
            get().addToConversation('assistant', data.message);
            get().saveChatSessions();
            
            if (data.action === 'edit' && data.updatedContent && activeFile) {
                await get().updateFileContent(activeFileId, data.updatedContent);
            } else if (data.action === 'create' && data.createdFiles) {
                console.log('📁 [AI STREAMING] Starting sequential file creation...');
                
                const createFilesSequentially = async () => {
                    const currentTree = JSON.parse(JSON.stringify(get().fileTree)); // Deep clone
                    
                    const findOrCreateFolder = (tree, pathParts, startIndex = 0) => {
                        if (startIndex >= pathParts.length) return tree;
                        const folderName = pathParts[startIndex];
                        let folder = tree.find(node => node.name === folderName && node.type === 'folder');
                        
                        if (!folder) {
                            folder = {
                                id: `folder-${Date.now()}-${startIndex}-${Math.random()}`,
                                name: folderName,
                                type: 'folder',
                                isOpen: true,
                                children: []
                            };
                            tree.push(folder);
                            console.log('📁 [AI STREAMING] Created folder:', folderName);
                        }
                        
                        if (startIndex < pathParts.length - 1) {
                            return findOrCreateFolder(folder.children, pathParts, startIndex + 1);
                        }
                        return folder;
                    };
                    
                    // Process each file sequentially
                    for (let index = 0; index < data.createdFiles.length; index++) {
                        const fileData = data.createdFiles[index];
                        const pathParts = fileData.path.split('/');
                        const fileName = pathParts.pop();
                        const folderPath = pathParts;
                        
                        console.log(`\n📄 [AI STREAMING] File ${index + 1}/${data.createdFiles.length}: ${fileName}`);
                        console.log(`📂 [AI STREAMING] Path: ${fileData.path}`);
                        console.log(`📝 [AI STREAMING] Content length: ${fileData.content?.length || 0} chars`);
                        
                        // Create file node with proper type
                        const newFile = {
                            id: `file-${Date.now()}-${index}-${Math.random()}`,
                            name: fileName,
                            type: fileData.type || fileName.split('.').pop() || 'txt', // Use extension as type
                            content: '', // Start empty for streaming
                            last_modified: new Date().toISOString()
                        };
                        
                        console.log(`🔧 [AI STREAMING] File type: ${newFile.type}`);
                        
                        // Add file to tree structure
                        if (folderPath.length === 0) {
                            currentTree.push(newFile);
                            console.log('📍 [AI STREAMING] Added to root');
                        } else {
                            const targetFolder = findOrCreateFolder(currentTree, folderPath);
                            if (!targetFolder.children) targetFolder.children = [];
                            targetFolder.children.push(newFile);
                            console.log(`📍 [AI STREAMING] Added to folder: ${folderPath.join('/')}`);
                        }
                        
                        // Update tree and open file in editor
                        set({
                            fileTree: JSON.parse(JSON.stringify(currentTree)), // Deep clone to trigger update
                            activeFileId: newFile.id,
                            openTabs: [...new Set([...get().openTabs, newFile.id])]
                        });
                        get().saveTreeToLocalStorage();
                        
                        console.log(`✅ [AI STREAMING] File node created and opened in editor`);
                        
                        // Stream content with realistic typing speed
                        const fullContent = fileData.content || '';
                        const typingSpeed = 30; // 30ms per character (slower for realism)
                        const chunkSize = 1; // 1 character at a time for smooth effect
                        
                        console.log(`⌨️ [AI STREAMING] Starting content streaming...`);
                        
                        for (let charIndex = 0; charIndex < fullContent.length; charIndex += chunkSize) {
                            const currentContent = fullContent.slice(0, charIndex + chunkSize);
                            
                            // Update content in tree
                            const updateContent = (tree) => tree.map(node => {
                                if (node.id === newFile.id) {
                                    return { ...node, content: currentContent };
                                }
                                if (node.children) {
                                    return { ...node, children: updateContent(node.children) };
                                }
                                return node;
                            });
                            
                            const updatedTree = updateContent(JSON.parse(JSON.stringify(get().fileTree)));
                            set({ fileTree: updatedTree });
                            
                            // Wait for typing effect
                            await new Promise(resolve => setTimeout(resolve, typingSpeed));
                        }
                        
                        // Finalize file with complete content
                        const finalizeContent = (tree) => tree.map(node => {
                            if (node.id === newFile.id) {
                                return { ...node, content: fullContent };
                            }
                            if (node.children) {
                                return { ...node, children: finalizeContent(node.children) };
                            }
                            return node;
                        });
                        
                        const finalTree = finalizeContent(JSON.parse(JSON.stringify(get().fileTree)));
                        set({ fileTree: finalTree });
                        get().saveTreeToLocalStorage();
                        
                        console.log(`✅ [AI STREAMING] Content streaming complete for ${fileName}`);
                        
                        // Pause between files
                        if (index < data.createdFiles.length - 1) {
                            console.log(`⏸️ [AI STREAMING] Pausing before next file...`);
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                    
                    console.log(`\n🎉 [AI STREAMING] All files created successfully!`);
                    
                    // Stream summary message
                    const summary = `\n\n✅ **Task Complete**\n\nSuccessfully created ${data.createdFiles.length} file(s):\n${data.createdFiles.map((f, i) => `${i + 1}. ${f.path}`).join('\n')}`;
                    const history = get().conversationHistory;
                    
                    if (history.length > 0 && history[history.length - 1].role === 'assistant') {
                        const lastMsg = history[history.length - 1];
                        
                        // Stream summary character by character
                        for (let i = 0; i < summary.length; i += 3) {
                            const chunk = summary.slice(0, i + 3);
                            const updatedHistory = [
                                ...history.slice(0, -1),
                                { ...lastMsg, content: lastMsg.content + chunk }
                            ];
                            set({ conversationHistory: updatedHistory });
                            await new Promise(resolve => setTimeout(resolve, 15));
                        }
                        
                        // Final update
                        const finalHistory = [
                            ...history.slice(0, -1),
                            { ...lastMsg, content: lastMsg.content + summary }
                        ];
                        set({ conversationHistory: finalHistory });
                        get().saveChatSessions();
                    }
                };
                
                await createFilesSequentially();
            }
            
            return data;
        } catch (error) {
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
            set({ fileTree: [...get().fileTree, newNode] });
        } else {
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
        const { activeFileId } = get();
        if (activeFileId === id) get().closeTab(id);
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
        const removeFromTree = (tree) => tree.filter(node => {
            if (node.id === draggedId) {
                draggedNode = node;
                return false;
            }
            if (node.children) node.children = removeFromTree(node.children);
            return true;
        });
        const tempTree = JSON.parse(JSON.stringify(get().fileTree));
        const cleanedTree = removeFromTree(tempTree);
        if (!draggedNode) return;
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
        localStorage.setItem('lexicode-file-tree', JSON.stringify(get().fileTree));
    },

    loadTreeFromLocalStorage: () => {
        const stored = localStorage.getItem('lexicode-file-tree');
        if (stored) set({ fileTree: JSON.parse(stored) });
    },

    initDemo: () => {
        const stored = localStorage.getItem('lexicode-demo-data');
        const savedModel = localStorage.getItem('lexicode-selected-model');
        if (savedModel) set({ selectedModel: savedModel });
        get().loadPreferences();
        get().loadChatSessions();
        get().loadTreeFromLocalStorage();
        
        if (stored) {
            const data = JSON.parse(stored);
            set({ projects: data.projects, files: data.files });
        } else {
            const demoProject = { id: 'demo-project-1', name: 'Demo Project', created_at: new Date().toISOString() };
            set({ projects: [demoProject], files: [] });
            get().saveToLocalStorage();
        }
        
        if (get().fileTree.length === 0) {
            const defaultTree = [{
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
                            { id: 'demo-file-1', name: 'index.html', type: 'file', content: '<html><body><h1>Hello</h1></body></html>' }
                        ]
                    }
                ]
            }];
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
    },

    resetTokenUsage: () => {
        set({ tokenUsage: { prompt: 0, completion: 0, total: 0 } });
    },

    setActiveFile: (fileId) => {
        console.log('🎯 [SET ACTIVE FILE] ========== START ==========');
        console.log('🎯 [SET ACTIVE FILE] Requested fileId:', fileId);
        
        const { fileTree, openTabs } = get();
        console.log('🎯 [SET ACTIVE FILE] Current open tabs:', openTabs);
        console.log('🎯 [SET ACTIVE FILE] Searching in tree...');
        
        const node = get().findNodeInTree(fileTree, fileId);
        
        if (!node) {
            console.error('❌ [SET ACTIVE FILE] Node NOT FOUND in tree!');
            console.log('🔍 [SET ACTIVE FILE] Tree structure:', JSON.stringify(fileTree, null, 2));
            return;
        }
        
        console.log('✅ [SET ACTIVE FILE] Found node:', {
            id: node.id,
            name: node.name,
            type: node.type,
            hasContent: !!node.content,
            contentLength: node.content?.length || 0
        });
        
        // Any type that's not 'folder' is a file
        if (node.type === 'folder') {
            console.warn('⚠️ [SET ACTIVE FILE] Node is a folder, not a file!');
            return;
        }
        
        console.log('📂 [SET ACTIVE FILE] Valid file, updating state...');
        
        if (!openTabs.includes(fileId)) {
            console.log('➕ [SET ACTIVE FILE] Adding to open tabs');
            set({ 
                openTabs: [...openTabs, fileId],
                activeFileId: fileId 
            });
        } else {
            console.log('🔄 [SET ACTIVE FILE] Already in tabs, just switching');
            set({ activeFileId: fileId });
        }
        
        console.log('✅ [SET ACTIVE FILE] ========== COMPLETE ==========');
    },

    closeTab: (fileId) => {
        const { openTabs, activeFileId } = get();
        const newTabs = openTabs.filter(id => id !== fileId);
        let newActiveFileId = activeFileId;
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

    closeAllTabs: () => set({ openTabs: [], activeFileId: null }),
    closeOtherTabs: (fileId) => set({ openTabs: [fileId], activeFileId: fileId }),

    createProject: (name) => {
        const newProject = { id: `project-${Date.now()}`, name, created_at: new Date().toISOString() };
        set((state) => ({ projects: [...state.projects, newProject] }));
        get().saveToLocalStorage();
        get().openProject(newProject.id);
    },

    deleteProject: (projectId) => {
        const { files } = get();
        files.filter(f => f.project_id === projectId).forEach(file => get().closeTab(file.id));
        set((state) => ({
            projects: state.projects.filter(p => p.id !== projectId),
            files: state.files.filter(f => f.project_id !== projectId),
            currentProject: state.currentProject === projectId ? null : state.currentProject
        }));
        get().saveToLocalStorage();
    },

    renameProject: (projectId, newName) => {
        set((state) => ({
            projects: state.projects.map(p => p.id === projectId ? { ...p, name: newName } : p)
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
            openTabs: [...state.openTabs, newFile.id]
        }));
        get().saveToLocalStorage();
    }
}));