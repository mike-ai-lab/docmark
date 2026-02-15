/**
 * Create working SVG embed for DocMark
 * Extracts only the SVG tag and its content, removes font definitions
 */

const fs = require('fs');

const svgPath = 'C:\\Users\\Administrator\\Documents\\SECTION AA-DAR LAZAR.svg';

console.log('Processing SVG for DocMark...\n');

let svg = fs.readFileSync(svgPath, 'utf8');

// Remove font glyph definitions (these make it huge)
svg = svg.replace(/<defs>[\s\S]*?<\/defs>/g, '<defs></defs>');

// Remove excessive whitespace
svg = svg.replace(/\s+/g, ' ');
svg = svg.replace(/>\s+</g, '><');

// Remove XML declaration
svg = svg.replace(/<\?xml[^>]*\?>/g, '');

// Trim
svg = svg.trim();

const size = (svg.length / 1024).toFixed(2);

console.log('✓ SVG processed');
console.log('✓ Size:', size, 'KB\n');

// Create markdown with inline SVG
const output = `# SECTION AA-DAR LAZAR

${svg}
`;

fs.writeFileSync('drawing-clean.md', output, 'utf8');

const finalSize = (fs.statSync('drawing-clean.md').size / 1024).toFixed(2);

console.log('✓ Created: drawing-clean.md');
console.log('✓ File size:', finalSize, 'KB');
console.log('\n✓ Open in DocMark - will render inline!\n');
