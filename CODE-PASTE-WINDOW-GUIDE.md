# Code Paste Window - Quick Reference

## Overview
A minimizable floating window that lets you paste code directly and render it instantly without saving files or uploading.

## Features

### ✅ Quick Paste & Render
- Paste HTML, CSS, or JavaScript code
- Auto-renders on paste
- No file saving needed
- Instant preview

### ✅ Minimizable Window
- Minimize to header only (saves space)
- Expand when needed
- Stays in bottom-right corner
- Doesn't clutter the UI

### ✅ Easy Controls
- **Render** button - Manually render code
- **Clear** button - Clear all code
- **Minimize** button (−) - Collapse window
- **Close** button (×) - Hide window

## How to Use

### 1. Open the Window
- Window appears automatically on page load
- Located in bottom-right corner
- Or use keyboard shortcut: **Ctrl+Shift+P**

### 2. Paste Code
- Click in the textarea
- Paste your code (Ctrl+V)
- Auto-renders on paste

### 3. View Preview
- Preview appears below the editor
- Shows rendered HTML/CSS/JavaScript
- Updates in real-time

### 4. Minimize When Done
- Click the **−** button to minimize
- Window collapses to header only
- Click again to expand
- Keeps your workspace clean

### 5. Close When Not Needed
- Click the **×** button to close
- Window hides completely
- Use Ctrl+Shift+P to reopen

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+Shift+P** | Toggle minimize/expand |
| **Ctrl+V** | Paste code (auto-renders) |

## Supported Code Types

### HTML
```html
<div>
  <h1>Hello World</h1>
  <p>This renders as HTML</p>
</div>
```

### HTML + CSS
```html
<style>
  body { background: #f0f0f0; }
  h1 { color: blue; }
</style>
<h1>Styled Content</h1>
```

### HTML + JavaScript
```html
<button onclick="alert('Hello!')">Click Me</button>
```

### Plain Text/Code
Non-HTML code displays as formatted text

## Window States

### Expanded
- Full editor and preview visible
- 500px × 600px
- Ready for editing

### Minimized
- Only header visible
- 300px × auto
- Content hidden
- Saves screen space

### Hidden
- Window completely closed
- Use Ctrl+Shift+P to reopen

## Design Features

✅ **Non-intrusive** - Floats in corner, doesn't block content
✅ **Responsive** - Adapts to mobile screens
✅ **Dark theme** - Automatically matches editor theme
✅ **Smooth animations** - Slide-in and minimize effects
✅ **Secure** - Iframe sandbox for HTML rendering
✅ **Lightweight** - Minimal CSS and JavaScript

## Tips

💡 **Auto-render** - Paste code and it renders automatically
💡 **Minimize** - Keep window minimized when not actively editing
💡 **Multiple pastes** - Paste different code snippets to test
💡 **Clear** - Use Clear button to start fresh
💡 **Keyboard** - Use Ctrl+Shift+P for quick toggle

## Technical Details

- Uses iframe for safe HTML rendering
- Sandbox mode prevents script injection
- Supports all modern browsers
- Works with light and dark themes
- Responsive design for mobile
