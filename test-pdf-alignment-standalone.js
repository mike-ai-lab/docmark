/**
 * Standalone PDF Alignment Test
 * Generates test PDFs to diagnose alignment issues
 */

const puppeteer = require('puppeteer');

async function runTest() {
    console.log('🧪 PDF Alignment Diagnostic Test\n');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Test margins
    const margins = { top: 20, right: 20, bottom: 20, left: 20 };
    const contentWidth = 210 - margins.left - margins.right; // 170mm

    console.log(`📐 A4 Page: 210mm x 297mm`);
    console.log(`📐 Margins: ${margins.top}/${margins.right}/${margins.bottom}/${margins.left}mm`);
    console.log(`📐 Content Area: ${contentWidth}mm x ${297 - margins.top - margins.bottom}mm\n`);

    // Test HTML with visual alignment markers
    const testHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: Arial; }
        .marker { background: red; color: white; padding: 5px; font-weight: bold; }
        .content { background: #f9f9f9; padding: 15px; }
        .box { border: 3px solid blue; background: yellow; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="marker">← LEFT EDGE (should be at left margin)</div>
    <div class="content">
        <h1>Alignment Test</h1>
        <p>This content should be within the margins, not shifted right.</p>
        <div class="box">This blue box should span the full content width</div>
        <p>More text to test alignment consistency down the page.</p>
        <div class="marker">← LEFT EDGE CHECK</div>
    </div>
</body>
</html>`;

    // TEST 1: Current broken approach (hardcoded 210mm body width)
    console.log('Test 1: Hardcoded 210mm body width (BROKEN)');
    const page1 = await browser.newPage();
    await page1.setContent(testHTML);
    await page1.addStyleTag({ content: `
        @page { size: A4; margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm; }
        @media print {
            html, body { width: 210mm !important; height: 297mm !important; margin: 0; padding: 0; }
        }
    `});
    await page1.pdf({
        path: 'TEST1-broken-210mm.pdf',
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: `${margins.top}mm`, right: `${margins.right}mm`, bottom: `${margins.bottom}mm`, left: `${margins.left}mm` }
    });
    await page1.close();
    console.log('   ✓ Generated: TEST1-broken-210mm.pdf\n');

    // TEST 2: No body width constraint (let Puppeteer handle it)
    console.log('Test 2: No body width (let Puppeteer handle)');
    const page2 = await browser.newPage();
    await page2.setContent(testHTML);
    await page2.addStyleTag({ content: `
        @page { size: A4; margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm; }
        @media print {
            html, body { margin: 0; padding: 0; }
        }
    `});
    await page2.pdf({
        path: 'TEST2-no-width.pdf',
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: `${margins.top}mm`, right: `${margins.right}mm`, bottom: `${margins.bottom}mm`, left: `${margins.left}mm` }
    });
    await page2.close();
    console.log('   ✓ Generated: TEST2-no-width.pdf\n');

    // TEST 3: Calculated content width
    console.log(`Test 3: Calculated content width (${contentWidth}mm)`);
    const page3 = await browser.newPage();
    await page3.setContent(testHTML);
    await page3.addStyleTag({ content: `
        @page { size: A4; margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm; }
        @media print {
            html, body { width: ${contentWidth}mm !important; margin: 0; padding: 0; }
        }
    `});
    await page3.pdf({
        path: 'TEST3-calculated-width.pdf',
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: `${margins.top}mm`, right: `${margins.right}mm`, bottom: `${margins.bottom}mm`, left: `${margins.left}mm` }
    });
    await page3.close();
    console.log(`   ✓ Generated: TEST3-calculated-width.pdf\n`);

    // TEST 4: Zero margins in @page, use padding instead
    console.log('Test 4: Zero @page margins, use body padding');
    const page4 = await browser.newPage();
    await page4.setContent(testHTML);
    await page4.addStyleTag({ content: `
        @page { size: A4; margin: 0; }
        @media print {
            html, body { margin: 0; padding: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm; }
        }
    `});
    await page4.pdf({
        path: 'TEST4-padding-instead.pdf',
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });
    await page4.close();
    console.log('   ✓ Generated: TEST4-padding-instead.pdf\n');

    await browser.close();

    console.log('✅ All tests complete!\n');
    console.log('📋 Compare these PDFs:');
    console.log('   TEST1-broken-210mm.pdf      - Current broken approach');
    console.log('   TEST2-no-width.pdf          - No width constraints');
    console.log('   TEST3-calculated-width.pdf  - Content width = 170mm');
    console.log('   TEST4-padding-instead.pdf   - Using padding not margins\n');
    console.log('👀 Check which one has proper left alignment without right shift!');
}

runTest().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
