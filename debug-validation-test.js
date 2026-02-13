/**
 * Debug Validation Test
 * Tests the validation and fix logic with detailed logging
 */

const testCases = [
    {
        name: "Broken Image Syntax",
        input: "![Broken image (",
        expectedError: "Broken image syntax",
        expectedFix: "![Broken image](image.png)"
    },
    {
        name: "Broken Link Syntax",
        input: "[Broken link (",
        expectedError: "Broken link syntax",
        expectedFix: "[Broken link](url)"
    },
    {
        name: "Nested List Indentation",
        input: "  + Child with plus",
        expectedError: "Mixed list markers",
        expectedFix: "  - Child with plus"
    },
    {
        name: "Table Column Mismatch (Missing)",
        header: "| Col1 | Col2 | Col3 |",
        separator: "| --- | --- | --- |",
        input: "| A | B |",
        expectedError: "Table column mismatch",
        expectedFix: "| A | B | <span style=\"color:red\">COL_FIX!</span> |"
    },
    {
        name: "Table Separator After Header Fix",
        header: "| Header A | Header B | Header C | Header D |",
        separator: "| --- | --- | --- |",
        expectedError: "Table column mismatch",
        expectedFix: "| --- | --- | --- | --- |"
    }
];

console.log("=".repeat(80));
console.log("DEBUG VALIDATION TEST");
console.log("=".repeat(80));

// Test 1: Broken Image Detection
console.log("\n[TEST 1] Broken Image Detection");
console.log("-".repeat(80));
const brokenImageLine = "![Broken image (";
const imageBrokenPattern = /!\[[^\]]*\]\s*\([^)]*$/; // FIXED: No capturing group
console.log("Line:", brokenImageLine);
console.log("Pattern:", imageBrokenPattern);
console.log("Match:", imageBrokenPattern.test(brokenImageLine));
console.log("Expected: true");
console.log("Status:", imageBrokenPattern.test(brokenImageLine) ? "✓ PASS" : "✗ FAIL");

// Test 2: Broken Link Detection
console.log("\n[TEST 2] Broken Link Detection");
console.log("-".repeat(80));
const brokenLinkLine = "[Broken link (";
const linkBrokenPattern = /\[[^\]]+\]\s*\([^)]*$/; // FIXED: No capturing group
console.log("Line:", brokenLinkLine);
console.log("Pattern:", linkBrokenPattern);
console.log("Match:", linkBrokenPattern.test(brokenLinkLine));
console.log("Expected: true");
console.log("Status:", linkBrokenPattern.test(brokenLinkLine) ? "✓ PASS" : "✗ FAIL");

// Test 3: List Indentation Preservation
console.log("\n[TEST 3] List Indentation Preservation");
console.log("-".repeat(80));
const nestedListLine = "  + Child with plus";
const listPattern = /^(\s*)([+*-])(\s*.+)/;
const listMatch = nestedListLine.match(listPattern);
console.log("Line:", nestedListLine);
console.log("Pattern:", listPattern);
console.log("Match:", listMatch);
if (listMatch) {
    const indent = listMatch[1];
    const content = listMatch[3].trimStart();
    const fix = indent + '- ' + content;
    console.log("Indent:", JSON.stringify(indent), `(${indent.length} chars)`);
    console.log("Content:", JSON.stringify(content));
    console.log("Fixed:", JSON.stringify(fix));
    console.log("Expected:", JSON.stringify("  - Child with plus"));
    console.log("Status:", fix === "  - Child with plus" ? "✓ PASS" : "✗ FAIL");
} else {
    console.log("Status: ✗ FAIL - No match");
}

// Test 4: Table Column Fix
console.log("\n[TEST 4] Table Column Fix (Missing Columns)");
console.log("-".repeat(80));
const tableLine = "| A | B |";
const expectedCols = 3;
const gotCols = 2;
const missingCount = expectedCols - gotCols;
const cleanLine = tableLine.trimEnd().replace(/\|$/, '').trimEnd();
const placeholders = ' | ' + Array(missingCount).fill('<span style="color:red">COL_FIX!</span>').join(' | ');
const tableFix = cleanLine + placeholders + ' |';
console.log("Line:", tableLine);
console.log("Expected columns:", expectedCols);
console.log("Got columns:", gotCols);
console.log("Missing:", missingCount);
console.log("Fixed:", tableFix);
console.log("Expected:", "| A | B | <span style=\"color:red\">COL_FIX!</span> |");
console.log("Status:", tableFix === "| A | B | <span style=\"color:red\">COL_FIX!</span> |" ? "✓ PASS" : "✗ FAIL");

// Test 5: Table Separator Fix
console.log("\n[TEST 5] Table Separator Fix (After Header Change)");
console.log("-".repeat(80));
const headerLine = "| Header A | Header B | Header C | Header D |";
const headerCols = headerLine.split('|').filter(c => c.trim()).length;
const separatorFix = '| ' + Array(headerCols).fill('---').join(' | ') + ' |';
console.log("Header:", headerLine);
console.log("Header columns:", headerCols);
console.log("Fixed separator:", separatorFix);
console.log("Expected:", "| --- | --- | --- | --- |");
console.log("Status:", separatorFix === "| --- | --- | --- | --- |" ? "✓ PASS" : "✗ FAIL");

// Test 6: Regex Edge Cases
console.log("\n[TEST 6] Regex Edge Cases");
console.log("-".repeat(80));

const edgeCases = [
    { line: "![Broken image (", pattern: /!\[[^\]]*\]\s*\([^)]*$/, expected: true, desc: "Broken image with (" },
    { line: "![Broken image (missing close", pattern: /!\[[^\]]*\]\s*\([^)]*$/, expected: true, desc: "Broken image with text" },
    { line: "![Valid](image.png)", pattern: /!\[[^\]]*\]\s*\([^)]*$/, expected: false, desc: "Valid image" },
    { line: "[Broken link (", pattern: /\[[^\]]+\]\s*\([^)]*$/, expected: true, desc: "Broken link with (" },
    { line: "[Valid](url)", pattern: /\[[^\]]+\]\s*\([^)]*$/, expected: false, desc: "Valid link" },
];

edgeCases.forEach((test, i) => {
    const result = test.pattern.test(test.line);
    const status = result === test.expected ? "✓ PASS" : "✗ FAIL";
    console.log(`  ${i + 1}. ${test.desc}`);
    console.log(`     Line: "${test.line}"`);
    console.log(`     Result: ${result}, Expected: ${test.expected} - ${status}`);
});

console.log("\n" + "=".repeat(80));
console.log("TEST COMPLETE");
console.log("=".repeat(80));
