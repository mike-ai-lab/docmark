input:

``````markdown
### 31. The Recursive Loop
1. Item one
   - Nested [Link with **bold** and `code`](http://valid.com)
   - > Blockquote inside a list with an ![Image](img.png)
2. Item two with an unclosed **bold [link](http://test.com)

### 32. Table with Multi-line Hack
| Header |
| --- |
| Line 1 <br> Line 2 |
| `|` escaped pipe in code |

### 33. Absolute Chaos
* [ ] Task list with **bold *italic `code` mixed** with [broken link (
``````


# output:

````markdown
### 31. The Recursive Loop

1. Item one
   - Nested [Link with **bold** and `code`](http://valid.com)
   - > Blockquote inside a list with an ![Image](img.png)
2. Item two with an unclosed **bold [link](http://test.com)**

### 32. Table with Multi-line Hack

| Header |
| --- |
| Line 1 <br> Line 2 |
| ` |

### 33. Absolute Chaos

- [] Task list with **bold *italic `code` mixed** with [broken link](URL_FIX!)
````

---

# console:

````
16:31:28.613 main.js:820 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
16:31:28.614 main.js:821 [generateFix] Line: 1. Item one
16:31:28.614 main.js:820 [generateFix] Message: Unclosed bold: Add closing ** (e.g., **bold text**)
16:31:28.614 main.js:821 [generateFix] Line: 2. Item two with an unclosed **bold [link](http://test.com)
16:31:28.614 main.js:820 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
16:31:28.614 main.js:821 [generateFix] Line: | Header |
16:31:28.614 main.js:820 [generateFix] Message: Table column mismatch: Expected 1 columns, got 2
16:31:28.614 main.js:821 [generateFix] Line: | `|` escaped pipe in code |
16:31:28.615 main.js:820 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
16:31:28.615 main.js:821 [generateFix] Line: * [ ] Task list with **bold *italic `code` mixed** with [broken link (
16:31:28.615 main.js:820 [generateFix] Message: Broken link syntax: Missing closing bracket ] or parenthesis )
16:31:28.615 main.js:821 [generateFix] Line: * [ ] Task list with **bold *italic `code` mixed** with [broken link (
16:31:28.615 main.js:1001 [generateFix] Broken link - testing regex
16:31:28.615 main.js:1016 [generateFix] Broken link match: (2) ['[ ] Task list with **bold *italic `code` mixed** with [broken link (', ' ] Task list with **bold *italic `code` mixed** with [broken link ', index: 2, input: '* [ ] Task list with **bold *italic `code` mixed** with [broken link (', groups: undefined]
16:31:28.616 main.js:1022 [generateFix] Broken link fix: * [] Task list with **bold *italic `code` mixed** with [broken link](URL_FIX!)
16:31:28.616 main.js:820 [generateFix] Message: Mixed list markers: Use consistent marker (-)
16:31:28.616 main.js:821 [generateFix] Line: * [ ] Task list with **bold *italic `code` mixed** with [broken link (
16:31:30.046 main.js:1254 [applyAll] ========== ITERATION 1 ==========
16:31:30.046 main.js:1268 [applyAll] Issues by line: 5
16:31:30.046 main.js:1269 [applyAll] Line numbers: (5) [2, 5, 8, 11, 14]
16:31:30.047  [applyAll] Processing lines (bottom to top): (5) [14, 11, 8, 5, 2]
16:31:30.047  [applyAll] Processing line 14
16:31:30.048  [applyMultiple] Line 14 - Markers: 3
16:31:30.048  [applyMultiple] BEFORE: * [ ] Task list with **bold *italic `code` mixed** with [broken link (
16:31:30.048  [applyMultiple] Sorted markers: (3) ['Mixed list markers: Use consistent marker (-)', 'Broken link syntax: Missing closing bracket ] or parenthesis )', 'Missing blank line after heading: Add blank line for better readability']
16:31:30.049  [generateFix] Message: Mixed list markers: Use consistent marker (-)
16:31:30.049  [generateFix] Line: * [ ] Task list with **bold *italic `code` mixed** with [broken link (
16:31:30.049  [applyMultiple] Applying: Standardize to - marker
16:31:30.050  [applyMultiple] From: * [ ] Task list with **bold *italic `code` mixed** with [broken link (
16:31:30.050  [applyMultiple] To: - [ ] Task list with **bold *italic `code` mixed** with [broken link (
16:31:30.050  [generateFix] Message: Broken link syntax: Missing closing bracket ] or parenthesis )
16:31:30.050  [generateFix] Line: - [ ] Task list with **bold *italic `code` mixed** with [broken link (
16:31:30.050  [generateFix] Broken link - testing regex
16:31:30.051  [generateFix] Broken link match: (2) ['[ ] Task list with **bold *italic `code` mixed** with [broken link (', ' ] Task list with **bold *italic `code` mixed** with [broken link ', index: 2, input: '- [ ] Task list with **bold *italic `code` mixed** with [broken link (', groups: undefined]
16:31:30.051  [generateFix] Broken link fix: - [] Task list with **bold *italic `code` mixed** with [broken link](URL_FIX!)
16:31:30.051  [applyMultiple] Applying: Add missing brackets/parenthesis and placeholder URL
16:31:30.052  [applyMultiple] From: - [ ] Task list with **bold *italic `code` mixed** with [broken link (
16:31:30.052  [applyMultiple] To: - [] Task list with **bold *italic `code` mixed** with [broken link](URL_FIX!)
16:31:30.052  [generateFix] Message: Missing blank line after heading: Add blank line for better readability
16:31:30.052  [generateFix] Line: - [] Task list with **bold *italic `code` mixed** with [broken link](URL_FIX!)
16:31:30.052  [applyMultiple] Applying: Insert blank line above
16:31:30.052  [applyMultiple] From: - [] Task list with **bold *italic `code` mixed** with [broken link](URL_FIX!)
16:31:30.053  [applyMultiple] To: 
- [] Task list with **bold *italic `code` mixed** with [broken link](URL_FIX!)
16:31:30.053  [applyMultiple] AFTER: 
- [] Task list with **bold *italic `code` mixed** with [broken link](URL_FIX!)
16:31:30.064  [applyAll] ✓ Fixed line 14 - 3 issues
16:31:30.065  [applyAll] Processing line 11
16:31:30.065  [applyMultiple] Line 11 - Markers: 1
16:31:30.066 main.js:1053 [applyMultiple] BEFORE: | `|` escaped pipe in code |
16:31:30.066 main.js:1077 [applyMultiple] Sorted markers: ['Table column mismatch: Expected 1 columns, got 2']
16:31:30.066 main.js:820 [generateFix] Message: Table column mismatch: Expected 1 columns, got 2
16:31:30.066 main.js:821 [generateFix] Line: | `|` escaped pipe in code |
16:31:30.067 main.js:1083 [applyMultiple] Applying: Remove 1 extra column(s)
16:31:30.067 main.js:1084 [applyMultiple] From: | `|` escaped pipe in code |
16:31:30.067 main.js:1085 [applyMultiple] To: | ` |
16:31:30.067 main.js:1091 [applyMultiple] AFTER: | ` |
16:31:30.074 main.js:1303 [applyAll] ✓ Fixed line 11 - 1 issues
16:31:30.074 main.js:1291 [applyAll] Processing line 8
16:31:30.074 main.js:1052 [applyMultiple] Line 8 - Markers: 1
16:31:30.075 main.js:1053 [applyMultiple] BEFORE: | Header |
16:31:30.075 main.js:1077 [applyMultiple] Sorted markers: ['Missing blank line after heading: Add blank line for better readability']
16:31:30.075 main.js:820 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
16:31:30.075 main.js:821 [generateFix] Line: | Header |
16:31:30.075 main.js:1083 [applyMultiple] Applying: Insert blank line above
16:31:30.075 main.js:1084 [applyMultiple] From: | Header |
16:31:30.076 main.js:1085 [applyMultiple] To: 
| Header |
16:31:30.076 main.js:1091 [applyMultiple] AFTER: 
| Header |
16:31:30.082 main.js:1303 [applyAll] ✓ Fixed line 8 - 1 issues
16:31:30.083 main.js:1291 [applyAll] Processing line 5
16:31:30.084 main.js:1052 [applyMultiple] Line 5 - Markers: 1
16:31:30.084 main.js:1053 [applyMultiple] BEFORE: 2. Item two with an unclosed **bold [link](http://test.com)
16:31:30.084 main.js:1077 [applyMultiple] Sorted markers: ['Unclosed bold: Add closing ** (e.g., **bold text**)']
16:31:30.085 main.js:820 [generateFix] Message: Unclosed bold: Add closing ** (e.g., **bold text**)
16:31:30.085 main.js:821 [generateFix] Line: 2. Item two with an unclosed **bold [link](http://test.com)
16:31:30.086 main.js:1083 [applyMultiple] Applying: Add closing **
16:31:30.086 main.js:1084 [applyMultiple] From: 2. Item two with an unclosed **bold [link](http://test.com)
16:31:30.086 main.js:1085 [applyMultiple] To: 2. Item two with an unclosed **bold [link](http://test.com)**
16:31:30.086 main.js:1091 [applyMultiple] AFTER: 2. Item two with an unclosed **bold [link](http://test.com)**
16:31:30.092 main.js:1303 [applyAll] ✓ Fixed line 5 - 1 issues
16:31:30.092 main.js:1291 [applyAll] Processing line 2
16:31:30.093 main.js:1052 [applyMultiple] Line 2 - Markers: 1
16:31:30.093 main.js:1053 [applyMultiple] BEFORE: 1. Item one
16:31:30.093 main.js:1077 [applyMultiple] Sorted markers: ['Missing blank line after heading: Add blank line for better readability']
16:31:30.093 main.js:820 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
16:31:30.093 main.js:821 [generateFix] Line: 1. Item one
16:31:30.093 main.js:1083 [applyMultiple] Applying: Insert blank line above
16:31:30.094 main.js:1084 [applyMultiple] From: 1. Item one
16:31:30.094 main.js:1085 [applyMultiple] To: 
1. Item one
16:31:30.094 main.js:1091 [applyMultiple] AFTER: 
1. Item one
16:31:30.099 main.js:1303 [applyAll] ✓ Fixed line 2 - 1 issues
16:31:30.100 main.js:1309 [applyAll] Total fixed so far: 7
16:31:30.252 main.js:1314 [applyAll] Re-validating...
16:31:30.253 main.js:1319 [applyAll] New pending issues: 0
16:31:30.253 main.js:1326 [applyAll] ✓ ALL DONE - Fixed 7 issues total
````