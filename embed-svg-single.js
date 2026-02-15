/**
 * Single best option - smallest file size
 */

const fs = require('fs');

const svgPath = 'C:\\Users\\Administrator\\Documents\\SECTION AA-DAR LAZAR.svg';
const svgContent = fs.readFileSync(svgPath, 'utf8');

const output = `# SECTION AA-DAR LAZAR

## Technical Drawing

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
${svgContent}
</div>
`;

fs.writeFileSync('drawing.md', output, 'utf8');

const size = (fs.statSync('drawing.md').size / 1024 / 1024).toFixed(2);
console.log('✓ Created: drawing.md (' + size + ' MB)');
console.log('✓ Single optimized option');
console.log('✓ Ready to open in DocMark\n');
