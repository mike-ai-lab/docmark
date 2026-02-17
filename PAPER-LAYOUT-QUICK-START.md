# Paper Layout - Quick Start Guide

## 🚀 How to Use Paper Layout

### Step 1: Activate Paper Layout
1. Look for the **"Paper Layout"** button in the top-right corner of the preview pane
2. Click the button to activate Paper Layout mode
3. The button will turn green and your content will split into pages

### Step 2: Use Zoom Controls
Once Paper Layout is active, you'll see a floating toolbar with zoom controls:

- **Zoom In** (🔍+): Increase page size
- **Zoom Out** (🔍-): Decrease page size  
- **Fit to Width** (⇔): Auto-fit pages to preview width
- **Reset** (↻): Reset zoom to 100%

### Step 3: View Page Count
- Check the status bar at the bottom of the screen
- You'll see "Paper Layout" and the page count (e.g., "3 pages")
- Click the status bar to quickly toggle between layouts

### Step 4: Edit Content
- Type in the editor as normal
- Content automatically re-paginates as you type
- Page count updates in real-time

### Step 5: Export to PDF
- Click the PDF export button in the header
- The PDF will match the exact page layout you see
- Each page will be properly formatted with margins and page numbers

### Step 6: Return to Web Layout
- Click the "Paper Layout" button again to deactivate
- Content returns to continuous scroll mode
- Your zoom preference is saved for next time

## 📐 Page Specifications

- **Page Size**: A4 (794px × 1123px at 96 DPI)
- **Margins**: 80px on all sides (~2.1cm)
- **Content Area**: 634px × 963px
- **Page Numbers**: Bottom center of each page
- **Font**: 14px Inter, 1.6 line-height

## ⌨️ Keyboard Shortcuts

- **Toggle Layout**: Click status bar "Web Layout" / "Paper Layout" text
- **Zoom In**: Use zoom controls (no keyboard shortcut yet)
- **Zoom Out**: Use zoom controls (no keyboard shortcut yet)

## 💡 Tips & Tricks

### Best Practices:
1. **Use Paper Layout for**:
   - Final document review before printing
   - Checking page breaks
   - Estimating printed page count
   - Professional document formatting

2. **Use Web Layout for**:
   - Quick editing and writing
   - Continuous reading
   - Working with very long documents

### Zoom Tips:
- Use **Fit to Width** for comfortable reading
- Use **100%** for accurate page size preview
- Use **150-200%** for detailed editing

### Content Tips:
- Headings try to stay together (no page breaks)
- Code blocks try to stay on one page
- Tables try to stay on one page
- Long paragraphs may split across pages

## 🐛 Troubleshooting

### Issue: Pages look too small
**Solution**: Click "Fit to Width" or use Zoom In button

### Issue: Content not paginating
**Solution**: Make sure Paper Layout is active (button should be green)

### Issue: Page count not showing
**Solution**: Check the status bar at the bottom of the screen

### Issue: PDF export doesn't match pages
**Solution**: Make sure you're in Paper Layout mode before exporting

### Issue: Layout preference not saving
**Solution**: Check browser localStorage is enabled

## 🎯 Testing Your Setup

### Quick Test:
1. Open the application
2. Paste the content from `test-paper-layout.md`
3. Click "Paper Layout" button
4. You should see multiple pages with proper formatting
5. Try zooming in/out
6. Try editing content and watch it re-paginate

### Visual Test:
1. Open `test-paper-layout-visual.html` in your browser
2. Run all 4 tests:
   - Engine Initialization Test
   - Content Pagination Test
   - Visual Preview Test
   - Page Dimensions Test
3. All tests should pass with green checkmarks
4. Visual preview should show properly formatted pages

## 📞 Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Verify `pagination-engine.js` is loaded
3. Check that localStorage is enabled
4. Try refreshing the page
5. Try clearing browser cache

## 🎉 Enjoy Your Paper Layout!

The paper layout system makes it easy to create professional, print-ready documents directly in your markdown editor. Happy writing!
