# console:

````
18:50:36.484 main.js:881 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:50:36.484 main.js:882 [generateFix] Line: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:50:36.484 main.js:881 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:50:36.485 main.js:882 [generateFix] Line: 1. This is a list item
18:50:36.485 main.js:881 [generateFix] Message: List-table conflict: Add blank line between list and table
18:50:36.485 main.js:882 [generateFix] Line: | Table | Inside | List? |
18:50:38.619 main.js:1440 [applyAll] ========== ITERATION 1 ==========
18:50:38.619 main.js:1454 [applyAll] Issues by line: 3
18:50:38.620 main.js:1455 [applyAll] Line numbers: (3) [2, 7, 8]
18:50:38.620 main.js:1470 [applyAll] Processing lines (bottom to top): (3) [8, 7, 2]
18:50:38.621 main.js:1477 [applyAll] Processing line 8
18:50:38.622 main.js:1176 [applyMultiple] Line 8 - Markers: 1
18:50:38.622 main.js:1177 [applyMultiple] BEFORE: | Table | Inside | List? |
18:50:38.622 main.js:1201 [applyMultiple] Sorted markers: ['List-table conflict: Add blank line between list and table']
18:50:38.623 main.js:1225 [applyMultiple] AFTER: | Table | Inside | List? |
18:50:38.623 main.js:1247 [insertBlankLineAbove] Called for line 8
18:50:38.623 main.js:1253 [insertBlankLineAbove] Previous line (7): "1. This is a list item"
18:50:38.624 main.js:1260 [insertBlankLineAbove] Inserting blank line before line 8
18:50:38.624 main.js:1264 [insertBlankLineAbove] Current line content: "| Table | Inside | List? |"
18:50:38.624 main.js:1265 [insertBlankLineAbove] Range: (8, 1, 8, 1)
18:50:38.640 main.js:1489 [applyAll] ✓ Fixed line 8 - 1 issues
18:50:38.640 main.js:1477 [applyAll] Processing line 7
18:50:38.640 main.js:1176 [applyMultiple] Line 7 - Markers: 1
18:50:38.641 main.js:1177 [applyMultiple] BEFORE: 1. This is a list item
18:50:38.641 main.js:1201 [applyMultiple] Sorted markers: ['Missing blank line after heading: Add blank line for better readability']
18:50:38.641 main.js:1225 [applyMultiple] AFTER: 1. This is a list item
18:50:38.641 main.js:1247 [insertBlankLineAbove] Called for line 7
18:50:38.641 main.js:1253 [insertBlankLineAbove] Previous line (6): "### 43. List-Table Conflict"
18:50:38.641 main.js:1260 [insertBlankLineAbove] Inserting blank line before line 7
18:50:38.642 main.js:1264 [insertBlankLineAbove] Current line content: "1. This is a list item"
18:50:38.642 main.js:1265 [insertBlankLineAbove] Range: (7, 1, 7, 1)
18:50:38.649 main.js:1489 [applyAll] ✓ Fixed line 7 - 1 issues
18:50:38.650 main.js:1477 [applyAll] Processing line 2
18:50:38.650 main.js:1176 [applyMultiple] Line 2 - Markers: 1
18:50:38.650 main.js:1177 [applyMultiple] BEFORE: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:50:38.650 main.js:1201 [applyMultiple] Sorted markers: ['Missing blank line after heading: Add blank line for better readability']
18:50:38.651 main.js:1225 [applyMultiple] AFTER: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:50:38.651 main.js:1247 [insertBlankLineAbove] Called for line 2
18:50:38.651 main.js:1253 [insertBlankLineAbove] Previous line (1): "### 42. Professional Protocol Check"
18:50:38.653 main.js:1260 [insertBlankLineAbove] Inserting blank line before line 2
18:50:38.653 main.js:1264 [insertBlankLineAbove] Current line content: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:50:38.653 main.js:1265 [insertBlankLineAbove] Range: (2, 1, 2, 1)
18:50:38.665 main.js:1489 [applyAll] ✓ Fixed line 2 - 1 issues
18:50:38.666 main.js:1495 [applyAll] Total fixed so far: 3
18:50:38.741 main.js:1276 [insertBlankLineAbove] After edit - Line 8: ""
18:50:38.741 main.js:1277 [insertBlankLineAbove] After edit - Line 9: "1. This is a list item"
18:50:38.757 main.js:1276 [insertBlankLineAbove] After edit - Line 7: "### 43. List-Table Conflict"
18:50:38.757 main.js:1277 [insertBlankLineAbove] After edit - Line 8: ""
18:50:38.766 main.js:1276 [insertBlankLineAbove] After edit - Line 2: ""
18:50:38.766 main.js:1277 [insertBlankLineAbove] After edit - Line 3: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:50:38.820 main.js:1500 [applyAll] Re-validating...
18:50:38.820 main.js:1505 [applyAll] New pending issues: 0
18:50:38.821 main.js:1512 [applyAll] ✓ ALL DONE - Fixed 3 issues total
18:50:48.036 main.js:881 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:50:48.036 main.js:882 [generateFix] Line: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:50:48.036 main.js:881 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:50:48.036 main.js:882 [generateFix] Line: 1. This is a list item
18:50:48.036 main.js:881 [generateFix] Message: List-table conflict: Add blank line between list and table
18:50:48.037 main.js:882 [generateFix] Line: | Table | Inside | List? |
18:50:49.299 main.js:1397 [applyCurrentFix] Blank line insertion detected for line 2
18:50:49.299 main.js:1247 [insertBlankLineAbove] Called for line 2
18:50:49.299 main.js:1253 [insertBlankLineAbove] Previous line (1): "### 42. Professional Protocol Check"
18:50:49.299 main.js:1260 [insertBlankLineAbove] Inserting blank line before line 2
18:50:49.299 main.js:1264 [insertBlankLineAbove] Current line content: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:50:49.299 main.js:1265 [insertBlankLineAbove] Range: (2, 1, 2, 1)
18:50:49.412 main.js:1276 [insertBlankLineAbove] After edit - Line 2: ""
18:50:49.412 main.js:1277 [insertBlankLineAbove] After edit - Line 3: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:50:49.413 main.js:1414 [applyCurrentFix] Re-validating after fix...
18:51:46.874 main.js:881 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:51:46.874 main.js:882 [generateFix] Line: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:51:46.874 main.js:881 [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:51:46.875 main.js:882 [generateFix] Line: 1. This is a list item
18:51:46.875 main.js:881 [generateFix] Message: List-table conflict: Add blank line between list and table
18:51:46.875 main.js:882 [generateFix] Line: | Table | Inside | List? |
18:51:49.491 main.js:1440 [applyAll] ========== ITERATION 1 ==========
18:51:49.491 main.js:1454 [applyAll] Issues by line: 3
18:51:49.491 main.js:1455 [applyAll] Line numbers: (3) [84, 89, 90]
18:51:49.492 main.js:1470 [applyAll] Processing lines (bottom to top): (3) [90, 89, 84]
18:51:49.492 main.js:1477 [applyAll] Processing line 90
18:51:49.493 main.js:1176 [applyMultiple] Line 90 - Markers: 1
18:51:49.493 main.js:1177 [applyMultiple] BEFORE: | Table | Inside | List? |
18:51:49.493 main.js:1201 [applyMultiple] Sorted markers: ['List-table conflict: Add blank line between list and table']
18:51:49.494 main.js:1225 [applyMultiple] AFTER: | Table | Inside | List? |
18:51:49.494 main.js:1247 [insertBlankLineAbove] Called for line 90
18:51:49.494 main.js:1253 [insertBlankLineAbove] Previous line (89): "1. This is a list item"
18:51:49.494 main.js:1260 [insertBlankLineAbove] Inserting blank line before line 90
18:51:49.494 main.js:1264 [insertBlankLineAbove] Current line content: "| Table | Inside | List? |"
18:51:49.495 main.js:1265 [insertBlankLineAbove] Range: (90, 1, 90, 1)
18:51:49.506 main.js:1489 [applyAll] ✓ Fixed line 90 - 1 issues
18:51:49.508 main.js:1477 [applyAll] Processing line 89
18:51:49.509 main.js:1176 [applyMultiple] Line 89 - Markers: 1
18:51:49.509 main.js:1177 [applyMultiple] BEFORE: 1. This is a list item
18:51:49.510 main.js:1201 [applyMultiple] Sorted markers: ['Missing blank line after heading: Add blank line for better readability']
18:51:49.510 main.js:1225 [applyMultiple] AFTER: 1. This is a list item
18:51:49.510 main.js:1247 [insertBlankLineAbove] Called for line 89
18:51:49.510 main.js:1253 [insertBlankLineAbove] Previous line (88): "### 43. List-Table Conflict"
18:51:49.510 main.js:1260 [insertBlankLineAbove] Inserting blank line before line 89
18:51:49.511 main.js:1264 [insertBlankLineAbove] Current line content: "1. This is a list item"
18:51:49.511 main.js:1265 [insertBlankLineAbove] Range: (89, 1, 89, 1)
18:51:49.527 main.js:1489 [applyAll] ✓ Fixed line 89 - 1 issues
18:51:49.528 main.js:1477 [applyAll] Processing line 84
18:51:49.528 main.js:1176 [applyMultiple] Line 84 - Markers: 1
18:51:49.529 main.js:1177 [applyMultiple] BEFORE: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:51:49.529 main.js:1201 [applyMultiple] Sorted markers: ['Missing blank line after heading: Add blank line for better readability']
18:51:49.529 main.js:1225 [applyMultiple] AFTER: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:51:49.529 main.js:1247 [insertBlankLineAbove] Called for line 84
18:51:49.530  [insertBlankLineAbove] Previous line (83): "### 42. Professional Protocol Check"
18:51:49.530  [insertBlankLineAbove] Inserting blank line before line 84
18:51:49.530  [insertBlankLineAbove] Current line content: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:51:49.530  [insertBlankLineAbove] Range: (84, 1, 84, 1)
18:51:49.544  [applyAll] ✓ Fixed line 84 - 1 issues
18:51:49.545  [applyAll] Total fixed so far: 3
18:51:49.607  [insertBlankLineAbove] After edit - Line 90: ""
18:51:49.607  [insertBlankLineAbove] After edit - Line 91: "1. This is a list item"
18:51:49.627  [insertBlankLineAbove] After edit - Line 89: "### 43. List-Table Conflict"
18:51:49.627  [insertBlankLineAbove] After edit - Line 90: ""
18:51:49.656  [insertBlankLineAbove] After edit - Line 84: ""
18:51:49.656  [insertBlankLineAbove] After edit - Line 85: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:51:49.709  [applyAll] Re-validating...
18:51:49.710  [applyAll] New pending issues: 0
18:51:49.710  [applyAll] ✓ ALL DONE - Fixed 3 issues total
18:53:02.946  [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:53:02.946  [generateFix] Line: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:53:02.946  [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:53:02.946  [generateFix] Line: 1. This is a list item
18:53:02.946  [generateFix] Message: List-table conflict: Add blank line between list and table
18:53:02.947  [generateFix] Line: | Table | Inside | List? |
18:53:04.154  [applyCurrentFix] Blank line insertion detected for line 2
18:53:04.154  [insertBlankLineAbove] Called for line 2
18:53:04.155  [insertBlankLineAbove] Previous line (1): "### 42. Professional Protocol Check"
18:53:04.155  [insertBlankLineAbove] Inserting blank line before line 2
18:53:04.155  [insertBlankLineAbove] Current line content: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:53:04.155  [insertBlankLineAbove] Range: (2, 1, 2, 1)
18:53:04.275  [insertBlankLineAbove] After edit - Line 2: ""
18:53:04.275  [insertBlankLineAbove] After edit - Line 3: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:53:04.275  [applyCurrentFix] Re-validating after fix...
18:53:12.729  [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:53:12.729  [generateFix] Line: 1. This is a list item
18:53:12.730  [generateFix] Message: List-table conflict: Add blank line between list and table
18:53:12.730  [generateFix] Line: | Table | Inside | List? |
18:53:14.122  [applyCurrentFix] Blank line insertion detected for line 8
18:53:14.122  [insertBlankLineAbove] Called for line 8
18:53:14.122  [insertBlankLineAbove] Previous line (7): "### 43. List-Table Conflict"
18:53:14.122  [insertBlankLineAbove] Inserting blank line before line 8
18:53:14.122  [insertBlankLineAbove] Current line content: "1. This is a list item"
18:53:14.122  [insertBlankLineAbove] Range: (8, 1, 8, 1)
18:53:14.244  [insertBlankLineAbove] After edit - Line 8: ""
18:53:14.244  [insertBlankLineAbove] After edit - Line 9: "1. This is a list item"
18:53:14.245  [applyCurrentFix] Re-validating after fix...
18:53:16.569  [generateFix] Message: List-table conflict: Add blank line between list and table
18:53:16.569  [generateFix] Line: | Table | Inside | List? |
18:53:17.673  [applyCurrentFix] Blank line insertion detected for line 10
18:53:17.673  [insertBlankLineAbove] Called for line 10
18:53:17.674  [insertBlankLineAbove] Previous line (9): "1. This is a list item"
18:53:17.674  [insertBlankLineAbove] Inserting blank line before line 10
18:53:17.674  [insertBlankLineAbove] Current line content: "| Table | Inside | List? |"
18:53:17.674  [insertBlankLineAbove] Range: (10, 1, 10, 1)
18:53:17.821  [insertBlankLineAbove] After edit - Line 10: ""
18:53:17.821  [insertBlankLineAbove] After edit - Line 11: "| Table | Inside | List? |"
18:53:17.821  [applyCurrentFix] Re-validating after fix...
18:53:47.713  [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:53:47.713  [generateFix] Line: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:53:47.713  [generateFix] Message: Missing blank line after heading: Add blank line for better readability
18:53:47.713  [generateFix] Line: 1. This is a list item
18:53:47.713  [generateFix] Message: List-table conflict: Add blank line between list and table
18:53:47.713  [generateFix] Line: | Table | Inside | List? |
18:53:48.809  [applyAll] ========== ITERATION 1 ==========
18:53:48.810  [applyAll] Issues by line: 3
18:53:48.810  [applyAll] Line numbers: (3) [2, 7, 8]
18:53:48.811  [applyAll] Processing lines (bottom to top): (3) [8, 7, 2]
18:53:48.812  [applyAll] Processing line 8
18:53:48.812  [applyMultiple] Line 8 - Markers: 1
18:53:48.813  [applyMultiple] BEFORE: | Table | Inside | List? |
18:53:48.813  [applyMultiple] Sorted markers: ['List-table conflict: Add blank line between list and table']
18:53:48.814  [applyMultiple] AFTER: | Table | Inside | List? |
18:53:48.814  [insertBlankLineAbove] Called for line 8
18:53:48.814  [insertBlankLineAbove] Previous line (7): "1. This is a list item"
18:53:48.815  [insertBlankLineAbove] Inserting blank line before line 8
18:53:48.815  [insertBlankLineAbove] Current line content: "| Table | Inside | List? |"
18:53:48.815  [insertBlankLineAbove] Range: (8, 1, 8, 1)
18:53:48.825  [applyAll] ✓ Fixed line 8 - 1 issues
18:53:48.827  [applyAll] Processing line 7
18:53:48.827  [applyMultiple] Line 7 - Markers: 1
18:53:48.827  [applyMultiple] BEFORE: 1. This is a list item
18:53:48.827  [applyMultiple] Sorted markers: ['Missing blank line after heading: Add blank line for better readability']
18:53:48.828  [applyMultiple] AFTER: 1. This is a list item
18:53:48.828  [insertBlankLineAbove] Called for line 7
18:53:48.829  [insertBlankLineAbove] Previous line (6): "### 43. List-Table Conflict"
18:53:48.829  [insertBlankLineAbove] Inserting blank line before line 7
18:53:48.829  [insertBlankLineAbove] Current line content: "1. This is a list item"
18:53:48.830  [insertBlankLineAbove] Range: (7, 1, 7, 1)
18:53:48.838  [applyAll] ✓ Fixed line 7 - 1 issues
18:53:48.839  [applyAll] Processing line 2
18:53:48.839  [applyMultiple] Line 2 - Markers: 1
18:53:48.840  [applyMultiple] BEFORE: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:53:48.840  [applyMultiple] Sorted markers: ['Missing blank line after heading: Add blank line for better readability']
18:53:48.840  [applyMultiple] AFTER: - Visit our Riyadh Office: [Google Maps](www.google.com/maps)
18:53:48.840  [insertBlankLineAbove] Called for line 2
18:53:48.841  [insertBlankLineAbove] Previous line (1): "### 42. Professional Protocol Check"
18:53:48.841  [insertBlankLineAbove] Inserting blank line before line 2
18:53:48.841  [insertBlankLineAbove] Current line content: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:53:48.842  [insertBlankLineAbove] Range: (2, 1, 2, 1)
18:53:48.854  [applyAll] ✓ Fixed line 2 - 1 issues
18:53:48.856  [applyAll] Total fixed so far: 3
18:53:49.045  [insertBlankLineAbove] After edit - Line 8: ""
18:53:49.046  [insertBlankLineAbove] After edit - Line 9: "1. This is a list item"
18:53:49.046  [insertBlankLineAbove] After edit - Line 7: "### 43. List-Table Conflict"
18:53:49.046  [insertBlankLineAbove] After edit - Line 8: ""
18:53:49.046  [insertBlankLineAbove] After edit - Line 2: ""
18:53:49.046  [insertBlankLineAbove] After edit - Line 3: "- Visit our Riyadh Office: [Google Maps](www.google.com/maps)"
18:53:49.057  [applyAll] Re-validating...
18:53:49.057  [applyAll] New pending issues: 0
18:53:49.057  [applyAll] ✓ ALL DONE - Fixed 3 issues total

````

# input test:

````markdown
### 42. Professional Protocol Check

- Visit our Riyadh Office: [Google Maps](www.google.com/maps)
- Reference Document: [Project Plan](http://insecure-site.com)
- Internal Note: [See Appendix](appendix) (Missing # or ./)

### 43. List-Table Conflict

1. This is a list item

| Table | Inside | List? |
| --- | --- | --- |
| This | often | breaks |
2. This is the next list item
````

# output apply all fixes:

````mardown
### 42. Professional Protocol Check

- Visit our Riyadh Office: [Google Maps](www.google.com/maps)
- Reference Document: [Project Plan](http://insecure-site.com)
- Internal Note: [See Appendix](appendix) (Missing # or ./)

### 43. List-Table Conflict

1. This is a list item

| Table | Inside | List? |
| --- | --- | --- |
| This | often | breaks |
2. This is the next list item
````

# output apply invidual fixes (ran 3 times to finished the 3 fixes):

````
### 42. Professional Protocol Check

- Visit our Riyadh Office: [Google Maps](www.google.com/maps)
- Reference Document: [Project Plan](http://insecure-site.com)
- Internal Note: [See Appendix](appendix) (Missing # or ./)

### 43. List-Table Conflict

1. This is a list item

| Table | Inside | List? |
| --- | --- | --- |
| This | often | breaks |
2. This is the next list item
````