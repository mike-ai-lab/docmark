# Validation Auto-Fix - Critical Issues Summary

## Test Date: 2026-02-13
## Status: ❌ FAILING - Multiple Critical Issues

---

## 🔴 ISSUE #1: Broken Images/Links NOT DETECTED

### Lines Affected:
- Line 64: `![Broken image (`
- Line 65: `![Another broken (missing close`
- Line 74: `[Broken link (`
- Line 75: `[Another broken (missing close`
- Line 117: `- List with ![broken image (`

### Root Cause:
The validation regex `/!\[([^\]]*)\]\s*\([^)]*$/` is correct, but these lines are NOT being detected during validation.

### Evidence from Console Log:
- Total issues detected: 52
- Missing: 4-5 broken image/link issues
- These lines NEVER appear in the validation log

### Hypothesis:
The validation might be skipping these lines due to:
1. Being inside a specific section/context
2. Regex not matching the exact line format
3. `processedLines` set preventing detection

---

## 🔴 ISSUE #2: List Indentation Lost

### Expected:
```markdown
- Parent item
  - Child with plus    ← 2 spaces preserved
  - Child with dash
```

### Actual:
```markdown
- Parent item
- Child with plus      ← Indentation LOST!
- Child with dash
```

### Root Cause:
The list marker fix regex `/^(\s*)([+*-])(\s*.+)/` captures indentation correctly, but something in the apply process is losing it.

### Fix Applied:
```javascript
const indent = match[1];  // Captures "  " (2 spaces)
suggestedFix = indent + '- ' + content;
```

### Status: Should work but FAILING - needs investigation

---

## 🔴 ISSUE #3: Table Separator Column Mismatch

### Table Structure:
```markdown
| Header A | Header B | Header C |  ← 3 columns
| --- | --- | --- | --- |          ← 4 separators! WRONG!
```

### Root Cause:
The "Malformed table separator" fix is counting pipes incorrectly or not reading the header row properly.

### Fix Applied:
```javascript
const prevLine = model.getLineContent(lineNumber - 1);
const headerCols = prevLine.split('|').filter(c => c.trim()).length;
suggestedFix = '| ' + Array(headerCols).fill('---').join(' | ') + ' |';
```

### Status: Should work but FAILING - the separator still has 4 dashes for 3 columns

---

## 🔴 ISSUE #4: Section 16 Table - Wrong Column Count

### Before Fix:
```markdown
| Header A | Header B | Header C | Header D |  ← 4 columns
| --- | --- | --- | --- |                      ← 4 separators
```

### After "Fix":
```markdown
| Header A | Header B | Header C |              ← Removed Header D (correct)
| --- | --- | --- | --- |                      ← Still 4 separators! WRONG!
```

### Problem:
When the header row is fixed (removing extra column), the separator row is NOT re-validated and fixed in the same iteration.

---

## ✅ WHAT'S WORKING:

1. ✓ Mixed list markers (top-level items)
2. ✓ Headers without space
3. ✓ Invalid headers (h7/h8)
4. ✓ Blockquotes without space
5. ✓ Unclosed bold/italic/code
6. ✓ Table column mismatches (adding COL_FIX!)
7. ✓ Empty image URLs
8. ✓ Empty alt text
9. ✓ Empty links
10. ✓ Multiple issues on same line

---

## 🎯 REQUIRED FIXES:

### Priority 1: Broken Image/Link Detection
**Action:** Debug why these lines aren't being validated
- Add console.log to validation loop for EVERY line
- Check if lines 64, 65, 74, 75, 117 are being processed
- Verify regex is matching

### Priority 2: List Indentation
**Action:** Debug the apply process
- Log the captured indentation
- Verify it's being included in suggestedFix
- Check if Monaco is stripping it during edit

### Priority 3: Table Separator
**Action:** Fix the column counting logic
- Ensure it reads the ACTUAL header row
- Count columns correctly (split by | and filter)
- Re-validate separator after header changes

---

## 📊 TEST METRICS:

- **Total Test Cases:** 20 sections
- **Issues Detected:** 52
- **Issues Fixed:** 52
- **Issues Remaining:** 4-5 (broken images/links)
- **False Positives:** 1 (table separator marked as fixed but still broken)
- **Success Rate:** ~90% (48/52 truly fixed)

---

## 🔧 NEXT STEPS:

1. Add comprehensive debug logging to validation loop
2. Test regex patterns in isolation
3. Verify Monaco edit operations preserve whitespace
4. Add post-fix validation to catch false positives
5. Create unit tests for each fix type
