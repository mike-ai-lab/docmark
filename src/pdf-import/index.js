/**
 * PDF Import Feature - Main Export
 * Provides unified access to all PDF import components
 */

// Server-side components (Node.js)
const PuppeteerPDFExtractor = require('./puppeteer-pdf-extractor');
const HTMLNormalizer = require('./html-normalizer');
const MarkdownConverter = require('./markdown-converter');
const PDFImportPipeline = require('./pdf-import-pipeline');

// Export all components
module.exports = {
  PuppeteerPDFExtractor,
  HTMLNormalizer,
  MarkdownConverter,
  PDFImportPipeline
};

// Browser-side UI component (imported separately in main.js)
// import PDFImportUI from './pdf-import-ui.js';
