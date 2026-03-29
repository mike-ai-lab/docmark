import React, { useRef, useState } from 'react';
import { Save, Download, FileText, Eye, EyeOff, Copy, Clipboard, Trash2, Undo, Redo, ChevronDown, MessageSquare, LogOut, User } from 'lucide-react';
import { useDemoStore } from '../store/useDemoStore';
import { useEditor } from '../contexts/EditorContext';
import { exportToPDF, exportToExcel, exportToCSV, exportToDOCX, exportAsText } from '../utils/exportUtils';
import { logOut } from '../lib/firebase';

export default function Header() {
    const { isSaving, activeFileId, files, showPreview, togglePreview, updateFileContent, aiPanelOpen, toggleAiPanel, user } = useDemoStore();
    const activeFile = files.find(f => f.id === activeFileId);
    const editorRef = useEditor();
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    const canPreview = activeFile && ['md', 'html', 'svg', 'xml', 'json'].includes(activeFile.type);

    const handleLogout = async () => {
        try {
            await logOut();
            setShowUserMenu(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleCopy = () => {
        if (editorRef.current) {
            const selection = editorRef.current.getSelection();
            const selectedText = editorRef.current.getModel().getValueInRange(selection);
            if (selectedText) {
                navigator.clipboard.writeText(selectedText);
            } else {
                // Copy all if nothing selected
                navigator.clipboard.writeText(editorRef.current.getValue());
            }
        }
    };

    const handlePaste = async () => {
        if (editorRef.current) {
            try {
                const text = await navigator.clipboard.readText();
                const selection = editorRef.current.getSelection();
                editorRef.current.executeEdits('paste', [{
                    range: selection,
                    text: text
                }]);
                editorRef.current.focus();
            } catch (err) {
                console.error('Failed to paste:', err);
            }
        }
    };

    const handleClear = () => {
        if (editorRef.current && activeFile) {
            if (confirm('Are you sure you want to clear all content?')) {
                updateFileContent(activeFileId, '');
                editorRef.current.focus();
            }
        }
    };

    const handleUndo = () => {
        if (editorRef.current) {
            editorRef.current.trigger('keyboard', 'undo');
            editorRef.current.focus();
        }
    };

    const handleRedo = () => {
        if (editorRef.current) {
            editorRef.current.trigger('keyboard', 'redo');
            editorRef.current.focus();
        }
    };

    const handleExport = async (format) => {
        if (!activeFile) return;
        
        const baseFileName = activeFile.name.replace(/\.[^/.]+$/, '');
        const content = activeFile.content || '';
        
        setShowExportMenu(false);
        
        let result;
        switch (format) {
            case 'pdf':
                result = await exportToPDF(content, baseFileName, activeFile.type);
                break;
            case 'excel':
                result = exportToExcel(content, baseFileName, activeFile.type);
                break;
            case 'csv':
                result = exportToCSV(content, baseFileName, activeFile.type);
                break;
            case 'docx':
                result = await exportToDOCX(content, baseFileName);
                break;
            case 'txt':
                result = exportAsText(content, baseFileName);
                break;
            default:
                return;
        }
        
        if (!result.success) {
            alert(`Export failed: ${result.error}`);
        }
    };

    return (
        <header className="h-12 bg-[#252526] border-b border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h1 className="text-sm font-semibold">LexiCode Workspace</h1>
                {activeFile && (
                    <span className="text-xs text-gray-400 ml-4">
                        {activeFile.name}
                    </span>
                )}
            </div>
            
            <div className="flex items-center space-x-2">
                {/* Edit Actions */}
                {activeFile && (
                    <div className="flex items-center space-x-1 mr-2 border-r border-gray-700 pr-2">
                        <button
                            onClick={handleUndo}
                            className="p-1.5 hover:bg-gray-700 rounded transition"
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                            onClick={handleRedo}
                            className="p-1.5 hover:bg-gray-700 rounded transition"
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                            onClick={handleCopy}
                            className="p-1.5 hover:bg-gray-700 rounded transition"
                            title="Copy (Ctrl+C)"
                        >
                            <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                            onClick={handlePaste}
                            className="p-1.5 hover:bg-gray-700 rounded transition"
                            title="Paste (Ctrl+V)"
                        >
                            <Clipboard className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                            onClick={handleClear}
                            className="p-1.5 hover:bg-red-700 rounded transition"
                            title="Clear All"
                        >
                            <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                )}

                {isSaving && (
                    <span className="text-xs text-gray-400 flex items-center">
                        <Save className="w-3 h-3 mr-1 animate-pulse" />
                        Saving...
                    </span>
                )}
                
                {/* AI Assistant Toggle */}
                <button
                    onClick={toggleAiPanel}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition ${
                        aiPanelOpen 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    title={aiPanelOpen ? 'Hide AI Assistant' : 'Show AI Assistant'}
                >
                    <MessageSquare className="w-3 h-3" />
                    <span>AI Assistant</span>
                </button>
                
                {canPreview && (
                    <button
                        onClick={togglePreview}
                        className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition ${
                            showPreview 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                        title={showPreview ? 'Hide Preview' : 'Show Preview'}
                    >
                        {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPreview ? 'Hide' : 'Preview'}</span>
                    </button>
                )}
                
                {/* Export Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        disabled={!activeFile}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-xs transition"
                    >
                        <Download className="w-3 h-3" />
                        <span>Export</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {showExportMenu && activeFile && (
                        <div className="absolute right-0 mt-1 w-48 bg-[#2d2d30] border border-gray-600 rounded shadow-lg z-50">
                            <div className="py-1">
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-700 transition flex items-center justify-between"
                                >
                                    <span>Export as PDF</span>
                                    <span className="text-gray-500">.pdf</span>
                                </button>
                                <button
                                    onClick={() => handleExport('docx')}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-700 transition flex items-center justify-between"
                                >
                                    <span>Export as Word</span>
                                    <span className="text-gray-500">.docx</span>
                                </button>
                                <button
                                    onClick={() => handleExport('excel')}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-700 transition flex items-center justify-between"
                                >
                                    <span>Export as Excel</span>
                                    <span className="text-gray-500">.xlsx</span>
                                </button>
                                <button
                                    onClick={() => handleExport('csv')}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-700 transition flex items-center justify-between"
                                >
                                    <span>Export as CSV</span>
                                    <span className="text-gray-500">.csv</span>
                                </button>
                                <button
                                    onClick={() => handleExport('txt')}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-700 transition flex items-center justify-between"
                                >
                                    <span>Export as Text</span>
                                    <span className="text-gray-500">.txt</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative ml-2">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition"
                        title={user?.email || 'User'}
                    >
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-5 h-5 rounded-full" />
                        ) : (
                            <User className="w-4 h-4" />
                        )}
                        <span className="max-w-[100px] truncate">{user?.displayName || user?.email || 'User'}</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {showUserMenu && (
                        <div className="absolute right-0 mt-1 w-48 bg-[#2d2d30] border border-gray-600 rounded shadow-lg z-50">
                            <div className="py-1">
                                <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                                    <div className="font-semibold text-white">{user?.displayName || 'User'}</div>
                                    <div className="truncate">{user?.email}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-700 transition flex items-center space-x-2 text-red-400"
                                >
                                    <LogOut className="w-3 h-3" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
