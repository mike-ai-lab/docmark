# input before:

````````markdown
#Heading without space
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
`Unclosed inline code
```
Unclosed code block
function test() {
console.log("no indent");
```
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
>Quote with excessive blanks

````````


# after fixxing:

````
# Heading without space

## Double   spaced   header

### MissingBlankLine

Text directly under header without spacing

---

---

---

- List item 1
- Mixed marker
-Bad indent
+Wrong nesting
1. Ordered
2. Skipped number

> Quote without space
> 
> > Nested without space
> > Broken nesting

| ----- | --- | ------ |
| ----- | --- | ------ |
| Alice | 30  | Riyadh |
| ----- | --- |
| ----- | --- |
| ----- | --- | ------ |

`Unclosed inline code
`
`
`

```
Unclosed code block
function test() {
console.log("no indent");
```

![Broken Image](not-a-url)
![Alt Missing]()
[Broken Link](htp://wrong-url)
[]()
**Bold not closed
**
**
**
*Italic not closed

---

Text

---

| ----- | ----- |
| ----- | ----- |
| Cell1 | Cell2 |
| Cell3 |

> Quote with excessive blanks

````

# the console:

``````
 10:03:20.139 main.js:4983 Validation report copied to clipboard

10:03:29.850 main.js:843 ✅ Auto-fixed 4 issues

10:03:30.455 main.js:5004 ✅ Fixed 4 issues. 14 issues remaining.

``````