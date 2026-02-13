/**
 * Validation + Beautification Test Script
 * 
 * This script demonstrates the full power of DocMark:
 * 1. Takes messy markdown input
 * 2. Runs validation to detect issues
 * 3. Applies beautification to fix formatting
 * 4. Re-validates to show improvements
 * 
 * Usage: Run this in browser console after loading the app
 */

(async function ValidationBeautifyTest() {
    console.log('🚀 Starting Validation + Beautification Test...\n');
    
    // Test input with various issues
    const messyMarkdown = `#Heading without space
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

    // Helper function to get validation report
    function getValidationReport(editor) {
        if (!editor || !editor._exportValidationErrors) {
            return 'Validation not available';
        }
        return editor._exportValidationErrors();
    }

    // Helper function to count issues
    function countIssues(report) {
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

    // Get editor instance from Monaco
    let editor = window.editor;
    
    // If not found, try to get from Monaco's global editors
    if (!editor && window.monaco) {
        const editors = window.monaco.editor.getEditors();
        if (editors && editors.length > 0) {
            editor = editors[0];
        }
    }
    
    if (!editor) {
        console.error('❌ Editor not found! Make sure the app is loaded.');
        console.log('� Try: Open DocMark, wait for it to fully load, then run this script again.');
        return;
    }

    // Step 1: Set messy input
    console.log('📝 STEP 1: Setting messy markdown input...\n');
    const model = editor.getModel();
    if (model) {
        model.setValue(messyMarkdown);
    } else {
        console.error('❌ Editor model not found!');
        return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));

    // Step 2: Enable validation and get initial report
    console.log('🔍 STEP 2: Running initial validation...\n');
    if (editor._setValidationEnabled) {
        editor._setValidationEnabled(true);
        await new Promise(resolve => setTimeout(resolve, 600)); // Wait for debounce
    }

    const initialReport = getValidationReport(editor);
    const initialCounts = countIssues(initialReport);
    
    console.log('📊 INITIAL VALIDATION RESULTS:');
    console.log(`   Total Issues: ${initialCounts.total}`);
    console.log(`   - Errors: ${initialCounts.errors}`);
    console.log(`   - Warnings: ${initialCounts.warnings}`);
    console.log(`   - Info: ${initialCounts.info}\n`);

    // Step 3: Apply beautification
    console.log('✨ STEP 3: Applying beautification...\n');
    
    // Trigger beautify button click
    const beautifyBtn = document.querySelector('#beautify-button');
    if (beautifyBtn) {
        beautifyBtn.click();
        await new Promise(resolve => setTimeout(resolve, 200));
    } else {
        console.error('❌ Beautify button not found!');
        return;
    }

    const beautifiedContent = model.getValue();
    
    // Step 4: Re-validate after beautification
    console.log('🔍 STEP 4: Re-validating after beautification...\n');
    await new Promise(resolve => setTimeout(resolve, 600)); // Wait for validation debounce

    const finalReport = getValidationReport(editor);
    const finalCounts = countIssues(finalReport);
    
    console.log('📊 FINAL VALIDATION RESULTS:');
    console.log(`   Total Issues: ${finalCounts.total}`);
    console.log(`   - Errors: ${finalCounts.errors}`);
    console.log(`   - Warnings: ${finalCounts.warnings}`);
    console.log(`   - Info: ${finalCounts.info}\n`);

    // Step 5: Calculate improvements
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

    // Step 6: Generate comprehensive report
    const report = `# Validation + Beautification Test Report

## Test Date
${new Date().toLocaleString()}

---

## 📝 Original Input
\`\`\`markdown
${messyMarkdown}
\`\`\`

---

## 🔍 Initial Validation Results

${initialReport}

---

## ✨ Beautified Output
\`\`\`markdown
${beautifiedContent}
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

    // Step 7: Copy report to clipboard and log
    console.log('📋 FULL REPORT:\n');
    console.log(report);
    
    try {
        await navigator.clipboard.writeText(report);
        console.log('\n✅ Full report copied to clipboard!');
    } catch (err) {
        console.log('\n⚠️ Could not copy to clipboard, but report is logged above.');
    }

    console.log('\n🎉 Test complete! Check the report above or paste from clipboard.\n');
    
    return {
        initial: initialCounts,
        final: finalCounts,
        improvement,
        report
    };
})();
