/**
 * Create DocMark file with SVG reference (not embedded)
 * Much smaller file size, references external SVG
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
    svgPath: 'C:\\Users\\Administrator\\Documents\\SECTION AA-DAR LAZAR.svg',
    outputFile: 'svg-display-options.md',
    title: 'SECTION AA-DAR LAZAR'
};

// Get SVG info
const svgFileName = path.basename(CONFIG.svgPath);
const fileSize = (fs.statSync(CONFIG.svgPath).size / 1024).toFixed(2);

// Create relative path for reference
const svgRelativePath = CONFIG.svgPath.replace(/\\/g, '/');

console.log('Creating DocMark file with SVG references...\n');

const output = `# ${CONFIG.title}

**File:** ${svgFileName} (${fileSize} KB)

---

## Option 1: Standard Container

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <img src="${svgRelativePath}" alt="${CONFIG.title}" style="width: 100%; height: auto; display: block;" />
</div>

---

## Option 2: Centered with Shadow

<div style="width: 100%; max-width: 1200px; margin: 20px auto; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border-radius: 12px; padding: 30px; background: #ffffff;">
  <img src="${svgRelativePath}" alt="${CONFIG.title}" style="max-width: 100%; height: auto;" />
</div>

---

## Option 3: Full Width

<div style="width: 100%; padding: 20px; background: #f8fafc;">
  <img src="${svgRelativePath}" alt="${CONFIG.title}" style="width: 100%; height: auto; display: block;" />
</div>

---

## Option 4: With Title Header

<div style="width: 100%; max-width: 1200px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <div style="padding: 20px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;">
    <h2 style="margin: 0; font-size: 24px; font-weight: 600;">${CONFIG.title}</h2>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Technical Drawing - Vector Format</p>
  </div>
  <div style="padding: 20px; background: #ffffff;">
    <img src="${svgRelativePath}" alt="${CONFIG.title}" style="width: 100%; height: auto; display: block;" />
  </div>
</div>

---

## Option 5: Compact View

<div style="width: 100%; max-width: 800px; margin: 20px auto;">
  <img src="${svgRelativePath}" alt="${CONFIG.title}" style="width: 100%; height: auto; display: block; border: 1px solid #e2e8f0; border-radius: 8px;" />
</div>

---

## Option 6: Object Tag (Interactive)

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
  <object data="${svgRelativePath}" type="image/svg+xml" style="width: 100%; height: auto; min-height: 600px;">
    <img src="${svgRelativePath}" alt="${CONFIG.title}" style="width: 100%;" />
  </object>
</div>

---

## Option 7: With Gradient Background

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 30px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px;">
  <img src="${svgRelativePath}" alt="${CONFIG.title}" style="width: 100%; height: auto; display: block;" />
</div>

---

## Option 8: Minimal (No Container)

<img src="${svgRelativePath}" alt="${CONFIG.title}" style="width: 100%; height: auto; display: block;" />

---

## Option 9: Side-by-Side with Info

<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; max-width: 1400px; margin: 20px auto;">
  <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
    <img src="${svgRelativePath}" alt="${CONFIG.title}" style="width: 100%; height: auto; display: block;" />
  </div>
  <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
    <h3 style="margin-top: 0; color: #1e293b;">Drawing Details</h3>
    <ul style="color: #64748b; line-height: 1.8; padding-left: 20px;">
      <li>Format: SVG (Vector)</li>
      <li>Size: ${fileSize} KB</li>
      <li>Scalable: Yes</li>
      <li>Quality: Lossless</li>
      <li>Print Ready: Yes</li>
    </ul>
  </div>
</div>

---

## Option 10: Print-Optimized

<div class="print-optimized" style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #cbd5e1; background: #ffffff;">
  <img src="${svgRelativePath}" alt="${CONFIG.title}" style="width: 100%; height: auto; display: block;" />
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

**Note:** All options reference the external SVG file. The SVG will load when you open this file in DocMark.
`;

fs.writeFileSync(CONFIG.outputFile, output, 'utf8');

const outputSize = (fs.statSync(CONFIG.outputFile).size / 1024).toFixed(2);

console.log('✓ Created:', CONFIG.outputFile);
console.log('✓ File size:', outputSize, 'KB (references SVG, not embedded)');
console.log('\nReady to use in DocMark!');
console.log('All 10 options will render with the external SVG file.\n');
