import { useState } from 'react';
import { 
    FileText, 
    MessageSquare, 
    LogOut, 
    User, 
    ChevronDown, 
    PanelLeftClose, 
    PanelLeftOpen,
    RotateCcw,
    RotateCw,
    Download,
    Eye,
    EyeOff,
    Table,
    Type
} from 'lucide-react';
import { useDemoStore } from '../store/useDemoStore';
import { useEditor } from '../contexts/EditorContext';
import { logOut } from '../lib/firebase';
import { 
    exportToPDF, 
    exportToExcel, 
    exportToCSV, 
    exportToDOCX, 
    exportAsText 
} from '../utils/exportUtils';

export default function MainHeader() {
    const { 
        aiPanelOpen, 
        toggleAiPanel, 
        fileTreeOpen, 
        toggleFileTree, 
        user,
        isSaving,
        activeFileId,
        fileTree,
        findNodeInTree,
        showPreview,
        togglePreview
    } = useDemoStore();
    
    const editorRef = useEditor();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const activeFile = activeFileId ? findNodeInTree(fileTree, activeFileId) : null;
    const canPreview = activeFile && ['md', 'html', 'svg', 'xml', 'json', 'jsx', 'tsx'].includes(activeFile.name?.split('.').pop());

    const handleLogout = async () => {
        try {
            await logOut();
            setShowUserMenu(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleUndo = () => {
        console.log('🔄 [UNDO] Button clicked');
        console.log('🔄 [UNDO] editorRef.current:', editorRef.current);
        if (editorRef.current) {
            editorRef.current.trigger('keyboard', 'undo', null);
            editorRef.current.focus();
            console.log('✅ [UNDO] Triggered');
        } else {
            console.log('❌ [UNDO] No editor ref');
        }
    };

    const handleRedo = () => {
        console.log('🔄 [REDO] Button clicked');
        console.log('🔄 [REDO] editorRef.current:', editorRef.current);
        if (editorRef.current) {
            editorRef.current.trigger('keyboard', 'redo', null);
            editorRef.current.focus();
            console.log('✅ [REDO] Triggered');
        } else {
            console.log('❌ [REDO] No editor ref');
        }
    };

    const handleCopy = async () => {
        if (editorRef.current) {
            const selection = editorRef.current.getSelection();
            const selectedText = editorRef.current.getModel().getValueInRange(selection);
            try {
                await navigator.clipboard.writeText(selectedText);
                console.log('✅ [COPY] Text copied to clipboard');
            } catch (err) {
                console.error('❌ [COPY] Failed:', err);
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
                console.log('✅ [PASTE] Text pasted from clipboard');
            } catch (err) {
                console.error('❌ [PASTE] Failed:', err);
            }
        }
    };

    const handleExport = async (format) => {
        if (!activeFile) return;
        const baseFileName = activeFile.name.replace(/\.[^/.]+$/, '');
        const content = activeFile.content || '';
        setShowExportMenu(false);
        
        let result;
        switch (format) {
            case 'pdf': result = await exportToPDF(content, baseFileName, activeFile.name?.split('.').pop()); break;
            case 'excel': result = exportToExcel(content, baseFileName, activeFile.name?.split('.').pop()); break;
            case 'csv': result = exportToCSV(content, baseFileName, activeFile.name?.split('.').pop()); break;
            case 'docx': result = await exportToDOCX(content, baseFileName); break;
            case 'txt': result = exportAsText(content, baseFileName); break;
            default: return;
        }
        
        if (result && !result.success) {
            console.error(`Export failed: ${result.error}`);
        }
    };

    return (
        <header className="h-[50px] bg-[#252526] rounded-lg flex items-center justify-between px-4 flex-shrink-0">
            {/* Left: File Tree Toggle & App Title */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={toggleFileTree}
                    className={`p-1.5 rounded transition ${
                        fileTreeOpen 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                    }`}
                    title={fileTreeOpen ? 'Hide File Tree' : 'Show File Tree'}
                >
                    {fileTreeOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                </button>
                <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h1 className="text-sm font-semibold">LexiCode Workspace</h1>
                </div>
                
                {/* Auto-save Indicator - Always visible with smooth animation */}
                <div className="relative group">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSaving 
                            ? 'bg-blue-500/20 border-2 border-blue-500/40' 
                            : 'bg-green-500/20 border-2 border-green-500/40'
                    }`}>
                        <svg 
                            className={`w-3 h-3 ${isSaving ? 'text-blue-400 animate-spin' : 'text-green-400'}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            {isSaving ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            )}
                        </svg>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 bg-[#1e1e1e] border border-white/10 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                        <div className="text-[10px] font-bold text-white/90">
                            {isSaving ? 'Saving changes...' : 'All changes saved'}
                        </div>
                        <div className="text-[9px] text-white/40 mt-0.5">
                            Auto-save enabled
                        </div>
                        {/* Arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-[#1e1e1e] border-l border-t border-white/10 rotate-45"></div>
                    </div>
                </div>
            </div>
            
            {/* Right: Editor Actions & AI Toggle & User Avatar */}
            <div className="flex items-center gap-3">
                {/* Editor Actions (only show when file is active) */}
                {activeFile && (
                    <>
                        {/* History Controls */}
                        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5">
                            <button 
                                onClick={handleUndo} 
                                title="Undo (Ctrl+Z)" 
                                className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white transition-all active:scale-90"
                            >
                                <RotateCcw size={14}/>
                            </button>
                            <button 
                                onClick={handleRedo} 
                                title="Redo (Ctrl+Y)" 
                                className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white transition-all active:scale-90"
                            >
                                <RotateCw size={14}/>
                            </button>
                        </div>

                        {/* Copy/Paste Controls */}
                        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5">
                            <button 
                                onClick={handleCopy} 
                                title="Copy (Ctrl+C)" 
                                className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white transition-all active:scale-90"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                            <button 
                                onClick={handlePaste} 
                                title="Paste (Ctrl+V)" 
                                className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white transition-all active:scale-90"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                </svg>
                            </button>
                        </div>

                        {/* Live Preview Toggle */}
                        <button
                            onClick={canPreview ? togglePreview : undefined}
                            disabled={!canPreview}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                !canPreview
                                    ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                                    : showPreview 
                                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                                        : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                            }`}
                            title={!canPreview ? 'Preview not available for this file type' : (showPreview ? 'Hide Preview' : 'Show Preview')}
                        >
                            {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                            <span>{showPreview ? 'HIDE' : 'PREVIEW'}</span>
                        </button>

                        {/* Export Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="group flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-all active:scale-95 border border-blue-400/20"
                            >
                                <Download size={12} /> 
                                <span>EXPORT</span>
                                <ChevronDown size={11} className={`transition-transform duration-300 opacity-50 ${showExportMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showExportMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-[#161618] border border-white/10 shadow-2xl rounded-xl p-1 z-[100]">
                                    <div className="px-3 py-2 text-[9px] font-bold text-white/20 uppercase tracking-wider">Output Formats</div>
                                    
                                    <div className="space-y-0.5">
                                        <button onClick={() => handleExport('pdf')} className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-all group text-left">
                                            <div className="flex items-center gap-2 text-white/70 group-hover:text-white">
                                                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                    <FileText size={14} className="text-red-400" />
                                                </div>
                                                <span className="font-bold text-[12px]">PDF Document</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-white/20">.pdf</span>
                                        </button>

                                        <button onClick={() => handleExport('docx')} className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-all group text-left">
                                            <div className="flex items-center gap-2 text-white/70 group-hover:text-white">
                                                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <Type size={14} className="text-blue-400" />
                                                </div>
                                                <span className="font-bold text-[12px]">Word Document</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-white/20">.docx</span>
                                        </button>

                                        <button onClick={() => handleExport('excel')} className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-all group text-left">
                                            <div className="flex items-center gap-2 text-white/70 group-hover:text-white">
                                                <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <Table size={14} className="text-green-400" />
                                                </div>
                                                <span className="font-bold text-[12px]">Excel Sheet</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-white/20">.xlsx</span>
                                        </button>
                                    </div>

                                    <div className="h-[1px] bg-white/5 my-1 mx-2" />

                                    <button onClick={() => handleExport('txt')} className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-all group text-left">
                                        <span className="font-bold text-[11px] text-white/40 group-hover:text-white uppercase tracking-wider">Raw Text</span>
                                        <span className="text-[9px] font-mono text-white/20">.txt</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* AI Assistant Toggle - Icon only */}
                <button
                    onClick={toggleAiPanel}
                    className={`p-2 rounded-lg transition-all ${
                        aiPanelOpen 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    title={aiPanelOpen ? 'Hide AI Assistant' : 'Show AI Assistant'}
                >
                    <MessageSquare className="w-4 h-4" />
                </button>

                {/* User Avatar Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                        title={user?.email || 'User Menu'}
                    >
                        {user?.photoURL ? (
                            <img 
                                src={user.photoURL} 
                                alt={user?.displayName || 'User'} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                        <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        </div>
                                    `;
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </button>
                    
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-[#2d2d30] border border-gray-600 rounded-lg shadow-lg z-50">
                            <div className="py-1">
                                {/* User Info Section */}
                                <div className="px-4 py-3 border-b border-gray-700">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                            {user?.photoURL ? (
                                                <img 
                                                    src={user.photoURL} 
                                                    alt={user?.displayName || 'User'} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-white text-sm truncate">
                                                {user?.displayName || 'User'}
                                            </div>
                                            <div className="text-xs text-gray-400 truncate">
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Actions */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700 transition flex items-center space-x-2 text-red-400"
                                >
                                    <LogOut className="w-4 h-4" />
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
