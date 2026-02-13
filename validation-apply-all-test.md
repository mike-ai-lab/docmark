````markdown
# Validation Apply All Test

## New Features Added:
1. **Apply All** button - Applies all pending fixes at once
2. **Discard All** button - Closes wizard and discards all
3. **Improved Mixed List Markers** - Now automatically standardizes to `-`
4. **Table Column Mismatch Fix** - Adds red `COL_FIX!` placeholders for missing columns

## Test Cases

### Mixed List Markers (Should auto-fix)
* Item with asterisk
+ Item with plus
- Item with dash
* Another asterisk

### Table Column Mismatch (Should add red placeholders)
| Header 1 | Header 2 | Header 3 | Header 4 | Header 5 | Header 6 |
| --- | --- | --- | --- | --- | --- |
| Cell 1 | Cell 2 | Cell 3 |
| A | B | C |

### Other Errors
###Missing space
>Missing space in blockquote
This is **unclosed bold
This is `unclosed code

## How to Test:
1. Enable validation: Settings > Markdown Validation ✓
2. Click "Fix Issues (Interactive)"
3. Try the new buttons:
   - **Apply** - Fix current issue
   - **Apply All** - Fix all issues at once!
   - **Skip** - Skip current
   - **Discard All** - Close wizard
4. Watch mixed list markers get standardized to `-`
5. See table columns get `COL_FIX!` placeholders in red

````

# results with only auto fix applied:

````markdown
# Validation Apply All Test

## New Features Added:

1. **Apply All** button - Applies all pending fixes at once
2. **Discard All** button - Closes wizard and discards all
3. **Improved Mixed List Markers** - Now automatically standardizes to `-`
4. **Table Column Mismatch Fix** - Adds red `COL_FIX!` placeholders for missing columns

## Test Cases

### Mixed List Markers (Should auto-fix)

* Item with asterisk
- Item with plus
- Item with dash
- Another asterisk

### Table Column Mismatch (Should add red placeholders)

| Header 1 | Header 2 | Header 3 | Header 4 | Header 5 | Header 6 |
| --- | --- | --- | --- | --- | --- |
| Cell 1 | Cell 2 | Cell 3 | COL_FIX! | COL_FIX! | COL_FIX! |
| A | B | C | COL_FIX! | COL_FIX! | COL_FIX! |

### Other Errors
### Missing space
> Missing space in blockquote
This is **unclosed bold**
This is `unclosed code`

## How to Test:

1. Enable validation: Settings > Markdown Validation ✓
2. Click "Fix Issues (Interactive)"
3. Try the new buttons:
   - **Apply** - Fix current issue
   - **Apply All** - Fix all issues at once!
   - **Skip** - Skip current
   - **Discard All** - Close wizard
4. Watch mixed list markers get standardized to `-`
5. See table columns get `COL_FIX!` placeholders in red
````