// Simple paper layout that matches PDF export exactly
// Just renders content continuously with margins - no manual pagination

function renderPaperLayoutSimple(outputDiv, previewWrapper, markdownSource, settings) {
    const PX_SCALE = 3.7795275591; // 1mm ≈ 3.78px at 96 DPI
    
    // User margins
    const actualTopMargin = settings.margins.top * PX_SCALE;
    const actualBottomMargin = settings.margins.bottom * PX_SCALE;
    const actualLeftMargin = settings.margins.left * PX_SCALE;
    const actualRightMargin = settings.margins.right * PX_SCALE;
    
    // Page dimensions (A4 at 96 DPI)
    const pageWidth = 794;
    const pageHeight = 1123;
    
    console.log(`[Paper Layout] Margins: ${settings.margins.top}mm, ${settings.margins.right}mm, ${settings.margins.bottom}mm, ${settings.margins.left}mm`);
    
    // Parse markdown
    let htmlContent;
    try {
        htmlContent = marked.parse(markdownSource);
        if (typeof DOMPurify !== 'undefined') {
            htmlContent = DOMPurify.sanitize(htmlContent, {
                ADD_TAGS: ['span', 'div', 'strong', 'em', 'code', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 
                           'ul', 'ol', 'li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'br', 'hr'],
                ADD_ATTR: ['class', 'style', 'href', 'src', 'alt', 'title'],
                KEEP_CONTENT: true
            });
        }
    } catch (e) {
        console.error('Markdown parsing error:', e);
        htmlContent = `<p>${markdownSource}</p>`;
    }
    
    // Clear and render
    outputDiv.innerHTML = '';
    outputDiv.classList.add('paper-layout-active');
    previewWrapper.classList.add('paper-layout-active');
    
    // Create continuous paper container
    const paperContainer = document.createElement('div');
    paperContainer.style.cssText = `
        width: ${pageWidth}px;
        margin: 48px auto;
        background: white;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        padding: ${actualTopMargin}px ${actualRightMargin}px ${actualBottomMargin}px ${actualLeftMargin}px;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        text-align: ${settings.textAlign || 'left'};
        position: relative;
        min-height: ${pageHeight}px;
    `;
    
    // Add margin guides
    if (settings.showMarginGuides !== false) {
        const guides = document.createElement('div');
        guides.style.cssText = `
            position: absolute;
            top: ${actualTopMargin}px;
            left: ${actualLeftMargin}px;
            right: ${actualRightMargin}px;
            bottom: ${actualBottomMargin}px;
            border: 2px dashed rgba(239, 68, 68, 0.5);
            pointer-events: none;
            z-index: 1000;
        `;
        paperContainer.appendChild(guides);
    }
    
    // Add page break lines
    const pageLines = document.createElement('div');
    pageLines.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 999;
    `;
    
    for (let i = 1; i <= 50; i++) {
        const line = document.createElement('div');
        line.style.cssText = `
            position: absolute;
            top: ${i * pageHeight}px;
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(148, 163, 184, 0.3);
        `;
        pageLines.appendChild(line);
    }
    paperContainer.appendChild(pageLines);
    
    // Add content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'markdown-body';
    contentDiv.style.cssText = `
        position: relative;
        z-index: 1;
    `;
    contentDiv.innerHTML = htmlContent;
    paperContainer.appendChild(contentDiv);
    
    outputDiv.appendChild(paperContainer);
    
    console.log(`✅ Paper layout rendered (continuous, matches PDF)`);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderPaperLayoutSimple };
}
if (typeof window !== 'undefined') {
    window.renderPaperLayoutSimple = renderPaperLayoutSimple;
}
