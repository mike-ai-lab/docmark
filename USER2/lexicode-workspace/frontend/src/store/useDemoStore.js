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
    currentStreamingFile: null, // Track current file being generated
    soundNotificationsEnabled: true, // Toggle for completion sound
    skipDeleteConfirmation: false,

    setSkipDeleteConfirmation: (skip) => {
        set({ skipDeleteConfirmation: skip });
        localStorage.setItem('lexicode-skip-delete-confirmation', skip.toString());
    },

    toggleSoundNotifications: () => {
        const newValue = !get().soundNotificationsEnabled;
        set({ soundNotificationsEnabled: newValue });
        localStorage.setItem('lexicode-sound-notifications', newValue.toString());
    },

    playCompletionSound: () => {
        if (!get().soundNotificationsEnabled) return;
        
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800; // Pleasant frequency
        oscillator.type = 'sine'; // Smooth sine wave
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    },

    loadPreferences: () => {
        const skipDelete = localStorage.getItem('lexicode-skip-delete-confirmation');
        if (skipDelete) {
            set({ skipDeleteConfirmation: skipDelete === 'true' });
        }
        const soundNotif = localStorage.getItem('lexicode-sound-notifications');
        if (soundNotif !== null) {
            set({ soundNotificationsEnabled: soundNotif === 'true' });
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

    togglePreview: () => {
        const currentState = get().showPreview;
        const activeFile = get().activeFileId ? get().findNodeInTree(get().fileTree, get().activeFileId) : null;
        
        console.log('👁️ [PREVIEW] ========== TOGGLE START ==========');
        console.log('👁️ [PREVIEW] Current state:', currentState);
        console.log('👁️ [PREVIEW] Active file:', activeFile?.name);
        console.log('👁️ [PREVIEW] File type:', activeFile?.name?.split('.').pop());
        console.log('👁️ [PREVIEW] Can preview:', activeFile && ['md', 'html', 'svg', 'xml', 'json', 'jsx', 'tsx'].includes(activeFile.name?.split('.').pop()));
        
        set((state) => {
            const newState = !state.showPreview;
            console.log('👁️ [PREVIEW] New state:', newState);
            console.log('👁️ [PREVIEW] ========== TOGGLE END ==========');
            return { showPreview: newState };
        });
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
        
        console.log('✨ [CHAT] Creating new session:', newSession.id);
        
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
        console.log('💾 [CHAT] Saved sessions:', updatedSessions.length, 'Active:', activeChatSession);
        console.log('💾 [CHAT] Current conversation length:', conversationHistory.length);
        set({ chatSessions: updatedSessions });
    },

    loadChatSessions: () => {
        const stored = localStorage.getItem('lexicode-chat-sessions');
        console.log('📂 [CHAT] Loading sessions from localStorage...');
        if (stored) {
            const sessions = JSON.parse(stored);
            console.log('📂 [CHAT] Found', sessions.length, 'stored sessions');
            set({ chatSessions: sessions });
            if (sessions.length > 0) {
                const lastSession = sessions[sessions.length - 1];
                console.log('📂 [CHAT] Loading last session:', lastSession.id, 'with', lastSession.history.length, 'messages');
                set({
                    activeChatSession: lastSession.id,
                    conversationHistory: lastSession.history
                });
            } else {
                // No sessions found, create initial one
                console.log('📂 [CHAT] No sessions in storage, creating initial session');
                get().createNewChatSession();
            }
        } else {
            // No stored sessions, create initial one
            console.log('📂 [CHAT] No stored sessions found, creating initial session');
            get().createNewChatSession();
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
        // Ensure there's an active chat session
        if (!get().activeChatSession) {
            console.log('📝 [CHAT] No active session, creating one...');
            get().createNewChatSession();
        }
        
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
            
            // Modify AI message tense for file creation actions
            let aiMessage = data.message;
            if (data.action === 'create' && data.createdFiles) {
                // Change past tense to future tense for initial message
                aiMessage = aiMessage
                    .replace(/I've created/gi, "I'll create")
                    .replace(/I have created/gi, "I will create")
                    .replace(/I've generated/gi, "I'll generate")
                    .replace(/I have generated/gi, "I will generate")
                    .replace(/Created/gi, "Creating")
                    .replace(/Generated/gi, "Generating");
            }
            
            // Add message BEFORE starting file creation
            get().addToConversation('assistant', aiMessage);
            get().saveChatSessions();
            
            // For file creation, add a small delay so user can see the restore button
            if (data.action === 'create' && data.createdFiles) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            }
            
            if (data.action === 'edit' && data.updatedContent && activeFile) {
                await get().updateFileContent(activeFileId, data.updatedContent);
            } else if (data.action === 'create' && data.createdFiles) {
                console.log('📁 [AI] Starting file creation...');
                
                const createFilesSequentially = async () => {
                    let currentTree = JSON.parse(JSON.stringify(get().fileTree));
                    
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
                        
                        console.log(`📄 [AI] Creating ${index + 1}/${data.createdFiles.length}: ${fileData.path}`);
                        
                        // Update progress in chat
                        set({ currentStreamingFile: fileName });
                        const progressMsg = `\n\n⚡ **Generating ${fileName}...** (${index + 1}/${data.createdFiles.length})`;
                        const history = get().conversationHistory;
                        if (history.length > 0 && history[history.length - 1].role === 'assistant') {
                            const lastMsg = history[history.length - 1];
                            set({ 
                                conversationHistory: [
                                    ...history.slice(0, -1),
                                    { ...lastMsg, content: lastMsg.content + progressMsg }
                                ]
                            });
                        }
                        
                        // Create file node with proper type
                        const newFile = {
                            id: `file-${Date.now()}-${index}-${Math.random()}`,
                            name: fileName,
                            type: fileData.type || fileName.split('.').pop() || 'txt',
                            content: '',
                            last_modified: new Date().toISOString()
                        };
                        
                        // Add file to tree structure
                        if (folderPath.length === 0) {
                            currentTree.push(newFile);
                        } else {
                            const targetFolder = findOrCreateFolder(currentTree, folderPath);
                            if (!targetFolder.children) targetFolder.children = [];
                            targetFolder.children.push(newFile);
                        }
                        
                        // Update tree and open file in editor
                        set({
                            fileTree: JSON.parse(JSON.stringify(currentTree)),
                            activeFileId: newFile.id,
                            openTabs: [...new Set([...get().openTabs, newFile.id])]
                        });
                        // DON'T save to localStorage yet - wait for content
                        
                        // Stream content with realistic typing speed (works in background)
                        const fullContent = fileData.content || '';
                        const typingSpeed = 10; // Reduced for faster background execution
                        const chunkSize = 3; // Larger chunks for better performance
                        
                        for (let charIndex = 0; charIndex < fullContent.length; charIndex += chunkSize) {
                            const currentContent = fullContent.slice(0, charIndex + chunkSize);
                            
                            const updateContent = (tree) => tree.map(node => {
                                if (node.id === newFile.id) {
                                    return { ...node, content: currentContent };
                                }
                                if (node.children) {
                                    return { ...node, children: updateContent(node.children) };
                                }
                                return node;
                            });
                            
                            currentTree = updateContent(currentTree);
                            set({ fileTree: JSON.parse(JSON.stringify(currentTree)) });
                            
                            // Use Promise with minimal delay for background compatibility
                            await new Promise(resolve => {
                                // Try setImmediate first (better for background), fallback to setTimeout
                                if (typeof setImmediate !== 'undefined') {
                                    setImmediate(resolve);
                                } else {
                                    setTimeout(resolve, typingSpeed);
                                }
                            });
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
                        
                        currentTree = finalizeContent(currentTree);
                        const finalTree = JSON.parse(JSON.stringify(currentTree));
                        
                        // Update store with final content
                        set({ fileTree: finalTree });
                        
                        // Wait for state update, then save to localStorage
                        await new Promise(resolve => setTimeout(resolve, 50));
                        get().saveTreeToLocalStorage();
                        
                        console.log(`✅ [AI] Completed: ${fileName} (${fullContent.length} chars)`);
                        
                        if (index < data.createdFiles.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                    
                    console.log(`🎉 [AI] All ${data.createdFiles.length} files created!`);
                    
                    // Clear current streaming file and play completion sound
                    set({ currentStreamingFile: null });
                    get().playCompletionSound();
                    
                    const summary = `\n\n✅ **Task Complete**\n\nI've successfully created ${data.createdFiles.length} file(s):\n${data.createdFiles.map((f, i) => `${i + 1}. ${f.path}`).join('\n')}`;
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
        const tree = get().fileTree;
        localStorage.setItem('lexicode-file-tree', JSON.stringify(tree));
    },

    loadTreeFromLocalStorage: () => {
        const stored = localStorage.getItem('lexicode-file-tree');
        
        if (stored) {
            const tree = JSON.parse(stored);
            
            // Count files with content
            const countFilesWithContent = (nodes) => {
                nodes.forEach(node => {
                    if (node.type !== 'folder' && !node.content) {
                        console.warn(`⚠️ [LOAD] File WITHOUT content: ${node.name}`);
                    }
                    if (node.children) {
                        countFilesWithContent(node.children);
                    }
                });
            };
            
            countFilesWithContent(tree);
            set({ fileTree: tree });
        }
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
                            { 
                                id: 'demo-file-1', 
                                name: 'index.html', 
                                type: 'html', 
                                content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Demo App</title>\n  <link rel="stylesheet" href="../styles/main.css">\n</head>\n<body>\n  <h1>Welcome to Demo Project</h1>\n  <p>This is a comprehensive demo with all supported file types.</p>\n  <script src="app.js"></script>\n</body>\n</html>' 
                            },
                            { 
                                id: 'demo-file-2', 
                                name: 'app.js', 
                                type: 'javascript', 
                                content: '// Main application entry point\nconsole.log("Demo App Started");\n\nconst app = {\n  init() {\n    console.log("Initializing...");\n    this.setupEventListeners();\n  },\n  \n  setupEventListeners() {\n    document.addEventListener("DOMContentLoaded", () => {\n      console.log("DOM Ready");\n    });\n  }\n};\n\napp.init();' 
                            },
                            { 
                                id: 'demo-file-3', 
                                name: 'utils.ts', 
                                type: 'typescript', 
                                content: '// TypeScript utility functions\nexport interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nexport function formatDate(date: Date): string {\n  return date.toISOString().split("T")[0];\n}\n\nexport function validateEmail(email: string): boolean {\n  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return regex.test(email);\n}' 
                            },
                            { 
                                id: 'demo-file-4', 
                                name: 'Component.jsx', 
                                type: 'javascript', 
                                content: 'import React, { useState } from "react";\n\nexport default function Component() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div className="component">\n      <h2>Counter: {count}</h2>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}' 
                            }
                        ]
                    },
                    {
                        id: 'styles-folder',
                        name: 'styles',
                        type: 'folder',
                        isOpen: false,
                        children: [
                            { 
                                id: 'demo-file-5', 
                                name: 'main.css', 
                                type: 'css', 
                                content: '/* Main stylesheet */\n:root {\n  --primary-color: #3b82f6;\n  --text-color: #1f2937;\n  --bg-color: #ffffff;\n}\n\nbody {\n  margin: 0;\n  font-family: system-ui, -apple-system, sans-serif;\n  color: var(--text-color);\n  background: var(--bg-color);\n}\n\nh1 {\n  color: var(--primary-color);\n  font-size: 2rem;\n}' 
                            },
                            { 
                                id: 'demo-file-6', 
                                name: 'variables.scss', 
                                type: 'scss', 
                                content: '// SCSS Variables\n$primary: #3b82f6;\n$secondary: #8b5cf6;\n$success: #10b981;\n$danger: #ef4444;\n\n$spacing: (\n  xs: 0.25rem,\n  sm: 0.5rem,\n  md: 1rem,\n  lg: 1.5rem,\n  xl: 2rem\n);\n\n@mixin flex-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}' 
                            }
                        ]
                    },
                    {
                        id: 'docs-folder',
                        name: 'docs',
                        type: 'folder',
                        isOpen: false,
                        children: [
                            { 
                                id: 'demo-file-7', 
                                name: 'README.md', 
                                type: 'markdown', 
                                content: '# Demo Project\n\nThis is a comprehensive demo project showcasing all supported file types.\n\n## Features\n\n- HTML, CSS, JavaScript support\n- TypeScript and JSX/TSX\n- Markdown documentation\n- JSON and YAML configuration\n- Python, Java, C++, and more\n\n## Getting Started\n\n```bash\nnpm install\nnpm run dev\n```\n\n## License\n\nMIT' 
                            },
                            { 
                                id: 'demo-file-8', 
                                name: 'API.md', 
                                type: 'markdown', 
                                content: '# API Documentation\n\n## Endpoints\n\n### GET /api/users\n\nReturns a list of users.\n\n**Response:**\n```json\n[\n  {\n    "id": 1,\n    "name": "John Doe",\n    "email": "john@example.com"\n  }\n]\n```\n\n### POST /api/users\n\nCreates a new user.\n\n**Request Body:**\n```json\n{\n  "name": "Jane Doe",\n  "email": "jane@example.com"\n}\n```' 
                            }
                        ]
                    },
                    {
                        id: 'config-folder',
                        name: 'config',
                        type: 'folder',
                        isOpen: false,
                        children: [
                            { 
                                id: 'demo-file-9', 
                                name: 'package.json', 
                                type: 'json', 
                                content: '{\n  "name": "demo-project",\n  "version": "1.0.0",\n  "description": "A comprehensive demo project",\n  "main": "src/app.js",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "test": "jest"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "devDependencies": {\n    "vite": "^5.0.0",\n    "typescript": "^5.0.0"\n  }\n}' 
                            },
                            { 
                                id: 'demo-file-10', 
                                name: 'config.yaml', 
                                type: 'yaml', 
                                content: '# Application Configuration\napp:\n  name: Demo Project\n  version: 1.0.0\n  port: 3000\n\ndatabase:\n  host: localhost\n  port: 5432\n  name: demo_db\n  user: admin\n\nfeatures:\n  - authentication\n  - api\n  - dashboard\n\nlogging:\n  level: info\n  format: json' 
                            },
                            { 
                                id: 'demo-file-11', 
                                name: 'tsconfig.json', 
                                type: 'json', 
                                content: '{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "ESNext",\n    "lib": ["ES2020", "DOM"],\n    "jsx": "react-jsx",\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true,\n    "forceConsistentCasingInFileNames": true,\n    "moduleResolution": "node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true\n  },\n  "include": ["src/**/*"],\n  "exclude": ["node_modules"]\n}' 
                            }
                        ]
                    },
                    {
                        id: 'backend-folder',
                        name: 'backend',
                        type: 'folder',
                        isOpen: false,
                        children: [
                            { 
                                id: 'demo-file-12', 
                                name: 'server.py', 
                                type: 'python', 
                                content: '# Python Flask Server\nfrom flask import Flask, jsonify, request\n\napp = Flask(__name__)\n\n@app.route(\'/api/users\', methods=[\'GET\'])\ndef get_users():\n    users = [\n        {\'id\': 1, \'name\': \'John Doe\', \'email\': \'john@example.com\'},\n        {\'id\': 2, \'name\': \'Jane Smith\', \'email\': \'jane@example.com\'}\n    ]\n    return jsonify(users)\n\n@app.route(\'/api/users\', methods=[\'POST\'])\ndef create_user():\n    data = request.get_json()\n    return jsonify(data), 201\n\nif __name__ == \'__main__\':\n    app.run(debug=True, port=5000)' 
                            },
                            { 
                                id: 'demo-file-13', 
                                name: 'Database.java', 
                                type: 'java', 
                                content: '// Java Database Connection\nimport java.sql.*;\n\npublic class Database {\n    private static final String URL = "jdbc:postgresql://localhost:5432/demo_db";\n    private static final String USER = "admin";\n    private static final String PASSWORD = "password";\n    \n    public static Connection getConnection() throws SQLException {\n        return DriverManager.getConnection(URL, USER, PASSWORD);\n    }\n    \n    public static void main(String[] args) {\n        try (Connection conn = getConnection()) {\n            System.out.println("Connected to database!");\n        } catch (SQLException e) {\n            System.err.println("Connection failed: " + e.getMessage());\n        }\n    }\n}' 
                            },
                            { 
                                id: 'demo-file-14', 
                                name: 'utils.cpp', 
                                type: 'cpp', 
                                content: '// C++ Utility Functions\n#include <iostream>\n#include <string>\n#include <vector>\n\nnamespace utils {\n    std::string toUpperCase(const std::string& str) {\n        std::string result = str;\n        for (char& c : result) {\n            c = std::toupper(c);\n        }\n        return result;\n    }\n    \n    template<typename T>\n    void printVector(const std::vector<T>& vec) {\n        for (const auto& item : vec) {\n            std::cout << item << " ";\n        }\n        std::cout << std::endl;\n    }\n}' 
                            }
                        ]
                    },
                    {
                        id: 'scripts-folder',
                        name: 'scripts',
                        type: 'folder',
                        isOpen: false,
                        children: [
                            { 
                                id: 'demo-file-15', 
                                name: 'deploy.sh', 
                                type: 'shell', 
                                content: '#!/bin/bash\n# Deployment script\n\necho "Starting deployment..."\n\n# Build the project\nnpm run build\n\nif [ $? -eq 0 ]; then\n    echo "Build successful!"\n    \n    # Deploy to server\n    rsync -avz dist/ user@server:/var/www/app/\n    \n    echo "Deployment complete!"\nelse\n    echo "Build failed!"\n    exit 1\nfi' 
                            },
                            { 
                                id: 'demo-file-16', 
                                name: 'test.rb', 
                                type: 'ruby', 
                                content: '# Ruby Test Script\nrequire \'minitest/autorun\'\n\nclass TestCalculator < Minitest::Test\n  def setup\n    @calc = Calculator.new\n  end\n  \n  def test_addition\n    assert_equal 4, @calc.add(2, 2)\n  end\n  \n  def test_subtraction\n    assert_equal 0, @calc.subtract(2, 2)\n  end\n  \n  def test_multiplication\n    assert_equal 6, @calc.multiply(2, 3)\n  end\nend' 
                            }
                        ]
                    },
                    { 
                        id: 'demo-file-17', 
                        name: '.gitignore', 
                        type: 'plaintext', 
                        content: '# Dependencies\nnode_modules/\n__pycache__/\n*.pyc\n\n# Build output\ndist/\nbuild/\n*.o\n*.class\n\n# Environment\n.env\n.env.local\n\n# IDE\n.vscode/\n.idea/\n*.swp\n\n# OS\n.DS_Store\nThumbs.db' 
                    },
                    { 
                        id: 'demo-file-18', 
                        name: 'LICENSE', 
                        type: 'plaintext', 
                        content: 'MIT License\n\nCopyright (c) 2024 Demo Project\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.' 
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
        const { fileTree, openTabs } = get();
        const node = get().findNodeInTree(fileTree, fileId);
        
        if (!node) {
            console.error('❌ [FILE] Node NOT FOUND:', fileId);
            return;
        }
        
        console.log('✅ [FILE] Opening:', node.name, `(${node.content?.length || 0} chars)`);
        console.log('📦 [FILE] Content preview:', node.content?.substring(0, 50) || 'EMPTY');
        
        if (node.type === 'folder') {
            console.warn('⚠️ [FILE] Cannot open folder as file');
            return;
        }
        
        if (!openTabs.includes(fileId)) {
            set({ 
                openTabs: [...openTabs, fileId],
                activeFileId: fileId 
            });
        } else {
            set({ activeFileId: fileId });
        }
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