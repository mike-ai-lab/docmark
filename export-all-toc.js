/**
 * Direct Automated TOC Export Script
 * Generates PDFs and HTMLs for all styles without UI interaction
 * Uses the app's export functions directly
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Output directory
const outputDir = path.join(__dirname, 'test-exports');
const pdfDir = path.join(outputDir, 'pdf-exports');
const htmlDir = path.join(outputDir, 'html-exports');

// Create directories
[outputDir, pdfDir, htmlDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Sample markdown
const markdown = `# Introduction to Markdown

This is a comprehensive guide to Markdown syntax and usage.

## Getting Started

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.

### Why Use Markdown?

Markdown is easy to read and write. It's also portable and platform independent.

#### Key Benefits

- Simple and clean syntax
- Easy to learn
- Widely supported
- Great for documentation

## Text Formatting

### Bold and Italic

You can make text **bold** or *italic* or ***both***.

### Lists

#### Unordered Lists

- Item one
- Item two
  - Nested item
  - Another nested item
- Item three

#### Ordered Lists

1. First item
2. Second item
   1. Nested first
   2. Nested second
3. Third item

## Code and Blocks

### Inline Code

Use \`const x = 5;\` for inline code.

### Code Blocks

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### Blockquotes

> This is a blockquote.
> It can span multiple lines.
> 
> And have multiple paragraphs.

## Tables

| Feature | Support | Notes |
|---------|---------|-------|
| Headers | Yes | Required |
| Rows | Yes | Multiple rows |
| Columns | Yes | Multiple columns |

## Links and Images

[Visit OpenAI](https://openai.com)

## Conclusion

Markdown is a powerful tool for creating well-formatted documents with minimal effort.

### Final Thoughts

Use Markdown for your next project and experience the simplicity it brings.
`;

const styles = ['github', 'gitbook', 'vscode', 'medium', 'minimal', 'notion', 'latex', 'typewriter'];

// Generate TOC data
function generateTocData(content) {
    const lines = content.split('\n');
    const tocItems = [];
    let inCodeBlock = false;
    
    lines.forEach((line, index) => {
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return;
        }
        if (inCodeBlock) return;
        
        const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headerMatch) {
            const level = headerMatch[1].length;
            const text = headerMatch[2].trim();
            
            if (!text) return;
            
            const id = text.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            tocItems.push({
                level: level,
                text: text,
                id: id,
                line: index + 1
            });
        }
    });
    
    return tocItems;
}

// TOC Style Generators (copied from src/toc-styles.js)
function generateTocHtml(tocData, styleName) {
    if (!tocData || tocData.length === 0) return null;
    
    const generators = {
        'github': generateGithubToc,
        'gitbook': generateGitbookToc,
        'vscode': generateVscodeToc,
        'medium': generateMediumToc,
        'minimal': generateMinimalToc,
        'notion': generateNotionToc,
        'latex': generateLatexToc,
        'typewriter': generateMinimalToc
    };
    
    const generator = generators[styleName] || generateGithubToc;
    return generator(tocData);
}

function generateGithubToc(tocData) {
    let html = '<div class="toc-github" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Helvetica, Arial, sans-serif; width: 100%;">';
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
    let html = '<div class="toc-gitbook" style="font-family: Inter, sans-serif; color: #3b454e; width: 100%;">';
    html += '<h2 style="font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">Table of Contents</h2>';
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
    let html = '<div class="toc-vscode" style="background: #1e1e1e; color: #cccccc; font-family: \'IBM Plex Mono\', monospace; padding: 20px; border-radius: 4px; width: 100%;">';
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
    let html = '<div class="toc-medium" style="font-family: \'Source Serif Pro\', serif; border-left: 3px solid #292929; padding-left: 24px; width: 100%;">';
    html += '<h2 style="font-family: Inter, sans-serif; font-weight: 700; font-size: 18px; margin: 0 0 20px 0; text-align: center;">Guide Content</h2>';
    html += '<ul style="list-style: none; padding: 0; margin: 0;">';
    
    tocData.forEach(item => {
        const marginLeft = (item.level - 1) * 20;
        const fontSize = item.level === 1 ? '15px' : '14px';
        const fontWeight = item.level === 1 ? '600' : 'normal';
        const marginBottom = item.level === 1 ? '14px' : '8px';
        
        html += `<li style="margin: 0 0 ${marginBottom} ${marginLeft}px; padding: 0; list-style: none;">`;
        html += `<a href="#${item.id}" style="color: rgba(41, 41, 41, 1); text-decoration: none; font-size: ${fontSize}; font-weight: ${fontWeight}; display: block;">${item.text}</a>`;
        html += '</li>';
    });
    
    html += '</ul></div>';
    return html;
}

function generateMinimalToc(tocData) {
    let html = '<div class="toc-minimal" style="text-align: center; width: 100%;">';
    html += '<h2 style="font-size: 16px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">Contents</h2>';
    html += '<ul style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; list-style: none; padding: 0; margin: 0;">';
    
    tocData.forEach((item, index) => {
        html += `<li style="display: inline; margin: 0; padding: 0; list-style: none;">`;
        html += `<a href="#${item.id}" style="font-size: 13px; color: #64748b; text-decoration: none; text-transform: lowercase; padding: 4px 8px; display: inline-block;">${item.text}</a>`;
        if (index < tocData.length - 1) {
            html += `<span style="margin: 0 4px; color: #cbd5e1;">•</span>`;
        }
        html += '</li>';
    });
    
    html += '</ul></div>';
    return html;
}

function generateNotionToc(tocData) {
    let html = '<div class="toc-notion" style="color: #37352f; font-size: 14px; width: 100%;">';
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
    let html = '<div class="toc-latex" style="font-family: \'Libre Baskerville\', serif; font-size: 13px; width: 100%;">';
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
        html += `<span style="flex-shrink: 0; margin-left: 8px; font-variant-numeric: tabular-nums;">${item.line}</span>`;
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

// Convert markdown to HTML
function markdownToHtml(md) {
    let html = md;
    
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    html = html.replace(/```javascript\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/```\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
    
    html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
    
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    html = html.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, text) => {
        const id = text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return `<h${level} id="${id}">${text}</h${level}>`;
    });
    
    return html;
}

// Generate PDF HTML
function generatePdfHtml(md, style) {
    const tocData = generateTocData(md);
    const tocHtml = generateTocHtml(tocData, style) || '';
    const contentHtml = markdownToHtml(md);
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Mono&family=Libre+Baskerville:ital@0;1&family=Source+Serif+Pro:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            color: #24292e;
        }
        
        .toc-page-container {
            display: flex;
            align-items: center;
            justify-content: center;
            page-break-after: always;
            break-after: page;
            padding: 40px;
            background: white;
            min-height: 100vh;
            box-sizing: border-box;
        }
        
        .toc-page-content {
            width: 100%;
            max-width: 600px;
            text-align: center;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        
        .toc-github, .toc-gitbook, .toc-vscode, .toc-medium, .toc-minimal, .toc-notion, .toc-latex {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        
        .toc-github ul, .toc-gitbook ul, .toc-vscode ul, .toc-medium ul, .toc-minimal ul, .toc-notion ul, .toc-latex ul {
            list-style: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        
        .toc-github li, .toc-gitbook li, .toc-vscode li, .toc-medium li, .toc-minimal li, .toc-notion li, .toc-latex li {
            display: list-item !important;
            list-style: none !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .content-container {
            page-break-before: avoid;
            padding: 40px;
        }
        
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        h1 { font-size: 32px; }
        h2 { font-size: 24px; }
        h3 { font-size: 20px; }
        h4 { font-size: 16px; }
        h5 { font-size: 14px; }
        h6 { font-size: 12px; }
        p { margin: 0 0 16px 0; line-height: 1.6; }
        ul, ol { margin: 0 0 16px 0; padding-left: 2em; }
        li { margin-bottom: 8px; }
        code {
            background-color: #f6f8fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 12px;
        }
        pre {
            background-color: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 0 0 16px 0;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #d0d7de;
            padding: 0 1em;
            color: #57606a;
            margin: 0 0 16px 0;
        }
        a {
            color: #0969da;
            text-decoration: none;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 0 0 16px 0;
        }
        th, td {
            border: 1px solid #d0d7de;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f6f8fa;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="toc-page-container"><div class="toc-page-content">${tocHtml}</div></div>
    <div class="content-container">
        ${contentHtml}
    </div>
</body>
</html>`;
}

// Send PDF to server
function sendPdfToServer(html, filename) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            html: html,
            filename: filename,
            margins: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/generate-pdf',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let pdfData = Buffer.alloc(0);

            res.on('data', (chunk) => {
                pdfData = Buffer.concat([pdfData, chunk]);
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(pdfData);
                } else {
                    reject(new Error(`Server returned ${res.statusCode}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Main export function
async function exportAll() {
    console.log('🚀 Automated TOC Export\n');
    console.log(`📁 Output: ${outputDir}\n`);
    
    console.log('📊 Generating PDFs...\n');
    
    for (const style of styles) {
        try {
            const html = generatePdfHtml(markdown, style);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `${style}.pdf`;
            
            const pdfBuffer = await sendPdfToServer(html, filename);
            const filepath = path.join(pdfDir, filename);
            fs.writeFileSync(filepath, pdfBuffer);
            
            console.log(`✅ ${filename}`);
        } catch (error) {
            console.log(`❌ ${style}.pdf - ${error.message}`);
        }
    }
    
    console.log('\n🌐 Generating HTMLs...\n');
    
    // Generate HTML exports
    const themes = ['light', 'dark'];
    for (const theme of themes) {
        try {
            const isDark = theme === 'dark';
            const tocData = generateTocData(markdown);
            const tocHtml = generateTocHtml(tocData, 'github') || '';
            const contentHtml = markdownToHtml(markdown);
            
            const bgColor = isDark ? '#0d1117' : '#f6f8fa';
            const textColor = isDark ? '#c9d1d9' : '#24292e';
            const containerBg = isDark ? '#0d1117' : '#ffffff';
            
            const htmlContent = `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Export - GitHub (${theme})</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Mono&family=Libre+Baskerville:ital@0;1&family=Source+Serif+Pro:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; }
        body {
            background-color: ${bgColor};
            color: ${textColor};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            padding: 40px 20px;
            margin: 0;
        }
        .container {
            max-width: 980px;
            margin: 0 auto;
            background-color: ${containerBg};
            padding: 40px 50px;
            border-radius: 6px;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        h1 { font-size: 32px; }
        h2 { font-size: 24px; border-bottom: 1px solid ${isDark ? '#30363d' : '#e1e4e8'}; padding-bottom: 10px; }
        h3 { font-size: 20px; }
        h4 { font-size: 16px; }
        h5 { font-size: 14px; }
        h6 { font-size: 12px; }
        p { margin: 0 0 16px 0; line-height: 1.6; }
        ul, ol { margin: 0 0 16px 0; padding-left: 2em; }
        li { margin-bottom: 8px; }
        code {
            background-color: ${isDark ? '#161b22' : '#f6f8fa'};
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 12px;
        }
        pre {
            background-color: ${isDark ? '#0d1117' : '#f6f8fa'};
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 0 0 16px 0;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid ${isDark ? '#30363d' : '#d0d7de'};
            padding: 0 1em;
            color: ${isDark ? '#8b949e' : '#57606a'};
            margin: 0 0 16px 0;
        }
        a {
            color: ${isDark ? '#58a6ff' : '#0969da'};
            text-decoration: none;
        }
        a:hover { text-decoration: underline; }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 0 0 16px 0;
        }
        th, td {
            border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: ${isDark ? '#161b22' : '#f6f8fa'};
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        ${tocHtml}
        <div class="content">
            ${contentHtml}
        </div>
    </div>
</body>
</html>`;
            
            const filename = `github-${theme}.html`;
            const filepath = path.join(htmlDir, filename);
            fs.writeFileSync(filepath, htmlContent);
            
            console.log(`✅ ${filename}`);
        } catch (error) {
            console.log(`❌ github-${theme}.html - ${error.message}`);
        }
    }
    
    console.log('\n✨ Done!\n');
    console.log(`📁 PDFs: ${pdfDir}`);
    console.log(`📁 HTMLs: ${htmlDir}\n`);
}

// Run
exportAll().catch(console.error);
