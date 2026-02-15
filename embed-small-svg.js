/**
 * Embed small SVG inline for DocMark
 * This will work perfectly with a 1KB SVG
 */

const fs = require('fs');
const path = require('path');

// Find the SVG file
const possiblePaths = [
    'wall_section_diagrams.svg',
    './wall_section_diagrams.svg',
    'C:\\Users\\Administrator\\wall_section_diagrams.svg',
    'C:\\Users\\Administrator\\Documents\\wall_section_diagrams.svg',
    'C:\\Users\\Administrator\\Downloads\\wall_section_diagrams.svg'
];

let svgPath = null;
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        svgPath = p;
        break;
    }
}

if (!svgPath) {
    console.log('SVG file not found. Please provide the full path.');
    console.log('Searched in:');
    possiblePaths.forEach(p => console.log('  -', p));
    process.exit(1);
}

console.log('✓ Found SVG:', svgPath, '\n');

// Read SVG
const svg = fs.readFileSync(svgPath, 'utf8');
const size = (svg.length / 1024).toFixed(2);

console.log('✓ Size:', size, 'KB');
console.log('✓ Creating DocMark file...\n');

// Create markdown with multiple layout options
const output = `# Wall Section Diagrams

## Option 1: Standard Container

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
${svg}
</div>

---

## Option 2: Centered

<div style="text-align: center; padding: 20px;">
${svg}
</div>

---

## Option 3: Full Width

${svg}

---

## Option 4: With Title

<div style="width: 100%; max-width: 1200px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="padding: 15px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;">
    <h3 style="margin: 0; font-size: 18px;">Wall Section Diagrams</h3>
  </div>
  <div style="padding: 20px; background: #ffffff;">
${svg}
  </div>
</div>

---

## Option 5: Compact

<div style="width: 100%; max-width: 800px; margin: 20px auto;">
${svg}
</div>
`;

fs.writeFileSync('wall-sections.md', output, 'utf8');

const outputSize = (fs.statSync('wall-sections.md').size / 1024).toFixed(2);

console.log('✓ Created: wall-sections.md');
console.log('✓ File size:', outputSize, 'KB');
console.log('\n✓ Open in DocMark - all 5 options will render!\n');
