const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pagination-pdf-export' });
});

// PDF generation endpoint
app.post('/generate-pdf', async (req, res) => {
  let browser = null;
  
  try {
    const { html, pageSize = 'A4', margins = {} } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    console.log('Starting PDF generation...');
    console.log('Page size:', pageSize);
    console.log('Margins:', margins);

    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Page size configurations
    const pageSizes = {
      A4: { width: '210mm', height: '297mm' },
      Letter: { width: '8.5in', height: '11in' },
      Legal: { width: '8.5in', height: '14in' }
    };

    const selectedSize = pageSizes[pageSize] || pageSizes.A4;

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: pageSize,
      width: selectedSize.width,
      height: selectedSize.height,
      margin: {
        top: `${margins.top || 25}mm`,
        right: `${margins.right || 25}mm`,
        bottom: `${margins.bottom || 25}mm`,
        left: `${margins.left || 25}mm`
      },
      printBackground: true,
      preferCSSPageSize: false
    });

    console.log('PDF generated successfully');

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="document-${Date.now()}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      message: error.message 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Pagination PDF Export Server running on http://localhost:${PORT}`);
  console.log(`📄 Open http://localhost:${PORT}/pagination-system-standalone.html\n`);
});
