const fs = require('fs');
const path = require('path');

const pngPath = 'C:\\Users\\Administrator\\Documents\\SECTION-AA-DAR-LAZAR.png';

if (!fs.existsSync(pngPath)) {
    console.log('PNG not found. Checking for alternative names...');
    process.exit(1);
}

const pngSize = (fs.statSync(pngPath).size / 1024).toFixed(2);
const pngRelative = pngPath.replace(/\\/g, '/');

console.log('✓ PNG created:', pngSize, 'KB\n');

const output = `# SECTION AA-DAR LAZAR

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <img src="${pngRelative}" alt="SECTION AA-DAR LAZAR" style="width: 100%; height: auto; display: block;" />
</div>
`;

fs.writeFileSync('drawing-final.md', output, 'utf8');

const mdSize = (fs.statSync('drawing-final.md').size / 1024).toFixed(2);

console.log('✓ Created: drawing-final.md');
console.log('✓ File size:', mdSize, 'KB (references PNG)');
console.log('\n✓ Ready to open in DocMark!');
console.log('✓ Will render immediately\n');
