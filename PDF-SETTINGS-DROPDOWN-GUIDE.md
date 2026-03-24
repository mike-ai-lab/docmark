# PDF Settings Dropdown - User Guide

## Overview

A clean, professional dropdown menu for controlling PDF export settings, located directly in the header next to the "Export PDF" button.

---

## Features

### 1. Text Alignment Control
Choose how your content is aligned in the PDF:

- **Left** (default) - Standard left alignment
- **Center** - Center all content
- **Right** - Right alignment
- **Justify** - Full justification (both edges aligned)

### 2. Custom Page Margins
Fine-tune the white space around your content:

- **Top Margin** - Space from top edge (5-50mm)
- **Right Margin** - Space from right edge (5-50mm)
- **Bottom Margin** - Space from bottom edge (5-50mm)
- **Left Margin** - Space from left edge (5-50mm)

**Default:** 15mm on all sides (professional standard)

---

## How to Use

### Opening the Settings
1. Look for the gear/settings icon button in the header
2. It's located just before the "Export PDF" button
3. Click to open the dropdown menu

### Changing Text Alignment
1. Open the PDF settings dropdown
2. Click one of the four alignment buttons:
   - Left align icon
   - Center align icon
   - Right align icon
   - Justify icon
3. The active button will be highlighted in blue
4. Settings save automatically

### Adjusting Margins
1. Open the PDF settings dropdown
2. Find the "Page Margins (mm)" section
3. Enter values for Top, Right, Bottom, Left
4. Use the number inputs (5-50mm range)
5. Changes save automatically when you change the value

### Resetting to Defaults
1. Open the PDF settings dropdown
2. Scroll to the bottom
3. Click "Reset to Default" button
4. All settings return to:
   - Alignment: Left
   - Margins: 15mm all sides

---

## Settings Storage

All settings are saved automatically to your browser's localStorage:
- **Key:** `com.markdownlivepreview.pdf_layout_settings`
- **Persists:** Across browser sessions
- **Scope:** Per browser/device

---

## Use Cases

### CVs/Resumes
```
Alignment: Left
Margins: 15mm (standard)
```
Professional, clean look with optimal content density.

### Formal Letters
```
Alignment: Justify
Margins: 20mm (generous)
```
Traditional business document appearance.

### Creative Documents
```
Alignment: Center
Margins: 10mm (minimal)
```
Modern, artistic presentation.

### Academic Papers
```
Alignment: Justify
Margins: 25mm (wide)
```
Traditional academic formatting.

---

## Technical Details

### Alignment Implementation
- Applied via CSS `text-align` property
- Affects all content in `.markdown-body`
- Injected into PDF HTML before generation

### Margin Implementation
- Sent to Puppeteer PDF generator
- Applied at PDF creation time
- Format: `{top: '15mm', right: '15mm', bottom: '15mm', left: '15mm'}`

### Files Modified
1. **index.html** - Added dropdown HTML structure
2. **public/css/style.css** - Added dropdown styling
3. **src/main.js** - Added dropdown functionality and settings management
4. **pdf-server.js** - Updated to accept custom margins

---

## Styling

### Light Theme
- Background: White
- Border: Light gray (#e2e8f0)
- Active button: Blue (#3b82f6)
- Text: Dark gray (#020405)

### Dark Theme
- Background: Dark blue (#020405)
- Border: Medium gray (#334155)
- Active button: Blue (#3b82f6)
- Text: Light gray (#e2e8f0)

---

## Keyboard Shortcuts

None currently - all interactions are click-based.

---

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Opera

Requires:
- JavaScript enabled
- localStorage available
- CSS Grid support

---

## Troubleshooting

### Dropdown won't open
- Check if JavaScript is enabled
- Refresh the page
- Clear browser cache

### Settings not saving
- Check localStorage is enabled
- Check browser privacy settings
- Try incognito/private mode

### Margins not applying
- Ensure PDF server is running (`node pdf-server.js`)
- Check console for errors
- Verify margin values are within 5-50mm range

### Alignment not working
- Check if content has inline styles overriding
- Verify settings are saved (check localStorage)
- Try resetting to defaults

---

## Future Enhancements

Potential additions:
- Font size presets (Small, Medium, Large)
- Line spacing control (1.0, 1.15, 1.5, 2.0)
- Paper size selection (A4, Letter, Legal)
- Orientation (Portrait, Landscape)
- Header/Footer templates
- Page numbering options

---

## API Reference

### JavaScript Functions

```javascript
// Load settings
const settings = loadPdfLayoutSettings();
// Returns: { textAlign: 'left', margins: { top: 15, right: 15, bottom: 15, left: 15 } }

// Save settings
savePdfLayoutSettings({
    textAlign: 'center',
    margins: { top: 20, right: 20, bottom: 20, left: 20 }
});

// Apply to PDF export
const layoutSettings = loadPdfLayoutSettings();
// Used in collectHtmlForPuppeteer() and exportPreviewToPdf()
```

### CSS Classes

```css
.pdf-settings-dropdown      /* Container */
.pdf-settings-menu          /* Dropdown panel */
.pdf-settings-menu.active   /* Open state */
.pdf-align-btn              /* Alignment buttons */
.pdf-align-btn.active       /* Selected alignment */
.pdf-margin-input           /* Margin input fields */
.pdf-reset-margins-btn      /* Reset button */
```

---

## Examples

### Minimal Margins (More Content)
```javascript
{
    textAlign: 'left',
    margins: { top: 10, right: 10, bottom: 10, left: 10 }
}
```
Result: ~10% more content per page

### Generous Margins (Formal)
```javascript
{
    textAlign: 'justify',
    margins: { top: 25, right: 25, bottom: 25, left: 25 }
}
```
Result: Traditional formal document appearance

### Asymmetric Margins (Binding)
```javascript
{
    textAlign: 'left',
    margins: { top: 15, right: 15, bottom: 15, left: 25 }
}
```
Result: Extra left margin for binding/hole punching

---

## Summary

The PDF Settings Dropdown provides:
- ✅ Quick access to alignment and margin controls
- ✅ Clean, professional UI design
- ✅ Automatic settings persistence
- ✅ Real-time visual feedback
- ✅ Easy reset to defaults
- ✅ Dark theme support
- ✅ No page reload required

Perfect for users who need precise control over their PDF output without cluttering the interface!
