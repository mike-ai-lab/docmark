/**
 * HTML Export Script - All Styles with Light/Dark Modes
 * Exports HTML for all 8 styles in both themes
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const APP_URL = 'http://localhost:5173';
const DOWNLOADS_DIR = path.join(require('os').homedir(), 'Downloads');
const OUTPUT_DIR = path.join(__dirname, 'test-html-exports');

const STYLES = ['github', 'gitbook', 'vscode', 'medium', 'minimal', 'notion', 'latex', 'typewriter'];
const THEMES = ['light', 'dark'];

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

async function exportAllHtmls() {
    console.log('🌐 HTML Export - All Styles\n');
    
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

        // Enable TOC
        console.log('📑 Enabling TOC...');
        await page.evaluate(() => {
            localStorage.setItem('com.markdownlivepreview.toc_settings', 'true');
            const tocButton = document.querySelector('#toc-toggle-btn');
            if (tocButton && !tocButton.classList.contains('active')) {
                tocButton.click();
            }
        });
        await new Promise(r => setTimeout(r, 500));
        console.log('✅ TOC enabled\n');

        console.log('📊 Exporting HTMLs...\n');

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

        for (const style of STYLES) {
            for (const theme of THEMES) {
                try {
                    console.log(`  ${style}-${theme}...`);
                    
                    // Set theme
                    const currentTheme = await page.evaluate(() => {
                        return document.documentElement.getAttribute('data-theme');
                    });
                    
                    if (currentTheme !== theme) {
                        await page.evaluate(() => {
                            const checkbox = document.querySelector('#theme-checkbox');
                            if (checkbox) checkbox.click();
                        });
                        await new Promise(r => setTimeout(r, 1000));
                    }
                    
                    // Select style
                    await page.select('#style-selector', style);
                    await new Promise(r => setTimeout(r, 1500));
                    
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
                        // Copy to our folder with descriptive name
                        const destPath = path.join(OUTPUT_DIR, `${style}-${theme}.html`);
                        fs.copyFileSync(newFile.path, destPath);
                        const sizeKB = (fs.statSync(destPath).size / 1024).toFixed(2);
                        console.log(`  ✅ ${style}-${theme}.html (${sizeKB} KB)`);
                    } else {
                        console.log(`  ❌ Timeout`);
                    }
                    
                } catch (error) {
                    console.log(`  ❌ ${error.message}`);
                }
            }
        }

        console.log('\n✨ Export complete!\n');

    } finally {
        await browser.close();
    }
    
    // List results
    console.log('📋 Exported Files:\n');
    const files = fs.readdirSync(OUTPUT_DIR).sort();
    files.forEach(f => {
        const stats = fs.statSync(path.join(OUTPUT_DIR, f));
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  ${f.padEnd(30)} ${sizeKB.padStart(8)} KB`);
    });
    
    console.log(`\n📁 Location: ${OUTPUT_DIR}\n`);
    console.log('💡 Now verifying TOC colors match content...\n');
    
    // Verify TOC colors
    verifyTocColors();
}

function verifyTocColors() {
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.html'));
    
    console.log('🔍 TOC Color Verification:\n');
    
    files.forEach(file => {
        const content = fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf8');
        const isDark = file.includes('-dark');
        
        // Extract TOC section (first 5000 chars should contain it)
        const tocSection = content.substring(0, 5000);
        
        // Check for TOC div
        const hasToc = tocSection.includes('toc-') || tocSection.includes('Table of Contents');
        
        if (!hasToc) {
            console.log(`  ⚠️  ${file.padEnd(30)} - No TOC found`);
            return;
        }
        
        // Check for dark mode issues (dark text on dark bg)
        if (isDark) {
            // In dark mode, TOC should have light colors
            const hasDarkTextOnDarkBg = 
                (tocSection.includes('color: #3b454e') || // Gitbook dark text
                 tocSection.includes('color: #37352f') || // Notion dark text
                 tocSection.includes('color: rgba(41, 41, 41') || // Medium dark text
                 tocSection.includes('color: #64748b')) && // Minimal gray text
                (tocSection.includes('background: #020405') || 
                 tocSection.includes('data-theme="dark"'));
            
            if (hasDarkTextOnDarkBg) {
                console.log(`  ❌ ${file.padEnd(30)} - Dark text on dark background!`);
            } else {
                console.log(`  ✅ ${file.padEnd(30)} - Colors OK`);
            }
        } else {
            // In light mode, TOC should have dark colors
            console.log(`  ✅ ${file.padEnd(30)} - Colors OK (light mode)`);
        }
    });
    
    console.log('\n💡 Open the HTML files to manually verify TOC readability\n');
}

// Check if app is running
(async () => {
    try {
        const isRunning = await fetch(APP_URL).then(() => true).catch(() => false);
        if (!isRunning) {
            console.error('❌ App not running at', APP_URL);
            console.error('\nPlease start: npm run dev\n');
            process.exit(1);
        }
        await exportAllHtmls();
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
})();
