import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  FolderOpen, 
  FileCode, 
  FileJson, 
  FileText, 
  Settings, 
  Cpu, 
  Menu,
  Terminal
} from 'lucide-react';

const App = () => {
  // --- Simulation Data ---
  const projectData = [
    {
      name: "README.md",
      type: "markdown",
      icon: <FileText size={14} className="text-blue-400" />,
      content: "# Modern Web Project\n\nThis project was scaffolded by your AI Agent.\n\n## Getting Started\n1. Install dependencies\n2. Run development server\n3. Start creating!",
      summary: "Created the project documentation (README.md)."
    },
    {
      name: "app.js",
      type: "javascript",
      icon: <FileCode size={14} className="text-yellow-400" />,
      content: "import { config } from './config.js';\n\nconst init = () => {\n  console.log('Initializing ' + config.appName);\n  console.log('Environment: ' + config.env);\n};\n\ninit();",
      summary: "Generated the main application entry point (app.js)."
    },
    {
      name: "config.json",
      type: "json",
      icon: <FileJson size={14} className="text-gray-400" />,
      content: "{\n  \"appName\": \"Visionary-v1\",\n  \"version\": \"1.0.0\",\n  \"env\": \"development\",\n  \"features\": [\n    \"ai-integration\",\n    \"fast-render\"\n  ]\n}",
      summary: "Setup configuration schema (config.json)."
    }
  ];

  // --- State ---
  const [messages, setMessages] = useState([
    { role: 'user', text: "Muhamad: can you create a project scaffolding for a modern web app? Include a README, a main entry point, and a configuration file." }
  ]);
  const [explorerFiles, setExplorerFiles] = useState([]);
  const [activeTabs, setActiveTabs] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [editorContent, setEditorContent] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [streamingChatText, setStreamingChatText] = useState("");
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingChatText]);

  // --- Helper: Type in Chat ---
  const typeInChat = async (text, role = 'agent', isSummary = false) => {
    let current = "";
    for (let i = 0; i < text.length; i++) {
      current += text[i];
      setStreamingChatText(current);
      await new Promise(r => setTimeout(r, 15));
    }
    setMessages(prev => [...prev, { role, text, isSummary }]);
    setStreamingChatText("");
  };

  // --- Helper: Ghost Write File ---
  const ghostWrite = async (index) => {
    const file = projectData[index];
    
    // 1. Update Explorer & Tabs
    setExplorerFiles(prev => [...prev, { ...file, status: 'writing' }]);
    setActiveTabs(prev => {
      const resetTabs = prev.map(t => ({ ...t, active: false }));
      return [...resetTabs, { ...file, active: true }];
    });
    setCurrentFileIndex(index);

    // 2. Typing Logic
    let currentBody = "";
    const totalDuration = 4000; // ~4 seconds per file
    const charDelay = Math.max(10, totalDuration / file.content.length);

    for (let i = 0; i < file.content.length; i++) {
      currentBody += file.content[i];
      setEditorContent(currentBody);
      await new Promise(r => setTimeout(r, charDelay + Math.random() * 15));
    }

    // 3. Mark Complete
    setExplorerFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'done' } : f));
    await typeInChat(file.summary);
    await new Promise(r => setTimeout(r, 800));
  };

  // --- Main Simulation Trigger ---
  const startSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    await typeInChat("Understood, Muhamad. I'm initializing the workspace and creating the directory structure now...");
    await new Promise(r => setTimeout(r, 1000));

    for (let i = 0; i < projectData.length; i++) {
      await ghostWrite(i);
    }

    await typeInChat("Task completed successfully. I have scaffolded the 3 core files for your application. You can now begin development.", 'agent', true);
    setIsSimulating(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Navbar */}
      <header className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-[#161b22] shrink-0">
        <div className="flex items-center gap-4">
          <Menu size={18} className="text-gray-400" />
          <span className="text-sm font-semibold flex items-center gap-2">
            <Cpu size={16} className="text-blue-400" />
            Muhamad's Agentic Workspace
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] uppercase tracking-wider bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-800/50 font-bold">
            Agent: Online
          </div>
          <Settings size={18} className="text-gray-400" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-[#0d1117] flex flex-col shrink-0">
          <div className="p-3 text-[10px] font-bold uppercase text-gray-500 tracking-widest">Explorer</div>
          <div className="flex-1 overflow-y-auto text-sm">
            <div className="px-4 py-1 flex items-center gap-2 text-gray-300 font-semibold hover:bg-[#21262d] cursor-pointer">
              <ChevronDown size={14} />
              <FolderOpen size={16} className="text-blue-400" />
              scaffold-project
            </div>
            {explorerFiles.map((file, i) => (
              <div 
                key={i} 
                className={`pl-10 pr-4 py-1 flex items-center gap-2 text-sm transition-colors ${file.status === 'writing' ? 'animate-pulse text-blue-400 bg-blue-400/5' : 'text-gray-400 hover:bg-[#21262d]'}`}
              >
                {file.icon}
                {file.name}
              </div>
            ))}
          </div>
        </aside>

        {/* Editor */}
        <main className="flex-1 flex flex-col bg-[#0d1117] min-w-0">
          <div className="flex bg-[#161b22] border-b border-gray-800 overflow-x-auto shrink-0">
            {activeTabs.map((tab, i) => (
              <div 
                key={i} 
                className={`px-4 py-2 text-xs border-r border-gray-800 flex items-center gap-2 shrink-0 transition-colors ${tab.active ? 'bg-[#0d1117] border-b-2 border-b-[#f78166] text-white' : 'text-gray-500'}`}
              >
                {tab.icon}
                {tab.name}
              </div>
            ))}
          </div>
          
          <div className="flex-1 relative overflow-auto font-mono text-sm leading-relaxed">
            <div className="absolute left-0 top-0 w-12 text-right pr-4 pt-4 text-gray-600 select-none">
              {editorContent.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="ml-12 p-4 whitespace-pre-wrap text-[#e6edf3]">
              {editorContent}
              {isSimulating && currentFileIndex !== -1 && (
                <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse align-middle" />
              )}
            </div>
          </div>
        </main>

        {/* Chat Panel */}
        <aside className="w-80 border-l border-gray-800 bg-[#0d1117] flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-800 bg-[#161b22] font-semibold text-sm flex items-center justify-between">
            <span className="flex items-center gap-2"><Terminal size={14} /> AI Assistant</span>
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-blue-500 animate-pulse' : 'bg-gray-600'}`}></span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm custom-scrollbar">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-lg border ${msg.role === 'user' ? 'bg-[#161b22] border-gray-800' : msg.isSummary ? 'bg-blue-900/10 border-blue-800/50' : 'bg-gray-800/30 border-transparent'}`}
              >
                <p className={`text-[10px] font-bold uppercase mb-1 ${msg.role === 'user' ? 'text-gray-500' : 'text-blue-400'}`}>
                  {msg.role === 'user' ? 'Muhamad' : 'Agent'}
                </p>
                <p className="text-gray-200 leading-normal">{msg.text}</p>
              </div>
            ))}
            {streamingChatText && (
              <div className="bg-gray-800/30 p-3 rounded-lg border border-transparent">
                <p className="text-[10px] font-bold uppercase mb-1 text-blue-400">Agent</p>
                <p className="text-gray-200 leading-normal">
                  {streamingChatText}
                  <span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse" />
                </p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-800 bg-[#161b22]">
            <button 
              onClick={startSimulation}
              disabled={isSimulating}
              className={`w-full py-2.5 rounded text-sm font-semibold transition-all ${
                isSimulating 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              }`}
            >
              {isSimulating ? "Agent Working..." : "Trigger Agent Simulation"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;