/**
 * PDF → HTML Extractor using Puppeteer
 * Loads PDF in Chromium, extracts DOM + images
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class PuppeteerPDFExtractor {
  constructor() {
    this.browser = null;
  }

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Extract HTML from PDF file
   * @param {string} pdfPath - Path to PDF file
   * @returns {Promise<{html: string, images: Array, metadata: Object}>}
   */
  async extractFromPDF(pdfPath) {
    await this.init();

    const page = await this.browser.newPage();
    
    try {
      // Load PDF directly in Chromium
      const pdfUrl = `file://${path.resolve(pdfPath).replace(/\\/g, '/')}`;
      console.log('📄 Loading PDF:', pdfUrl);
      
      await page.goto(pdfUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for PDF to render
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Use CDP to extract PDF text properly
      // Chromium's PDF viewer doesn't expose text via DOM
      // We need to use the Print.getPrintInfo command
      const client = await page.target().createCDPSession();
      
      // Enable the Page domain
      await client.send('Page.enable');
      
      // Try to get text by printing to PDF and extracting
      // This is a workaround since Chromium PDF viewer doesn't expose text
      console.log('📝 Attempting text extraction via print...');
      
      // Get the page as text by using print preview
      const printText = await page.evaluate(() => {
        // Create a temporary div to hold extracted content
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        
        // Try to copy all text
        document.execCommand('selectAll');
        const text = window.getSelection().toString();
        window.getSelection().removeAllRanges();
        
        document.body.removeChild(tempDiv);
        return text;
      });

      console.log('📝 Extracted text length:', printText.length);
      console.log('📝 First 500 chars:', printText.substring(0, 500));

      let html = '';
      
      if (printText && printText.trim().length > 10) {
        // We got text! Build HTML from it
        html = this._buildHTMLFromText({ rawText: printText });
        console.log('✅ Built HTML from extracted text');
      } else {
        // Last resort: Use OCR or warn user
        console.log('❌ No text could be extracted - PDF may be scanned or protected');
        html = '<div class="pdf-document"><p><strong>Note:</strong> This PDF appears to be scanned or text-protected. Text extraction is not possible. Please use the screenshot below as reference.</p></div>';
      }

      // Take screenshot for images
      const screenshot = await page.screenshot({ fullPage: true, encoding: 'base64' });
      
      // Extract images from screenshot
      const images = [{
        id: 'pdf_screenshot',
        type: 'screenshot',
        dataUrl: `data:image/png;base64,${screenshot}`,
        width: 800,
        height: 1000
      }];

      // Extract metadata
      const metadata = {
        title: path.basename(pdfPath, '.pdf'),
        pageCount: 1,
        source: 'pdf-import'
      };

      await page.close();

      return {
        html: html,
        images: images,
        metadata: metadata,
        rawText: textContent
      };

    } catch (error) {
      await page.close();
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from accessibility tree
   */
  _extractTextFromAXTree(nodes) {
    const textNodes = [];
    
    for (const node of nodes) {
      if (node.role && node.role.value === 'StaticText' && node.name && node.name.value) {
        textNodes.push({
          text: node.name.value,
          role: node.role.value
        });
      }
      // Also check for text in other roles
      if (node.name && node.name.value && node.name.value.trim().length > 0) {
        if (['paragraph', 'heading', 'text'].includes(node.role?.value?.toLowerCase())) {
          textNodes.push({
            text: node.name.value,
            role: node.role?.value || 'text'
          });
        }
      }
    }
    
    return textNodes;
  }

  /**
   * Build HTML from text nodes
   */
  _buildHTMLFromTextNodes(textNodes) {
    let html = '<div class="pdf-document">\n';
    
    textNodes.forEach(node => {
      const text = node.text.trim();
      if (text.length === 0) return;
      
      // Detect headings by length and capitalization
      const isAllCaps = text === text.toUpperCase() && text.length < 100;
      const isShort = text.length < 80;
      
      if (isAllCaps || (isShort && node.role === 'heading')) {
        html += `<h2>${text}</h2>\n`;
      } else {
        html += `<p>${text}</p>\n`;
      }
    });
    
    html += '</div>';
    return html;
  }

  /**
   * Build HTML from extracted text
   */
  _buildHTMLFromText(data) {
    let html = '<div class="pdf-document">\n';
    
    const text = data.rawText || '';
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Detect headings
      const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed.length < 100;
      const isShort = trimmed.length < 80;
      const hasNoEndPunctuation = !/[.!?]$/.test(trimmed);
      
      if (isAllCaps || (isShort && hasNoEndPunctuation)) {
        html += `<h2>${trimmed}</h2>\n`;
      } else {
        html += `<p>${trimmed}</p>\n`;
      }
    });
    
    html += '</div>';
    return html;
  }

  /**
   * Save extracted images to disk
   * @param {Array} images - Array of image objects
   * @param {string} outputDir - Directory to save images
   */
  async saveImages(images, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    
    const savedImages = [];
    
    for (const img of images) {
      if (img.dataUrl) {
        // Extract base64 data
        const base64Data = img.dataUrl.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        const filename = `${img.id}.png`;
        const filepath = path.join(outputDir, filename);
        
        await fs.writeFile(filepath, buffer);
        
        savedImages.push({
          id: img.id,
          filename: filename,
          path: filepath,
          width: img.width,
          height: img.height
        });
      }
    }
    
    return savedImages;
  }
}

module.exports = PuppeteerPDFExtractor;
