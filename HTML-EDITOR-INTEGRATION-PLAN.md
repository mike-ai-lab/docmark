# HTML Editor Tool Integration Plan

## Current State
- HTML/CSS upload functionality: COMPLETE
- Full HTML preview in iframe: WORKING
- CSS injection: WORKING

## Integration Approach: Floating Inspector Panel

### Phase 1: Add Inspector Toggle Button
**Location**: Header, only visible in HTML mode
**Design**: Clean icon button matching DocMark style (no emojis)
**Functionality**: Toggle inspector panel on/off

### Phase 2: Create Inspector Panel
**Location**: Floating panel on right side of preview pane
**Design**: 
- Width: 320px
- Background: Matches DocMark theme (light/dark)
- Collapsible with smooth animation
- Does NOT use emojis in section headers

**Structure**:
```
Inspector Panel
├── Element Info (tag name, classes)
├── Typography Section
├── Colors Section  
├── Spacing Section
├── Dimensions Section
├── Border Section
└── Actions Section
```

### Phase 3: Inject Inspector into HTML Preview
**Method**: 
- Add click listeners to iframe elements
- Highlight selected element with outline
- Populate inspector panel with element properties
- Live updates as user edits properties

### Phase 4: Core Features (Priority Order)
1. Element selection (click to select)
2. Live style editing (typography, colors, spacing)
3. Copy/Paste styles
4. Undo/Redo (integrate with existing history)
5. Export edited HTML

### Phase 5: Advanced Features (Optional)
- Drag & drop positioning
- Lock/unlock elements
- Z-index arrangement
- Multi-select

## Design Specifications

### Inspector Panel Sections (NO EMOJIS)
```
TEXT & CONTENT
- Text Content input

TYPOGRAPHY  
- Font Family dropdown
- Font Size input
- Font Weight dropdown
- Text Align dropdown

COLORS
- Text Color picker
- Background Color picker

SPACING
- Padding input
- Margin input

DIMENSIONS
- Width input
- Height input
- Display dropdown

BORDER
- Border Width input
- Border Style dropdown
- Border Color picker
- Border Radius input

ACTIONS
- Copy Style button
- Paste Style button
- Delete Element button
- Copy HTML button
```

### Color Scheme (Match DocMark)
- Primary: #2563eb (blue)
- Background Light: #ffffff
- Background Dark: #1e293b
- Border: #e2e8f0
- Text: #1e293b (light) / #f8fafc (dark)
- Accent: #3b82f6

### Button Styles
- Use DocMark's existing button classes
- No emoji icons, use SVG icons or text labels
- Consistent with header button style

## Implementation Steps

### Step 1: Add Inspector Toggle Button
File: `index.html`
- Add button to header (only visible in HTML mode)
- Use SVG icon (cursor/pointer icon)
- Add to header-right section

### Step 2: Create Inspector Panel HTML
File: `index.html`
- Add floating panel structure
- Initially hidden (display: none)
- Positioned absolute on right side of preview

### Step 3: Add Inspector Styles
File: `public/css/style.css`
- Panel styles matching DocMark theme
- Smooth transitions
- Responsive design
- Dark mode support

### Step 4: Add Inspector JavaScript
File: `src/main.js`
- Inspector initialization function
- Element selection logic
- Property editor handlers
- Style update functions

### Step 5: Integrate with HTML Preview
File: `src/main.js`
- Inject inspector into iframe on HTML mode
- Add click listeners to iframe elements
- Sync inspector panel with selected element

## Code Structure

```javascript
// In src/main.js

let inspectorEnabled = false;
let selectedElement = null;

// Initialize inspector when HTML mode is active
let initInspector = (iframeDoc) => {
    // Add click listeners to all elements
    // Highlight selected element
    // Populate inspector panel
};

// Update element styles
let updateElementStyle = (element, property, value) => {
    // Apply style to element
    // Update preview
    // Save to undo history
};

// Copy/Paste styles
let copyElementStyles = (element) => {
    // Extract computed styles
    // Store in clipboard
};

let pasteElementStyles = (element, styles) => {
    // Apply styles to element
    // Update preview
};
```

## Testing Checklist
- [ ] Inspector toggle button appears in HTML mode
- [ ] Inspector panel opens/closes smoothly
- [ ] Click element in preview selects it
- [ ] Inspector shows correct element properties
- [ ] Editing properties updates preview live
- [ ] Copy/paste styles works
- [ ] Undo/redo works with inspector changes
- [ ] Export includes inspector changes
- [ ] Dark mode styling works
- [ ] No emojis in UI

## Next Action
Proceed with Step 1: Add Inspector Toggle Button to header
