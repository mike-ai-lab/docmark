const fs = require('fs');

console.log('🧪 SVG CONVERSION UNIT TEST\n');
console.log('=' .repeat(60));

// Test cases
const testCases = [
    {
        name: 'Small SVG (Simple shapes)',
        file: 'wall_section_diagrams.svg',
        expectedMaxSize: 2000 // 2KB for single-line
    },
    {
        name: 'Large SVG (Complex drawing)',
        file: 'C:\\Users\\Administrator\\Documents\\SECTION AA-DAR LAZAR.svg',
        expectedMaxSize: 25000000 // 25MB
    }
];

let passed = 0;
let failed = 0;

// Core conversion function (same as in the HTML tool)
function convertSvgToDocMarkFormat(svgContent, filename) {
    // Remove all line breaks and extra spaces
    let singleLine = svgContent
        .replace(/\r\n/g, '')
        .replace(/\n/g, '')
        .replace(/\r/g, '')
        .replace(/>\s+</g, '><')
        .trim();
    
    // Create markdown with title
    const markdown = `# ${filename}\n\n${singleLine}`;
    
    return {
        markdown,
        originalSize: svgContent.length,
        convertedSize: singleLine.length,
        lineCount: (svgContent.match(/\n/g) || []).length + 1,
        isValid: singleLine.startsWith('<svg') && singleLine.endsWith('</svg>')
    };
}

// Test 1: Small SVG
console.log('\n📋 TEST 1: Small SVG Conversion');
console.log('-'.repeat(60));

try {
    if (fs.existsSync('wall_section_diagrams.svg')) {
        const svgContent = fs.readFileSync('wall_section_diagrams.svg', 'utf8');
        const result = convertSvgToDocMarkFormat(svgContent, 'wall_section_diagrams');
        
        console.log(`✓ File loaded: wall_section_diagrams.svg`);
        console.log(`✓ Original size: ${(result.originalSize / 1024).toFixed(2)} KB`);
        console.log(`✓ Original lines: ${result.lineCount}`);
        console.log(`✓ Converted size: ${(result.convertedSize / 1024).toFixed(2)} KB`);
        console.log(`✓ Converted lines: 1 (single line)`);
        console.log(`✓ Valid SVG format: ${result.isValid ? 'YES' : 'NO'}`);
        console.log(`✓ Size reduction: ${((1 - result.convertedSize / result.originalSize) * 100).toFixed(1)}%`);
        
        // Write test output
        fs.writeFileSync('test-svg-small-output.md', result.markdown, 'utf8');
        console.log(`✓ Test output: test-svg-small-output.md`);
        
        if (result.isValid) {
            console.log('\n✅ TEST 1 PASSED');
            passed++;
        } else {
            console.log('\n❌ TEST 1 FAILED: Invalid SVG format');
            failed++;
        }
    } else {
        console.log('⚠️  TEST 1 SKIPPED: wall_section_diagrams.svg not found');
    }
} catch (error) {
    console.log(`❌ TEST 1 FAILED: ${error.message}`);
    failed++;
}

// Test 2: Large SVG
console.log('\n📋 TEST 2: Large SVG Conversion');
console.log('-'.repeat(60));

try {
    const largeSvgPath = 'C:\\Users\\Administrator\\Documents\\SECTION AA-DAR LAZAR.svg';
    if (fs.existsSync(largeSvgPath)) {
        const svgContent = fs.readFileSync(largeSvgPath, 'utf8');
        const result = convertSvgToDocMarkFormat(svgContent, 'SECTION_AA-DAR_LAZAR');
        
        console.log(`✓ File loaded: SECTION AA-DAR LAZAR.svg`);
        console.log(`✓ Original size: ${(result.originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`✓ Original lines: ${result.lineCount.toLocaleString()}`);
        console.log(`✓ Converted size: ${(result.convertedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`✓ Converted lines: 1 (single line)`);
        console.log(`✓ Valid SVG format: ${result.isValid ? 'YES' : 'NO'}`);
        console.log(`✓ Size reduction: ${((1 - result.convertedSize / result.originalSize) * 100).toFixed(1)}%`);
        
        // Write test output
        fs.writeFileSync('test-svg-large-output.md', result.markdown, 'utf8');
        console.log(`✓ Test output: test-svg-large-output.md`);
        
        // Performance warning
        if (result.convertedSize > 10 * 1024 * 1024) {
            console.log(`⚠️  WARNING: Large file (${(result.convertedSize / 1024 / 1024).toFixed(2)} MB) may cause performance issues`);
        }
        
        if (result.isValid) {
            console.log('\n✅ TEST 2 PASSED');
            passed++;
        } else {
            console.log('\n❌ TEST 2 FAILED: Invalid SVG format');
            failed++;
        }
    } else {
        console.log('⚠️  TEST 2 SKIPPED: Large SVG file not found');
    }
} catch (error) {
    console.log(`❌ TEST 2 FAILED: ${error.message}`);
    failed++;
}

// Test 3: Inline SVG (from valid format)
console.log('\n📋 TEST 3: Inline SVG Code Conversion');
console.log('-'.repeat(60));

try {
    const inlineSvg = `<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="400" fill="#f0f4f8" />
  <circle cx="400" cy="200" r="50" fill="#667eea" />
  <text x="400" y="350" text-anchor="middle" font-family="Arial" font-size="20">Test SVG</text>
</svg>`;
    
    const result = convertSvgToDocMarkFormat(inlineSvg, 'inline_test');
    
    console.log(`✓ Original lines: ${(inlineSvg.match(/\n/g) || []).length + 1}`);
    console.log(`✓ Converted lines: 1`);
    console.log(`✓ Valid SVG format: ${result.isValid ? 'YES' : 'NO'}`);
    console.log(`✓ Contains no line breaks: ${!result.markdown.includes('\n\n<svg') ? 'NO' : 'YES (after title)'}`);
    
    fs.writeFileSync('test-svg-inline-output.md', result.markdown, 'utf8');
    console.log(`✓ Test output: test-svg-inline-output.md`);
    
    if (result.isValid) {
        console.log('\n✅ TEST 3 PASSED');
        passed++;
    } else {
        console.log('\n❌ TEST 3 FAILED: Invalid SVG format');
        failed++;
    }
} catch (error) {
    console.log(`❌ TEST 3 FAILED: ${error.message}`);
    failed++;
}

// Test 4: Edge cases
console.log('\n📋 TEST 4: Edge Cases');
console.log('-'.repeat(60));

const edgeCases = [
    {
        name: 'SVG with comments',
        svg: '<svg><!-- comment --><rect x="0" y="0" width="100" height="100"/></svg>',
        shouldPass: true
    },
    {
        name: 'SVG with CDATA',
        svg: '<svg><style><![CDATA[.cls{fill:red;}]]></style><rect class="cls" x="0" y="0" width="100" height="100"/></svg>',
        shouldPass: true
    },
    {
        name: 'Minified SVG',
        svg: '<svg><rect x="0" y="0" width="100" height="100"/></svg>',
        shouldPass: true
    },
    {
        name: 'Empty SVG',
        svg: '<svg></svg>',
        shouldPass: true
    }
];

let edgePassed = 0;
edgeCases.forEach((testCase, index) => {
    try {
        const result = convertSvgToDocMarkFormat(testCase.svg, `edge_case_${index + 1}`);
        const passed = result.isValid === testCase.shouldPass;
        console.log(`${passed ? '✓' : '✗'} ${testCase.name}: ${passed ? 'PASSED' : 'FAILED'}`);
        if (passed) edgePassed++;
    } catch (error) {
        console.log(`✗ ${testCase.name}: FAILED (${error.message})`);
    }
});

if (edgePassed === edgeCases.length) {
    console.log('\n✅ TEST 4 PASSED (All edge cases handled)');
    passed++;
} else {
    console.log(`\n❌ TEST 4 FAILED (${edgePassed}/${edgeCases.length} edge cases passed)`);
    failed++;
}

// Test 5: Performance test
console.log('\n📋 TEST 5: Performance Test');
console.log('-'.repeat(60));

try {
    const testSvg = '<svg>' + '<rect x="0" y="0" width="10" height="10"/>'.repeat(1000) + '</svg>';
    
    const startTime = Date.now();
    const result = convertSvgToDocMarkFormat(testSvg, 'performance_test');
    const endTime = Date.now();
    
    const duration = endTime - startTime;
    console.log(`✓ Converted 1000 elements in ${duration}ms`);
    console.log(`✓ Performance: ${duration < 100 ? 'EXCELLENT' : duration < 500 ? 'GOOD' : 'SLOW'}`);
    
    if (duration < 1000) {
        console.log('\n✅ TEST 5 PASSED (Performance acceptable)');
        passed++;
    } else {
        console.log('\n❌ TEST 5 FAILED (Performance too slow)');
        failed++;
    }
} catch (error) {
    console.log(`❌ TEST 5 FAILED: ${error.message}`);
    failed++;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Ready to integrate into DocMark.');
} else {
    console.log('\n⚠️  Some tests failed. Review before integration.');
}

console.log('\n📁 Test output files created:');
console.log('   - test-svg-small-output.md');
console.log('   - test-svg-large-output.md');
console.log('   - test-svg-inline-output.md');
console.log('\n💡 Next step: Open these files in DocMark to verify rendering.\n');
