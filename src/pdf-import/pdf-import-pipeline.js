/**
 * PDF Import Pipeline
 * Orchestrates: PDF → Puppeteer → HTML → Normalizer → Markdown
 */

const PDFJSExtractor = require('./pdfjs-extractor');
const HTMLNormalizer = require('./html-normalizer');
const MarkdownConverter = require('./markdown-converter');
const path = require('path');
const fs = require('fs').promises;
const puppeteer = require('puppeteer');

class PDFImportPipeline {
  constructor() {
    this.extractor = new PDFJSExtractor();
    this.normalizer = new HTMLNormalizer();
    this.converter = new MarkdownConverter();
    this.browser = null;
  }

  /**
   * Full pipeline: PDF → Markdown
   * @param {string} pdfPath - Path to PDF file
   * @param {Object} options - Import options
   * @returns {Promise<{markdown: string, images: Array, metadata: Object}>}
   */
  async importPDF(pdfPath, options = {}) {
    const {
      outputDir = './pdf-imports',
      pageRange = null, // [start, end] or null for all
      sectionSelection = null // Array of section indices or null
    } = options;

    try {
      // Step 1: Extract text and structure from PDF using PDF.js
      console.log('Step 1: Extracting PDF content with PDF.js...');
      const extracted = await this.extractor.extractFromPDF(pdfPath);
      
      console.log('✅ Extracted', extracted.pages.length, 'pages');
      console.log('✅ Document:', extracted.metadata.title);
      
      // Step 2: Filter pages if range specified
      let pagesToProcess = extracted.pages;
      if (pageRange) {
        const [start, end] = pageRange;
        pagesToProcess = extracted.pages.slice(start - 1, end);
      }

      // Step 3: Take screenshot with Puppeteer for images
      console.log('Step 2: Taking screenshot with Puppeteer...');
      const screenshot = await this._takeScreenshot(pdfPath);
      
      const imageDir = path.join(outputDir, 'images');
      await fs.mkdir(imageDir, { recursive: true });
      
      const screenshotPath = path.join(imageDir, 'pdf_screenshot.png');
      await fs.writeFile(screenshotPath, screenshot, 'base64');
      
      const savedImages = [{
        id: 'pdf_screenshot',
        filename: 'pdf_screenshot.png',
        path: screenshotPath,
        width: 800,
        height: 1000
      }];

      // Step 4: Build HTML from extracted structure
      console.log('Step 3: Building HTML from structure...');
      const rawHTML = this.extractor.buildHTML(pagesToProcess);

      // Step 5: Normalize HTML
      console.log('Step 4: Normalizing HTML...');
      const normalizedHTML = this.normalizer.normalize(rawHTML);

      // Step 6: Convert to Markdown
      console.log('Step 5: Converting to Markdown...');
      const markdown = this.converter.convert(normalizedHTML, savedImages);

      // Step 7: Add metadata
      const finalMarkdown = this._addMetadata(markdown, extracted.metadata);

      // Step 8: Validate round-trip
      console.log('Step 6: Validating conversion...');
      const validation = await this._validateRoundTrip(finalMarkdown);

      return {
        markdown: finalMarkdown,
        images: savedImages,
        metadata: {
          ...extracted.metadata,
          validation: validation,
          importDate: new Date().toISOString()
        },
        rawHTML: normalizedHTML // For debugging
      };

    } catch (error) {
      console.error('PDF import failed:', error);
      throw new Error(`PDF import pipeline failed: ${error.message}`);
    }
  }

  /**
   * Take screenshot of PDF using Puppeteer
   */
  async _takeScreenshot(pdfPath) {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await this.browser.newPage();
    
    try {
      const pdfUrl = `file://${path.resolve(pdfPath).replace(/\\/g, '/')}`;
      await page.goto(pdfUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const screenshot = await page.screenshot({ 
        fullPage: true, 
        encoding: 'base64' 
      });

      await page.close();
      return screenshot;

    } catch (error) {
      await page.close();
      throw error;
    }
  }

  /**
   * Import specific pages only
   */
  async importPages(pdfPath, pageNumbers, outputDir) {
    return this.importPDF(pdfPath, {
      outputDir,
      pageRange: [Math.min(...pageNumbers), Math.max(...pageNumbers)]
    });
  }

  /**
   * Preview import without saving
   */
  async previewImport(pdfPath) {
    const tempDir = './temp-preview';
    const result = await this.importPDF(pdfPath, { outputDir: tempDir });
    
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
    
    return {
      preview: result.markdown.substring(0, 1000) + '...',
      pageCount: result.metadata.pageCount,
      imageCount: result.images.length
    };
  }

  /**
   * Add YAML front matter metadata
   */
  _addMetadata(markdown, metadata) {
    // Remove any existing front matter first
    markdown = markdown.replace(/^---\n[\s\S]*?\n---\n\n/m, '');
    
    const frontMatter = `---
title: ${metadata.title || 'Imported Document'}
source: pdf-import
date: ${new Date().toISOString().split('T')[0]}
pages: ${metadata.pageCount || 'unknown'}
---

`;
    return frontMatter + markdown;
  }

  /**
   * Validate Markdown round-trip (Markdown → HTML → Markdown)
   */
  async _validateRoundTrip(markdown) {
    try {
      // Use marked to convert Markdown → HTML
      const marked = require('marked');
      const html = marked.parse(markdown);
      
      // Convert back to Markdown
      const reconverted = this.converter.convert(html);
      
      // Compare structure (not exact match, but similar)
      const originalLines = markdown.split('\n').filter(l => l.trim());
      const reconvertedLines = reconverted.split('\n').filter(l => l.trim());
      
      const similarity = this._calculateSimilarity(originalLines, reconvertedLines);
      
      return {
        valid: similarity > 0.8,
        similarity: similarity,
        warnings: similarity < 0.9 ? ['Some formatting may have changed'] : []
      };
    } catch (error) {
      return {
        valid: false,
        similarity: 0,
        warnings: ['Round-trip validation failed']
      };
    }
  }

  _calculateSimilarity(arr1, arr2) {
    const maxLength = Math.max(arr1.length, arr2.length);
    if (maxLength === 0) return 1;
    
    let matches = 0;
    const minLength = Math.min(arr1.length, arr2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (arr1[i] === arr2[i]) matches++;
    }
    
    return matches / maxLength;
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = PDFImportPipeline;
