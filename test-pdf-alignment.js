/**
 * PDF Alignment Test
 * Tests the actual PDF output to verify content alignment
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function testPDFAlignment() {
    console.log('🧪 Starting PDF Alignment Test...\n');

    const testHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        
        .test-content {
            background: #f0f0f0;
            padding: 20px;
        }
        
        h1 {
            color: #333;
            border-left: 5px solid red;
            padding-left: 10px;
        }
        
        .alignment-test {
            background: yellow;
            border: 2px solid blue;
            padding: 10px;
            margin: 20px 0;
        }
        
        .edge-marker {
            background: red;
            color: white;
            padding: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="test-content">
        <div class="edge-marker">LEFT EDGE MARKER</div>
        <h1>PDF Alignment Test Document</h1>
        <p>This paragraph should be aligned to the left edge of the content area, respecting margins.</p>
        
        <div class="alignment-test">
            <strong>ALIGNMENT TEST BOX</strong><br>
            This box should span the full width of the content area.<br>
            Left edge should align with the left margin.<br>
            Right edge should align with the right margin.
        </div>
        
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. This text should flow naturally within the margins without shifting right.</p>
        
        <div class="edge-marker">ANOTHER LEFT EDGE MARKER</div>
        
        <ul>
            <li>List item 1 - should align with left margin</li>
            <li>List item 2 - should align with left margin</li>
            <li>List item 3 - should align with left margin</li>
        </ul>
    </div>
</body>
</html>`;

    const margins = { top: 20, right: 20, bottom: 20, left: 20 };
    
    console.log('📐 Test Configuration:');
    console.log(`   Margins: ${margins.top}/${margins.right}/${margins.bottom}/${margins.left}mm`);
    console.log(`   Expected content width: ${210 - margins.left - margins.right}mm\n`);

    // Test 1: Current implementation (with hardcoded widths)
    console.log('🔍 Test 1: Testing with hardcoded 210mm width...');
    await generateTestPDF(testHTML, margins, 'test-pdf-hardcoded-210mm.pdf', true);

    // Test 2: Without hardcoded widths (let browser handle it)
    console.log('\n🔍 Test 2: Testing without hardcoded widths...');
    await generateTestPDF(testHTML, margins, 'test-pdf-no-hardcoded.pdf', false);

    // Test 3: With calculated content width
    console.log('\n🔍 Test 3: Testing with calculated content width...');
    await generateTestPDF(testHTML, margins, 'test-pdf-calculated-width.pdf', false, true);

    console.log('\n✅ All test PDFs generated!');
    console.log('\n📋 Results:');
    console.log('   - test-pdf-hardcoded-210mm.pdf (current broken approach)');
    console.log('   - test-pdf-no-hardcoded.pdf (no width constraints)');
    console.log('   - test-pdf-calculated-width.pdf (calculated content width)');
    console.log('\n👀 Open these PDFs and check:');
    console.log('   1. Are the red "LEFT EDGE MARKER" boxes aligned to the left?');
    console.log('   2. Is the yellow "ALIGNMENT TEST BOX" properly centered?');
    console.log('   3. Does content shift to the right as you scroll down?');
}

async function generateTestPDF(html, margins, filename, useHardcodedWidth, useCalculatedWidth = false) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

    // Calculate content width
    const contentWidth = 210 - margins.left - margins.right;

    let printCSS = '';
    
    if (useHardcodedWidth) {
        // Current broken approach
        printCSS = `
            @page {
                size: A4 portrait;
                margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
            }
            @media print {
                html, body {
                    width: 210mm !important;
                    height: 297mm !important;
                }
            }
        `;
    } else if (useCalculatedWidth) {
        // Calculated width approach
        printCSS = `
            @page {
                size: A4 portrait;
                margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
            }
            @media print {
                html, body {
                    width: ${contentWidth}mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
            }
        `;
    } else {
        // No hardcoded width - let browser handle it
        printCSS = `
            @page {
                size: A4 portrait;
                margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
            }
            @media print {
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                }
            }
        `;
    }

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.addStyleTag({ content: printCSS });

    await page.pdf({
        path: filename,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
            top: `${margins.top}mm`,
            right: `${margins.right}mm`,
            bottom: `${margins.bottom}mm`,
            left: `${margins.left}mm`
        }
    });

    await browser.close();
    console.log(`   ✓ Generated: ${filename}`);
}

// Run the test
testPDFAlignment().catch(console.error);
