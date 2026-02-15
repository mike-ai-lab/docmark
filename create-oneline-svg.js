const fs = require('fs');

// Read SVG and remove ALL line breaks
let svg = fs.readFileSync('wall_section_diagrams.svg', 'utf8');

// Remove all line breaks and extra spaces
svg = svg.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '');
svg = svg.replace(/>\s+</g, '><'); // Remove spaces between tags

// Create markdown with title and single-line SVG
const output = `# Wall Section Diagrams\n\n${svg}`;

fs.writeFileSync('wall-sections-final.md', output, 'utf8');

console.log('✓ Created: wall-sections-final.md');
console.log('✓ SVG is on ONE LINE (no line breaks)');
console.log('✓ Ready to open in DocMark!\n');
