PS C:\Users\Administrator\markdown-live-preview> node test-validation-autofix.js
================================================================================
VALIDATION AUTO-FIX TEST
================================================================================

Test File: validation-edge-cases-test.md
Total Lines: 300

================================================================================

EXPECTED FIXES:


## Section 11: Broken Image Syntax
BEFORE:
  ![Broken image (
  ![Another broken (missing close
EXPECTED AFTER:
  ![Broken image](<span style="color:red">IMAGE_URL_FIX!</span>)
  ![Another broken](<span style="color:red">IMAGE_URL_FIX!</span>)

## Section 12: Empty Links
BEFORE:
  []()
  [Empty link text]()
EXPECTED AFTER:
  [Link text](url)
  [Empty link text](url)

## Section 13: Broken Link Syntax
BEFORE:
  [Broken link (
  [Another broken (missing close
EXPECTED AFTER:
  [Broken link](<span style="color:red">URL_FIX!</span>)
  [Another broken](<span style="color:red">URL_FIX!</span>) 

## Section 14: Mixed Issues on Same Line
BEFORE:
  ###No space header with **unclosed bold and `unclosed codeEXPECTED AFTER:
  ### No space header with **unclosed bold and `unclosed code`**

## Section 15: Nested List with Mixed Markers
BEFORE:
  * Parent item
    + Child with plus
    - Child with dash
    * Child with asterisk
EXPECTED AFTER:
  - Parent item
    - Child with plus  ← MUST PRESERVE INDENTATION
    - Child with dash
    - Child with asterisk

## Section 16: Multiple Tables with Issues
BEFORE:
  | Header A | Header B | Header C | Header D |
  | --- | --- | --- | --- |
EXPECTED AFTER:
  | Header A | Header B | Header C | Header D |
  | --- | --- | --- | --- |  ← MUST MATCH 4 COLUMNS

================================================================================

TEST INSTRUCTIONS:
1. Open validation-edge-cases-test.md in DocMark
2. Enable validation (Settings > Markdown Validation)       
3. Click "Fix Issues (Interactive)"
4. Click "Apply All" button
5. Check the console for debug messages
6. Compare results with EXPECTED AFTER above

================================================================================


DEBUG LOGGING NEEDED IN src/main.js:

Add these console.log statements:


1. In generateFix() function, add at the start:
   console.log('[generateFix]', marker.message, 'Line:', line);

2. In generateFix() for broken images, add:
   console.log('[generateFix] Broken image match:', match, 'Fix:', suggestedFix);

3. In generateFix() for broken links, add:
   console.log('[generateFix] Broken link match:', match, 'Fix:', suggestedFix);

4. In applyMultipleFixesToLine(), add:
   console.log('[applyMultiple] Line', lineNumber, 'Markers:', markers.length);
   console.log('[applyMultiple] Before:', currentLine);     
   console.log('[applyMultiple] After:', currentLine);      

5. In applyAllFixes(), add:
   console.log('[applyAll] Iteration', iterationCount, 'Issues by line:', issuesByLine.size);
   console.log('[applyAll] Fixed count:', totalFixedCount); 


================================================================================
CRITICAL ISSUES TO CHECK:
================================================================================

1. BROKEN IMAGE REGEX:
   Pattern: /!\[([^\]]*)\]\s*\([^)]*$/
   Test: "![Broken image ("
   Should match: YES
   Should extract: "Broken image"

2. BROKEN LINK REGEX:
   Pattern: /\[([^\]]+)\]\s*\([^)]*$/
   Test: "[Broken link ("
   Should match: YES
   Should extract: "Broken link"

3. LIST INDENTATION:
   Pattern: /^(\s*)([+*-])(\s*.+)/
   Test: "  + Child with plus"
   Should capture: ["  ", "+", " Child with plus"]
   Should produce: "  - Child with plus"

4. TABLE SEPARATOR:
   Must read PREVIOUS line to count columns
   Header: "| Header A | Header B | Header C | Header D |"  
   Columns: 4
   Separator: "| --- | --- | --- | --- |" (4 dashes)        


================================================================================
RUN THIS TEST:
================================================================================
node test-validation-autofix.js

Then open browser console and run the actual validation.    
================================================================================
PS C:\Users\Administrator\markdown-live-preview> 