/**
 * Optimize SVG and create small embed file
 * Removes unnecessary data, keeps only essential paths
 */

const fs = require('fs');

const svgPath = 'C:\\Users\\Administrator\\Documents\\SECTION AA-DAR LAZAR.svg';

console.log('Optimizing SVG...\n');

let svg = fs.readFileSync(svgPath, 'utf8');

// Get original size
const originalSize = (svg.length / 1024 / 1024).toFixed(2);
console.log('Original size:', originalSize, 'MB');

// Aggressive optimization
// Remove comments
svg = svg.replace(/<!--[\s\S]*?-->/g, '');

// Remove excessive whitespace
svg = svg.replace(/\s+/g, ' ');
svg = svg.replace(/>\s+</g, '><');

// Remove XML declaration (not needed in HTML)
svg = svg.replace(/<\?xml[^>]*\?>/g, '');

// Simplify precision (reduce decimal places)
svg = svg.replace(/(\d+\.\d{3,})/g, (match) => {
    return parseFloat(match).toFixed(2);
});

const optimizedSize = (svg.length / 1024 / 1024).toFixed(2);
console.log('Optimized size:', optimizedSize, 'MB');
console.log('Reduction:', ((1 - optimizedSize/originalSize) * 100).toFixed(1), '%\n');

// Create SINGLE option file
const output = `# SECTION AA-DAR LAZAR

<div style="width: 100%; max-width: 1200px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
${svg}
</div>
`;

fs.writeFileSync('drawing-optimized.md', output, 'utf8');

const finalSize = (fs.statSync('drawing-optimized.md').size / 1024 / 1024).toFixed(2);

console.log('✓ Created: drawing-optimized.md');
console.log('✓ Final size:', finalSize, 'MB');

if (parseFloat(finalSize) > 10) {
    console.log('\n⚠ WARNING: File is still large!');
    console.log('⚠ The SVG contains embedded fonts/data');
    console.log('\n💡 SOLUTION: Convert PDF to PNG instead:');
    console.log('   pdftocairo -png -singlefile -r 300 input.pdf output');
    console.log('   Then use <img src="output.png" />');
} else {
    console.log('\n✓ File is optimized and ready!');
}

console.log('');
