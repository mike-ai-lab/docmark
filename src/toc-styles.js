// TOC Style Generators for Different Export Styles
// Each function generates HTML and CSS for a specific style's TOC

export function generateTocHtml(tocData, styleName) {
    if (!tocData || tocData.length === 0) return null;
    
    const generators = {
        'github': generateGithubToc,
        'gitbook': generateGitbookToc,
        'vscode': generateVscodeToc,
        'medium': generateMediumToc,
        'minimal': generateMinimalToc,
        'notion': generateNotionToc,
        'latex': generateLatexToc,
        'typewriter': generateMinimalToc // Use minimal for typewriter
    };
    
    const generator = generators[styleName] || generateGithubToc;
    return generator(tocData);
}

function generateGithubToc(tocData) {
    let html = '<div class="toc-github" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Helvetica, Arial, sans-serif; width: 100%; margin-bottom: 40px;">';
    html += '<h2 style="font-size: 18px; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #d0d7de; margin: 0 0 20px 0; text-align: center;">Table of Contents</h2>';
    html += '<ul style="list-style: none; padding: 0; margin: 0;">';
    
    tocData.forEach((item) => {
        const indent = (item.level - 1) * 20;
        const fontSize = item.level === 1 ? '15px' : item.level === 2 ? '14px' : '13px';
        const fontWeight = item.level === 1 ? '600' : 'normal';
        const marginBottom = item.level === 1 ? '12px' : '6px';
        
        html += `<li style="margin: 0; padding: 0; margin-bottom: ${marginBottom}; margin-left: ${indent}px; list-style: none;">`;
        html += `<a href="#${item.id}" style="color: #0969da; text-decoration: none; font-size: ${fontSize}; font-weight: ${fontWeight}; display: block; padding: 4px 0;">${item.text}</a>`;
        html += '</li>';
    });
    
    html += '</ul></div>';
    return html;
}

function generateGitbookToc(tocData) {
    let html = '<div class="toc-gitbook" style="font-family: Inter, sans-serif; width: 100%; margin-bottom: 40px;">';
    html += '<h2 style="font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center; padding-bottom: 12px; border-bottom: 1px solid currentColor; opacity: 0.3;">Table of Contents</h2>';
    html += '<ul style="list-style: none; padding: 0; margin: 0;">';
    
    tocData.forEach((item) => {
        const isSub = item.level > 1;
        const paddingLeft = isSub ? '30px' : '0';
        const fontSize = isSub ? '13px' : '14px';
        const fontWeight = isSub ? 'normal' : '500';
        const marginBottom = isSub ? '8px' : '12px';
        const opacity = isSub ? '0.8' : '1';
        
        html += `<li style="margin: 0; padding: 0; margin-bottom: ${marginBottom}; margin-left: ${paddingLeft}; list-style: none;">`;
        html += `<a href="#${item.id}" style="display: block; padding: 6px 8px; font-size: ${fontSize}; border-radius: 4px; color: inherit; text-decoration: none; font-weight: ${fontWeight}; opacity: ${opacity};">${item.text}</a>`;
        html += '</li>';
    });
    
    html += '</ul></div>';
    return html;
}

function generateVscodeToc(tocData) {
    let html = '<div class="toc-vscode" style="font-family: \'IBM Plex Mono\', monospace; padding: 20px; border-radius: 4px; width: 100%; margin-bottom: 40px;">';
    html += '<h2 style="color: #969696; font-size: 11px; text-transform: uppercase; margin: 0 0 15px 0; letter-spacing: 1px; text-align: center;">Outline</h2>';
    html += '<ul style="list-style: none; padding: 0; margin: 0;">';
    
    tocData.forEach(item => {
        const paddingLeft = (item.level - 1) * 16;
        const icon = `H${item.level}`;
        const marginBottom = item.level === 1 ? '10px' : '6px';
        
        html += `<li style="font-size: 12px; padding: 0; margin: 0 0 ${marginBottom} ${paddingLeft}px; display: flex; align-items: center; list-style: none;">`;
        html += `<span style="margin-right: 8px; color: #4fc1ff; font-size: 11px; font-weight: bold; width: 18px; flex-shrink: 0;">${icon}</span>`;
        html += `<a href="#${item.id}" style="text-decoration: none; flex-grow: 1; color: inherit;">${item.text}</a>`;
        html += '</li>';
    });
    
    html += '</ul></div>';
    return html;
}

function generateMediumToc(tocData) {
    let html = '<div class="toc-medium" style="font-family: \'Source Serif Pro\', serif; border-left: 3px solid currentColor; opacity: 0.5; padding-left: 24px; width: 100%; margin-bottom: 40px;">';
    html += '<h2 style="font-family: Inter, sans-serif; font-weight: 700; font-size: 18px; margin: 0 0 20px 0; text-align: center; opacity: 1;">Guide Content</h2>';
    html += '<ul style="list-style: none; padding: 0; margin: 0; opacity: 1;">';
    
    tocData.forEach(item => {
        const marginLeft = (item.level - 1) * 20;
        const fontSize = item.level === 1 ? '15px' : '14px';
        const fontWeight = item.level === 1 ? '600' : 'normal';
        const marginBottom = item.level === 1 ? '14px' : '8px';
        
        html += `<li style="margin: 0 0 ${marginBottom} ${marginLeft}px; padding: 0; list-style: none;">`;
        html += `<a href="#${item.id}" style="color: inherit; text-decoration: none; font-size: ${fontSize}; font-weight: ${fontWeight}; display: block;">${item.text}</a>`;
        html += '</li>';
    });
    
    html += '</ul></div>';
    return html;
}

function generateMinimalToc(tocData) {
    let html = '<div class="toc-minimal" style="text-align: center; width: 100%; margin-bottom: 40px; opacity: 0.7;">';
    html += '<h2 style="font-size: 16px; font-weight: 600; margin: 0 0 20px 0; text-align: center; opacity: 1;">Contents</h2>';
    html += '<ul style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; list-style: none; padding: 0; margin: 0; opacity: 1;">';
    
    tocData.forEach((item, index) => {
        html += `<li style="display: inline; margin: 0; padding: 0; list-style: none;">`;
        html += `<a href="#${item.id}" style="font-size: 13px; color: inherit; text-decoration: none; text-transform: lowercase; padding: 4px 8px; display: inline-block;">${item.text}</a>`;
        if (index < tocData.length - 1) {
            html += `<span style="margin: 0 4px; opacity: 0.5;">•</span>`;
        }
        html += '</li>';
    });
    
    html += '</ul></div>';
    return html;
}

function generateNotionToc(tocData) {
    let html = '<div class="toc-notion" style="font-size: 14px; width: 100%; margin-bottom: 40px;">';
    html += '<h2 style="font-size: 16px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">Table of Contents</h2>';
    html += '<ul style="list-style: none; padding: 0; margin: 0;">';
    
    tocData.forEach(item => {
        const marginLeft = (item.level - 1) * 20;
        const fontWeight = item.level === 1 ? '600' : 'normal';
        const opacity = item.level === 1 ? '1' : '0.75';
        const fontSize = item.level === 1 ? '14px' : item.level === 2 ? '13px' : '12px';
        const marginBottom = item.level === 1 ? '12px' : '6px';
        
        html += `<li style="margin: 0 0 ${marginBottom} ${marginLeft}px; padding: 0; list-style: none;">`;
        html += `<a href="#${item.id}" style="display: block; padding: 4px 8px; text-decoration: none; color: inherit; border-radius: 3px; opacity: ${opacity}; font-weight: ${fontWeight}; font-size: ${fontSize};">${item.text}</a>`;
        html += '</li>';
    });
    
    html += '</ul></div>';
    return html;
}

function generateLatexToc(tocData) {
    let html = '<div class="toc-latex" style="font-family: \'Libre Baskerville\', serif; font-size: 13px; width: 100%; margin-bottom: 40px;">';
    html += '<h2 style="text-align: center; text-transform: uppercase; font-size: 16px; letter-spacing: 2px; margin: 0 0 24px 0; font-weight: bold;">Contents</h2>';
    html += '<ul style="list-style: none; padding: 0; margin: 0;">';
    
    let sectionNumber = 1;
    let subsectionNumber = 1;
    
    tocData.forEach(item => {
        const isSection = item.level === 1;
        const marginLeft = isSection ? '0' : '30px';
        const fontWeight = isSection ? 'bold' : 'normal';
        const fontSize = isSection ? '13px' : '12px';
        const marginBottom = isSection ? '12px' : '6px';
        const marginTop = isSection && sectionNumber > 1 ? '8px' : '0';
        
        const number = isSection ? `${sectionNumber}` : `${sectionNumber - 1}.${subsectionNumber}`;
        
        html += `<li style="display: flex; align-items: baseline; margin: ${marginTop} 0 ${marginBottom} ${marginLeft}px; padding: 0; font-weight: ${fontWeight}; font-size: ${fontSize}; list-style: none;">`;
        html += `<span style="flex-shrink: 0; margin-right: 8px;">${number}</span>`;
        html += `<a href="#${item.id}" style="flex-grow: 1; text-decoration: none; color: inherit;">${item.text}</a>`;
        html += '</li>';
        
        if (isSection) {
            sectionNumber++;
            subsectionNumber = 1;
        } else {
            subsectionNumber++;
        }
    });
    
    html += '</ul></div>';
    return html;
}
