/**
 * Diagnose what's actually being exported
 * Intercepts the PDF generation to see the actual HTML/CSS
 */

const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001; // Different port to not conflict

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/generate-pdf', async (req, res) => {
    console.log('\n🔍 DIAGNOSTIC MODE - Capturing export data\n');
    
    try {
        const { html, filename = 'document.pdf', margins } = req.body;
        const pdfMargins = margins || { top: 20, right: 20, bottom: 20, left: 20 };
        
        console.log('📐 Margins:', pdfMargins);
        console.log('📝 HTML length:', html.length);
        
        // Save the HTML to file for inspection
        fs.writeFileSync('DIAGNOSTIC-export.html', html);
        console.log('✅ Saved HTML to: DIAGNOSTIC-export.html\n');
        
        // Check for width-related CSS in the HTML
        const widthMatches = html.match(/width:\s*\d+(?:px|mm|cm|in|%)/gi) || [];
        console.log('🔍 Found width declarations:', widthMatches.length);
        if (widthMatches.length > 0) {
            console.log('   Sample widths:', widthMatches.slice(0, 10));
        }
        
        // Check for specific problematic patterns
        const has210mm = html.includes('width: 210mm') || html.includes('width:210mm');
        const hasA4Width = html.includes('8.27in') || html.includes('794px');
        
        console.log('\n⚠️  Problematic patterns:');
        console.log('   - Contains "width: 210mm":', has210mm);
        console.log('   - Contains A4 width (8.27in/794px):', hasA4Width);
        
        // Now generate PDF with diagnostic CSS
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Correct A4 viewport
        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 1
        });
        
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Add diagnostic CSS that overrides everything
        const diagnosticCSS = `
            @page {
                size: A4 portrait;
                margin: ${pdfMargins.top}mm ${pdfMargins.right}mm ${pdfMargins.bottom}mm ${pdfMargins.left}mm;
            }
            
            @media print {
                /* Force reset all widths */
                html, body {
                    width: auto !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                }
                
                * {
                    box-sizing: border-box !important;
                }
                
                .paper-container,
                .markdown-body,
                #output,
                body > div {
                    width: auto !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
            }
        `;
        
        await page.addStyleTag({ content: diagnosticCSS });
        
        console.log('\n🎨 Generating diagnostic PDF...');
        
        const pdfBuffer = await page.pdf({
            path: 'DIAGNOSTIC-output.pdf',
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: false,
            margin: {
                top: `${pdfMargins.top}mm`,
                right: `${pdfMargins.right}mm`,
                bottom: `${pdfMargins.bottom}mm`,
                left: `${pdfMargins.left}mm`
            }
        });
        
        await browser.close();
        
        console.log('✅ Generated: DIAGNOSTIC-output.pdf');
        console.log('📤 Sending to client\n');
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log('\n🔍 DIAGNOSTIC PDF SERVER');
    console.log(`📍 Running at http://localhost:${PORT}`);
    console.log('📄 POST to /generate-pdf to diagnose\n');
    console.log('💡 Change your frontend to use port 3001 temporarily\n');
});
