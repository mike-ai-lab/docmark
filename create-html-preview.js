const fs = require('fs');

const svgPath = 'C:\\Users\\Administrator\\Documents\\SECTION AA-DAR LAZAR.svg';
const svg = fs.readFileSync(svgPath, 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG Embed Options - SECTION AA-DAR LAZAR</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f8fafc;
            padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        h1 {
            color: #1e293b;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            color: #64748b;
            margin-bottom: 40px;
            font-size: 16px;
        }
        .option {
            background: #ffffff;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .option h2 {
            color: #1e293b;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 600;
        }
        .svg-wrapper { overflow: auto; }
        hr {
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 40px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SVG Embed Options</h1>
        <p class="subtitle">Choose the layout that works best for your needs. All options render immediately.</p>
        
        <div class="option">
            <h2>Option 1: Standard Container with Border</h2>
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #ffffff;">
                ${svg}
            </div>
        </div>
        
        <div class="option">
            <h2>Option 2: Centered with Shadow</h2>
            <div style="text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border-radius: 12px; padding: 30px; background: #ffffff;">
                ${svg}
            </div>
        </div>
        
        <div class="option">
            <h2>Option 3: Full Width</h2>
            <div class="svg-wrapper">
                ${svg}
            </div>
        </div>
        
        <div class="option">
            <h2>Option 4: With Gradient Background</h2>
            <div style="padding: 30px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px;">
                ${svg}
            </div>
        </div>
        
        <div class="option">
            <h2>Option 5: Compact View</h2>
            <div style="max-width: 800px; margin: 0 auto;">
                ${svg}
            </div>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync('svg-embed-preview.html', html);
console.log('✓ Created: svg-embed-preview.html');
console.log('✓ Open this file in your browser to see all options');
