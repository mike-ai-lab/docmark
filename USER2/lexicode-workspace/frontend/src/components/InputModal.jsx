import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function InputModal({ 
    visible, 
    title, 
    placeholder, 
    defaultValue = '', 
    onConfirm, 
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef(null);

    useEffect(() => {
        if (visible) {
            setValue(defaultValue);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [visible, defaultValue]);

    if (!visible) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            onConfirm(value.trim());
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#2d2d30] border border-gray-600 rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-700 rounded transition"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full bg-[#1e1e1e] border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            disabled={!value.trim()}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm py-2 rounded transition"
                        >
                            {confirmText}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded transition"
                        >
                            {cancelText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
