// Comprehensive Line Mapping Test
// This test verifies that every element in the preview correctly maps to its source line

const expectedMappings = [
  { line: 1, tag: 'h1', text: 'Markdown syntax guide' },
  { line: 3, tag: 'h2', text: 'Headers' },
  { line: 5, tag: 'h1', text: 'This is a Heading h1' },
  { line: 6, tag: 'h2', text: 'This is a Heading h2' },
  { line: 7, tag: 'h6', text: 'This is a Heading h6' },
  { line: 9, tag: 'h2', text: 'Emphasis' },
  { line: 11, tag: 'p', text: 'This text will be italic' },
  { line: 14, tag: 'p', text: 'This text will be bold' },
  { line: 17, tag: 'p', text: 'You can combine them' },
  { line: 19, tag: 'h2', text: 'Lists' },
  { line: 21, tag: 'h3', text: 'Unordered' },
  { line: 23, tag: 'ul', text: 'Item 1' }, // List starts at line 23
  { line: 30, tag: 'h3', text: 'Ordered' },
  { line: 32, tag: 'ol', text: 'Item 1' }, // Ordered list starts at line 32
  { line: 38, tag: 'h2', text: 'Images' },
  { line: 40, tag: 'p', text: 'This is an alt text' }, // Image paragraph
  { line: 42, tag: 'h2', text: 'Links' },
  { line: 44, tag: 'p', text: 'You may be using' },
  { line: 46, tag: 'h2', text: 'Blockquotes' },
  { line: 48, tag: 'blockquote', text: 'Markdown is a lightweight' },
  { line: 52, tag: 'h2', text: 'Tables' },
  { line: 54, tag: 'table', text: 'Left columns' },
  { line: 60, tag: 'h2', text: 'Blocks of code' },
  { line: 62, tag: 'pre', text: 'let message' },
  { line: 67, tag: 'h2', text: 'Inline code' },
  { line: 69, tag: 'p', text: 'This web site is using' }
];

// Run the test
async function testLineMapping() {
  const elements = document.querySelectorAll('#output [data-source-line]');
  const results = [];
  let passed = 0;
  let failed = 0;
  
  elements.forEach((element, index) => {
    const actualLine = parseInt(element.getAttribute('data-source-line'));
    const actualTag = element.tagName.toLowerCase();
    const actualText = element.textContent.trim().substring(0, 30);
    
    const expected = expectedMappings[index];
    if (!expected) {
      results.push({
        index: index + 1,
        status: '⚠️ UNEXPECTED',
        actualLine,
        actualTag,
        actualText
      });
      failed++;
      return;
    }
    
    const lineMatch = actualLine === expected.line;
    const tagMatch = actualTag === expected.tag;
    const textMatch = actualText.includes(expected.text.substring(0, 20));
    
    const allMatch = lineMatch && tagMatch && textMatch;
    
    if (allMatch) {
      passed++;
    } else {
      failed++;
    }
    
    results.push({
      index: index + 1,
      status: allMatch ? '✅ PASS' : '❌ FAIL',
      expected: `Line ${expected.line}, <${expected.tag}>, "${expected.text}"`,
      actual: `Line ${actualLine}, <${actualTag}>, "${actualText}"`,
      lineMatch: lineMatch ? '✓' : '✗',
      tagMatch: tagMatch ? '✓' : '✗',
      textMatch: textMatch ? '✓' : '✗'
    });
  });
  
  return {
    summary: {
      total: elements.length,
      passed,
      failed,
      passRate: `${Math.round((passed / elements.length) * 100)}%`
    },
    results
  };
}

// Export for use in browser console
window.testLineMapping = testLineMapping;
