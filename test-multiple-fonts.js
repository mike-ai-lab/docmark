/**
 * Multiple Fonts Test for PDF Export
 * 
 * Tests that various Google Fonts are properly embedded in PDF exports
 * 
 * Run: node test-multiple-fonts.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(70));
    log(title, 'bold');
    console.log('='.repeat(70) + '\n');
}

// Font configurations to test
const FONT_TESTS = [
    {
        name: 'Inter',
        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
        weights: [300, 400, 500, 600, 700, 800, 900],
        category: 'sans-serif'
    },
    {
        name: 'Roboto',
        url: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap',
        weights: [300, 400, 500, 700],
        hasItalic: true,
        category: 'sans-serif'
    },
    {
        name: 'Roboto Mono',
        url: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap',
        weights: [400, 500, 700],
        category: 'monospace'
    },
    {
        name: 'Open Sans',
        url: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0