# Unit Test: A4 SVG Alignment

## Critical Fix Applied

**Problem:** Paper layout preview was applying padding to `.paper-page`, shrinking the content area (same bug as Puppeteer).

**Solution:** Apply padding to `.paper-content` instead, keeping `.paper-page` at full A4 size (794px × 1123px).

---

## Test Suite

### Test 1: Exact A4 SVG Frame (210mm × 297mm)

**Margins: 0mm all sides**

Paste this into the editor:

```html
<svg width="210mm" height="297mm" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="210" height="297" fill="none" stroke="red" stroke-width="2"/>
</svg>
```

**Expected Result:**
- ✅ Red rectangle touches ALL 4 edges of the paper exactly
- ✅ No gaps between rectangle and page boundaries
- ✅ Rectangle is NOT clipped or shifted

**If this fails:** The coordinate system is still broken.

---

### Test 2: Content Area SVG (180mm × 267mm)

**Margins: 15mm all sides**

Paste this into the editor:

```html
<svg width="180mm" height="267mm" viewBox="0 0 180 267" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="180" height="267" fill="none" stroke="blue" stroke-width="2"/>
</svg>
```

**Expected Result:**
- ✅ Blue rectangle fits perfectly within content area
- ✅ 15mm white space on all sides
- ✅ Rectangle starts at (15mm, 15mm) and ends at (195mm, 282mm)

**If this fails:** Margins are not being applied correctly.

---

### Test 3: Dual Frame Test (Page + Content Boundaries)

**Margins: 15mm all sides**

Paste this into the editor:

```html
<svg width="210mm" height="297mm" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">
    <!-- Page boundary (RED) - should touch edges -->
    <rect x="0" y="0" width="210" height="297" fill="none" stroke="red" stroke-width="1"/>
    
    <!-- Content boundary (BLUE) - should be 15mm inset -->
    <rect x="15" y="15" width="180" height="267" fill="none" stroke="blue" stroke-width="1"/>
    
    <!-- Page corner markers (RED) -->
    <circle cx="0" cy="0" r="3" fill="red"/>
    <circle cx="210" cy="0" r="3" fill="red"/>
    <circle cx="0" cy="297" r="3" fill="red"/>
    <circle cx="210" cy="297" r="3" fill="red"/>
    
    <!-- Content corner markers (BLUE) -->
    <circle cx="15" cy="15" r="3" fill="blue"/>
    <circle cx="195" cy="15" r="3" fill="blue"/>
    <circle cx="15" cy="282" r="3" fill="blue"/>
    <circle cx="195" cy="282" r="3" fill="blue"/>
    
    <!-- Center crosshair (GREEN) -->
    <line x1="105" y1="0" x2="105" y2="297" stroke="green" stroke-width="0.5" stroke-dasharray="5,5"/>
    <line x1="0" y1="148.5" x2="210" y2="148.5" stroke="green" stroke-width="0.5" stroke-dasharray="5,5"/>
    
    <!-- Labels -->
    <text x="105" y="10" text-anchor="middle" font-size="8" fill="red">Page Boundary (210mm × 297mm)</text>
    <text x="105" y="25" text-anchor="middle" font-size="8" fill="blue">Content Area (180mm × 267mm)</text>
</svg>
```

**Expected Result:**
- ✅ Red rectangle extends beyond visible area (clipped by margins)
- ✅ Blue rectangle fits perfectly within content area
- ✅ Red circles at page corners (some clipped)
- ✅ Blue circles at content corners (all visible)
- ✅ Green crosshair at page center

**If this fails:** Coordinate system and margins are misaligned.

---

### Test 4: Positioned Container Test

**Margins: 10mm all sides**

Paste this into the editor:

```html
<div style="position:relative; width:210mm; height:297mm;">
    <svg width="210mm" height="297mm" 
         style="position:absolute; top:0; left:0;"
         viewBox="0 0 210 297" 
         xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="210" height="297" fill="none" stroke="black" stroke-width="2"/>
        <text x="105" y="148.5" text-anchor="middle" font-size="12" fill="black">Absolute Positioned SVG</text>
    </svg>
</div>
```

**Expected Result:**
- ✅ Black rectangle aligns with page edges
- ✅ Absolute positioning does NOT shift the rectangle
- ✅ Text is centered on page

**If this fails:** CSS positioning is interfering with coordinate system.

---

### Test 5: Grid Test (Verify Coordinate Accuracy)

**Margins: 0mm all sides**

Paste this into the editor:

```html
<svg width="210mm" height="297mm" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">
    <!-- Page boundary -->
    <rect x="0" y="0" width="210" height="297" fill="none" stroke="black" stroke-width="1"/>
    
    <!-- Vertical grid lines every 21mm (10 divisions) -->
    <line x1="21" y1="0" x2="21" y2="297" stroke="gray" stroke-width="0.5"/>
    <line x1="42" y1="0" x2="42" y2="297" stroke="gray" stroke-width="0.5"/>
    <line x1="63" y1="0" x2="63" y2="297" stroke="gray" stroke-width="0.5"/>
    <line x1="84" y1="0" x2="84" y2="297" stroke="gray" stroke-width="0.5"/>
    <line x1="105" y1="0" x2="105" y2="297" stroke="red" stroke-width="1"/>
    <line x1="126" y1="0" x2="126" y2="297" stroke="gray" stroke-width="0.5"/>
    <line x1="147" y1="0" x2="147" y2="297" stroke="gray" stroke-width="0.5"/>
    <line x1="168" y1="0" x2="168" y2="297" stroke="gray" stroke-width="0.5"/>
    <line x1="189" y1="0" x2="189" y2="297" stroke="gray" stroke-width="0.5"/>
    
    <!-- Horizontal grid lines every 29.7mm (10 divisions) -->
    <line x1="0" y1="29.7" x2="210" y2="29.7" stroke="gray" stroke-width="0.5"/>
    <line x1="0" y1="59.4" x2="210" y2="59.4" stroke="gray" stroke-width="0.5"/>
    <line x1="0" y1="89.1" x2="210" y2="89.1" stroke="gray" stroke-width="0.5"/>
    <line x1="0" y1="118.8" x2="210" y2="118.8" stroke="gray" stroke-width="0.5"/>
    <line x1="0" y1="148.5" x2="210" y2="148.5" stroke="red" stroke-width="1"/>
    <line x1="0" y1="178.2" x2="210" y2="178.2" stroke="gray" stroke-width="0.5"/>
    <line x1="0" y1="207.9" x2="210" y2="207.9" stroke="gray" stroke-width="0.5"/>
    <line x1="0" y1="237.6" x2="210" y2="237.6" stroke="gray" stroke-width="0.5"/>
    <line x1="0" y1="267.3" x2="210" y2="267.3" stroke="gray" stroke-width="0.5"/>
    
    <!-- Corner markers -->
    <circle cx="0" cy="0" r="2" fill="red"/>
    <circle cx="210" cy="0" r="2" fill="red"/>
    <circle cx="0" cy="297" r="2" fill="red"/>
    <circle cx="210" cy="297" r="2" fill="red"/>
    
    <!-- Center marker -->
    <circle cx="105" cy="148.5" r="3" fill="red"/>
    <text x="105" y="155" text-anchor="middle" font-size="6" fill="red">Center (105, 148.5)</text>
</svg>
```

**Expected Result:**
- ✅ Grid lines are evenly spaced
- ✅ Red center lines intersect at exact page center
- ✅ Corner markers at exact page corners
- ✅ No distortion or skewing

**If this fails:** Coordinate system has scaling or offset issues.

---

## How to Run Tests

1. **Open the app** and enable Paper Layout mode
2. **Set margins** as specified in each test
3. **Paste the SVG code** into the editor
4. **Observe the preview** and compare with expected results
5. **Export to PDF** and verify it matches the preview

---

## Success Criteria

All tests must pass for the fix to be considered complete:

- ✅ Test 1: A4 frame aligns with page edges
- ✅ Test 2: Content frame fits within margins
- ✅ Test 3: Dual frames show correct boundaries
- ✅ Test 4: Positioning doesn't affect alignment
- ✅ Test 5: Grid shows accurate coordinates

---

## Code Changes Applied

### src/main.js - applyPdfSettingsToPreview()

**Before (WRONG):**
```javascript
// Applied padding to paper-page (shrinks content area)
paperPages.forEach(page => {
    page.style.paddingTop = `${settings.margins.top * mmToPx}px`;
    // ...
});
```

**After (CORRECT):**
```javascript
// Remove padding from paper-page (keeps full A4 size)
paperPages.forEach(page => {
    page.style.paddingTop = '0';
    // ...
});

// Apply padding to paper-content (like body in PDF)
paperContents.forEach(content => {
    content.style.paddingTop = `${settings.margins.top * mmToPx}px`;
    // ...
});
```

### public/css/style.css - .paper-content

**Before (WRONG):**
```css
.paper-content {
  /* No width - caused layout issues */
  min-height: 100%;
}
```

**After (CORRECT):**
```css
.paper-content {
  width: 100%;
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
}
```

---

## Expected Behavior

### With 0mm Margins:
- Page = 794px × 1123px (A4 at 96 DPI)
- Content = 794px × 1123px (full page)
- 210mm × 297mm SVG touches all edges

### With 15mm Margins:
- Page = 794px × 1123px (unchanged)
- Content = 737px × 1009px (794 - 57, 1123 - 114)
- 210mm × 297mm SVG extends beyond visible area
- 180mm × 267mm SVG fits perfectly within content

---

**Status:** ✅ Fix applied - Ready for testing!
