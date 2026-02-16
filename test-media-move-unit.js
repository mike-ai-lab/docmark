/**
 * Unit test for media move functionality
 * Tests the line counting and spacing logic
 */

// Simulate the move logic
function simulateMove(editorLines, imageLineNumber, direction, allImageLines) {
    console.log('\n=== SIMULATING MOVE ===');
    console.log('Editor content before:');
    editorLines.forEach((line, idx) => {
        console.log(`  Line ${idx + 1}: "${line}"`);
    });
    console.log(`\nMoving image at line ${imageLineNumber} ${direction}`);
    
    const startLine = imageLineNumber;
    const endLine = imageLineNumber; // Single line image
    
    // Get the image content
    let mediaContent = editorLines[startLine - 1]; // -1 for 0-based array
    mediaContent += '\n\n'; // Add blank line (2 newlines)
    
    console.log(`Media content to move: "${mediaContent.replace(/\n/g, '\\n')}"`);
    
    // Determine target line
    let targetLine;
    const currentIndex = allImageLines.indexOf(imageLineNumber);
    
    if (direction === 'down' && currentIndex < allImageLines.length - 1) {
        const nextImageLine = allImageLines[currentIndex + 1];
        targetLine = nextImageLine + 2; // After next image + its blank line
    } else if (direction === 'up' && currentIndex > 0) {
        const prevImageLine = allImageLines[currentIndex - 1];
        targetLine = prevImageLine; // Before previous image
    } else if (direction === 'top') {
        targetLine = 1;
    } else if (direction === 'bottom') {
        targetLine = editorLines.length + 1;
    }
    
    console.log(`Target line: ${targetLine}`);
    
    // Perform the move
    let newLines = [...editorLines];
    
    if (targetLine < startLine) {
        // Moving UP
        console.log('Moving UP: Insert first, then delete');
        
        // Insert at target (split the content by \n)
        const insertLines = mediaContent.split('\n').filter((_, idx, arr) => idx < arr.length - 1); // Remove last empty
        newLines.splice(targetLine - 1, 0, ...insertLines);
        
        console.log(`Inserted ${insertLines.length} lines at position ${targetLine}`);
        
        // Delete from original (adjusted for insertion)
        const adjustedStart = startLine + insertLines.length;
        const deleteCount = 2; // Image line + blank line
        newLines.splice(adjustedStart - 1, deleteCount);
        
        console.log(`Deleted ${deleteCount} lines from adjusted position ${adjustedStart}`);
    } else {
        // Moving DOWN
        console.log('Moving DOWN: Delete first, then insert');
        
        // Delete from original
        const deleteCount = 2; // Image line + blank line
        newLines.splice(startLine - 1, deleteCount);
        
        console.log(`Deleted ${deleteCount} lines from position ${startLine}`);
        
        // Insert at target (adjusted for deletion)
        const adjustedTarget = targetLine - deleteCount;
        const insertLines = mediaContent.split('\n').filter((_, idx, arr) => idx < arr.length - 1);
        newLines.splice(adjustedTarget - 1, 0, ...insertLines);
        
        console.log(`Inserted ${insertLines.length} lines at adjusted position ${adjustedTarget}`);
    }
    
    console.log('\nEditor content after:');
    newLines.forEach((line, idx) => {
        console.log(`  Line ${idx + 1}: "${line}"`);
    });
    
    // Verify blank lines between images
    console.log('\n=== VERIFICATION ===');
    const imagePattern = /!\[.*?\]\(.*?\)/;
    const newImageLines = [];
    newLines.forEach((line, idx) => {
        if (imagePattern.test(line)) {
            newImageLines.push(idx + 1);
        }
    });
    
    console.log(`Found ${newImageLines.length} images at lines: ${newImageLines.join(', ')}`);
    
    let allSeparated = true;
    for (let i = 0; i < newImageLines.length - 1; i++) {
        const currentImg = newImageLines[i];
        const nextImg = newImageLines[i + 1];
        const linesBetween = nextImg - currentImg;
        
        if (linesBetween < 2) {
            console.log(`❌ FAIL: Images at lines ${currentImg} and ${nextImg} are NOT separated (only ${linesBetween - 1} lines between)`);
            allSeparated = false;
        } else {
            console.log(`✅ PASS: Images at lines ${currentImg} and ${nextImg} are separated by ${linesBetween - 1} blank line(s)`);
        }
    }
    
    return { newLines, allSeparated };
}

// Test Case 1: Move middle image down
console.log('\n\n████████████████████████████████████████████████████████');
console.log('TEST 1: Move RED (line 7) DOWN');
console.log('████████████████████████████████████████████████████████');

let testLines = [
    '# Media Move Test',
    '',
    'This is a test document.',
    '',
    '## Image 1 - Red',
    '',
    '![Red Square](https://placehold.co/300x200/ff0000/white?text=RED)',
    '',
    'Some text between images.',
    '',
    '## Image 2 - Blue',
    '',
    '![Blue Square](https://placehold.co/300x200/0000ff/white?text=BLUE)',
    '',
    'More text here.',
    '',
    '## Image 3 - Green',
    '',
    '![Green Square](https://placehold.co/300x200/00ff00/black?text=GREEN)',
    '',
    'Final text.'
];

let result1 = simulateMove(testLines, 7, 'down', [7, 13, 19]);

// Test Case 2: Move last image to top
console.log('\n\n████████████████████████████████████████████████████████');
console.log('TEST 2: Move GREEN (line 19) to TOP');
console.log('████████████████████████████████████████████████████████');

let result2 = simulateMove(testLines, 19, 'top', [7, 13, 19]);

// Test Case 3: Sequential moves that caused the bug
console.log('\n\n████████████████████████████████████████████████████████');
console.log('TEST 3: Sequential moves (RED down, then GREEN up)');
console.log('████████████████████████████████████████████████████████');

let step1 = simulateMove(testLines, 7, 'down', [7, 13, 19]);
if (step1.allSeparated) {
    // Find new image positions
    const imagePattern = /!\[.*?\]\(.*?\)/;
    const newImageLines = [];
    step1.newLines.forEach((line, idx) => {
        if (imagePattern.test(line)) {
            newImageLines.push(idx + 1);
        }
    });
    
    console.log('\n--- After first move, now moving GREEN up ---');
    let step2 = simulateMove(step1.newLines, newImageLines[2], 'up', newImageLines);
    
    if (step2.allSeparated) {
        console.log('\n✅✅✅ ALL TESTS PASSED! ✅✅✅');
    } else {
        console.log('\n❌❌❌ TEST FAILED: Images got grouped after second move ❌❌❌');
    }
} else {
    console.log('\n❌❌❌ TEST FAILED: Images got grouped after first move ❌❌❌');
}
