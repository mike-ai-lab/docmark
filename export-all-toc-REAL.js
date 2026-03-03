/**
 * REAL Automated TOC Export Script
 * Uses Puppeteer to automate the actual app and export PDFs/HTMLs
 * This actually clicks buttons and uses the real export functions
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuration
const APP_URL = 'http://localhost:5173'; // Your Vite dev server
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

async function waitForDownload(downloadPath, timeout = 30000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        if (fs.existsSync(downloadPath) && !downloadPath.endsWith('.crdownload')) {
            // Wait a bit more to ensure file is fully written
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
}

async function exportAllStyles() {
    console.log('🚀 Real Automated TOC Export\n');
    console.log(`📁 Output: ${OUTPUT_DIR}\n`);
    console.log(`🌐 App URL: ${APP_URL}\n`);
    
    const browser = await puppeteer.launch({
        headless: false, // Set to true for production
        defaultViewport: { width: 1920, height: 1080 }
    });

    try {
        const page = await browser.newPage();
        
        // Enable downloads with proper naming
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: PDF_DIR
        });

        console.log('📖 Loading app...');
        await page.goto(APP_URL, { waitUntil: 'networkidle0' });
        
        // Automatically dismiss any alert dialogs (like PDF server warning)
        page.on('dialog', async dialog => {
            console.log(`⚠️  Alert detected: ${dialog.message().substring(0, 50)}...`);
            await dialog.accept();
            console.log('✅ Alert dismissed automatically');
        });
        
        // Wait for Monaco editor to load
        await page.waitForSelector('.monaco-editor', { timeout: 10000 });
        console.log('✅ App loaded\n');

        // Clear editor and insert test content
        console.log('📝 Inserting test content...');
        await page.evaluate((content) => {
            // Access Monaco editor instance
            const editorElement = document.querySelector('.monaco-editor');
            if (editorElement && window.monaco) {
                const editor = window.monaco.editor.getEditors()[0];
                if (editor) {
                    editor.setValue(content);
                }
            }
        }, MARKDOWN_CONTENT);
        
        // Wait for preview to render
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Content inserted\n');

        // Enable TOC by setting the JavaScript variable directly
        console.log('📑 Enabling TOC...');
        
        await page.evaluate(() => {
            // Find the init function scope and set tocEnabled
            // The variable is in the init() closure, so we need to click the button
            const tocButton = document.querySelector('#toc-toggle-btn');
            if (tocButton && !tocButton.classList.contains('active')) {
                tocButton.click();
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify TOC is enabled by checking button state
        const tocActive = await page.evaluate(() => {
            const tocButton = document.querySelector('#toc-toggle-btn');
            return tocButton && tocButton.classList.contains('active');
        });
        
        if (tocActive) {
            console.log('✅ TOC enabled (button is active)\n');
        } else {
            console.log('⚠️  TOC button not active, trying again...');
            await page.evaluate(() => {
                const tocButton = document.querySelector('#toc-toggle-btn');
                if (tocButton) tocButton.click();
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('✅ TOC toggle attempted\n');
        }

        // Export PDFs for each style
        console.log('📊 Generating PDFs...\n');
        
        for (const style of STYLES) {
            try {
                console.log(`  Processing ${style}...`);
                
                // Select style from dropdown
                await page.select('#style-selector', style);
                await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for style to apply
                
                // Verify TOC button is still active
                const tocActive = await page.evaluate(() => {
                    const tocButton = document.querySelector('#toc-toggle-btn');
                    return tocButton && tocButton.classList.contains('active');
                });
                
                if (!tocActive) {
                    console.log(`  ⚠️  TOC not active for ${style}, re-enabling...`);
                    await page.evaluate(() => {
                        const tocButton = document.querySelector('#toc-toggle-btn');
                        if (tocButton) tocButton.click();
                    });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
                // Click export PDF button and wait for download
                const exportButton = await page.$('#export-pdf-button');
                if (!exportButton) {
                    console.log(`  ❌ Export button not found`);
                    continue;
                }
                
                // Wait for download using page event
                const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
                
                await exportButton.click();
                
                const download = await downloadPromise;
                
                // Wait for download to finish
                await download.path();
                
                console.log(`  ✅ ${style}.pdf exported`);
                
            } catch (error) {
                console.log(`  ❌ ${style}.pdf - ${error.message}`);
            }
        }

        console.log('\n🌐 Generating HTMLs...\n');
        
        // Export HTML for light and dark themes
        const themes = ['light', 'dark'];
        
        for (const theme of themes) {
            try {
                console.log(`  Processing github-${theme}...`);
                
                // Set theme
                const themeToggle = await page.$('#theme-toggle');
                if (themeToggle) {
                    const currentTheme = await page.evaluate(() => {
                        return document.documentElement.getAttribute('data-theme');
                    });
                    
                    if (currentTheme !== theme) {
                        await themeToggle.click();
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
                
                // Select GitHub style
                await page.select('#style-selector', 'github');
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Click export HTML button and wait for download
                const exportHtmlButton = await page.$('#export-html-button');
                if (exportHtmlButton) {
                    // Set download path for HTML
                    await client.send('Page.setDownloadBehavior', {
                        behavior: 'allow',
                        downloadPath: HTML_DIR
                    });
                    
                    // Wait for download
                    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
                    
                    await exportHtmlButton.click();
                    
                    const download = await downloadPromise;
                    await download.path();
                    
                    console.log(`  ✅ github-${theme}.html exported`);
                }
                
            } catch (error) {
                console.log(`  ❌ github-${theme}.html - ${error.message}`);
            }
        }

        console.log('\n✨ Done!\n');
        console.log(`📁 PDFs: ${PDF_DIR}`);
        console.log(`📁 HTMLs: ${HTML_DIR}\n`);
        
        // List exported files
        console.log('📋 Exported Files:\n');
        
        const pdfFiles = fs.readdirSync(PDF_DIR);
        if (pdfFiles.length > 0) {
            console.log('PDFs:');
            pdfFiles.forEach(file => {
                const stats = fs.statSync(path.join(PDF_DIR, file));
                const sizeKB = (stats.size / 1024).toFixed(2);
                console.log(`  ✓ ${file} (${sizeKB} KB)`);
            });
        } else {
            console.log('⚠️  No PDFs exported!');
        }
        
        console.log('');
        
        const htmlFiles = fs.readdirSync(HTML_DIR);
        if (htmlFiles.length > 0) {
            console.log('HTMLs:');
            htmlFiles.forEach(file => {
                const stats = fs.statSync(path.join(HTML_DIR, file));
                const sizeKB = (stats.size / 1024).toFixed(2);
                console.log(`  ✓ ${file} (${sizeKB} KB)`);
            });
        } else {
            console.log('⚠️  No HTMLs exported!');
        }
        
        console.log('\n💡 Tip: Open the PDFs to verify TOC is on the first page\n');

    } catch (error) {
        console.error('❌ Fatal error:', error);
    } finally {
        await browser.close();
    }
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
