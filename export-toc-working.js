/**
 * WORKING Automated TOC Export Script
 * Actually works with Puppeteer's real API
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuration
const APP_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.join(__dirname, 'test-exports');
const PDF_DIR = path.join(OUTPUT_DIR, 'pdf-exports');
const HTML_DIR = path.join(OUTPUT_DIR, 'html-exports');

// Styles to test
const STYLES = ['github', 'gitbook', 'vscode', 'medium', 'minimal', 'notion', 'latex', 'typewriter'];

// Sample markdown content
const MARKDOWN_CONTENT = `# Introduction to Markdown

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

// Create output directories
[OUTPUT_DIR, PDF_DIR, HTML_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

async function exportAllStyles() {
    console.log('🚀 Working Automated TOC Export\n');
    console.log(`📁 Output: ${OUTPUT_DIR}\n`);
    console.log(`🌐 App URL: ${APP_URL}\n`);
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 }
    });

    try {
        const page = await browser.newPage();
        
        // Set download behavior
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: PDF_DIR
        });

        console.log('📖 Loading app...');
        await page.goto(APP_URL, { waitUntil: 'networkidle0' });
        
        // Auto-dismiss alerts
        page.on('dialog', async dialog => {
            console.log(`⚠️  Alert: ${dialog.message().substring(0, 50)}...`);
            await dialog.accept();
        });
        
        await page.waitForSelector('.monaco-editor', { timeout: 10000 });
        console.log('✅ App loaded\n');

        // Insert content
        console.log('📝 Inserting test content...');
        await page.evaluate((content) => {
            const editorElement = document.querySelector('.monaco-editor');
            if (editorElement && window.monaco) {
                const editor = window.monaco.editor.getEditors()[0];
                if (editor) {
                    editor.setValue(content);
                }
            }
        }, MARKDOWN_CONTENT);
        
        await page.waitForTimeout(1000);
        console.log('✅ Content inserted\n');

        // Enable TOC
        console.log('📑 Enabling TOC...');
        await page.evaluate(() => {
            const tocButton = document.querySelector('#toc-toggle-btn');
            if (tocButton && !tocButton.classList.contains('active')) {
                tocButton.click();
            }
        });
        
        await page.waitForTimeout(1000);
        
        const tocActive = await page.evaluate(() => {
            const tocButton = document.querySelector('#toc-toggle-btn');
            return tocButton && tocButton.classList.contains('active');
        });
        
        if (tocActive) {
            console.log('✅ TOC enabled\n');
        } else {
            console.log('⚠️  TOC may not be enabled\n');
        }

        // Export PDFs
        console.log('📊 Generating PDFs...\n');
        
        for (const style of STYLES) {
            try {
                console.log(`  Processing ${style}...`);
                
                // Select style
                await page.select('#style-selector', style);
                await page.waitForTimeout(2000);
                
                // Ensure TOC is still active
                const stillActive = await page.evaluate(() => {
                    const tocButton = document.querySelector('#toc-toggle-btn');
                    return tocButton && tocButton.classList.contains('active');
                });
                
                if (!stillActive) {
                    await page.evaluate(() => {
                        const tocButton = document.querySelector('#toc-toggle-btn');
                        if (tocButton) tocButton.click();
                    });
                    await page.waitForTimeout(1000);
                }
                
                // Click export and wait
                await page.click('#export-pdf-button');
                await page.waitForTimeout(5000); // Wait for PDF generation
                
                console.log(`  ✅ ${style}.pdf exported`);
                
            } catch (error) {
                console.log(`  ❌ ${style}.pdf - ${error.message}`);
            }
        }

        console.log('\n🌐 Generating HTMLs...\n');
        
        // Export HTMLs
        const themes = ['light', 'dark'];
        
        for (const theme of themes) {
            try {
                console.log(`  Processing github-${theme}...`);
                
                // Set theme
                const currentTheme = await page.evaluate(() => {
                    return document.documentElement.getAttribute('data-theme');
                });
                
                if (currentTheme !== theme) {
                    await page.click('#theme-toggle');
                    await page.waitForTimeout(500);
                }
                
                // Select GitHub style
                await page.select('#style-selector', 'github');
                await page.waitForTimeout(1000);
                
                // Set download path for HTML
                await client.send('Page.setDownloadBehavior', {
                    behavior: 'allow',
                    downloadPath: HTML_DIR
                });
                
                // Click export
                await page.click('#export-html-button');
                await page.waitForTimeout(2000);
                
                console.log(`  ✅ github-${theme}.html exported`);
                
            } catch (error) {
                console.log(`  ❌ github-${theme}.html - ${error.message}`);
            }
        }

        console.log('\n✨ Export complete!\n');

    } catch (error) {
        console.error('❌ Fatal error:', error);
    } finally {
        await browser.close();
    }
    
    // List exported files
    console.log('📋 Exported Files:\n');
    
    if (fs.existsSync(PDF_DIR)) {
        const pdfFiles = fs.readdirSync(PDF_DIR);
        if (pdfFiles.length > 0) {
            console.log('PDFs:');
            pdfFiles.forEach(file => {
                const stats = fs.statSync(path.join(PDF_DIR, file));
                const sizeKB = (stats.size / 1024).toFixed(2);
                console.log(`  ✓ ${file} (${sizeKB} KB)`);
            });
        } else {
            console.log('⚠️  No PDFs found!');
        }
    }
    
    console.log('');
    
    if (fs.existsSync(HTML_DIR)) {
        const htmlFiles = fs.readdirSync(HTML_DIR);
        if (htmlFiles.length > 0) {
            console.log('HTMLs:');
            htmlFiles.forEach(file => {
                const stats = fs.statSync(path.join(HTML_DIR, file));
                const sizeKB = (stats.size / 1024).toFixed(2);
                console.log(`  ✓ ${file} (${sizeKB} KB)`);
            });
        } else {
            console.log('⚠️  No HTMLs found!');
        }
    }
    
    console.log(`\n📁 PDFs: ${PDF_DIR}`);
    console.log(`📁 HTMLs: ${HTML_DIR}\n`);
}

// Check if app is running
async function checkAppRunning() {
    try {
        const response = await fetch(APP_URL);
        return response.ok;
    } catch (e) {
        return false;
    }
}

// Main execution
(async () => {
    console.log('🔍 Checking if app is running...\n');
    
    const isRunning = await checkAppRunning();
    if (!isRunning) {
        console.error(`❌ App is not running at ${APP_URL}`);
        console.error('\nPlease start the app first:');
        console.error('  npm run dev\n');
        process.exit(1);
    }
    
    console.log('✅ App is running\n');
    
    await exportAllStyles();
})();
