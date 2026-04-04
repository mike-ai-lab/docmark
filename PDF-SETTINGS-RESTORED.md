# PDF Settings Button Restored

## Issue
The PDF Settings button was missing from the header, preventing users from accessing margin controls and other PDF export settings.

## Fix Applied
Added the PDF Settings button back to `index.html` in two locations:

1. **Shared buttons section** (`pdf-settings-btn-shared`) - Visible in both single-file and documentation modes
2. **Editor-only buttons section** (`pdf-settings-btn`) - Primary button for single-file mode

## What's Working Now
- ✅ PDF Settings button appears in the header
- ✅ Opens the PDF Settings modal when clicked
- ✅ Margin controls (top, right, bottom, left) are accessible
- ✅ Text alignment options (left, center, right, justify)
- ✅ Page number positioning (left, center, right)
- ✅ Margin guides toggle
- ✅ Settings persist to localStorage
- ✅ Real-time preview updates when settings change

## Files Modified
- `index.html` - Added PDF settings button HTML

## No Code Changes Needed
The JavaScript handlers in `src/main.js` were already in place:
- `setupPdfSettingsModal()` - Handles modal interactions
- `setupSharedButtons()` - Connects shared button to main button
- `loadPdfLayoutSettings()` / `savePdfLayoutSettings()` - Persistence
- `renderPaperLayout()` - Applies settings to preview

## Testing
Open the app and click the gear icon in the header to access PDF settings.
