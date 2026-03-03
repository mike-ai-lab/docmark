# Critical Paper Layout Alignment Issue - Expert Review Required

## Problem Summary

The paper layout preview in this markdown editor application has a fundamental coordinate system and margin alignment problem that needs expert investigation.

## Observable Symptoms

### 1. SVG Rectangle Misalignment
When inserting an SVG rectangle that should match the exact A4 page dimensions (210mm × 297mm):
- With **0mm margins**: The rectangle does NOT align with the page edges - it is shifted/offset
- With **15mm margins**: The rectangle shifts even further toward the bottom-right corner
- The shifting increases proportionally with margin size

### 2. Coordinate System Drift
When testing with absolute positioning (`position:absolute; top:0; left:0;`):
- The content still shifts - proving this is NOT a CSS alignment issue
- The coordinate origin (0,0) appears to move when margins are applied
- Larger margins = more drift toward bottom-right

### 3. Double Margin Effect
When testing with a 100% width/height container with borders:
- The border shrinks inward when margins are applied
- This indicates the viewport/canvas is being reduced BEFORE content is rendered
- Content appears to be offset by margins TWICE

## Test Results Evidence

Systematic testing with multiple margin configurations shows:
- **0mm margins**: Small offset present (should be zero)
- **5mm margins**: Noticeable shift
- **10mm margins**: Significant shift
- **15mm margins**: Major shift toward bottom-right
- **20mm margins**: Extreme shift
- **Unequal margins**: Content drifts toward the side with larger margins

## User's Technical Analysis

Through careful testing, the user discovered:

1. **Oversized SVG Test (250mm × 350mm on A4)**:
   - With 15mm margins: Rectangle shifted toward bottom-right
   - With 1mm margins: Rectangle aligned correctly to top-left
   - Conclusion: Margin size affects coordinate origin

2. **Absolute Positioning Test**:
   - Forced `position:absolute; top:0; left:0;`
   - Same shifting behavior occurred
   - Conclusion: Not a CSS alignment issue

3. **100% Container Test**:
   - Red border with 100% width/height
   - Border shrank inward when margins = 15mm
   - Conclusion: Engine reduces viewport size before rendering

## Root Cause Hypothesis (User's Finding)

**The rendering engine applies margins by SHRINKING the render canvas itself, redefining the coordinate system.**

Margins are NOT simple offsets - they reduce the printable viewport BEFORE layout calculation. This causes:
- The coordinate system (0,0) to move when margins change
- Content to shift toward bottom-right with larger margins
- SVG elements with absolute coordinates to misalign with page boundaries

## Expected Behavior

When an SVG rectangle is defined as 210mm × 297mm (exact A4 size):
- With **0mm margins**: Rectangle should touch all 4 page edges exactly
- With **15mm margins**: Rectangle should extend beyond visible area (clipped by margins), but the visible portion should start at the margin boundary
- The coordinate (0,0) should ALWAYS be at the true page top-left corner, regardless of margin settings

## Current Behavior

- Rectangle does NOT align with page edges even at 0mm margins
- Rectangle shifts progressively with increasing margins
- Coordinate system appears to be redefined/offset when margins are applied
- Content positioning is unpredictable and inconsistent

## Technical Context

- Application: Markdown live preview editor with paper layout mode
- Paper size: A4 (210mm × 297mm = 794px × 1123px at 96 DPI)
- Margin range: 0-50mm (user configurable)
- Preview rendering: Browser-based with CSS
- PDF export: Puppeteer-based server

## What Needs Investigation

An expert developer needs to:

1. **Inspect the paper layout rendering code** to understand how pages are created and how margins are applied
2. **Identify where the coordinate system is being shifted** when margins are applied
3. **Determine if margins are being applied multiple times** (double-margin effect)
4. **Find why the viewport/canvas size changes** with margin settings
5. **Locate the root cause** of the coordinate drift toward bottom-right

## Critical Requirements

The fix must ensure:
- Coordinate (0,0) stays at true page origin regardless of margins
- SVG elements with absolute coordinates align correctly
- Margins create internal spacing without shifting the coordinate system
- Preview behavior matches PDF export behavior exactly
- No double-margin or double-offset effects

## Files to Investigate

- `src/main.js` - Main application logic, paper layout rendering
- `public/css/style.css` - Paper layout CSS styles
- Look for: `.paper-page`, `.paper-content`, `renderPaperLayout`, `applyPdfSettingsToPreview`

## Test Case for Verification

```html
<svg width="210mm" height="297mm" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="210" height="297" fill="none" stroke="red" stroke-width="2"/>
</svg>
```

**With 0mm margins**: Red rectangle MUST touch all 4 edges exactly.
**With 15mm margins**: Red rectangle MUST start at (0,0) and extend beyond visible area.

If this doesn't work, the coordinate system is broken.

---

**Note to Expert**: Please approach this with fresh eyes. The coordinate system and margin application logic needs fundamental review. The issue is NOT about CSS tweaks - it's about how the rendering canvas/viewport is being sized and how coordinates are being calculated relative to margins.


## The expert suggestion KIRO should apply:

Based on a technical audit of `main.js` and `style.css`, the "Coordinate Drift" and "Double Margin" issues are caused by a fundamental conflict between CSS **box-sizing** and the **coordinate origin** of positioned elements.

### 1. The Root Cause: Padding-Based Coordinate Shift

The application implements page margins by applying `padding` to the `.paper-page` element while using `box-sizing: border-box`.

* **In `style.css**`: `.paper-page` is defined with `box-sizing: border-box` and `padding: var(--paper-padding, 15mm)`.
* **In `main.js**`: The `applyPdfSettingsToPreview` function updates this padding dynamically: `page.style.padding = \`${settings.margins.top}mm ...`;`.

**The Problem**: In CSS, the coordinate origin `(0,0)` for all child elements (including those with `position: absolute`) is the top-left corner of the **padding box**. When you increase padding (margins), you are literally moving the `(0,0)` anchor point inward. This is why your absolute positioning test failed—the "origin" itself was moving.

### 2. The "Double Margin" / Shrinking Effect

Because `.paper-page` is `border-box`, adding padding **shrinks the content area**.

* A `210mm` wide page with `15mm` left/right margins results in a content area of only `180mm`.
* The `.paper-content` div is set to `width: 100%; height: 100%;`.
* **Result**: When you place a `210mm` SVG inside a `100%` width container that has been shrunk to `180mm`, the SVG overflows and is misaligned because its container is smaller than the physical page.

### 3. Comparison with PDF Export Logic

The PDF export logic in `main.js` (Snippet 12) uses a different approach:

* It forces `@page { margin: 0; }` to prevent the PDF engine from shrinking the viewport.
* It then applies margins as `padding` to the `body`.
* This creates a discrepancy: the preview wraps content in `.paper-content`, while the export treats the whole `body` as the canvas.

---

### Recommended Technical Fix

To ensure `(0,0)` always stays at the true page origin, you must decouple the **Margin Box** from the **Coordinate Anchor**.

**Step 1: Update `style.css**`
Remove padding from the page and move it to the content container.

```css
.paper-page {
  width: 210mm;
  height: 297mm;
  padding: 0 !important; /* Remove the shift-inducing padding */
  position: relative;    /* Anchor for true (0,0) */
  box-sizing: border-box;
}

.paper-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* Margins will be applied here instead */
  padding: var(--paper-padding, 15mm); 
}

```

**Step 2: Update `main.js` (`applyPdfSettingsToPreview`)**
Redirect the margin updates from the `page` to the `content`.

```javascript
let applyPdfSettingsToPreview = () => {
    const settings = loadPdfLayoutSettings();
    const paperContents = document.querySelectorAll('.paper-content');
    
    paperContents.forEach(content => {
        // Apply margins to content padding, NOT the page padding
        content.style.padding = `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`;
    });
};

```

### Verification of the Fix

* **Absolute Elements**: An element with `position: absolute; top: 0; left: 0;` inside `.paper-page` will now align to the true edge because the parent has `0` padding.
* **Flow Content**: Standard text/markdown inside `.paper-content` will still respect the margins because of the internal padding.
* **SVG Test**: Your `210mm` SVG will now align with the page edges if positioned absolutely, or start at the margin if placed in the flow, without the coordinate system "drifting."