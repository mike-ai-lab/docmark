import { useState } from 'react';
import { useDemoStore } from '../store/useDemoStore';

/**
 * STREAMING DEMO COMPONENT
 * Tests file creation streaming WITHOUT using AI API
 * Simulates AI response to debug frontend logic
 */
export default function StreamingDemo() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState([]);
    const { fileTree, activeFileId, openTabs } = useDemoStore();

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { timestamp, message, type }]);
        console.log(`[${timestamp}] ${message}`);
    };

    const simulateAIResponse = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setLogs([]);

        addLog('🚀 Starting streaming demo...', 'success');

        // Simulate AI response data
        const mockAIResponse = {
            action: 'create',
            message: 'I\'ve created a demo project with 3 files to test the streaming functionality.',
            createdFiles: [
                {
                    name: 'README.md',
                    type: 'md',
                    path: 'streaming-test/README.md',
                    content: '# Streaming Test Project\n\nThis project was created to test the file streaming functionality.\n\n## Features\n- Sequential file creation\n- Character-by-character streaming\n- Realistic typing animation\n\n## Status\nIf you can read this completely, streaming works!'
                },
                {
                    name: 'app.js',
                    type: 'js',
                    path: 'streaming-test/app.js',
                    content: 'console.log("Streaming test app");\n\nfunction init() {\n    console.log("Initializing...");\n    console.log("Testing character-by-character streaming");\n    console.log("Each character should appear smoothly");\n}\n\ninit();'
                },
                {
                    name: 'config.json',
                    type: 'json',
                    path: 'streaming-test/config.json',
                    content: '{\n  "name": "streaming-test",\n  "version": "1.0.0",\n  "description": "Testing file streaming",\n  "features": [\n    "sequential-creation",\n    "smooth-typing",\n    "realistic-animation"\n  ]\n}'
                }
            ]
        };

        addLog(`📋 Mock AI response created with ${mockAIResponse.createdFiles.length} files`, 'info');

        try {
            // Call the store's file creation logic
            const { chatWithAI, addToConversation } = useDemoStore.getState();
            
            addLog('📝 Adding user message to conversation...', 'info');
            addToConversation('user', 'Create a streaming test project');

            addLog('🤖 Adding AI message to conversation...', 'info');
            addToConversation('assistant', mockAIResponse.message);

            addLog('📁 Starting file creation process...', 'success');
            
            // Manually trigger the file creation logic
            const { fileTree: currentTree } = useDemoStore.getState();
            addLog(`📊 Current tree has ${currentTree.length} root nodes`, 'info');

            // Process files using the same logic as chatWithAI
            const updatedTree = [...currentTree];
            const createdFileIds = [];
            const fileSummaries = [];

            // Helper to find or create folder
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
                    addLog(`📁 Created folder: ${folderName}`, 'success');
                }
                
                if (startIndex < pathParts.length - 1) {
                    return findOrCreateFolder(folder.children, pathParts, startIndex + 1);
                }
                
                return folder;
            };

            // Process each file sequentially
            for (let index = 0; index < mockAIResponse.createdFiles.length; index++) {
                const fileData = mockAIResponse.createdFiles[index];
                const pathParts = fileData.path.split('/');
                const fileName = pathParts.pop();
                const folderPath = pathParts;

                addLog(`\n📄 [${index + 1}/${mockAIResponse.createdFiles.length}] Creating: ${fileData.name}`, 'info');
                addLog(`   Path: ${fileData.path}`, 'info');
                addLog(`   Content length: ${fileData.content.length} chars`, 'info');

                const newFile = {
                    id: `file-${Date.now()}-${index}-${Math.random()}`,
                    name: fileName,
                    type: fileData.type || 'file',
                    content: '',
                    last_modified: new Date().toISOString()
                };

                // Add file to tree
                if (folderPath.length === 0) {
                    updatedTree.push(newFile);
                    addLog(`   ✓ Added to root`, 'success');
                } else {
                    const targetFolder = findOrCreateFolder(updatedTree, folderPath);
                    if (!targetFolder.children) {
                        targetFolder.children = [];
                    }
                    targetFolder.children.push(newFile);
                    addLog(`   ✓ Added to folder: ${folderPath.join('/')}`, 'success');
                }

                createdFileIds.push(newFile.id);

                // Update tree and save
                useDemoStore.setState({ fileTree: [...updatedTree] });
                useDemoStore.getState().saveTreeToLocalStorage();
                addLog(`   ✓ Tree updated and saved`, 'success');

                // Open file in editor
                useDemoStore.setState({
                    activeFileId: newFile.id,
                    openTabs: [...new Set([...useDemoStore.getState().openTabs, newFile.id])]
                });
                addLog(`   ✓ File opened in editor (ID: ${newFile.id})`, 'success');

                // Wait before streaming
                await new Promise(resolve => setTimeout(resolve, 200));
                addLog(`   ⏳ Starting content stream...`, 'info');

                // Stream content character by character
                const fullContent = fileData.content;
                const totalDuration = 4000; // 4 seconds per file
                const charDelay = Math.max(10, totalDuration / fullContent.length);

                let currentContent = '';
                let charCount = 0;
                const startTime = Date.now();

                for (let i = 0; i < fullContent.length; i++) {
                    currentContent += fullContent[i];
                    charCount++;

                    // Update file content in tree
                    const updateContent = (tree) => tree.map(node => {
                        if (node.id === newFile.id) {
                            return { ...node, content: currentContent };
                        }
                        if (node.children) {
                            return { ...node, children: updateContent(node.children) };
                        }
                        return node;
                    });

                    useDemoStore.setState({ fileTree: updateContent(useDemoStore.getState().fileTree) });

                    // Wait with slight randomness
                    await new Promise(resolve => setTimeout(resolve, charDelay + Math.random() * 15));

                    // Log progress every 50 characters
                    if (charCount % 50 === 0) {
                        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                        const progress = ((i / fullContent.length) * 100).toFixed(0);
                        addLog(`   📝 Streamed ${charCount} chars (${progress}%) in ${elapsed}s`, 'info');
                    }
                }

                const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
                addLog(`   ✅ Streaming complete! ${charCount} chars in ${totalTime}s`, 'success');

                // Ensure final content is set
                const finalizeFile = (tree) => tree.map(node => {
                    if (node.id === newFile.id) {
                        return { ...node, content: fullContent };
                    }
                    if (node.children) {
                        return { ...node, children: finalizeFile(node.children) };
                    }
                    return node;
                });

                useDemoStore.setState({ fileTree: finalizeFile(useDemoStore.getState().fileTree) });
                useDemoStore.getState().saveTreeToLocalStorage();
                addLog(`   ✓ Final content saved to localStorage`, 'success');

                fileSummaries.push(`${index + 1}. ${fileData.path}`);

                // Pause between files
                if (index < mockAIResponse.createdFiles.length - 1) {
                    addLog(`\n⏸️  Pausing 800ms before next file...`, 'info');
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            }

            addLog('\n✅ All files created successfully!', 'success');
            addLog(`📊 Total files: ${createdFileIds.length}`, 'info');
            addLog(`📊 File IDs: ${createdFileIds.join(', ')}`, 'info');

            // Check final state
            const finalTree = useDemoStore.getState().fileTree;
            const finalActiveId = useDemoStore.getState().activeFileId;
            const finalTabs = useDemoStore.getState().openTabs;

            addLog(`\n🔍 Final State Check:`, 'info');
            addLog(`   Tree nodes: ${finalTree.length}`, 'info');
            addLog(`   Active file ID: ${finalActiveId}`, 'info');
            addLog(`   Open tabs: ${finalTabs.length}`, 'info');

            // Verify files are clickable
            const testFolder = finalTree.find(n => n.name === 'streaming-test');
            if (testFolder && testFolder.children) {
                addLog(`\n✅ Folder found with ${testFolder.children.length} children`, 'success');
                testFolder.children.forEach((file, i) => {
                    addLog(`   ${i + 1}. ${file.name} (${file.content?.length || 0} chars)`, 'info');
                });
            } else {
                addLog(`\n❌ ERROR: Folder not found or has no children!`, 'error');
            }

        } catch (error) {
            addLog(`\n❌ ERROR: ${error.message}`, 'error');
            console.error('Demo error:', error);
        }

        setIsRunning(false);
        addLog('\n🏁 Demo complete!', 'success');
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#1e1e1e] flex flex-col">
            {/* Header */}
            <div className="h-12 bg-[#252526] border-b border-black/40 flex items-center justify-between px-4 shrink-0">
                <h1 className="text-white font-semibold">Streaming Demo - Debug Console</h1>
                <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
                >
                    Close Demo
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Logs */}
                <div className="flex-1 overflow-auto p-4 font-mono text-xs">
                    {logs.map((log, i) => (
                        <div
                            key={i}
                            className={`mb-1 ${
                                log.type === 'error' ? 'text-red-400' :
                                log.type === 'success' ? 'text-green-400' :
                                'text-gray-300'
                            }`}
                        >
                            <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="text-gray-500 text-center mt-8">
                            Click "Run Demo" to start the streaming test
                        </div>
                    )}
                </div>

                {/* State Inspector */}
                <div className="w-80 border-l border-gray-700 bg-[#252526] p-4 overflow-auto shrink-0">
                    <h2 className="text-white font-semibold mb-4">Current State</h2>
                    
                    <div className="space-y-4 text-xs">
                        <div>
                            <div className="text-gray-400 mb-1">File Tree Nodes:</div>
                            <div className="text-white font-mono">{fileTree.length}</div>
                        </div>

                        <div>
                            <div className="text-gray-400 mb-1">Active File ID:</div>
                            <div className="text-white font-mono break-all">{activeFileId || 'None'}</div>
                        </div>

                        <div>
                            <div className="text-gray-400 mb-1">Open Tabs:</div>
                            <div className="text-white font-mono">{openTabs.length}</div>
                        </div>

                        <div>
                            <div className="text-gray-400 mb-1">Tree Structure:</div>
                            <pre className="text-white font-mono text-[10px] bg-black/30 p-2 rounded overflow-auto max-h-96">
                                {JSON.stringify(fileTree, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="h-16 bg-[#252526] border-t border-black/40 flex items-center justify-center gap-4 shrink-0">
                <button
                    onClick={simulateAIResponse}
                    disabled={isRunning}
                    className={`px-6 py-2 rounded font-semibold ${
                        isRunning
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                >
                    {isRunning ? 'Running Demo...' : 'Run Demo'}
                </button>
                <button
                    onClick={() => setLogs([])}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold"
                >
                    Clear Logs
                </button>
            </div>
        </div>
    );
}
