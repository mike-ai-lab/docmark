// Quick script to check if PDFs have TOC by examining file size and structure
const fs = require('fs');
const path = require('path');

const downloadsDir = path.join(require('os').homedir(), 'Downloads');
const testDir = path.join(__dirname, 'test-exports', 'pdf-exports');

console.log('🔍 Checking recent DocMark PDFs for TOC...\n');

// Get most recent 10 PDFs
const files = fs.readdirSync(downloadsDir)
    .filter(f => f.startsWith('DocMark_') && f.endsWith('.pdf'))
    .map(f => ({
        name: f,
        path: path.join(downloadsDir, f),
        stats: fs.statSync(path.join(downloadsDir, f))
    }))
    .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs)
    .slice(0, 10);

console.log('📄 Most Recent Exports:\n');
files.forEach((f, i) => {
    const sizeKB = (f.stats.size / 1024).toFixed(2);
    const style = f.name.match(/DocMark_(\w+)_/)[1];
    console.log(`${i + 1}. ${style.padEnd(12)} - ${sizeKB.padStart(8)} KB - ${f.stats.mtime.toLocaleString()}`);
    
    // Read first 5000 bytes to check for TOC markers
    const buffer = fs.readFileSync(f.path);
    const content = buffer.toString('latin1', 0, Math.min(5000, buffer.length));
    
    // Look for common TOC indicators
    const hasTOC = content.includes('Table of Contents') || 
                   content.includes('Contents') ||
                   content.includes('Introduction to Markdown') && content.includes('Getting Started');
    
    if (hasTOC) {
        console.log(`   ✅ TOC detected`);
    } else {
        console.log(`   ⚠️  No TOC found`);
    }
});

console.log('\n💡 Note: This is a basic check. Open PDFs manually to verify TOC formatting.\n');
