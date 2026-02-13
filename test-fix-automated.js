/**
 * Automated test for blank line insertion fix
 * This simulates the exact code flow from the application
 */

// Simulate the validation issue structure
class ValidationIssue {
    constructor(lineNumber, message) {
        this.marker = {
            startLineNumber: lineNumber,
            message: message
        };
        this.state = 'pending';
        this.suggestedFix = '__INSERT_BLANK_LINE__';
    }
}

// Simulate Monaco Model
class MockModel {
    constructor(content) {
        this.lines = content.split('\n');
    }
    
    getLineContent(lineNumber) {
        return this.lines[lineNumber - 1] || '';
    }
    
    getLineCount() {
        return this.lines.length;
    }
    
    getValue() {
        return this.lines.join('\n');
    }
    
    setValue(content) {
        this.lines = content.split('\n');
    }
}

// Simulate Monaco Range
class MockRange {
    constructor(startLine, startCol, endLine, endCol) {
        this.startLineNumber = startLine;
        this.startColumn = startCol;
        this.endLineNumber = endLine;
        this.endColumn = endCol;
    }
}

// Simulate Monaco Editor
class MockEditor {
    constructor(content) {
        this.model = new MockModel(content);
        this.editLog = [];
    }
    
    getModel() {
        return this.model;
    }
    
    executeEdits(source, edits) {
        this.editLog.push({ source, edits });
        
        edits.forEach(edit => {
            const { range, text } = edit;
            const startLineIdx = range.startLineNumber - 1;
            const startCol = range.startColumn - 1;
            const endLineIdx = range.endLineNumber - 1;
            const endCol = range.endColumn - 1;
            
            // Get the line
            const line = this.model.lines[startLineIdx];
            
            // If it's a zero-width range (insertion)
            if (range.startLineNumber === range.endLineNumber && 
                range.startColumn === range.endColumn) {
                // Insert text at position
                const before = line.substring(0, startCol);
                const after = line.substring(startCol);
                const newContent = before + text + after;
                
                // Split by newlines
                const newLines = newContent.split('\n');
                
                // Replace current line with first part
                this.model.lines[startLineIdx] = newLines[0];
                
                // Insert additional lines
                for (let i = 1; i < newLines.length; i++) {
                    this.model.lines.splice(startLineIdx + i, 0, newLines[i]);
                }
            } else {
                // Replacement
                const before = line.substring(0, startCol);
                const after = line.substring(endCol);
                this.model.lines[startLineIdx] = before + text + after;
            }
        });
    }
}

// The actual insertBlankLineAbove function from main.js
function insertBlankLineAbove(editor, lineNumber) {
    console.log(`[insertBlankLineAbove] Called for line ${lineNumber}`);
    const model = editor.getModel();
    
    // Check if previous line is already blank
    if (lineNumber > 1) {
        const prevLine = model.getLineContent(lineNumber - 1);
        console.log(`[insertBlankLineAbove] Previous line (${lineNumber - 1}): "${prevLine}"`);
        if (prevLine.trim() === '') {
            console.log(`[insertBlankLineAbove] Previous line is blank, skipping`);
            return;
        }
    }
    
    console.log(`[insertBlankLineAbove] Inserting blank line before line ${lineNumber}`);
    const range = new MockRange(lineNumber, 1, lineNumber, 1);
    const lineContent = model.getLineContent(lineNumber);
    console.log(`[insertBlankLineAbove] Current line content: "${lineContent}"`);
    
    editor.executeEdits('insert-blank-line', [{
        range: range,
        text: '\n'
    }]);
    
    console.log(`[insertBlankLineAbove] Edit applied`);
}

// The applyMultipleFixesToLine function logic
function applyMultipleFixesToLine(editor, lineNumber, markers) {
    const model = editor.getModel();
    let currentLine = model.getLineContent(lineNumber);
    let fixDescriptions = [];
    
    console.log('[applyMultiple] Line', lineNumber, '- Markers:', markers.length);
    console.log('[applyMultiple] BEFORE:', currentLine);
    
    // Separate blank line insertion markers from content fixes
    const blankLineMarkers = markers.filter(m => 
        m.message.includes('Missing blank line after heading') || 
        m.message.includes('List-table conflict')
    );
    const contentMarkers = markers.filter(m => 
        !m.message.includes('Missing blank line after heading') && 
        !m.message.includes('List-table conflict')
    );
    
    console.log('[applyMultiple] Blank line markers:', blankLineMarkers.length);
    console.log('[applyMultiple] Content markers:', contentMarkers.length);
    
    // Apply content fixes (none in this test)
    for (const marker of contentMarkers) {
        // ... would apply content fixes here
    }
    
    console.log('[applyMultiple] AFTER:', currentLine);
    
    // Apply the final combined fix (if any content changes)
    if (currentLine !== model.getLineContent(lineNumber)) {
        const range = new MockRange(lineNumber, 1, lineNumber, model.getLineContent(lineNumber).length + 1);
        editor.executeEdits('validation-fix-multiple', [{
            range: range,
            text: currentLine
        }]);
    }
    
    // Handle blank line insertions separately
    if (blankLineMarkers.length > 0) {
        console.log('[applyMultiple] Calling insertBlankLineAbove...');
        insertBlankLineAbove(editor, lineNumber);
        fixDescriptions.push('Insert blank line above');
    }
    
    console.log('[applyMultiple] Fix descriptions:', fixDescriptions);
    
    return { fixed: fixDescriptions.length > 0, description: fixDescriptions.join(', ') };
}

// Run tests
console.log('='.repeat(70));
console.log('TEST 1: Insert blank line after heading');
console.log('='.repeat(70));

const test1Content = `### 42. Professional Protocol Check
- Visit our Riyadh Office: [Google Maps](www.google.com/maps)`;

const editor1 = new MockEditor(test1Content);
console.log('\nINPUT:');
console.log(editor1.model.getValue());

const issue1 = new ValidationIssue(2, 'Missing blank line after heading: Add blank line for better readability');
const result1 = applyMultipleFixesToLine(editor1, 2, [issue1.marker]);

console.log('\nOUTPUT:');
console.log(editor1.model.getValue());

const expected1 = `### 42. Professional Protocol Check

- Visit our Riyadh Office: [Google Maps](www.google.com/maps)`;

console.log('\nEXPECTED:');
console.log(expected1);

const passed1 = editor1.model.getValue() === expected1;
console.log('\nRESULT:', passed1 ? '✅ PASS' : '❌ FAIL');
console.log('Fixed:', result1.fixed);
console.log('Description:', result1.description);

console.log('\n' + '='.repeat(70));
console.log('TEST 2: Insert blank line between list and table');
console.log('='.repeat(70));

const test2Content = `### 43. List-Table Conflict
1. This is a list item
| Table | Inside | List? |`;

const editor2 = new MockEditor(test2Content);
console.log('\nINPUT:');
console.log(editor2.model.getValue());

const issue2 = new ValidationIssue(3, 'List-table conflict: Add blank line between list and table');
const result2 = applyMultipleFixesToLine(editor2, 3, [issue2.marker]);

console.log('\nOUTPUT:');
console.log(editor2.model.getValue());

const expected2 = `### 43. List-Table Conflict
1. This is a list item

| Table | Inside | List? |`;

console.log('\nEXPECTED:');
console.log(expected2);

const passed2 = editor2.model.getValue() === expected2;
console.log('\nRESULT:', passed2 ? '✅ PASS' : '❌ FAIL');
console.log('Fixed:', result2.fixed);
console.log('Description:', result2.description);

console.log('\n' + '='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log('Test 1:', passed1 ? '✅ PASS' : '❌ FAIL');
console.log('Test 2:', passed2 ? '✅ PASS' : '❌ FAIL');
console.log('Overall:', (passed1 && passed2) ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
