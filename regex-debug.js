// Deep regex debugging

const testLines = [
    "![Broken image (",
    "![Broken image (missing close",
    "[Broken link (",
    "[Broken link (missing close"
];

console.log("Testing different regex patterns:\n");

// Pattern 1: Original (with capturing group)
const pattern1 = /!\[([^\]]*)\]\s*\([^)]*$/;
console.log("Pattern 1: /!\\[([^\\]]*)\\]\\s*\\([^)]*$/");
testLines.forEach(line => {
    console.log(`  "${line}" -> ${pattern1.test(line)}`);
});

// Pattern 2: Without capturing group
const pattern2 = /!\[[^\]]*\]\s*\([^)]*$/;
console.log("\nPattern 2: /!\\[[^\\]]*\\]\\s*\\([^)]*$/");
testLines.forEach(line => {
    console.log(`  "${line}" -> ${pattern2.test(line)}`);
});

// Pattern 3: More permissive - allows missing ]
const pattern3 = /!\[([^\]]*)(\]?\s*\([^)]*)$/;
console.log("\nPattern 3: /!\\[([^\\]]*)(\\]?\\s*\\([^)]*)$/");
testLines.forEach(line => {
    console.log(`  "${line}" -> ${pattern3.test(line)}`);
});

// Pattern 4: Check if line contains ![ and ends with (
const pattern4 = /!\[.*\($/;
console.log("\nPattern 4: /!\\[.*\\($/");
testLines.forEach(line => {
    console.log(`  "${line}" -> ${pattern4.test(line)}`);
});

// Pattern 5: More specific - has ![ and ( but no closing )
const pattern5 = /!\[[^\]]*\]\([^)]*$/;
console.log("\nPattern 5: /!\\[[^\\]]*\\]\\([^)]*$/");
testLines.forEach(line => {
    console.log(`  "${line}" -> ${pattern5.test(line)}`);
});

// Let's manually check what's in the string
console.log("\n\nManual string analysis:");
testLines.forEach(line => {
    console.log(`\nLine: "${line}"`);
    console.log(`  Has ![: ${line.includes('![')}`);
    console.log(`  Has ]: ${line.includes(']')}`);
    console.log(`  Has (: ${line.includes('(')}`);
    console.log(`  Has ): ${line.includes(')')}`);
    console.log(`  Ends with (: ${line.endsWith('(')}`);
    console.log(`  Index of ![: ${line.indexOf('![')}`);
    console.log(`  Index of ]: ${line.indexOf(']')}`);
    console.log(`  Index of (: ${line.indexOf('(')}`);
    console.log(`  Index of ): ${line.indexOf(')')}`);
});
