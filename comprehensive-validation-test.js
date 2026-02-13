/**
 * Comprehensive Validation Test
 * Run this in the browser console after opening index.html
 */

console.log("=".repeat(80));
console.log("COMPREHENSIVE VALIDATION TEST");
console.log("=".repeat(80));

// Test content with all edge cases
const testContent = `# Validation Test

## Broken Images
![Broken image (
![Another broken (missing close

## Broken Links
[Broken link (
[Another broken (missing close

## Nested Lists
* Parent item
  + Child with plus
  - Child with dash

## Table Issues
| Col1 | Col2 | Col3 |
| --- | --- | --- |
| A | B |

## Mixed Issues
###No space with **unclosed bold
`;

// Set the test content
if (typeof editor !== 'undefined') {
    console.log("\n[STEP 1] Setting test content...");
    editor.setValue(testContent);
    
    // Wait for validation to run
    setTimeout(() => {
        console.log("\n[STEP 2] Getting validation markers...");
        const model = editor.getModel();
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        
        console.log(`\nFound ${markers.length} validation issues:`);
        markers.forEach((marker, i) => {
            const line = model.getLineContent(marker.startLineNumber);
            console.log(`\n${i + 1}. Line ${marker.startLineNumber}: ${marker.message}`);
            console.log(`   Content: "${line}"`);
            console.log(`   Severity: ${marker.severity === 8 ? 'Error' : marker.severity === 4 ? 'Warning' : 'Info'}`);
        });
        
        // Check for specific issues
        console.log("\n[STEP 3] Checking for specific issues...");
        const brokenImageMarkers = markers.filter(m => m.message.includes('Broken image'));
        const brokenLinkMarkers = markers.filter(m => m.message.includes('Broken link'));
        const listMarkers = markers.filter(m => m.message.includes('Mixed list'));
        const tableMarkers = markers.filter(m => m.message.includes('Table column'));
        const headerMarkers = markers.filter(m => m.message.includes('Header missing'));
        const boldMarkers = markers.filter(m => m.message.includes('Unclosed bold'));
        
        console.log(`  Broken images: ${brokenImageMarkers.length} (expected: 2)`);
        console.log(`  Broken links: ${brokenLinkMarkers.length} (expected: 2)`);
        console.log(`  Mixed list markers: ${listMarkers.length} (expected: 2)`);
        console.log(`  Table column mismatches: ${tableMarkers.length} (expected: 1)`);
        console.log(`  Headers without space: ${headerMarkers.length} (expected: 1)`);
        console.log(`  Unclosed bold: ${boldMarkers.length} (expected: 1)`);
        
        // Summary
        console.log("\n[STEP 4] Test Summary:");
        const allPassed = 
            brokenImageMarkers.length === 2 &&
            brokenLinkMarkers.length === 2 &&
            listMarkers.length === 2 &&
            tableMarkers.length === 1 &&
            headerMarkers.length === 1 &&
            boldMarkers.length === 1;
        
        if (allPassed) {
            console.log("✓ ALL DETECTION TESTS PASSED!");
        } else {
            console.log("✗ SOME DETECTION TESTS FAILED!");
        }
        
        console.log("\n" + "=".repeat(80));
        console.log("Now click 'Apply All' and check the results");
        console.log("=".repeat(80));
        
    }, 1000);
} else {
    console.error("ERROR: Monaco editor not found. Make sure you're running this in the browser console with index.html open.");
}
