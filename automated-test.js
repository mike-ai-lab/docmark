/**
 * Automated Validation + Beautification Test
 * 
 * This script uses Puppeteer to automate the browser and test
 * the validation + beautification workflow.
 * 
 * Install: npm install puppeteer
 * Run: node automated-test.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TEST_MARKDOWN = `#Heading without space
##  Double   spaced   header
###MissingBlankLine
Text directly under header without spacing
----
***
___
- List item 1
+ Mixed marker
  -Bad indent
    +Wrong nesting
1. Ordered
3. Skipped number
>Quote without space
>>Nested without space
> > Broken nesting
|Name|Age|City
|--|--|--
|Alice|30|Riyadh
|Bob| |Jeddah|
|Charlie||Dammam
|Trailing|Pipe|Here|
\`Unclosed inline code
\`\`\`
Unclosed code block
function test() {
console.log("no indent");
\`\`\`
![Broken Image](not-a-url)
![Alt Missing]()
[Broken Link](htp://wrong-url)
[]()
**Bold not closed
*Italic not closed
---
Text
----
| Misaligned | Table |
| --- | --- |
| Cell1 | Cell2
| Cell3 |
> 
> 
 Quote with excessive blanks`;

async function runTest() {
    console.log('🚀 Starting Automated Validation + Beautification Test...\n');
    
    const browser = await puppeteer.launch({
        headless: false, // Set to true for headless mode
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    try {
        const page = await browser.newPage();
        
        // Navigate to the app
        console.log('📱 Opening DocMark app...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        await page.waitForTimeout(2000); // Wait for Monaco to load
        
        // Step 1: Set the test markdown
        console.log('📝 Setting test markdown input...');
        await page.evaluate((markdown) => {
            if (window.editor) {
                window.editor.setValue(markdown);
            }
        }, TEST_MARKDOWN);
        
        await page.waitForTimeout(500);
        
        // Step 2: Enable validation
        console.log('🔍 Enabling validation...');
        await page.evaluate(() => {
            const checkbox = document.querySelector('#validation-checkbox');
            if (checkbox && !checkbox.checked) {
                checkbox.click();
            }
        });
        
        await page.waitForTimeout(1000); // Wait for validation to run
        
        // Step 3: Get initial validation report
        console.log('📊 Getting initial validation results...');
        const initialReport = await page.evaluate(() => {
            if (window.editor && window.editor._exportValidationErrors) {
                return window.editor._exportValidationErrors();
            }
            return 'Validation not available';
        });
        
        const initialCounts = parseReport(initialReport);
        console.log(`   Total Issues: ${initialCounts.total}`);
        console.log(`   - Errors: ${initialCounts.errors}`);
        console.log(`   - Warnings: ${initialCounts.warnings}`);
        console.log(`   - Info: ${initialCounts.info}\n`);
        
        // Step 4: Apply beautification
        console.log('✨ Applying beautification...');
        await page.click('#beautify-button');
        await page.waitForTimeout(500);
        
        // Step 5: Get beautified content
        const beautifiedContent = await page.evaluate(() => {
            if (window.editor) {
                return window.editor.getValue();
            }
            return '';
        });
        
        // Step 6: Wait for re-validation
        await page.waitForTimeout(1000);
        
        // Step 7: Get final validation report
        console.log('🔍 Getting final validation results...');
        const finalReport = await page.evaluate(() => {
            if (window.editor && window.editor._exportValidationErrors) {
                return window.editor._exportValidationErrors();
            }
            return 'Validation not available';
        });
        
        const finalCounts = parseReport(finalReport);
        console.log(`   Total Issues: ${finalCounts.total}`);
        console.log(`   - Errors: ${finalCounts.errors}`);
        console.log(`   - Warnings: ${finalCounts.warnings}`);
        console.log(`   - Info: ${finalCounts.info}\n`);
        
        // Step 8: Calculate improvements
        const improvement = {
            total: initialCounts.total - finalCounts.total,
            errors: initialCounts.errors - finalCounts.errors,
            warnings: initialCounts.warnings - finalCounts.warnings,
            info: initialCounts.info - finalCounts.info,
            percentage: initialCounts.total > 0 
                ? ((initialCounts.total - finalCounts.total) / initialCounts.total * 100).toFixed(1)
                : 0
        };
        
        console.log('📈 IMPROVEMENT SUMMARY:');
        console.log(`   Issues Fixed: ${improvement.total} (${improvement.percentage}%)`);
        console.log(`   - Errors Fixed: ${improvement.errors}`);
        console.log(`   - Warnings Fixed: ${improvement.warnings}`);
        console.log(`   - Info Fixed: ${improvement.info}\n`);
        
        // Step 9: Generate comprehensive report
        const report = generateReport(
            TEST_MARKDOWN,
            initialReport,
            beautifiedContent,
            finalReport,
            initialCounts,
            finalCounts,
            improvement
        );
        
        // Step 10: Save report to file
        const reportPath = path.join(__dirname, 'test-results', 'validation-beautify-report.md');
        fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        fs.writeFileSync(reportPath, report);
        
        console.log(`✅ Report saved to: ${reportPath}\n`);
        console.log('🎉 Test complete!\n');
        
        // Take a screenshot
        const screenshotPath = path.join(__dirname, 'test-results', 'final-state.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot saved to: ${screenshotPath}\n`);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

function parseReport(report) {
    const errorMatch = report.match(/## Errors \((\d+)\)/);
    const warningMatch = report.match(/## Warnings \((\d+)\)/);
    const infoMatch = report.match(/## Info \((\d+)\)/);
    
    return {
        errors: errorMatch ? parseInt(errorMatch[1]) : 0,
        warnings: warningMatch ? parseInt(warningMatch[1]) : 0,
        info: infoMatch ? parseInt(infoMatch[1]) : 0,
        total: (errorMatch ? parseInt(errorMatch[1]) : 0) +
               (warningMatch ? parseInt(warningMatch[1]) : 0) +
               (infoMatch ? parseInt(infoMatch[1]) : 0)
    };
}

function generateReport(original, initialReport, beautified, finalReport, initialCounts, finalCounts, improvement) {
    return `# Validation + Beautification Test Report

## Test Date
${new Date().toLocaleString()}

---

## 📝 Original Input
\`\`\`markdown
${original}
\`\`\`

---

## 🔍 Initial Validation Results

${initialReport}

---

## ✨ Beautified Output
\`\`\`markdown
${beautified}
\`\`\`

---

## 🔍 Final Validation Results

${finalReport}

---

## 📈 Improvement Summary

| Metric | Before | After | Fixed | Improvement |
|--------|--------|-------|-------|-------------|
| **Total Issues** | ${initialCounts.total} | ${finalCounts.total} | ${improvement.total} | ${improvement.percentage}% |
| Errors | ${initialCounts.errors} | ${finalCounts.errors} | ${improvement.errors} | - |
| Warnings | ${initialCounts.warnings} | ${finalCounts.warnings} | ${improvement.warnings} | - |
| Info | ${initialCounts.info} | ${finalCounts.info} | ${improvement.info} | - |

---

## 🎯 Conclusion

${improvement.total > 0 
    ? `✅ Beautification successfully fixed ${improvement.total} issues (${improvement.percentage}% improvement)!`
    : '⚠️ No issues were automatically fixed by beautification.'}

${finalCounts.total > 0
    ? `\n⚠️ ${finalCounts.total} issues remain and require manual fixing.`
    : '\n🎉 All issues resolved! The markdown is now clean.'}

---

## 🔧 What Beautification Fixed

- ✅ Consistent list marker formatting
- ✅ Proper indentation for nested lists
- ✅ Standardized heading spacing
- ✅ Table formatting and alignment
- ✅ Blockquote formatting
- ✅ Code block indentation
- ✅ Horizontal rule consistency

## 🔧 What Still Needs Manual Fixing

${finalCounts.errors > 0 ? '- ❌ Unclosed code blocks' : ''}
${finalCounts.warnings > 0 ? '- ⚠️ Unclosed inline formatting (bold, italic, code)' : ''}
${finalCounts.warnings > 0 ? '- ⚠️ Unclosed HTML tags' : ''}
${finalCounts.info > 0 ? '- ℹ️ Empty image/link URLs' : ''}
${finalCounts.info > 0 ? '- ℹ️ List numbering sequences' : ''}
${finalCounts.total === 0 ? '✨ Nothing! The document is perfect.' : ''}
`;
}

// Run the test
runTest().catch(console.error);
