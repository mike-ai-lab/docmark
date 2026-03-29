import React, { useEffect, useState } from 'react';
import { Folder, File, FolderPlus, FilePlus, ChevronRight, ChevronDown } from 'lucide-react';
import { useDemoStore } from '../store/useDemoStore';

export default function FileTree() {
    const { projects, files, activeFileId, currentProject, fetchProjects, openProject, setActiveFile, createProject, createFile } = useDemoStore();
    const [showNewProject, setShowNewProject] = useState(false);
    const [showNewFile, setShowNewFile] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const [newFileType, setNewFileType] = useState('txt');
    const [expandedFolders, setExpandedFolders] = useState({});

    useEffect(() => {
        fetchProjects();
    }, []);

    const toggleFolder = (folderPath) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderPath]: !prev[folderPath]
        }));
    };

    // Build folder structure from files
    const buildFileTree = (files) => {
        const tree = {};
        
        files.forEach(file => {
            const path = file.path || file.name;
            const parts = path.split('/');
            
            if (parts.length === 1) {
                // Root level file
                if (!tree['__files__']) tree['__files__'] = [];
                tree['__files__'].push(file);
            } else {
                // File in folder(s)
                let current = tree;
                for (let i = 0; i < parts.length - 1; i++) {
                    const folderName = parts[i];
                    if (!current[folderName]) {
                        current[folderName] = { __files__: [] };
                    }
                    current = current[folderName];
                }
                current.__files__.push(file);
            }
        });
        
        return tree;
    };

    // Render file tree recursively
    const renderFileTree = (files, level = 0) => {
        const tree = buildFileTree(files);
        const folders = Object.keys(tree).filter(key => key !== '__files__').sort();
        const rootFiles = tree['__files__'] || [];
        
        return (
            <>
                {/* Render folders first */}
                {folders.map(folderName => {
                    const folderPath = `${level}-${folderName}`;
                    const isExpanded = expandedFolders[folderPath] !== false; // Default to expanded
                    const folderNode = tree[folderName];
                    
                    return (
                        <div key={folderPath} className="mb-1">
                            <button
                                onClick={() => toggleFolder(folderPath)}
                                className="flex items-center space-x-1 w-full p-1 hover:bg-gray-700 rounded text-xs transition text-gray-300"
                                style={{ paddingLeft: `${level * 12 + 4}px` }}
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-3 h-3" />
                                ) : (
                                    <ChevronRight className="w-3 h-3" />
                                )}
                                <Folder className="w-3 h-3 text-yellow-400" />
                                <span>{folderName}</span>
                            </button>
                            {isExpanded && (
                                <div>
                                    {renderFolderContents(folderNode, level + 1)}
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {/* Render files */}
                {rootFiles.map(file => (
                    <button
                        key={file.id}
                        onClick={() => setActiveFile(file.id)}
                        className={`flex items-center space-x-2 w-full p-1.5 rounded text-xs transition ${
                            activeFileId === file.id
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-700 text-gray-300'
                        }`}
                        style={{ paddingLeft: `${level * 12 + 4}px` }}
                    >
                        <File className="w-3 h-3" />
                        <span>{file.name}</span>
                    </button>
                ))}
            </>
        );
    };

    // Render folder contents (subfolders and files)
    const renderFolderContents = (folderNode, level) => {
        const subfolders = Object.keys(folderNode).filter(key => key !== '__files__').sort();
        const files = folderNode.__files__ || [];
        
        return (
            <>
                {/* Render subfolders */}
                {subfolders.map(subfolderName => {
                    const folderPath = `${level}-${subfolderName}`;
                    const isExpanded = expandedFolders[folderPath] !== false;
                    const subfolderNode = folderNode[subfolderName];
                    
                    return (
                        <div key={folderPath} className="mb-1">
                            <button
                                onClick={() => toggleFolder(folderPath)}
                                className="flex items-center space-x-1 w-full p-1 hover:bg-gray-700 rounded text-xs transition text-gray-300"
                                style={{ paddingLeft: `${level * 12 + 4}px` }}
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-3 h-3" />
                                ) : (
                                    <ChevronRight className="w-3 h-3" />
                                )}
                                <Folder className="w-3 h-3 text-yellow-400" />
                                <span>{subfolderName}</span>
                            </button>
                            {isExpanded && (
                                <div>
                                    {renderFolderContents(subfolderNode, level + 1)}
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {/* Render files in this folder */}
                {files.map(file => (
                    <button
                        key={file.id}
                        onClick={() => setActiveFile(file.id)}
                        className={`flex items-center space-x-2 w-full p-1.5 rounded text-xs transition ${
                            activeFileId === file.id
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-700 text-gray-300'
                        }`}
                        style={{ paddingLeft: `${level * 12 + 4}px` }}
                    >
                        <File className="w-3 h-3" />
                        <span>{file.name}</span>
                    </button>
                ))}
            </>
        );
    };

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            createProject(newProjectName.trim());
            setNewProjectName('');
            setShowNewProject(false);
        }
    };

    const handleCreateFile = () => {
        if (newFileName.trim() && currentProject) {
            createFile(currentProject, newFileName.trim(), newFileType);
            setNewFileName('');
            setShowNewFile(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#252526] rounded-lg overflow-hidden">
            {/* File Tree Header - Aligned with Editor Header */}
            <div className="h-10 bg-[#2d2d30] flex items-center justify-between px-3 flex-shrink-0">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Projects
                </h2>
                <button
                    onClick={() => setShowNewProject(!showNewProject)}
                    className="p-1 hover:bg-gray-700 rounded transition"
                    title="New Project"
                >
                    <FolderPlus className="w-4 h-4 text-blue-400" />
                </button>
            </div>

            {showNewProject && (
                <div className="p-2 bg-gray-800">
                    <input
                        type="text"
                        placeholder="Project name..."
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                        className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                        autoFocus
                    />
                    <div className="flex space-x-1 mt-1">
                        <button
                            onClick={handleCreateProject}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => setShowNewProject(false)}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-2">
                {projects.length === 0 ? (
                    <div className="text-xs text-gray-500 p-2">
                        No projects found. Create one above.
                    </div>
                ) : (
                    projects.map(project => {
                        const projectFiles = files.filter(f => f.project_id === project.id);
                        const isOpen = currentProject === project.id;
                        
                        return (
                            <div key={project.id} className="mb-2">
                                <div className="flex items-center justify-between group">
                                    <button
                                        onClick={() => openProject(project.id)}
                                        className="flex items-center space-x-2 flex-1 p-2 hover:bg-gray-700 rounded text-sm transition"
                                    >
                                        <Folder className="w-4 h-4 text-blue-400" />
                                        <span>{project.name}</span>
                                    </button>
                                    {isOpen && (
                                        <button
                                            onClick={() => setShowNewFile(!showNewFile)}
                                            className="p-1 mr-1 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded transition"
                                            title="New File"
                                        >
                                            <FilePlus className="w-3 h-3 text-green-400" />
                                        </button>
                                    )}
                                </div>
                                
                                {isOpen && showNewFile && (
                                    <div className="ml-4 p-2 bg-gray-800 rounded mb-2">
                                        <input
                                            type="text"
                                            placeholder="File name..."
                                            value={newFileName}
                                            onChange={(e) => setNewFileName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
                                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 mb-1"
                                            autoFocus
                                        />
                                        <select
                                            value={newFileType}
                                            onChange={(e) => setNewFileType(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 mb-1"
                                        >
                                            <option value="txt">Text (.txt)</option>
                                            <option value="md">Markdown (.md)</option>
                                            <option value="docx">Word Document (.docx)</option>
                                            <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                                            <option value="csv">CSV (.csv)</option>
                                            <option value="html">HTML (.html)</option>
                                            <option value="css">CSS (.css)</option>
                                            <option value="js">JavaScript (.js)</option>
                                            <option value="json">JSON (.json)</option>
                                            <option value="svg">SVG (.svg)</option>
                                            <option value="xml">XML (.xml)</option>
                                            <option value="py">Python (.py)</option>
                                            <option value="java">Java (.java)</option>
                                            <option value="cpp">C++ (.cpp)</option>
                                            <option value="yaml">YAML (.yaml)</option>
                                            <option value="sql">SQL (.sql)</option>
                                        </select>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={handleCreateFile}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 rounded"
                                            >
                                                Create
                                            </button>
                                            <button
                                                onClick={() => setShowNewFile(false)}
                                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {isOpen && projectFiles.length > 0 && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        {renderFileTree(projectFiles)}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
