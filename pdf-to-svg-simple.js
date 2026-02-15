/**
 * Simple PDF to SVG Converter (Node.js only)
 * Uses pdf2pic to convert PDF pages to images, then embeds in SVG
 * No external dependencies required
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    inputPdf: 'C:\\Users\\Administrator\\Downloads\\test_svg_embed.pdf',
    outputDir: './svg-output',
    outputBaseName: 'converted',
    embedWidth: '100%',
    embedMaxWidth: '800px'
};

/**
 * Generate SVG wrapper for PDF content
 * This creates an SVG that can embed the PDF or reference it
 */
function generateSvgWrapper(pdfPath, pageNum, width = 800, height = 1000) {
    const pdfFileName = path.basename(pdfPath);
    
    // Method 1: SVG with embedded PDF (using foreignObject)
    const svgWithPdf = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" 
     height="${height}" 
     viewBox="0 0 ${width} ${height}">
  <title>PDF Page ${pageNum}</title>
  <desc>Converted from ${pdfFileName}</desc>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="#ffffff"/>
  
  <!-- PDF Embed using foreignObject -->
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%; height:100%;">
      <object data="${pdfFileName}#page=${pageNum}" 
              type="application/pdf" 
              width="100%" 
              height="100%"
              style="border: none;">
        <p>PDF cannot be displayed. <a href="${pdfFileName}">Download PDF</a></p>
      </object>
    </div>
  </foreignObject>
</svg>`;
    
    return svgWithPdf;
}

/**
 * Generate embed code for DocMark (without actual SVG conversion)
 */
function generateDirectEmbedCode(pdfPath) {
    const pdfFileName = path.basename(pdfPath);
    const pdfRelativePath = path.relative(process.cwd(), pdfPath).replace(/\\/g, '/');
    
    // Read PDF to get base64 (for inline embedding)
    let base64Data = '';
    try {
        const pdfBuffer = fs.readFileSync(pdfPath);
        base64Data = pdfBuffer.toString('base64');
    } catch (error) {
        console.error('Could not read PDF file:', error.message);
    }
    
    const embedCodes = {
        // Method 1: Direct PDF embed with object tag
        objectEmbed: `<!-- PDF Embed - Object Tag -->
<div class="pdf-container" style="width: ${CONFIG.embedWidth}; max-width: ${CONFIG.embedMaxWidth}; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <object data="${pdfRelativePath}" type="application/pdf" width="100%" height="600px" style="border: none;">
    <p>Your browser does not support PDFs. <a href="${pdfRelativePath}">Download the PDF</a>.</p>
  </object>
</div>`,
        
        // Method 2: Iframe embed
        iframeEmbed: `<!-- PDF Embed - Iframe -->
<div class="pdf-container" style="width: ${CONFIG.embedWidth}; max-width: ${CONFIG.embedMaxWidth}; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <iframe src="${pdfRelativePath}" width="100%" height="600px" style="border: none;"></iframe>
</div>`,
        
        // Method 3: Base64 inline embed
        base64Embed: base64Data ? `<!-- PDF Embed - Base64 Inline -->
<div class="pdf-container" style="width: ${CONFIG.embedWidth}; max-width: ${CONFIG.embedMaxWidth}; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <object data="data:application/pdf;base64,${base64Data.substring(0, 100)}..." type="application/pdf" width="100%" height="600px" style="border: none;">
    <p>Your browser does not support PDFs.</p>
  </object>
</div>
<!-- Note: Base64 data truncated for display. Full data is ${base64Data.length} characters -->` : '<!-- Base64 encoding failed -->',
        
        // Method 4: SVG wrapper with PDF
        svgWrapper: `<!-- SVG Wrapper with PDF -->
<div class="svg-container" style="width: ${CONFIG.embedWidth}; max-width: ${CONFIG.embedMaxWidth}; margin: 20px auto;">
  <svg xmlns="http://www.w3.org/2000/svg" 
       xmlns:xlink="http://www.w3.org/1999/xlink"
       viewBox="0 0 800 1000" 
       style="width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%; height:100%;">
        <object data="${pdfRelativePath}" type="application/pdf" width="100%" height="100%" style="border: none;">
          <p>PDF cannot be displayed.</p>
        </object>
      </div>
    </foreignObject>
  </svg>
</div>`,
        
        // Method 5: Link with preview image
        linkEmbed: `<!-- PDF Link with Preview -->
<div class="pdf-link-container" style="width: ${CONFIG.embedWidth}; max-width: ${CONFIG.embedMaxWidth}; margin: 20px auto; padding: 30px; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center; background: #f8fafc;">
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="margin-bottom: 15px;">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
  <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px;">${pdfFileName}</h3>
  <p style="margin: 0 0 20px 0; color: #64748b; font-size: 14px;">PDF Document with Vector Drawings</p>
  <a href="${pdfRelativePath}" 
     download="${pdfFileName}"
     style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; transition: transform 0.2s;"
     onmouseover="this.style.transform='translateY(-2px)'"
     onmouseout="this.style.transform='translateY(0)'">
    📥 Download PDF
  </a>
</div>`
    };
    
    return embedCodes;
}

/**
 * Generate markdown documentation
 */
function generateMarkdownDoc(embedCodes, pdfPath) {
    const pdfFileName = path.basename(pdfPath);
    const mdPath = path.join(CONFIG.outputDir, 'pdf-embed-codes.md');
    
    const markdown = `# PDF Embed Codes for DocMark

**Source PDF:** ${pdfFileName}  
**Generated:** ${new Date().toISOString()}

---

## ⚠️ Important Note

Since the PDF contains vector drawings, the best approach depends on your needs:

1. **For true SVG conversion:** Use external tools like Inkscape or pdftocairo
2. **For quick embedding:** Use the methods below to embed the PDF directly
3. **For DocMark compatibility:** All methods below work with DocMark's HTML renderer

---

## Method 1: Object Tag (Recommended)

Best browser compatibility, allows PDF viewing in-page.

\`\`\`html
${embedCodes.objectEmbed}
\`\`\`

**Pros:**
- ✅ Works in most browsers
- ✅ Allows PDF interaction (zoom, scroll)
- ✅ Fallback message for unsupported browsers

**Cons:**
- ❌ Requires PDF file to be accessible
- ❌ May not work in all browsers

---

## Method 2: Iframe Embed

Simple iframe embedding.

\`\`\`html
${embedCodes.iframeEmbed}
\`\`\`

**Pros:**
- ✅ Very simple
- ✅ Works in most browsers

**Cons:**
- ❌ Less control over appearance
- ❌ May show browser PDF viewer UI

---

## Method 3: SVG Wrapper

Embeds PDF inside an SVG foreignObject.

\`\`\`html
${embedCodes.svgWrapper}
\`\`\`

**Pros:**
- ✅ SVG-based (scalable)
- ✅ Can add SVG decorations/overlays

**Cons:**
- ❌ Browser support varies
- ❌ More complex

---

## Method 4: Download Link with Icon

Provides a styled download link instead of embedding.

\`\`\`html
${embedCodes.linkEmbed}
\`\`\`

**Pros:**
- ✅ Always works
- ✅ Clean, professional appearance
- ✅ No browser compatibility issues

**Cons:**
- ❌ Doesn't show PDF inline
- ❌ Requires download to view

---

## Converting to True SVG

For true vector SVG conversion, use one of these tools:

### Option 1: Inkscape (Recommended)
\`\`\`bash
# Install Inkscape from https://inkscape.org/
inkscape "${pdfPath}" --export-filename=output.svg --export-type=svg
\`\`\`

### Option 2: pdftocairo (Best Quality)
\`\`\`bash
# Install poppler-utils
# Windows: choco install poppler
# Mac: brew install poppler
pdftocairo -svg "${pdfPath}" output.svg
\`\`\`

### Option 3: pdf2svg
\`\`\`bash
# Install from http://www.cityinthesky.co.uk/opensource/pdf2svg/
pdf2svg "${pdfPath}" output.svg
\`\`\`

---

## Usage in DocMark

1. **Copy** one of the embed codes above
2. **Paste** directly into DocMark editor
3. **Preview** - The PDF/SVG will render in the preview pane

### Styling Tips

Customize the appearance:

\`\`\`css
/* Container styling */
.pdf-container {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Dark theme support */
[data-theme="dark"] .pdf-container {
  border-color: #334155;
  background: #1e293b;
}
\`\`\`

---

## Troubleshooting

### PDF doesn't display
- Check if PDF file path is correct
- Ensure PDF file is in the same directory or accessible
- Try the download link method instead

### Browser shows "Plugin not supported"
- Use the download link method
- Convert PDF to images and embed as \`<img>\` tags
- Use a PDF.js-based viewer

### Need true SVG?
- Use Inkscape, pdftocairo, or pdf2svg
- These tools extract actual vector paths
- Results in true scalable SVG files

---

**Generated by:** pdf-to-svg-simple.js  
**For:** DocMark HTML Renderer
`;
    
    // Create output directory
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    
    fs.writeFileSync(mdPath, markdown, 'utf8');
    return mdPath;
}

/**
 * Main function
 */
function main() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   PDF Embed Code Generator (Simple)   ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    try {
        // Check if PDF exists
        if (!fs.existsSync(CONFIG.inputPdf)) {
            throw new Error(`PDF file not found: ${CONFIG.inputPdf}`);
        }
        
        console.log('✓ PDF file found:', CONFIG.inputPdf);
        
        // Generate embed codes
        console.log('✓ Generating embed codes...');
        const embedCodes = generateDirectEmbedCode(CONFIG.inputPdf);
        
        // Generate markdown documentation
        console.log('✓ Creating documentation...');
        const mdPath = generateMarkdownDoc(embedCodes, CONFIG.inputPdf);
        
        console.log('\n╔════════════════════════════════════════╗');
        console.log('║         GENERATION COMPLETE!           ║');
        console.log('╚════════════════════════════════════════╝\n');
        
        console.log('📄 Documentation saved to:', mdPath);
        console.log('\n📋 Quick Copy (Object Embed):\n');
        console.log('─'.repeat(50));
        console.log(embedCodes.objectEmbed);
        console.log('─'.repeat(50));
        
        console.log('\n💡 Next Steps:');
        console.log('  1. Open', mdPath);
        console.log('  2. Choose an embed method');
        console.log('  3. Copy and paste into DocMark');
        console.log('  4. For true SVG, use Inkscape or pdftocairo\n');
        
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error('\n💡 Tip: For true SVG conversion, install:');
        console.error('   - Inkscape: https://inkscape.org/');
        console.error('   - Poppler (pdftocairo): choco install poppler\n');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { generateDirectEmbedCode, generateMarkdownDoc };
