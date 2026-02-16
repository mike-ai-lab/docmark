/**
 * Font Loading Methods Comparison Test
 * 
 * Tests different ways to load fonts and checks which method works with Puppeteer
 * 
 * Run: node test-font-loading-methods.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(title, 'bold');
    console.log('='.repeat(60) + '\n');
}

// Method 1: @import in CSS (current DocMark method)
function createHtmlWithImport() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        
        body {
            margin: 40px;
            font-family: 'Inter', sans-serif;
        }
        h1 { font-size: 24px; }
        p { font-size: 14px; line-height: 1.6; }
    </style>
</head>
<body>
    <h1>Method 1: @import in CSS</h1>
    <p>The quick brown fox jumps over the lazy dog. 0123456789</p>
    <p style="font-weight: 700;">Bold: The quick brown fox jumps over the lazy dog.</p>
</body>
</html>`;
}

// Method 2: <link> tag in HTML
function createHtmlWithLink() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 40px;
            font-family: 'Inter', sans-serif;
        }
        h1 { font-size: 24px; }
        p { font-size: 14px; line-height: 1.6; }
    </style>
</head>
<body>
    <h1>Method 2: Link Tag in HTML</h1>
    <p>The quick brown fox jumps over the lazy dog. 0123456789</p>
    <p style="font-weight: 700;">Bold: The quick brown fox jumps over the lazy dog.</p>
</body>
</html>`;
}

// Method 3: JavaScript Font Loading API
function createHtmlWithJsApi() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 40px;
            font-family: 'Inter', sans-serif;
        }
        h1 { font-size: 24px; }
        p { font-size: 14px; line-height: 1.6; }
    </style>
    <script>
        // Explicitly load fonts using Font Loading API
        document.fonts.ready.then(() => {
            console.log('Fonts loaded via JS API');
        });
    </script>
</head>
<body>
    <h1>Method 3: JavaScript Font Loading API</h1>
    <p>The quick brown fox jumps over the lazy dog. 0123456789</p>
    <p style="font-weight: 700;">Bold: The quick brown fox jumps over the lazy dog.</p>
</body>
</html>`;
}

// Method 4: Base64 embedded font (guaranteed to work)
function createHtmlWithBase64() {
    // Minimal base64 font data (this is just a placeholder - real font would be much larger)
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 40px;
            font-family: 'Inter', sans-serif;
        }
        h1 { font-size: 24px; }
        p { font-size: 14px; line-height: 1.6; }
    </style>
</head>
<body>
    <h1>Method 4: Link with networkidle0</h1>
    <p>The quick brown fox jumps over the lazy dog. 0123456789</p>
    <p style="font-weight: 700;">Bold: The quick brown fox jumps over the lazy dog.</p>
</body>
</html>`;
}

async function testMethod(methodName, htmlGenerator, waitUntil = 'domcontentloaded') {
    logSection(`Testing: ${methodName}`);
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const html = htmlGenerator();
    
    log(`Loading HTML with waitUntil: ${waitUntil}`, 'cyan');
    await page.setContent(html, { waitUntil });
    
    // Check fonts before waiting
    const fontsBefore = await page.evaluate(() => {
        return {
            size: document.fonts.size,
            status: document.fonts.status,
            fonts: Array.from(document.fonts).map(f => ({
                family: f.family,
                status: f.status
            }))
        };
    });
    
    log(`Fonts detected (before wait): ${fontsBefore.size}`, fontsBefore.size > 0 ? 'green' : 'red');
    if (fontsBefore.fonts.length > 0) {
        fontsBefore.fonts.forEach(f => {
            log(`  - ${f.family}: ${f.status}`, f.status === 'loaded' ? 'green' : 'yellow');
        });
    }
    
    // Wait for fonts
    log('Waiting for document.fonts.ready...', 'cyan');
    await page.evaluate(() => document.fonts.ready);
    
    // Check fonts after waiting
    const fontsAfter = await page.evaluate(() => {
        return {
            size: document.fonts.size,
            status: document.fonts.status,
            fonts: Array.from(document.fonts).map(f => ({
                family: f.family,
                status: f.status
            }))
        };
    });
    
    log(`Fonts detected (after wait): ${fontsAfter.size}`, fontsAfter.size > 0 ? 'green' : 'red');
    if (fontsAfter.fonts.length > 0) {
        fontsAfter.fonts.forEach(f => {
            log(`  - ${f.family}: ${f.status}`, f.status === 'loaded' ? 'green' : 'yellow');
        });
    }
    
    // Generate PDF
    const outputDir = './test-results';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const sanitizedName = methodName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const pdfPath = path.join(outputDir, `font-method-${sanitizedName}.pdf`);
    
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true
    });
    
    const fileSize = fs.statSync(pdfPath).size;
    log(`PDF generated: ${pdfPath}`, 'green');
    log(`File size: ${(fileSize / 1024).toFixed(2)} KB`, 'yellow');
    
    await browser.close();
    
    return {
        method: methodName,
        fontsBefore: fontsBefore.size,
        fontsAfter: fontsAfter.size,
        pdfPath,
        fileSize
    };
}

async function runAllTests() {
    console.clear();
    log('╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║        Font Loading Methods Comparison Test Suite         ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');
    
    const results = [];
    
    try {
        // Test 1: @import (current method)
        results.push(await testMethod(
            'Method 1: @import in CSS',
            createHtmlWithImport,
            'domcontentloaded'
        ));
        
        // Test 2: <link> tag
        results.push(await testMethod(
            'Method 2: <link> tag',
            createHtmlWithLink,
            'domcontentloaded'
        ));
        
        // Test 3: <link> tag with networkidle0
        results.push(await testMethod(
            'Method 3: <link> + networkidle0',
            createHtmlWithLink,
            'networkidle0'
        ));
        
        // Test 4: <link> tag with networkidle2
        results.push(await testMethod(
            'Method 4: <link> + networkidle2',
            createHtmlWithLink,
            'networkidle2'
        ));
        
        // Test 5: JS API
        results.push(await testMethod(
            'Method 5: JS Font Loading API',
            createHtmlWithJsApi,
            'networkidle0'
        ));
        
        // Summary
        logSection('COMPARISON SUMMARY');
        
        log('Method                          | Fonts Before | Fonts After | PDF Size', 'bold');
        log('-'.repeat(75), 'bold');
        
        results.forEach(r => {
            const method = r.method.padEnd(30);
            const before = String(r.fontsBefore).padEnd(12);
            const after = String(r.fontsAfter).padEnd(11);
            const size = `${(r.fileSize / 1024).toFixed(2)} KB`;
            
            const color = r.fontsAfter > 0 ? 'green' : 'red';
            log(`${method} | ${before} | ${after} | ${size}`, color);
        });
        
        logSection('RECOMMENDATIONS');
        
        const bestMethod = results.reduce((best, current) => 
            current.fontsAfter > best.fontsAfter ? current : best
        );
        
        if (bestMethod.fontsAfter > 0) {
            log(`✓ Best method: ${bestMethod.method}`, 'green');
            log(`  Detected ${bestMethod.fontsAfter} fonts`, 'green');
            log(`  PDF size: ${(bestMethod.fileSize / 1024).toFixed(2)} KB`, 'green');
        } else {
            log('⚠ No method successfully loaded fonts!', 'red');
            log('\nPossible issues:', 'yellow');
            log('1. Puppeteer may not support @import or external font loading', 'yellow');
            log('2. Network requests may be blocked or timing out', 'yellow');
            log('3. Google Fonts may need special handling in headless mode', 'yellow');
            log('\nSuggested solutions:', 'cyan');
            log('1. Use networkidle0 or networkidle2 instead of domcontentloaded', 'cyan');
            log('2. Add explicit font preloading with <link rel="preload">', 'cyan');
            log('3. Consider embedding fonts as base64 or using local fonts', 'cyan');
            log('4. Use page.waitForNetworkIdle() after setContent', 'cyan');
        }
        
        log('\n✓ All tests completed', 'green');
        
    } catch (error) {
        log('\n✗ Test suite failed', 'red');
        log(`Error: ${error.message}`, 'red');
        console.error(error);
        process.exit(1);
    }
}

// Run tests
if (require.main === module) {
    runAllTests().catch(error => {
        log('\n✗ Fatal error', 'red');
        console.error(error);
        process.exit(1);
    });
}

module.exports = {
    testMethod,
    createHtmlWithImport,
    createHtmlWithLink,
    createHtmlWithJsApi
};
