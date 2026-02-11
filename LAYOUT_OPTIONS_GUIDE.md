# Layout Options Guide

## Overview

The Markdown Live Preview now supports flexible layout configurations to suit different workflows and screen sizes.

## Available Layout Options

### 1. Flip Panels (Horizontal Swap)

**Location:** Settings ▾ → Flip Panels

**Description:** Swaps the position of the editor and preview panels horizontally.

**States:**
- **Default (Unchecked):** Editor on left, Preview on right
- **Flipped (Checked):** Preview on left, Editor on right

**Use Cases:**
- Right-handed users who prefer the preview closer to their mouse
- Multi-monitor setups where you want the preview on a specific side
- Personal preference for reading flow

### 2. Vertical Layout

**Location:** Settings ▾ → Vertical Layout

**Description:** Changes the layout from side-by-side to top-and-bottom arrangement.

**States:**
- **Default (Unchecked):** Horizontal layout (side-by-side)
- **Vertical (Checked):** Vertical layout (stacked)

**Use Cases:**
- Ultrawide monitors where vertical space is more valuable
- Laptop screens with limited horizontal space
- When working with long documents where you want to see more content vertically

### 3. Combined Layouts

You can combine both options for four different layout configurations:

1. **Default:** Editor left, Preview right (horizontal)
2. **Flipped:** Preview left, Editor right (horizontal)
3. **Vertical:** Editor top, Preview bottom (vertical)
4. **Vertical + Flipped:** Preview top, Editor bottom (vertical)

## Features That Work in All Layouts

All core functionality works seamlessly across all layout configurations:

✅ **Sync Scroll** - Synchronized scrolling between editor and preview
✅ **Sync Cursor** - Cursor position highlighting in preview
✅ **Resizable Divider** - Drag to adjust panel sizes
  - Horizontal layouts: Drag left/right
  - Vertical layouts: Drag up/down
✅ **Double-click Divider** - Reset to 50/50 split
✅ **Dark Mode** - Consistent theming across all panels
✅ **All Export Functions** - PDF, HTML, Print
✅ **Copy/Paste/Undo** - All editing functions
✅ **Markdown Syntax Guide** - Available in horizontal layouts

## Layout-Specific Behavior

### Vertical Layout Notes

- **Syntax Guide Panel:** Hidden in vertical layout to maximize content space
- **Helper Panel:** Hidden in vertical layout for cleaner UI
- **Divider:** Changes from vertical bar to horizontal bar
- **Cursor:** Changes from `col-resize` to `row-resize` when dragging

### Horizontal Layout Notes

- **Syntax Guide Panel:** Available and resizable (250px - 600px)
- **Helper Panel:** Available for contextual tips
- **Cheatsheet Divider:** Separate resizable divider for syntax guide

## Keyboard Shortcuts

All existing keyboard shortcuts work in all layouts:
- Copy, Paste, Undo, Redo
- Monaco editor shortcuts (Ctrl+F for find, etc.)

## Persistence

Your layout preferences are automatically saved to localStorage and will persist across sessions:
- Flip Panels setting
- Vertical Layout setting
- Panel size ratios (maintained separately for horizontal and vertical)

## Technical Details

### CSS Classes

- `.split-container.flipped` - Applied when panels are flipped
- `.split-container.vertical` - Applied when in vertical layout
- Both classes can be combined for vertical + flipped

### Responsive Behavior

- Window resize automatically adjusts panel sizes proportionally
- Layout changes trigger Monaco editor resize for optimal rendering
- Smooth transitions (350ms) when toggling layouts

## Tips

1. **Try Vertical on Laptops:** Vertical layout often works better on laptop screens (16:9 or 16:10 aspect ratios)

2. **Use Flip for Multi-Monitor:** If your preview monitor is on the left, flip the panels for a more natural workflow

3. **Double-Click to Reset:** If your panels get misaligned, double-click the divider to reset to 50/50

4. **Combine with Dark Mode:** All layouts work perfectly with both light and dark themes

5. **Syntax Guide Resizing:** In horizontal mode, the syntax guide panel can be resized by dragging its left edge (up to 600px wide)

## Troubleshooting

**Issue:** Panels don't resize smoothly
- **Solution:** Ensure you're dragging the divider, not the panel content

**Issue:** Layout looks broken after toggling
- **Solution:** Try refreshing the page or double-clicking the divider to reset

**Issue:** Syntax guide disappeared
- **Solution:** Check if you're in vertical layout mode (syntax guide is hidden in vertical)

**Issue:** Settings not persisting
- **Solution:** Check browser localStorage permissions

## Future Enhancements

Potential future additions:
- Custom panel size presets
- Keyboard shortcuts for layout switching
- Three-panel vertical layout option
- Picture-in-picture preview mode
