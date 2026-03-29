# Pagination System with PDF Export

A standalone document pagination system with intelligent content flow and Puppeteer-based PDF export.

## Features

- **Intelligent Pagination**: Automatic content flow across multiple pages
- **Resizable Panels**: Drag the divider between editor and preview
- **Real-time Preview**: See changes as you type (with debouncing)
- **PDF Export**: Server-side PDF generation using Puppeteer
- **Configurable Settings**:
  - Page sizes: A4, Letter, Legal
  - Custom margins (top, right, bottom, left)
  - Zoom control for preview
- **Smart Content Handling**:
  - Paragraph splitting at word boundaries
  - List splitting across pages
  - Keep-with-next for headings
  - No-break rules for images, tables, code blocks

## Quick Start

### 1. Start the Server

**Windows (PowerShell):**
```powershell
.\start-pagination-export.ps1
```

**Windows (CMD):**
```cmd
start-pagination-export.bat
```

**Or manually:**
```bash
node pagination-pdf-export-server.js
```

### 2. Open in Browser

Navigate to: http://localhost:3001/pagination-system-standalone.html

### 3. Use the Application

1. **Edit Content**: Type or paste markdown-like content in the left panel
2. **Adjust Settings**: Click "Settings" to change page size, margins, or zoom
3. **Resize Panels**: Drag the vertical divider between editor and preview
4. **Export PDF**: Click "Export PDF" to generate and download a PDF file

## Architecture

### Files

- `pagination-system-standalone.html` - Main application (works standalone in browser)
- `pagination-pdf-export-server.js` - Express server with Puppeteer for PDF generation
- `start-pagination-export.ps1` - PowerShell startup script
- `start-pagination-export.bat` - Batch startup script

### Components

1. **PageManager**: Handles page dimensions and margin calculations
2. **ContentFlowEngine**: Manages content distribution across pages
3. **PDF Export Server**: Puppeteer-based server-side PDF generation

### API Endpoints

- `GET /health` - Health check
- `POST /generate-pdf` - Generate PDF from HTML
  - Body: `{ html: string, pageSize: string, margins: object }`
  - Returns: PDF file as binary stream

## Content Format

The editor supports markdown-like syntax:

```markdown
# Heading 1
## Heading 2
### Heading 3

Regular paragraph text.

- Unordered list item
- Another item

1. Ordered list item
2. Another item
```

## Configuration

### Page Sizes

- **A4**: 210 × 297 mm
- **Letter**: 8.5 × 11 inches (215.9 × 279.4 mm)
- **Legal**: 8.5 × 14 inches (215.9 × 355.6 mm)

### Margins

- Adjustable from 0-50mm for each side
- Default: 25mm all sides

### DPI

- Fixed at 96 DPI for consistent rendering

## Technical Details

### Content Flow Algorithm

1. Parse content into DOM elements
2. Measure each element's height
3. Distribute elements across pages based on available space
4. Apply break rules (no-break, keep-with-next)
5. Split breakable elements (paragraphs, lists) when needed
6. Use binary search for optimal paragraph split points

### PDF Generation

1. Clone the preview container
2. Remove zoom transforms
3. Wrap in complete HTML document with styles
4. Send to Puppeteer server
5. Generate PDF with specified page size and margins
6. Download to user's browser

## Browser Requirements

- Modern browser with ES6+ support
- Fetch API for PDF export
- CSS Grid and Flexbox support

## Server Requirements

- Node.js 14+
- Dependencies:
  - express
  - puppeteer
  - cors

## Troubleshooting

### PDF Export Fails

- Ensure server is running on port 3001
- Check browser console for errors
- Verify Puppeteer is installed: `npm install puppeteer`

### Content Not Flowing Properly

- Check browser console for JavaScript errors
- Ensure content is in supported format
- Try refreshing the page

### Server Won't Start

- Check if port 3001 is already in use
- Run `npm install` to ensure dependencies are installed
- Check Node.js version: `node --version`

## Future Enhancements

- [ ] Headers and footers
- [ ] Page numbers
- [ ] Table of contents generation
- [ ] Image support
- [ ] Code block syntax highlighting
- [ ] Custom CSS themes
- [ ] Save/load documents
- [ ] Collaborative editing

## License

Part of the DocMark project.
