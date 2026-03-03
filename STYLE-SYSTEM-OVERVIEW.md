# DocMark Style System Overview

## Theme Styles Available

The app supports 8 different markdown rendering styles:

1. **GitHub** - GitHub-flavored markdown style
2. **GitBook** - GitBook documentation style
3. **VSCode** - Visual Studio Code editor style
4. **Medium** - Medium.com article style
5. **Minimal** - Clean, minimal design
6. **Notion** - Notion-inspired style
7. **LaTeX** - Academic paper style
8. **Typewriter** - Classic typewriter aesthetic

Each style has both **light** and **dark** theme variants.

---

## Style CSS Files Location

All style CSS files are located in: `public/css/`

### Main Style Files:
- `github-markdown-light.css` - GitHub light theme
- `github-markdown-dark.css` - GitHub dark theme
- `github-markdown-dark_dimmed.css` - GitHub dark dimmed
- `vscode-style.css` - VSCode style (with dark mode support)
- `notion-style.css` - Notion style (with dark mode support)
- `medium-style.css` - Medium style (with dark mode support)
- `gitbook-style.css` - GitBook style
- `latex-style.css` - LaTeX academic style
- `minimal-style.css` - Minimal clean style
- `typewriter-style.css` - Typewriter style

---

## Font Configuration

### 1. Preview Fonts (CSS-based)

Each style defines its own font families in the CSS:

**GitHub:**
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
font-size: 16px;
```

**VSCode:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell;
font-size: 14px;
```

**Notion:**
```css
font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
font-size: 16px;
```

**Medium:**
```css
font-family: charter, Georgia, Cambria, "Times New Roman", Times, serif;
font-size: 21px;
```

### 2. PDF Export Fonts (Professional Standards)

PDF exports use professional document font settings optimized for A4 paper:

```javascript
let pdfFontSettings = {
    h1: 16,              // Main title (16pt - professional standard)
    h2: 14,              // Section headings (14pt)
    h3: 12,              // Subsection headings (12pt)
    h4: 11,              // Minor headings (11pt)
    paragraph: 10,       // Body text (10pt - standard for professional docs)
    list: 10,            // List items (10pt - same as body)
    blockquote: 10,      // Blockquotes (10pt)
    code: 9,             // Code blocks (9pt - slightly smaller, monospace)
    table: 9,            // Table text (9pt - compact for data)
    fontFamily: 'helvetica', // helvetica, times, courier
    tableBorders: 'horizontal', // all, horizontal, none
    tableBorderWeight: 0.15,
    tableBorderColor: '#d0d0d0',
    tableHeaderBg: '#fafafa',
    tableHeaderColor: '#000000'
};
```

**Professional Typography Settings:**
- Line height: 1.4 (compact professional spacing)
- Heading line height: 1.3 (tighter for headings)
- Margins between elements: 4-12pt (optimized for density)
- Table padding: 4-6px (compact data presentation)

**User can customize these via:**
- Settings panel in the UI
- Stored in localStorage: `com.markdownlivepreview.pdf_font_settings`

---

## Paper Size Configuration

### PDF Export Paper Settings

Located in: `pdf-server.js`

```javascript
const pdfBuffer = await page.pdf({
    format: 'A4',           // Paper size
    printBackground: true,   // Include background colors
    preferCSSPageSize: false,
    margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
    }
});
```

**Available Paper Formats:**
- A4 (default)
- Letter
- Legal
- Tabloid
- Ledger
- A0, A1, A2, A3, A5, A6

**Margins:**
- Default: 15mm on all sides (professional standard)
- Configurable via page setup settings
- Stored in localStorage: `com.markdownlivepreview.page_setup_settings`
- Reduced from 20mm to fit more content per page

---

## Table of Contents (TOC) Styles

TOC generation is handled in: `src/toc-styles.js`

Each style has a custom TOC generator function:

### TOC Style Functions:
1. `generateGithubToc()` - GitHub-style TOC
2. `generateGitbookToc()` - GitBook-style TOC
3. `generateVscodeToc()` - VSCode-style TOC with H1, H2, H3 icons
4. `generateMediumToc()` - Medium-style TOC with serif fonts
5. `generateMinimalToc()` - Horizontal minimal TOC
6. `generateNotionToc()` - Notion-style TOC
7. `generateLatexToc()` - LaTeX-style numbered TOC

**TOC Features:**
- Inline styles for consistent PDF export
- Hierarchical indentation
- Style-specific fonts and colors
- Automatic heading ID linking

---

## Active Code Locations

### 1. Style Switching Logic
**File:** `src/main.js`
- Function: `switchStyle(styleName)`
- Dynamically loads CSS files based on selected style
- Updates preview in real-time

### 2. PDF Export Logic
**File:** `src/main.js`
- Function: `exportPreviewToPdf()`
- Function: `collectHtmlForPuppeteer()`
- Collects HTML + CSS and sends to Puppeteer server

**File:** `pdf-server.js`
- Endpoint: `POST /generate-pdf`
- Uses Puppeteer to render HTML to PDF
- Handles font loading and rendering

### 3. HTML Export Logic
**File:** `src/main.js`
- Function: `exportPreviewToHtml()`
- Generates standalone HTML with embedded CSS
- Includes TOC if enabled

### 4. Theme Toggle (Light/Dark)
**File:** `src/main.js`
- Function: `toggleTheme()`
- Switches between light and dark CSS variants
- Updates `data-theme` attribute on document

---

## Font Size Hierarchy

### Preview (CSS-based)

**GitHub Style:**
- H1: 2em (32px)
- H2: 1.5em (24px)
- H3: 1.25em (20px)
- H4: 1em (16px)
- Body: 16px

**VSCode Style:**
- H1: 2em (28px)
- H2: 1.5em (21px)
- H3: 1.25em (17.5px)
- Body: 14px

**Medium Style:**
- H1: 2.5em (52.5px)
- H2: 2em (42px)
- H3: 1.5em (31.5px)
- Body: 21px (larger for readability)

**Notion Style:**
- H1: 2.5em (40px)
- H2: 1.875em (30px)
- H3: 1.5em (24px)
- Body: 16px

### PDF Export (Professional Standards)

Optimized for professional documents (CVs, reports, articles):
- H1: 16pt (main titles)
- H2: 14pt (section headings)
- H3: 12pt (subsections)
- H4-H6: 11pt (minor headings)
- Paragraph: 10pt (body text - professional standard)
- Lists: 10pt (same as body)
- Code: 9pt (monospace, compact)
- Tables: 9pt (data presentation)
- Line height: 1.4 (compact professional spacing)
- Margins: 15mm (optimized for content density)

**Result:** A typical 95-line CV fits comfortably on 1-2 pages, matching professional document standards.

---

## How Styles Are Applied

### 1. Preview Mode
1. User selects style from dropdown (`#style-selector`)
2. `switchStyle()` function is called
3. CSS file is loaded dynamically via `<link>` tag
4. Preview updates immediately

### 2. PDF Export
1. User clicks "Export PDF" button
2. `collectHtmlForPuppeteer()` gathers:
   - HTML content from preview
   - All CSS styles (inline)
   - Font imports from Google Fonts
   - TOC HTML (if enabled)
3. Complete HTML sent to `pdf-server.js`
4. Puppeteer renders HTML to PDF with:
   - A4 paper size
   - Configured margins
   - Background colors enabled
   - Fonts fully loaded

### 3. HTML Export
1. User clicks "Export HTML" button
2. Standalone HTML file generated with:
   - Embedded CSS styles
   - TOC included
   - All fonts referenced
3. File downloaded to user's system

---

## Customization Points

### For Users (via UI):
1. **Style selector** - Choose from 8 styles
2. **Theme toggle** - Switch light/dark mode
3. **PDF settings panel** - Customize fonts, sizes, table styling
4. **Page setup** - Configure margins

### For Developers (via code):
1. **Add new style:**
   - Create CSS file in `public/css/`
   - Add to style selector in `index.html`
   - Add TOC generator in `src/toc-styles.js`

2. **Modify existing style:**
   - Edit CSS file in `public/css/`
   - Changes reflect immediately in preview

3. **Change PDF defaults:**
   - Edit `pdfFontSettings` in `src/main.js`
   - Edit paper format in `pdf-server.js`

---

## Export Scripts

### Test Export Scripts:
- `export-final.js` - Exports all styles as PDF
- `export-html-all-styles.js` - Exports all styles as HTML
- `export-all-toc.js` - Tests TOC in all exports

These scripts use Puppeteer to automate the export process for testing.

---

## Summary

The DocMark app has a sophisticated multi-style system with:
- 8 distinct visual styles
- Light/dark theme support for each
- Customizable PDF export settings
- Style-specific TOC generation
- Flexible font and paper size configuration
- Real-time preview updates

All styles are CSS-based for easy customization, and the PDF export system uses Puppeteer for high-quality rendering with proper font embedding.
