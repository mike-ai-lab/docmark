import React, { useEffect, useState } from 'react';
import { 
    Edit2, Trash2, Copy, FolderPlus, FilePlus, 
    X, FolderOpen, Folder as FolderIcon
} from 'lucide-react';

export default function ContextMenu({ 
    visible, 
    x, 
    y, 
    items, 
    onClose 
}) {
    const [position, setPosition] = useState({ x, y });

    useEffect(() => {
        if (!visible) return;

        const handleClickOutside = () => onClose();
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        // Adjust position if menu would go off screen
        const menuWidth = 200;
        const menuHeight = items.length * 32 + 8;
        const adjustedX = x + menuWidth > window.innerWidth ? window.innerWidth - menuWidth - 10 : x;
        const adjustedY = y + menuHeight > window.innerHeight ? window.innerHeight - menuHeight - 10 : y;
        
        setPosition({ x: adjustedX, y: adjustedY });

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [visible, x, y, items.length, onClose]);

    if (!visible) return null;

    const getIcon = (iconName) => {
        const icons = {
            edit: Edit2,
            delete: Trash2,
            duplicate: Copy,
            newFolder: FolderPlus,
            newFile: FilePlus,
            close: X,
            closeOthers: X,
            closeAll: X,
            expand: FolderOpen,
            collapse: FolderIcon
        };
        const Icon = icons[iconName] || FilePlus;
        return <Icon className="w-4 h-4" />;
    };

    return (
        <div
            className="fixed z-50 bg-[#2d2d30] border border-gray-600 rounded shadow-lg py-1 min-w-[180px]"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            onClick={(e) => e.stopPropagation()}
        >
            {items.map((item, index) => (
                item.separator ? (
                    <div key={index} className="h-px bg-gray-600 my-1" />
                ) : (
                    <button
                        key={index}
                        onClick={() => {
                            item.onClick();
                            onClose();
                        }}
                        disabled={item.disabled}
                        className={`w-full flex items-center gap-3 px-3 py-1.5 text-xs text-left transition ${
                            item.disabled
                                ? 'text-gray-600 cursor-not-allowed'
                                : item.danger
                                ? 'text-red-400 hover:bg-red-900/30'
                                : 'text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {getIcon(item.icon)}
                        <span>{item.label}</span>
                    </button>
                )
            ))}
        </div>
    );
}
