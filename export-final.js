/**
 * FINAL Working Export Script
 * Properly enables TOC and exports all styles
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const APP_URL = 'http://localhost:5173';
const DOWNLOADS_DIR = path.join(require('os').homedir(), 'Downloads');
const OUTPUT_DIR = path.join(__dirname, 'test-exports-final');
const PDF_DIR = path.join(OUTPUT_DIR, 'pdf-exports');
const HTML_DIR = path.join(OUTPUT_DIR, 'html-exports');

const STYLES = ['github', 'gitbook', 'vscode', 'medium', 'minimal', 'notion', 'latex', 'typewriter'];

const MARKDOWN_CONTENT = `# Introduction to Markdown

This is a comprehensive guide to Markdown syntax and usage.

## Getting Started

Markdown is a lightweight markup language.

### Why Use Markdown?

Markdown is easy to read and write.

#### Key Benefits

- Simple syntax
- Easy to learn
- Widely supported

## Text Formatting

You can make text **bold** or *italic*.

## Code Blocks

\`\`\`javascript
function hello() {
  console.log('Hello!');
}
\`\`\`

## Tables

| Feature | Support |
|---------|---------|
| Headers | Yes |
| Rows | Yes |

## Conclusion

Markdown is powerful and simple.
`;

// Create output dir
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true });
if (!fs.existsSync(HTML_DIR)) fs.mkdirSync(HTML_DIR, { recursive: true });

async function exportAll() {
    console.log('🚀 FINAL Export Script\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 }
    });

    try {
        const page = await browser.newPage();
        
        // Auto-dismiss alerts
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        console.log('📖 Loading app...');
        await page.goto(APP_URL, { waitUntil: 'networkidle0' });
        await page.waitForSelector('.monaco-editor');
        console.log('✅ Loaded\n');

        // Insert content
        console.log('📝 Inserting content...');
        await page.evaluate((content) => {
            const editor = window.monaco?.editor?.getEditors()[0];
            if (editor) editor.setValue(content);
        }, MARKDOWN_CONTENT);
        await new Promise(r => setTimeout(r, 1500));
        console.log('✅ Content inserted\n');

        // Enable TOC - set localStorage directly to ensure it's enabled
        console.log('📑 Enabling TOC...');
        await page.evaluate(() => {
            // Set TOC enabled in localStorage
            localStorage.setItem('com.markdownlivepreview.toc_settings', 'true');
            
            // Click button to activate UI
            const tocButton = document.querySelector('#toc-toggle-btn');
            if (tocButton && !tocButton.classList.contains('active')) {
                tocButton.click();
            }
        });
        await new Promise(r => setTimeout(r, 500));
        
        // Verify it's active
        let isActive = await page.evaluate(() => {
            return document.querySelector('#toc-toggle-btn')?.classList.contains('active');
        });
        
        console.log(isActive ? '✅ TOC enabled\n' : '⚠️  TOC may not be enabled\n');

        // Track files before export
        const getLatestPDF = () => {
            const files = fs.readdirSync(DOWNLOADS_DIR)
                .filter(f => f.startsWith('DocMark_') && f.endsWith('.pdf'))
                .map(f => ({
                    name: f,
                    path: path.join(DOWNLOADS_DIR, f),
                    time: fs.statSync(path.join(DOWNLOADS_DIR, f)).mtimeMs
                }))
                .sort((a, b) => b.time - a.time);
            return files[0];
        };

        console.log('📊 Exporting PDFs...\n');
        
        for (const style of STYLES) {
            try {
                console.log(`  ${style}...`);
                
                // Select style
                await page.select('#style-selector', style);
                await new Promise(r => setTimeout(r, 2000));
                
                // Ensure TOC is still enabled
                await page.evaluate(() => {
                    localStorage.setItem('com.markdownlivepreview.toc_settings', 'true');
                    const tocButton = document.querySelector('#toc-toggle-btn');
                    if (tocButton && !tocButton.classList.contains('active')) {
                        tocButton.click();
                    }
                });
                await new Promise(r => setTimeout(r, 500));
                
                // Get file before export
                const before = getLatestPDF();
                
                // Click export
                await page.click('#export-pdf-button');
                
                // Wait for new file
                let newFile = null;
                for (let i = 0; i < 60; i++) {
                    await new Promise(r => setTimeout(r, 500));
                    const after = getLatestPDF();
                    if (!before || after.time > before.time) {
                        newFile = after;
                        break;
                    }
                }
                
                if (newFile) {
                    // Copy to our folder with style name
                    const destPath = path.join(PDF_DIR, `${style}.pdf`);
                    fs.copyFileSync(newFile.path, destPath);
                    const sizeKB = (fs.statSync(destPath).size / 1024).toFixed(2);
                    console.log(`  ✅ ${style}.pdf (${sizeKB} KB)`);
                } else {
                    console.log(`  ❌ Timeout`);
                }
                
            } catch (error) {
                console.log(`  ❌ ${error.message}`);
            }
        }

        console.log('\n✨ Done!\n');

    } finally {
        await browser.close();
    }
    
    // Export HTMLs
    console.log('🌐 Exporting HTMLs...\n');
    
    const browser2 = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    try {
        const page = await browser2.newPage();
        
        // Auto-dismiss alerts
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        await page.goto(APP_URL, { waitUntil: 'networkidle0' });
        await page.waitForSelector('.monaco-editor');

        // Insert content
        await page.evaluate((content) => {
            const editor = window.monaco?.editor?.getEditors()[0];
            if (editor) editor.setValue(content);
        }, MARKDOWN_CONTENT);
        await new Promise(r => setTimeout(r, 1500));

        // Enable TOC
        await page.evaluate(() => {
            localStorage.setItem('com.markdownlivepreview.toc_settings', 'true');
            const tocButton = document.querySelector('#toc-toggle-btn');
            if (tocButton && !tocButton.classList.contains('active')) {
                tocButton.click();
            }
        });
        await new Promise(r => setTimeout(r, 500));

        const themes = ['light', 'dark'];
        
        for (const theme of themes) {
            try {
                console.log(`  github-${theme}...`);
                
                // Set theme
                const currentTheme = await page.evaluate(() => {
                    return document.documentElement.getAttribute('data-theme');
                });
                
                if (currentTheme !== theme) {
                    // Click theme checkbox in settings
                    await page.evaluate(() => {
                        const checkbox = document.querySelector('#theme-checkbox');
                        if (checkbox) checkbox.click();
                    });
                    await new Promise(r => setTimeout(r, 1000));
                }
                
                // Select GitHub style
                await page.select('#style-selector', 'github');
                await new Promise(r => setTimeout(r, 1000));
                
                // Ensure TOC is enabled
                await page.evaluate(() => {
                    localStorage.setItem('com.markdownlivepreview.toc_settings', 'true');
                    const tocButton = document.querySelector('#toc-toggle-btn');
                    if (tocButton && !tocButton.classList.contains('active')) {
                        tocButton.click();
                    }
                });
                await new Promise(r => setTimeout(r, 500));
                
                // Get file before export
                const getLatestHTML = () => {
                    const files = fs.readdirSync(DOWNLOADS_DIR)
                        .filter(f => f.startsWith('DocMark_') && f.endsWith('.html'))
                        .map(f => ({
                            name: f,
                            path: path.join(DOWNLOADS_DIR, f),
                            time: fs.statSync(path.join(DOWNLOADS_DIR, f)).mtimeMs
                        }))
                        .sort((a, b) => b.time - a.time);
                    return files[0];
                };
                
                const before = getLatestHTML();
                
                // Click export
                await page.click('#export-html-button');
                
                // Wait for new file
                let newFile = null;
                for (let i = 0; i < 40; i++) {
                    await new Promise(r => setTimeout(r, 500));
                    const after = getLatestHTML();
                    if (!before || after.time > before.time) {
                        newFile = after;
                        break;
                    }
                }
                
                if (newFile) {
                    // Copy to our folder
                    const destPath = path.join(HTML_DIR, `github-${theme}.html`);
                    fs.copyFileSync(newFile.path, destPath);
                    const sizeKB = (fs.statSync(destPath).size / 1024).toFixed(2);
                    console.log(`  ✅ github-${theme}.html (${sizeKB} KB)`);
                } else {
                    console.log(`  ❌ Timeout`);
                }
                
            } catch (error) {
                console.log(`  ❌ ${error.message}`);
            }
        }

        console.log('\n✨ HTML export complete!\n');

    } finally {
        await browser2.close();
    }
    
    // List results
    console.log('📋 Exported Files:\n');
    
    console.log('PDFs:');
    const pdfFiles = fs.readdirSync(PDF_DIR);
    pdfFiles.forEach(f => {
        const stats = fs.statSync(path.join(PDF_DIR, f));
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  ${f.padEnd(20)} ${sizeKB.padStart(8)} KB`);
    });
    
    console.log('\nHTMLs:');
    const htmlFiles = fs.readdirSync(HTML_DIR);
    htmlFiles.forEach(f => {
        const stats = fs.statSync(path.join(HTML_DIR, f));
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  ${f.padEnd(20)} ${sizeKB.padStart(8)} KB`);
    });
    
    console.log(`\n📁 PDFs: ${PDF_DIR}`);
    console.log(`📁 HTMLs: ${HTML_DIR}\n`);
}

(async () => {
    try {
        const isRunning = await fetch(APP_URL).then(() => true).catch(() => false);
        if (!isRunning) {
            console.error('❌ App not running at', APP_URL);
            process.exit(1);
        }
        await exportAll();
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
})();
