# PDF Import Feature - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DocMark Application                          │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      Frontend (Browser)                         │ │
│  │                                                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │  Toolbar                                                  │  │ │
│  │  │  ┌──────────────────────────────────────────────────┐    │  │ │
│  │  │  │  📄 Import PDF Button                            │    │  │ │
│  │  │  │  (pdf-import-ui.js)                              │    │  │ │
│  │  │  └────────────────┬─────────────────────────────────┘    │  │ │
│  │  └─────────────────────┼──────────────────────────────────────┘  │ │
│  │                        │                                          │ │
│  │                        ▼                                          │ │
│  │  ┌─────────────────────────────────────────────────────────┐    │ │
│  │  │  File Upload Dialog                                      │    │ │
│  │  │  - Select PDF file                                       │    │ │
│  │  │  - Trigger upload to backend                             │    │ │
│  │  └────────────────┬────────────────────────────────────────┘    │ │
│  │                   │                                               │ │
│  │                   │ POST /api/pdf-import                          │ │
│  │                   │ (multipart/form-data)                         │ │
│  └───────────────────┼───────────────────────────────────────────────┘ │
│                      │                                                 │
│                      ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    Backend (Node.js)                             │ │
│  │                                                                   │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │  Express Server (pdf-server.js)                          │   │ │
│  │  │  - Receives PDF file via multer                          │   │ │
│  │  │  - Routes to PDF Import Pipeline                         │   │ │
│  │  └────────────────┬─────────────────────────────────────────┘   │ │
│  │                   │                                               │ │
│  │                   ▼                                               │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │  PDF Import Pipeline (pdf-import-pipeline.js)            │   │ │
│  │  │                                                            │   │ │
│  │  │  Step 1: Extract                                          │   │ │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │ │
│  │  │  │  Puppeteer PDF Extractor                           │  │   │ │
│  │  │  │  (puppeteer-pdf-extractor.js)                      │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  - Launch Chromium                                  │  │   │ │
│  │  │  │  - Load PDF: page.goto('file://...')               │  │   │ │
│  │  │  │  - Extract DOM structure                            │  │   │ │
│  │  │  │  - Extract images (canvas/img)                      │  │   │ │
│  │  │  │  - Preserve reading order                           │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  Output: { html, images, metadata, pages }         │  │   │ │
│  │  │  └────────────────┬───────────────────────────────────┘  │   │ │
│  │  │                   │                                        │   │ │
│  │  │                   ▼                                        │   │ │
│  │  │  Step 2: Normalize                                        │   │ │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │ │
│  │  │  │  HTML Normalizer (html-normalizer.js)             │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  - Strip inline styles, transforms, positioning    │  │   │ │
│  │  │  │  - Convert div/span soup → semantic tags           │  │   │ │
│  │  │  │  - Detect & remove headers/footers                 │  │   │ │
│  │  │  │  - Linearize multi-column layouts                  │  │   │ │
│  │  │  │  - Merge fragmented text nodes                     │  │   │ │
│  │  │  │  - Normalize whitespace                            │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  Output: Clean semantic HTML                       │  │   │ │
│  │  │  │  (<h1>, <p>, <ul>, <table>, <img>)                │  │   │ │
│  │  │  └────────────────┬───────────────────────────────────┘  │   │ │
│  │  │                   │                                        │   │ │
│  │  │                   ▼                                        │   │ │
│  │  │  Step 3: Convert                                          │   │ │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │ │
│  │  │  │  Markdown Converter (markdown-converter.js)       │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  - Parse semantic HTML with JSDOM                  │  │   │ │
│  │  │  │  - Convert headings → # ## ###                     │  │   │ │
│  │  │  │  - Convert paragraphs → text + blank lines         │  │   │ │
│  │  │  │  - Convert lists → - or 1.                         │  │   │ │
│  │  │  │  - Convert tables → | col | col |                  │  │   │ │
│  │  │  │  - Convert images → ![alt](filename)               │  │   │ │
│  │  │  │  - Fix heading hierarchy                           │  │   │ │
│  │  │  │  - Normalize blank lines                           │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  Output: Clean Markdown                            │  │   │ │
│  │  │  └────────────────┬───────────────────────────────────┘  │   │ │
│  │  │                   │                                        │   │ │
│  │  │                   ▼                                        │   │ │
│  │  │  Step 4: Validate                                         │   │ │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │ │
│  │  │  │  Round-trip Validation                            │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  - Convert Markdown → HTML (marked)                │  │   │ │
│  │  │  │  - Convert HTML → Markdown (converter)             │  │   │ │
│  │  │  │  - Calculate similarity score                      │  │   │ │
│  │  │  │  - Flag low-confidence sections                    │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  Output: { valid, similarity, warnings }          │  │   │ │
│  │  │  └────────────────┬───────────────────────────────────┘  │   │ │
│  │  │                   │                                        │   │ │
│  │  │                   ▼                                        │   │ │
│  │  │  Step 5: Package                                          │   │ │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │ │
│  │  │  │  Add YAML Front Matter                            │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  ---                                                │  │   │ │
│  │  │  │  title: Document Title                             │  │   │ │
│  │  │  │  source: pdf-import                                │  │   │ │
│  │  │  │  date: 2026-02-18                                  │  │   │ │
│  │  │  │  pages: 5                                          │  │   │ │
│  │  │  │  ---                                                │  │   │ │
│  │  │  │                                                      │  │   │ │
│  │  │  │  # Document Content...                             │  │   │ │
│  │  │  └────────────────┬───────────────────────────────────┘  │   │ │
│  │  └──────────────────────┼────────────────────────────────────┘   │ │
│  │                         │                                         │ │
│  │                         │ JSON Response                           │ │
│  │                         │ { markdown, images, metadata }          │ │
│  └─────────────────────────┼─────────────────────────────────────────┘ │
│                            │                                           │
│                            ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    Frontend (Browser)                            │ │
│  │                                                                   │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │  Preview Modal (pdf-import-ui.js)                        │   │ │
│  │  │                                                            │   │ │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │ │
│  │  │  │  Page Selection                                    │  │   │ │
│  │  │  │  ☑ Page 1  ☑ Page 2  ☑ Page 3                     │  │   │ │
│  │  │  └────────────────────────────────────────────────────┘  │   │ │
│  │  │                                                            │   │ │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │ │
│  │  │  │  Markdown Preview                                  │  │   │ │
│  │  │  │  # Title                                           │  │   │ │
│  │  │  │  Content preview...                                │  │   │ │
│  │  │  └────────────────────────────────────────────────────┘  │   │ │
│  │  │                                                            │   │ │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │ │
│  │  │  │  Stats                                             │  │   │ │
│  │  │  │  Pages: 5 | Images: 3 | Valid: ✅                 │  │   │ │
│  │  │  └────────────────────────────────────────────────────┘  │   │ │
│  │  │                                                            │   │ │
│  │  │  [Cancel]  [Insert into Editor]                           │   │ │
│  │  └────────────────┬───────────────────────────────────────────┘   │ │
│  │                   │                                               │ │
│  │                   ▼                                               │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │  Monaco Editor                                            │   │ │
│  │  │                                                            │   │ │
│  │  │  Markdown content inserted at cursor position             │   │ │
│  │  │  - Immediately editable                                   │   │ │
│  │  │  - No locked content                                      │   │ │
│  │  │  - Full control over text, images, tables                 │   │ │
│  │  └──────────────────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
PDF File (binary)
    │
    ▼
Puppeteer Chromium
    │
    ├─→ HTML Structure (DOM)
    ├─→ Images (canvas/img → PNG files)
    └─→ Metadata (title, page count)
    │
    ▼
HTML Normalizer
    │
    ├─→ Strip styles/positioning
    ├─→ Convert to semantic tags
    ├─→ Remove headers/footers
    └─→ Linearize layout
    │
    ▼
Semantic HTML
    │
    ├─→ <h1>, <h2>, <h3>
    ├─→ <p>
    ├─→ <ul>, <ol>, <li>
    ├─→ <table>, <tr>, <td>
    └─→ <img>
    │
    ▼
Markdown Converter
    │
    ├─→ # ## ### (headings)
    ├─→ Paragraphs + blank lines
    ├─→ - or 1. (lists)
    ├─→ | col | col | (tables)
    └─→ ![alt](file) (images)
    │
    ▼
Clean Markdown
    │
    ├─→ YAML front matter
    ├─→ Round-trip validated
    ├─→ Images as file references
    └─→ Immediately editable
    │
    ▼
Monaco Editor (User can edit)
```

## Component Dependencies

```
pdf-import-ui.js (Frontend)
    │
    ├─→ Depends on: Monaco Editor
    ├─→ Calls: POST /api/pdf-import
    └─→ Renders: Preview modal, file dialog

pdf-import-server.js (Backend)
    │
    ├─→ Depends on: Express, Multer
    ├─→ Uses: PDFImportPipeline
    └─→ Returns: JSON response

pdf-import-pipeline.js (Backend)
    │
    ├─→ Uses: PuppeteerPDFExtractor
    ├─→ Uses: HTMLNormalizer
    ├─→ Uses: MarkdownConverter
    └─→ Returns: { markdown, images, metadata }

puppeteer-pdf-extractor.js (Backend)
    │
    ├─→ Depends on: Puppeteer
    └─→ Returns: { html, images, metadata, pages }

html-normalizer.js (Backend)
    │
    ├─→ Depends on: JSDOM
    └─→ Returns: Semantic HTML string

markdown-converter.js (Backend)
    │
    ├─→ Depends on: JSDOM
    └─→ Returns: Markdown string
```

## File System Structure

```
uploads/
└── pdf-imports/
    └── {timestamp}/
        └── images/
            ├── page1_img1.png
            ├── page1_img2.png
            └── page2_img1.png

src/
└── pdf-import/
    ├── puppeteer-pdf-extractor.js
    ├── html-normalizer.js
    ├── markdown-converter.js
    ├── pdf-import-pipeline.js
    ├── pdf-import-server.js
    ├── pdf-import-ui.js
    ├── pdf-import.css
    ├── index.js
    └── README.md
```

## API Flow

```
Client                          Server
  │                               │
  │  POST /api/pdf-import         │
  │  (multipart/form-data)        │
  ├──────────────────────────────>│
  │                               │
  │                               │ Process PDF
  │                               │ (Pipeline)
  │                               │
  │  JSON Response                │
  │  { markdown, images, ... }    │
  │<──────────────────────────────┤
  │                               │
  │  GET /uploads/.../img.png     │
  ├──────────────────────────────>│
  │                               │
  │  PNG Image                    │
  │<──────────────────────────────┤
  │                               │
```

## Error Handling Flow

```
PDF Upload
    │
    ├─→ File too large? → Error: "File size exceeds 50MB"
    ├─→ Not a PDF? → Error: "Invalid file type"
    ├─→ Corrupted? → Error: "Failed to load PDF"
    │
    ▼
Puppeteer Extraction
    │
    ├─→ Chromium fails? → Retry once
    ├─→ Still fails? → Error: "PDF extraction failed"
    │
    ▼
HTML Normalization
    │
    ├─→ Empty HTML? → Warning: "No content extracted"
    ├─→ Malformed? → Attempt to fix
    │
    ▼
Markdown Conversion
    │
    ├─→ Conversion fails? → Fallback to raw text
    ├─→ Low similarity? → Warning: "Manual review needed"
    │
    ▼
Success or Error Response
```

## Performance Characteristics

```
PDF Size        Processing Time    Memory Usage
─────────────────────────────────────────────────
< 1 MB          1-2 seconds        ~100 MB
1-5 MB          2-5 seconds        ~200 MB
5-10 MB         5-10 seconds       ~300 MB
10-50 MB        10-30 seconds      ~500 MB
> 50 MB         Rejected           N/A

Page Count      Processing Time
─────────────────────────────────
1-10 pages      1-5 seconds
10-50 pages     5-15 seconds
50-100 pages    15-30 seconds
> 100 pages     30+ seconds (slow)
```

## Security Considerations

```
Input Validation
    │
    ├─→ File type check (PDF only)
    ├─→ File size limit (50MB)
    ├─→ Sanitize filenames
    └─→ Validate upload directory

HTML Sanitization
    │
    ├─→ Strip dangerous tags (<script>, <iframe>)
    ├─→ Remove event handlers (onclick, etc.)
    └─→ Validate URLs in images/links

File Storage
    │
    ├─→ Unique directory per upload (timestamp)
    ├─→ Serve via static middleware (no direct access)
    └─→ Clean up old uploads (optional)
```

---

**Architecture designed for production use with Puppeteer-only pipeline.**
