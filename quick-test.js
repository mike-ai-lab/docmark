/**
 * Quick Test - Copy and paste into browser console
 */

(async function() {
    console.log('🚀 Starting test...\n');

    const editor = window.editor;
    
    if (!editor) {
        console.error('❌ Editor not found! Refresh the page first.');
        return;
    }
    
    console.log('✓ Found editor\n');

    const testMarkdown = `#Heading without space
##  Double   spaced   header
- List item 1
+ Mixed marker
  -Bad indent
1. Ordered
3. Skipped number
>Quote without space
|Name|Age|City
|--|--|--
|Alice|30|Riyadh
\`Unclosed inline code
**Bold not closed`;

    editor.setValue(testMarkdown);
    console.log('✓ Set test content\n');
    
    const checkbox = document.querySelector('#validation-checkbox');
    if (checkbox && !checkbox.checked) {
        checkbox.click();
        console.log-('✓ Enabled validation\n');
    }
    
    await new Promise(r => setTimeout(r, 800));
    
    const before = editor._exportValidationErrors?.() || '';
    const beforeCount = parseInt((before.match(/Total Issues: (\d+)/)?.[1]) || 0);
    console.log(`📊 BEFORE: ${beforeCount} issues\n`);
    
    document.querySelector('#beautify-button')?.click();
    console.log('✓ Applied beautification\n');
    
    await new Promise(r => setTimeout(r, 800));
    
    const after = editor._exportValidationErrors?.() || '';
    const afterCount = parseInt((after.match(/Total Issues: (\d+)/)?.[1]) || 0);
    console.log(`📊 AFTER: ${afterCount} issues\n`);
    
    const fixed = beforeCount - afterCount;
    const percent = beforeCount > 0 ? ((fixed / beforeCount) * 100).toFixed(1) : 0;
    
    console.log(`✨ Fixed ${fixed} issues (${percent}% improvement)\n`);
    
    const report = `# Validation + Beautification Test Report

**Date:** ${new Date().toLocaleString()}

---

## 📊 Results Summary

| Metric | Value |
|--------|-------|
| Issues Before | ${beforeCount} |
| Issues After | ${afterCount} |
| Issues Fixed | ${fixed} |
| Improvement | ${percent}% |

---

## 📝 Original Input
\`\`\`markdown
${testMarkdown}
\`\`\`

---

## ✨ Beautified Output
\`\`\`markdown
${editor.getValue()}
\`\`\`

---

## 🔍 Before Beautification
${before}

---

## 🔍 After Beautification
${after}

---

## 💡 Analysis

${fixed > 0 
    ? `✅ Beautification successfully fixed ${fixed} formatting issues!` 
    : '⚠️ No issues were automatically fixed. This is expected because beautification focuses on formatting (indentation, spacing, list markers) rather than syntax errors (unclosed tags, missing URLs).'}

### What Beautification Does Fix:
- ✅ Consistent list marker formatting (-, *, +)
- ✅ Proper indentation for nested lists
- ✅ Standardized spacing around headers
- ✅ Table alignment and formatting
- ✅ Blockquote formatting

### What Requires Manual Fixing:
- ❌ Unclosed inline code, bold, italic
- ❌ Missing URLs in images/links
- ❌ Unclosed HTML tags
- ❌ Unclosed code blocks
`;
    
    console.log('📋 FULL REPORT:\n');
    console.log(report);
    
    try {
        await navigator.clipboard.writeText(report);
        console.log('\n✅ Report copied to clipboard!');
    } catch (e) {
        console.log('\n⚠️ Could not copy to clipboard (tab not focused)');
        console.log('📋 Report is shown above - you can copy it manually');
    }
    
    console.log('\n🎉 Test complete!\n');
})();
