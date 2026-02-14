/**
 * PDF Export Server using Puppeteer
 * 
 * A simple Express server that accepts HTML and returns PDF
 * 
 * Installation:
 * npm install express puppeteer cors
 * 
 * Usage:
 * node pdf-server.js
 * 
 * Then from your frontend:
 * POST http://localhost:3000/generate-pdf
 * Body: { html: "<html>...</html>", filename: "document.pdf" }
 */

const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies (large HTML)

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'PDF server is running' });
});

// PDF generation endpoint
app.post('/generate-pdf', async (req, res) => {
    console.log('\n📥 Received PDF generation request');
    
    try {
        const { html, filename = 'document.pdf', margins } = req.body;
        
        if (!html) {
            return res.status(400).json({ error: 'HTML content is required' });
        }
        
        // Default margins: 20mm on all sides
        const pdfMargins = margins || { top: 20, right: 20, bottom: 20, left: 20 };
        
        console.log('📝 HTML length:', html.length, 'characters');
        console.log('📐 Margins:', `${pdfMargins.top}/${pdfMargins.right}/${pdfMargins.bottom}/${pdfMargins.left}mm`);
        console.log('🚀 Launching Puppeteer...');
        
        // Launch browser
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });
        
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({
            width: 1200,
            height: 1600,
            deviceScaleFactor: 2
        });
        
        console.log('📄 Loading HTML...');
        
        // Inject proper print CSS with @page rules using custom margins
        const printCSS = `
            @page {
                size: A4 portrait;
                margin: ${pdfMargins.top}mm ${pdfMargins.right}mm ${pdfMargins.bottom}mm ${pdfMargins.left}mm;
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
        `;
        
        // Load HTML
        await page.setContent(html, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Add print CSS
        await page.addStyleTag({ content: printCSS });
        
        console.log('🎨 Generating PDF...');
        
        // Generate PDF with proper A4 settings
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: false,  // Force A4, don't use CSS page size
            margin: {
                top: `${pdfMargins.top}mm`,
                right: `${pdfMargins.right}mm`,
                bottom: `${pdfMargins.bottom}mm`,
                left: `${pdfMargins.left}mm`
            }
        });
        
        await browser.close();
        
        console.log('✅ PDF generated:', pdfBuffer.length, 'bytes');
        
        // Send PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
        
        console.log('📤 PDF sent to client');
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        res.status(500).json({ 
            error: 'Failed to generate PDF',
            message: error.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 PDF Export Server Started');
    console.log(`📍 Server running at http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`📄 Generate PDF: POST http://localhost:${PORT}/generate-pdf`);
    console.log('\n✨ Ready to generate PDFs with perfect layout!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down server...');
    process.exit(0);
});
