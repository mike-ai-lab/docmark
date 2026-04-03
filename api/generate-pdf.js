const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let browser;
  try {
    const { html, filename, margins, documentTitle, showDocumentTitle, showPageNumbers, pageNumberPosition } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content required' });
    }

    // Use provided margins or defaults
    let pdfMargins = margins || {
      top: '15mm',
      right: '15mm',
      bottom: '15mm',
      left: '15mm'
    };
    
    // CRITICAL: Puppeteer's displayHeaderFooter renders OUTSIDE the content area
    // We need to ADD extra space to top/bottom margins when headers/footers are enabled
    if (showDocumentTitle || showPageNumbers) {
      const HEADER_SPACE = 12; // mm - space needed for header (slightly increased)
      const FOOTER_SPACE = 12; // mm - space needed for footer (slightly increased)
      
      // Parse current margins (remove 'mm' and convert to number)
      const topMargin = parseFloat(pdfMargins.top);
      const bottomMargin = parseFloat(pdfMargins.bottom);
      
      // Add extra space for header/footer
      const adjustedTop = showDocumentTitle ? topMargin + HEADER_SPACE : topMargin;
      const adjustedBottom = showPageNumbers ? bottomMargin + FOOTER_SPACE : bottomMargin;
      
      pdfMargins = {
        ...pdfMargins,
        top: `${adjustedTop}mm`,
        bottom: `${adjustedBottom}mm`
      };
    }

    const executablePath = await chromium.executablePath();
    // Fix for Vercel missing shared libraries (e.g. libnss3.so)
    process.env.LD_LIBRARY_PATH = `${process.env.LD_LIBRARY_PATH || ''}:${require('path').dirname(executablePath)}`;

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Build header and footer templates
    const alignment = pageNumberPosition || 'center';
    
    const headerTemplate = showDocumentTitle ? 
      `<div style="font-size: 14px; color: #64748b; font-weight: 600; text-align: ${alignment}; width: 100%; padding: 8px 0;">${documentTitle || 'Document'}</div>` : 
      '<div></div>';
    
    const footerTemplate = showPageNumbers ? 
      `<div style="font-size: 12px; color: #94a3b8; font-weight: 500; text-align: ${alignment}; width: 100%; padding: 8px 0;"><span class="pageNumber"></span></div>` : 
      '<div></div>';

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: pdfMargins,
      displayHeaderFooter: showDocumentTitle || showPageNumbers,
      headerTemplate: headerTemplate,
      footerTemplate: footerTemplate
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: error.message, stack: error.stack || 'No stack trace available' });
  } finally {
    if (browser) await browser.close();
  }
};
