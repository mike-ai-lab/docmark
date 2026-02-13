// Test the list regex pattern

const testLines = [
    '- Phase 1: Site Visit',
    '    - [ ] Check boundary wall',
    '    - [ ] Measure height @ 3.5m',
    '- Phase 2: Design',
    '    - > Quote from Client: "We need **bold accents'
];

const listPattern = /^(\s*)([*+-]|\d+\.)\s+(.*)$/;

testLines.forEach(line => {
    const match = line.match(listPattern);
    console.log('Line:', JSON.stringify(line));
    if (match) {
        console.log('  Indent:', JSON.stringify(match[1]), '(length:', match[1].length, ')');
        console.log('  Bullet:', match[2]);
        console.log('  Content:', match[3]);
    } else {
        console.log('  NO MATCH!');
    }
    console.log('');
});
