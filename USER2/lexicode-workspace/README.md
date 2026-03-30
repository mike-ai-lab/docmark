# LexiCode Workspace

A powerful AI-assisted document creation and editing workspace with support for multiple file formats, real-time preview, and professional export capabilities.

## 🌟 Features

### 📝 Multi-Format Document Creation
- **16 File Types Supported**:
  - Documents: TXT, Markdown, DOCX
  - Spreadsheets: CSV, XLSX
  - Web: HTML, CSS, JavaScript, JSON, SVG, XML
  - Programming: Python, Java, C++, SQL, YAML

### 🤖 AI-Powered Assistant (Groq)
- **Two Modes**:
  - **Edit Mode**: Modify existing files with natural language
  - **Create Mode**: Generate complete files from scratch
- **Multi-File Creation**: Create entire projects with one prompt
- **Smart Content Generation**: Professional, production-ready content
- **Token Usage Tracking**: Monitor your API consumption in real-time

### ✨ Advanced Editor Features
- **Monaco Editor**: VS Code's powerful editor engine
- **Real-Time Preview**: Live preview for Markdown, HTML, SVG, XML, JSON
- **Auto-Save**: Automatic saving to localStorage
- **Split View**: Edit and preview side-by-side with 500ms debounce
- **Syntax Highlighting**: Support for all major languages

### 🎨 Professional Editing Tools
- **Copy/Paste/Clear**: Full clipboard integration
- **Undo/Redo**: Complete edit history (Ctrl+Z, Ctrl+Y)
- **Smart Formatting**: Language-specific formatting
- **File Management**: Projects and files organization

### 📤 Export Capabilities
- **PDF**: Professional PDF documents
- **DOCX**: Microsoft Word format
- **XLSX**: Excel spreadsheets
- **CSV**: Comma-separated values
- **TXT**: Plain text

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Groq API Key (set as environment variable `GROQ_API_KEY`)

### Installation

1. **Clone or navigate to the project**:
```bash
cd USER2/lexicode-workspace
```

2. **Install dependencies**:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Set up environment variables**:
```bash
# Windows (PowerShell)
$env:GROQ_API_KEY="your-groq-api-key-here"

# Windows (CMD)
set GROQ_API_KEY=your-groq-api-key-here

# Linux/Mac
export GROQ_API_KEY=your-groq-api-key-here
```

### Running the Application

**Option 1: Use the batch files (Windows)**
```bash
# Start backend
start-backend.bat

# Start frontend (in another terminal)
start-frontend.bat
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3005

## 📖 Usage Guide

### Creating Files Manually

1. Click the **folder+** icon to create a new project
2. Click the **file+** icon to create a new file
3. Select from 16 file types
4. Start editing with Monaco Editor

### Using AI to Create Files

1. **Switch to Create Mode** in the AI panel
2. **Describe what you want**:
   ```
   "Create a project with BOQ in DOCX and quotation in Excel"
   "Generate a business plan with 3 sections"
   "Create an invoice template in Excel"
   ```
3. **AI generates everything** - files are created automatically

### Editing Files with AI

1. **Select a file** from the sidebar
2. **Switch to Edit Mode** in the AI panel
3. **Request changes**:
   ```
   "Add a summary section at the top"
   "Create a table with 5 columns"
   "Add error handling to this function"
   ```

### Preview & Export

1. **Toggle Preview**: Click the eye icon for supported formats
2. **Export**: Click Export dropdown and choose format
3. **Monitor Tokens**: Check usage in AI panel

## 🎯 AI Models Available

- **LLAMA 3.3 70B** - Most capable, best quality
- **LLAMA 3.1 70B** - High quality, versatile
- **LLAMA 3.1 8B** - Fast, efficient
- **MIXTRAL 8X7B** - Balanced performance
- **GEMMA 7B** - Lightweight
- **GEMMA2 9B** - Enhanced lightweight

## 🔧 Technical Stack

### Frontend
- **React 18** with Vite
- **Monaco Editor** - VS Code editor
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library
- **marked** - Markdown parsing
- **DOMPurify** - HTML sanitization
- **jsPDF** - PDF generation
- **xlsx** - Excel handling
- **papaparse** - CSV parsing

### Backend
- **Node.js** with Express
- **Groq SDK** - AI integration
- **CORS** - Cross-origin support
- **dotenv** - Environment variables

## 📁 Project Structure

```
lexicode-workspace/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiPanel.jsx          # AI assistant interface
│   │   │   ├── EditorContainer.jsx  # Monaco editor wrapper
│   │   │   ├── FileTree.jsx         # File/project browser
│   │   │   ├── Header.jsx           # Top toolbar
│   │   │   └── PreviewPanel.jsx     # Live preview
│   │   ├── contexts/
│   │   │   └── EditorContext.jsx    # Editor state
│   │   ├── store/
│   │   │   └── useDemoStore.js      # Zustand store
│   │   ├── utils/
│   │   │   └── exportUtils.js       # Export functions
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── services/
│   │   └── ai.service.js            # Groq AI integration
│   ├── utils/
│   │   └── export.js                # Server-side exports
│   ├── index.js                     # Express server
│   └── package.json
├── start-backend.bat
├── start-frontend.bat
└── README.md
```

## 🎨 Keyboard Shortcuts

- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Ctrl+C**: Copy
- **Ctrl+V**: Paste
- **Ctrl+Enter**: Submit AI prompt
- **Ctrl+S**: Auto-save (automatic)

## 💡 Tips & Best Practices

### AI Usage
- Be specific in your prompts for better results
- Use Create mode for new projects
- Use Edit mode for refining existing content
- Monitor token usage to manage API costs

### File Management
- Organize files into projects
- Use descriptive file names
- Export regularly to backup your work

### Performance
- Preview has 500ms debounce for smooth editing
- Auto-save triggers after content changes
- Token counter helps track API usage

## 🐛 Troubleshooting

### AI Not Working
- Check that `GROQ_API_KEY` is set in environment variables
- Verify backend server is running on port 3005
- Check browser console for errors

### Preview Not Showing
- Ensure file type supports preview (MD, HTML, SVG, XML, JSON)
- Click the eye icon to toggle preview
- Check that content is valid for the file type

### Export Failing
- Verify backend server is running
- Check file content is valid
- Try different export format

### Scrolling Issues Fixed
- Editor and preview now have proper overflow handling
- Split view maintains scrolling in both panels
- No need to refresh after toggling preview

## 📊 Token Usage

The AI panel shows real-time token usage:
- **Total**: Combined prompt + completion tokens
- **Prompt**: Input tokens (your requests)
- **Completion**: Output tokens (AI responses)
- **Reset**: Click × to clear counter

Typical usage:
- Simple edits: 100-500 tokens
- File creation: 500-2000 tokens
- Complex projects: 2000-8000 tokens

## 🔐 Security

- All data stored locally in browser (localStorage)
- No data sent to external servers except Groq API
- Groq API key stored in system environment variables
- HTML preview sandboxed in iframe

## 📝 License

This project is for educational and personal use.

## 🤝 Contributing

This is a personal project. Feel free to fork and modify for your needs.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify environment variables are set
4. Ensure both servers are running

## 🎉 Acknowledgments

- **Monaco Editor** - Microsoft
- **Groq** - AI inference
- **React** - Facebook
- **Vite** - Evan You
- **Tailwind CSS** - Adam Wathan

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Status**: Production Ready ✅
