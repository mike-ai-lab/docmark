# Groq AI Integration Guide

## Overview

LexiCode Workspace now uses **Groq** for ultra-fast AI-powered semantic editing instead of OpenAI. Groq provides lightning-fast inference with multiple open-source models.

## Available Models

The application supports 6 Groq models that you can switch between:

### 1. **Llama 3.3 70B Versatile** (Default)
- **Model ID**: `llama-3.3-70b`
- **Best for**: Complex code editing, detailed instructions
- **Speed**: Fast
- **Quality**: Excellent

### 2. **Llama 3.1 70B Versatile**
- **Model ID**: `llama-3.1-70b`
- **Best for**: General purpose editing
- **Speed**: Fast
- **Quality**: Excellent

### 3. **Llama 3.1 8B Instant** ⚡
- **Model ID**: `llama-3.1-8b`
- **Best for**: Quick edits, simple tasks
- **Speed**: Ultra-fast
- **Quality**: Good

### 4. **Mixtral 8x7B**
- **Model ID**: `mixtral-8x7b`
- **Best for**: Balanced performance
- **Speed**: Fast
- **Quality**: Very Good

### 5. **Gemma 7B IT**
- **Model ID**: `gemma-7b`
- **Best for**: Lightweight tasks
- **Speed**: Very Fast
- **Quality**: Good

### 6. **Gemma2 9B IT**
- **Model ID**: `gemma2-9b`
- **Best for**: Improved Gemma performance
- **Speed**: Very Fast
- **Quality**: Very Good

## Setup Instructions

### Option 1: Using System Environment Variable (Recommended)

Since you already have `GROQ_API_KEY` in your system environment variables:

1. The backend will automatically read it from your system
2. No additional configuration needed
3. Just restart the backend if it was running before you set the variable

### Option 2: Using .env File

If the system environment variable is not set, you can add it to the `.env` file:

1. Open `server/.env`
2. Add your Groq API key:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
3. Restart the backend server

## Getting a Groq API Key

If you don't have a Groq API key yet:

1. Go to https://console.groq.com/
2. Sign up for a free account
3. Navigate to API Keys section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)
6. Add it to your system environment variables or `.env` file

### Free Tier Limits

Groq offers generous free tier:
- 14,400 requests per day
- 30 requests per minute
- Perfect for development and testing

## Using the Model Selector

### In the Application

1. Open LexiCode Workspace at http://localhost:5173
2. Look at the AI Assistant panel (right sidebar)
3. You'll see a "Model" dropdown at the top
4. Select your preferred model from the list
5. Your selection is saved automatically

### Model Selection Tips

- **For complex refactoring**: Use Llama 3.3 70B or Llama 3.1 70B
- **For quick fixes**: Use Llama 3.1 8B Instant
- **For balanced performance**: Use Mixtral 8x7B
- **For lightweight tasks**: Use Gemma models

## Testing the Integration

### 1. Check Backend Connection

Open your browser to: http://localhost:3001/api/ai/models

You should see:
```json
{
  "models": [
    {"id": "llama-3.3-70b", "name": "LLAMA 3.3 70B", "model": "llama-3.3-70b-versatile"},
    ...
  ]
}
```

### 2. Test AI Editing

1. Open a file in the editor (e.g., index.html)
2. In the AI Assistant panel, type:
   ```
   Add a meta description tag in the head section
   ```
3. Click "Apply Semantic Edit"
4. Watch the AI modify your file!

### 3. Try Different Models

1. Select "LLAMA 3.1 8B (Fast)" from the dropdown
2. Try a simple edit
3. Notice the faster response time
4. Switch to "LLAMA 3.3 70B" for more complex tasks

## API Endpoint Reference

### GET /api/ai/models
Returns list of available Groq models.

**Response:**
```json
{
  "models": [
    {
      "id": "llama-3.3-70b",
      "name": "LLAMA 3.3 70B",
      "model": "llama-3.3-70b-versatile"
    }
  ]
}
```

### POST /api/ai/edit
Apply AI-powered semantic edits.

**Request:**
```json
{
  "fileId": "demo-file-1",
  "fileName": "index.html",
  "content": "<html>...</html>",
  "instruction": "Add a navigation bar",
  "modelId": "llama-3.3-70b"
}
```

**Response:**
```json
{
  "success": true,
  "updatedContent": "<html>... with navigation ...</html>",
  "patches": [...],
  "modelUsed": "llama-3.3-70b"
}
```

## Troubleshooting

### "GROQ_API_KEY not found in environment variables"

**Solution:**
1. Check if the environment variable is set:
   ```cmd
   echo %GROQ_API_KEY%
   ```
2. If empty, set it:
   ```cmd
   setx GROQ_API_KEY "gsk_your_key_here"
   ```
3. Restart your terminal and backend server

### "Rate limit exceeded"

**Solution:**
- You've hit the free tier limit (30 requests/minute)
- Wait a minute and try again
- Consider upgrading to Groq Pro for higher limits

### "Model not found"

**Solution:**
- The model ID might be incorrect
- Check available models at http://localhost:3001/api/ai/models
- Use one of the supported model IDs

### Backend not connecting to Groq

**Solution:**
1. Check your internet connection
2. Verify API key is valid
3. Check backend logs for detailed error messages
4. Ensure you're using the latest groq-sdk version

## Performance Comparison

| Model | Speed | Quality | Best Use Case |
|-------|-------|---------|---------------|
| Llama 3.3 70B | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Complex refactoring |
| Llama 3.1 70B | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | General editing |
| Llama 3.1 8B | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Quick fixes |
| Mixtral 8x7B | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Balanced tasks |
| Gemma 7B | ⚡⚡⚡⚡ | ⭐⭐⭐ | Lightweight |
| Gemma2 9B | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Improved Gemma |

## Example Prompts

### HTML Editing
```
Add a responsive navigation bar with logo and 3 menu items
Create a footer with social media icons
Add a hero section with background image
```

### JavaScript Editing
```
Add error handling to the fetch request
Create a debounce function for the search input
Add JSDoc comments to all functions
```

### CSS Editing
```
Add dark mode styles using CSS variables
Make the layout responsive for mobile devices
Add smooth transitions to all interactive elements
```

### Markdown Editing
```
Add a table of contents at the top
Format all code blocks with proper syntax highlighting
Add badges for build status and version
```

## Advanced Configuration

### Custom Model Parameters

You can modify the AI service to adjust model parameters:

Edit `server/services/ai.service.js`:

```javascript
const response = await groq.chat.completions.create({
    model: model,
    messages: [...],
    response_format: { type: "json_object" },
    temperature: 0.7,      // Adjust creativity (0.0 - 1.0)
    max_tokens: 4096,      // Adjust response length
    top_p: 1.0,            // Nucleus sampling
    frequency_penalty: 0.0 // Reduce repetition
});
```

## Why Groq?

- **Speed**: 10-100x faster than traditional cloud AI
- **Cost**: Generous free tier, affordable pricing
- **Open Source**: Uses open-source models (Llama, Mixtral, Gemma)
- **Privacy**: Your code stays secure
- **Reliability**: High uptime and availability

## Support

For issues with:
- **Groq API**: https://console.groq.com/docs
- **LexiCode**: Check the main README.md
- **Model Selection**: Try different models for your use case

---

**Powered by Groq** 🚀
