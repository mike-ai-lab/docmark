import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  FolderPlus, 
  MoreVertical,
  Edit2,
  Trash2,
  FilePlus,
  X,
  RotateCcw,
  RotateCw,
  Copy,
  Download,
  Eye,
  User,
  Zap,
  Layout,
  Code2
} from 'lucide-react';

/**
 * INITIAL DATA STRUCTURE
 */
const initialData = [
  { id: '1', name: 'Demo Project', type: 'folder', isOpen: true, children: [
    { id: '1-1', name: 'src', type: 'folder', isOpen: true, children: [
        { id: '1-1-1', name: 'index.html', type: 'file', content: '<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello World</h1>\n</body>\n</html>' },
    ]},
    { id: '1-2', name: 'README.md', type: 'file', content: '# Demo Project\n\nThis is a demo project to showcase LexiCode Workspace.' },
    { id: '1-3', name: 'adasd.txt', type: 'file', content: 'Sample text content' },
  ]},
  { id: '2', name: 'cv', type: 'folder', isOpen: false, children: [] },
  { id: '3', name: 'boq', type: 'folder', isOpen: false, children: [] },
  { id: '4', name: 'My Workspace', type: 'folder', isOpen: false, children: [] },
  { id: '5', name: 'REACT-COMPONENTS', type: 'folder', isOpen: true, children: [
    { id: '6', name: 'ExplorerPanel.jsx', type: 'file', content: '// React logic here' }
  ]},
];

// --- COMPONENTS ---

const ContextMenu = ({ x, y, onClose, onAction, node }) => {
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const items = [
    { id: 'new-file', label: 'New File', icon: <FilePlus size={14} />, show: node?.type === 'folder' },
    { id: 'new-folder', label: 'New Folder', icon: <FolderPlus size={14} />, show: node?.type === 'folder' },
    { id: 'rename', label: 'Rename', icon: <Edit2 size={14} />, show: !!node },
    { id: 'delete', label: 'Delete', icon: <Trash2 size={14} />, show: !!node, className: 'text-red-400' },
  ];

  return (
    <div ref={menuRef} className="fixed z-50 bg-[#252526] border border-[#454545] shadow-xl py-1 min-w-[160px] rounded-md text-sm text-[#cccccc]" style={{ top: y, left: x }}>
      {items.filter(i => i.show).map(item => (
        <button key={item.id} onClick={() => { onAction(item.id); onClose(); }} className={`w-full flex items-center gap-3 px-3 py-1.5 hover:bg-[#37373d] transition-colors ${item.className || ''}`}>
          {item.icon} <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const FileNode = ({ node, depth, onToggle, onSelect, selectedId, onContextMenu, onRename, onDragStart, onDrop }) => {
  const [localName, setLocalName] = useState(node.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (node.isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [node.isEditing]);

  const handleBlur = () => onRename(node.id, localName);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onRename(node.id, localName);
    if (e.key === 'Escape') onRename(node.id, null);
  };

  const isSelected = selectedId === node.id;
  const isFolder = node.type === 'folder';

  return (
    <div className="group select-none">
      <div
        draggable onDragStart={(e) => onDragStart(e, node.id)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e, node.id)}
        onClick={() => isFolder ? onToggle(node.id) : onSelect(node.id)}
        onContextMenu={(e) => onContextMenu(e, node)}
        className={`flex items-center py-[4px] pr-2 cursor-pointer transition-all ${isSelected ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-[#cccccc]'}`}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        <span className="mr-2 flex-shrink-0">
          {isFolder ? (
            <div className="flex items-center">
              {node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Folder size={16} className={`ml-1 ${node.isOpen ? 'text-blue-400' : 'text-gray-400'}`} fill={node.isOpen ? "currentColor" : "none"} />
            </div>
          ) : (
            <File size={16} className="ml-4 text-gray-400" />
          )}
        </span>

        {node.isEditing ? (
          <input
            ref={inputRef}
            className="bg-[#3c3c3c] border border-[#007acc] outline-none text-white px-1 w-full text-xs"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="truncate text-[13px]">{node.name || (isFolder ? 'New Folder' : 'New File')}</span>
        )}
      </div>

      {isFolder && node.isOpen && node.children?.map(child => (
        <FileNode 
          key={child.id} 
          node={child} 
          depth={depth + 1} 
          onToggle={onToggle} 
          onSelect={onSelect} 
          selectedId={selectedId} 
          onContextMenu={onContextMenu} 
          onRename={onRename} 
          onDragStart={onDragStart} 
          onDrop={onDrop} 
        />
      ))}
    </div>
  );
};

export default function App() {
  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem('lexicode_fs');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [activeFileId, setActiveFileId] = useState('1-2');
  const [openFiles, setOpenFiles] = useState(['1-2', '1-3', '1-1-1']);
  const [contextMenu, setContextMenu] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => localStorage.setItem('lexicode_fs', JSON.stringify(nodes)), [nodes]);

  // Recursively find a node by ID
  const findNode = (list, id) => {
    for (const n of list) {
      if (n.id === id) return n;
      if (n.children) { const res = findNode(n.children, id); if (res) return res; }
    }
    return null;
  };

  const activeFile = activeFileId ? findNode(nodes, activeFileId) : null;

  const handleToggle = (id) => {
    const update = (list) => list.map(n => n.id === id ? { ...n, isOpen: !n.isOpen } : (n.children ? { ...n, children: update(n.children) } : n));
    setNodes(update(nodes));
  };

  const handleSelect = (id) => {
    const node = findNode(nodes, id);
    if (node && node.type === 'file') {
      setActiveFileId(id);
      if (!openFiles.includes(id)) setOpenFiles([...openFiles, id]);
    }
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    const newTabs = openFiles.filter(fid => fid !== id);
    setOpenFiles(newTabs);
    if (activeFileId === id) {
      setActiveFileId(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  const handleAction = (type, targetNode) => {
    if (type === 'new-file' || type === 'new-folder') {
      const newNode = {
        id: Date.now().toString(),
        name: '',
        type: type === 'new-folder' ? 'folder' : 'file',
        isOpen: true,
        isEditing: true,
        children: type === 'new-folder' ? [] : undefined
      };
      
      if (!targetNode) {
        setNodes([...nodes, newNode]);
        return;
      }
      const update = (list) => list.map(n => n.id === targetNode.id ? { ...n, isOpen: true, children: [...(n.children || []), newNode] } : (n.children ? { ...n, children: update(n.children) } : n));
      setNodes(update(nodes));
    } else if (type === 'rename') {
      const update = (list) => list.map(n => n.id === targetNode.id ? { ...n, isEditing: true } : (n.children ? { ...n, children: update(n.children) } : n));
      setNodes(update(nodes));
    } else if (type === 'delete') {
      const del = (list) => list.filter(n => n.id !== targetNode.id).map(n => n.children ? { ...n, children: del(n.children) } : n);
      const updatedNodes = del(nodes);
      setNodes(updatedNodes);
      
      if (activeFileId === targetNode.id) setActiveFileId(null);
      setOpenFiles(prev => prev.filter(id => findNode(updatedNodes, id)));
    }
  };

  const handleRename = (id, newName) => {
    const update = (list) => list.filter(n => !(n.id === id && newName === null)).map(n => 
      n.id === id ? { ...n, name: newName || n.name || 'unnamed', isEditing: false } : (n.children ? { ...n, children: update(n.children) } : n)
    );
    setNodes(update(nodes));
  };

  const onDragStart = (e, id) => setDraggedId(id);
  const onDrop = (e, targetId) => {
    if (draggedId === targetId) return;
    let draggedNode = null;
    const remove = (list) => list.filter(n => {
      if (n.id === draggedId) { draggedNode = n; return false; }
      if (n.children) n.children = remove(n.children);
      return true;
    });
    const tempNodes = remove(JSON.parse(JSON.stringify(nodes)));
    if (!draggedNode) return;
    const add = (list) => list.map(n => (n.id === targetId && n.type === 'folder') ? { ...n, children: [...(n.children || []), draggedNode] } : (n.children ? { ...n, children: add(n.children) } : n));
    setNodes(add(tempNodes));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden">
      
      {/* 1. Main Header */}
      <header className="h-12 border-b border-[#333333] flex items-center justify-between px-4 bg-[#252526] z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg">L</div>
          <span className="font-semibold text-sm tracking-tight text-white/90">LexiCode Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-[#1e1e1e] rounded-full px-3 py-1 border border-[#444] items-center gap-2 cursor-pointer hover:border-blue-500 transition-all active:scale-95">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-[11px] font-bold">AI ASSISTANT</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center border border-[#444] hover:bg-[#444] transition-colors cursor-pointer">
            <User size={18} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* 2. Explorer Panel */}
        <aside className="w-64 bg-[#252526] border-r border-[#333333] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 text-[11px] font-bold text-[#888] uppercase tracking-wider group">
            <span>Explorer</span>
            <div className="flex gap-1">
              <button onClick={() => handleAction('new-file', nodes[0])} title="New File" className="hover:bg-[#37373d] p-1 rounded transition-colors"><FilePlus size={14}/></button>
              <button onClick={() => handleAction('new-folder', nodes[0])} title="New Folder" className="hover:bg-[#37373d] p-1 rounded transition-colors"><FolderPlus size={14}/></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto" onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, node: null }); }}>
            {nodes.map(n => (
              <FileNode 
                key={n.id} 
                node={n} 
                depth={0} 
                onToggle={handleToggle} 
                onSelect={handleSelect} 
                selectedId={activeFileId} 
                onContextMenu={(e, node) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, node }); }} 
                onRename={handleRename} 
                onDragStart={onDragStart} 
                onDrop={onDrop} 
              />
            ))}
          </div>
        </aside>

        {/* 3. Editor Container */}
        <main className="flex-1 flex flex-col bg-[#1e1e1e]">
          
          {/* 3a. Tab Bar */}
          <nav className="h-9 bg-[#252526] flex overflow-x-auto no-scrollbar border-b border-black/20">
            {openFiles.map(fid => {
              const file = findNode(nodes, fid);
              if (!file) return null;
              const isActive = activeFileId === fid;
              return (
                <div 
                  key={fid} 
                  onClick={() => setActiveFileId(fid)}
                  className={`flex items-center gap-2 px-3 py-1 h-full min-w-[120px] max-w-[200px] border-r border-black/20 cursor-pointer text-xs transition-all relative group
                    ${isActive ? 'bg-[#1e1e1e] text-white' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2b2b2b]'}
                  `}
                >
                  {isActive && <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500" />}
                  <File size={14} className={isActive ? "text-blue-400" : "opacity-70"} />
                  <span className="truncate flex-1">{file.name}</span>
                  <X 
                    size={14} 
                    className="opacity-0 group-hover:opacity-100 hover:bg-[#444] rounded p-0.5 transition-opacity" 
                    onClick={(e) => closeTab(e, fid)} 
                  />
                </div>
              );
            })}
          </nav>

          {activeFile ? (
            <>
              {/* 3b. Editor Header / Toolbar */}
              <div className="h-10 bg-[#1e1e1e] flex items-center justify-between px-4 border-b border-[#333333]">
                <div className="flex items-center gap-3">
                   <File size={16} className="text-blue-400" />
                   <span className="text-sm font-medium text-white/90">{activeFile.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-[#333] rounded transition-colors text-[#999]" title="Undo"><RotateCcw size={16}/></button>
                  <button className="p-1.5 hover:bg-[#333] rounded transition-colors text-[#999]" title="Redo"><RotateCw size={16}/></button>
                  <div className="w-[1px] h-4 bg-[#444] mx-1"></div>
                  <button className="p-1.5 hover:bg-[#333] rounded transition-colors text-[#999]" title="Preview"><Eye size={16}/></button>
                  <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-all ml-2 shadow-lg active:scale-95">
                    <Download size={14} /> EXPORT
                  </button>
                </div>
              </div>

              {/* 3c. Editor Area */}
              <div className="flex-1 relative font-mono text-sm overflow-hidden flex">
                 <div className="w-12 bg-[#1e1e1e] border-r border-[#333] text-[#858585] text-right pr-2 pt-4 flex flex-col gap-1 select-none">
                   {[...Array(40)].map((_, i) => <div key={i}>{i+1}</div>)}
                 </div>
                 <div 
                   className="flex-1 p-4 whitespace-pre outline-none overflow-auto custom-scrollbar text-[#d4d4d4]" 
                   contentEditable 
                   suppressContentEditableWarning={true}
                   spellCheck="false"
                 >
                    <span className="text-blue-400"># </span>{activeFile.name}<br/>
                    <br/>
                    <span className="text-gray-500">{activeFile.content || '// Start typing...'}</span>
                 </div>
              </div>
            </>
          ) : (
            /* 4. Editor Placeholder View (Empty State) */
            <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] text-[#555] select-none">
              <div className="flex flex-col items-center gap-6 opacity-40 animate-pulse">
                <div className="relative">
                   <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20" />
                   <Code2 size={80} strokeWidth={1} />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold tracking-tight mb-2">LexiCode Workspace</h2>
                  <p className="text-sm">Select a file from the explorer to begin editing</p>
                </div>
              </div>
              <div className="mt-12 flex gap-8 text-[11px] font-bold uppercase tracking-widest text-[#444]">
                <div className="flex items-center gap-2"><Layout size={14} /> Design-First</div>
                <div className="flex items-center gap-2"><Zap size={14} /> AI Enhanced</div>
                <div className="flex items-center gap-2"><Download size={14} /> Ready to Export</div>
              </div>
            </div>
          )}
        </main>
      </div>

      {contextMenu && (
        <ContextMenu {...contextMenu} onClose={() => setContextMenu(null)} onAction={(t) => handleAction(t, contextMenu.node)} />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 5px; border: 2px solid #1e1e1e; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
}