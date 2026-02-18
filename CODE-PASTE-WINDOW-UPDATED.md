# Code Paste Window - Updated with Header Button

## What's New

### Header Button Integration
- **Code Paste button** now appears in the header (top-right area)
- Button shows when window is closed or minimized
- Button hides when window is open and expanded
- **Blue indicator** shows when window is minimized

## How It Works

### Window States

#### 1. **Expanded** (Window Open)
- Full editor and preview visible
- Header button is **hidden**
- Click minimize (−) to collapse

#### 2. **Minimized** (Collapsed)
- Only header visible
- Header button shows with **blue background** (indicator)
- Click button to expand or close

#### 3. **Closed** (Hidden)
- Window completely hidden
- Header button shows with **normal styling**
- Click button to reopen

## Usage Flow

### First Time
1. Window opens automatically on page load
2. Paste code into textarea
3. Auto-renders instantly

### When Done
1. Click **−** (minimize) button
2. Window collapses to header only
3. **Blue button** appears in header

### To Use Again
1. Click the **blue button** in header
2. Window expands back to full size
3. Continue editing

### To Close Completely
1. Click **×** (close) button
2. Window hides
3. **Gray button** appears in header

### To Reopen
1. Click the **gray button** in header
2. Window reopens with your code still there

## Button States

| State | Button | Location | Color |
|-------|--------|----------|-------|
| Expanded | Hidden | - | - |
| Minimized | Visible | Header | Blue |
| Closed | Visible | Header | Gray |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+Shift+P** | Toggle minimize/expand/close |
| **Ctrl+V** | Paste code (auto-renders) |

## Benefits

✅ **No Hidden Buttons** - Always accessible from header
✅ **Visual Indicator** - Blue shows minimized state
✅ **Space Saving** - Minimize when not actively editing
✅ **Quick Access** - One click to reopen
✅ **Non-intrusive** - Doesn't clutter the UI

## Tips

💡 **Minimize** - Keep minimized when not actively editing
💡 **Header Button** - Always visible for quick access
💡 **Blue Indicator** - Shows window is minimized
💡 **Keyboard** - Use Ctrl+Shift+P for quick toggle
💡 **Auto-render** - Paste code and it renders automatically
