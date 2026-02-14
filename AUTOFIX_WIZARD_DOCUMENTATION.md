# Autofix Wizard Documentation

## Overview

The Autofix Wizard is an interactive validation and auto-fixing system for Markdown documents. It detects common Markdown syntax issues and provides automated fixes with a VSCode-style inline suggestion bar.

## Architecture

### Core Components

1. **Validation Engine** (`validateMarkdown`)
   - Runs on content change (debounced 500ms)
   - Creates Monaco editor markers for issues
   - Tracks validation state per line

2. **Fix Generator** (`generateFix`)
   - Analyzes each validation marker
   - Generates suggested fix text
   - Returns fix description for UI

3. **Interactive Wizard** (`editor._interactiveFixWizard`)
   - Main entry point (triggered by "Auto-Fix Issues" link)
   - Creates inline suggestion bar
   - Manages fix workflow (apply/skip/navigate)

4. **Inline Suggestion Bar** (UI Component)
   - Positioned below error line
   - Shows issue counter, message, preview
   - Buttons: Apply, Apply All, Skip, Discard All, Prev/Next

---

## Validation Rules

### Headers
- **Missing space after #**: `##Header` → `## Header`
- **Invalid header (>6 levels)**: `####### Text` → `###### Text`

### Blockquotes
- **Missing space after >**: `>Text` → `> Text`

### Lists
- **Mixed list markers**: Standardizes to `-` marker
  - Preserves indentation
  - Example: `* Item` → `- Item`
- **List numbering skip**: Detects non-sequential ordered lists
  - Example: `1. First` `3. Third` → suggests `2.`

### Tables
- **Column mismatch**: Adds/removes columns to match header
  - Missing columns: Adds `<span style="color:red">COL_FIX!</span>`
  - Extra columns: Removes excess
- **Malformed separator**: Fixes separator row format
  - Uses header row column count
  - Example: `|---|` → `| --- | --- | --- |`
- **Separator column mismatch**: Regenerates separator to match header

### Links & Images
- **Broken link syntax**: `[text(` → `[text](URL_FIX!)`
  - Handles multiple patterns: missing ], missing ), both
  - Only fixes the broken link, preserves rest of line
- **Broken image syntax**: `![alt(` → `![alt](IMAGE_URL_FIX!)`
- **Empty link**: `[text]()` → `[text](url)`
- **Empty image URL**: `![alt]()` → `![alt](image.png)`
- **Empty alt text**: `![]()` → `![Image description]()`

### Inline Formatting
- **Unclosed inline code**: Adds closing backtick
  - Priority: inside link → inside table cell → end of line
- **Unclosed bold**: Adds closing `**`
  - Detects table cell boundaries
- **Unclosed italic**: Adds closing `*`
  - Distinguishes from bold markers

### HTML
- **Unclosed HTML tags**: Adds closing tag
  - Skips self-closing tags (img, br, hr, etc.)

### Code Blocks
- **Unclosed code block**: Adds closing ``` on new line

### Spacing
- **Missing blank line after heading**: Inserts blank line
- **List-table conflict**: Inserts blank line between list and table

### Horizontal Rules
- **Horizontal rule format**: Standardizes to `---`

---

## Fix Application Logic

### Single Fix (`applyCurrentFix`)
1. Gets current issue from `validationIssues[currentFixIndex]`
2. Checks if fix is blank line insertion (`__INSERT_BLANK_LINE__`)
3. Applies fix using `editor.executeEdits`
4. Marks issue as 'fixed'
5. Updates line decoration (green)
6. Moves to next pending issue or closes wizard

### Multiple Fixes (`applyMultipleFixesToLine`)
**Purpose**: Apply multiple fixes to the same line in one operation

**Process**:
1. Sort markers by priority (structural → formatting)
2. Separate blank line markers from content fixes
3. Apply content fixes sequentially to evolving line
4. Apply final combined fix to editor
5. Handle blank line insertions separately

**Priority Order**:
1. Header missing space
2. Invalid header
3. Blockquote missing space
4. Mixed list markers
5. Broken image syntax
6. Broken link syntax
7. Empty image URL
8. Empty link
9. Empty alt text
10. Unclosed bold
11. Unclosed italic
12. Unclosed inline code

### Apply All Fixes (`applyAllFixes`)
**Purpose**: Automatically fix all pending issues

**Algorithm**:
1. Group pending issues by line number
2. Sort lines in DESCENDING order (bottom to top)
   - **Critical**: Prevents line number shifts
3. Apply all fixes for each line using `applyMultipleFixesToLine`
4. Mark issues as 'fixed', update decorations
5. Re-run validation to detect new issues
6. Repeat up to 10 iterations
7. Close wizard and show summary

**Why Bottom-to-Top**:
- Inserting blank lines shifts line numbers below
- Processing from bottom prevents line number invalidation
- Example: Fixing line 10 before line 5 keeps line 5's number stable

---

## State Management

### Issue States
- **pending**: Not yet processed
- **fixed**: Successfully applied
- **skipped**: User chose to skip

### Line Decorations
- **error** (red): Current pending issue
- **fixed** (green): Successfully fixed
- **skipped** (blue): User skipped

### Global State Variables
```javascript
let currentSuggestionBar = null;  // DOM element
let currentFixIndex = 0;           // Current issue index
let validationIssues = [];         // Array of {marker, suggestedFix, fixDescription, state}
let lineDecorations = [];          // Monaco decoration IDs
```

---

## Known Limitations & Edge Cases

### What Works Well
✅ Single-line fixes (headers, blockquotes, lists)
✅ Table column mismatches with placeholders
✅ Broken links/images with placeholder URLs
✅ Unclosed formatting (bold, italic, code)
✅ Blank line insertions
✅ Multiple fixes on same line

### What May Break

#### 1. **Multi-line Structures**
- **Issue**: Validation is line-based
- **Breaks**: Multi-line blockquotes, nested lists, table rows spanning multiple lines
- **Example**: 
  ```markdown
  > This is a
  > multi-line quote
  ```
  Each line validated separately, may suggest redundant fixes

#### 2. **Complex Nested Formatting**
- **Issue**: Fix generator processes sequentially
- **Breaks**: `**bold *italic** text*` - unclosed italic inside bold
- **Reason**: Bold fix may close before italic is detected

#### 3. **Table Edge Cases**
- **Issue**: New table detection relies on separator pattern
- **Breaks**: Back-to-back tables without blank line
- **Example**:
  ```markdown
  | A | B |
  | --- | --- |
  | 1 | 2 |
  | C | D |
  | --- | --- |
  ```
  Second table may be treated as continuation of first

#### 4. **Code Block Content**
- **Issue**: Validation runs on raw markdown
- **Breaks**: Markdown syntax inside code blocks triggers false positives
- **Example**:
  ````markdown
  ```
  # This is not a header
  ```
  ````
  May flag "Missing blank line after heading"

#### 5. **HTML in Markdown**
- **Issue**: Simple regex-based HTML tag detection
- **Breaks**: Complex HTML, attributes with >, nested tags
- **Example**: `<div data-value=">">` - false positive for unclosed tag

#### 6. **Link/Image URL Validation**
- **Issue**: Only checks syntax, not URL validity
- **Breaks**: Placeholder URLs (`URL_FIX!`, `IMAGE_URL_FIX!`) are syntactically valid
- **User must**: Manually replace placeholders with real URLs

#### 7. **Blank Line Insertion Timing**
- **Issue**: Blank line insertion shifts line numbers
- **Breaks**: If multiple blank lines needed on consecutive lines
- **Mitigation**: Apply All processes bottom-to-top, but edge cases remain

#### 8. **Validation Re-run Timing**
- **Issue**: 150ms delay between Apply All iterations
- **Breaks**: If user edits during Apply All, may apply fixes to wrong lines
- **Mitigation**: Disable editing during Apply All (not currently implemented)

#### 9. **Broken Link/Image at Line End**
- **Issue**: Regex may not capture all trailing text
- **Breaks**: `[text](url) more text` where link is broken
- **Example**: `[text( more text` → may only fix `[text](URL_FIX!)`, losing "more text"

#### 10. **List Indentation Edge Cases**
- **Issue**: Mixed list marker fix preserves indentation
- **Breaks**: If indentation itself is incorrect (tabs vs spaces)
- **Example**: `\t* Item` → `\t- Item` (preserves tab, may not match style)

---

## Debugging

### Console Logging
The wizard includes extensive console logging:
- `[generateFix]` - Fix generation attempts
- `[applyMultiple]` - Multiple fix application
- `[applyAll]` - Apply All iterations
- `[insertBlankLineAbove]` - Blank line insertion
- `[applyCurrentFix]` - Single fix application

### Enable Debugging
All debug logs are already in the code. Open browser console to see them.

### Common Debug Patterns
```javascript
// Check if wizard is available
console.log('Editor:', !!editor);
console.log('Wizard:', !!(editor && editor._interactiveFixWizard));

// Check validation state
console.log('Validation enabled:', validationEnabled);

// Check current issues
console.log('Issues:', validationIssues);
console.log('Current index:', currentFixIndex);
```

---

## API Reference

### Public Methods

#### `editor._interactiveFixWizard()`
Starts the interactive fix wizard.
- **Returns**: Promise<void>
- **Side effects**: Creates inline suggestion bar, navigates to first issue

#### `editor._exportValidationErrors()`
Exports validation report as Markdown.
- **Returns**: string (Markdown formatted report)
- **Groups by**: Errors, Warnings, Info

#### `editor._validateMarkdown()`
Manually triggers validation.
- **Returns**: void
- **Side effects**: Updates Monaco markers

#### `editor._setValidationEnabled(enabled)`
Enables/disables validation.
- **Parameters**: enabled (boolean)
- **Side effects**: Runs validation if enabled, clears markers if disabled

---

## Integration Points

### HTML Elements
- `#autofix-validation-link` - Triggers wizard
- `#export-validation-link` - Exports report
- `#validation-checkbox` - Enables/disables validation

### Event Listeners
- **Autofix link click**: Calls `editor._interactiveFixWizard()`
- **Export link click**: Calls `editor._exportValidationErrors()`, copies to clipboard
- **Validation checkbox change**: Calls `editor._setValidationEnabled()`

### Monaco Editor Integration
- **Markers**: Uses `monaco.editor.setModelMarkers()` for issue display
- **Decorations**: Uses `editor.deltaDecorations()` for line highlighting
- **Edits**: Uses `editor.executeEdits()` for applying fixes

---

## Future Improvements

### Potential Enhancements
1. **Multi-line validation**: Track structure across lines
2. **Code block awareness**: Skip validation inside code blocks
3. **Undo/Redo support**: Group fixes into single undo operation
4. **Custom rules**: Allow users to configure validation rules
5. **Fix preview**: Show diff before applying
6. **Batch mode**: Apply all fixes without UI (for CI/CD)
7. **Rule severity**: Allow users to set severity levels
8. **Auto-fix on save**: Option to auto-fix on manual save

### Known Bugs to Fix
1. Blank line insertion may fail on first line
2. Apply All may skip issues if validation re-run is too slow
3. Broken link fix may lose trailing text
4. Table detection fails for back-to-back tables

---

## Testing Recommendations

### Test Cases to Cover
1. **Single fixes**: Each validation rule individually
2. **Multiple fixes per line**: Header + unclosed code on same line
3. **Blank line insertion**: After headers, between lists and tables
4. **Apply All**: Document with 10+ issues across multiple lines
5. **Edge cases**: Nested formatting, complex tables, HTML in markdown
6. **User interaction**: Skip, navigate prev/next, discard all
7. **Re-validation**: Apply All with iterative fixes

### Test Documents
Create test files with:
- All validation rules triggered
- Multiple issues per line
- Edge cases from "What May Break" section
- Real-world documents (CVs, READMEs, documentation)

---

## Conclusion

The Autofix Wizard is a powerful tool for cleaning up Markdown documents, but it has limitations. It works best for:
- Simple, single-line issues
- Standard Markdown syntax
- Documents without complex nesting

It may struggle with:
- Multi-line structures
- Complex nested formatting
- Edge cases in tables and lists

Always review fixes before committing, especially when using "Apply All".
