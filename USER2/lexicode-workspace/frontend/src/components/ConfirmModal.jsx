import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ 
    visible, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    danger = true,
    showDontAskAgain = false,
    onDontAskAgainChange
}) {
    const [dontAskAgain, setDontAskAgain] = useState(false);

    useEffect(() => {
        if (!visible) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') {
                if (showDontAskAgain && onDontAskAgainChange) {
                    onDontAskAgainChange(dontAskAgain);
                }
                onConfirm();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [visible, onConfirm, onCancel, dontAskAgain, showDontAskAgain, onDontAskAgainChange]);

    useEffect(() => {
        if (visible) {
            setDontAskAgain(false);
        }
    }, [visible]);

    if (!visible) return null;

    const handleConfirm = () => {
        if (showDontAskAgain && onDontAskAgainChange) {
            onDontAskAgainChange(dontAskAgain);
        }
        onConfirm();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#2d2d30] border border-gray-600 rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
                    <div className="flex items-center gap-2">
                        {danger && <AlertTriangle className="w-5 h-5 text-red-400" />}
                        <h3 className="text-sm font-semibold text-white">{title}</h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-700 rounded transition"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-sm text-gray-300">{message}</p>
                    
                    {showDontAskAgain && (
                        <label className="flex items-center gap-2 mt-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={dontAskAgain}
                                onChange={(e) => setDontAskAgain(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-400">Don't ask me again</span>
                        </label>
                    )}
                </div>

                <div className="flex gap-2 px-4 pb-4">
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 ${
                            danger 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        } text-white text-sm py-2 rounded transition`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded transition"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}
