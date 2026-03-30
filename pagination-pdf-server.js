const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = 3002; // Different port to avoid conflicts with main app (3000) and other services (3001)

// Enable CORS for all origins
app.use(cors());

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));

// Serve ONLY specific test files (not the entire directory)
app.get('/pagination-test-merged.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pagination-test-merged.html'));
});

app.get('/PAG-TEST2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'PAG-TEST2.html'));
});

app.get('/pagination-test.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pagination-test.html'));
});

app.get('/manual-page-editor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'manual-page-editor.html'));
});

// Root redirects to manual page editor
app.get('/', (req, res) => {
    res.redirect('/manual-page-editor.html');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Pagination PDF server is running' });
});

// PDF generation endpoint
app.post('/generate-pdf', async (req, res) => {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📄 [Pagination PDF Server] Received PDF generation request');
    console.log('═══════════════════════════════════════════════════════');
    
    const { html, filename, margins, pageFormat } = req.body;
    
    if (!html) {
        console.error('❌ [Pagination PDF Server] No HTML provided');
        return res.status(400).json({ error: 'No HTML content provided' });
    }
    
    // Use provided margins or defaults
    const pdfMargins = margins || {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
    };
    
    const format = pageFormat || 'A4';
    
    console.log('📊 [Pagination PDF Server] Configuration:');
    console.log('  - Filename:', filename);
    console.log('  - Page format:', format);
    console.log('  - PDF engine margins:', JSON.stringify(pdfMargins));
    console.log('  - HTML length:', html.length, 'characters');
    
    // Count pages in HTML
    const pageMatches = html.match(/class="pdf-page"/g);
    const pageCount = pageMatches ? pageMatches.length : 0;
    console.log('  - Pages detected in HTML:', pageCount);
    
    let browser;
    try {
        console.log('\n🚀 [Pagination PDF Server] Launching browser...');
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--font-render-hinting=none'
            ]
        });
        console.log('✅ [Pagination PDF Server] Browser launched');
        
        const page = await browser.newPage();
        console.log('✅ [Pagination PDF Server] New page created');
        
        console.log('\n📝 [Pagination PDF Server] Setting content...');
        
        // Set content and wait for everything to load
        await page.setContent(html, {
            waitUntil: ['networkidle0', 'load', 'domcontentloaded']
        });
        console.log('✅ [Pagination PDF Server] Content loaded');
        
        // Wait for fonts to be fully loaded
        console.log('\n⏳ [Pagination PDF Server] Waiting for fonts to load...');
        await page.evaluateHandle('document.fonts.ready');
        console.log('✅ [Pagination PDF Server] Fonts loaded');
        
        // Additional wait to ensure fonts are rendered
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ [Pagination PDF Server] Additional rendering delay complete');
        
        // Verify page structure
        const pageInfo = await page.evaluate(() => {
            const pages = document.querySelectorAll('.pdf-page');
            const pageData = [];
            
            pages.forEach((page, idx) => {
                const wrapper = page.querySelector('.page-content-wrapper');
                const footer = page.querySelector('.page-footer');
                
                pageData.push({
                    index: idx + 1,
                    hasWrapper: !!wrapper,
                    hasFooter: !!footer,
                    wrapperHeight: wrapper ? wrapper.offsetHeight : 0,
                    pageHeight: page.offsetHeight,
                    elementCount: wrapper ? wrapper.children.length : 0
                });
            });
            
            return {
                totalPages: pages.length,
                bodyHeight: document.body.offsetHeight,
                bodyWidth: document.body.offsetWidth,
                pages: pageData
            };
        });
        
        console.log('\n📊 [Pagination PDF Server] Page structure verification:');
        console.log('  - Total pages in DOM:', pageInfo.totalPages);
        console.log('  - Body dimensions:', pageInfo.bodyWidth + 'px × ' + pageInfo.bodyHeight + 'px');
        pageInfo.pages.forEach(p => {
            console.log(`  - Page ${p.index}:`);
            console.log(`      Elements: ${p.elementCount}`);
            console.log(`      Wrapper height: ${p.wrapperHeight}px`);
            console.log(`      Page height: ${p.pageHeight}px`);
            console.log(`      Has footer: ${p.hasFooter ? '✅' : '❌'}`);
        });
        
        console.log('\n🖨️  [Pagination PDF Server] Generating PDF...');
        const pdfBuffer = await page.pdf({
            format: format,
            printBackground: true,
            preferCSSPageSize: false,
            margin: pdfMargins
        });
        
        console.log('✅ [Pagination PDF Server] PDF generated successfully');
        console.log('  - Buffer size:', pdfBuffer.length, 'bytes (', (pdfBuffer.length / 1024).toFixed(2), 'KB )');
        
        // Send PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename || 'document.pdf'}"`);
        res.send(pdfBuffer);
        
        console.log('✅ [Pagination PDF Server] PDF sent to client');
        console.log('═══════════════════════════════════════════════════════');
        console.log('🎉 PDF GENERATION COMPLETE');
        console.log('═══════════════════════════════════════════════════════\n');
        
    } catch (error) {
        console.error('\n❌ [Pagination PDF Server] Error generating PDF:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to generate PDF', 
            message: error.message 
        });
    } finally {
        if (browser) {
            await browser.close();
            console.log('🔒 [Pagination PDF Server] Browser closed\n');
        }
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Pagination PDF Server running on http://localhost:${PORT}`);
    console.log(`📄 Ready to generate PDFs via POST /generate-pdf`);
    console.log(`🌐 Open http://localhost:${PORT}/pagination-test-merged.html to test`);
});
