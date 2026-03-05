/**
 * PDF Import Server Endpoint
 * Express route handler for PDF upload and processing
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const PDFImportPipeline = require('./pdf-import-pipeline');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Initialize pipeline
const pipeline = new PDFImportPipeline();

// Test endpoint to verify routing works
router.get('/pdf-import-test', (req, res) => {
  res.json({ status: 'ok', message: 'PDF import routes are working' });
});

/**
 * POST /api/pdf-import
 * Upload and process PDF file
 */
router.post('/pdf-import', upload.single('pdf'), async (req, res) => {
  console.log('📄 [PDF Import] Received upload request');
  console.log('   File:', req.file);
  
  if (!req.file) {
    console.error('❌ [PDF Import] No file in request');
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  const pdfPath = req.file.path;
  console.log('   PDF path:', pdfPath);
  
  const outputDir = path.join(__dirname, '../../uploads/pdf-imports', Date.now().toString());
  console.log('   Output dir:', outputDir);

  try {
    // Process PDF through pipeline
    const result = await pipeline.importPDF(pdfPath, { outputDir });

    // Clean up uploaded file
    await fs.unlink(pdfPath);

    // Return result
    res.json({
      markdown: result.markdown,
      images: result.images.map(img => ({
        id: img.id,
        filename: img.filename,
        url: `/uploads/pdf-imports/${path.basename(outputDir)}/images/${img.filename}`
      })),
      metadata: result.metadata
    });

  } catch (error) {
    console.error('PDF import error:', error);
    
    // Clean up on error
    try {
      await fs.unlink(pdfPath);
      await fs.rm(outputDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    res.status(500).json({ 
      error: 'PDF import failed', 
      message: error.message 
    });
  }
});

/**
 * POST /api/pdf-preview
 * Preview PDF without full import
 */
router.post('/pdf-preview', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  const pdfPath = req.file.path;

  try {
    const preview = await pipeline.previewImport(pdfPath);
    await fs.unlink(pdfPath);

    res.json(preview);

  } catch (error) {
    console.error('PDF preview error:', error);
    await fs.unlink(pdfPath);
    res.status(500).json({ error: 'PDF preview failed', message: error.message });
  }
});

/**
 * Cleanup on server shutdown
 */
process.on('SIGTERM', async () => {
  await pipeline.cleanup();
});

module.exports = router;
