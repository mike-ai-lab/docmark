# 🚀 Single-File App Setup (No Backend Required!)

## ✅ What Changed

LexiCode now runs as a **single-file app** - no separate backend server needed! The Groq API is called directly from the browser.

---

## 📋 Setup Instructions

### 1. Create `.env` file in `frontend/` folder

```bash
cd frontend
copy .env.example .env
```

### 2. Edit `.env` and add your Groq API key

```env
VITE_GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

Get your API key from: https://console.groq.com/keys

### 3. Start the app with ONE command

```bash
# From the root folder (lexicode-workspace)
START-APP.bat
```

That's it! The app will open at **http://localhost:5173**

---

## 🎯 What You Need to Do

### Update `useDemoStore.js` to call Groq directly

Replace the `chatWithAI` and `fetchAvailableModels` functions in `frontend/src/store/useDemoStore.js`:

```javascript
// Add at the top of the file after imports
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const GROQ_MODELS = {
    'llama-3.3-70b': 'llama-3.3-70b-versatile',
    'llama-3.1-70b': 'llama-3.1-70b-versatile',
    'llama-3.1-8b': 'llama-3.1-8b-instant',
    'mixtral-8x7b': 'mixtral-8x7b-32768',
    'gemma-7b': 'gemma-7b-it',
    'gemma2-9b': 'gemma2-9b-it'
};

const SYSTEM_PROMPT = `You are an AI coding assistant integrated into LexiCode Workspace.

Your capabilities:
1. **Conversational**: Chat naturally with users about their projects
2. **Context-Aware**: Remember conversation history
3. **Code Editing**: Edit files when asked
4. **File Creation**: Create new files with professional content
5. **Helpful**: Provide suggestions and best practices

Response Format - ALWAYS respond with valid JSON:
{
  "action": "chat" | "edit" | "create",
  "message": "Your conversational response",
  "changes": {
    "summary": "Brief summary (only for edit/create)",
    "files": [
      {
        "name": "filename.ext",
        "type": "file extension",
        "path": "folder/filename.ext",
        "content": "complete file content (for create)",
        "patches": [{"op": "replace", "find": "old", "replace": "new"}] (for edit)
      }
    ]
  }
}

CRITICAL RULES:
- NEVER return empty content
- For spreadsheets: Use .csv format with headers and 5-10 rows
- For documents: Use .md format with complete structure (min 200 chars)
- For HTML: Include complete <!DOCTYPE>, <html>, <head>, <body>
- For code: Include complete, working code with comments
- Content must be production-ready, not placeholders
- ALWAYS include "path" field for files in folders
- Use .csv for spreadsheets (NOT .xlsx)
- Use .md for documents (NOT .docx)`;

// Replace the fetchAvailableModels function
fetchAvailableModels: async () => {
    const models = Object.keys(GROQ_MODELS).map(key => ({
        id: key,
        name: key.toUpperCase().replace(/-/g, ' ')
    }));
    set({ availableModels: models });
},

// Replace the chatWithAI function
chatWithAI: async (userMessage) => {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY not found. Please add it to frontend/.env file');
    }
    
    // Ensure there's an active chat session
    if (!get().activeChatSession) {
        console.log('📝 [CHAT] No active session, creating one...');
        get().createNewChatSession();
    }
    
    const { files, activeFileId, selectedModel, conversationHistory, fileTree, findNodeInTree } = get();
    const activeFile = activeFileId ? findNodeInTree(fileTree, activeFileId) : null;
    
    get().addToConversation('user', userMessage);
    
    try {
        // Build context message
        let contextMessage = '';
        if (activeFile) {
            contextMessage = `\n\nCurrent File Context:\nFile: ${activeFile.name}\nType: ${activeFile.type}\nContent:\n${activeFile.content || '(empty file)'}`;
        }
        
        const cleanHistory = conversationHistory.map(({ role, content }) => ({ role, content }));
        
        // Call Groq API directly
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODELS[selectedModel] || GROQ_MODELS['llama-3.3-70b'],
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...cleanHistory,
                    { role: 'user', content: userMessage },
                    { role: "system", content: contextMessage }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_tokens: 8192
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const responseData = await response.json();
        const data = JSON.parse(responseData.choices[0].message.content);
        
        // Update token usage
        if (responseData.usage) {
            set((state) => ({
                tokenUsage: {
                    prompt: state.tokenUsage.prompt + (responseData.usage.prompt_tokens || 0),
                    completion: state.tokenUsage.completion + (responseData.usage.completion_tokens || 0),
                    total: state.tokenUsage.total + (responseData.usage.total_tokens || 0)
                }
            }));
        }
        
        // Modify AI message tense for file creation actions
        let aiMessage = data.message;
        if (data.action === 'create' && data.createdFiles) {
            aiMessage = aiMessage
                .replace(/I've created/gi, "I'll create")
                .replace(/I have created/gi, "I will create")
                .replace(/I've generated/gi, "I'll generate")
                .replace(/I have generated/gi, "I will generate")
                .replace(/Created/gi, "Creating")
                .replace(/Generated/gi, "Generating");
        }
        
        // Add message BEFORE starting file creation
        get().addToConversation('assistant', aiMessage);
        get().saveChatSessions();
        
        // Continue with file creation/editing logic (keep existing code)
        if (data.action === 'edit' && data.changes?.files?.[0]?.patches && activeFile) {
            const patches = data.changes.files[0].patches;
            let updatedContent = activeFile.content || '';
            
            patches.forEach(patch => {
                if (patch.op === 'replace') {
                    updatedContent = updatedContent.replace(patch.find, patch.replace);
                }
            });
            
            await get().updateFileContent(activeFileId, updatedContent);
        } else if (data.action === 'create' && data.changes?.files) {
            // Keep existing file creation logic...
            // (The rest of the file creation code stays the same)
        }
        
    } catch (error) {
        console.error('AI Error:', error);
        get().addToConversation('assistant', `Error: ${error.message}`);
        throw error;
    }
},
```

---

## 🎉 Benefits

1. ✅ **No backend server needed** - runs entirely in browser
2. ✅ **One command to start** - just run `START-APP.bat`
3. ✅ **Simpler deployment** - just deploy the frontend folder
4. ✅ **No port conflicts** - only uses port 5173
5. ✅ **Faster startup** - no need to wait for backend

---

## 🔒 Security Note

The Groq API key is stored in `.env` file and accessed via `import.meta.env.VITE_GROQ_API_KEY`. 

**Important**: 
- Never commit `.env` to git (it's in `.gitignore`)
- For production, use environment variables on your hosting platform
- The API key is exposed in the browser, so use Groq's rate limiting and monitoring

---

## 🚀 Next Steps

1. Create `frontend/.env` file with your Groq API key
2. Update `useDemoStore.js` with the code above
3. Run `START-APP.bat`
4. Test the AI features!

---

## 📝 Files Modified

- ✅ Created `START-APP.bat` - Single command to start app
- ✅ Created `frontend/.env.example` - Template for API key
- 📝 Need to update `frontend/src/store/useDemoStore.js` - Add Groq direct integration

---

## ❓ Troubleshooting

### "GROQ_API_KEY not found"
- Make sure you created `frontend/.env` file
- Make sure the key starts with `VITE_` (required for Vite)
- Restart the dev server after adding the key

### "API error: 401"
- Your Groq API key is invalid
- Get a new key from https://console.groq.com/keys

### Port 5173 already in use
- Stop any other Vite servers
- Or change the port in `frontend/vite.config.js`
