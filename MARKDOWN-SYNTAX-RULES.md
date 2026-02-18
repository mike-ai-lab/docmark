# DocMark Editor - Valid Markdown Syntax Rules

This document defines the valid Markdown syntax accepted by the DocMark editor's validator. AI assistants should follow these rules when generating or modifying Markdown content.

---

## 1. HEADINGS

### ✅ Valid Syntax
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### ❌ Invalid Syntax
```markdown
#Heading without space
####### Too many hashes (h7 doesn't exist)
```

### Rules
- Must have space after `#` symbols
- Only h1-h6 supported (1-6 hash symbols)
- Should have blank line after heading for readability

---

## 2. LISTS

### ✅ Valid Syntax - Unordered Lists
```markdown
- Item 1
- Item 2
- Item 3
  - Nested item
  - Another nested item
```

### ❌ Invalid Syntax - Unordered Lists
```markdown
* Item 1
* Item 2

+ Item 1
+ Item 2
```

### Rules
- **ALWAYS use dash `-` for unordered lists**
- Do NOT use asterisk `*` or plus `+`
- Validator will flag `*` and `+` as "Mixed list markers"
- Indent nested items with 2 spaces

### ✅ Valid Syntax - Ordered Lists
```markdown
1. First item
2. Second item
3. Third item
   1. Nested item
   2. Another nested item
```

### Rules
- Use sequential numbering (1, 2, 3...)
- Can restart numbering at 1 for nested lists
- Indent nested items with 3 spaces

---

## 3. EMPHASIS

### ✅ Valid Syntax
```markdown
**bold text**
*italic text*
***bold and italic***
```

### ❌ Invalid Syntax
```markdown
**unclosed bold
*unclosed italic
```

### Rules
- Bold: `**text**` (double asterisk)
- Italic: `*text*` (single asterisk)
- Must be properly closed
- Can be combined: `***text***`

---

## 4. LINKS

### ✅ Valid Syntax
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title")
```

### ❌ Invalid Syntax
```markdown
[Broken link(https://example.com)
[](https://example.com)
[]()
```

### Rules
- Format: `[text](url)`
- Must have link text (not empty)
- Must have closing `]` and `)`
- URL should not be empty

---

## 5. IMAGES

### ✅ Valid Syntax
```markdown
![Alt text](image.png)
![Logo](https://example.com/logo.png)
![Descriptive alt text](path/to/image.jpg "Optional title")
```

### ❌ Invalid Syntax
```markdown
![Broken image(image.png)
![](image.png)
![Alt text]()
```

### Rules
- Format: `![alt](url)`
- Should have alt text for accessibility
- Must have image URL
- Must have closing `]` and `)`

---

## 6. CODE

### ✅ Valid Syntax - Inline Code
```markdown
Use `inline code` for short snippets.
```

### ✅ Valid Syntax - Code Blocks
````markdown
```javascript
function example() {
  return true;
}
```
````

### ❌ Invalid Syntax
```markdown
Unclosed `inline code
```

### Rules
- Inline code: Single backtick `` `code` ``
- Code blocks: Triple backticks ` ``` ` on separate lines
- Must be properly closed
- Code blocks must have closing ` ``` `

---

## 7. BLOCKQUOTES

### ✅ Valid Syntax
```markdown
> This is a quote
> Multiple lines
> 
> New paragraph in quote

> Single line quote
```

### ❌ Invalid Syntax
```markdown
>No space after >
```

### Rules
- Must have space after `>`
- Can span multiple lines
- Can contain other Markdown elements

---

## 8. HORIZONTAL RULES

### ✅ Valid Syntax
```markdown
---

***

___
```

### ❌ Invalid Syntax
```markdown
-*-
--*
```

### Rules
- Use 3 or more consistent characters
- Must be all dashes, asterisks, OR underscores
- Cannot mix characters
- Should be on its own line

---

## 9. TABLES

### ✅ Valid Syntax
```markdown
| Header 1 | Header 2 | Header 3 |
| --- | --- | --- |
| Cell 1 | Cell 2 | Cell 3 |
| Cell 4 | Cell 5 | Cell 6 |
```

### ✅ Valid Syntax - Alignment
```markdown
| Left | Center | Right |
| :--- | :---: | ---: |
| L1 | C1 | R1 |
```

### ❌ Invalid Syntax
```markdown
| Header 1 | Header 2 |
|---|---|
| Cell 1 | Cell 2 | Cell 3 |

- List item
| Header | Header |
```

### Rules
- Must have header row
- Must have separator row with `---`
- Separator format: `| --- | --- |` with spaces
- All rows must have same number of columns
- Add blank line between list and table

---

## 10. HTML TAGS

### ✅ Valid Syntax
```markdown
<div>Content</div>
<span>Inline</span>
<br>
<img src="image.png" alt="Alt">
```

### ❌ Invalid Syntax
```markdown
<div>Unclosed tag
<custom-tag>Unknown tag</custom-tag>
```

### Rules
- Self-closing tags don't need closing tag: `<br>`, `<img>`
- Block tags must be closed: `<div></div>`
- Common tags supported: div, span, p, a, img, br, hr, etc.

---

## 11. SVG

### ✅ Valid Syntax - Single Line (Recommended)
```markdown
<svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>
```

### ⚠️ Valid but Flagged - Multi-line
```markdown

<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="blue"/>
</svg>

```

### Rules
- Single-line SVG is preferred
- Multi-line SVG needs blank lines before AND after
- Validator will suggest converting to single-line

---

## 12. SPACING RULES

### Important Spacing Guidelines

1. **After Headings**: Add blank line after heading
   ```markdown
   # Heading
   
   Content starts here
   ```

2. **Between Lists and Tables**: Add blank line
   ```markdown
   - List item
   
   | Table | Header |
   | --- | --- |
   ```

3. **Around Code Blocks**: Blank lines recommended
   ````markdown
   Text before
   
   ```
   code
   ```
   
   Text after
   ````

---

## AI ASSISTANT GUIDELINES

When generating or modifying Markdown content:

1. **Lists**: ALWAYS use `-` for unordered lists, never `*` or `+`
2. **Headings**: Always add space after `#`
3. **Emphasis**: Ensure all bold/italic markers are closed
4. **Links/Images**: Always include text/alt and URL
5. **Tables**: Ensure consistent column count
6. **Spacing**: Add blank lines after headings and between different elements
7. **Code**: Always close inline code and code blocks
8. **Blockquotes**: Add space after `>`
9. **SVG**: Prefer single-line format
10. **HTML**: Close all non-self-closing tags

---

## VALIDATION SEVERITY LEVELS

- **Error** (Red): Broken syntax that prevents proper rendering
  - Unclosed tags, broken links, empty URLs
  
- **Warning** (Yellow): Syntax issues that may cause problems
  - Unclosed emphasis, malformed tables, missing spaces
  
- **Info** (Blue): Style/consistency suggestions
  - Mixed list markers, missing blank lines, list numbering

---

## QUICK REFERENCE FOR AI

```markdown
# Heading (space required)

- List item (use dash only)
- Another item

**bold** and *italic*

[Link text](url)
![Alt text](image.url)

`inline code`

> Blockquote (space after >)

---

| Table | Header |
| --- | --- |
| Cell | Cell |
```

---

**Last Updated**: 2026-02-18
**Editor Version**: DocMark 1.0.0

## IT FLAGGED THIS AND THE SUGGESTIONS WAS `Missing blank line after heading: Add blank line for better readability → __INSERT_BLANK_LINE__`

```
### 11. Code Quality
- [x] Well-organized code structure
- [x] Comprehensive comments
- [x] Error handling
- [x] Proper cleanup on toggle
- [x] No breaking changes to existing features
```

## SO WHEN I APPLIED THE FIXES, THE OUTPUT WAS STILL AS:

```
### 11. Code Quality
- [x] Well-organized code structure
- [x] Comprehensive comments
- [x] Error handling
- [x] Proper cleanup on toggle
- [x] No breaking changes to existing features
```