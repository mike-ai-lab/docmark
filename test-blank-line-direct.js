/**
 * Direct test of the blank line insertion issue
 * Simulates the exact scenario from the user's console logs
 */

// Simulate the marker filtering logic
const markers = [
    { message: 'List-table conflict: Add blank line between list and table' }
];

const blankLineMarkers = markers.filter(m => 
    m.message.includes('Missing blank line after heading') || 
    m.message.includes('List-table conflict')
);

const contentMarkers = markers.filter(m => 
    !m.message.includes('Missing blank line after heading') && 
    !m.message.includes('List-table conflict')
);

console.log('Total markers:', markers.length);
console.log('Blank line markers:', blankLineMarkers.length);
console.log('Content markers:', contentMarkers.length);

console.log('\nBlank line markers:');
blankLineMarkers.forEach(m => console.log(' -', m.message));

console.log('\nContent markers:');
contentMarkers.forEach(m => console.log(' -', m.message));

console.log('\nShould call insertBlankLineAbove?', blankLineMarkers.length > 0 ? 'YES' : 'NO');

// Test the generateFix function behavior
function generateFix(marker, line) {
    if (marker.message.includes('List-table conflict')) {
        return {
            suggestedFix: '__INSERT_BLANK_LINE__',
            fixDescription: 'Insert blank line between list and table'
        };
    }
    return { suggestedFix: null, fixDescription: '' };
}

const testMarker = markers[0];
const testLine = '| Table | Inside | List? |';
const result = generateFix(testMarker, testLine);

console.log('\ngenerateFix result:');
console.log('  suggestedFix:', result.suggestedFix);
console.log('  fixDescription:', result.fixDescription);
console.log('  Is __INSERT_BLANK_LINE__?', result.suggestedFix === '__INSERT_BLANK_LINE__');
