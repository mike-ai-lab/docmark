/**
 * Inspect actual PDF page size
 */

const puppeteer = require('puppeteer');

async function inspectPDFSize() {
    console.log('🔍 Inspecting PDF Page Size Issue\n');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport to A4 dimensions in pixels (at 96 DPI)
    // A4 = 210mm x 297mm = 8.27" x 11.69" = 794px x 1123px at 96 DPI
    console.log('📐 Setting viewport to A4 size:');
    console.log('   210mm x 297mm = 794px x 1123px at 96 DPI\n');
    
    await page.setViewport({
        width: 794,   // A4 width at 96 DPI
        height: 1123, // A4 height at 96 DPI
        deviceScaleFactor: 1
    });

    const testHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial; background: white; }
        .marker { background: red; color: white; padding: 5px; }
        .content { padding: 20px; }
    </style>
</head>
<body>
    <div class="marker">LEFT EDGE</div>
    <div class="content">
        <h1>Size Test</h1>
        <p>Testing A4 page size.</p>
    </div>
</body>
</html>`;

    await page.setContent(testHTML);

    const margins = { top: 20, right: 20, bottom: 20, left: 20 };

    // Test with correct viewport and no width override
    console.log('Test: Generating PDF with correct A4 viewport...');
    await page.pdf({
        path: 'SIZE-TEST-correct-viewport.pdf',
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
    console.log('   ✓ Generated: SIZE-TEST-correct-viewport.pdf\n');

    await browser.close();

    console.log('✅ Check the PDF properties:');
    console.log('   Should be: 8.27" x 11.69" (A4)');
    console.log('   NOT: 11.04" x 15.60" (A3)\n');
}

inspectPDFSize().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
