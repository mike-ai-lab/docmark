import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Cpu, Trash2, Copy, RotateCcw, Check, Plus, History, X } from 'lucide-react';
import { useDemoStore } from '../store/useDemoStore';

export default function AiPanel() {
    const [prompt, setPrompt] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [copyStatus, setCopyStatus] = useState(null);
    const [pendingRestore, setPendingRestore] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const chatEndRef = useRef(null);

    const {
        selectedModel,
        setSelectedModel,
        conversationHistory,
        tokenUsage,
        resetTokenUsage,
        availableModels,
        fetchAvailableModels,
        chatWithAI,
        files,
        activeFileId,
        chatSessions,
        activeChatSession,
        createNewChatSession,
        loadChatSession,
        deleteChatSession,
        saveChatSessions
    } = useDemoStore();

    const activeFile = files.find(f => f.id === activeFileId);

    useEffect(() => {
        fetchAvailableModels();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationHistory]);

    const handleAiSubmit = async () => {
        if (!prompt.trim() || isProcessing) return;

        setIsProcessing(true);
        const userMessage = prompt;
        setPrompt("");

        try {
            await chatWithAI(userMessage);
        } catch (error) {
            console.error('AI Error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus(idx);
            setTimeout(() => setCopyStatus(null), 2000);
        }).catch(err => {
            console.error('Copy failed', err);
        });
    };

    const confirmRestore = () => {
        if (pendingRestore !== null) {
            const newHistory = conversationHistory.slice(0, pendingRestore + 1);
            useDemoStore.setState({ conversationHistory: newHistory });
            saveChatSessions();
            setPendingRestore(null);
        }
    };

    const handleNewChat = () => {
        createNewChatSession();
        setShowHistory(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#252526] text-gray-200 relative overflow-hidden rounded-lg">
            {/* AI Panel Header - Aligned with Editor Header */}
            <div className="h-10 bg-[#2d2d30] flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold">AI Assistant</span>
                    <div className="h-3 w-[1px] bg-gray-700 mx-1" />
                    <span className="text-xs text-purple-400 font-mono">{tokenUsage.total.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-1 hover:bg-gray-700 rounded transition"
                        title="Chat History"
                    >
                        <History className="w-3 h-3 text-gray-400" />
                    </button>
                    <button
                        onClick={handleNewChat}
                        className="p-1 hover:bg-gray-700 rounded transition"
                        title="New Chat"
                    >
                        <Plus className="w-3 h-3 text-green-400" />
                    </button>
                    {conversationHistory.length > 0 && (
                        <button
                            onClick={resetTokenUsage}
                            className="p-1 hover:bg-gray-700 rounded transition"
                            title="Reset Token Counter"
                        >
                            <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Chat History Sidebar */}
            {showHistory && (
                <div className="absolute top-10 left-0 right-0 bg-[#1e1e1e] z-20 max-h-64 overflow-y-auto rounded-b-lg">
                    <div className="p-2">
                        <div className="flex items-center justify-between mb-2 px-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase">Chat History</span>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="p-1 hover:bg-gray-700 rounded"
                            >
                                <X className="w-3 h-3 text-gray-400" />
                            </button>
                        </div>
                        {chatSessions.length === 0 ? (
                            <div className="text-xs text-gray-500 p-2 text-center">No chat history</div>
                        ) : (
                            chatSessions.map(session => (
                                <div
                                    key={session.id}
                                    className={`flex items-center justify-between p-2 rounded mb-1 group ${
                                        activeChatSession === session.id
                                            ? 'bg-purple-600/20 border border-purple-600/30'
                                            : 'hover:bg-gray-700'
                                    }`}
                                >
                                    <button
                                        onClick={() => {
                                            loadChatSession(session.id);
                                            setShowHistory(false);
                                        }}
                                        className="flex-1 text-left text-xs"
                                    >
                                        <div className="font-medium">{session.name}</div>
                                        <div className="text-gray-500 text-[10px]">
                                            {new Date(session.createdAt).toLocaleString()}
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => deleteChatSession(session.id)}
                                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-700 rounded transition"
                                    >
                                        <Trash2 className="w-3 h-3 text-red-400" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Model Selection */}
            <div className="px-4 py-2 bg-[#1e1e1e]">
                <div className="relative flex items-center">
                    <Cpu className="absolute left-2 w-3 h-3 text-gray-500" />
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-[#252526] border border-gray-700 pl-8 pr-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-purple-500 rounded appearance-none cursor-pointer"
                    >
                        {availableModels && availableModels.length > 0 ? (
                            availableModels.map(model => (
                                <option key={model.id} value={model.id}>{model.name}</option>
                            ))
                        ) : (
                            <>
                                <option value="llama-3.3-70b">LLAMA 3.3 70B</option>
                                <option value="llama-3.1-70b">LLAMA 3.1 70B</option>
                                <option value="llama-3.1-8b">LLAMA 3.1 8B (Fast)</option>
                                <option value="mixtral-8x7b">Mixtral 8x7B</option>
                                <option value="gemma-7b">Gemma 7B</option>
                                <option value="gemma2-9b">Gemma2 9B</option>
                            </>
                        )}
                    </select>
                </div>
                {activeFile && (
                    <div className="mt-1 text-[10px] text-gray-500">
                        Context: {activeFile.name}
                    </div>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                {conversationHistory.length === 0 ? (
                    <div className="opacity-30 mt-20 text-center space-y-2">
                        <Sparkles className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                        <p className="text-sm font-medium text-gray-400">Start a conversation</p>
                        <p className="text-xs text-gray-500">Ask questions, request edits, or create files</p>
                    </div>
                ) : (
                    conversationHistory.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group`}>
                            <div className={`max-w-[85%] p-3 rounded-lg text-xs relative ${
                                msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-[#1e1e1e] text-gray-300 border border-gray-700 rounded-tl-none'
                            }`}>
                                {msg.role === 'assistant' && (
                                    <Sparkles className="w-3 h-3 inline-block mr-1 text-purple-400" />
                                )}
                                <span className="whitespace-pre-wrap">{msg.content}</span>

                                {/* Message Actions */}
                                <div className="absolute -bottom-6 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => copyToClipboard(msg.content, idx)}
                                        className="text-[10px] text-gray-500 hover:text-blue-400 flex items-center space-x-1 bg-[#252526] px-2 py-1 rounded border border-gray-700"
                                        title="Copy text"
                                    >
                                        {copyStatus === idx ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                    {msg.role === 'assistant' && (
                                        <button
                                            onClick={() => setPendingRestore(idx)}
                                            className="text-[10px] text-gray-500 hover:text-yellow-500 flex items-center space-x-1 bg-[#252526] px-2 py-1 rounded border border-gray-700"
                                            title="Restore to this point"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-3 left-3 right-3 space-y-2 pointer-events-none">
                {/* Restore Confirmation */}
                {pendingRestore !== null && (
                    <div className="bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 rounded-lg p-2 flex items-center justify-between pointer-events-auto">
                        <div className="flex items-center space-x-2">
                            <RotateCcw className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs font-medium text-yellow-200">Restore to this checkpoint?</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setPendingRestore(null)}
                                className="px-2 py-1 text-xs text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRestore}
                                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-black text-xs font-bold rounded flex items-center space-x-1"
                            >
                                <Check className="w-3 h-3" />
                                <span>Confirm</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-2 flex items-center space-x-2 pointer-events-auto">
                    <textarea
                        className="flex-1 bg-transparent border-none p-2 text-xs text-white placeholder-gray-500 focus:outline-none resize-none max-h-24 leading-tight"
                        rows="1"
                        placeholder="Ask anything or request changes..."
                        value={prompt}
                        onChange={(e) => {
                            setPrompt(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAiSubmit();
                            }
                        }}
                        disabled={pendingRestore !== null}
                    />
                    <button
                        onClick={handleAiSubmit}
                        disabled={!prompt.trim() || isProcessing || pendingRestore !== null}
                        className="p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded transition-all flex-shrink-0"
                    >
                        {isProcessing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
