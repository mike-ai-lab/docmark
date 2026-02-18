# HTML Code Block Detection Feature

## Summary

Added validator rule to detect when HTML code is wrapped in code blocks and should be rendered instead.

---

## Problem

When AI generates HTML code, it often wraps it in markdown code blocks:

````markdown
```html
<div>Content</div>
```
````

This displays the HTML as code instead of rendering it. Users have to manually remove the code block syntax.

---

## Solution

Implemented TWO complementary solutions:

### 1. Validator Rule (Automatic Detection & Fix)

**Location**: `src/validation-wizard.js` lines 67-105

**Detection Logic**:
- Detects ````html` code blocks
- Checks if content is substantial HTML (not just a snippet)
- Flags if:
  - Starts with `<!DOCTYPE`, `<html>`, or common block tags
  - Has 2+ top-level block tags (div, section, article, etc.)

**Fix Logic**:
- Removes opening ````html` line
- Removes closing ` ``` ` line
- HTML renders directly in preview

**Implementation**:
```javascript
// Detection
if (trimmed === '```html' || trimmed === '```HTML') {
    // Collect content until closing ```
    // Check if it's full HTML or substantial structure
    // Flag if true
}

// Fix generation
else if (marker.message.includes('HTML code in code block')) {
    suggestedFix = '__UNWRAP_HTML_CODE_BLOCK__';
    fixDescription = 'Remove code block syntax to render HTML';
}

// Fix application
else if (issue.suggestedFix === '__UNWRAP_HTML_CODE_BLOCK__') {
    unwrapHTMLCodeBlock(lineNumber);
}

// Unwrap function
const unwrapHTMLCodeBlock = (lineNumber) => {
    // Find closing ``` line
    // Remove closing line first
    // Remove opening line
    // HTML now renders directly
};
```

---

### 2. AI Prompt Instructions (Prevention)

**Location**: `src/ai/ai-prompts.js`

**Changes**: Added explicit instructions to ALL prompts:

```javascript
MARKDOWN RULES:
- Use dash (-) for unordered lists, NEVER asterisk (*) or plus (+)
- Add space after # in headings
- If generating HTML code, output it DIRECTLY without wrapping in code blocks
- Do NOT use ```html syntax for HTML content
- HTML should be rendered, not displayed as code
```

**Impact**:
- AI will generate HTML without code blocks
- Reduces need for manual fixes
- Better user experience

---

## Detection Criteria

### Will Flag (Substantial HTML):
1. **Full HTML documents**:
   ```html
   <!DOCTYPE html>
   <html>...</html>
   ```

2. **Multiple block-level tags**:
   ```html
   <div>...</div>
   <div>...</div>
   ```

3. **Complex structures**:
   ```html
   <form>
     <input>
     <button>
   </form>
   ```

### Will NOT Flag (Code Examples):
1. **Small snippets**:
   ```html
   <span>text</span>
   ```

2. **Non-HTML code**:
   ```javascript
   function test() {}
   ```

3. **Already rendered HTML**:
   ```markdown
   <div>Rendered directly</div>
   ```

4. **SVG examples**:
   ```html
   <svg>...</svg>
   ```

---

## User Workflow

### Before (Manual):
1. AI generates HTML in code block
2. User sees code displayed, not rendered
3. User manually removes ` ```html ` and ` ``` `
4. HTML renders

### After (Automatic):
1. AI generates HTML (hopefully without code blocks due to prompts)
2. If wrapped in code blocks, validator flags it
3. User clicks "Apply Fix"
4. Code block syntax removed automatically
5. HTML renders

---

## Testing

Created test document: `test-html-code-block-detection.md`

### Test Cases:
- ✅ Test 1: Full HTML document (should flag)
- ✅ Test 2: Multiple divs (should flag)
- ✅ Test 3: JavaScript code (should NOT flag)
- ✅ Test 4: Small snippet (should NOT flag)
- ✅ Test 5: Already rendered (should NOT flag)
- ✅ Test 6: Form HTML (should flag)
- ✅ Test 7: SVG example (should NOT flag)

---

## Benefits

1. **Automatic Detection**: Validator catches wrapped HTML
2. **One-Click Fix**: Remove code blocks with single click
3. **AI Prevention**: Updated prompts reduce occurrences
4. **Smart Detection**: Only flags substantial HTML, not examples
5. **Better UX**: HTML renders immediately after fix

---

## Edge Cases Handled

1. **Small snippets**: Not flagged (likely examples)
2. **SVG**: Not flagged (often shown as examples)
3. **Non-HTML code**: Not flagged (JavaScript, Python, etc.)
4. **Already rendered**: Not flagged (no code blocks)
5. **Mixed content**: Only flags HTML code blocks

---

## Files Modified

1. `src/validation-wizard.js`:
   - Added HTML code block detection (lines 67-105)
   - Added fix generation (lines 900-903)
   - Added fix application (lines 1371-1374)
   - Added `unwrapHTMLCodeBlock()` function (lines 1180-1220)

2. `src/ai/ai-prompts.js`:
   - Added Markdown rules to all prompts
   - Explicit HTML generation instructions
   - Emphasis on dash (-) for lists

3. `test-html-code-block-detection.md`:
   - Comprehensive test document (NEW)

4. `HTML-CODE-BLOCK-FEATURE.md`:
   - This documentation (NEW)

---

## Future Enhancements

1. **Configuration**: Allow users to disable this rule
2. **Threshold**: Configurable minimum HTML size to flag
3. **Whitelist**: Allow specific tags to be in code blocks
4. **Preview**: Show before/after preview when applying fix

---

## Conclusion

This feature solves a common pain point where AI-generated HTML is displayed as code instead of being rendered. The combination of validator detection and AI prompt instructions provides both automatic fixing and prevention.

---

**Status**: ✅ IMPLEMENTED
**Date**: 2026-02-18
**Impact**: High (improves AI-generated HTML workflow)
