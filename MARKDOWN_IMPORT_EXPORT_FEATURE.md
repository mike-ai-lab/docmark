# Markdown Import/Export Feature

## Overview

Added quick import and export functionality for markdown files with icon buttons in the header for instant access.

## Features

### Export Markdown
- **Location**: Icon button in header-right (upload arrow icon)
- **Functionality**: Instantly exports the current editor content as a `.md` file
- **Filename Format**: `{documenttitle}_docmark_{timestamp}.md`
  - Document title extracted from YAML front matter `title:` field
  - If no YAML title, uses first H1 heading
  - If no heading, defaults to "document"
  - Title is sanitized (lowercase, special chars replaced with underscores)
  - Timestamp format: `YYYY-MM-DDTHH-MM-SS`

**Example filenames:**
- `project_proposal_docmark_2026-02-12T14-30-45.md`
- `api_documentation_docmark_2026-02-12T14-31-22.md`
- `document_docmark_2026-02-12T14-32-10.md`

### Import Markdown
- **Location**: Icon button in header-right (download arrow icon)
- **Functionality**: Opens file picker to select and import `.md`, `.markdown`, or `.txt` files
- **Behavior**: 
  - Replaces current editor content with imported file
  - Shows success toast with filename
  - File input resets after import (allows re-importing same file)

## UI Design

### Icon Buttons
- **Style**: Minimal, clean icon buttons with hover effects
- **Size**: 36x36px with 6px border-radius
- **Icons**: SVG line icons (Feather Icons style)
  - Import: Download arrow (pointing down into box)
  - Export: Upload arrow (pointing up from box)
- **Colors**:
  - Light mode: Gray (#64748b) → Blue (#2563eb) on hover
  - Dark mode: Light gray (#94a3b8) → Light blue (#60a5fa) on hover
- **Hover Effect**: Background color change + slight scale on click
- **Tooltips**: Native browser tooltips on hover

### Layout
```
Header Right Section:
[Import Icon] [Export Icon] [GitHub Logo]
```

## Technical Implementation

### HTML Structure
```html
<div class="header-right">
    <button class="icon-button" id="import-md-button" title="Import Markdown File">
        <!-- SVG icon -->
    </button>
    <button class="icon-button" id="export-md-button" title="Export Markdown File">
        <!-- SVG icon -->
    </button>
    <div id="github">...</div>
</div>
<input type="file" id="import-md-input" accept=".md,.markdown,.txt" style="display: none;">
```

### JavaScript Functions

**exportMarkdownFile()**
- Gets editor content
- Extracts document title from YAML or first heading
- Sanitizes title for filename
- Generates timestamp
- Creates blob and triggers download
- Shows success toast

**importMarkdownFile(file)**
- Reads file using FileReader API
- Sets editor content
- Shows success toast
- Handles errors gracefully

**setupExportMarkdownButton()**
- Attaches click handler to export button

**setupImportMarkdownButton()**
- Attaches click handler to import button
- Triggers hidden file input
- Handles file selection and import

### CSS Styling
```css
.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.icon-button:hover {
  background-color: #f1f5f9;
  color: #2563eb;
}

.icon-button:active {
  transform: scale(0.95);
}
```

## User Experience

### Export Flow
1. User clicks export icon button
2. File downloads instantly with auto-generated name
3. Success toast appears: "Markdown exported: {filename}"

### Import Flow
1. User clicks import icon button
2. File picker opens
3. User selects markdown file
4. Editor content replaced with file content
5. Success toast appears: "Imported: {filename}"

### Error Handling
- If file read fails: Shows error toast "Failed to read file"
- If editor not initialized: Logs error and returns gracefully
- File input accepts: `.md`, `.markdown`, `.txt`

## Benefits

1. **Quick Access**: No need to navigate through menus
2. **Smart Naming**: Automatic filename generation based on content
3. **Timestamp**: Never overwrite existing files
4. **Clean UI**: Minimal icon buttons don't clutter header
5. **Intuitive**: Standard upload/download arrow icons
6. **Responsive**: Hover effects provide visual feedback
7. **Theme Support**: Icons adapt to light/dark mode

## Files Modified

- `index.html` - Added icon buttons and hidden file input
- `public/css/style.css` - Added icon button styles
- `src/main.js` - Added import/export functions and setup handlers

## Testing

To test the feature:

1. **Export Test**:
   - Write some markdown with a title
   - Click export icon
   - Verify file downloads with correct name format
   - Check file content matches editor

2. **Import Test**:
   - Click import icon
   - Select a markdown file
   - Verify editor content updates
   - Try importing same file again (should work)

3. **Title Extraction Test**:
   - Test with YAML front matter title
   - Test with H1 heading
   - Test with no title (should use "document")

4. **Theme Test**:
   - Toggle dark mode
   - Verify icon colors change appropriately
   - Check hover effects work in both themes

## Future Enhancements

Potential improvements:
- Drag and drop file import
- Multiple file import
- Export with custom filename dialog
- Recent files list
- Auto-save to file system (File System Access API)
- Import from URL
