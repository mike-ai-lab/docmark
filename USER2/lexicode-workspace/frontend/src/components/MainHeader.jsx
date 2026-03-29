import React, { useState } from 'react';
import { FileText, MessageSquare, LogOut, User, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useDemoStore } from '../store/useDemoStore';
import { logOut } from '../lib/firebase';

export default function MainHeader() {
    const { aiPanelOpen, toggleAiPanel, fileTreeOpen, toggleFileTree, user } = useDemoStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await logOut();
            setShowUserMenu(false);
        } catch (error) {
            console.error('Logout error:', error);
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
            </div>
            
            {/* Right: AI Toggle & User Avatar */}
            <div className="flex items-center space-x-3">
                {/* AI Assistant Toggle */}
                <button
                    onClick={toggleAiPanel}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs transition ${
                        aiPanelOpen 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    title={aiPanelOpen ? 'Hide AI Assistant' : 'Show AI Assistant'}
                >
                    <MessageSquare className="w-3 h-3" />
                    <span>AI Assistant</span>
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
                                    // Fallback to gradient if image fails to load
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
