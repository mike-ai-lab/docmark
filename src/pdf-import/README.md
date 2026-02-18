# PDF Import Feature

Production-ready PDF → Markdown conversion pipeline for DocMark.

## Architecture

```
PDF → Puppeteer (Chromium) → Raw HTML → HTML Normalizer → Semantic HTML → Markdown Converter → Clean Markdown
```

## Pipeline Components

### 1. Puppeteer PDF Extractor (`puppeteer-pdf-extractor.js`)
- Loads PDF directly in Chromium
- Extracts DOM structure, text, and images
- Preserves reading flow and layout
- Handles multi-page documents

### 2. HTML Normalizer (`html-normalizer.js`)
- Strips inline styles, transforms, absolute positioning
- Converts div/span soup → semantic HTML tags
- Detects and removes repeated headers/footers
- Linearizes multi-column layouts
- Merges fragmented text nodes

### 3. Markdown Converter (`markdown-converter.js`)
- Converts semantic HTML → Markdown
- Handles tables, images, headings, lists
- Validates heading hierarchy
- Normalizes blank lines
- Round-trip safe (Markdown → HTML → Markdown)

### 4. PDF Import Pipeline (`pdf-import-pipeline.js`)
- Orchestrates full conversion process
- Manages image extraction and storage
- Adds YAML front matter metadata
- Validates round-trip conversion
- Error handling and fallbacks

### 5. UI Integration (`pdf-import-ui.js`)
- File upload dialog
- Page-by-page preview
- Section selection
- Editor insertion
- Success/error notifications

### 6. Server Endpoint (`pdf-import-server.js`)
- Express route handler
- Multer file upload
- Pipeline execution
- Image serving

## Usage

### Backend (Node.js)

```javascript
const PDFImportPipeline = require('./src/pdf-import/pdf-import-pipeline');

const pipeline = new PDFImportPipeline();

// Full import
const result = await pipeline.importPDF('./document.pdf', {
  outputDir: './imports',
  pageRange: [1, 5] // Optional: import pages 1-5 only
});

console.log(result.markdown);
console.log(result.images);
console.log(result.metadata);

// Preview only
const preview = await pipeline.previewImport('./document.pdf');
console.log(preview.preview);

// Cleanup
await pipeline.cleanup();
```

### Frontend (Browser)

```javascript
// Initialize UI (in main.js)
import PDFImportUI from './pdf-import/pdf-import-ui.js';

const pdfImportUI = new PDFImportUI(editor);
```

The UI automatically adds:
- "📄 Import PDF" button to toolbar
- File upload dialog
- Preview modal with page selection
- Loading indicators
- Success/error notifications

## API Endpoints

### POST /api/pdf-import
Upload and process PDF file

**Request:**
- Content-Type: `multipart/form-data`
- Body: `pdf` file field

**Response:**
```json
{
  "markdown": "# Title\n\nContent...",
  "images": [
    {
      "id": "page1_img1",
      "filename": "page1_img1.png",
      "url": "/uploads/pdf-imports/123456/images/page1_img1.png"
    }
  ],
  "metadata": {
    "title": "Document Title",
    "source": "pdf-import",
    "pageCount": 5,
    "validation": {
      "valid": true,
      "similarity": 0.95
    }
  }
}
```

### POST /api/pdf-preview
Preview PDF without full import

**Request:**
- Content-Type: `multipart/form-data`
- Body: `pdf` file field

**Response:**
```json
{
  "preview": "# Title\n\nFirst 1000 characters...",
  "pageCount": 5,
  "imageCount": 3
}
```

## Features

✅ **Puppeteer-based extraction** - Preserves layout and structure  
✅ **Semantic HTML normalization** - Clean, editable output  
✅ **Image extraction** - Saved as files, not base64  
✅ **Table preservation** - Converts to Markdown tables  
✅ **Multi-page support** - Page-by-page selection  
✅ **Round-trip validation** - Ensures Markdown stability  
✅ **YAML front matter** - Metadata preservation  
✅ **Error handling** - Graceful fallbacks  
✅ **Dark mode support** - UI matches editor theme  

## Error Handling

The pipeline includes multiple fallback strategies:

1. **Primary**: Puppeteer → HTML → Markdown
2. **Fallback**: If HTML extraction fails, attempt raw text extraction
3. **Validation**: Round-trip conversion check (Markdown → HTML → Markdown)
4. **Warnings**: Low-confidence sections flagged for manual review

## Configuration

### Image Storage
Images are saved to: `uploads/pdf-imports/{timestamp}/images/`

### Output Directory
Default: `./pdf-imports`  
Configurable via `outputDir` option

### Page Range
Import specific pages: `pageRange: [start, end]`

### Section Selection
UI allows manual page selection before import

## Dependencies

- `puppeteer` - PDF rendering and extraction
- `jsdom` - HTML parsing and manipulation
- `marked` - Markdown validation
- `multer` - File upload handling
- `express` - Server endpoints

## Testing

```bash
# Test full pipeline
node test-pdf-import.js

# Test individual components
node test-html-normalizer.js
node test-markdown-converter.js
```

## Limitations

- Scanned PDFs require OCR (not yet implemented)
- Complex layouts may need manual adjustment
- Embedded fonts may not render perfectly
- Very large PDFs (>100 pages) may be slow

## Future Enhancements

- [ ] OCR support for scanned PDFs (Tesseract.js)
- [ ] Section-level import (not just pages)
- [ ] Confidence scoring for extracted content
- [ ] Batch import (multiple PDFs)
- [ ] Custom normalization rules
- [ ] Export settings preservation

## License

MIT
