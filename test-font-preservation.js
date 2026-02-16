/**
 * Font Preservation Test for Puppeteer PDF Export
 * 
 * This test verifies that fonts are properly loaded and preserved in PDF generation.
 * 
 * Run: node test-font-preservation.js
 * 
 * Prerequisites:
 * - PDF server must be running (node pdf-server.js)
 * - npm install puppeteer
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
    serverUrl: 'http://localhost:3000',
    outputDir: './test-results',
    testHtmlFile: './test-font-preservation-sample.html'
};

// ANSI color codes for terminal output
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

// Create test HTML with various fonts
function createTestHtml() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* Import Google Font - Inter */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        /* Import another Google Font - Roboto Mono */
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
        
        body {
            margin: 40px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        }
        
        .test-section {
            margin-bottom: 30px;
            padding: 20px;
            border: 2px solid #ddd;
            border-radius: 8px;
        }
        
        .font-inter {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        }
        
        .font-roboto-mono {
            font-family: 'Roboto Mono', 'Courier New', Courier, monospace;
        }
        
        .font-system {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        }
        
        .font-generic {
            font-family: Helvetica, Arial, sans-serif;
        }
        
        h1 { font-size: 24px; margin: 0 0 10px 0; }
        h2 { font-size: 18px; margin: 0 0 8px 0; }
        p { margin: 5px 0; line-height: 1.6; }
        .font-name { color: #666; font-size: 12px; font-style: italic; }
        .test-text { font-size: 14px; }
        .test-text-bold { font-size: 14px; font-weight: 700; }
        .test-text-large { font-size: 20px; }
    </style>
</head>
<body>
    <h1>Font Preservation Test Document</h1>
    <p style="color: #666; margin-bottom: 30px;">This document tests various font scenarios for PDF export</p>
    
    <div class="test-section font-inter">
        <h2>Test 1: Google Font - Inter</h2>
        <p class="font-name">Font: 'Inter' (Web Font from Google Fonts)</p>
        <p class="test-text">Regular weight: The quick brown fox jumps over the lazy dog. 0123456789</p>
        <p class="test-text-bold">Bold weight: The quick brown fox jumps over the lazy dog. 0123456789</p>
        <p class="test-text-large">Large size: The quick brown fox jumps over the lazy dog.</p>
    </div>
    
    <div class="test-section font-roboto-mono">
        <h2>Test 2: Google Font - Roboto Mono</h2>
        <p class="font-name">Font: 'Roboto Mono' (Monospace Web Font from Google Fonts)</p>
        <p class="test-text">Regular weight: The quick brown fox jumps over the lazy dog. 0123456789</p>
        <p class="test-text-bold">Bold weight: The quick brown fox jumps over the lazy dog. 0123456789</p>
        <p class="test-text-large">Large size: function test() { return true; }</p>
    </div>
    
    <div class="test-section font-system">
        <h2>Test 3: System Font Stack</h2>
        <p class="font-name">Font: -apple-system, BlinkMacSystemFont, 'Segoe UI', etc.</p>
        <p class="test-text">Regular weight: The quick brown fox jumps over the lazy dog. 0123456789</p>
        <p class="test-text-bold">Bold weight: The quick brown fox jumps over the lazy dog. 0123456789</p>
        <p class="test-text-large">Large size: The quick brown fox jumps over the lazy dog.</p>
    </div>
    
    <div class="test-section font-generic">
        <h2>Test 4: Generic Fonts (Helvetica/Arial)</h2>
        <p class="font-name">Font: Helvetica, Arial, sans-serif</p>
        <p class="test-text">Regular weight: The quick brown fox jumps over the lazy dog. 0123456789</p>
        <p class="test-text-bold">Bold weight: The quick brown fox jumps over the lazy dog. 0123456789</p>
        <p class="test-text-large">Large size: The quick brown fox jumps over the lazy dog.</p>
    </div>
    
    <div class="test-section" style="background: #f0f0f0;">
        <h2>Test 5: Mixed Fonts in Same Section</h2>
        <p class="font-inter test-text">This paragraph uses Inter font.</p>
        <p class="font-roboto-mono test-text">This paragraph uses Roboto Mono font.</p>
        <p class="font-system test-text">This paragraph uses system font stack.</p>
        <p class="font-generic test-text">This paragraph uses generic Helvetica/Arial.</p>
    </div>
</body>
</html>`;
}

// Test 1: Check if fonts are loaded in browser
async function testFontLoadingInBrowser() {
    logSection('TEST 1: Font Loading in Browser');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    const html = createTestHtml();
    
    log('Loading HTML with web fonts...', 'cyan');
    await page.setContent(html, {
        waitUntil: 'domcontentloaded' // Current implementation
    });
    
    log('Checking font loading status (domcontentloaded)...', 'cyan');
    
    // Check document.fonts API
    const fontsBeforeWait = await page.evaluate(() => {
        return {
            size: document.fonts.size,
            status: document.fonts.status,
            loaded: Array.from(document.fonts).map(f => ({
                family: f.family,
                status: f.status,
                loaded: f.status === 'loaded'
            }))
        };
    });
    
    log(`Fonts in document: ${fontsBeforeWait.size}`, 'yellow');
    log(`Font loading status: ${fontsBeforeWait.status}`, 'yellow');
    
    if (fontsBeforeWait.loaded.length > 0) {
        fontsBeforeWait.loaded.forEach(font => {
            const statusColor = font.loaded ? 'green' : 'red';
            log(`  - ${font.family}: ${font.status}`, statusColor);
        });
    } else {
        log('  No fonts detected in document.fonts API', 'yellow');
    }
    
    // Now wait for fonts to load
    log('\nWaiting for fonts to load...', 'cyan');
    await page.evaluate(() => document.fonts.ready);
    
    const fontsAfterWait = await page.evaluate(() => {
        return {
            size: document.fonts.size,
            status: document.fonts.status,
            loaded: Array.from(document.fonts).map(f => ({
                family: f.family,
                status: f.status,
                loaded: f.status === 'loaded'
            }))
        };
    });
    
    log(`\nAfter waiting for fonts.ready:`, 'cyan');
    log(`Fonts in document: ${fontsAfterWait.size}`, 'yellow');
    log(`Font loading status: ${fontsAfterWait.status}`, 'yellow');
    
    if (fontsAfterWait.loaded.length > 0) {
        fontsAfterWait.loaded.forEach(font => {
            const statusColor = font.loaded ? 'green' : 'red';
            log(`  - ${font.family}: ${font.status}`, statusColor);
        });
    }
    
    await browser.close();
    
    return {
        before: fontsBeforeWait,
        after: fontsAfterWait
    };
}

// Test 2: Compare PDF generation with and without font waiting
async function testPdfGeneration() {
    logSection('TEST 2: PDF Generation Comparison');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const html = createTestHtml();
    
    // Ensure output directory exists
    if (!fs.existsSync(TEST_CONFIG.outputDir)) {
        fs.mkdirSync(TEST_CONFIG.outputDir, { recursive: true });
    }
    
    // Test A: Without waiting for fonts (current implementation)
    log('Test A: Generating PDF WITHOUT waiting for fonts...', 'cyan');
    const pageA = await browser.newPage();
    await pageA.setContent(html, { waitUntil: 'domcontentloaded' });
    
    const pdfPathA = path.join(TEST_CONFIG.outputDir, 'test-pdf-no-font-wait.pdf');
    await pageA.pdf({
        path: pdfPathA,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        }
    });
    
    const sizeA = fs.statSync(pdfPathA).size;
    log(`✓ PDF generated: ${pdfPathA}`, 'green');
    log(`  File size: ${(sizeA / 1024).toFixed(2)} KB`, 'yellow');
    
    await pageA.close();
    
    // Test B: With waiting for fonts (proposed fix)
    log('\nTest B: Generating PDF WITH waiting for fonts...', 'cyan');
    const pageB = await browser.newPage();
    await pageB.setContent(html, { waitUntil: 'domcontentloaded' });
    
    // Wait for fonts to load
    await pageB.evaluate(() => document.fonts.ready);
    
    // Additional small delay to ensure rendering is complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const pdfPathB = path.join(TEST_CONFIG.outputDir, 'test-pdf-with-font-wait.pdf');
    await pageB.pdf({
        path: pdfPathB,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        }
    });
    
    const sizeB = fs.statSync(pdfPathB).size;
    log(`✓ PDF generated: ${pdfPathB}`, 'green');
    log(`  File size: ${(sizeB / 1024).toFixed(2)} KB`, 'yellow');
    
    await pageB.close();
    await browser.close();
    
    // Compare file sizes
    log('\nComparison:', 'bold');
    log(`Without font wait: ${(sizeA / 1024).toFixed(2)} KB`, 'yellow');
    log(`With font wait:    ${(sizeB / 1024).toFixed(2)} KB`, 'yellow');
    
    const difference = sizeB - sizeA;
    const percentDiff = ((difference / sizeA) * 100).toFixed(2);
    
    if (difference > 0) {
        log(`Difference: +${(difference / 1024).toFixed(2)} KB (+${percentDiff}%)`, 'green');
        log('✓ PDF with font waiting is larger (likely includes embedded fonts)', 'green');
    } else if (difference < 0) {
        log(`Difference: ${(difference / 1024).toFixed(2)} KB (${percentDiff}%)`, 'red');
        log('⚠ PDF with font waiting is smaller (unexpected)', 'red');
    } else {
        log('Difference: 0 KB (0%)', 'yellow');
        log('⚠ No size difference detected', 'yellow');
    }
    
    return {
        withoutWait: { path: pdfPathA, size: sizeA },
        withWait: { path: pdfPathB, size: sizeB },
        difference,
        percentDiff
    };
}

// Test 3: Test with actual DocMark content
async function testWithDocMarkContent() {
    logSection('TEST 3: DocMark Content Test');
    
    log('This test would use actual DocMark HTML export...', 'cyan');
    log('Skipping for now - requires actual exported HTML file', 'yellow');
    
    // TODO: Implement when we have a sample DocMark export
    return null;
}

// Main test runner
async function runAllTests() {
    console.clear();
    log('╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║     Font Preservation Test Suite for Puppeteer PDF        ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');
    
    const results = {
        fontLoading: null,
        pdfGeneration: null,
        docMarkContent: null
    };
    
    try {
        // Test 1: Font loading
        results.fontLoading = await testFontLoadingInBrowser();
        
        // Test 2: PDF generation comparison
        results.pdfGeneration = await testPdfGeneration();
        
        // Test 3: DocMark content (optional)
        // results.docMarkContent = await testWithDocMarkContent();
        
        // Final summary
        logSection('TEST SUMMARY');
        
        log('Font Loading Test:', 'bold');
        if (results.fontLoading) {
            const beforeLoaded = results.fontLoading.before.loaded.filter(f => f.loaded).length;
            const afterLoaded = results.fontLoading.after.loaded.filter(f => f.loaded).length;
            log(`  Before wait: ${beforeLoaded}/${results.fontLoading.before.size} fonts loaded`, 'yellow');
            log(`  After wait:  ${afterLoaded}/${results.fontLoading.after.size} fonts loaded`, 'yellow');
            
            if (afterLoaded > beforeLoaded) {
                log(`  ✓ Waiting for fonts.ready loads ${afterLoaded - beforeLoaded} additional fonts`, 'green');
            } else if (afterLoaded === beforeLoaded && afterLoaded > 0) {
                log(`  ✓ All fonts were already loaded`, 'green');
            } else {
                log(`  ⚠ No improvement detected`, 'yellow');
            }
        }
        
        log('\nPDF Generation Test:', 'bold');
        if (results.pdfGeneration) {
            log(`  Without font wait: ${results.pdfGeneration.withoutWait.path}`, 'yellow');
            log(`  With font wait:    ${results.pdfGeneration.withWait.path}`, 'yellow');
            
            if (results.pdfGeneration.difference > 1000) {
                log(`  ✓ Significant size increase suggests font embedding`, 'green');
            } else {
                log(`  ⚠ Minimal size difference - fonts may not be embedding`, 'yellow');
            }
        }
        
        logSection('RECOMMENDATIONS');
        
        log('Based on test results:', 'bold');
        log('1. Add await page.evaluate(() => document.fonts.ready) before PDF generation', 'cyan');
        log('2. Consider adding a small delay (100-200ms) after font loading', 'cyan');
        log('3. Test with actual DocMark exports to verify real-world behavior', 'cyan');
        log('4. Monitor PDF file sizes - embedded fonts should increase size', 'cyan');
        
        log('\n✓ All tests completed successfully', 'green');
        
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
    testFontLoadingInBrowser,
    testPdfGeneration,
    createTestHtml
}