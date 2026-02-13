beautification test:

## input:
`````
### 53. The Bi-Directional Table
| Item ID | Description (وصف) | Status |
| --- | --- | --- |
| A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order ( |
| B-202 | Glass Panel @ 200cm | `In-Progress |

### 54. The "Ghost" Line
This line contains a [Broken Link ( and ends with a trailing backslash \
and a **bold that spans
onto a new line without an indent.
`````

## output:

`````
### 53. The Bi-Directional Table

| Item ID | Description (وصف) | Status |
| --- | --- | --- |
| A-101 | **High-grade Marble (رخام نجران) *unclosed ***| [Order](URL_FIX!)
| B-202 | Glass Panel @ 200cm | `In-Progress`|

### 54. The "Ghost" Line

This line contains a [Broken Link](URL_FIX!)
and a **bold that spans**
onto a new line without an indent.

`````

## console:

````
20:37:47.559 main.js:894 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
20:37:47.559 main.js:895 [generateFix] Line: | Item ID | Description (وصف) | Status |
20:37:47.559 main.js:894 [generateFix] Message: Broken link syntax: Missing closing bracket ] or parenthesis )
20:37:47.559 main.js:895 [generateFix] Line: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order ( |
20:37:47.560 main.js:1156 [generateFix] Broken link - Line: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order ( |
20:37:47.560 main.js:1157 [generateFix] Marker startColumn: 56
20:37:47.560 main.js:1166 [generateFix] Before broken link: | A-101 | **High-grade Marble (رخام نجران) *unclosed | 
20:37:47.560 main.js:1167 [generateFix] Broken link part: [Order ( |
20:37:47.560 main.js:1185 [generateFix] Pattern 2 - Fix: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order](URL_FIX!)
20:37:47.560 main.js:894 [generateFix] Message: Unclosed bold: Add closing ** (e.g., **bold text**)
20:37:47.561 main.js:895 [generateFix] Line: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order ( |
20:37:47.561 main.js:894 [generateFix] Message: Unclosed italic: Add closing * (e.g., *italic text*)
20:37:47.561 main.js:895 [generateFix] Line: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order ( |
20:37:47.561 main.js:894 [generateFix] Message: Unclosed inline code: Add closing ` (e.g., `code`)
20:37:47.561 main.js:895 [generateFix] Line: | B-202 | Glass Panel @ 200cm | `In-Progress |
20:37:47.562 main.js:894 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
20:37:47.562 main.js:895 [generateFix] Line: This line contains a [Broken Link ( and ends with a trailing backslash \
20:37:47.562 main.js:894 [generateFix] Message: Broken link syntax: Missing closing bracket ] or parenthesis )
20:37:47.562 main.js:895 [generateFix] Line: This line contains a [Broken Link ( and ends with a trailing backslash \
20:37:47.562 main.js:1156 [generateFix] Broken link - Line: This line contains a [Broken Link ( and ends with a trailing backslash \
20:37:47.562 main.js:1157 [generateFix] Marker startColumn: 22
20:37:47.562 main.js:1166 [generateFix] Before broken link: This line contains a 
20:37:47.563 main.js:1167 [generateFix] Broken link part: [Broken Link ( and ends with a trailing backslash \
20:37:47.563 main.js:1185 [generateFix] Pattern 2 - Fix: This line contains a [Broken Link](URL_FIX!)
20:37:47.563 main.js:894 [generateFix] Message: Unclosed bold: Add closing ** (e.g., **bold text**)
20:37:47.563 main.js:895 [generateFix] Line: and a **bold that spans
20:37:49.319 main.js:1503 [applyAll] ========== ITERATION 1 ==========
20:37:49.319 main.js:1517 [applyAll] Issues by line: 5
20:37:49.320  [applyAll] Line numbers: (5) [2, 4, 5, 8, 9]
20:37:49.320  [applyAll] Processing lines (bottom to top): (5) [9, 8, 5, 4, 2]
20:37:49.320  [applyAll] Processing line 9
20:37:49.321  [applyMultiple] Line 9 - Markers: 1
20:37:49.321  [applyMultiple] BEFORE: and a **bold that spans
20:37:49.321  [applyMultiple] Sorted markers: ['Unclosed bold: Add closing ** (e.g., **bold text**)']
20:37:49.321  [generateFix] Message: Unclosed bold: Add closing ** (e.g., **bold text**)
20:37:49.321  [generateFix] Line: and a **bold that spans
20:37:49.322  [applyMultiple] Applying: Add closing **
20:37:49.322  [applyMultiple] From: and a **bold that spans
20:37:49.322  [applyMultiple] To: and a **bold that spans**
20:37:49.322  [applyMultiple] AFTER: and a **bold that spans**
20:37:49.329  [applyAll] ✓ Fixed line 9 - 1 issues
20:37:49.329  [applyAll] Processing line 8
20:37:49.329  [applyMultiple] Line 8 - Markers: 2
20:37:49.330  [applyMultiple] BEFORE: This line contains a [Broken Link ( and ends with a trailing backslash \
20:37:49.330  [applyMultiple] Sorted markers: (2) ['Broken link syntax: Missing closing bracket ] or parenthesis )', 'Missing blank line after heading: Add blank line for better readability']
20:37:49.330  [generateFix] Message: Broken link syntax: Missing closing bracket ] or parenthesis )
20:37:49.330  [generateFix] Line: This line contains a [Broken Link ( and ends with a trailing backslash \
20:37:49.330  [generateFix] Broken link - Line: This line contains a [Broken Link ( and ends with a trailing backslash \
20:37:49.331  [generateFix] Marker startColumn: 22
20:37:49.331  [generateFix] Before broken link: This line contains a 
20:37:49.331  [generateFix] Broken link part: [Broken Link ( and ends with a trailing backslash \
20:37:49.331  [generateFix] Pattern 2 - Fix: This line contains a [Broken Link](URL_FIX!)
20:37:49.331  [applyMultiple] Applying: Add missing bracket and parenthesis with placeholder URL
20:37:49.331  [applyMultiple] From: This line contains a [Broken Link ( and ends with a trailing backslash \
20:37:49.332  [applyMultiple] To: This line contains a [Broken Link](URL_FIX!)
20:37:49.332  [applyMultiple] AFTER: This line contains a [Broken Link](URL_FIX!)
20:37:49.336  [insertBlankLineAbove] Called for line 8
20:37:49.337  [insertBlankLineAbove] Previous line (7): "### 54. The "Ghost" Line"
20:37:49.337  [insertBlankLineAbove] Inserting blank line before line 8
20:37:49.337  [insertBlankLineAbove] Current line content: "This line contains a [Broken Link](URL_FIX!)"
20:37:49.337  [insertBlankLineAbove] Range: (8, 1, 8, 1)
20:37:49.342  [applyAll] ✓ Fixed line 8 - 2 issues
20:37:49.343  [applyAll] Processing line 5
20:37:49.343  [applyMultiple] Line 5 - Markers: 1
20:37:49.344  [applyMultiple] BEFORE: | B-202 | Glass Panel @ 200cm | `In-Progress |
20:37:49.344  [applyMultiple] Sorted markers: ['Unclosed inline code: Add closing ` (e.g., `code`)']
20:37:49.344  [generateFix] Message: Unclosed inline code: Add closing ` (e.g., `code`)
20:37:49.344  [generateFix] Line: | B-202 | Glass Panel @ 200cm | `In-Progress |
20:37:49.344 main.js:1268 [applyMultiple] Applying: Add closing backtick
20:37:49.345 main.js:1269 [applyMultiple] From: | B-202 | Glass Panel @ 200cm | `In-Progress |
20:37:49.345 main.js:1270 [applyMultiple] To: | B-202 | Glass Panel @ 200cm | `In-Progress`|
20:37:49.345 main.js:1276 [applyMultiple] AFTER: | B-202 | Glass Panel @ 200cm | `In-Progress`|
20:37:49.349 main.js:1552 [applyAll] ✓ Fixed line 5 - 1 issues
20:37:49.351 main.js:1540 [applyAll] Processing line 4
20:37:49.351 main.js:1227 [applyMultiple] Line 4 - Markers: 3
20:37:49.351 main.js:1228 [applyMultiple] BEFORE: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order ( |
20:37:49.352 main.js:1252 [applyMultiple] Sorted markers: (3) ['Broken link syntax: Missing closing bracket ] or parenthesis )', 'Unclosed bold: Add closing ** (e.g., **bold text**)', 'Unclosed italic: Add closing * (e.g., *italic text*)']
20:37:49.353 main.js:894 [generateFix] Message: Broken link syntax: Missing closing bracket ] or parenthesis )
20:37:49.353 main.js:895 [generateFix] Line: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order ( |
20:37:49.353 main.js:1156 [generateFix] Broken link - Line: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order ( |
20:37:49.354 main.js:1157 [generateFix] Marker startColumn: 56
20:37:49.354 main.js:1166 [generateFix] Before broken link: | A-101 | **High-grade Marble (رخام نجران) *unclosed | 
20:37:49.354 main.js:1167 [generateFix] Broken link part: [Order ( |
20:37:49.354 main.js:1185 [generateFix] Pattern 2 - Fix: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order](URL_FIX!)
20:37:49.354 main.js:1268 [applyMultiple] Applying: Add missing bracket and parenthesis with placeholder URL
20:37:49.355 main.js:1269 [applyMultiple] From: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order ( |
20:37:49.355 main.js:1270 [applyMultiple] To: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order](URL_FIX!)
20:37:49.355 main.js:894 [generateFix] Message: Unclosed bold: Add closing ** (e.g., **bold text**)
20:37:49.355 main.js:895 [generateFix] Line: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order](URL_FIX!)
20:37:49.355 main.js:1268 [applyMultiple] Applying: Add closing **
20:37:49.356 main.js:1269 [applyMultiple] From: | A-101 | **High-grade Marble (رخام نجران) *unclosed | [Order](URL_FIX!)
20:37:49.356 main.js:1270 [applyMultiple] To: | A-101 | **High-grade Marble (رخام نجران) *unclosed **| [Order](URL_FIX!)
20:37:49.356 main.js:894 [generateFix] Message: Unclosed italic: Add closing * (e.g., *italic text*)
20:37:49.356 main.js:895 [generateFix] Line: | A-101 | **High-grade Marble (رخام نجران) *unclosed **| [Order](URL_FIX!)
20:37:49.356 main.js:1268 [applyMultiple] Applying: Add closing *
20:37:49.356 main.js:1269 [applyMultiple] From: | A-101 | **High-grade Marble (رخام نجران) *unclosed **| [Order](URL_FIX!)
20:37:49.356 main.js:1270 [applyMultiple] To: | A-101 | **High-grade Marble (رخام نجران) *unclosed ***| [Order](URL_FIX!)
20:37:49.357 main.js:1276 [applyMultiple] AFTER: | A-101 | **High-grade Marble (رخام نجران) *unclosed ***| [Order](URL_FIX!)
20:37:49.363 main.js:1552 [applyAll] ✓ Fixed line 4 - 3 issues
20:37:49.363 main.js:1540 [applyAll] Processing line 2
20:37:49.363 main.js:1227 [applyMultiple] Line 2 - Markers: 1
20:37:49.363 main.js:1228 [applyMultiple] BEFORE: | Item ID | Description (وصف) | Status |
20:37:49.363 main.js:1252 [applyMultiple] Sorted markers: ['Missing blank line after heading: Add blank line for better readability']
20:37:49.364 main.js:1276 [applyMultiple] AFTER: | Item ID | Description (وصف) | Status |
20:37:49.364 main.js:1298 [insertBlankLineAbove] Called for line 2
20:37:49.364 main.js:1304 [insertBlankLineAbove] Previous line (1): "### 53. The Bi-Directional Table"
20:37:49.364 main.js:1311 [insertBlankLineAbove] Inserting blank line before line 2
20:37:49.365 main.js:1315 [insertBlankLineAbove] Current line content: "| Item ID | Description (وصف) | Status |"
20:37:49.365 main.js:1316 [insertBlankLineAbove] Range: (2, 1, 2, 1)
20:37:49.372 main.js:1552 [applyAll] ✓ Fixed line 2 - 1 issues
20:37:49.372 main.js:1558 [applyAll] Total fixed so far: 8
20:37:49.444 main.js:1327 [insertBlankLineAbove] After edit - Line 8: "### 54. The "Ghost" Line"
20:37:49.444 main.js:1328 [insertBlankLineAbove] After edit - Line 9: ""
20:37:49.474 main.js:1327 [insertBlankLineAbove] After edit - Line 2: ""
20:37:49.474 main.js:1328 [insertBlankLineAbove] After edit - Line 3: "| Item ID | Description (وصف) | Status |"
20:37:49.523 main.js:1563 [applyAll] Re-validating...
20:37:49.523 main.js:1568 [applyAll] New pending issues: 0
20:37:49.523 main.js:1575 [applyAll] ✓ ALL DONE - Fixed 8 issues total
````