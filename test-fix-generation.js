// Test fix generation for broken images/links

const testCases = [
    {
        line: "![Broken image (",
        pattern: /!\[([^\(]*)\([^)]*$/,
        desc: "Broken image with ("
    },
    {
        line: "![Broken image (missing close",
        pattern: /!\[([^\(]*)\([^)]*$/,
        desc: "Broken image with text"
    },
    {
        line: "[Broken link (",
        pattern: /\[([^\(]*)\([^)]*$/,
        desc: "Broken link with ("
    },
    {
        line: "[Broken link (missing close",
        pattern: /\[([^\(]*)\([^)]*$/,
        desc: "Broken link with text"
    }
];

console.log("Fix Generation Test\n" + "=".repeat(80));

testCases.forEach(test => {
    const match = test.line.match(test.pattern);
    console.log(`\n${test.desc}`);
    console.log(`  Line: "${test.line}"`);
    console.log(`  Match: ${match ? JSON.stringify(match) : 'null'}`);
    
    if (match) {
        const text = match[1].replace(/\]/, '').trim();
        let fix;
        if (test.line.startsWith('![')) {
            fix = test.line.replace(test.pattern, `![${text}](<span style="color:red">IMAGE_URL_FIX!</span>)`);
        } else {
            fix = test.line.replace(test.pattern, `[${text}](<span style="color:red">URL_FIX!</span>)`);
        }
        console.log(`  Text: "${text}"`);
        console.log(`  Fix: "${fix}"`);
    }
});

console.log("\n" + "=".repeat(80));
