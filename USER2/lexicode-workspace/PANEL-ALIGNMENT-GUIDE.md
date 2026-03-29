# Panel Alignment Guide

## Header Alignment Structure

All panel headers are now perfectly aligned horizontally at 40px height with matching styling.

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ MAIN HEADER (12px height - #252526)                                      │
│ [≡] LexiCode Workspace                    [AI Assistant] [User Menu ▼]  │
├─────────────┬───────────────────────────────────────┬─────────────────────┤
│ FILE TREE   │ EDITOR HEADER                         │ AI PANEL HEADER     │
│ HEADER      │ (40px - #2d2d30)                      │ (40px - #2d2d30)    │
│ (40px)      │ filename.js [Saving...] [Actions...] │ ✨ AI [1,234] [⚙]  │
│ #2d2d30     │                                       │                     │
├─────────────┼───────────────────────────────────────┼─────────────────────┤
│             │                                       │                     │
│ Projects    │                                       │                     │
│ [+]         │         Monaco Editor                 │   Chat Messages     │
│             │                                       │                     │
│ 📁 Demo     │                                       │                     │
│   📄 file1  │                                       │                     │
│   📄 file2  │                                       │                     │
│             │                                       │                     │
│ (300px)     │         (Flexible)                    │     (400px)         │
│ Toggleable  │                                       │   Toggleable        │
└─────────────┴───────────────────────────────────────┴─────────────────────┘
```

## Header Specifications

### Main Header
- **Height**: 48px (12 in Tailwind)
- **Background**: #252526
- **Position**: Fixed at top, always visible
- **Content**: 
  - Left: File tree toggle + App title
  - Right: AI toggle + User menu

### Panel Headers (All Aligned)
- **Height**: 40px (10 in Tailwind)
- **Background**: #2d2d30 (slightly lighter than main)
- **Border**: Bottom border with gray-700
- **Alignment**: All three headers at same vertical position

#### File Tree Header
```jsx
<div className="h-10 bg-[#2d2d30] border-b border-gray-700 flex items-center justify-between px-3">
  <h2>Projects</h2>
  <button>[+]</button>
</div>
```

#### Editor Header
```jsx
<div className="h-10 bg-[#2d2d30] border-b border-gray-700 flex items-center justify-between px-4">
  <div>filename.js [Saving...]</div>
  <div>[Actions] [Preview] [Export]</div>
</div>
```

#### AI Panel Header
```jsx
<div className="h-10 bg-[#2d2d30] border-b border-gray-700 flex items-center justify-between px-4">
  <div>✨ AI Assistant [1,234 tokens]</div>
  <div>[History] [New] [Reset]</div>
</div>
```

## Toggle Behavior

### File Tree Toggle
- **Button Location**: Main header, left side
- **Icon**: PanelLeftClose / PanelLeftOpen
- **Animation**: 300ms ease-in-out slide
- **Width**: 0px (hidden) ↔ 300px (visible)

### AI Panel Toggle
- **Button Location**: Main header, right side
- **Icon**: MessageSquare
- **Animation**: 300ms ease-in-out slide
- **Width**: 0px (hidden) ↔ 400px (visible)

## Color Scheme

```css
Main Header:     #252526 (darker)
Panel Headers:   #2d2d30 (lighter)
Panel Content:   #252526 (matches main)
Borders:         #374151 (gray-700)
```

## Responsive States

### Both Panels Open (Default)
```
[300px File Tree] [Flexible Editor] [400px AI Panel]
```

### File Tree Closed
```
[0px] [Flexible Editor] [400px AI Panel]
```

### AI Panel Closed
```
[300px File Tree] [Flexible Editor] [0px]
```

### Both Panels Closed (Maximum Editor Space)
```
[0px] [Full Width Editor] [0px]
```

## Implementation Notes

1. **Smooth Transitions**: All panels use `transition-all duration-300 ease-in-out`
2. **Overflow Hidden**: Panels use `overflow: hidden` to hide content during slide
3. **Fixed Inner Width**: Inner content maintains fixed width (300px/400px) while container animates
4. **Flex Shrink**: All panels have `flex-shrink-0` to prevent unwanted compression
5. **Z-Index**: Chat history dropdown uses `z-20` to appear above content

## Testing Scenarios

✅ Toggle file tree on/off
✅ Toggle AI panel on/off  
✅ Toggle both panels simultaneously
✅ Open file with both panels closed
✅ Switch files with different panel states
✅ Verify header alignment at all times
✅ Check smooth animations
✅ Test with preview mode enabled
✅ Verify export dropdown positioning
✅ Check user menu dropdown positioning

---

**Key Achievement**: All three panel headers create a perfect horizontal line across the interface, giving a polished, professional IDE appearance.
