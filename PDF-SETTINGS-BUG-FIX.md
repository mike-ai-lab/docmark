# PDF Settings Bug Fix & Preview Integration

## Issues Fixed

### 1. Text Alignment Button Bug ✅
**Problem:** Both "Left" and "Justify" buttons were selected simultaneously by default in the PDF settings modal.

**Root Cause:** 
- The `setupPdfSettingsModal()` function was setting active classes without clearing existing ones first
- HTML might have had default active classes that weren't being cleared
- Settings weren't being refreshed when reopening the modal

**Solution:**
- Added `alignButtons.forEach(btn => btn.classList.remove('active'))` BEFORE setting the active button
- Implemented settings refresh when modal opens to ensure current state is always displayed
- Now only ONE alignment button is active at a time

### 2. Preview Doesn't Reflect PDF Settings ✅
**Problem:** Paper layout preview didn't show the text alignment or margins that would be used in PDF export.

**Solution:**
- Created new function `applyPdfSettingsToPreview()` that:
  - Reads current PDF settings from localStorage
  - Applies text alignment to all `.paper-content` elements
  - Converts margin values from mm to pixels (1mm ≈ 3.78px at 96 DPI)
  - Applies padding to match PDF margins
  
- Integrated preview updates:
  - Called automatically when paper layout is rendered
  - Called immediately when user changes alignment
  - Called immediately when user changes margins
  - Called when user resets to defaults

## Code Changes

### src/main.js

#### 1. Fixed setupPdfSettingsModal() - Lines 3568-3620
```javascript
// Clear all alignment buttons FIRST (fixes the bug)
alignButtons.forEach(btn => btn.classList.remove('active'));

// Refresh settings when modal opens
openBtn.addEventListener('click', () => {
    const currentSettings = loadPdfLayoutSettings();
    // Update all inputs and buttons with current values
    // ...
});
```

#### 2. Added Real-time Preview Updates - Lines 3635-3665
```javascript
// Alignment buttons - apply to preview immediately
btn.addEventListener('click', () => {
    // ... save settings ...
    if (paperLayoutActive) {
        applyPdfSettingsToPreview();
    }
    showMofuHelper(`Text alignment: ${btn.dataset.align}`);
});

// Margin inputs - apply to preview immediately
input.addEventListener('change', () => {
    // ... save settings ...
    if (paperLayoutActive) {
        applyPdfSettingsToPreview();
    }
    showMofuHelper(`Margin updated: ${side} = ${value}mm`);
});
```

#### 3. Created applyPdfSettingsToPreview() - Lines 3685-3705
```javascript
let applyPdfSettingsToPreview = () => {
    const settings = loadPdfLayoutSettings();
    const paperPages = document.querySelectorAll('.paper-content');
    
    paperPages.forEach(page => {
        // Apply text alignment
        page.style.textAlign = settings.textAlign;
        
        // Apply margins (mm to pixels conversion)
        const mmToPx = 3.78;
        page.style.paddingTop = `${settings.margins.top * mmToPx}px`;
        page.style.paddingRight = `${settings.margins.right * mmToPx}px`;
        page.style.paddingBottom = `${settings.margins.bottom * mmToPx}px`;
        page.style.paddingLeft = `${settings.margins.left * mmToPx}px`;
    });
};
```

#### 4. Integrated with Paper Layout Rendering - Line 7925
```javascript
outputDiv.appendChild(paperStack);

// Apply PDF settings to preview
applyPdfSettingsToPreview();

// Update page count
updatePageCount(pages.length);
```

## User Experience Improvements

### Before:
- ❌ Multiple alignment buttons selected (confusing)
- ❌ Preview didn't match PDF export settings
- ❌ No feedback when changing settings
- ❌ Had to export PDF to see the effect

### After:
- ✅ Only ONE alignment button selected at a time
- ✅ Preview matches PDF export exactly
- ✅ Real-time visual feedback with Mofu helper messages
- ✅ See changes immediately in paper layout mode
- ✅ Settings persist across sessions
- ✅ WYSIWYG (What You See Is What You Get)

## Technical Details

### Margin Conversion
- PDF uses millimeters (mm)
- Browser uses pixels (px)
- Conversion: 1mm ≈ 3.78px at 96 DPI (standard screen resolution)
- Example: 15mm margin = 56.7px padding

### Text Alignment Values
- `left` - Default, professional documents
- `center` - Titles, headers, special sections
- `right` - Dates, signatures, side notes
- `justify` - Full-width text, formal documents

### Settings Storage
- Stored in localStorage: `com.markdownlivepreview.pdf_layout_settings`
- Format: `{ textAlign: 'left', margins: { top: 15, right: 15, bottom: 15, left: 15 } }`
- Defaults: Left alignment, 15mm margins (professional standard)

## Testing Checklist

- [x] Open PDF settings modal - only ONE alignment button is active
- [x] Change alignment - preview updates immediately
- [x] Change margins - preview updates immediately
- [x] Reset to defaults - preview updates immediately
- [x] Close and reopen modal - correct settings displayed
- [x] Refresh page - settings persist
- [x] Toggle paper layout off/on - settings still applied
- [x] Export PDF - matches preview exactly

## Files Modified

1. `src/main.js` - Fixed bug, added preview integration
2. `PDF-SETTINGS-BUG-FIX.md` - This documentation

---

**Status:** ✅ COMPLETE - Bug fixed, preview integration working perfectly!
