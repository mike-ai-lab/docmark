# Paper Layout Auto-Scale Fix

## Problem Identified

The paper layout had two critical issues:

1. **Paper width was shrinking**: Used `max-width` instead of `width`, causing the paper to shrink when the panel was narrower than the paper, breaking the layout and causing text to wrap incorrectly.

2. **No auto-scaling**: When resizing the preview panel, the paper stayed at a fixed zoom level, requiring manual "Fit to Width" clicks. This didn't match professional design tools behavior.

## Solution Implemented

### 1. Fixed Paper Width (CSS)
**File**: `public/css/style.css`

Changed from:
```css
#output.paper-layout-active {
    max-width: var(--paper-width, 21cm);  /* WRONG - allows shrinking */
    ...
}
```

To:
```css
#output.paper-layout-active {
    width: var(--paper-width, 21cm);  /* CORRECT - fixed width */
    ...
}
```

**Result**: Paper now maintains its exact dimensions (21cm = 793px at 96 DPI) regardless of panel width.

### 2. Auto-Scale on Resize (JavaScript)
**File**: `src/main.js`

Added new function:
```javascript
const autoScalePaperToFit = () => {
    const outputDiv = document.querySelector('#output');
    const previewPane = document.querySelector('.preview-pane');
    
    if (!outputDiv || !previewPane || !outputDiv.classList.contains('paper-layout-active')) {
        return;
    }
    
    const panelWidth = previewPane.clientWidth;
    const pageWidth = pageSetup.width * 37.795275591; // cm to pixels
    const padding = 80; // Account for panel padding
    
    const scale = ((panelWidth - padding) / pageWidth) * 100;
    paperZoomLevel = Math.max(50, Math.min(200, Math.round(scale)));
    applyPaperZoom();
};
```

**Triggers**:
1. After split pane resize completes (mouseup event)
2. When paper layout is first activated
3. When switching to paper layout

## Behavior Now

### When Panel Width < Paper Width
- ✅ Paper scales down proportionally using CSS `transform: scale()`
- ✅ Content layout preserved (no wrapping changes)
- ✅ Entire paper visible in panel
- ✅ Smooth zoom transition (0.2s)

### When Panel Width > Paper Width  
- ✅ Paper scales up to fit (up to 200% max)
- ✅ Paper centered with gray background
- ✅ Content remains at correct proportions

### When Panel Width ≈ Paper Width
- ✅ Paper at ~100% zoom
- ✅ Optimal viewing experience

## Comparison to Professional Tools

This now matches the behavior of:
- **Adobe InDesign**: Auto-fits page to window
- **Figma**: Scales canvas to fit viewport
- **Sketch**: Auto-zoom on panel resize
- **Your mockup**: Proportional scaling with fixed layout

## Technical Details

### Scale Calculation
```javascript
scale = ((panelWidth - padding) / paperWidth) * 100
```

- `panelWidth`: Current preview pane width
- `padding`: 80px (40px left + 40px right from panel padding)
- `paperWidth`: 793px for A4 (21cm × 37.795275591 px/cm)
- Result clamped to 50%-200% range

### CSS Transform
```css
transform: scale(var(--paper-zoom, 1));
transform-origin: top center;
transition: transform 0.2s ease;
```

- Scales from top-center (paper stays aligned at top)
- Smooth 0.2s transition
- Visual scaling only (doesn't affect layout calculations)

## User Experience Improvements

1. **No manual intervention needed**: Paper auto-fits when resizing
2. **True PDF preview**: Content layout matches what will print
3. **Professional workflow**: Matches industry-standard design tools
4. **Smooth transitions**: No jarring jumps or layout shifts
5. **Maintains zoom controls**: Users can still manually adjust if desired

## Files Modified

1. `public/css/style.css` - Changed `max-width` to `width`
2. `src/main.js` - Added `autoScalePaperToFit()` function and triggers

## Testing

Test the fix by:
1. Enable paper layout
2. Drag the split divider left/right
3. Observe paper scales smoothly to fit
4. Content layout remains consistent
5. No horizontal scrollbars appear
6. Zoom percentage updates automatically
