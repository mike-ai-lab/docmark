---
title: Ultimate Markdown Demo
client: Demo Client
date: 2026-02-12
tags: [demo, stress-test, markdown, edge-cases]
---

# DEMO PROJECT REPORT

Text immediately after heading without blank line
<div>Inline HTML with <span style="color:red">bad spacing</span></div>

## Project Details

* Client: Demo Client
* Location: Riyadh
* Project Type: Commercial
* Subscope A
* Subscope B
  * Nested 1
    * Nested 2
      * Nested 3
        * Nested 4
Some paragraph text after deeply nested list
Another paragraph

> First blockquote
> 
> > Second level quote
> >
> > > Third level
> > > 
> > > > Fourth level
> > > > Inline `code` in quote
> > > > Nested empty line above

---

### 1. Extreme Tables

| Supplier   | Product      | Unit | Price | Notes             |
| ---------- | ------------ | ---- | ----- | ----------------- |
| ABC        | Plaster      | Bag  | 25    | Local             |
| XYZ        | Paint        | 18L  | 180   | Weather resistant |
| Missing    | Cells        |      |       |                   |
| Extra Row  |              |      |       |                   |
| Messy Col  | Table        |      |       |                   |

Text between tables

| Item    | Unit | Price | Notes    |
| ------- | ---- | ----- | -------- |
| Granite | m2   | 95    |          |
| Marble  | m2   | 120   | Polished |
|         |      |       |          |

---

### 2. Code Blocks

```javascript
// JavaScript block with fake Markdown inside
const example = {
  key: "value",
  list: ["a","b","c"]
};
// --- fake HR inside code
function test(a,b){
  return a+b;
}
```

```yaml
# YAML block
subtotal: 100000
vat: 15000
total: 115000
nested:
  level1:
    - list item 1
    - list item 2
```

```python
# Python block with comments
def calc(a,b):
    return a+b
# --- fake hr inside comment
```

---

### 3. Nested Lists and Mixed Numbering

* First
* Second
* Third
  * Nested A
    * Nested B
      * Nested C
        * Nested D
1. First numbered
2. Second numbered
10. Tenth numbered
99. Ninety-ninth numbered
100. Hundredth numbered
0. Zero indexed

---

### 4. Blockquotes Madness

> Quote level 1
>
> > Quote level 2
> >
> > > Quote level 3
> > >
> > > > Quote level 4
> > > > Inline code `test()` here
> > > > Nested table inside quote
> > > > | Col1 | Col2 |
> > > > | ---- | ---- |
> > > > | X    | Y    |
> > > > |      |      |
> > > > | Z    | W    |

---

### 5. Inline HTML Chaos

<div>
<p>Paragraph inside div</p>
<ul>
<li>HTML List 1</li>
<li>HTML List 2</li>
</ul>
</div>

---

### 6. Weird Headings & Spacing

#HeadingWithoutSpace
##  Double  Space Heading
###TripleSpaceHeading
####    Mixed    Spacing    Heading
##### Normal Heading
###### Last Heading

---

### 7. Mixed Horizontal Rules

---
***
___
  ---
---  
* * *
___

---

### 8. Trailing spaces and blank lines

Random trailing spaces here.    
Another line with trailing spaces.      

Multiple consecutive blank lines above and below




---

### 9. Inline code and special chars

Inline `code with backticks` inside text.  
Escape test: \* \_ \` \# \> \| \-  

Markdown inside table:

| Item   | Description               |
| ------ | ------------------------- |
| Test   | `Inline code` inside cell |
| Escape | \*Bold\* \_Italic\_       |

---

### 10. End Chaos

* --
> > Final nested quote  
> > Inline code: `final()`

