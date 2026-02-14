# Puppeteer PDF Export Integration Plan

## 📋 Current State Analysis

### Existing Implementation
1. **PDF Export Function**: `exportPreviewToPdf()` in `src/main.js` (lines 2183-3318)
   - Uses jsPDF library (client-side)
   - Manual text positioning and formatting
   - Has Unicode/character encoding issues
   - Footer positioning problems
   - Does NOT preserve exact HTML layout

2. **Paper Layout System**: Already exists in `src/main.js`
   - Toggle between 'web' and 'paper' layout modes
   - Paper zoom controls (50-200%)
   - `.paper-container` elements for pagination
   - Settings stored in localStorage

3. **Page Setup Settings**: `loadPageSetupSettings()` and `savePageSetupSettings()`
   - Already has infrastructure for page settings
   - Stored in localStorage with key `page_setup_settings`

4. **PDF Settings Panel**: Lines 3391-3565
   - Font size controls (H1-H6, paragraph, list)
   - Style-specific settings
   - "Export PDF" button triggers `exportPreviewToPdf()`

### Issues with Current Implementation
- ❌ Uses browser's default rendering (not true WYSIWYG)
- ❌ Character encoding problems (Unicode, em dash, etc.)
- ❌ Footer in middle of page
- ❌ Doesn't preserve exact HTML styling
- ❌ Manual text positioning is fragile

---

## 🎯 Proposed Solution: Puppeteer Integration

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DocMark Frontend                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │  User clicks "Export PDF"                          │ │
│  │  ↓                                                  │ │
│  │  Collect HTML + CSS + Settings                     │ │
│  │  ↓                                                  │ │
│  │  Send to Puppeteer Server (localhost:3000)        │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Puppeteer Server (Node.js)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Receive HTML + Settings                           │ │
│  │  ↓                                                  │ │
│  │  Launch Chrome Headless                            │ │
│  │  ↓                                                  │ │
│  │  Inject Print CSS with @page rules                │ │
│  │  ↓                                                  │ │
│  │  Generate PDF (A4, custom margins)                │ │
│  │  ↓                                                  │ │
│  │  Return PDF Buffer                                 │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    User Downloads PDF                    │
│              (Perfect layout + selectable text)          │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Implementation Steps

### Step 1: Add Margin Settings to Page Setup Panel

**Location**: `src/main.js` - Page Setup Settings section

**Add to localStorage schema**:
```javascript
{
  pageSize: 'A4',           // Existing
  pageOrientation: 'portrait', // Existing
  margins: {
    top: 20,    // NEW
    right: 20,  // NEW
    bottom: 20, // NEW
    left: 20    // NEW
  }
}
```

**UI Changes**:
- Add margin controls to existing page setup panel
- 4 number inputs (top, right, bottom, left) in mm
- Preset buttons: Default (20mm), Narrow (15mm), Wide (25mm), No Margins (0mm)
- Save to localStorage on change

### Step 2: Replace `exportPreviewToPdf()` Function

**Current function** (lines 2183-3318): Delete entirely

**New function**:
```javascript
let exportPreviewToPdf = async () => {
    const outputElement = document.querySelector('#output');
    if (!outputElement) {
        alert('No content to export');
        return;
    }

    try {
        // Show loading indicator
        showLoadingIndicator('Generating PDF...');

        // Get page setup settings
        const pageSettings = loadPageSetupSettings();
        const margins = pageSettings.margins || { top: 20, right: 20, bottom: 20, left: 20 };

        // Collect HTML with all styles
        const fullHtml = await collectHtmlForExport(outputElement);

        // Send to Puppeteer server
        const response = await fetch('http://localhost:3000/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html: fullHtml,
                filename: generateFilename(),
                margins: margins
            })
        });

        if (!response.ok) {
            throw new Error('PDF generation failed');
        }

        // Download PDF
        const blob = await response.blob();
        downloadBlob(blob, generateFilename());

        hideLoadingIndicator();
        showSuccessMessage('PDF exported successfully!');

    } catch (error) {
        console.error('PDF export failed:', error);
        hideLoadingIndicator();
        
        if (error.message.includes('Failed to fetch')) {
            alert('PDF server not running. Please start it with: node pdf-server.js');
        } else {
            alert('PDF export failed: ' + error.message);
        }
    }
};
```

### Step 3: Add Helper Functions

**New functions to add**:

1. `collectHtmlForExport(outputElement)` - Collects HTML with inline styles
2. `generateFilename()` - Creates filename with timestamp and style name
3. `downloadBlob(blob, filename)` - Triggers browser download
4. `showLoadingIndicator(message)` - Shows loading UI
5. `hideLoadingIndicator()` - Hides loading UI
6. `showSuccessMessage(message)` - Shows success notification

### Step 4: Update Page Setup Panel UI

**Location**: Existing page setup panel in `src/main.js`

**Add margin controls**:
```html
<div class="setting-group">
    <label>Page Margins (mm)</label>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
        <div>
            <label style="font-size: 12px;">Top</label>
            <input type="number" id="margin-top" min="0" max="50" value="20">
        </div>
        <div>
            <label style="font-size: 12px;">Right</label>
            <input type="number" id="margin-right" min="0" max="50" value="20">
        </div>
        <div>
            <label style="font-size: 12px;">Bottom</label>
            <input type="number" id="margin-bottom" min="0" max="50" value="20">
        </div>
        <div>
            <label style="font-size: 12px;">Left</label>
            <input type="number" id="margin-left" min="0" max="50" value="20">
        </div>
    </div>
    <div style="margin-top: 10px; display: flex; gap: 8px;">
        <button onclick="setMarginPreset(20, 20, 20, 20)">Default</button>
        <button onclick="setMarginPreset(15, 15, 15, 15)">Narrow</button>
        <button onclick="setMarginPreset(25, 25, 25, 25)">Wide</button>
        <button onclick="setMarginPreset(0, 0, 0, 0)">No Margins</button>
    </div>
</div>
```

### Step 5: Update localStorage Functions

**Modify `loadPageSetupSettings()`**:
```javascript
const loadPageSetupSettings = () => {
    try {
        const stored = localStorage.getItem(`${localStorageNamespace}.${localStoragePageSetupKey}`);
        if (stored) {
            const settings = JSON.parse(stored);
            // Load margins if they exist, otherwise use defaults
            return {
                pageSize: settings.pageSize || 'A4',
                pageOrientation: settings.pageOrientation || 'portrait',
                margins: settings.margins || { top: 20, right: 20, bottom: 20, left: 20 }
            };
        }
    } catch (e) {
        console.error('Failed to load page setup settings:', e);
    }
    return { 
        pageSize: 'A4', 
        pageOrientation: 'portrait',
        margins: { top: 20, right: 20, bottom: 20, left: 20 }
    };
};
```

**Modify `savePageSetupSettings()`**:
```javascript
const savePageSetupSettings = (settings) => {
    try {
        localStorage.setItem(`${localStorageNamespace}.${localStoragePageSetupKey}`, JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save page setup settings:', e);
    }
};
```

### Step 6: Server Integration

**Files already created**:
- ✅ `pdf-server.js` - Express server with Puppeteer
- ✅ `pdf-export-puppeteer.js` - CLI script

**Server must be running**:
```bash
node pdf-server.js
```

**Server handles**:
- Receives HTML + margins from frontend
- Injects print CSS with @page rules
- Generates PDF with Chrome's rendering engine
- Returns PDF buffer to frontend

---

## 🔧 Edge Cases to Handle

### 1. Server Not Running
- **Detection**: `fetch()` fails with network error
- **Handling**: Show clear error message with instructions to start server
- **UI**: "PDF server not running. Start it with: node pdf-server.js"

### 2. Paper Layout Mode
- **Detection**: Check if `.paper-container` elements exist
- **Handling**: Server already handles this with `break-after: page` CSS
- **Result**: Each paper container becomes a separate PDF page

### 3. Web Layout Mode
- **Detection**: No `.paper-container` elements
- **Handling**: Content flows naturally with automatic page breaks
- **Result**: Chrome's print engine handles pagination

### 4. Large Documents
- **Issue**: Timeout or memory issues
- **Handling**: 
  - Set 30-second timeout on fetch
  - Show progress indicator
  - Server has 30-second timeout on Puppeteer

### 5. Images
- **CORS Issues**: External images may not load
- **Handling**: 
  - Images from same origin work fine
  - Data URLs work fine
  - External images need CORS headers

### 6. Custom Fonts
- **Issue**: Web fonts may not load in Puppeteer
- **Handling**: 
  - System fonts work (Roboto, Helvetica, etc.)
  - Web fonts need to be loaded before PDF generation
  - Use `waitUntil: 'networkidle0'` to ensure fonts load

### 7. Dark Mode
- **Issue**: Dark backgrounds waste ink
- **Handling**: 
  - Always export with light background
  - Override dark mode styles in print CSS
  - `background: white !important;`

### 8. Margin Validation
- **Issue**: Invalid margin values
- **Handling**:
  - Min: 0mm, Max: 50mm
  - Input type="number" with min/max attributes
  - Validate on save

---

## 📦 Files to Modify

### 1. `src/main.js`
**Changes**:
- Replace `exportPreviewToPdf()` function (lines 2183-3318)
- Add margin controls to page setup panel
- Update `loadPageSetupSettings()` and `savePageSetupSettings()`
- Add helper functions for HTML collection and download
- Add loading indicator UI

**Estimated lines changed**: ~200 lines

### 2. `index.html`
**Changes**:
- Remove jsPDF CDN script (no longer needed)
- Keep existing structure

**Estimated lines changed**: ~2 lines

### 3. Server Files (Already Created)
- ✅ `pdf-server.js` - Ready to use
- ✅ `pdf-export-puppeteer.js` - Ready to use

---

## 🎨 UI/UX Improvements

### Loading Indicator
```javascript
function showLoadingIndicator(message) {
    const indicator = document.createElement('div');
    indicator.id = 'pdf-loading-indicator';
    indicator.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                    background: rgba(0,0,0,0.5); z-index: 10000; 
                    display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 8px; 
                        text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">
                    ${message}
                </div>
                <div class="spinner"></div>
            </div>
        </div>
    `;
    document.body.appendChild(indicator);
}
```

### Success Message
- Show toast notification
- Auto-dismiss after 3 seconds
- Green background with checkmark icon

---

## ✅ Testing Checklist

### Functional Tests
- [ ] Export with default margins (20mm)
- [ ] Export with custom margins (0mm, 15mm, 25mm, 50mm)
- [ ] Export in paper layout mode (multiple pages)
- [ ] Export in web layout mode (continuous flow)
- [ ] Export with different styles (GitHub, GitBook, VSCode)
- [ ] Export with dark mode enabled
- [ ] Export with images
- [ ] Export with tables
- [ ] Export with code blocks
- [ ] Export with links (should be clickable)
- [ ] Export with Unicode characters
- [ ] Export large documents (10+ pages)

### Edge Case Tests
- [ ] Server not running (should show error)
- [ ] Network timeout (should show error)
- [ ] Invalid margin values (should validate)
- [ ] Empty document (should handle gracefully)
- [ ] Document with only images
- [ ] Document with external images (CORS)

### UI Tests
- [ ] Loading indicator appears
- [ ] Loading indicator disappears after export
- [ ] Success message shows
- [ ] Error message shows when server down
- [ ] Margin controls save to localStorage
- [ ] Margin presets work correctly
- [ ] Export button in PDF settings panel works
- [ ] Export button in header works

---

## 🚀 Deployment Considerations

### Development
```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start PDF server
node pdf-server.js
```

### Production Options

#### Option 1: Serverless Function (Recommended)
- Deploy `pdf-server.js` as Netlify/Vercel function
- Use `puppeteer-core` + `chrome-aws-lambda`
- Cost: ~$0-5/month
- Auto-scales

#### Option 2: Separate Server
- Deploy server to Heroku/DigitalOcean
- Update frontend to use production URL
- Cost: ~$5-10/month
- Requires maintenance

#### Option 3: Docker Container
- Package server in Docker
- Deploy to any cloud provider
- Most flexible
- Requires DevOps knowledge

---

## 📊 Performance Metrics

### Expected Performance
- **Small documents (1-3 pages)**: 2-3 seconds
- **Medium documents (4-10 pages)**: 3-5 seconds
- **Large documents (10+ pages)**: 5-10 seconds

### Optimization Opportunities
- Cache Puppeteer browser instance (reuse between requests)
- Compress PDF output
- Use faster image formats (WebP)
- Lazy load images in preview

---

## 🔒 Security Considerations

### Input Validation
- Sanitize HTML before sending to server
- Validate margin values (0-50mm)
- Limit HTML size (max 10MB)

### Rate Limiting
- Limit requests per IP (10 per 15 minutes)
- Prevent abuse of server resources

### CORS
- Configure CORS for your domain only
- Don't allow wildcard origins in production

---

## 📝 Summary

### What Gets Removed
- ❌ Old `exportPreviewToPdf()` function (~1100 lines)
- ❌ jsPDF library dependency
- ❌ Manual text positioning code
- ❌ Unicode sanitization workarounds

### What Gets Added
- ✅ New `exportPreviewToPdf()` function (~50 lines)
- ✅ Margin controls in page setup panel
- ✅ Helper functions for HTML collection
- ✅ Loading indicator UI
- ✅ Puppeteer server integration

### Benefits
- ✅ Perfect WYSIWYG export
- ✅ Selectable text in PDF
- ✅ Proper pagination
- ✅ Customizable margins
- ✅ No character encoding issues
- ✅ Professional quality output
- ✅ Simpler codebase (less code!)

### Trade-offs
- ⚠️ Requires Node.js server running
- ⚠️ Slightly slower (2-5 seconds vs instant)
- ⚠️ Deployment complexity (need to host server)

---

## ✋ READY FOR YOUR APPROVAL

**Please review this plan and confirm:**
1. ✅ Architecture makes sense
2. ✅ Edge cases are covered
3. ✅ UI/UX is acceptable
4. ✅ Deployment strategy is clear
5. ✅ Ready to proceed with implementation

**Once you confirm, I will:**
1. Modify `src/main.js` with new PDF export function
2. Add margin controls to page setup panel
3. Update localStorage functions
4. Add helper functions
5. Test all edge cases
6. Create deployment guide

**Type "PROCEED" to start implementation!**
