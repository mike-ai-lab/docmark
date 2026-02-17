# Inspector Tool Test Guide

## Test Files Created:
1. `test-inspector-sample.html` - HTML file with multiple CSS references
2. `test-styles-1.css` - First CSS file (layout, red box, card)
3. `test-styles-2.css` - Second CSS file (blue box, custom font, @import)

---

## TEST SCENARIOS:

### ✅ TEST 1: Single CSS File
**Steps:**
1. Open `TML_INSPECTOR_CSS_FIXED.html` in browser
2. Click "Browse CSS" → Select `test-styles-1.css` ONLY
3. Load `test-inspector-sample.html`

**Expected Result:**
- Red box appears styled ✓
- Blue box has NO styling (plain text)
- Title has orange underline ✓
- Card has light blue background ✓

---

### ✅ TEST 2: Multiple CSS Files
**Steps:**
1. Click "Clear" to reset
2. Click "Browse CSS" → Select BOTH `test-styles-1.css` AND `test-styles-2.css` (Ctrl+Click)
3. Load `test-inspector-sample.html`

**Expected Result:**
- Red box appears styled ✓
- Blue box appears styled ✓
- Title has orange underline ✓
- Card has light blue background ✓
- Custom font text has purple background ✓
- Google Fonts (Roboto) loads from @import ✓

---

### ✅ TEST 3: Folder Path (Base URL)
**Steps:**
1. Click "Clear" to reset
2. Load `test-inspector-sample.html` first
3. Paste this in "Base URL" field: `C:\Users\Administrator\markdown-live-preview\`
4. Click "Reload"

**Expected Result:**
- Browser tries to load CSS from the folder path
- If CSS files exist in that folder, they load
- If not, HTML shows without styling

---

### ✅ TEST 4: Both Methods Combined
**Steps:**
1. Click "Clear" to reset
2. Click "Browse CSS" → Select both CSS files
3. Paste folder path in "Base URL" field
4. Load `test-inspector-sample.html`

**Expected Result:**
- All CSS loads from browsed files ✓
- Images/fonts load from folder path ✓
- Everything works together ✓

---

### ✅ TEST 5: Edit Elements
**Steps:**
1. After loading with CSS, click on the "Red Box" in the viewer
2. In the right panel, change:
   - Background Color → Green
   - Font Size → 24px
   - Padding → 40px
3. Click "COPY HTML"

**Expected Result:**
- Red box turns green immediately ✓
- Text gets bigger ✓
- More padding appears ✓
- Copied HTML has inline styles ✓

---

### ✅ TEST 6: Undo/Redo
**Steps:**
1. Make several edits to different elements
2. Click "Undo" button multiple times
3. Click "Redo" button

**Expected Result:**
- Changes revert step by step ✓
- Redo brings them back ✓
- History works correctly ✓

---

### ✅ TEST 7: Collapse Panel
**Steps:**
1. Click the orange collapse button (top-right of sidebar)
2. Make edits
3. Click collapse button again

**Expected Result:**
- Sidebar slides out of view ✓
- More space for viewer ✓
- Sidebar slides back in ✓

---

### ✅ TEST 8: Export
**Steps:**
1. Make several edits
2. Click "EXPORT" button

**Expected Result:**
- Downloads `edited-design.html` ✓
- File contains all your edits ✓
- CSS is embedded in the file ✓

---

## WHAT TO CHECK:

### ✓ CSS Loading:
- [ ] Single CSS file loads
- [ ] Multiple CSS files load
- [ ] @import in CSS works
- [ ] Folder path method works

### ✓ Editing:
- [ ] Click elements to select them
- [ ] Edit properties in sidebar
- [ ] Changes appear immediately
- [ ] Copy HTML works

### ✓ History:
- [ ] Undo works
- [ ] Redo works
- [ ] Clear resets everything

### ✓ UI:
- [ ] Collapse button works
- [ ] Toolbar is compact
- [ ] No layout issues

---

## TROUBLESHOOTING:

**If CSS doesn't load:**
- Make sure you selected the CSS files correctly
- Check browser console for errors (F12)
- Try the folder path method instead

**If images don't show:**
- Create a `test-image.png` file in the same folder
- Or paste the folder path in Base URL field

**If @import doesn't work:**
- This is normal - @import needs internet connection
- The tool injects CSS directly, so external @imports may not load

---

## SUCCESS CRITERIA:

✅ All 8 tests pass  
✅ Multiple CSS files work  
✅ Editing works smoothly  
✅ Undo/Redo works  
✅ Export produces valid HTML  

If all tests pass, the tool is working perfectly!
