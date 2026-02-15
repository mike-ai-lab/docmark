/**
 * Process SVG and generate DocMark-ready file
 * Creates a file with working embed options, not documentation
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    inputSvg: 'C:\\Users\\Administrator\\Documents\\SECTION AA-DAR LAZAR.svg',
    outputFile: 'svg-embed-ready.md',
    title: 'SECTION AA-DAR LAZAR'
};

console.log('Processing SVG for DocMark...\n');

// Read SVG file
if (!fs.existsSync(CONFIG.inputSvg)) {
    console.error('Error: SVG file not found:', CONFIG.inputSvg);
    process.exit(1);
}

const svgContent = fs.readFileSync(CONFIG.inputSvg, 'utf8');
const svgFileName = path.basename(CONFIG.inputSvg);
const fileSize = (fs.statSync(CONFIG.inputSvg).size / 1024).toFixed(2);

console.log('✓ SVG file loaded:', svgFileName);
console.log('✓ File size:', fileSize, 'KB\n');

// Optimize SVG
let optimizedSvg = svgContent;

// Remove XML comments
optimizedSvg = optimizedSvg.replace(/<!--[\s\S]*?-->/g, '');

// Ensure viewBox for responsive scaling
if (!optimizedSvg.includes('viewBox')) {
    const widthMatch = optimizedSvg.match(/width="([^"]+)"/);
    const heightMatch = optimizedSvg.match(/height="([^"]+)"/);
    
    if (widthMatch && heightMatch) {
        const width = parseFloat(widthMatch[1]);
        const height = parseFloat(heightMatch[1]);
        
        if (!isNaN(width) && !isNaN(height)) {
            optimizedSvg = optimizedSvg.replace(
                /<svg([^>]*)>/,
                `<svg$1 viewBox="0 0 ${width} ${height}">`
            );
        }
    }
}

console.log('✓ SVG optimized\n');

// Generate DocMark-ready file with working embeds
const output = `# ${CONFIG.title}

---

## Option 1: Inline SVG (Recommended)

<div class="svg-container" style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
${optimizedSvg}
</div>

---

## Option 2: Inline SVG with Dark Theme Support

<div class="svg-container-dark" style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
${optimizedSvg}
</div>

<style>
[data-theme="dark"] .svg-container-dark {
  background: #1e293b;
  border-color: #334155;
}
[data-theme="dark"] .svg-container-dark svg {
  filter: invert(0.9) hue-rotate(180deg);
}
</style>

---

## Option 3: Centered with Border

<div style="width: 100%; max-width: 1200px; margin: 40px auto; padding: 30px; border: 2px solid #3b82f6; border-radius: 12px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); text-align: center;">
${optimizedSvg}
</div>

---

## Option 4: Compact View

<div style="width: 100%; max-width: 800px; margin: 20px auto;">
${optimizedSvg}
</div>

---

## Option 5: Full Width

<div style="width: 100%; padding: 20px; background: #f8fafc;">
${optimizedSvg}
</div>

---

## Option 6: With Title and Description

<div style="width: 100%; max-width: 1200px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <div style="padding: 20px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;">
    <h2 style="margin: 0; font-size: 24px; font-weight: 600;">${CONFIG.title}</h2>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Technical Drawing - Vector Format</p>
  </div>
  <div style="padding: 20px; background: #ffffff;">
${optimizedSvg}
  </div>
</div>

---

## Option 7: Side-by-Side Layout

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 1400px; margin: 20px auto;">
  <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
${optimizedSvg}
  </div>
  <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
    <h3 style="margin-top: 0; color: #1e293b;">Drawing Details</h3>
    <ul style="color: #64748b; line-height: 1.8;">
      <li>Format: SVG (Vector)</li>
      <li>Size: ${fileSize} KB</li>
      <li>Scalable: Yes</li>
      <li>Quality: Lossless</li>
    </ul>
  </div>
</div>

---

## Option 8: Minimal (No Container)

${optimizedSvg}

---

## Option 9: With Shadow Effect

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
${optimizedSvg}
</div>

---

## Option 10: Print-Optimized

<div class="print-optimized" style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #cbd5e1; background: #ffffff;">
${optimizedSvg}
</div>

<style>
@media print {
  .print-optimized {
    border: none;
    box-shadow: none;
    page-break-inside: avoid;
  }
}
</style>

---

**File:** ${svgFileName}  
**Size:** ${fileSize} KB  
**Format:** SVG (Vector Graphics)  
**Generated:** ${new Date().toISOString()}
`;

// Write output file
fs.writeFileSync(CONFIG.outputFile, output, 'utf8');

console.log('✓ Output file created:', CONFIG.outputFile);
console.log('\nNext steps:');
console.log('  1. Open', CONFIG.outputFile, 'in DocMark');
console.log('  2. All 10 options will render immediately');
console.log('  3. Choose the one you like best\n');
console.log('Done! ✓\n');
