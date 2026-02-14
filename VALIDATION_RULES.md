# Markdown Validation Rules & Fix Logic

## Validation Rules

### Headers
```javascript
// Rule: Header missing space after #
Pattern: /^(#{1,6})([^\s#].+)/
Example: "##Header" 
Fix: "## Header"

// Rule: Invalid header (>6 levels)
Pattern: /^#{7,}/
Example: "####### Text"
Fix: "###### Text"
```

### Blockquotes
```javascript
// Rule: Blockquote missing space after >
Pattern: /^(>+)([^\s>].+)/
Example: ">Text"
Fix: "> Text"
```

### Lists
```javascript
// Rule: Mixed list markers
Pattern: /^(\s*)([+*-])(\s*.+)/
Example: "* Item" or "+ Item"
Fix: "- Item" (standardize to dash, preserve indentation)

// Rule: List numbering skip
Pattern: /^(\d+)\.\s/
Example: "1. First" then "3. Third"
Fix: Suggests correct sequential number
```

### Tables
```javascript
// Rule: Table column mismatch
Check: cells.length !== tableHeaderCols
Example: Header has 3 columns, row has 2
Fix (missing): Add '<span style="color:red">COL_FIX!</span>' placeholders
Fix (extra): Remove excess columns

// Rule: Malformed table separator
Pattern: /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/
Example: "|---|" (no spaces)
Fix: "| --- | --- | ---" (match header column count)

// Rule: Table separator column mismatch
Check: separatorCols !== headerCols
Fix: Regenerate separator with correct column count
```

### Links & Images
```javascript
// Rule: Broken link syntax
Pattern: /\[[^\]]*\([^)]*$/
Example: "[text(" or "[text]("
Fix: "[text](URL_FIX!)"

// Rule: Broken image syntax
Pattern: /!\[([^\]]*)\]\s*\(.*$/ or /!\[([^\(]*)\(.*$/
Example: "![alt(" or "![alt]("
Fix: "![alt](IMAGE_URL_FIX!)"

// Rule: Empty link
Pattern: /\[\]\(\s*\)/ or /\[([^\]]+)\]\(\s*\)/
Example: "[]()" or "[text]()"
Fix: "[Link text](url)" or "[text](url)"

// Rule: Empty image URL
Pattern: /!\[([^\]]*)\]\(\s*\)/
Example: "![alt]()"
Fix: "![alt](image.png)"

// Rule: Empty alt text
Pattern: /!\[\]\(([^)]+)\)/
Example: "![](url)"
Fix: "![Image description](url)"
```

### Inline Formatting
```javascript
// Rule: Unclosed inline code
Check: Odd number of single backticks
Priority: Inside link → Inside table cell → End of line
Example: "`code" or "| `code |"
Fix: "`code`" or "| `code` |"

// Rule: Unclosed bold
Check: Odd number of ** markers
Example: "**bold text"
Fix: "**bold text**" (closes before table cell boundary if present)

// Rule: Unclosed italic
Check: Odd number of single * (excluding **)
Example: "*italic text"
Fix: "*italic text*" (closes before table cell boundary if present)
```

### HTML
```javascript
// Rule: Unclosed HTML tag
Pattern: /<(\w+)(?:\s[^>]*)?>(?!.*<\/\1>)/g
Excludes: img, br, hr, input, meta, link
Example: "<div>content"
Fix: "<div>content</div>"
```

### Code Blocks
```javascript
// Rule: Unclosed code block
Check: Unmatched ``` markers
Example: "```\ncode" (no closing ```)
Fix: "```\ncode\n```"
```

### Spacing
```javascript
// Rule: Missing blank line after heading
Check: Heading followed immediately by non-heading content
Example: "# Title\nContent"
Fix: Insert blank line above content

// Rule: List-table conflict
Check: List item immediately followed by table row
Example: "- Item\n| A | B |"
Fix: Insert blank line between list and table
```

### Horizontal Rules
```javascript
// Rule: Horizontal rule format
Pattern: /^[\*\-_]{3,}$/
Example: "***" or "___"
Fix: "---" (standardize to dashes)
```

---

## Fix Generation Logic

### Priority Order (for multiple fixes on same line)
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

### Special Fix Types

**Blank Line Insertion**
- Returns: `__INSERT_BLANK_LINE__`
- Handled separately from content fixes
- Inserts newline at start of current line
- Idempotent: Checks if previous line is already blank

**Table Column Fixes**
- Missing columns: Adds red HTML placeholder spans
- Extra columns: Removes from end, preserves pipe format
- Separator: Regenerates based on header column count

**Broken Link/Image Fixes**
- Finds last `[` or `![` in line
- Preserves content before broken link
- Adds placeholder URL: `URL_FIX!` or `IMAGE_URL_FIX!`
- User must manually replace placeholders

### Fix Application Strategies

**Single Fix**
```javascript
1. Get issue from validationIssues[currentFixIndex]
2. Check if blank line insertion
3. Apply fix using editor.executeEdits
4. Mark issue as 'fixed'
5. Update line decoration (green)
6. Move to next pending issue
```

**Multiple Fixes (Same Line)**
```javascript
1. Group issues by line number
2. Sort by priority order
3. Separate blank line markers from content fixes
4. Apply content fixes sequentially to evolving line
5. Apply final combined fix
6. Handle blank line insertions separately
```

**Apply All**
```javascript
1. Group pending issues by line number
2. Sort lines DESCENDING (bottom to top)
3. Apply all fixes for each line
4. Re-run validation
5. Repeat up to 10 iterations
6. Show summary
```

**Why Bottom-to-Top**: Prevents line number shifts when inserting blank lines

---

## Validation Detection Logic

### Table Detection
```javascript
1. Check if line contains '|'
2. Split by '|' to get cells
3. Check if separator row (all cells match /^[\s:-]+$/)
4. If separator:
   - Validate format
   - Check previous line is header
   - Compare column counts
   - Set inTable = true
5. If in table:
   - Check if next line is separator (new table)
   - Validate data row column count
6. If no '|' and in table:
   - Set inTable = false
```

### Code Block Tracking
```javascript
1. Maintain stack: codeBlockStarts[]
2. On '```':
   - If not in block: Push line number, set inCodeBlock = true
   - If in block: Pop from stack, set inCodeBlock = false
3. Skip validation inside code blocks
4. After processing all lines:
   - If stack not empty: Flag unclosed code block
```

### List Tracking
```javascript
1. Track lastListMarker and lastOrderedNumber
2. On unordered list item:
   - If marker != '-': Flag mixed markers
   - Update lastListMarker
3. On ordered list item:
   - Check if sequential
   - Update lastOrderedNumber
4. On non-list content:
   - Reset tracking
```

### Inline Formatting Detection
```javascript
Bold: Count '**' markers, must be even
Italic: Count single '*' (excluding '**'), must be even
Code: Count single '`' (excluding '``'), must be even
```

---

## Edge Cases & Limitations

### What Works
✅ Single-line fixes
✅ Table column mismatches
✅ Broken links/images with placeholders
✅ Unclosed formatting
✅ Blank line insertions
✅ Multiple fixes per line

### What May Fail
❌ Multi-line blockquotes (each line validated separately)
❌ Nested formatting (bold inside italic)
❌ Back-to-back tables (detection may fail)
❌ Markdown inside code blocks (false positives)
❌ Complex HTML (simple regex-based detection)
❌ Placeholder URLs (user must replace manually)
❌ Broken links with trailing text (may lose text)
❌ Incorrect indentation (preserves existing)

---

## Placeholder Conventions

- `COL_FIX!` - Missing table column (red HTML span)
- `URL_FIX!` - Missing link URL
- `IMAGE_URL_FIX!` - Missing image URL

Users must manually replace these placeholders with actual values.
