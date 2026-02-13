# Table Header Missing Columns Test

## Test Case 1: Header Missing One Column

This is the issue you described - header has 3 columns but content has 4.

| Col1 | Col2 | Col3 |
| --- | --- | --- |
| A | B | C | D |
| E | F | G | H |

**Expected behavior:**
- Validator should flag the HEADER row (line 5) as missing a column
- Fix should add `| HEADER_FIX! |` to the header
- After fix, separator should also be updated to 4 dashes

## Test Case 2: Header Missing Two Columns

| Name | Age |
| --- | --- |
| Alice | 25 | Engineer | USA |
| Bob | 30 | Designer | UK |

**Expected behavior:**
- Header should be flagged as missing 2 columns
- Fix should add `| HEADER_FIX! | HEADER_FIX! |`

## Test Case 3: Mixed - Some Rows Have More, Some Have Less

| A | B | C |
| --- | --- | --- |
| 1 | 2 | 3 | 4 | 5 |
| X | Y |

**Expected behavior:**
- Header flagged as missing 2 columns (max content has 5)
- Row with 2 columns flagged as missing 3 columns

## Test Case 4: Already Correct (No Error)

| Col1 | Col2 | Col3 | Col4 |
| --- | --- | --- | --- |
| A | B | C | D |
| E | F | G | H |

**Expected behavior:**
- No errors detected
- No fixes suggested

## How to Test

1. Open this file in the editor
2. Click the validation icon (✓)
3. Check that the HEADER rows are flagged (not the content rows)
4. Click "Apply All"
5. Verify headers get red `HEADER_FIX!` placeholders
6. Verify separators are updated to match

## Expected Results After "Apply All"

### Test Case 1:
```markdown
| Col1 | Col2 | Col3 | <span style="color:red">HEADER_FIX!</span> |
| --- | --- | --- | --- |
| A | B | C | D |
| E | F | G | H |
```

### Test Case 2:
```markdown
| Name | Age | <span style="color:red">HEADER_FIX!</span> | <span style="color:red">HEADER_FIX!</span> |
| --- | --- | --- | --- |
| Alice | 25 | Engineer | USA |
| Bob | 30 | Designer | UK |
```

### Test Case 3:
```markdown
| A | B | C | <span style="color:red">HEADER_FIX!</span> | <span style="color:red">HEADER_FIX!</span> |
| --- | --- | --- | --- | --- |
| 1 | 2 | 3 | 4 | 5 |
| X | Y | <span style="color:red">COL_FIX!</span> | <span style="color:red">COL_FIX!</span> | <span style="color:red">COL_FIX!</span> |
```
