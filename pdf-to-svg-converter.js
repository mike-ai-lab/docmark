/**
 * PDF to SVG Converter
 * Converts PDF files containing vector drawings to SVG format
 * Generates embed code compatible with DocMark's HTML renderer
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
    inputPdf: 'C:\\Users\\Administrator\\Downloads\\test_svg_embed.pdf',
    outputDir: './svg-output',
    outputBaseName: 'converted',
    embedWidth: '100%',
    embedMaxWidth: '800px',
    embedStyle: 'border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #ffffff;'
};

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

/**
 * Check if required tools are installed
 */
async function checkDependencies() {
    console.log(`${colors.cyan}${colors.bold}Checking dependencies...${colors.reset}\n`);
    
    const tools = [
        { name: 'pdf2svg', command: 'pdf2svg --version', installCmd: 'Install from: http://www.cityinthesky.co.uk/opensource/pdf2svg/' },
        { name: 'pdftocairo', command: 'pdftocairo -v', installCmd: 'Install poppler-utils: choco install poppler' },
        { name: 'inkscape', command: 'inkscape --version', installCmd: 'Install from: https://inkscape.org/release/' }
    ];
    
    const available = [];
    
    for (const tool of tools) {
        try {
            await execAsync(tool.command);
            console.log(`${colors.green}✓${colors.reset} ${tool.name} is installed`);
            available.push(tool.name);
        } catch (error) {
            console.log(`${colors.yellow}✗${colors.reset} ${tool.name} not found`);
            console.log(`  ${colors.blue}→${colors.reset} ${tool.installCmd}`);
        }
    }
    
    console.log('');
    return available;
}

/**
 * Get PDF information
 */
async function getPdfInfo(pdfPath) {
    try {
        const { stdout } = await execAsync(`pdfinfo "${pdfPath}"`);
        const pages = stdout.match(/Pages:\s+(\d+)/);
        return {
            pages: pages ? parseInt(pages[1]) : 1,
            exists: true
        };
    } catch (error) {
        // Fallback: assume 1 page if pdfinfo not available
        return {
            pages: 1,
            exists: fs.existsSync(pdfPath)
        };
    }
}

/**
 * Convert PDF to SVG using pdftocairo (best quality for vector graphics)
 */
async function convertWithPdftocairo(pdfPath, outputDir, baseName) {
    console.log(`${colors.cyan}Converting with pdftocairo...${colors.reset}`);
    
    const outputPath = path.join(outputDir, baseName);
    const command = `pdftocairo -svg "${pdfPath}" "${outputPath}.svg"`;
    
    try {
        await execAsync(command);
        
        // Check if files were created (pdftocairo creates page-1.svg, page-2.svg, etc.)
        const files = fs.readdirSync(outputDir).filter(f => f.startsWith(baseName) && f.endsWith('.svg'));
        
        if (files.length === 0) {
            // Single page PDF
            const singleFile = `${baseName}.svg`;
            if (fs.existsSync(path.join(outputDir, singleFile))) {
                return [singleFile];
            }
        }
        
        return files.sort();
    } catch (error) {
        throw new Error(`pdftocairo conversion failed: ${error.message}`);
    }
}

/**
 * Convert PDF to SVG using Inkscape (alternative method)
 */
async function convertWithInkscape(pdfPath, outputDir, baseName, pageNum = 1) {
    console.log(`${colors.cyan}Converting page ${pageNum} with Inkscape...${colors.reset}`);
    
    const outputPath = path.join(outputDir, `${baseName}-page-${pageNum}.svg`);
    const command = `inkscape "${pdfPath}" --export-page=${pageNum} --export-filename="${outputPath}" --export-type=svg`;
    
    try {
        await execAsync(command);
        return path.basename(outputPath);
    } catch (error) {
        throw new Error(`Inkscape conversion failed: ${error.message}`);
    }
}

/**
 * Optimize SVG file (remove unnecessary data, clean up)
 */
function optimizeSvg(svgPath) {
    let svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Remove XML comments
    svgContent = svgContent.replace(/<!--[\s\S]*?-->/g, '');
    
    // Add viewBox if missing (helps with responsive scaling)
    if (!svgContent.includes('viewBox') && svgContent.includes('width=') && svgContent.includes('height=')) {
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
    
    // Ensure proper XML declaration
    if (!svgContent.startsWith('<?xml')) {
        svgContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgContent;
    }
    
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    return svgContent;
}

/**
 * Generate embed code for DocMark
 */
function generateEmbedCode(svgFiles, outputDir) {
    const embedCodes = [];
    
    svgFiles.forEach((svgFile, index) => {
        const svgPath = path.join(outputDir, svgFile);
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        
        // Extract SVG dimensions
        const widthMatch = svgContent.match(/width="([^"]+)"/);
        const heightMatch = svgContent.match(/height="([^"]+)"/);
        const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
        
        let width = CONFIG.embedWidth;
        let aspectRatio = '';
        
        if (viewBoxMatch) {
            const [, , vbWidth, vbHeight] = viewBoxMatch[1].split(' ').map(parseFloat);
            if (vbWidth && vbHeight) {
                aspectRatio = `aspect-ratio: ${vbWidth} / ${vbHeight};`;
            }
        } else if (widthMatch && heightMatch) {
            const w = parseFloat(widthMatch[1]);
            const h = parseFloat(heightMatch[1]);
            if (!isNaN(w) && !isNaN(h)) {
                aspectRatio = `aspect-ratio: ${w} / ${h};`;
            }
        }
        
        // Method 1: Inline SVG (best for DocMark)
        const inlineEmbed = `<!-- SVG Embed - Page ${index + 1} (Inline) -->
<div class="svg-container" style="width: ${width}; max-width: ${CONFIG.embedMaxWidth}; margin: 20px auto; ${CONFIG.embedStyle}">
${svgContent}
</div>`;
        
        // Method 2: Object tag (alternative)
        const objectEmbed = `<!-- SVG Embed - Page ${index + 1} (Object) -->
<div class="svg-container" style="width: ${width}; max-width: ${CONFIG.embedMaxWidth}; margin: 20px auto;">
  <object data="${svgFile}" type="image/svg+xml" style="width: 100%; ${aspectRatio} ${CONFIG.embedStyle}">
    <img src="${svgFile}" alt="SVG Page ${index + 1}" style="width: 100%;" />
  </object>
</div>`;
        
        // Method 3: IMG tag (simplest, but loses interactivity)
        const imgEmbed = `<!-- SVG Embed - Page ${index + 1} (Image) -->
<div class="svg-container" style="width: ${width}; max-width: ${CONFIG.embedMaxWidth}; margin: 20px auto; text-align: center;">
  <img src="${svgFile}" alt="SVG Page ${index + 1}" style="width: 100%; ${aspectRatio} ${CONFIG.embedStyle}" />
</div>`;
        
        embedCodes.push({
            page: index + 1,
            file: svgFile,
            inline: inlineEmbed,
            object: objectEmbed,
            img: imgEmbed
        });
    });
    
    return embedCodes;
}

/**
 * Generate markdown file with all embed codes
 */
function generateMarkdownFile(embedCodes, outputDir) {
    const mdPath = path.join(outputDir, 'embed-codes.md');
    
    let markdown = `# SVG Embed Codes for DocMark

Generated from: ${CONFIG.inputPdf}
Date: ${new Date().toISOString()}

---

## Quick Copy - All Pages (Inline SVG - Recommended)

This is the best method for DocMark as it embeds the SVG directly in the HTML.

\`\`\`html
${embedCodes.map(e => e.inline).join('\n\n')}
\`\`\`

---

## Individual Pages

`;
    
    embedCodes.forEach(embed => {
        markdown += `### Page ${embed.page} - ${embed.file}

#### Method 1: Inline SVG (Recommended for DocMark)
Best quality, fully interactive, works with DocMark's HTML renderer.

\`\`\`html
${embed.inline}
\`\`\`

#### Method 2: Object Tag (Alternative)
Good for external SVG files, maintains interactivity.

\`\`\`html
${embed.object}
\`\`\`

#### Method 3: Image Tag (Simplest)
Simplest method, but loses SVG interactivity.

\`\`\`html
${embed.img}
\`\`\`

---

`;
    });
    
    markdown += `## Usage in DocMark

1. Copy one of the embed codes above
2. Paste directly into DocMark editor
3. The SVG will render in the preview pane

## Styling Tips

You can customize the appearance by modifying the inline styles:

\`\`\`css
/* Container styling */
.svg-container {
  width: 100%;              /* Responsive width */
  max-width: 800px;         /* Maximum width */
  margin: 20px auto;        /* Center with spacing */
  padding: 20px;            /* Inner padding */
  background: #ffffff;      /* Background color */
  border: 1px solid #e2e8f0; /* Border */
  border-radius: 8px;       /* Rounded corners */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* Optional shadow */
}

/* Dark theme support */
[data-theme="dark"] .svg-container {
  background: #1e293b;
  border-color: #334155;
}
\`\`\`

## Files Generated

${embedCodes.map(e => `- ${e.file}`).join('\n')}
- embed-codes.md (this file)

---

**Note:** All SVG files are optimized and include viewBox attributes for responsive scaling.
`;
    
    fs.writeFileSync(mdPath, markdown, 'utf8');
    return mdPath;
}

/**
 * Main conversion function
 */
async function convertPdfToSvg() {
    console.log(`${colors.bold}${colors.cyan}
╔════════════════════════════════════════╗
║   PDF to SVG Converter for DocMark    ║
╚════════════════════════════════════════╝
${colors.reset}\n`);
    
    try {
        // Check if input file exists
        if (!fs.existsSync(CONFIG.inputPdf)) {
            throw new Error(`PDF file not found: ${CONFIG.inputPdf}`);
        }
        
        console.log(`${colors.green}✓${colors.reset} Input PDF found: ${CONFIG.inputPdf}\n`);
        
        // Check dependencies
        const availableTools = await checkDependencies();
        
        if (availableTools.length === 0) {
            throw new Error('No conversion tools available. Please install pdftocairo, inkscape, or pdf2svg.');
        }
        
        // Create output directory
        if (!fs.existsSync(CONFIG.outputDir)) {
            fs.mkdirSync(CONFIG.outputDir, { recursive: true });
        }
        
        console.log(`${colors.green}✓${colors.reset} Output directory: ${CONFIG.outputDir}\n`);
        
        // Get PDF info
        const pdfInfo = await getPdfInfo(CONFIG.inputPdf);
        console.log(`${colors.blue}ℹ${colors.reset} PDF has ${pdfInfo.pages} page(s)\n`);
        
        // Convert PDF to SVG
        let svgFiles = [];
        
        if (availableTools.includes('pdftocairo')) {
            svgFiles = await convertWithPdftocairo(CONFIG.inputPdf, CONFIG.outputDir, CONFIG.outputBaseName);
        } else if (availableTools.includes('inkscape')) {
            for (let i = 1; i <= pdfInfo.pages; i++) {
                const file = await convertWithInkscape(CONFIG.inputPdf, CONFIG.outputDir, CONFIG.outputBaseName, i);
                svgFiles.push(file);
            }
        } else {
            throw new Error('No suitable conversion tool available');
        }
        
        console.log(`${colors.green}✓${colors.reset} Converted ${svgFiles.length} page(s) to SVG\n`);
        
        // Optimize SVG files
        console.log(`${colors.cyan}Optimizing SVG files...${colors.reset}`);
        svgFiles.forEach(file => {
            const svgPath = path.join(CONFIG.outputDir, file);
            optimizeSvg(svgPath);
            console.log(`${colors.green}✓${colors.reset} Optimized: ${file}`);
        });
        console.log('');
        
        // Generate embed codes
        console.log(`${colors.cyan}Generating embed codes...${colors.reset}`);
        const embedCodes = generateEmbedCode(svgFiles, CONFIG.outputDir);
        const mdPath = generateMarkdownFile(embedCodes, CONFIG.outputDir);
        console.log(`${colors.green}✓${colors.reset} Embed codes saved to: ${mdPath}\n`);
        
        // Summary
        console.log(`${colors.bold}${colors.green}
╔════════════════════════════════════════╗
║         CONVERSION COMPLETE!           ║
╚════════════════════════════════════════╝
${colors.reset}`);
        
        console.log(`\n${colors.cyan}Output Files:${colors.reset}`);
        svgFiles.forEach(file => {
            console.log(`  • ${file}`);
        });
        console.log(`  • embed-codes.md\n`);
        
        console.log(`${colors.cyan}Next Steps:${colors.reset}`);
        console.log(`  1. Open ${colors.yellow}${mdPath}${colors.reset}`);
        console.log(`  2. Copy the embed code you want`);
        console.log(`  3. Paste into DocMark editor`);
        console.log(`  4. SVG will render in preview!\n`);
        
        console.log(`${colors.cyan}Quick Preview:${colors.reset}`);
        console.log(`${colors.blue}─────────────────────────────────────────${colors.reset}`);
        console.log(embedCodes[0].inline.substring(0, 200) + '...');
        console.log(`${colors.blue}─────────────────────────────────────────${colors.reset}\n`);
        
    } catch (error) {
        console.error(`${colors.red}${colors.bold}✗ Error:${colors.reset} ${error.message}\n`);
        process.exit(1);
    }
}

// Run the converter
if (require.main === module) {
    convertPdfToSvg();
}

module.exports = { convertPdfToSvg, generateEmbedCode, optimizeSvg };
