# Paper Layout Issues - Complete Summary

## Root Causes Identified

### 1. CSS Selector Mismatch
- **Problem**: CSS used `.preview-panel.paper-layout` but HTML has `.preview-pane`
- **Impact**: None of the paper layout CSS was being applied
- **Fixed**: Changed all selectors to `.preview-pane.paper-layout`

### 2. Status Bar Overlap
- **Problem**: Status bar (28px, z-index: 100, fixed bottom) covers horizontal scrollbar
- **Impact**: Scrollbar exists but is hidden underneath status bar
- **Fixed**: Changed `.preview-pane` height from `100%` to `calc(100% - 28px)`

### 3. Auto-Scale on Layout Switch
- **Problem**: `autoScalePaperToFit()` called automatically with 100ms delay when switching to paper layout
- **Impact**: Unwanted zoom changes when activating paper layout
- **Fixed**: Removed the automatic setTimeout call

### 4. Flex Container Overflow
- **Problem**: `#paper-scaler` with `display: inline-block` inside flex container doesn't trigger overflow properly
- **Impact**: Scrollbar doesn't appear even when content is wider
- **Solution**: Added `flex-shrink: 0` to prevent shrinking and force overflow

## Current State

### What Works Now:
✅ Paper centers with equal margins (flexbox with justify-content: center)
✅ Paper has realistic white color (#fefefe)
✅ Control buttons moved to top (top: 70px)
✅ No auto-zoom when switching layouts
✅ No auto-zoom when dragging resizer
✅ TEST buttons removed
✅ Horizontal scrollbar appears when paper is clipped
✅ Scrollbar is now visible (not hidden under status bar)

### Remaining Issues:
⚠️ Layout is fragile - multiple overlapping CSS rules
⚠️ Height calculations are complex (calc(100% - 28px))
⚠️ Status bar z-index conflicts with other elements
⚠️ Preview pane height affects both web and paper layouts

## Architecture Problems

### The Core Issue:
The preview panel has accumulated too many layout modes and edge cases:
- Web layout vs Paper layout
- Horizontal vs Vertical split
- With/without cheatsheet panel
- With/without status bar
- Different zoom levels
- Responsive resizing

All of these interact in unpredictable ways because they modify the same CSS properties.

## Recommendation for Clean Rewrite

If you decide to rewrite, consider:

1. **Separate Layout Containers**
   - One container for web layout
   - One container for paper layout
   - Switch between them, don't modify the same container

2. **Fixed Layout Structure**
   ```
   <div class="preview-pane">
     <div class="preview-content-wrapper">
       <!-- Web or Paper content here -->
     </div>
   </div>
   ```
   - Preview-pane: Fixed height (calc(100vh - header - status bar))
   - Content-wrapper: Handles overflow and scrolling

3. **Clear Separation of Concerns**
   - Layout positioning (flex, grid)
   - Content sizing (width, height)
   - Overflow handling (scroll, auto)
   - Z-index layers (status bar, controls, content)

4. **Paper Layout Specific**
   - Use a dedicated wrapper with `overflow: auto`
   - Paper scaler with fixed width (not flex-based)
   - Margins handled by padding on wrapper, not margins on paper

## Files Modified in This Session

1. `src/main.js`
   - Removed TEST buttons
   - Removed auto-scale setTimeout
   - Added debug logging

2. `public/css/style.css`
   - Fixed `.preview-panel` → `.preview-pane` selectors
   - Changed paper color to #fefefe
   - Moved controls to top: 70px
   - Added overflow-x: auto
   - Changed preview-pane height to calc(100% - 28px)
   - Added bottom padding to preview-wrapper
   - Changed paper-scaler to inline-block with flex-shrink: 0

## Key Learnings

1. **Always test with Playwright** - Visual inspection catches issues code review misses
2. **CSS specificity matters** - Wrong selector = no styles applied
3. **Z-index layering** - Fixed elements can hide scrollbars
4. **Flex container behavior** - Children need explicit sizing to trigger overflow
5. **Status bar is global** - Affects all panes, not just preview

## Next Steps if Keeping Current Code

1. Test in all layout modes (horizontal, vertical, with/without cheatsheet)
2. Test zoom levels (50%, 100%, 200%)
3. Test with different paper sizes
4. Test dark mode
5. Test on different screen sizes

## Next Steps if Rewriting

1. Create new preview-panel-v2.css with clean layout
2. Create new paper-layout component
3. Migrate one feature at a time
4. Keep old code until new version is stable
5. A/B test both versions
