/**
 * PDF Import Feature Verification Script
 * Checks that all components are properly installed and integrated
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying PDF Import Feature Installation\n');

let allChecks = true;

// Check 1: Backend files exist
console.log('📦 Checking backend files...');
const backendFiles = [
  'src/pdf-import/puppeteer-pdf-extractor.js',
  'src/pdf-import/html-normalizer.js',
  'src/pdf-import/markdown-converter.js',
  'src/pdf-import/pdf-import-pipeline.js',
  'src/pdf-import/pdf-import-server.js',
  'src/pdf-import/index.js'
];

backendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allChecks = false;
  }
});

// Check 2: Frontend files exist
console.log('\n🎨 Checking frontend files...');
const frontendFiles = [
  'src/pdf-import/pdf-import-ui.js',
  'src/pdf-import/pdf-import.css'
];

frontendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allChecks = false;
  }
});

// Check 3: Test files exist
console.log('\n🧪 Checking test files...');
const testFiles = [
  'test-pdf-import.js',
  'test-markdown-converter.js',
  'test-html-normalizer.js'
];

testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allChecks = false;
  }
});

// Check 4: Documentation exists
console.log('\n📚 Checking documentation...');
const docFiles = [
  'src/pdf-import/README.md',
  'PDF-IMPORT-INTEGRATION-GUIDE.md',
  'PDF-IMPORT-QUICK-START.md',
  'PDF-IMPORT-SUMMARY.md',
  'PDF-IMPORT-CHECKLIST.md'
];

docFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allChecks = false;
  }
});

// Check 5: Integration in index.html
console.log('\n🔗 Checking index.html integration...');
const indexHtml = fs.readFileSync('index.html', 'utf8');
if (indexHtml.includes('pdf-import.css')) {
  console.log('  ✅ CSS link added to index.html');
} else {
  console.log('  ❌ CSS link NOT found in index.html');
  allChecks = false;
}

// Check 6: Integration in main.js
console.log('\n🔗 Checking main.js integration...');
const mainJs = fs.readFileSync('src/main.js', 'utf8');
if (mainJs.includes('pdf-import/pdf-import-ui.js')) {
  console.log('  ✅ Import added to main.js');
} else {
  console.log('  ❌ Import NOT found in main.js');
  allChecks = false;
}

if (mainJs.includes('new PDFImportUI(editor)')) {
  console.log('  ✅ UI initialized in main.js');
} else {
  console.log('  ❌ UI initialization NOT found in main.js');
  allChecks = false;
}

// Check 7: Integration in pdf-server.js
console.log('\n🔗 Checking pdf-server.js integration...');
const pdfServer = fs.readFileSync('pdf-server.js', 'utf8');
if (pdfServer.includes('pdf-import-server')) {
  console.log('  ✅ Routes added to pdf-server.js');
} else {
  console.log('  ❌ Routes NOT found in pdf-server.js');
  allChecks = false;
}

// Check 8: Dependencies in package.json
console.log('\n📦 Checking package.json dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['puppeteer', 'marked', 'jsdom', 'multer', 'express'];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep} - ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`  ❌ ${dep} - MISSING`);
    allChecks = false;
  }
});

// Check 9: Node modules installed
console.log('\n📦 Checking installed node_modules...');
const nodeModulesChecks = ['puppeteer', 'marked', 'jsdom', 'multer'];

nodeModulesChecks.forEach(mod => {
  if (fs.existsSync(`node_modules/${mod}`)) {
    console.log(`  ✅ ${mod} installed`);
  } else {
    console.log(`  ⚠️  ${mod} not installed - run 'npm install'`);
  }
});

// Check 10: Can require modules
console.log('\n🔧 Checking module imports...');
try {
  require('./src/pdf-import/puppeteer-pdf-extractor');
  console.log('  ✅ puppeteer-pdf-extractor.js loads');
} catch (e) {
  console.log('  ❌ puppeteer-pdf-extractor.js failed:', e.message);
  allChecks = false;
}

try {
  require('./src/pdf-import/html-normalizer');
  console.log('  ✅ html-normalizer.js loads');
} catch (e) {
  console.log('  ❌ html-normalizer.js failed:', e.message);
  allChecks = false;
}

try {
  require('./src/pdf-import/markdown-converter');
  console.log('  ✅ markdown-converter.js loads');
} catch (e) {
  console.log('  ❌ markdown-converter.js failed:', e.message);
  allChecks = false;
}

try {
  require('./src/pdf-import/pdf-import-pipeline');
  console.log('  ✅ pdf-import-pipeline.js loads');
} catch (e) {
  console.log('  ❌ pdf-import-pipeline.js failed:', e.message);
  allChecks = false;
}

// Final summary
console.log('\n' + '='.repeat(60));
if (allChecks) {
  console.log('✅ ALL CHECKS PASSED - Feature is ready to use!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm install (if not done)');
  console.log('  2. Run: npm run dev');
  console.log('  3. Open browser and click "📄 Import PDF"');
} else {
  console.log('❌ SOME CHECKS FAILED - Review errors above');
  console.log('\nPlease fix the issues and run this script again.');
}
console.log('='.repeat(60));
