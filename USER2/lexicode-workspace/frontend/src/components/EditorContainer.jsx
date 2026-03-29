import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { useDemoStore } from "../store/useDemoStore";
import PreviewPanel from "./PreviewPanel";
import EditorHeader from "./EditorHeader";
import { useEditor } from "../contexts/EditorContext";

export default function EditorContainer() {
    const { files, activeFileId, updateFileContent, showPreview } = useDemoStore();
    const activeFile = files.find(f => f.id === activeFileId);
    const [debouncedContent, setDebouncedContent] = useState(activeFile?.content || '');
    const editorRef = useEditor();

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    // Debounce preview updates
    useEffect(() => {
        if (!activeFile) return;
        
        const timer = setTimeout(() => {
            setDebouncedContent(activeFile.content || '');
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [activeFile?.content]);

    // Update debounced content immediately when file changes
    useEffect(() => {
        if (activeFile) {
            setDebouncedContent(activeFile.content || '');
        }
    }, [activeFileId]);

    if (!activeFile) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                    <p className="text-lg mb-2">No file selected</p>
                    <p className="text-sm">Select a file from the sidebar to begin editing</p>
                </div>
            </div>
        );
    }

    const getLanguage = (type) => {
        const languageMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'json': 'json',
            'md': 'markdown',
            'html': 'html',
            'css': 'css',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'xml': 'xml',
            'yaml': 'yaml',
            'sql': 'sql',
            'txt': 'plaintext',
            'svg': 'xml'
        };
        return languageMap[type] || 'plaintext';
    };

    const canPreview = ['md', 'html', 'svg', 'xml', 'json'].includes(activeFile.type);

    return (
        <div className="flex flex-col h-full overflow-hidden rounded-lg">
            {/* Editor Header - Document Actions */}
            <EditorHeader />

            {/* Editor and Preview Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Editor */}
                <div className={`${showPreview && canPreview ? 'w-1/2' : 'w-full'} overflow-hidden`}>
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        path={activeFile.name}
                        defaultLanguage={getLanguage(activeFile.type)}
                        value={activeFile.content || ''}
                        onChange={(value) => updateFileContent(activeFile.id, value || '')}
                        onMount={handleEditorDidMount}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            wordWrap: "on",
                            automaticLayout: true,
                            scrollBeyondLastLine: false,
                            padding: { top: 16, bottom: 16 }
                        }}
                    />
                </div>

                {/* Preview */}
                {showPreview && canPreview && (
                    <div className="w-1/2 overflow-hidden">
                        <PreviewPanel 
                            content={debouncedContent}
                            fileType={activeFile.type}
                            fileName={activeFile.name}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
