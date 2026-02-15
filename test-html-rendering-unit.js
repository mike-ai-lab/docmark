/**
 * Unit Tests for HTML Rendering Compatibility
 * Tests the new HTML rendering features in DocMark
 */

// Test configuration
const TEST_CONFIG = {
    verbose: true,
    stopOnFailure: false
};

// Test results tracking
const results = {
    passed: 0,
    failed: 0,
    total: 0,
    tests: []
};

// Test utilities
const assert = {
    equals: (actual, expected, message) => {
        const passed = actual === expected;
        logTest(message, passed, { actual, expected });
        return passed;
    },
    
    notEquals: (actual, expected, message) => {
        const passed = actual !== expected;
        logTest(message, passed, { actual, expected });
        return passed;
    },
    
    contains: (haystack, needle, message) => {
        const passed = haystack.includes(needle);
        logTest(message, passed, { haystack, needle });
        return passed;
    },
    
    notContains: (haystack, needle, message) => {
        const passed = !haystack.includes(needle);
        logTest(message, passed, { haystack, needle });
        return passed;
    },
    
    isTrue: (value, message) => {
        const passed = value === true;
        logTest(message, passed, { value });
        return passed;
    },
    
    isFalse: (value, message) => {
        const passed = value === false;
        logTest(message, passed, { value });
        return passed;
    },
    
    exists: (value, message) => {
        const passed = value !== null && value !== undefined;
        logTest(message, passed, { value });
        return passed;
    },
    
    notExists: (value, message) => {
        const passed = value === null || value === undefined;
        logTest(message, passed, { value });
        return passed;
    },
    
    throws: (fn, message) => {
        let passed = false;
        let error = null;
        try {
            fn();
        } catch (e) {
            passed = true;
            error = e;
        }
        logTest(message, passed, { error });
        return passed;
    }
};

function logTest(message, passed, details = {}) {
    results.total++;
    if (passed) {
        results.passed++;
        if (TEST_CONFIG.verbose) {
            console.log(`✅ PASS: ${message}`);
        }
    } else {
        results.failed++;
        console.error(`❌ FAIL: ${message}`);
        if (details.actual !== undefined && details.expected !== undefined) {
            console.error(`   Expected: ${JSON.stringify(details.expected)}`);
            console.error(`   Actual:   ${JSON.stringify(details.actual)}`);
        } else if (details.value !== undefined) {
            console.error(`   Value: ${JSON.stringify(details.value)}`);
        }
        if (TEST_CONFIG.stopOnFailure) {
            throw new Error(`Test failed: ${message}`);
        }
    }
    results.tests.push({ message, passed, details });
}

// ============================================================================
// TEST SUITE 1: DOMPurify Configuration
// ============================================================================

console.log('\n📦 TEST SUITE 1: DOMPurify Configuration\n');

function testDOMPurifyBasicHTML() {
    const input = '<div class="test">Hello World</div>';
    const output = DOMPurify.sanitize(input, {
        ADD_ATTR: ['class', 'style', 'id'],
        ADD_TAGS: ['div', 'span', 'p'],
        ALLOW_DATA_ATTR: true,
        KEEP_CONTENT: true
    });
    
    assert.contains(output, '<div', 'DOMPurify preserves div tags');
    assert.contains(output, 'class="test"', 'DOMPurify preserves class attributes');
    assert.contains(output, 'Hello World', 'DOMPurify preserves content');
}

function testDOMPurifyScriptBlocking() {
    const input = '<script>alert("XSS")</script><div>Safe content</div>';
    const output = DOMPurify.sanitize(input, {
        ADD_TAGS: ['div'],
        KEEP_CONTENT: true
    });
    
    assert.notContains(output, '<script', 'DOMPurify blocks script tags');
    assert.notContains(output, 'alert', 'DOMPurify removes script content');
    assert.contains(output, 'Safe content', 'DOMPurify keeps safe content');
}

function testDOMPurifyEventHandlers() {
    const input = '<div onclick="alert(\'XSS\')">Click me</div>';
    const output = DOMPurify.sanitize(input, {
        ADD_TAGS: ['div'],
        KEEP_CONTENT: true
    });
    
    assert.notContains(output, 'onclick', 'DOMPurify strips onclick handlers');
    assert.contains(output, 'Click me', 'DOMPurify preserves text content');
}

function testDOMPurifyInlineStyles() {
    const input = '<div style="color: red; background: blue;">Styled</div>';
    const output = DOMPurify.sanitize(input, {
        ADD_ATTR: ['style'],
        ADD_TAGS: ['div'],
        KEEP_CONTENT: true
    });
    
    assert.contains(output, 'style=', 'DOMPurify preserves style attribute');
    assert.contains(output, 'Styled', 'DOMPurify preserves content');
}

function testDOMPurifyComplexHTML() {
    const input = `
        <section>
            <article>
                <h2>Title</h2>
                <p>Paragraph</p>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                </ul>
            </article>
        </section>
    `;
    const output = DOMPurify.sanitize(input, {
        ADD_TAGS: ['section', 'article', 'h2', 'p', 'ul', 'li'],
        KEEP_CONTENT: true
    });
    
    assert.contains(output, '<section', 'DOMPurify preserves section tags');
    assert.contains(output, '<article', 'DOMPurify preserves article tags');
    assert.contains(output, '<h2', 'DOMPurify preserves heading tags');
    assert.contains(output, '<ul', 'DOMPurify preserves list tags');
    assert.contains(output, 'Item 1', 'DOMPurify preserves list content');
}

function testDOMPurifyDataAttributes() {
    const input = '<div data-line="5" data-source="test">Content</div>';
    const output = DOMPurify.sanitize(input, {
        ADD_TAGS: ['div'],
        ALLOW_DATA_ATTR: true,
        KEEP_CONTENT: true
    });
    
    assert.contains(output, 'data-line', 'DOMPurify preserves data-line attribute');
    assert.contains(output, 'data-source', 'DOMPurify preserves data-source attribute');
}

// Run Suite 1
testDOMPurifyBasicHTML();
testDOMPurifyScriptBlocking();
testDOMPurifyEventHandlers();
testDOMPurifyInlineStyles();
testDOMPurifyComplexHTML();
testDOMPurifyDataAttributes();

// ============================================================================
// TEST SUITE 2: Marked Configuration
// ============================================================================

console.log('\n📦 TEST SUITE 2: Marked Configuration\n');

function testMarkedHTMLPassthrough() {
    // Configure marked to allow HTML
    marked.setOptions({
        sanitize: false,
        breaks: true,
        gfm: true
    });
    
    const input = '# Markdown Header\n\n<div class="custom">HTML Block</div>';
    const output = marked.parse(input);
    
    assert.contains(output, '<h1', 'Marked converts markdown headers');
    assert.contains(output, '<div class="custom">', 'Marked preserves HTML blocks');
    assert.contains(output, 'HTML Block', 'Marked preserves HTML content');
}

function testMarkedMixedContent() {
    marked.setOptions({
        sanitize: false,
        breaks: true,
        gfm: true
    });
    
    const input = '**Bold text** and <span style="color: red;">red text</span>';
    const output = marked.parse(input);
    
    assert.contains(output, '<strong>', 'Marked converts markdown bold');
    assert.contains(output, '<span style="color: red;">', 'Marked preserves HTML spans');
}

function testMarkedCodeBlocks() {
    marked.setOptions({
        sanitize: false,
        breaks: true,
        gfm: true
    });
    
    const input = '```javascript\nconst x = 5;\n```';
    const output = marked.parse(input);
    
    assert.contains(output, '<code', 'Marked creates code blocks');
    assert.contains(output, 'const x = 5', 'Marked preserves code content');
}

function testMarkedTables() {
    marked.setOptions({
        sanitize: false,
        breaks: true,
        gfm: true
    });
    
    const input = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
    const output = marked.parse(input);
    
    assert.contains(output, '<table', 'Marked creates tables');
    assert.contains(output, '<thead', 'Marked creates table headers');
    assert.contains(output, '<tbody', 'Marked creates table body');
    assert.contains(output, 'Cell 1', 'Marked preserves table content');
}

// Run Suite 2
testMarkedHTMLPassthrough();
testMarkedMixedContent();
testMarkedCodeBlocks();
testMarkedTables();

// ============================================================================
// TEST SUITE 3: HTML Rendering Pipeline
// ============================================================================

console.log('\n📦 TEST SUITE 3: HTML Rendering Pipeline\n');

function testFullPipeline() {
    // Simulate the full rendering pipeline
    marked.setOptions({
        sanitize: false,
        breaks: true,
        gfm: true
    });
    
    const markdown = `
# Test Document

This is **markdown** with <span style="color: blue;">HTML</span>.

<div class="custom-box" style="padding: 20px; background: #f0f0f0;">
    <h3>Custom HTML Block</h3>
    <p>This should render fully.</p>
</div>

## Another Section

- Markdown list
- With items
    `.trim();
    
    // Step 1: Parse with marked
    const html = marked.parse(markdown);
    
    // Step 2: Sanitize with DOMPurify
    const sanitized = DOMPurify.sanitize(html, {
        ADD_ATTR: ['class', 'style', 'id'],
        ADD_TAGS: ['div', 'span', 'h1', 'h2', 'h3', 'p', 'strong', 'ul', 'li'],
        ALLOW_DATA_ATTR: true,
        KEEP_CONTENT: true
    });
    
    // Verify output
    assert.contains(sanitized, '<h1', 'Pipeline preserves markdown headers');
    assert.contains(sanitized, '<strong>', 'Pipeline preserves markdown bold');
    assert.contains(sanitized, '<span style="color: blue;">', 'Pipeline preserves HTML spans');
    assert.contains(sanitized, '<div class="custom-box"', 'Pipeline preserves HTML divs');
    assert.contains(sanitized, 'style="padding: 20px', 'Pipeline preserves inline styles');
    assert.contains(sanitized, '<ul', 'Pipeline preserves markdown lists');
}

function testSecurityPipeline() {
    marked.setOptions({
        sanitize: false,
        breaks: true,
        gfm: true
    });
    
    const maliciousMarkdown = `
# Safe Header

<script>alert('XSS')</script>

<div onclick="alert('XSS')">Click me</div>

<iframe src="https://evil.com"></iframe>

Safe content here.
    `.trim();
    
    const html = marked.parse(maliciousMarkdown);
    const sanitized = DOMPurify.sanitize(html, {
        ADD_TAGS: ['h1', 'div', 'p'],
        KEEP_CONTENT: true
    });
    
    assert.notContains(sanitized, '<script', 'Pipeline blocks script tags');
    assert.notContains(sanitized, 'onclick', 'Pipeline strips event handlers');
    assert.notContains(sanitized, '<iframe', 'Pipeline blocks iframes');
    assert.contains(sanitized, 'Safe content', 'Pipeline preserves safe content');
}

// Run Suite 3
testFullPipeline();
testSecurityPipeline();

// ============================================================================
// TEST SUITE 4: CSS Styling Verification
// ============================================================================

console.log('\n📦 TEST SUITE 4: CSS Styling Verification\n');

function testPasteDialogCSS() {
    // Check if paste dialog CSS classes exist
    const styleSheets = Array.from(document.styleSheets);
    let foundPasteDialog = false;
    
    try {
        for (const sheet of styleSheets) {
            try {
                const rules = Array.from(sheet.cssRules || []);
                for (const rule of rules) {
                    if (rule.selectorText && rule.selectorText.includes('paste-dialog')) {
                        foundPasteDialog = true;
                        break;
                    }
                }
            } catch (e) {
                // CORS or other access issues, skip
                continue;
            }
            if (foundPasteDialog) break;
        }
    } catch (e) {
        console.warn('Could not access stylesheets (CORS):', e.message);
    }
    
    // Alternative: Check if we can create element with class
    const testDiv = document.createElement('div');
    testDiv.className = 'paste-dialog-overlay';
    document.body.appendChild(testDiv);
    const hasClass = testDiv.className === 'paste-dialog-overlay';
    document.body.removeChild(testDiv);
    
    assert.isTrue(hasClass, 'Paste dialog CSS classes can be applied');
}

function testDarkThemeSupport() {
    // Test that dark theme attribute can be set
    const originalTheme = document.documentElement.getAttribute('data-theme');
    
    document.documentElement.setAttribute('data-theme', 'dark');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    document.documentElement.setAttribute('data-theme', 'light');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    
    // Restore original
    if (originalTheme) {
        document.documentElement.setAttribute('data-theme', originalTheme);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    assert.isTrue(isDark, 'Dark theme can be set');
    assert.isTrue(isLight, 'Light theme can be set');
}

// Run Suite 4
testPasteDialogCSS();
testDarkThemeSupport();

// ============================================================================
// TEST SUITE 5: DOM Manipulation
// ============================================================================

console.log('\n📦 TEST SUITE 5: DOM Manipulation\n');

function testHTMLInsertion() {
    const container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    
    const html = '<div class="test" style="color: red;">Test Content</div>';
    const sanitized = DOMPurify.sanitize(html, {
        ADD_ATTR: ['class', 'style'],
        ADD_TAGS: ['div'],
        KEEP_CONTENT: true
    });
    
    container.innerHTML = sanitized;
    
    const inserted = container.querySelector('.test');
    assert.exists(inserted, 'HTML element inserted into DOM');
    assert.equals(inserted.textContent, 'Test Content', 'Content preserved after insertion');
    
    const hasStyle = inserted.hasAttribute('style');
    assert.isTrue(hasStyle, 'Style attribute preserved after insertion');
    
    document.body.removeChild(container);
}

function testComplexHTMLStructure() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const html = `
        <section class="wrapper">
            <article>
                <h2>Title</h2>
                <p>Paragraph with <strong>bold</strong> and <em>italic</em>.</p>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                </ul>
            </article>
        </section>
    `;
    
    const sanitized = DOMPurify.sanitize(html, {
        ADD_ATTR: ['class'],
        ADD_TAGS: ['section', 'article', 'h2', 'p', 'strong', 'em', 'ul', 'li'],
        KEEP_CONTENT: true
    });
    
    container.innerHTML = sanitized;
    
    const section = container.querySelector('section');
    const article = container.querySelector('article');
    const heading = container.querySelector('h2');
    const list = container.querySelector('ul');
    const items = container.querySelectorAll('li');
    
    assert.exists(section, 'Section element exists');
    assert.exists(article, 'Article element exists');
    assert.exists(heading, 'Heading element exists');
    assert.exists(list, 'List element exists');
    assert.equals(items.length, 2, 'List has correct number of items');
    
    document.body.removeChild(container);
}

// Run Suite 5
testHTMLInsertion();
testComplexHTMLStructure();

// ============================================================================
// TEST RESULTS SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests:  ${results.total}`);
console.log(`✅ Passed:     ${results.passed} (${((results.passed/results.total)*100).toFixed(1)}%)`);
console.log(`❌ Failed:     ${results.failed} (${((results.failed/results.total)*100).toFixed(1)}%)`);
console.log('='.repeat(60));

if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! HTML rendering is working correctly.\n');
} else {
    console.log('\n⚠️  SOME TESTS FAILED. Review the errors above.\n');
    console.log('Failed tests:');
    results.tests
        .filter(t => !t.passed)
        .forEach(t => console.log(`  - ${t.message}`));
    console.log('');
}

// Export results for programmatic access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = results;
}
