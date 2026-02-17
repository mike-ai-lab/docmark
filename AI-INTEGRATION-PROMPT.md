
I need you to integrate the pagination system from `pagination-engine.js` into my markdown live preview application. Here are the requirements:

## Files to Work With:
- `src/main.js` - Main application file
- `index.html` - HTML structure
- `public/css/style.css` - Styles
- `pagination-engine.js` - The pagination engine to integrate

## What I Need:

### 1. Add Paper Layout Toggle
- Add a button or toggle in the UI to switch between "Web Layout" and "Paper Layout"
- When Paper Layout is active, show the paper controls (zoom in, zoom out, fit to width, reset, page count)
- Store the layout preference in localStorage

### 2. Integrate PaginationEngine
- Import/include the `pagination-engine.js` file
- Initialize the PaginationEngine when Paper Layout is activated
- Configure it with these settings:
  ```javascript
  {
      pageHeight: 1123,  // A4 height
      pageWidth: 794,    // A4 width  
      margin: 80,        // 2.1cm margins
      firstPageHeaderHeight: 0,  // No special first page
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      lineSpacing: 8
  }
  ```

### 3. Pagination Logic
- When content changes in Paper Layout mode, automatically re-paginate
- Extract the text content from the rendered markdown HTML
- Use `paginator.paginate(textContent)` to get pages
- Render each page as a `.paper-page` div with proper styling

### 4. Page Rendering
- Each page should be a white paper-like div with shadow
- Display page numbers at the bottom of each page
- Add proper spacing between pages
- Make pages zoomable (50% to 200%)

### 5. CSS Integration
- Use `PaperLayoutCSS.generate()` to inject the paper layout styles
- Or manually add the paper layout CSS to `public/css/style.css`
- Ensure pages look like real paper with shadows
- Add print styles so pages print correctly

### 6. Zoom Controls
- Add zoom in/out buttons
- Add "Fit to Width" button
- Add "Reset to 100%" button
- Display current zoom percentage
- Apply zoom using CSS transform: scale()

### 7. Status Bar
- Show current layout mode (Web Layout / Paper Layout)
- Show page count when in Paper Layout mode
- Make the layout mode clickable to toggle

### 8. Clean Implementation
- Keep the code clean and well-organized
- Add comments explaining the pagination logic
- Handle edge cases (empty content, very long content)
- Ensure smooth transitions between layouts
- Clean up the paginator when switching back to Web Layout

### 9. Preserve Existing Features
- Don't break any existing functionality
- Keep all current markdown rendering working
- Maintain syntax highlighting
- Keep the editor and preview sync
- Preserve all export features (PDF, HTML, Markdown)

## Expected Behavior:

1. User clicks "Paper Layout" toggle
2. Preview switches to paper layout with multiple pages
3. Content is automatically split across pages based on height
4. User can zoom in/out to view pages comfortably
5. User can print or export to PDF with proper page breaks
6. Switching back to "Web Layout" restores normal continuous scroll

## Important Notes:

- The pagination engine measures actual text height in the browser
- It automatically handles line breaks and empty lines
- Pages are created dynamically based on content
- The first page can have a different header height if needed
- Always call `paginator.destroy()` when cleaning up

## Testing:

After integration, test with:
1. Short content (1 page)
2. Long content (multiple pages)
3. Content with many line breaks
4. Switching between layouts multiple times
5. Zooming in and out
6. Printing to PDF

---

Please implement this step by step and let me know if you need any clarification.
