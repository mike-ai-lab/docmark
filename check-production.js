#!/usr/bin/env node

/**
 * Production Readiness Check Script
 * Run this before deploying to verify everything is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Production Readiness...\n');

let errors = 0;
let warnings = 0;

// Check 1: Dist folder exists
console.log('1. Checking build output...');
if (fs.existsSync('dist')) {
    console.log('   ✅ dist/ folder exists');
    
    // Check for index.html
    if (fs.existsSync('dist/index.html')) {
        console.log('   ✅ index.html found');
    } else {
        console.log('   ❌ index.html missing in dist/');
        errors++;
    }
    
    // Check for assets
    if (fs.existsSync('dist/assets')) {
        console.log('   ✅ assets/ folder found');
    } else {
        console.log('   ⚠️  assets/ folder missing');
        warnings++;
    }
} else {
    console.log('   ❌ dist/ folder not found. Run: npm run build');
    errors++;
}

// Check 2: Backend files
console.log('\n2. Checking backend files...');
if (fs.existsSync('pdf-server.js')) {
    console.log('   ✅ pdf-server.js exists');
} else {
    console.log('   ❌ pdf-server.js missing');
    errors++;
}

if (fs.existsSync('src/pdf-import')) {
    console.log('   ✅ src/pdf-import/ folder exists');
    
    const requiredFiles = [
        'pdfjs-extractor.js',
        'html-normalizer.js',
        'markdown-converter.js',
        'pdf-import-pipeline.js',
        'pdf-import-ui.js'
    ];
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(`src/pdf-import/${file}`)) {
            console.log(`   ✅ ${file} found`);
        } else {
            console.log(`   ❌ ${file} missing`);
            errors++;
        }
    });
} else {
    console.log('   ❌ src/pdf-import/ folder missing');
    errors++;
}

// Check 3: Dependencies
console.log('\n3. Checking dependencies...');
if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const requiredDeps = ['pdfjs-dist', 'jsdom', 'express', 'multer'];
    requiredDeps.forEach(dep => {
        if (pkg.dependencies && pkg.dependencies[dep]) {
            console.log(`   ✅ ${dep} in dependencies`);
        } else {
            console.log(`   ❌ ${dep} missing from dependencies`);
            errors++;
        }
    });
} else {
    console.log('   ❌ package.json missing');
    errors++;
}

// Check 4: Documentation
console.log('\n4. Checking documentation...');
if (fs.existsSync('public/docs/pdf-import.html')) {
    console.log('   ✅ PDF import documentation exists');
} else {
    console.log('   ⚠️  PDF import documentation missing');
    warnings++;
}

if (fs.existsSync('DEPLOY-TO-MIMEVENTS.md')) {
    console.log('   ✅ Deployment guide exists');
} else {
    console.log('   ⚠️  Deployment guide missing');
    warnings++;
}

// Check 5: Code paste window disabled
console.log('\n5. Checking disabled features...');
if (fs.existsSync('index.html')) {
    const indexContent = fs.readFileSync('index.html', 'utf8');
    
    if (indexContent.includes('<!-- <link rel="stylesheet" type="text/css" href="./src/code-paste-window.css">')) {
        console.log('   ✅ Code paste window CSS commented out');
    } else {
        console.log('   ⚠️  Code paste window CSS may still be active');
        warnings++;
    }
    
    if (indexContent.includes('<!-- <script type="module" src="./src/code-paste-window.js">')) {
        console.log('   ✅ Code paste window JS commented out');
    } else {
        console.log('   ⚠️  Code paste window JS may still be active');
        warnings++;
    }
} else {
    console.log('   ❌ index.html not found');
    errors++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Summary:');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
    console.log('✅ All checks passed! Ready for deployment.');
    console.log('\nNext steps:');
    console.log('1. Upload dist/ contents to mimevents.com');
    console.log('2. Upload backend files to server');
    console.log('3. Run: npm install (on server)');
    console.log('4. Start backend: pm2 start pdf-server.js');
    console.log('5. Configure proxy for /api routes');
    console.log('6. Test at https://mimevents.com/');
    process.exit(0);
} else {
    if (errors > 0) {
        console.log(`❌ ${errors} error(s) found - must fix before deploying`);
    }
    if (warnings > 0) {
        console.log(`⚠️  ${warnings} warning(s) found - review recommended`);
    }
    console.log('\nFix the issues above before deploying.');
    process.exit(1);
}
