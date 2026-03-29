# LexiCode Workspace - Quick Start

## ✅ Application is Ready!

Both servers are now running:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173

## 🚀 Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## 📝 Demo Mode Features

The application is running in **demo mode** with localStorage:
- ✅ No Supabase setup required
- ✅ No database configuration needed
- ✅ Sample project and files pre-loaded
- ✅ All data saved to browser localStorage
- ✅ Full Monaco Editor functionality

## 🎯 What You'll See

1. **Left Sidebar**: "Demo Project" with 2 sample files
   - index.html
   - README.md

2. **Center**: Monaco Editor (VS Code-like editor)

3. **Right Sidebar**: AI Assistant panel

## 🧪 Try These Features

### 1. Edit Files
- Click on "index.html" in the left sidebar
- Edit the HTML content in the Monaco editor
- Changes auto-save to localStorage

### 2. Switch Files
- Click on "README.md" to switch files
- Notice the editor language changes automatically

### 3. Export to DOCX
- Click the "Export" button in the header
- Downloads the current file as a Word document

### 4. AI Editing (Requires OpenAI API Key)
To enable AI features:
1. Get an OpenAI API key from https://platform.openai.com/
2. Edit `server/.env` and replace the placeholder:
   ```
   OPENAI_API_KEY=sk-your-real-key-here
   ```
3. Restart the backend server
4. Try AI commands like:
   - "Add a navigation bar with 3 links"
   - "Create a footer with copyright text"
   - "Add CSS styling for dark mode"

## 🔧 Managing the Servers

### Stop Servers
Press `Ctrl+C` in each terminal window

### Restart Backend
```cmd
cd USER2\lexicode-workspace\server
node index.js
```

### Restart Frontend
```cmd
cd USER2\lexicode-workspace\frontend
npm run dev
```

## 📂 Project Structure

```
lexicode-workspace/
├── server/              # Backend (Express + OpenAI)
│   ├── index.js         # Main server file
│   ├── services/        # AI service
│   └── utils/           # Export utilities
├── frontend/            # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── store/       # State management
│   │   └── App.jsx      # Main app
│   └── index.html
└── README.md            # Full documentation
```

## 🎨 Key Features

- **Monaco Editor**: Full VS Code editor experience
- **Syntax Highlighting**: Automatic language detection
- **Auto-save**: Changes saved to localStorage
- **File Management**: Multiple files per project
- **Export**: DOCX and Excel export support
- **AI Assistant**: Semantic code editing (with API key)

## 🐛 Troubleshooting

### Frontend won't load
- Check that port 5173 is not in use
- Clear browser cache and reload
- Check browser console (F12) for errors

### Backend errors
- Verify port 3001 is available
- Check `server/.env` file exists
- Review terminal output for error messages

### AI features not working
- Ensure you have a valid OpenAI API key
- Check you have credits in your OpenAI account
- Verify the backend server is running

## 📚 Next Steps

1. **Read the full documentation**: See `README.md`
2. **Setup Supabase** (optional): For multi-user support
3. **Customize the UI**: Edit React components
4. **Add more file types**: Extend language support

## 🎉 You're All Set!

The application is fully functional in demo mode. Enjoy exploring LexiCode Workspace!

For questions or issues, check the `SETUP-GUIDE.md` for detailed troubleshooting.
