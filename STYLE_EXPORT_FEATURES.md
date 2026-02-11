# Style Export Features

## Overview
The Markdown Live Preview now supports multiple visual styles with proper export functionality that preserves the selected style.

## Available Styles

### 1. GitHub Style (Default)
- Classic GitHub markdown appearance
- Standard spacing and typography
- Horizontal table borders
- PDF: Standard margins (15mm), compact layout

### 2. GitBook Style
- Clean, documentation-focused design
- Larger margins and better spacing
- Softer borders and refined typography
- Professional book-like appearance
- PDF: Larger margins (20mm), enhanced readability
- Better line spacing (1.7) for comfortable reading

### 3. VSCode Style
- VSCode editor aesthetic
- Familiar developer-friendly look
- Balanced spacing
- PDF: Standard margins with VSCode-inspired formatting

## Export Options

### Export PDF
- **Style-Aware**: PDF exports now respect the selected style
- **GitBook PDF Features**:
  - Larger margins (20mm vs 15mm)
  - Bigger font sizes for better readability
  - Enhanced line spacing (1.7)
  - All table borders for cleaner look
  - Professional document appearance
- **GitHub PDF Features**:
  - Compact layout
  - Standard margins
  - Horizontal table borders only
- **VSCode PDF Features**:
  - Developer-friendly formatting
  - Balanced spacing

### Export HTML
- **NEW FEATURE**: Export complete HTML files
- Embeds the selected style's CSS directly
- Standalone files that look exactly like the preview
- Works offline - no external dependencies
- Preserves dark/light theme setting
- Perfect for sharing or archiving

## How to Use

1. **Select Your Style**: Use the "Style:" dropdown in the header
   - Choose between GitHub, GitBook, or VSCode

2. **Export PDF**: Click "Export PDF"
   - PDF will use style-specific formatting
   - GitBook style = professional document layout
   - GitHub style = compact, standard layout
   - VSCode style = developer-friendly layout

3. **Export HTML**: Click "Export HTML"
   - Downloads a complete HTML file
   - Includes all CSS styling
   - Opens in any browser
   - Looks identical to your preview

## Style Persistence

- Your style selection is automatically saved
- Reloading the page remembers your preference
- Each style has optimized settings for both screen and print

## Technical Details

### PDF Style Settings

**GitBook Style:**
- Margin: 20mm
- H1: 12pt, H2: 11pt, H3: 10pt
- Paragraph: 9pt
- Line spacing: 1.7
- Table borders: All sides
- Link color: Blue (#0066DA)

**GitHub Style:**
- Margin: 15mm
- H1-H4: 10pt
- Paragraph: 8pt
- Line spacing: 1.5
- Table borders: Horizontal only
- Link color: Blue (#0066CC)

**VSCode Style:**
- Margin: 15mm
- H1: 11pt, H2: 10pt
- Paragraph: 8pt
- Line spacing: 1.6
- Table borders: Horizontal
- Link color: Blue (#0066CC)

### HTML Export
- Fetches the current style's CSS
- Embeds it inline in the HTML
- Includes theme (dark/light) styling
- Self-contained file with no external dependencies

## Benefits

1. **Consistency**: What you see is what you export
2. **Flexibility**: Choose the right style for your content
3. **Professional**: GitBook style for formal documents
4. **Portable**: HTML exports work anywhere
5. **Customizable**: Each style optimized for its use case

## Use Cases

- **GitBook Style**: Reports, documentation, formal documents
- **GitHub Style**: README files, technical notes, standard markdown
- **VSCode Style**: Code documentation, developer notes
- **HTML Export**: Sharing with non-technical users, archiving, offline viewing
- **PDF Export**: Printing, formal submission, professional distribution
