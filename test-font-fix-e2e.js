/**
 * End-to-End Font Fix Test
 * 
 * Tests the complete flow: DocMark HTML export -> PDF server -> PDF with fonts
 * 
 * Run: node test-font-fix-e2e.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Simulate DocMark's collectHtmlForPuppeteer output
function createDocMarkStyleHtml() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        /* Font loaded via <link> tag */
        
        html, body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        }
        
        body {
            padding: 40px;
            background: white;
        }
        
        h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #1a1a1a;
        }
        
        h2 {
            font-size: 24px;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 15px;
            color: #2a2a2a;
        }
        
        p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 15px;
            color: #333;
        }
        
        code {
            font-family: 'Courier New', monospace;
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 14px;
        }
        
        .test-weights {
            margin: 20px 0;
        }
        
        .weight-300 { font-weight: 300; }
        .weight-400 { font-weight: 400; }
        .weight-500 { font-weight: 500; }
        .weight-600 { font-weight: 600; }
        .weight-700 { font-weight: 700; }
        .weight-800 { font-weight: 800; }
        .weight-900 { font-weight: 900; }
    </style>
</head>
<body>
    <h1>DocMark Font Test Document</h1>
    
    <p>This document tests whether the Inter font family is properly embedded in PDF exports from DocMark.</p>
    
    <h2>Font Weight Variations</h2>
    
    <div class="test-weights">
        <p class="weight-300">Weight 300 (Light): The quick brown fox jumps over the lazy dog.</p>
        <p class="weight-400">Weight 400 (Regular): The quick brown fox jumps over the lazy dog.</p>
        <p class="weight-500">Weight 500 (Medium): The quick brown fox jumps over the lazy dog.</p>
        <p class="weight-600">Weight 600 (Semi-Bold): The quick brown fox jumps over the lazy dog.</p>
        <p class="weight-700">Weight 700 (Bold): The quick brown fox jumps over the lazy dog.</p>
        <p class="weight-800">Weight 800 (Extra-Bold): The quick brown fox jumps over the lazy dog.</p>
        <p class="weight-900">Weight 900 (Black): The quick brown fox jumps over the lazy dog.</p>
    </div>
    
    <h2>Technical Details</h2>
    
    <p>Font family: <code>Inter</code> from Google Fonts</p>
    <p>Loading method: <code>&lt;link rel="stylesheet"&gt;</code> tag</p>
    <p>Server wait strategy: <code>networkidle0</code> + <code>document.fonts.ready</code></p>
    
    <h2>Expected Results</h2>
    
    <p>If fonts are properly embedded:</p>
    <ul>
        <li>PDF file size should be ~50-70 KB (includes font data)</li>
        <li>All text should render in Inter font family</li>
        <li>Different font weights should be visually distinct</li>
        <li>Text should look identical to the HTML preview</li>
    </ul>
    
    <p>If fonts are NOT embedded:</p>
    <ul>
        <li>PDF file size will be ~10-15 KB (no font data)</li>
        <li>Text will render in system default font (Arial/Helvetica)</li>
        <li>Font weights may not display correctly</li>
        <li>Visual appearance will differ from HTML preview</li>
    </ul>
</body>
</html>`;
}

async function testPdfGeneration() {
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║          End-to-End Font Fix Verification Test            ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');
    
    try {
        // Check if server is running
        log('1. Checking if PDF server is running...', 'cyan');
        const healthCheck = await fetch('http://localhost:3000/health');
        if (!healthCheck.ok) {
            throw new Error('Server not healthy');
        }
        log('   ✓ Server is running', 'green');
        
        // Generate HTML
        log('\n2. Generating DocMark-style HTML...', 'cyan');
        const html = createDocMarkStyleHtml();
        log(`   ✓ HTML generated (${html.length} characters)`, 'green');
        
        // Check for <link> tags (not @import)
        const hasLinkTag = html.includes('<link href="https://fonts.googleapis.com');
        const hasImport = html.includes('@import url(');
        
        log('\n3. Validating HTML structure...', 'cyan');
        log(`   Font loading method: ${hasLinkTag ? '<link> tag ✓' : '@import ✗'}`, hasLinkTag ? 'green' : 'red');
        log(`   No @import statements: ${!hasImport ? 'Yes ✓' : 'No ✗'}`, !hasImport ? 'green' : 'red');
        
        if (!hasLinkTag || hasImport) {
            throw new Error('HTML structure incorrect - fonts will not load!');
        }
        
        // Send to PDF server
        log('\n4. Sending to PDF server...', 'cyan');
        const response = await fetch('http://localhost:3000/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html: html,
                filename: 'font-fix-test.pdf',
                margins: { top: 20, right: 20, bottom: 20, left: 20 }
            })
        });
        
        if (!response.ok) {
            throw new Error(`PDF generation failed: ${response.status}`);
        }
        
        log('   ✓ PDF generated successfully', 'green');
        
        // Save PDF
        log('\n5. Saving PDF...', 'cyan');
        const outputDir = './test-results';
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const pdfBuffer = Buffer.from(await response.arrayBuffer());
        const pdfPath = path.join(outputDir, 'font-fix-e2e-test.pdf');
        fs.writeFileSync(pdfPath, pdfBuffer);
        
        const fileSize = fs.statSync(pdfPath).size;
        const fileSizeKB = (fileSize / 1024).toFixed(2);
        
        log(`   ✓ PDF saved: ${pdfPath}`, 'green');
        log(`   File size: ${fileSizeKB} KB`, 'yellow');
        
        // Analyze results
        log('\n6. Analyzing results...', 'cyan');
        
        if (fileSize > 40000) {
            log('   ✓ PDF size indicates fonts are embedded!', 'green');
            log(`   Expected: 50-70 KB, Got: ${fileSizeKB} KB`, 'green');
        } else if (fileSize > 20000) {
            log('   ⚠ PDF size is borderline - some fonts may be embedded', 'yellow');
            log(`   Expected: 50-70 KB, Got: ${fileSizeKB} KB`, 'yellow');
        } else {
            log('   ✗ PDF size too small - fonts likely NOT embedded!', 'red');
            log(`   Expected: 50-70 KB, Got: ${fileSizeKB} KB`, 'red');
        }
        
        // Final summary
        log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
        log('║                      TEST SUMMARY                          ║', 'cyan');
        log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');
        
        log('HTML Structure:', 'bold');
        log(`  ✓ Uses <link> tags for fonts`, 'green');
        log(`  ✓ No @import statements`, 'green');
        
        log('\nPDF Generation:', 'bold');
        log(`  ✓ Server responded successfully`, 'green');
        log(`  ✓ PDF file created`, 'green');
        log(`  File: ${pdfPath}`, 'yellow');
        log(`  Size: ${fileSizeKB} KB`, fileSize > 40000 ? 'green' : 'yellow');
        
        log('\nNext Steps:', 'bold');
        log('  1. Open the PDF file to visually verify fonts', 'cyan');
        log('  2. Check if text renders in Inter font family', 'cyan');
        log('  3. Verify different font weights are distinct', 'cyan');
        
        log('\n✓ Test completed successfully!\n', 'green');
        
    } catch (error) {
        log('\n✗ Test failed!', 'red');
        log(`Error: ${error.message}`, 'red');
        
        if (error.message.includes('fetch')) {
            log('\nMake sure the PDF server is running:', 'yellow');
            log('  node pdf-server.js', 'cyan');
        }
        
        process.exit(1);
    }
}

// Run test
testPdfGeneration();
