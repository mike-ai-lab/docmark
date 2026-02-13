/**
 * Automated Validation Auto-Fix Test
 * Tests the validation wizard with edge cases and reports results
 */

const fs = require('fs');
const path = require('path');

// Read the test file
const testFile = 'validation-edge-cases-test.md';
const testContent = fs.readFileSync(testFile, 'utf8');

console.log('='.repeat(80));
console.log('VALIDATION AUTO-FIX TEST');
console.log('='.repeat(80));
console.log(`\nTest File: ${testFile}`);
console.log(`Total Lines: ${testContent.split('\n').length}`);
console.log('\n' + '='.repeat(80));

// Parse the test sections
const sections = [
    { num: 11, name: 'Broken Image Syntax', lines: ['![Broken image (', '![Another broken (missing close'] },
    { num: 12, name: 'Empty Links', lines: ['[]()', '[Empty link text]()'] },
    { num: 13, name: 'Broken Link Syntax', lines: ['[Broken link (', '[Another broken (missing close'] },
    { num: 14, name: 'Mixed Issues on Same Line', lines: ['###No space header with **unclosed bold and `unclosed code'] },
    { num: 15, name: 'Nested List with Mixed Markers', lines: ['* Parent item', '  + Child with plus', '  - Child with dash', '  * Child with asterisk'] },
    { num: 16, name: 'Multiple Tables with Issues', lines: ['| Header A | Header B | Header C | Header D |', '| --- | --- | --- | --- |'] }
];

console.log('\nEXPECTED FIXES:\n');

sections.forEach(section => {
    console.log(`\n## Section ${section.num}: ${section.name}`);
    console.log('BEFORE:');
    section.lines.forEach(line => console.log(`  ${line}`));
    
    console.log('EXPECTED AFTER:');
    switch(section.num) {
        case 11:
            console.log('  ![Broken image](<span style="color:red">IMAGE_URL_FIX!</span>)');
            console.log('  ![Another broken](<span style="color:red">IMAGE_URL_FIX!</span>)');
            break;
        case 12:
            console.log('  [Link text](url)');
            console.log('  [Empty link text](url)');
            break;
        case 13:
            console.log('  [Broken link](<span style="color:red">URL_FIX!</span>)');
            console.log('  [Another broken](<span style="color:red">URL_FIX!</span>)');
            break;
        case 14:
            console.log('  ### No space header with **unclosed bold and `unclosed code`**');
            break;
        case 15:
            console.log('  - Parent item');
            console.log('    - Child with plus  ← MUST PRESERVE INDENTATION');
            console.log('    - Child with dash');
            console.log('    - Child with asterisk');
            break;
        case 16:
            console.log('  | Header A | Header B | Header C | Header D |');
            console.log('  | --- | --- | --- | --- |  ← MUST MATCH 4 COLUMNS');
            break;
    }
});

console.log('\n' + '='.repeat(80));
console.log('\nTEST INSTRUCTIONS:');
console.log('1. Open validation-edge-cases-test.md in DocMark');
console.log('2. Enable validation (Settings > Markdown Validation)');
console.log('3. Click "Fix Issues (Interactive)"');
console.log('4. Click "Apply All" button');
console.log('5. Check the console for debug messages');
console.log('6. Compare results with EXPECTED AFTER above');
console.log('\n' + '='.repeat(80));

// Now let's add debug logging to the actual code
console.log('\n\nDEBUG LOGGING NEEDED IN src/main.js:');
console.log('\nAdd these console.log statements:\n');

console.log(`
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
`);

console.log('\n' + '='.repeat(80));
console.log('CRITICAL ISSUES TO CHECK:');
console.log('='.repeat(80));

console.log(`
1. BROKEN IMAGE REGEX:
   Pattern: /!\\[([^\\]]*)\\]\\s*\\([^)]*$/
   Test: "![Broken image ("
   Should match: YES
   Should extract: "Broken image"
   
2. BROKEN LINK REGEX:
   Pattern: /\\[([^\\]]+)\\]\\s*\\([^)]*$/
   Test: "[Broken link ("
   Should match: YES
   Should extract: "Broken link"

3. LIST INDENTATION:
   Pattern: /^(\\s*)([+*-])(\\s*.+)/
   Test: "  + Child with plus"
   Should capture: ["  ", "+", " Child with plus"]
   Should produce: "  - Child with plus"

4. TABLE SEPARATOR:
   Must read PREVIOUS line to count columns
   Header: "| Header A | Header B | Header C | Header D |"
   Columns: 4
   Separator: "| --- | --- | --- | --- |" (4 dashes)
`);

console.log('\n' + '='.repeat(80));
console.log('RUN THIS TEST:');
console.log('='.repeat(80));
console.log('node test-validation-autofix.js');
console.log('\nThen open browser console and run the actual validation.');
console.log('='.repeat(80));
