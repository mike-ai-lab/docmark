# Validation Edge Cases Test

This file contains ALL edge cases to stress-test the validation auto-fix feature.

## 1. Mixed List Markers (Multiple Types)

- Item with asterisk
- Item with plus
- Item with dash
- Another asterisk
- Another plus

## 2. Headers Without Space

### Missing    space h3

#### Missing space h4

##### Missing space h5

## 3. Invalid Headers (Too Many #)

###### This is h7 (invalid)

###### This is h8 (invalid)

## 4. Blockquotes Without Space

> Missing space quote
> 
> > Nested missing space
> > 
> > > Triple nested missing space

## 5. Unclosed Bold

This is **unclosed bold text**
Another **unclosed bold on same line**

## 6. Unclosed Italic

This is *unclosed italic text*
Another *unclosed italic here*

## 7. Unclosed Inline Code

This is `unclosed code`
Another `unclosed code here`

## 8. Table Column Mismatches

| Header 1 | Header 2 | Header 3 | Header 4 | Header 5 | Header 6 | <span style="color:red">HEADER_FIX!</span> | <span style="color:red">HEADER_FIX!</span> |
| -------- | -------- | -------- | -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   | COL_FIX! | COL_FIX! | COL_FIX! | COL_FIX!                                   | COL_FIX!                                   |
| A        | B        | C        | COL_FIX! | COL_FIX! | COL_FIX! | COL_FIX!                                   | COL_FIX!                                   |
| X        | Y        | Z        | Extra1   | Extra2   | Extra3   | Extra4                                     | Extra5                                     |

## 9. Empty Image URLs

![Alt text](image.png)
![Another empty](image.png)

## 10. Empty Alt Text

![Image description](image.png)
![Image description](another.jpg)

## 11. Broken Image Syntax

![Broken image](IMAGE_URL_FIX!)
![Another broken](IMAGE_URL_FIX!)

## 12. Empty Links

[Link text](url)
[Empty link text](url)

## 13. Broken Link Syntax

[Broken link](URL_FIX!)
[Another broken](URL_FIX!)

## 14. Mixed Issues on Same Line

### No space header with **unclosed bold and `unclosed code**`

## 15. Nested List with Mixed Markers

- Parent item
- Child with plus
- Child with dash
- Child with asterisk
- Another parent
- Another child plus

## 16. Multiple Tables with Issues

| Col1 | Col2     | Col3     |
| ---- | -------- | -------- |
| A    | B        | COL_FIX! |
| X    | COL_FIX! | COL_FIX! |

| Header A | Header B | Header C | <span style="color:red">HEADER_FIX!</span> | <span style="color:red">HEADER_FIX!</span> |
| -------- | -------- | -------- | ------------------------------------------ |
| 1        | 2        | COL_FIX! | COL_FIX!                                   | COL_FIX!                                   | COL_FIX! |
| 3        | 4        | 5        | 6                                          | 7                                          | 8        |

## 17. Consecutive Issues

### No space

#### Another no space

##### Yet another

> No space quote
> 
> > Another no space
> > 
> > > Third no space

## 18. Complex Mixed Content

- List with **unclosed bold
- List with `unclosed code`
- List with ![broken image](IMAGE_URL_FIX!)

## 19. Multiple Unclosed Formatting

This line has **unclosed bold and *unclosed italic and `unclosed code all together**`

## 20. Edge Case: List After Table

| Table | Header |
| ----- | ------ |
| Cell  | Data   |

- List item after table
- Mixed marker after table

## Test Results

Run "Apply All" and verify:
- All list markers become `-`
- All headers get space after `#`
- All blockquotes get space after `>`
- All unclosed formatting gets closed
- All table columns get `COL_FIX!` placeholders
- All empty/broken links and images get fixed
- Everything fixed in ONE iteration