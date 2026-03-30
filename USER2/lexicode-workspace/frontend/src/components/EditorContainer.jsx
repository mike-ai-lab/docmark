import { useRef, useEffect } from 'react';
import { 
  File, 
  X, 
  Code2, 
  Layout, 
  Zap,
  MoreVertical
} from 'lucide-react';
import ExplorerPanel from './ExplorerPanel';
import PreviewPanel from './PreviewPanel';
import MonacoEditor from './MonacoEditor';
import { useDemoStore } from '../store/useDemoStore';
import { useEditor } from '../contexts/EditorContext';

export default function EditorContainer() {
  const { 
    fileTree,
    activeFileId, 
    openTabs,
    streamingFileIds, // Get streaming file IDs
    setActiveFile, 
    closeTab,
    updateFileContent,
    fileTreeOpen,
    findNodeInTree,
    showPreview
  } = useDemoStore();

  const localEditorRef = useRef(null);
  const sharedEditorRef = useEditor();

  // Sync local ref with shared context ref
  useEffect(() => {
    if (localEditorRef.current) {
      sharedEditorRef.current = localEditorRef.current;
    }
  }, [localEditorRef.current, sharedEditorRef]);

  // Get active file from tree
  const activeFile = activeFileId ? findNodeInTree(fileTree, activeFileId) : null;

  const handleCloseTab = (e, id) => {
    e.stopPropagation();
    closeTab(id);
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* File Tree Sidebar */}
      {fileTreeOpen && <ExplorerPanel />}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        {/* Tab Bar */}
        <nav className="h-10 bg-[#252526] flex overflow-x-auto no-scrollbar border-b border-black/40">
          {openTabs.map(fileId => {
            const file = findNodeInTree(fileTree, fileId);
            if (!file) return null;
            const isActive = activeFileId === fileId;
            const isStreaming = streamingFileIds?.includes(fileId); // Check if streaming
            return (
              <div 
                key={fileId} 
                onClick={() => {
                  console.log('🖱️ [TAB CLICK] Clicked on tab:', file.name, 'ID:', fileId);
                  setActiveFile(fileId);
                }}
                className={`flex items-center gap-3 px-4 py-1 h-full min-w-[140px] max-w-[220px] border-r border-black/20 cursor-pointer text-xs transition-all relative group
                  ${isActive ? 'bg-[#1e1e1e] text-white shadow-[inset_0_2px_0_#3b82f6]' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2b2b2b]'}
                  ${isStreaming ? 'animate-pulse' : ''}
                `}
              >
                <File size={14} className={`${isActive ? "text-blue-400" : "opacity-50"} ${isStreaming ? 'animate-spin' : ''}`} />
                <span className="truncate flex-1 font-medium">{file.name}</span>
                {isStreaming && <span className="text-[10px] text-yellow-400">⚡</span>}
                <X 
                  size={14} 
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded p-0.5 transition-all" 
                  onClick={(e) => handleCloseTab(e, fileId)} 
                />
              </div>
            );
          })}
        </nav>

        {activeFile ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} relative transition-all duration-300`}>
              <MonacoEditor 
                ref={localEditorRef}
                file={activeFile}
                onContentChange={updateFileContent}
              />
            </div>
            
            {/* Preview Panel */}
            {showPreview && (
              <div className="w-1/2 border-l border-black/40">
                <PreviewPanel 
                  content={activeFile.content || ''} 
                  fileType={activeFile.name?.split('.').pop() || 'txt'}
                  fileName={activeFile.name}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e]">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full" />
              <Code2 size={120} strokeWidth={0.5} className="text-blue-500/30 relative" />
            </div>
            <h2 className="text-2xl font-bold text-white/60 mb-2">LexiCode Workspace</h2>
            <p className="text-white/20 text-sm max-w-[280px] text-center">Open a file from the explorer to start coding.</p>
            
            <div className="mt-16 grid grid-cols-3 gap-12 opacity-10">
               <div className="flex flex-col items-center gap-2"><Layout size={20}/><span className="text-[10px] font-bold">GRID</span></div>
               <div className="flex flex-col items-center gap-2"><Zap size={20}/><span className="text-[10px] font-bold">TURBO</span></div>
               <div className="flex flex-col items-center gap-2"><MoreVertical size={20}/><span className="text-[10px] font-bold">MORE</span></div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; border: 3px solid #1e1e1e; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}