# Validation Test - Fixed Version

## Test: Mixed List Markers
* Item with asterisk
+ Item with plus
* Another asterisk

## Test: Table with Missing Columns
| Col1 | Col2 | Col3 | Col4 | Col5 | Col6 |
| --- | --- | --- | --- | --- | --- |
| A | B | C |
| X | Y | Z |

## Test: Simple Errors
###No space after hash
>No space after quote
This is **unclosed bold
This is `unclosed code

## Instructions:
1. Enable validation: Settings > Markdown Validation
2. Click "Fix Issues (Interactive)"
3. Click "Apply All" to fix everything at once
4. Check results:
   - List markers should all be `-`
   - Table rows should have `COL_FIX!` for missing columns
   - Headers and quotes should have spaces
   - Bold and code should be closed
