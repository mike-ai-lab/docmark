# AI Preview System - Minimal Ghost Preview Design

## Overview
Completely redesigned to be **minimal and non-intrusive**. No large modal dialogs. Just ghost preview in the editor and preview pane with three small inline buttons.

## How It Works

### 1. Ghost Preview in Editor
- Selected text is replaced with AI-generated preview
- Green left border (3px) indicates preview mode
- Subtle green background highlighting
- Original content is preserved (can be undone)

### 2. Ghost Preview in Preview Pane
- Preview pane shows the rendered preview
- Slightly reduced opacity (0.85) to indicate it's a preview
- Green left border for visual consistency
- Shows exactly how the content will look

### 3. Inline Control Buttons
Three small buttons appear in the top-right corner of the editor:

- **✕ (Red)** - Discard preview and undo changes
- **↻ (Orange)** - Regenerate with AI (get a different version)
- **✓ (Green)** - Confirm and apply changes

### 4. Keyboard Shortcuts
- **Escape** - Discard preview
- **Ctrl+Enter** - Confirm and apply

## Visual Design

### Button Styling
- 32x32px square buttons
- Minimal, clean appearance
- Color-coded for quick recognition
- Hover effects for interactivity
- Positioned at top-right of editor

### Ghost Preview Styling
- Green accent color (#22c55e)
- 10% opacity background
- 3px left border
- Non-intrusive and easy to dismiss

### Dark Theme
- Automatically adapts to dark theme
- Maintains color contrast and readability
- Consistent with editor theme

## User Flow

1. **Select text** in editor
2. **Click AI action** (Fix Code, Improve Code, etc.)
3. **See ghost preview** in both editor and preview pane
4. **Choose action**:
   - Click ✓ to apply
   - Click ✕ to discard
   - Click ↻ to regenerate
5. **Changes applied** or discarded

## Technical Implementation

### Files
- `src/ai/ai-preview-system.js` - Core preview logic
- `src/ai/ai-preview.css` - Minimal styling
- `src/ai/ai-panel-ui.js` - Integration

### Key Features
- No modal dialogs
- Non-blocking interface
- Preserves editor state
- Undo support
- Keyboard shortcuts
- Dark theme support
- Minimal CSS footprint

## Benefits

✅ **Non-intrusive** - Doesn't hide the interface
✅ **Fast** - Instant preview without dialogs
✅ **Intuitive** - Three simple buttons
✅ **Reversible** - Easy to undo with Escape
✅ **Minimal** - Lightweight implementation
✅ **Professional** - Clean, polished design
