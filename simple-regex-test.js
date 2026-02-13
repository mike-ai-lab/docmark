// Simple regex test

const imageBrokenPattern = /!\[.*\([^)]*$/;
const linkBrokenPattern = /\[.*\([^)]*$/;

const testCases = [
    { line: "![Broken image (", pattern: imageBrokenPattern, expected: true, desc: "Broken image" },
    { line: "![Broken image (missing close", pattern: imageBrokenPattern, expected: true, desc: "Broken image with text" },
    { line: "![Valid](image.png)", pattern: imageBrokenPattern, expected: false, desc: "Valid image" },
    { line: "[Broken link (", pattern: linkBrokenPattern, expected: true, desc: "Broken link" },
    { line: "[Broken link (missing close", pattern: linkBrokenPattern, expected: true, desc: "Broken link with text" },
    { line: "[Valid](url)", pattern: linkBrokenPattern, expected: false, desc: "Valid link" },
];

console.log("Simple Pattern Test\n" + "=".repeat(60));
testCases.forEach(test => {
    const result = test.pattern.test(test.line);
    const status = result === test.expected ? "✓ PASS" : "✗ FAIL";
    console.log(`${status} ${test.desc}`);
    console.log(`  Line: "${test.line}"`);
    console.log(`  Result: ${result}, Expected: ${test.expected}\n`);
});
