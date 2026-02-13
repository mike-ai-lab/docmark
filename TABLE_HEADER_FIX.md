# Table Header Missing Columns Fix

## Problem Description

**User Report**: "The table has a missing header column and has additional columns in the contents. The wizard is detecting the table as error but it's highlighting the additional cells in the second line, third line, fourth line, etc., but it's not detecting that there is a missing header."

### Example of the Problem

```markdown
| Col1 | Col2 | Col3 |          ← Header has 3 columns (MISSING ONE!)
| --- | --- | --- |            ← Separator has 3 dashes
| A | B | C | D |              ← Content has 4 columns ← WAS FLAGGED AS ERROR
| E | F | G | H |              ← Content has 4 columns ← WAS FLAGGED AS ERROR
```

**Old Behavior (WRONG)**:
- Validator flagged lines 3 and 4 as having "too many columns"
- User had to manually add `|` to the header to fix it

**New Behavior (CORRECT)**:
- Validator flags line 1 (the header) as "missing columns"
- Fix adds red `HEADER_FIX!` placeholders to the header
- Separator is automatically updated to match

## Solution Implemented

### 1. Smart Detection Logic

When the validator encounters a table separator, it now:
1. Looks at the header row (line above separator)
2. Counts header columns
3. **Looks ahead** at all content rows below
4. Finds the **maximum** column count in content rows
5. If content has MORE columns than header → Flag the HEADER as missing columns

```javascript
// Look ahead to see the maximum column count in content rows
let maxContentCols = tableHeaderCols;
for (let i = index + 1; i < lines.length; i++) {
    const contentLine = lines[i].trim();
    if (!contentLine.includes('|')) break; // End of table
    const contentCells = contentLine.split('|').filter(c => c.trim());
    if (contentCells.length > maxContentCols) {
        maxContentCols = contentCells.length;
    }
}

// If content has more columns than header, flag the HEADER
if (maxContentCols > tableHeaderCols) {
    const headerLineNumber = lineNumber - 1;
    markers.push({
        severity: monaco.MarkerSeverity.Warning,
        startLineNumber: headerLineNumber,
        message: `Table header missing columns: Expected ${maxContentCols} columns, got ${tableHeaderCols}`
    });
}
```

### 2. Fix Generator

New fix generator for "Table header missing columns":

```javascript
else if (marker.message.includes('Table header missing columns')) {
    const expectedMatch = marker.message.match(/Expected (\d+) columns, got (\d+)/);
    if (expectedMatch) {
        const expected = parseInt(expectedMatch[1]);
        const got = parseInt(expectedMatch[2]);
        const missingCount = expected - got;
        
        // Add missing header columns with red placeholder
        const cleanLine = line.trimEnd().replace(/\|$/, '').trimEnd();
        const placeholders = ' | ' + Array(missingCount)
            .fill('<span style="color:red">HEADER_FIX!</span>')
            .join(' | ');
        suggestedFix = cleanLine + placeholders + ' |';
        fixDescription = `Add ${missingCount} missing header column(s)`;
    }
}
```

### 3. Automatic Separator Update

The table separator fix already looks at the header row to determine column count, so after fixing the header, the separator will automatically be updated in the next validation iteration.

## Test Cases

### Test Case 1: Header Missing One Column

**Before:**
```markdown
| Col1 | Col2 | Col3 |
| --- | --- | --- |
| A | B | C | D |
```

**After "Apply All":**
```markdown
| Col1 | Col2 | Col3 | <span style="color:red">HEADER_FIX!</span> |
| --- | --- | --- | --- |
| A | B | C | D |
```

### Test Case 2: Header Missing Two Columns

**Before:**
```markdown
| Name | Age |
| --- | --- |
| Alice | 25 | Engineer | USA |
```

**After "Apply All":**
```markdown
| Name | Age | <span style="color:red">HEADER_FIX!</span> | <span style="color:red">HEADER_FIX!</span> |
| --- | --- | --- | --- |
| Alice | 25 | Engineer | USA |
```

### Test Case 3: Mixed Column Counts

**Before:**
```markdown
| A | B | C |
| --- | --- | --- |
| 1 | 2 | 3 | 4 | 5 |
| X | Y |
```

**After "Apply All":**
```markdown
| A | B | C | <span style="color:red">HEADER_FIX!</span> | <span style="color:red">HEADER_FIX!</span> |
| --- | --- | --- | --- | --- |
| 1 | 2 | 3 | 4 | 5 |
| X | Y | <span style="color:red">COL_FIX!</span> | <span style="color:red">COL_FIX!</span> | <span style="color:red">COL_FIX!</span> |
```

## User Workflow

### Old Workflow (Manual Fix)
1. Validator flags content rows as having too many columns
2. User manually adds `|` to header
3. User manually updates separator
4. User re-runs validation

### New Workflow (Automatic Fix)
1. Validator flags header as missing columns
2. User clicks "Apply All"
3. Header gets red `HEADER_FIX!` placeholders
4. Separator automatically updated
5. User replaces red placeholders with actual header names

## Visual Feedback

The red `HEADER_FIX!` placeholders:
- Clearly indicate which columns need header names
- Stand out visually in the editor
- Can be easily searched and replaced
- Follow the same pattern as `COL_FIX!` for consistency

## Benefits

1. **Correct Problem Identification**: Flags the actual source of the problem (missing header) instead of the symptom (extra content columns)

2. **Easier to Fix**: User just needs to replace `HEADER_FIX!` with actual column names instead of manually counting and adding pipes

3. **Automatic Separator Update**: The separator is automatically updated to match the new header column count

4. **Consistent with Content Fixes**: Uses the same red placeholder pattern as `COL_FIX!` for missing content columns

## Files Modified

- `src/main.js`:
  - Line ~650-690: Added look-ahead logic to detect missing header columns
  - Line ~890-900: Added fix generator for "Table header missing columns"

## Testing

Use `table-header-test.md` to verify:
1. Headers are flagged (not content rows)
2. Red `HEADER_FIX!` placeholders are added
3. Separators are updated automatically
4. Multiple missing columns are handled correctly

---

**Status**: ✅ Implemented and built
**Build**: Successful
**Test File**: table-header-test.md
