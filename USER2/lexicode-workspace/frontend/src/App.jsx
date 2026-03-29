import React, { useEffect } from 'react';
import FileTree from './components/FileTree';
import EditorContainer from './components/EditorContainer';
import AiPanel from './components/AiPanel';
import MainHeader from './components/MainHeader';
import Auth from './components/Auth';
import { EditorProvider } from './contexts/EditorContext';
import { useDemoStore } from './store/useDemoStore';
import { onAuthChange } from './lib/firebase';

export default function App() {
  const { aiPanelOpen, fileTreeOpen, user, setUser } = useDemoStore();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
    });
    
    return () => unsubscribe();
  }, [setUser]);

  // Show auth screen if not logged in
  if (!user) {
    return <Auth />;
  }

  return (
    <EditorProvider>
      <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-white overflow-hidden p-2 gap-2">
        {/* Main Header - Always visible, unaffected by panels */}
        <MainHeader />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden gap-2">
          {/* Left Sidebar: File Tree - 300px with smooth slide */}
          <aside 
            className={`bg-[#252526] rounded-lg transition-all duration-300 ease-in-out ${
              fileTreeOpen ? 'w-[300px]' : 'w-0'
            }`}
            style={{ 
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <div className="w-[300px] h-full">
              <FileTree />
            </div>
          </aside>

          {/* Center: Editor */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#252526] rounded-lg">
            <EditorContainer />
          </main>

          {/* Right Sidebar: AI Assistant - 400px with smooth slide */}
          <aside 
            className={`bg-[#252526] rounded-lg transition-all duration-300 ease-in-out ${
              aiPanelOpen ? 'w-[400px]' : 'w-0'
            }`}
            style={{ 
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <div className="w-[400px] h-full">
              <AiPanel />
            </div>
          </aside>
        </div>
      </div>
    </EditorProvider>
  );
}
