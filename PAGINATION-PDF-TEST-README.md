# Pagination Test with PDF Export

This is a standalone tool for testing pagination and PDF export functionality with proper margin handling.

## Features

- ✅ Real-time pagination preview
- ✅ Configurable margins (top, bottom, left, right)
- ✅ A4 and US Letter page formats
- ✅ Markdown rendering with syntax highlighting
- ✅ PDF export with Puppeteer
- ✅ Margin guides visualization
- ✅ Plain text mode (disable markdown parsing)

## Setup

### 1. Install Dependencies

First, install the required Node.js packages:

```bash
npm install express cors puppeteer
```

Or if you have the package.json file:

```bash
npm install --package-lock-only
npm install
```

### 2. Start the PDF Server

The PDF export feature requires a local server running Puppeteer:

```bash
node pagination-pdf-server.js
```

You should see:
```
✅ Pagination PDF Server running on http://localhost:3001
📄 Ready to generate PDFs via POST /generate-pdf
🌐 Open http://localhost:3001/pagination-test-merged.html to test
```

### 3. Open the Test Page

Open your browser and navigate to:
```
http://localhost:3001/pagination-test-merged.html
```

## Usage

### Editing Content

1. Type or paste your markdown content in the left sidebar editor
2. The preview updates automatically as you type
3. Use the "Sync Document" button to force a refresh

### Configuring Layout

- **Page Format**: Choose between A4 (210 x 297 mm) or US Letter (8.5 x 11 in)
- **Margins**: Set top, bottom, left, and right margins in millimeters
- **Show Margin Guides**: Toggle red dashed lines showing margin boundaries
- **Enable Markdown Parsing**: Toggle between markdown rendering and plain text

### Exporting to PDF

1. Make sure the PDF server is running (see Setup step 2)
2. Click the "Export to PDF" button
3. The PDF will be generated with:
   - Exact page dimensions (A4 or Letter)
   - Your configured margins applied correctly
   - All content paginated as shown in preview
   - Page numbers on each page
4. Check your Downloads folder for the PDF file

## How It Works

### Pagination Engine

The tool uses a smart pagination algorithm that:

1. **Measures content height** - Each element is measured in a hidden probe
2. **Splits large elements** - Lists, paragraphs, and code blocks are split across pages
3. **Preserves list numbering** - Ordered lists continue numbering across pages
4. **Respects margins** - Content area is calculated: `pageHeight - topMargin - bottomMargin - footerHeight`

### PDF Export

The PDF export process:

1. **Collects all pages** - Gathers HTML from all paginated pages
2. **Builds complete HTML** - Creates a full HTML document with inline styles
3. **Sends to Puppeteer** - Server-side Puppeteer renders the HTML
4. **Applies margins** - Margins are applied as padding to preserve coordinate system
5. **Generates PDF** - Puppeteer creates the PDF with exact page dimensions
6. **Downloads file** - Browser downloads the generated PDF

### Margin Handling

**Critical Implementation Detail:**

The tool uses a two-stage margin approach:

1. **Preview Mode**: Margins are shown as visual guides and content is positioned accordingly
2. **PDF Export**: Margins are applied as CSS padding on the body element, with PDF engine margins set to 0

This approach prevents Puppeteer from shrinking the viewport when margins are applied, which would shift all coordinates and break the layout.

## Troubleshooting

### PDF Server Not Running

If you see an error about the PDF server:
- Make sure you ran `node pagination-pdf-server.js` in a terminal
- Check that port 3001 is not in use by another application
- Look for error messages in the terminal where the server is running

### PDF Export Fails

If PDF export fails:
- Check the browser console (F12) for error messages
- Check the server terminal for error messages
- Make sure Puppeteer installed correctly: `npm list puppeteer`
- Try reinstalling: `npm install puppeteer --force`

### Content Not Paginating Correctly

If content doesn't split across pages properly:
- Check that margins are reasonable (not too large)
- Try disabling markdown parsing to see raw content
- Check browser console for pagination logs
- Verify page format matches your expectations (A4 vs Letter)

### Margins Not Applied in PDF

If margins don't appear in the exported PDF:
- Verify margins are set in millimeters (mm)
- Check that values are positive numbers
- Look at the server logs to see what margins were sent
- Try exporting with margin guides enabled to verify preview

## Technical Details

### Page Dimensions

- **A4**: 210mm × 297mm (793.7px × 1122.5px at 96 DPI)
- **US Letter**: 215.9mm × 279.4mm (816px × 1056px at 96 DPI)
- **Conversion**: 1mm = 3.7795275591 pixels (at 96 DPI)

### Default Margins

- Top: 25mm
- Bottom: 25mm
- Left: 20mm
- Right: 20mm

### Footer Height

- Fixed at 25mm (94.5px) to accommodate page numbers

## Files

- `pagination-test-merged.html` - Main test page with editor and preview
- `pagination-pdf-server.js` - Node.js server for PDF generation
- `pagination-test-package.json` - NPM package configuration
- `PAGINATION-PDF-TEST-README.md` - This file

## Dependencies

- **express** (^4.18.2) - Web server framework
- **cors** (^2.8.5) - Cross-origin resource sharing
- **puppeteer** (^21.6.1) - Headless Chrome for PDF generation

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ⚠️ Limited (PDF export requires desktop)

## License

MIT
