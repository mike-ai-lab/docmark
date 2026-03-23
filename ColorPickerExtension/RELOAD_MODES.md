# Dev Wand - Simple Reload Guide

## What This Extension Does

Helps you refresh your web app while keeping your important data safe (API keys, chat history, uploaded files, etc.)

## The Three Reload Modes

### 🟢 Quick Refresh (Recommended)
**What it does:** Just reloads the page  
**What you keep:** Everything - API keys, chats, models, all your data  
**Use this when:** 
- You changed some code and want to see it
- Testing your app normally
- You want the fastest reload

### 🟡 Fresh Assets
**What it does:** Gets fresh copies of your HTML, CSS, and JavaScript files  
**What you keep:** API keys, chats, models, all your data  
**Use this when:**
- Your HTML changes aren't showing up
- CSS styles look wrong or outdated
- You want to make sure you're seeing the latest version of your files

### 🔴 Deep Clean
**What it does:** Clears all cached files and background processes  
**What you keep:** API keys, chats, models, all your data  
**Use this when:**
- Fresh Assets mode didn't work
- Something seems really stuck
- You need the most thorough refresh (but still keep your data)

## The Buttons

### Hot Reload Button
- Uses whichever mode you selected above
- The floating green/yellow/red button does the same thing
- Button color shows which mode is active

### Clear Old Files Button
- Clears cached files without reloading
- Keeps all your data safe
- Good for cleaning up without interrupting your work

### Reset Everything Button ⚠️
- **WARNING**: This deletes EVERYTHING
- You'll lose API keys, chat history, uploaded files, models
- Only use this if something is really broken
- You'll need to set everything up again from scratch

## What You Should Know

**All three reload modes keep your data safe:**
- ✅ API keys stay in settings
- ✅ Chat history is preserved
- ✅ Uploaded documents and embeddings stay
- ✅ Downloaded models (like Transformers) stay cached
- ✅ All your settings remain

**Only "Reset Everything" deletes your data** - and it asks for confirmation first!

## Quick Tips

1. **Start with Quick Refresh** (green) - it's fast and safe
2. **Use Fresh Assets** (yellow) when your HTML/CSS changes don't show
3. **Use Deep Clean** (red) only if Fresh Assets didn't work
4. **Avoid Reset Everything** unless you really need to start over

## For Your ConstructLM App

Perfect for testing because:
- Your 25MB Transformers model stays cached (no re-download)
- API keys stay in settings (no need to re-enter)
- Chat history is preserved
- Uploaded documents and embeddings stay
- You can refresh as many times as you want without losing anything
