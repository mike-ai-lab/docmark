# Inspector Actions API Documentation

A modular, reusable JavaScript class for element manipulation, styling, and layout management. Ready to integrate into any web application.

## Installation

```javascript
// Include the class
const inspector = new InspectorActions(config);
```

## Configuration

```javascript
const inspector = new InspectorActions({
    maxHistory: 50,              // Maximum undo/redo states
    maxClipboardHistory: 10,     // Maximum style clipboard items
    dragThreshold: 5,            // Pixels to move before drag starts
    
    // Callbacks
    onStateChange: (action, index, total) => {
        // Called on undo/redo
        // action: 'save', 'undo', 'redo'
        // index: current history position
        // total: total history items
    },
    
    onFeedback: (message, type) => {
        // Called for user feedback
        // message: feedback text
        // type: 'success', 'error', 'info'
    }
});
```

## API Reference

### Selection Methods

#### `selectElement(element)`
Selects an element and adds visual indicator.
```javascript
inspector.selectElement(document.getElementById('myDiv'));
```

#### `deselectElement()`
Deselects the currently selected element.
```javascript
inspector.deselectElement();
```

---

### History Actions

#### `saveState(doc)`
Saves current document state for undo/redo.
```javascript
inspector.saveState(iframe.contentWindow.document);
```

#### `undo(doc)`
Undoes the last change.
```javascript
inspector.undo(doc);
```

#### `redo(doc)`
Redoes the last undone change.
```javascript
inspector.redo(doc);
```

#### `canUndo()` / `canRedo()`
Check if undo/redo is available.
```javascript
if (inspector.canUndo()) {
    // Enable undo button
}
```

---

### Arrange (Z-Index) Actions

#### `bringToFront(element, doc)`
Brings element to the highest z-index among siblings.
```javascript
inspector.bringToFront(selectedElement, doc);
```

#### `bringForward(element, doc)`
Increases element's z-index by 1.
```javascript
inspector.bringForward(selectedElement, doc);
```

#### `sendBackward(element, doc)`
Decreases element's z-index by 1.
```javascript
inspector.sendBackward(selectedElement, doc);
```

#### `sendToBack(element, doc)`
Sends element to the lowest z-index among siblings.
```javascript
inspector.sendToBack(selectedElement, doc);
```

#### `startArrangeMode(element)`
Enters "arrange mode" - click other elements to position selected element above them.
```javascript
inspector.startArrangeMode(selectedElement);
// Now click other elements to arrange
```

#### `arrangeAboveElement(targetElement, doc)`
In arrange mode, positions the selected element above the target element.
```javascript
// Called automatically when clicking elements in arrange mode
inspector.arrangeAboveElement(clickedElement, doc);
```

#### `exitArrangeMode(save, doc)`
Exits arrange mode and optionally saves changes.
```javascript
inspector.exitArrangeMode(true, doc); // Save changes
```

#### `cancelArrangeMode()`
Exits arrange mode and reverts all changes.
```javascript
inspector.cancelArrangeMode();
```

#### `undoLastArrange()`
Undoes the last arrange operation.
```javascript
inspector.undoLastArrange();
```

---

### Lock Actions

#### `toggleLock(element)`
Toggles element lock state. Returns `true` if locked, `false` if unlocked.
```javascript
const isLocked = inspector.toggleLock(element);
```

#### `lockElement(element)`
Locks an element to prevent editing.
```javascript
inspector.lockElement(element);
```

#### `unlockElement(element)`
Unlocks an element.
```javascript
inspector.unlockElement(element);
```

#### `unlockAll()`
Unlocks all locked elements. Returns count of unlocked elements.
```javascript
const count = inspector.unlockAll();
```

#### `isElementLocked(element)`
Checks if an element is locked.
```javascript
if (inspector.isElementLocked(element)) {
    alert('Element is locked!');
}
```

---

### Multi-Select Actions

#### `startMultiSelectMode()`
Enters multi-select mode.
```javascript
inspector.startMultiSelectMode();
```

#### `exitMultiSelectMode()`
Exits multi-select mode and clears selection.
```javascript
inspector.exitMultiSelectMode();
```

#### `toggleMultiSelect(element)`
Toggles element selection in multi-select mode. Returns count of selected elements.
```javascript
const count = inspector.toggleMultiSelect(element);
```

#### `clearMultiSelection()`
Clears all selected elements. Returns count of cleared elements.
```javascript
const count = inspector.clearMultiSelection();
```

#### `distributeElements(direction, gap, alignment, doc)`
Distributes selected elements with specified spacing.
```javascript
inspector.distributeElements('horizontal', 50, 'center', doc);
// direction: 'horizontal' or 'vertical'
// gap: spacing in pixels
// alignment: 'start', 'center', or 'end'
```

---

### Group Actions

#### `groupSelectedElements(doc)`
Groups currently selected elements. Returns group ID.
```javascript
const groupId = inspector.groupSelectedElements(doc);
```

#### `ungroupElement(element, doc)`
Ungroups a grouped element.
```javascript
inspector.ungroupElement(element, doc);
```

#### `selectGroup(element)`
Selects all elements in a group.
```javascript
inspector.selectGroup(groupedElement);
```

---

### Copy/Paste Style Actions

#### `copyStyle(element, categories)`
Copies styles from an element. Categories can be specified to copy only certain properties.
```javascript
// Copy all styles
inspector.copyStyle(element);

// Copy specific categories
inspector.copyStyle(element, {
    colors: true,
    typography: true,
    spacing: false,
    dimensions: false,
    border: false,
    radius: false,
    display: false
});
```

Available categories:
- `colors`: color, backgroundColor
- `typography`: fontFamily, fontSize, fontWeight, textAlign
- `spacing`: padding, margin
- `dimensions`: width, height
- `border`: borderWidth, borderStyle, borderColor
- `radius`: borderRadius
- `display`: display

#### `pasteStyle(element, categories, doc)`
Pastes copied styles to an element.
```javascript
// Paste all copied styles
inspector.pasteStyle(element, null, doc);

// Paste specific categories
inspector.pasteStyle(element, ['colors', 'typography'], doc);
```

#### `checkCompatibility(element, styles)`
Checks compatibility and returns warnings.
```javascript
const warnings = inspector.checkCompatibility(element, inspector.copiedStyles);
if (warnings.length > 0) {
    console.warn('Compatibility issues:', warnings);
}
```

---

### Batch Paste Mode

#### `startBatchPasteMode(categories)`
Enters batch paste mode - click multiple elements to paste styles.
```javascript
inspector.startBatchPasteMode(['colors', 'typography']);
```

#### `batchPasteToElement(element, doc)`
Pastes styles to an element in batch mode. Returns count of pasted elements.
```javascript
const count = inspector.batchPasteToElement(clickedElement, doc);
```

#### `exitBatchPasteMode(save, doc)`
Exits batch paste mode and optionally saves changes.
```javascript
inspector.exitBatchPasteMode(true, doc);
```

#### `cancelBatchPasteMode()`
Exits batch paste mode and reverts all changes.
```javascript
inspector.cancelBatchPasteMode();
```

#### `undoLastBatchPaste()`
Undoes the last batch paste operation.
```javascript
inspector.undoLastBatchPaste();
```

---

### Clipboard History

#### `addToClipboardHistory(styleData)`
Adds a style to clipboard history (called automatically by `copyStyle`).
```javascript
const historyItem = inspector.addToClipboardHistory(styleData);
```

#### `getClipboardHistory()`
Returns array of clipboard history items.
```javascript
const history = inspector.getClipboardHistory();
history.forEach(item => {
    console.log(item.name, item.timestamp);
});
```

#### `pasteFromHistory(id, element, doc)`
Pastes a style from clipboard history.
```javascript
inspector.pasteFromHistory(historyItemId, element, doc);
```

#### `deleteFromHistory(id)`
Deletes an item from clipboard history.
```javascript
inspector.deleteFromHistory(historyItemId);
```

#### `renameHistoryItem(id, newName)`
Renames a clipboard history item.
```javascript
inspector.renameHistoryItem(historyItemId, 'My Custom Style');
```

---

### Delete Action

#### `deleteElement(element, doc)`
Deletes an element (checks for lock).
```javascript
inspector.deleteElement(element, doc);
```

---

### Copy HTML Action

#### `copyHTML(element)`
Returns the HTML of an element.
```javascript
const html = inspector.copyHTML(element);
navigator.clipboard.writeText(html);
```

---

### Export Action

#### `exportDocument(doc, filename)`
Exports the document as HTML. Returns object with `html`, `filename`, and `blob`.
```javascript
const result = inspector.exportDocument(doc, 'my-design.html');

// Download the file
const url = URL.createObjectURL(result.blob);
const a = document.createElement('a');
a.href = url;
a.download = result.filename;
a.click();
URL.revokeObjectURL(url);
```

---

### Drag & Drop

#### `initDragDrop(doc)`
Initializes drag and drop functionality.
```javascript
inspector.initDragDrop(iframe.contentWindow.document);
```

---

### Utility Methods

#### `getElementStyles(element)`
Returns an object with all computed styles of an element.
```javascript
const styles = inspector.getElementStyles(element);
console.log(styles.fontSize, styles.color, styles.padding);
```

#### `applyElementStyles(element, styles, doc)`
Applies a styles object to an element.
```javascript
inspector.applyElementStyles(element, {
    fontSize: 16,
    color: '#ff0000',
    padding: 20
}, doc);
```

---

## State Properties

Access these properties to check current state:

```javascript
inspector.selectedElement        // Currently selected element
inspector.selectedElements       // Array of multi-selected elements
inspector.lockedElements         // Set of locked elements
inspector.groups                 // Map of grouped elements
inspector.copiedStyles          // Currently copied styles
inspector.styleClipboardHistory // Array of clipboard history
inspector.batchPasteMode        // Boolean: in batch paste mode
inspector.arrangeMode           // Boolean: in arrange mode
inspector.multiSelectMode       // Boolean: in multi-select mode
inspector.history               // Array of history states
inspector.historyIndex          // Current history position
```

---

## CSS Classes

The following CSS classes are added/removed by the actions:

- `.active-inspect` - Currently selected element
- `.locked-element` - Locked element
- `.multi-selected` - Multi-selected element
- `.grouped-element` - Element in a group
- `.batch-pasted` - Element that received batch paste
- `.arrange-applied` - Element that was arranged
- `.arrange-hover` - Element being hovered in arrange mode
- `.dragging` - Element being dragged

---

## Events Flow

### Typical Usage Pattern

```javascript
// 1. Initialize
const inspector = new InspectorActions({ /* config */ });

// 2. Setup click handler
doc.body.addEventListener('click', (e) => {
    if (inspector.multiSelectMode) {
        inspector.toggleMultiSelect(e.target);
    } else if (inspector.arrangeMode) {
        inspector.arrangeAboveElement(e.target, doc);
    } else if (inspector.batchPasteMode) {
        inspector.batchPasteToElement(e.target, doc);
    } else {
        inspector.selectElement(e.target);
    }
});

// 3. Wire up buttons
document.getElementById('lockBtn').onclick = () => {
    inspector.toggleLock(inspector.selectedElement);
};

// 4. Initialize drag & drop
inspector.initDragDrop(doc);
```

---

## Complete Integration Example

See `inspector-actions-example.js` for a complete working example with:
- All button handlers
- Mode banners
- Keyboard shortcuts
- Clipboard history UI
- Live style updates
- Feedback notifications

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support
- Uses: Map, Set, classList, getBoundingClientRect, etc.

---

## License

MIT - Free to use in any project
