# Validation Auto-Fix Testing Guide

## Quick Test (5 minutes)

### Step 1: Open the Application
```bash
npm run dev
# OR open dist/index.html in browser
```

### Step 2: Load Test File
- Open `validation-edge-cases-test.md` in the editor
- Click the validation icon (✓) in the toolbar

### Step 3: Run Apply All
- Click "Apply All" button
- Wait for the iterative fix loop to complete
- Check the results

### Step 4: Verify Results

Expected fixes (should all happen in ONE click):

#### Lists (Section 1, 15)
```markdown
Before: * Item with asterisk
After:  - Item with asterisk

Before:   + Child with plus
After:    - Child with plus  (indentation preserved!)
```

#### Headers (Section 2, 3)
```markdown
Before: ###Missing space h3
After:  ### Missing space h3

Before: ####### This is h7
After:  ###### This is h7 (converted to h6)
```

#### Blockquotes (Section 4)
```markdown
Before: >Missing space quote
After:  > Missing space quote
```

#### Unclosed Formatting (Sections 5, 6, 7)
```markdown
Before: This is **unclosed bold text
After:  This is **unclosed bold text**

Before: This is `unclosed code
After:  This is `unclosed code`
```

#### Tables (Sections 8, 16)
```markdown
Before: | Cell 1 | Cell 2 | Cell 3 |
After:  | Cell 1 | Cell 2 | Cell 3 | <span style="color:red">COL_FIX!</span> | <span style="color:red">COL_FIX!</span> | <span style="color:red">COL_FIX!</span> |
```

#### Empty Images/Links (Sections 9, 10, 12)
```markdown
Before: ![Alt text]()
After:  ![Alt text](image.png)

Before: ![](image.png)
After:  ![Image description](image.png)

Before: []()
After:  [Link text](url)
```

#### 🔥 BROKEN IMAGES/LINKS (Sections 11, 13) - THE KEY FIX!
```markdown
Before: ![Broken image (
After:  ![Broken image](<span style="color:red">IMAGE_URL_FIX!</span>)

Before: [Broken link (
After:  [Broken link](<span style="color:red">URL_FIX!</span>)
```

## Console Testing

### Option 1: Run Automated Test
1. Open browser console (F12)
2. Copy and paste contents of `comprehensive-validation-test.js`
3. Press Enter
4. Check the output for pass/fail results

### Option 2: Manual Console Checks
```javascript
// Check if broken images are detected
const model = editor.getModel();
const markers = monaco.editor.getModelMarkers({ resource: model.uri });
const brokenImages = markers.filter(m => m.message.includes('Broken image'));
console.log('Broken images detected:', brokenImages.length);

// Check if broken links are detected  
const brokenLinks = markers.filter(m => m.message.includes('Broken link'));
console.log('Broken links detected:', brokenLinks.length);
```

## Detailed Testing Checklist

### Detection Tests
- [ ] Broken images with `(` are detected
- [ ] Broken images with `(text` are detected
- [ ] Broken links with `(` are detected
- [ ] Broken links with `(text` are detected
- [ ] Valid images are NOT flagged (no false positives)
- [ ] Valid links are NOT flagged (no false positives)

### Fix Generation Tests
- [ ] Broken images get red `IMAGE_URL_FIX!` placeholder
- [ ] Broken links get red `URL_FIX!` placeholder
- [ ] List indentation is preserved (2 spaces, 4 spaces, etc.)
- [ ] Table missing columns get red `COL_FIX!` placeholders
- [ ] Headers get space after `#`
- [ ] Unclosed formatting gets closing characters

### Apply All Tests
- [ ] All fixes apply in ONE click
- [ ] No errors in console
- [ ] Validation bar shows green "Fixed" state
- [ ] Re-running validation shows no remaining issues (or only placeholders)

### Edge Cases
- [ ] Multiple issues on same line are all fixed
- [ ] Nested lists preserve indentation
- [ ] Tables with multiple column mismatches are fixed
- [ ] Mixed content (list + unclosed bold + broken image) all fixed

## Common Issues

### Issue: "Broken images/links not detected"
**Check**: Are you testing on `validation-edge-cases-test.md` or `VALIDATION_FIX_SUMMARY.md`?
**Solution**: Use `validation-edge-cases-test.md` - the summary file has broken syntax in code blocks which won't be detected.

### Issue: "List indentation lost"
**Check**: Look at the console logs for `[generateFix]` messages
**Solution**: The regex should capture indentation - check if Monaco's edit operation is preserving it.

### Issue: "Table separator still wrong after header fix"
**Check**: Did you run "Apply All" or just "Apply" once?
**Solution**: The iterative loop should re-validate and fix the separator on the next pass.

### Issue: "Some fixes work, others don't"
**Check**: Console logs for errors or failed regex matches
**Solution**: Check the `[validate]` and `[generateFix]` debug logs to see where it's failing.

## Success Criteria

✅ All 20 edge case sections in `validation-edge-cases-test.md` are fixed
✅ Only ONE "Apply All" click needed
✅ Red placeholders clearly mark what needs manual fixing
✅ No false positives on valid markdown
✅ Console shows no errors

## Debug Logs to Check

Look for these in the console:
```
[validate] Line X - Testing image patterns: { line: "...", hasBracket: true, brokenMatch: true }
[validate] ✓ DETECTED broken image on line X
[generateFix] Broken image - testing regex
[generateFix] Broken image match: ["![Broken image (", "Broken image "]
[generateFix] Broken image fix: "![Broken image](<span style="color:red">IMAGE_URL_FIX!</span>)"
```

## Report Results

After testing, report:
1. How many edge cases were fixed in first "Apply All"? (Expected: 18-20)
2. Which edge cases still failed? (List section numbers)
3. Any console errors?
4. Screenshot of before/after if possible

---

**Ready to test!** Open the app and try it out. 🚀
