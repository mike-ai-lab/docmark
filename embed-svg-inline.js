/**
 * Embed SVG inline in markdown - working approach
 * Creates file with actual SVG content, not references
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
    svgPath: 'C:\\Users\\Administrator\\Documents\\SECTION AA-DAR LAZAR.svg',
    outputFile: 'svg-inline-render.md',
    title: 'SECTION AA-DAR LAZAR'
};

console.log('Reading SVG file...\n');

// Read SVG content
const svgContent = fs.readFileSync(CONFIG.svgPath, 'utf8');
const fileSize = (fs.statSync(CONFIG.svgPath).size / 1024).toFixed(2);

console.log('✓ SVG loaded:', fileSize, 'KB');
console.log('✓ Creating inline embed file...\n');

// Create markdown with inline SVG (like your working example)
const output = `# ${CONFIG.title}

## Option 1: Direct Inline SVG

${svgContent}

---

## Option 2: With Container

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
${svgContent}
</div>

---

## Option 3: Centered

<div style="text-align: center; padding: 20px;">
${svgContent}
</div>

---

## Option 4: With Shadow

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border-radius: 12px; background: #ffffff;">
${svgContent}
</div>

---

## Option 5: Compact

<div style="width: 100%; max-width: 800px; margin: 20px auto;">
${svgContent}
</div>

---

**File Size:** ${fileSize} KB  
**Format:** SVG (Vector)  
**All options render directly in DocMark**
`;

fs.writeFileSync(CONFIG.outputFile, output, 'utf8');

const outputSize = (fs.statSync(CONFIG.outputFile).size / 1024 / 1024).toFixed(2);

console.log('✓ Created:', CONFIG.outputFile);
console.log('✓ Output size:', outputSize, 'MB');
console.log('\n✓ Ready to open in DocMark!');
console.log('✓ All 5 options will render immediately\n');
