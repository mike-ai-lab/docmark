/**
 * Debug script to check PDF Import button
 * Run this in browser console to diagnose button issues
 */

console.log('🔍 Debugging PDF Import Button\n');

// Check 1: Is the header-right element present?
const headerRight = document.querySelector('.header-right');
console.log('1. Header-right element:', headerRight ? '✅ Found' : '❌ Not found');
if (headerRight) {
  console.log('   Children count:', headerRight.children.length);
}

// Check 2: Is the PDF import button present?
const pdfButton = document.getElementById('import-pdf-button');
console.log('2. PDF Import button:', pdfButton ? '✅ Found' : '❌ Not found');
if (pdfButton) {
  console.log('   Button HTML:', pdfButton.outerHTML.substring(0, 100) + '...');
}

// Check 3: Is PDFImportUI loaded?
console.log('3. PDFImportUI class:', typeof PDFImportUI !== 'undefined' ? '✅ Loaded' : '❌ Not loaded');

// Check 4: Check all buttons in header-right
if (headerRight) {
  console.log('4. All buttons in header-right:');
  Array.from(headerRight.children).forEach((child, i) => {
    console.log(`   ${i + 1}. ${child.id || child.className} - ${child.title || 'no title'}`);
  });
}

// Check 5: Check console for errors
console.log('5. Check console above for any errors during initialization');

// Check 6: Try to manually add button
console.log('\n6. Attempting to manually add button...');
if (headerRight && !pdfButton) {
  const testBtn = document.createElement('button');
  testBtn.className = 'icon-button';
  testBtn.id = 'import-pdf-button-test';
  testBtn.title = 'Test PDF Import';
  testBtn.textContent = 'PDF';
  testBtn.style.padding = '8px 12px';
  
  const importHtmlBtn = document.getElementById('import-html-button');
  if (importHtmlBtn) {
    headerRight.insertBefore(testBtn, importHtmlBtn);
    console.log('   ✅ Test button added before HTML import button');
  } else {
    headerRight.appendChild(testBtn);
    console.log('   ✅ Test button added to end of header-right');
  }
  
  console.log('   If you see a "PDF" button now, the issue is with initialization timing');
} else if (pdfButton) {
  console.log('   ℹ️  Button already exists, no need to add manually');
}

console.log('\n✅ Debug complete. Check results above.');
