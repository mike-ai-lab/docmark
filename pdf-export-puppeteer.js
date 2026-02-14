/**
 * PDF Export using Puppeteer
 * 
 * This uses Chrome's headless browser to render HTML with full CSS support
 * and generate PDFs with perfect layout and selectable text.
 * 
 * Installation:
 * npm install puppeteer
 * 
 * Usage:
 * node pdf-export-puppeteer.js <input.html> <output.pdf>
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF(inputHtmlPath, outputPdfPath) {
    console.log('🚀 Starting Puppeteer PDF generation...');
    console.log(`📄 Input: ${inputHtmlPath}`);
    console.log(`📦 Output: ${outputPdfPath}`);
    
    // Check if input file exists
    if (!fs.existsSync(inputHtmlPath)) {
        throw new Error(`Input file not found: ${inputHtmlPath}`);
    }
    
    // Read HTML content
    const htmlContent = fs.readFileSync(inputHtmlPath, 'utf-8');
    console.log('✅ HTML file read successfully');
    
    // Launch browser
    console.log('🌐 Launching Chrome headless browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    console.log('✅ Browser launched');
    
    // Set viewport for consistent rendering
    await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2 // High DPI
    });
    
    // Load HTML content
    console.log('📝 Loading HTML content...');
    await page.setContent(htmlContent, {
        waitUntil: 'networkidle0' // Wait for all resources to load
    });
    console.log('✅ HTML loaded');
    
    // Inject proper print CSS with @page rules
    console.log('📐 Adding print CSS with @page rules...');
    await page.addStyleTag({
        content: `
            @page {
                size: A4 portrait;
                margin: 20mm;
            }
            
            @media print {
                html, body {
                    width: 100% !important;
                    height: 100% !important;
                    background: white !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                .paper-container {
                    max-width: 100% !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                    border: none !important;
                    break-after: page;
                    break-inside: avoid;
                }
                
                .paper-container:last-child {
                    break-after: auto;
                }
                
                .markdown-body {
                    max-width: 100% !important;
                    padding: 0 !important;
                }
                
                /* Avoid breaking inside these elements */
                h1, h2, h3, h4, h5, h6 {
                    break-after: avoid;
                }
                
                p, ul, ol {
                    break-inside: avoid;
                }
            }
        `
    });
    
    // Generate PDF with proper A4 settings
    console.log('🎨 Rendering PDF...');
    await page.pdf({
        path: outputPdfPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,  // Force A4, don't use CSS page size
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        },
        displayHeaderFooter: false
    });
    
    console.log('✅ PDF generated successfully');
    
    // Close browser
    await browser.close();
    console.log('🎉 Done!');
    
    // Show file size
    const stats = fs.statSync(outputPdfPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 File size: ${fileSizeKB} KB`);
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.error('Usage: node pdf-export-puppeteer.js <input.html> <output.pdf>');
        process.exit(1);
    }
    
    const inputPath = path.resolve(args[0]);
    const outputPath = path.resolve(args[1]);
    
    generatePDF(inputPath, outputPath)
        .then(() => {
            console.log('\n✅ SUCCESS: PDF exported with perfect layout and selectable text!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ ERROR:', error.message);
            process.exit(1);
        });
}

module.exports = { generatePDF };
