import { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  FolderPlus, 
  Edit2, 
  Trash2, 
  FilePlus,
  Copy,
  Download
} from 'lucide-react';
import { useDemoStore } from '../store/useDemoStore';
import JSZip from 'jszip';

/**
 * FILE NODE COMPONENT
 * Renders a single file or folder node with expand/collapse animation
 */
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
        draggable 
        onDragStart={(e) => onDragStart(e, node.id)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e, node.id)}
        onClick={() => isFolder ? onToggle(node.id) : onSelect(node.id)}
        onContextMenu={(e) => onContextMenu(e, node)}
        className={`flex items-center py-[6px] pr-2 cursor-pointer transition-colors duration-150 ${
          isSelected ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-[#cccccc]'
        }`}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        <span className="mr-2 flex-shrink-0">
          {isFolder ? (
            <div className="flex items-center">
              {node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Folder 
                size={16} 
                className={`ml-1 ${node.isOpen ? 'text-blue-400' : 'text-gray-400'}`} 
                fill={node.isOpen ? "currentColor" : "none"} 
              />
            </div>
          ) : (
            <File size={16} className="ml-4 text-gray-400" />
          )}
        </span>

        {node.isEditing ? (
          <input
            ref={inputRef}
            className="bg-[#3c3c3c] border border-[#007acc] outline-none text-white px-1 w-full text-xs rounded-sm"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="truncate text-[13px] font-medium">
            {node.name || (isFolder ? 'New Folder' : 'New File')}
          </span>
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

/**
 * CONTEXT MENU COMPONENT
 * Right-click menu for file operations
 */
const ContextMenu = ({ x, y, onClose, onAction, node }) => {
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClick = (e) => { 
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); 
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const items = [
    { id: 'new-file', label: 'New File', icon: <FilePlus size={14} />, show: !node || node.type === 'folder' },
    { id: 'new-folder', label: 'New Folder', icon: <FolderPlus size={14} />, show: !node || node.type === 'folder' },
    { id: 'copy-path', label: 'Copy Relative Path', icon: <Copy size={14} />, show: !!node },
    { id: 'download', label: node?.type === 'folder' ? 'Download as ZIP' : 'Download', icon: <Download size={14} />, show: !!node },
    { id: 'rename', label: 'Rename', icon: <Edit2 size={14} />, show: !!node },
    { id: 'delete', label: 'Delete', icon: <Trash2 size={14} />, show: !!node, className: 'text-red-400' },
  ];

  return (
    <div 
      ref={menuRef} 
      className="fixed z-[100] bg-[#252526] border border-white/10 shadow-2xl py-1 min-w-[180px] rounded-lg text-sm text-[#cccccc] backdrop-blur-md"
      style={{ top: y, left: x }}
    >
      {items.filter(i => i.show).map(item => (
        <button 
          key={item.id} 
          onClick={(e) => { 
            e.stopPropagation(); 
            onAction(item.id); 
            onClose(); 
          }} 
          className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-[#37373d] transition-colors ${item.className || ''}`}
        >
          {item.icon} 
          <span className="flex-1 text-left">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

/**
 * EXPLORER PANEL COMPONENT
 * Main file tree explorer
 */
export default function ExplorerPanel() {
  const { 
    fileTree, 
    activeFileId, 
    setActiveFile,
    toggleNode,
    createNode,
    deleteNode,
    renameNode,
    moveNode,
    findNodeInTree
  } = useDemoStore();
  
  const [contextMenu, setContextMenu] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const handleToggle = (id) => {
    toggleNode(id);
  };

  const handleSelect = (id) => {
    console.log('🖱️ [EXPLORER CLICK] ========== START ==========');
    console.log('🖱️ [EXPLORER CLICK] Clicked node ID:', id);
    
    const node = findNodeInTree(fileTree, id);
    console.log('🖱️ [EXPLORER CLICK] Found node:', node ? `${node.name} (${node.type})` : 'NOT FOUND');
    
    if (!node) {
      console.warn('⚠️ [EXPLORER CLICK] Node not found!');
      return;
    }
    
    if (node.type === 'folder') {
      console.log('📁 [EXPLORER CLICK] Is folder, setting as selected');
      setSelectedFolderId(id);
    } else {
      // Any type that's not 'folder' is a file (md, js, json, txt, etc.)
      console.log('📄 [EXPLORER CLICK] Is file (type: ' + node.type + '), calling setActiveFile');
      setActiveFile(id);
    }
    
    console.log('🖱️ [EXPLORER CLICK] ========== END ==========');
  };

  // Get relative path for a node
  const getNodePath = (nodeId, tree = fileTree, currentPath = []) => {
    for (const node of tree) {
      if (node.id === nodeId) {
        return [...currentPath, node.name].join('/');
      }
      if (node.children) {
        const found = getNodePath(nodeId, node.children, [...currentPath, node.name]);
        if (found) return found;
      }
    }
    return null;
  };

  // Copy relative path to clipboard
  const copyRelativePath = async (node) => {
    const path = getNodePath(node.id);
    if (path) {
      try {
        await navigator.clipboard.writeText(path);
        console.log('📋 [COPY PATH] Copied to clipboard:', path);
      } catch (err) {
        console.error('❌ [COPY PATH] Failed to copy:', err);
      }
    }
  };

  // Download single file
  const downloadFile = (node) => {
    console.log('💾 [DOWNLOAD] Downloading file:', node.name);
    const content = node.content || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = node.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('✅ [DOWNLOAD] File downloaded successfully');
  };

  // Download folder as ZIP
  const downloadFolder = async (node) => {
    console.log('📦 [DOWNLOAD ZIP] Starting ZIP creation for folder:', node.name);
    const zip = new JSZip();
    
    // Recursively add files to ZIP
    const addToZip = (currentNode, zipFolder) => {
      if (currentNode.type === 'file') {
        const content = currentNode.content || '';
        zipFolder.file(currentNode.name, content);
        console.log('📄 [DOWNLOAD ZIP] Added file:', currentNode.name);
      } else if (currentNode.type === 'folder' && currentNode.children) {
        const subFolder = zipFolder.folder(currentNode.name);
        currentNode.children.forEach(child => addToZip(child, subFolder));
      }
    };

    // Add all children to ZIP (not the folder itself, just its contents)
    if (node.children) {
      node.children.forEach(child => {
        if (child.type === 'file') {
          zip.file(child.name, child.content || '');
          console.log('📄 [DOWNLOAD ZIP] Added file:', child.name);
        } else if (child.type === 'folder') {
          const subFolder = zip.folder(child.name);
          if (child.children) {
            child.children.forEach(subChild => addToZip(subChild, subFolder));
          }
        }
      });
    }

    try {
      console.log('🔄 [DOWNLOAD ZIP] Generating ZIP file...');
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${node.name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('✅ [DOWNLOAD ZIP] ZIP file downloaded successfully');
    } catch (err) {
      console.error('❌ [DOWNLOAD ZIP] Failed to create ZIP:', err);
    }
  };

  const handleAction = (type, targetNode) => {
    console.log('🎬 [ACTION]', type, 'on node:', targetNode?.name || 'root');
    console.log('📂 [ACTION] Selected folder ID:', selectedFolderId);
    
    if (type === 'new-file' || type === 'new-folder') {
      // Use targetNode if provided (right-click on folder)
      // Otherwise use selectedFolderId (last selected folder)
      // Otherwise use null (root)
      const parentId = targetNode?.id || selectedFolderId || null;
      console.log('📁 [ACTION] Creating in parent:', parentId);
      createNode(type === 'new-folder' ? 'folder' : 'file', parentId);
    } else if (type === 'copy-path') {
      copyRelativePath(targetNode);
    } else if (type === 'download') {
      if (targetNode.type === 'folder') {
        downloadFolder(targetNode);
      } else {
        downloadFile(targetNode);
      }
    } else if (type === 'rename') {
      renameNode(targetNode.id, null, true); // Start editing
    } else if (type === 'delete') {
      deleteNode(targetNode.id);
    }
  };

  const handleRename = (id, newName) => {
    if (newName === null) {
      // Cancel rename
      renameNode(id, null, false);
    } else {
      renameNode(id, newName, false);
    }
  };

  const onDragStart = (e, id) => {
    setDraggedId(id);
  };

  const onDrop = (e, targetId) => {
    if (draggedId && draggedId !== targetId) {
      moveNode(draggedId, targetId);
    }
    setDraggedId(null);
  };

  return (
    <aside className="w-64 bg-[#252526] border-r border-black/40 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 py-4 text-[11px] font-bold text-white/40 uppercase tracking-widest select-none">
        <span>Explorer</span>
        <div className="flex gap-1">
          <button 
            onClick={() => handleAction('new-file', null)} 
            title="New File" 
            className="hover:bg-[#37373d] p-1 rounded transition-colors text-white/60 hover:text-white"
          >
            <FilePlus size={14}/>
          </button>
          <button 
            onClick={() => handleAction('new-folder', null)} 
            title="New Folder" 
            className="hover:bg-[#37373d] p-1 rounded transition-colors text-white/60 hover:text-white"
          >
            <FolderPlus size={14}/>
          </button>
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        onContextMenu={(e) => { 
          e.preventDefault(); 
          setContextMenu({ x: e.clientX, y: e.clientY, node: null }); 
        }}
      >
        {fileTree.map(node => (
          <FileNode 
            key={node.id} 
            node={node} 
            depth={0} 
            onToggle={handleToggle} 
            onSelect={handleSelect} 
            selectedId={activeFileId} 
            onContextMenu={(e, node) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              setContextMenu({ x: e.clientX, y: e.clientY, node }); 
            }} 
            onRename={handleRename} 
            onDragStart={onDragStart} 
            onDrop={onDrop} 
          />
        ))}
      </div>

      {contextMenu && (
        <ContextMenu 
          {...contextMenu} 
          onClose={() => setContextMenu(null)} 
          onAction={(type) => handleAction(type, contextMenu.node)} 
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #333; 
          border-radius: 10px; 
          border: 3px solid #252526; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </aside>
  );
}
