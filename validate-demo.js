// Validation script for enhanced-features-demo.html
const fs = require('fs');

console.log('🔍 Validating enhanced-features-demo.html...\n');

const html = fs.readFileSync('enhanced-features-demo.html', 'utf8');

// Check for required elements
const checks = [
    { name: 'HTML structure', test: html.includes('<!DOCTYPE html>') && html.includes('</html>') },
    { name: 'Header section', test: html.includes('<header>') && html.includes('</header>') },
    { name: 'Editor section', test: html.includes('editor-section') },
    { name: 'Preview section', test: html.includes('preview-section') },
    { name: 'Version history panel', test: html.includes('changes-panel') },
    { name: 'Version modal', test: html.includes('version-modal') },
    { name: 'Status bar', test: html.includes('status-bar') },
    { name: 'Layout toggle buttons', test: html.includes('layout-btn') },
    { name: 'Print layout styles', test: html.includes('print-layout') },
    { name: 'Version preview function', test: html.includes('function previewVersion') },
    { name: 'Version compare function', test: html.includes('function compareVersion') },
    { name: 'Version restore function', test: html.includes('function restoreVersion') },
    { name: 'Auto-save functionality', test: html.includes('startAutoSave') },
    { name: 'localStorage integration', test: html.includes('localStorage.getItem') },
    { name: 'Dark mode support', test: html.includes('[data-theme="dark"]') },
    { name: 'Markdown parser', test: html.includes('function parseMarkdown') },
    { name: 'Diff highlighting', test: html.includes('function highlightDiff') },
    { name: 'Status bar updates', test: html.includes('function updateStatusBar') },
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
    if (check.test) {
        console.log(`✅ ${check.name}`);
        passed++;
    } else {
        console.log(`❌ ${check.name}`);
        failed++;
    }
});

console.log(`\n📊 Results: ${passed}/${checks.length} checks passed`);

if (failed === 0) {
    console.log('✨ All validation checks passed!');
    process.exit(0);
} else {
    console.log(`⚠️  ${failed} check(s) failed`);
    process.exit(1);
}
