# DocMark AI Assistant - Complete Implementation Plan

## Overview
Integration of multi-provider AI assistant into DocMark with chat interface, quick actions, and local data persistence.

---

## Design Principles

✅ **Match DocMark's Style**: Clean, minimal, professional  
✅ **No Emojis**: Text-only labels  
✅ **Brand Colors**: Blue gradient (#2563eb to #3b82f6)  
✅ **Consistent UI**: Match existing panels and buttons  
✅ **Local Storage**: Save preferences and chat history  

---

## UI Components

### 1. AI Assistant Button (Header)
**Location**: Header center, in button group  
**Style**: Standard btn-item matching existing buttons  
**Label**: "AI Assistant"  
**Action**: Opens floating AI panel

### 2. AI Panel (Floating)
**Location**: Floats on top-right of preview pane  
**Style**: White background, subtle shadow, rounded corners  
**Components**:
- Provider dropdown (9 providers)
- Quick action buttons (5 actions)
- "Open AI Chat" button

### 3. AI Chat Panel (Side Panel)
**Location**: Replaces/uses syntax guide panel position  
**Style**: Full-height side panel with divider  
**Components**:
- Chat header with provider selector
- Message history area
- Input textarea with send button

### 4. Settings Integration
**Location**: Existing settings modal  
**New Section**: "AI Assistant Settings"  
**Fields**:
- Default provider selector
- API keys for all 9 providers (with test buttons)
- Streaming toggle
- Auto-save toggle
- Token usage toggle
- Chat history toggle
- Keyboard shortcuts reference

---

## File Structure

```
src/
├── ai/
│   ├── ai-manager.js          # Main orchestrator
│   ├── ai-providers.js        # All 9 provider implementations
│   ├── ai-panel-ui.js         # Floating panel component
│   ├── ai-chat-ui.js          # Chat interface component
│   ├── ai-prompts.js          # Prompt templates
│   └── ai-storage.js          # LocalStorage management
├── main.js                     # Import AI modules
public/css/
├── ai-assistant.css           # AI UI styles (matches DocMark style)
```

---

## Supported AI Providers

1. **OpenAI** - GPT-4, GPT-3.5-turbo
2. **Anthropic Claude** - Claude 3.5 Sonnet, Opus
3. **Cerebras** - Llama models (fast inference)
4. **Groq** - Ultra-fast inference
5. **Mistral AI** - Mistral Large, Medium
6. **OpenRouter** - Unified access to multiple models
7. **Google AI Studio** - Gemini Pro, Flash
8. **Cohere** - Command models
9. **Hugging Face** - Inference API

---

## LocalStorage Schema

### AI Settings
```javascript
{
  "com.markdownlivepreview.ai_settings": {
    "defaultProvider": "openai",
    "apiKeys": {
      "openai": "sk-...",
      "claude": "sk-ant-...",
      "cerebras": "csk-...",
      "groq": "gsk-...",
      "mistral": "...",
      "openrouter": "sk-or-...",
      "google": "...",
      "cohere": "...",
      "huggingface": "hf_..."
    },
    "streaming": true,
    "autoSave": true,
    "showTokenUsage": false,
    "saveChatHistory": true
  }
}
```

### Chat History
```javascript
{
  "com.markdownlivepreview.ai_chat_history": [
    {
      "id": "uuid-1",
      "timestamp": 1234567890,
      "provider": "cerebras",
      "messages": [
        {
          "role": "user",
          "content": "Help me write a README",
          "timestamp": 1234567890
        },
        {
          "role": "assistant",
          "content": "Here's a professional README template...",
          "timestamp": 1234567891
        }
      ]
    }
  ]
}
```

### User Preferences
```javascript
{
  "com.markdownlivepreview.ai_preferences": {
    "panelPosition": "right",
    "chatPanelWidth": 400,
    "lastUsedProvider": "cerebras",
    "favoriteActions": ["improve", "grammar"],
    "autoOpenChat": false
  }
}
```

---

## Features

### Quick Actions
1. **Improve Text** - Enhance clarity and professionalism
2. **Fix Grammar** - Correct grammar and spelling
3. **Expand** - Add more detail and context
4. **Summarize** - Condense to key points
5. **Generate Content** - Create new content from prompt

### Chat Features
- Natural language commands
- Multi-turn conversations
- Context-aware responses
- Streaming responses
- Message history (persistent)
- Export chat as markdown
- Clear history option

### Editor Integration
- Replace selected text
- Insert at cursor
- Append to document
- Full undo/redo support
- Preserve markdown formatting

---

## Implementation Phases

### Phase 1: Core Infrastructure (Session 1)
**Files**: `ai-providers.js`, `ai-manager.js`, `ai-storage.js`

**Tasks**:
- Create unified provider interface
- Implement all 9 providers with streaming
- API key management
- LocalStorage utilities
- Error handling

**Deliverables**:
- Working provider abstraction
- API key storage/retrieval
- Test utilities

---

### Phase 2: AI Panel UI (Session 2)
**Files**: `ai-panel-ui.js`, `ai-assistant.css`

**Tasks**:
- Build floating panel component
- Provider selector dropdown
- Quick action buttons
- Integration with main.js
- Keyboard shortcuts (Ctrl+K)

**Deliverables**:
- Functional AI panel
- Styled to match DocMark
- Opens/closes smoothly

---

### Phase 3: Chat Interface (Session 3)
**Files**: `ai-chat-ui.js`, update `ai-assistant.css`

**Tasks**:
- Build chat panel component
- Message rendering
- Input handling
- Streaming message display
- Chat history persistence
- Export chat feature

**Deliverables**:
- Working chat interface
- Persistent history
- Smooth UX

---

### Phase 4: AI Features (Session 4)
**Files**: `ai-prompts.js`, update `ai-manager.js`

**Tasks**:
- Implement quick actions
- Prompt engineering
- Context extraction
- Response formatting
- Editor integration

**Deliverables**:
- All 5 quick actions working
- Seamless editor updates
- Undo/redo support

---

### Phase 5: Settings & Polish (Session 5)
**Files**: Update `main.js`, `index.html`

**Tasks**:
- Add AI section to settings modal
- API key management UI
- Test buttons for each provider
- Preferences UI
- Error messages
- Loading states
- Documentation

**Deliverables**:
- Complete settings integration
- User-friendly error handling
- Comprehensive documentation

---

## API Provider Details

### OpenAI
```javascript
{
  endpoint: "https://api.openai.com/v1/chat/completions",
  models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
  streaming: true,
  headers: {
    "Authorization": "Bearer sk-...",
    "Content-Type": "application/json"
  }
}
```

### Anthropic Claude
```javascript
{
  endpoint: "https://api.anthropic.com/v1/messages",
  models: ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229"],
  streaming: true,
  headers: {
    "x-api-key": "sk-ant-...",
    "anthropic-version": "2023-06-01",
    "Content-Type": "application/json"
  }
}
```

### Cerebras
```javascript
{
  endpoint: "https://api.cerebras.ai/v1/chat/completions",
  models: ["llama3.1-8b", "llama3.1-70b"],
  streaming: true,
  headers: {
    "Authorization": "Bearer csk-...",
    "Content-Type": "application/json"
  }
}
```

### Groq
```javascript
{
  endpoint: "https://api.groq.com/openai/v1/chat/completions",
  models: ["llama-3.1-70b-versatile", "mixtral-8x7b-32768"],
  streaming: true,
  headers: {
    "Authorization": "Bearer gsk-...",
    "Content-Type": "application/json"
  }
}
```

### Mistral AI
```javascript
{
  endpoint: "https://api.mistral.ai/v1/chat/completions",
  models: ["mistral-large-latest", "mistral-medium-latest"],
  streaming: true,
  headers: {
    "Authorization": "Bearer ...",
    "Content-Type": "application/json"
  }
}
```

### OpenRouter
```javascript
{
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  models: ["openai/gpt-4", "anthropic/claude-3.5-sonnet"],
  streaming: true,
  headers: {
    "Authorization": "Bearer sk-or-...",
    "Content-Type": "application/json"
  }
}
```

### Google AI Studio
```javascript
{
  endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  models: ["gemini-pro", "gemini-pro-vision"],
  streaming: true,
  headers: {
    "Content-Type": "application/json"
  },
  queryParams: {
    "key": "..."
  }
}
```

### Cohere
```javascript
{
  endpoint: "https://api.cohere.ai/v1/chat",
  models: ["command", "command-light"],
  streaming: true,
  headers: {
    "Authorization": "Bearer ...",
    "Content-Type": "application/json"
  }
}
```

### Hugging Face
```javascript
{
  endpoint: "https://api-inference.huggingface.co/models/{model}",
  models: ["meta-llama/Llama-2-70b-chat-hf"],
  streaming: false,
  headers: {
    "Authorization": "Bearer hf_...",
    "Content-Type": "application/json"
  }
}
```

---

## Keyboard Shortcuts

- **Ctrl+K** - Open AI Assistant panel
- **Ctrl+Shift+K** - Open AI Chat
- **Ctrl+Shift+I** - Improve selected text
- **Ctrl+Shift+G** - Fix grammar
- **Ctrl+Shift+E** - Expand selected text
- **Ctrl+Shift+S** - Summarize selected text
- **Esc** - Close AI panel/chat

---

## Error Handling

### API Errors
- Invalid API key → Show error, prompt to check settings
- Rate limit → Show message, suggest switching provider
- Network error → Retry with exponential backoff
- Timeout → Cancel request, show message

### User Errors
- No text selected → Show message "Please select text first"
- Empty chat message → Disable send button
- No API key → Prompt to add in settings

---

## Testing Checklist

### Provider Testing
- [ ] OpenAI connection and streaming
- [ ] Claude connection and streaming
- [ ] Cerebras connection and streaming
- [ ] Groq connection and streaming
- [ ] Mistral connection and streaming
- [ ] OpenRouter connection and streaming
- [ ] Google AI connection and streaming
- [ ] Cohere connection and streaming
- [ ] Hugging Face connection

### Feature Testing
- [ ] Improve text action
- [ ] Fix grammar action
- [ ] Expand action
- [ ] Summarize action
- [ ] Generate content action
- [ ] Chat interface
- [ ] Streaming responses
- [ ] Chat history persistence
- [ ] Settings save/load
- [ ] Keyboard shortcuts

### UI Testing
- [ ] Panel opens/closes smoothly
- [ ] Chat panel integrates properly
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Loading states
- [ ] Error messages

---

## Success Criteria

✅ All 9 providers working with streaming  
✅ Quick actions functional and fast  
✅ Chat interface smooth and intuitive  
✅ Chat history persists across sessions  
✅ Settings save and load correctly  
✅ No breaking changes to existing features  
✅ Clean, maintainable code  
✅ Comprehensive error handling  
✅ Matches DocMark's design language  

---

## Timeline

**Total**: ~2 hours of focused development

- Session 1: 30 min (Core infrastructure)
- Session 2: 20 min (AI panel UI)
- Session 3: 25 min (Chat interface)
- Session 4: 25 min (AI features)
- Session 5: 20 min (Settings & polish)

---

## Next Steps

1. Review and approve this plan
2. Confirm mockup design (ai-assistant-mockup.html)
3. Begin Session 1: Core Infrastructure

**Ready to proceed?**
