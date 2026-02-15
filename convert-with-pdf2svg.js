/**
 * PDF to SVG Converter using pdf2svg
 * Converts PDF with vector drawings to true SVG format
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
    pdf2svgPath: 'C:\\Users\\Administrator\\pdf2svg-0.2.4\\pdf2svg-0.2.4\\pdf2svg.exe',
    inputPdf: 'C:\\Users\\Administrator\\Downloads\\test_svg_embed.pdf',
    outputDir: './svg-output',
    outputBaseName: 'converted'
};

// Colors for console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

/**
 * Check if pdf2svg exists
 */
function checkPdf2svg() {
    if (!fs.existsSync(CONFIG.pdf2svgPath)) {
        throw new Error(`pdf2svg not found at: ${CONFIG.pdf2svgPath}`);
    }
    console.log(`${colors.green}✓${colors.reset} pdf2svg found at: ${CONFIG.pdf2svgPath}\n`);
}

/**
 * Get number of pages in PDF
 */
async function getPdfPageCount(pdfPath) {
    try {
        // Try using pdfinfo if available
        const { stdout } = await execAsync(`pdfinfo "${pdfPath}"`);
        const match = stdout.match(/Pages:\s+(\d+)/);
        if (match) {
            return parseInt(match[1]);
        }
    } catch (error) {
        // pdfinfo not available, assume 1 page
        console.log(`${colors.yellow}⚠${colors.reset} Could not determine page count, assuming 1 page\n`);
    }
    return 1;
}

/**
 * Convert PDF page to SVG using pdf2svg
 */
async function convertPage(pdfPath, outputPath, pageNum = null) {
    const command = pageNum 
        ? `"${CONFIG.pdf2svgPath}" "${pdfPath}" "${outputPath}" ${pageNum}`
        : `"${CONFIG.pdf2svgPath}" "${pdfPath}" "${outputPath}"`;
    
    console.log(`${colors.cyan}Converting${pageNum ? ` page ${pageNum}` : ''}...${colors.reset}`);
    
    try {
        await execAsync(command);
        return true;
    } catch (error) {
        console.error(`${colors.red}✗${colors.reset} Conversion failed: ${error.message}`);
        return false;
    }
}

/**
 * Optimize SVG file
 */
function optimizeSvg(svgPath) {
    let svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Remove XML comments
    svgContent = svgContent.replace(/<!--[\s\S]*?-->/g, '');
    
    // Ensure proper XML declaration
    if (!svgContent.startsWith('<?xml')) {
        svgContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgContent;
    }
    
    // Add viewBox if missing
    if (!svgContent.includes('viewBox')) {
        const widthMatch = svgContent.match(/width="([^"]+)"/);
        const heightMatch = svgContent.match(/height="([^"]+)"/);
        
        if (widthMatch && heightMatch) {
            const width = parseFloat(widthMatch[1]);
            const height = parseFloat(heightMatch[1]);
            
            if (!isNaN(width) && !isNaN(height)) {
                svgContent = svgContent.replace(
                    /<svg([^>]*)>/,
                    `<svg$1 viewBox="0 0 ${width} ${height}">`
                );
            }
        }
    }
    
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    
    // Get file size
    const stats = fs.statSync(svgPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    return { size: sizeKB, content: svgContent };
}

/**
 * Generate DocMark embed code
 */
function generateEmbedCode(svgFiles, outputDir) {
    const embedCodes = [];
    
    svgFiles.forEach((svgFile, index) => {
        const svgPath = path.join(outputDir, svgFile);
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        
        // Method 1: Inline SVG (best for DocMark)
        const inlineEmbed = `<!-- SVG Page ${index + 1} - Inline Embed -->
<div class="svg-container" style="width: 100%; max-width: 800px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
${svgContent}
</div>`;
        
        // Method 2: IMG tag
        const imgEmbed = `<!-- SVG Page ${index + 1} - Image Tag -->
<div class="svg-container" style="width: 100%; max-width: 800px; margin: 20px auto; text-align: center;">
  <img src="${svgFile}" alt="SVG Page ${index + 1}" style="width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 8px;" />
</div>`;
        
        // Method 3: Object tag
        const objectEmbed = `<!-- SVG Page ${index + 1} - Object Tag -->
<div class="svg-container" style="width: 100%; max-width: 800px; margin: 20px auto;">
  <object data="${svgFile}" type="image/svg+xml" style="width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
    <img src="${svgFile}" alt="SVG Page ${index + 1}" />
  </object>
</div>`;
        
        embedCodes.push({
            page: index + 1,
            file: svgFile,
            inline: inlineEmbed,
            img: imgEmbed,
            object: objectEmbed
        });
    });
    
    return embedCodes;
}

/**
 * Generate markdown documentation
 */
function generateMarkdown(embedCodes, outputDir) {
    const mdPath = path.join(outputDir, 'svg-embed-codes.md');
    
    let markdown = `# SVG Embed Codes for DocMark

**Source:** test_svg_embed.pdf  
**Converted with:** pdf2svg  
**Generated:** ${new Date().toISOString()}  
**Pages:** ${embedCodes.length}

---

## 🎉 True SVG Conversion Complete!

Your PDF has been converted to actual SVG format with preserved vector graphics.

---

## Quick Copy - All Pages (Inline SVG)

Best method for DocMark - embeds SVG directly in HTML.

\`\`\`html
${embedCodes.map(e => e.inline).join('\n\n')}
\`\`\`

---

## Individual Pages

`;
    
    embedCodes.forEach(embed => {
        markdown += `### Page ${embed.page}: ${embed.file}

#### Method 1: Inline SVG ⭐ (Recommended)
Embeds the SVG directly in the HTML. Best quality, fully scalable.

\`\`\`html
${embed.inline}
\`\`\`

#### Method 2: Image Tag
Simple image reference. Good for external SVG files.

\`\`\`html
${embed.img}
\`\`\`

#### Method 3: Object Tag
Alternative embedding method with fallback.

\`\`\`html
${embed.object}
\`\`\`

---

`;
    });
    
    markdown += `## Usage in DocMark

1. **Copy** one of the embed codes above
2. **Paste** directly into DocMark editor
3. **Preview** - The SVG will render perfectly in the preview pane

### Why Inline SVG is Best

- ✅ **Scalable** - Looks perfect at any size
- ✅ **Editable** - Can modify colors, styles with CSS
- ✅ **Interactive** - Can add hover effects, animations
- ✅ **No External Files** - Everything in one document
- ✅ **Fast** - No additional HTTP requests

---

## Styling Tips

### Container Styling
\`\`\`css
.svg-container {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
\`\`\`

### Dark Theme Support
\`\`\`css
[data-theme="dark"] .svg-container {
  background: #1e293b;
  border-color: #334155;
}

[data-theme="dark"] .svg-container svg {
  filter: invert(0.9);
}
\`\`\`

### Responsive Design
\`\`\`css
@media (max-width: 768px) {
  .svg-container {
    max-width: 100%;
    margin: 10px;
    padding: 10px;
  }
}
\`\`\`

---

## Files Generated

${embedCodes.map(e => `- **${e.file}** - SVG page ${e.page}`).join('\n')}
- **svg-embed-codes.md** - This documentation file

---

## Advantages of True SVG

✅ **Vector Graphics** - Infinite scalability without quality loss  
✅ **Small File Size** - Typically smaller than raster images  
✅ **Editable** - Can modify with text editor or design tools  
✅ **CSS Styleable** - Apply styles, animations, filters  
✅ **Accessible** - Can add titles, descriptions for screen readers  
✅ **Print Perfect** - Crisp output at any resolution  

---

## Next Steps

### Test in DocMark
1. Open DocMark: \`npm run dev\`
2. Create new document or open existing
3. Paste one of the embed codes
4. View in preview pane

### Customize Appearance
- Modify inline styles in the embed code
- Add custom CSS classes
- Adjust dimensions and spacing
- Apply filters or effects

### Advanced Usage
- Combine multiple SVGs in one document
- Add interactive elements with JavaScript
- Create animated SVG graphics
- Export to PDF with vector quality

---

**Conversion Tool:** pdf2svg  
**Quality:** Vector (lossless)  
**Format:** SVG 1.1  
**Compatibility:** All modern browsers  
**DocMark Ready:** ✅ Yes
`;
    
    fs.writeFileSync(mdPath, markdown, 'utf8');
    return mdPath;
}

/**
 * Main conversion function
 */
async function main() {
    console.log(`${colors.bold}${colors.cyan}
╔════════════════════════════════════════╗
║   PDF to SVG Converter (pdf2svg)      ║
╚════════════════════════════════════════╝
${colors.reset}\n`);
    
    try {
        // Check pdf2svg
        checkPdf2svg();
        
        // Check input PDF
        if (!fs.existsSync(CONFIG.inputPdf)) {
            throw new Error(`PDF file not found: ${CONFIG.inputPdf}`);
        }
        console.log(`${colors.green}✓${colors.reset} Input PDF: ${CONFIG.inputPdf}\n`);
        
        // Create output directory
        if (!fs.existsSync(CONFIG.outputDir)) {
            fs.mkdirSync(CONFIG.outputDir, { recursive: true });
        }
        console.log(`${colors.green}✓${colors.reset} Output directory: ${CONFIG.outputDir}\n`);
        
        // Get page count
        const pageCount = await getPdfPageCount(CONFIG.inputPdf);
        console.log(`${colors.cyan}ℹ${colors.reset} PDF has ${pageCount} page(s)\n`);
        
        // Convert pages
        const svgFiles = [];
        
        if (pageCount === 1) {
            // Single page
            const outputPath = path.join(CONFIG.outputDir, `${CONFIG.outputBaseName}.svg`);
            const success = await convertPage(CONFIG.inputPdf, outputPath);
            if (success) {
                svgFiles.push(path.basename(outputPath));
            }
        } else {
            // Multiple pages
            for (let i = 1; i <= pageCount; i++) {
                const outputPath = path.join(CONFIG.outputDir, `${CONFIG.outputBaseName}-page-${i}.svg`);
                const success = await convertPage(CONFIG.inputPdf, outputPath, i);
                if (success) {
                    svgFiles.push(path.basename(outputPath));
                }
            }
        }
        
        if (svgFiles.length === 0) {
            throw new Error('No SVG files were created');
        }
        
        console.log(`\n${colors.green}✓${colors.reset} Converted ${svgFiles.length} page(s) to SVG\n`);
        
        // Optimize SVG files
        console.log(`${colors.cyan}Optimizing SVG files...${colors.reset}`);
        svgFiles.forEach(file => {
            const svgPath = path.join(CONFIG.outputDir, file);
            const { size } = optimizeSvg(svgPath);
            console.log(`${colors.green}✓${colors.reset} ${file} (${size} KB)`);
        });
        console.log('');
        
        // Generate embed codes
        console.log(`${colors.cyan}Generating embed codes...${colors.reset}`);
        const embedCodes = generateEmbedCode(svgFiles, CONFIG.outputDir);
        const mdPath = generateMarkdown(embedCodes, CONFIG.outputDir);
        console.log(`${colors.green}✓${colors.reset} Documentation: ${mdPath}\n`);
        
        // Success summary
        console.log(`${colors.bold}${colors.green}
╔════════════════════════════════════════╗
║      CONVERSION SUCCESSFUL! 🎉         ║
╚════════════════════════════════════════╝
${colors.reset}`);
        
        console.log(`\n${colors.cyan}Output Files:${colors.reset}`);
        svgFiles.forEach(file => {
            const filePath = path.join(CONFIG.outputDir, file);
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`  • ${file} (${sizeKB} KB)`);
        });
        console.log(`  • svg-embed-codes.md\n`);
        
        console.log(`${colors.cyan}Next Steps:${colors.reset}`);
        console.log(`  1. Open ${colors.yellow}${mdPath}${colors.reset}`);
        console.log(`  2. Copy the inline SVG embed code`);
        console.log(`  3. Paste into DocMark editor`);
        console.log(`  4. Enjoy perfect vector graphics! ✨\n`);
        
        console.log(`${colors.cyan}Quick Preview:${colors.reset}`);
        console.log(`${colors.yellow}${'─'.repeat(50)}${colors.reset}`);
        const preview = embedCodes[0].inline.substring(0, 300);
        console.log(preview + '...');
        console.log(`${colors.yellow}${'─'.repeat(50)}${colors.reset}\n`);
        
    } catch (error) {
        console.error(`${colors.red}${colors.bold}✗ Error:${colors.reset} ${error.message}\n`);
        process.exit(1);
    }
}

// Run
if (require.main === module) {
    main();
}

module.exports = { main, convertPage, optimizeSvg, generateEmbedCode };
