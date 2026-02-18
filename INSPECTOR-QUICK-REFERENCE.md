# Inspector Quick Reference Card

## 🎯 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Alt+Q** | Cycle through stacked elements at cursor |
| **Ctrl+Click** | Multi-select elements |
| **Click** | Select single element |

## 🖱️ Mouse Actions

| Action | Result |
|--------|--------|
| **Hover** | Highlight deepest element (cyan outline) |
| **Click** | Select element (orange outline) |
| **Scroll** | Works normally (not blocked!) |
| **Ctrl+Drag** | Multi-select with box |

## 💾 Storage

| Feature | Status |
|---------|--------|
| Clipboard History | ✅ Auto-saved |
| Settings | ✅ Auto-saved |
| Max History | 10 items |
| Storage Key | `inspector_clipboard_history` |

### Storage API
```javascript
inspector.saveToStorage()      // Force save
inspector.clearStorage()       // Clear all
inspector.clipboardHistory     // Access history
```

## 🎨 Visual Indicators

| Color | Meaning |
|-------|---------|
| **Cyan dashed** | Hovering |
| **Orange solid** | Selected |
| **Blue solid** | Multi-selected |
| **Red dashed** | Locked |
| **Purple solid** | Grouped |

## 🔧 Common Tasks

### Select Deep Element
1. Hover over element
2. See element path in top-right
3. Click to select

### Select Stacked Element
1. Hover over stack
2. Press **Alt+Q** repeatedly
3. Cycles through all layers

### Check Storage Status
```javascript
// In console
console.log(inspector.clipboardHistory.length);
```

### Clear Storage
```javascript
// In console
inspector.clearStorage();
```

## 🐛 Troubleshooting

### Can't scroll?
- Check console for errors
- Verify passive listeners are enabled
- Try refreshing page

### Storage not working?
- Check if localStorage is enabled
- Check browser privacy settings
- Look for storage quota errors

### Can't select element?
- Try Alt+Q to cycle through
- Check if element is locked
- Verify element is not in exclusion list

## 📊 Console Messages

### Success Messages
```
✅ Loaded clipboard history: X items
✅ Inspector initialized
💾 Saved to clipboard history
```

### Info Messages
```
💡 Hover over elements to see highlighting
💡 Press Alt+Q to cycle through elements
🎯 Selected element X/Y: tagname.class
```

### Warning Messages
```
⚠️ Storage: Not Available
⚠️ Failed to load inspector data
```

## 🚀 Quick Start

```javascript
// Import
import { inspector } from './src/inspector/inspector-core.js';

// Initialize
inspector.init(document);

// Use
// Just hover and click!
```

## 📝 Notes

- Scrolling works with all methods (wheel, trackpad, scrollbar)
- Storage persists across page reloads
- Deep selection is automatic on hover
- Alt+Q works anywhere on the page
- All data is stored locally (no server)
