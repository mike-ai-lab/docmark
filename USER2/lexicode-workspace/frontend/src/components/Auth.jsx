import React, { useState } from 'react';
import { LogIn, Sparkles, FileText, Zap, Shield } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export default function Auth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error('Sign in error:', err);
            setError(err.message || 'Failed to sign in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1e1e1e] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Logo and Title */}
                <div className="space-y-4">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/20">
                        <FileText className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        LexiCode Workspace
                    </h1>
                    <p className="text-gray-400 text-lg">
                        AI-powered document creation and editing
                    </p>
                </div>

                {/* Sign In Card */}
                <div className="bg-[#252526] p-8 rounded-2xl border border-gray-700 shadow-2xl">
                    <div className="space-y-6">
                        {/* Features */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-left p-3 bg-purple-900/10 rounded-xl border border-purple-900/20">
                                <Sparkles className="text-purple-400 shrink-0" size={20} />
                                <p className="text-xs text-purple-200">
                                    AI assistant with conversational context awareness
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-left p-3 bg-blue-900/10 rounded-xl border border-blue-900/20">
                                <Zap className="text-blue-400 shrink-0" size={20} />
                                <p className="text-xs text-blue-200">
                                    Create documents, spreadsheets, and code files
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-left p-3 bg-green-900/10 rounded-xl border border-green-900/20">
                                <Shield className="text-green-400 shrink-0" size={20} />
                                <p className="text-xs text-green-200">
                                    Secure cloud storage with Firebase
                                </p>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-lg">
                                <p className="text-xs text-red-300">{error}</p>
                            </div>
                        )}

                        {/* Sign In Button */}
                        <button
                            onClick={handleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </button>
                        
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                            Secure authentication via Firebase
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                    {[
                        { label: 'AI-Powered', color: 'purple' },
                        { label: 'Real-time', color: 'blue' },
                        { label: 'Secure', color: 'green' }
                    ].map((feature) => (
                        <div key={feature.label} className="text-center">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">
                                {feature.label}
                            </div>
                            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className={`h-full w-full bg-${feature.color}-600`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <p className="text-xs text-gray-600">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
