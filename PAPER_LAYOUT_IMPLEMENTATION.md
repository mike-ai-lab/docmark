# Paper Layout Implementation

## Quick Implementation Guide

### 1. Add CSS to style.css (after preview styles)
```css
/* Paper Layout - A4 Pages */
.preview-panel.paper-layout {
    background: #888;
    padding: 20px;
}

.paper-pages-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

.a4-page {
    width: 210mm;
    min-height: 297mm;
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    padding: 20mm;
    box-sizing: border-box;
}

.a4-page .markdown-body {
    height: 100%;
    overflow: hidden;
}
```

### 2. Add to main.js (in init function, after preview setup)
```javascript
// Layout state
let previewLayout = 'web'; // 'web' or 'paper'

// Toggle layout function
const togglePreviewLayout = () => {
    previewLayout = previewLayout === 'web' ? 'paper' : 'web';
    localStorage.setItem('com.markdownlivepreview.layout', previewLayout);
    updatePreviewLayout();
    updateMarkdown();
};

const updatePreviewLayout = () => {
    const previewPanel = document.querySelector('.preview-panel');
    if (previewLayout === 'paper') {
        previewPanel.classList.add('paper-layout');
    } else {
        previewPanel.classList.remove('paper-layout');
    }
};

// Load saved layout
const savedLayout = localStorage.getItem('com.markdownlivepreview.layout');
if (savedLayout) {
    previewLayout = savedLayout;
    updatePreviewLayout();
}
```

### 3. Modify updateMarkdown function
```javascript
// In updateMarkdown, after rendering HTML:
if (previewLayout === 'paper') {
    // Paginate into A4 pages
    const pages = paginateToA4(previewDiv.innerHTML);
    previewDiv.innerHTML = '';
    previewDiv.className = 'paper-pages-container';
    pages.forEach(pageHtml => {
        const page = document.createElement('div');
        page.className = 'a4-page';
        const content = document.createElement('div');
        content.className = 'markdown-body';
        content.innerHTML = pageHtml;
        page.appendChild(content);
        previewDiv.appendChild(page);
    });
} else {
    previewDiv.className = 'markdown-body';
}
```

### 4. Add pagination function
```javascript
function paginateToA4(html) {
    // Simple pagination - split by height
    const tempDiv = document.createElement('div');
    tempDiv.className = 'a4-page';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.position = 'absolute';
    document.body.appendChild(tempDiv);
    
    const content = document.createElement('div');
    content.className = 'markdown-body';
    content.innerHTML = html;
    tempDiv.appendChild(content);
    
    const pageHeight = 257mm; // 297mm - 40mm padding
    const pages = [];
    let currentPage = '';
    
    // Simple split by elements
    Array.from(content.children).forEach(el => {
        const testDiv = document.createElement('div');
        testDiv.innerHTML = currentPage + el.outerHTML;
        tempDiv.innerHTML = '';
        tempDiv.appendChild(testDiv);
        
        if (testDiv.scrollHeight > pageHeight && currentPage) {
            pages.push(currentPage);
            currentPage = el.outerHTML;
        } else {
            currentPage += el.outerHTML;
        }
    });
    
    if (currentPage) pages.push(currentPage);
    document.body.removeChild(tempDiv);
    
    return pages.length ? pages : [html];
}
```

### 5. Wire up button (find existing button or add new one)
```javascript
// Find or create layout toggle button
const layoutBtn = document.getElementById('layout-toggle-btn');
if (layoutBtn) {
    layoutBtn.addEventListener('click', togglePreviewLayout);
}
```

## Files to modify:
- `public/css/style.css` - Add paper layout CSS
- `src/main.js` - Add layout toggle logic and pagination

## Testing:
1. Click layout button
2. Should see A4 pages with gray background
3. Content should paginate across multiple pages
4. Click again to return to web layout
