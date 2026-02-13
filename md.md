Headings
Create headers using # symbols (1-6 levels) or underlines for main headers.


# Heading Level 1
## Heading Level 2
### Heading Level 3
#### Heading Level 4
##### Heading Level 5
###### Heading Level 6

Alternative Level 1
==================

Alternative Level 2
------------------
Rendered output:
Heading Level 1
Heading Level 2
Heading Level 3
Heading Level 4
Heading Level 5
Heading Level 6
Alternative Level 1
Alternative Level 2
headers
formatting
basic
text
Text Emphasis
Add emphasis with bold, italic, and combined formatting.


**Bold text** or __Bold text__
*Italic text* or _Italic text_
***Bold and italic*** or ___Bold and italic___
**Bold text with _italic_ inside**
*Italic text with **bold** inside*
Rendered output:
Bold text or Bold text Italic text or Italic text Bold and italic or Bold and italic Bold text with italic inside Italic text with bold inside

emphasis
formatting
basic
text
bold
italic
Strikethrough Text
Strike through text using double tildes.


~~Strikethrough text~~
Regular text with ~~strikethrough~~ words
Price: ~~$99.99~~ **$79.99**
Task list: ~~completed task~~ ✓
Rendered output:
Strikethrough text Regular text with strikethrough words Price: ~~
99.99
  
∗
∗
99.99  ∗∗79.99** Task list: completed task ✓

strikethrough
formatting
basic
text
Paragraphs and Line Breaks
Control text flow with paragraphs and line breaks.


First paragraph text.

Second paragraph text with
no break in rendered output.

Line with two spaces at end→  
Next line starts here.

Line with backslash\
Next line starts here.
Rendered output:
First paragraph text.

Second paragraph text with no break in rendered output.

Line with two spaces at end→
Next line starts here.

Line with backslash
Next line starts here.

paragraphs
formatting
basic
text
breaks
Blockquotes
Add single-line or multi-line quote blocks.


> Single line quote

> Multi-line quote
> continues here
> > Nested quote
> > goes deeper
>
> Back to first level
Rendered output:
Single line quote

Multi-line quote continues here

Nested quote goes deeper

Back to first level

quotes
formatting
text
Special Characters and Escaping
Display special characters and symbols in Markdown.


\* Not italic \*
\# Not a heading
\[Not a link\]
\> Not a quote

Escapable characters:
\  `  *  _  {}  []  ()  #  +  -  .  !  |

Copyright symbol: ©
Registered trademark: ®
Euro symbol: €
Rendered output:
* Not italic * # Not a heading [Not a link] > Not a quote

Escapable characters: \ ` * _ {} [] () # + - . ! |

Copyright symbol: © Registered trademark: ® Euro symbol: €

special characters
escaping
symbols
formatting
Inline Spoilers
Hide text with spoilers for platforms like Discord or GitHub.


||Hidden spoiler text||
Regular text with ||spoiler|| inside
Rendered output:
||Hidden spoiler text|| Regular text with ||spoiler|| inside

spoilers
formatting
text
Unordered Lists
Create bullet lists using asterisks, plus signs, or hyphens.


* First level item
* Another item
  * Second level item
  * Another nested item
    * Third level item
* Back to first level

+ Alternative bullet
- Another alternative

* Mixed indentation
  + Second level
    - Third level
Rendered output:
First level item
Another item
Second level item
Another nested item
Third level item
Back to first level
Alternative bullet
Another alternative
Mixed indentation
Second level
Third level
lists
bullets
indentation
formatting
Ordered Lists
Create numbered lists with automatic or manual numbering.


1. First item
2. Second item
   1. Nested item one
   2. Nested item two
3. Third item

1. Numbers can be
1. Any number and still
1. Display correctly

Manual numbering:
1. First
2. Second
   2.1. Sub-item
   2.2. Another sub-item
3. Third
Rendered output:
First item

Second item

Nested item one
Nested item two
Third item

Numbers can be

Any number and still

Display correctly

Manual numbering:

First
Second 2.1. Sub-item 2.2. Another sub-item
Third
lists
numbers
ordered
indentation
Task Lists
Create interactive checklists with checkboxes.


- [x] Completed task
    - [ ] Pending task
      - [x] Completed subtask
      - [ ] Pending subtask
    - [x] Another completed item
    
    * [x] Alternative syntax
    * [ ] For task lists
      * [x] Nested completion
Rendered output:
 Completed task

 Pending task
 Completed subtask
 Pending subtask
 Another completed item
 Alternative syntax
 For task lists
 Nested completion
tasks
checklists
todo
interactive
Definition Lists
Create term and definition pairs.


Term 1
: First definition
: Another definition

Term 2
: Single definition

Complex Term
: First line of definition
  continues on next line
: Second definition
Rendered output:
Term 1 : First definition : Another definition

Term 2 : Single definition

Complex Term : First line of definition continues on next line : Second definition

definitions
lists
formatting
Basic Tables
Create simple tables with basic alignment.


| Header 1 | Header 2 | Header 3 |
|----------|-----------|-----------|
| Cell 1   | Cell 2    | Cell 3    |
| Row 2    | Data      | Data      |

Simple Tables:
Header 1 | Header 2
---------|----------
Cell 1   | Cell 2
Cell 3   | Cell 4
Rendered output:
Header 1	Header 2	Header 3
Cell 1	Cell 2	Cell 3
Row 2	Data	Data
Simple Tables:

Header 1	Header 2
Cell 1	Cell 2
Cell 3	Cell 4
tables
basic
formatting
Advanced Tables
Create tables with alignment and formatting.


| Left | Center | Right |
|:-----|:------:|------:|
|Left  |Center  |Right  |
|Text  |Text    |Text   |

| Item | Description | Price |
|:-----|:------------|------:|
| Item1 | **Bold** description | $10.00 |
| Item2 | *Italic* description | $15.00 |
| Item3 | ~~Strike~~ price | $20.00 |
Rendered output:
Left	Center	Right
Left	Center	Right
Text	Text	Text
Item	Description	Price
Item1	Bold description	$10.00
Item2	Italic description	$15.00
Item3	Strike price	$20.00
tables
advanced
alignment
formatting
Complex Tables
Create tables with spans and formatting.


| Feature | Basic | Pro | Enterprise |
|---------|:-----:|:---:|:----------:|
| Storage | 10 GB ⚡ | 100 GB 🚀 | Unlimited 💫 |
| **Users** | 1 | 10 | Unlimited |
| *Speed* | Standard | Fast | Fastest |
| Support | ✅ | ✅ | ✅ |
| Custom Theme | ❌ | ✅ | ✅ |

Table with multi-line content:
| Header 1 | Header 2 |
|----------|----------|
| First line\n Second line | Single line |
| Single | Multi-line\n content |
Rendered output:
Feature	Basic	Pro	Enterprise
Storage	10 GB ⚡	100 GB 🚀	Unlimited 💫
Users	1	10	Unlimited
Speed	Standard	Fast	Fastest
Support	✅	✅	✅
Custom Theme	❌	✅	✅
Table with multi-line content:

Header 1	Header 2
First line\n Second line	Single line
Single	Multi-line\n content
tables
complex
multiline
formatting
Tables with LaTeX
Combine tables with LaTeX equations for scientific data.


| Variable | Formula | Value |
|:---------|:--------|------:|
| Energy   | $E = mc^2$ | 9.0 × 10^16 J |
| Force    | $F = ma$   | 100 N |
| Sum      | $$\sum_{i=1}^n i$$ | 5050 |
Rendered output:
Variable	Formula	Value
Energy	
E
=
m
c
2
E=mc 
2
 	9.0 × 10^16 J
Force	
F
=
m
a
F=ma	100 N
Sum	
∑
i
=
1
n
i
∑ 
i=1
n
​
 i	5050
tables
latex
scientific
formatting
Basic Links
Create various types of links and URLs.


[Basic Link](https://example.com)
[Link with Title](https://example.com "Website Title")
[Reference Link][ref]

[ref]: https://example.com

<https://example.com>
<user@example.com>

Plain URL: https://example.com
Rendered output:
Basic Link Link with Title Reference Link

https://example.com user@example.com

Plain URL: https://example.com

links
urls
references
basic
Images
Insert and format images in Markdown.


![Alt text](image.png)
![Alt with title](image.png "Image title")
[![Clickable image](thumbnail.png)](https://markdownlivepreview.dev)

[Reference style][logo]
[logo]: image.png "Logo Title"

<img src="image.png" width="200" height="100" alt="Sized image">
<img src="image.png" style="float: right" alt="Floating image">
Rendered output:
Alt textAlt with titleClickable image

[Reference style][logo] [logo]: image.png "Logo Title"

Sized imageFloating image
images
media
formatting
Basic Code
Display inline code and basic code blocks.


Inline `code` in text

```
Basic code block
No syntax highlighting
Multiple lines
```

    Indented code block
    4 spaces or 1 tab
    Preserves whitespace
Rendered output:
Inline code in text

Basic code block
No syntax highlighting
Multiple lines
Indented code block
4 spaces or 1 tab
Preserves whitespace
code
basic
formatting
Syntax Highlighted Code
Code blocks with language-specific highlighting.


```javascript
// JavaScript Example
function greeting(name) {
    return `Hello, ${name}!`;
}

const result = greeting('World');
console.log(result);
```

```python
# Python Example
def fibonacci(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a + b
```

```css
/* CSS Example */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
```
Rendered output:
// JavaScript Example
function greeting(name) {
    return `Hello, ${name}!`;
}

const result = greeting('World');
console.log(result);
# Python Example
def fibonacci(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a + b
/* CSS Example */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
code
syntax highlighting
programming
HTML Code Block
Display HTML code with syntax highlighting.


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
</body>
</html>
```
Rendered output:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
</body>
</html>
code
html
syntax highlighting
SQL Code Block
Display SQL queries with syntax highlighting.


```sql
SELECT first_name, last_name, email
FROM users
WHERE active = true
ORDER BY last_name ASC
LIMIT 10;
```
Rendered output:
SELECT first_name, last_name, email
FROM users
WHERE active = true
ORDER BY last_name ASC
LIMIT 10;
code
sql
database
syntax highlighting
Math and Equations
Write mathematical equations using LaTeX syntax.


Inline equation: $E = mc^2$

Block equation:
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

System of equations:
$$
\begin{cases}
x + y = 10 \\
2x - y = 5
\end{cases}
$$

Matrix:
$$
\begin{matrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{matrix}
$$
Rendered output:
Inline equation: 
E
=
m
c
2
E=mc 
2
 

Block equation:

−
b
±
b
2
−
4
a
c
2
a
2a
−b± 
b 
2
 −4ac
​
 
​
 
System of equations:

{
x
+
y
=
10
2
x
−
y
=
5
{ 
x+y=10
2x−y=5
​
 
Matrix:

1
2
3
4
5
6
7
8
9
1
4
7
​
  
2
5
8
​
  
3
6
9
​
 
math
equations
latex
formatting
Advanced LaTeX Equations
Use LaTeX for complex mathematical expressions like integrals and limits.


Integral: $$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$

Limit: $$\lim_{x \to \infty} \frac{1}{x} = 0$$

Greek symbols: $$\alpha + \beta = \gamma$$

Summation: $$\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}$$
Rendered output:
Integral: 
∫
0
∞
e
−
x
2
d
x
=
π
2
∫ 
0
∞
​
 e 
−x 
2
 
 dx= 
2
π
​
 
​
 

Limit: 
lim
⁡
x
→
∞
1
x
=
0
lim 
x→∞
​
  
x
1
​
 =0

Greek symbols: 
α
+
β
=
γ
α+β=γ

Summation: 
∑
n
=
1
∞
1
n
2
=
π
2
6
∑ 
n=1
∞
​
  
n 
2
 
1
​
 = 
6
π 
2
 
​
 

math
latex
advanced
equations
GitHub Specific Features
Special Markdown features for GitHub.


- [x] Task list item
- [ ] Open task
- [x] Completed task

```diff
- removed line
+ added line
```

> **Note**
> Special callout syntax

> **Warning**
> Warning callout

<!-- This is a comment -->

```yaml
name: CI
on: [push]
```
Rendered output:
 Task list item
 Open task
 Completed task
- removed line
+ added line
Note Special callout syntax

Warning Warning callout

name: CI
on: [push]
github
specific
features
integration
Special Containers
Create special content containers and callouts.


:::note
This is a note container
Multiple lines supported
:::

:::warning
Warning container
With multiple lines
:::

:::danger
Danger container
Important warning
:::

:::info
Information container
With details
:::

> **💡 Tip:** Special tip callout
> With multiple lines

> **⚠️ Warning:** Warning callout
> With details
Rendered output:
This is a note container Multiple lines supported

Warning container With multiple lines

Danger container Important warning

Information container With details

💡 Tip: Special tip callout With multiple lines

⚠️ Warning: Warning callout With details

containers
callouts
formatting
advanced
Advanced HTML Integration
Combine HTML with Markdown for advanced formatting.


<details>
<summary>Click to expand</summary>

- Markdown inside
- HTML container
- **Mixed** formatting
</details>

<div align="center">

# Centered Heading
Centered paragraph

</div>

<kbd>Ctrl</kbd> + <kbd>C</kbd>

<mark>Highlighted text</mark>

<sup>Superscript</sup> and <sub>subscript</sub>
Rendered output:
Click to expand
Centered Heading
Centered paragraph

Ctrl + C

Highlighted text

Superscript and subscript

html
integration
advanced
formatting
Subscript and Superscript
Format text as subscript or superscript using HTML or LaTeX.


HTML subscript: H<sub>2</sub>O
HTML superscript: x<sup>2</sup>

LaTeX subscript: $x_1$
LaTeX superscript: $x^2$
Rendered output:
HTML subscript: H2O HTML superscript: x2

LaTeX subscript: 
x
1
x 
1
​
  LaTeX superscript: 
x
2
x 
2
 

subscript
superscript
formatting
latex
README File Creation
Create professional README files for projects.


# Project Name

[![Build Status](https://img.shields.io/github/workflow/status/digitalpro/markdownlivepreview/CI)](https://github.com/digitalpro/markdownlivepreview/actions)
[![npm version](https://img.shields.io/npm/v/project.svg)](https://www.npmjs.com/package/project)

## Getting Started
```bash
npm install my-project
npm start
```

## Features
✨ Feature 1
🚀 Feature 2
💫 Feature 3

## Documentation
See our [cheat sheet guide](/cheatsheet) for Markdown syntax

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md)

## License
MIT © [Your Name]
Rendered output:
Project Name
Build Status npm version

Getting Started
npm install my-project
npm start
Features
✨ Feature 1 🚀 Feature 2 💫 Feature 3

Documentation
See our cheat sheet guide for Markdown syntax

Contributing
Please read CONTRIBUTING.md

License
MIT © [Your Name]

readme
documentation
github
project
Blog Post Writing
Format blog posts using Markdown.


---
title: "Blog Post Title"
date: 2024-01-01
author: "Your Name"
tags: ["tech", "tutorial"]
---

# Eye-catching Title

![Header Image](header.png)

## Introduction
Engaging opening paragraph...

### Key Points
1. First point with **emphasis**
2. Second point with *style*

> Quotable highlight text

## Code Example
```python
def example():
    print("Hello, readers!")
```

### Summary
Key takeaways...

---
*Originally published at [blog.com](https://blog.com)*
Rendered output:
title: "Blog Post Title" date: 2024-01-01 author: "Your Name" tags: ["tech", "tutorial"]
Eye-catching Title
Header Image

Introduction
Engaging opening paragraph...

Key Points
First point with emphasis
Second point with style
Quotable highlight text

Code Example
def example():
    print("Hello, readers!")
Summary
Key takeaways...

Originally published at blog.com

blogging
writing
content
Resume and CV
Create professional resumes using Markdown.


# John Doe
## Senior Software Engineer

> [john@email.com](mailto:john@email.com) | 
> [LinkedIn](https://linkedin.com/in/johndoe) |
> [GitHub](https://github.com/johndoe)

## Experience
### Senior Software Engineer
**Tech Company** *(2020 - Present)*
- Led team of 5 developers
- Implemented key features
- Reduced system latency by 40%

### Software Engineer
**Previous Company** *(2018 - 2020)*
- Developed core functionalities
- Collaborated with product team

## Skills
```
Languages: JavaScript, Python, Java
Frameworks: React, Node.js, Django
Tools: Git, Docker, AWS
```
Rendered output:
John Doe
Senior Software Engineer
john@email.com | LinkedIn | GitHub

Experience
Senior Software Engineer
Tech Company (2020 - Present)

Led team of 5 developers
Implemented key features
Reduced system latency by 40%
Software Engineer
Previous Company (2018 - 2020)

Developed core functionalities
Collaborated with product team
Skills
Languages: JavaScript, Python, Java
Frameworks: React, Node.js, Django
Tools: Git, Docker, AWS
resume
cv
professional
Technical Documentation
Advanced technical documentation features.


# Technical Documentation

## LaTeX Math
$$
\begin{align*}
E &= mc^2 \\
F &= ma
\end{align*}
$$

## API Documentation
```typescript
interface User {
  id: string;    // Unique identifier
  name: string;  // User's full name
  role: Role;    // User's role enum
}
```
Rendered output:
Technical Documentation
LaTeX Math
E
=
m
c
2
F
=
m
a
E
F
​
  
=mc 
2
 
=ma
​
 
API Documentation
interface User {
  id: string;    // Unique identifier
  name: string;  // User's full name
  role: Role;    // User's role enum
}
technical
documentation
math
Academic Writing
Academic and research writing in Markdown.


# Research Paper Title
## Abstract
Research summary...

## Introduction
### Background
Background information...

### Literature Review
Previous research...

## Methodology
### Research Design
- Data collection
- Analysis
- Results

### Data Analysis
$$
\chi^2 = \sum\frac{(O_i-E_i)^2}{E_i}
$$

## Results
| Variable | Group A | Group B |
|----------|---------|---------|
| X | 10.5 | 11.2 |
| Y | 20.1 | 19.8 |

## References
[^1]: Author, A. (2023). Title...
[^2]: Author, B. (2024). Title...
Rendered output:
Research Paper Title
Abstract
Research summary...

Introduction
Background
Background information...

Literature Review
Previous research...

Methodology
Research Design
Data collection
Analysis
Results
Data Analysis
χ
2
=
∑
(
O
i
−
E
i
)
2
E
i
χ 
2
 =∑ 
E 
i
​
 
(O 
i
​
 −E 
i
​
 ) 
2
 
​
 
Results
Variable	Group A	Group B
X	10.5	11.2
Y	20.1	19.8
References
academic
research
scientific
API Documentation
Document APIs using Markdown.


# API Documentation

## Authentication
```http
Authorization: Bearer <token>
```

## Endpoints

### GET /api/users
Retrieve users list.

#### Parameters
| Name | Type | Description |
|------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |

#### Response
```json
{
  "users": [],
  "total": 100
}
```

### POST /api/users
Create new user.

#### Request Body
```typescript
interface CreateUser {
  name: string;
  email: string;
}
```

#### Error Codes
| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
Rendered output:
API Documentation
Authentication
Authorization: Bearer <token>
Endpoints
GET /api/users
Retrieve users list.

Parameters
Name	Type	Description
page	number	Page number
limit	number	Items per page
Response
{
  "users": [],
  "total": 100
}
POST /api/users
Create new user.

Request Body
interface CreateUser {
  name: string;
  email: string;
}
Error Codes
Code	Description
400	Bad Request
401	Unauthorized
api
documentation
technical
Markdown to PDF Conversion
Methods and tools for converting Markdown to PDF format.


# Converting Markdown to PDF

## Built-in Tools
Use our **Markdown to PDF** tool in the Tools menu.

## Alternative Methods
- Pandoc: `pandoc file.md -o file.pdf`
- Prince: Online converter with CSS styling
- wkhtmltopdf: Command-line HTML to PDF
- Browser: File → Print → Save as PDF

## CSS Styling for PDF
```css
@media print {
  body { font-family: serif; }
  h1 { page-break-before: always; }
}
```

Try our online **Markdown to PDF converter** for instant results.
Rendered output:
Converting Markdown to PDF
Built-in Tools
Use our Markdown to PDF tool in the Tools menu.

Alternative Methods
Pandoc: pandoc file.md -o file.pdf
Prince: Online converter with CSS styling
wkhtmltopdf: Command-line HTML to PDF
Browser: File → Print → Save as PDF
CSS Styling for PDF
@media print {
  body { font-family: serif; }
  h1 { page-break-before: always; }
}
Try our online Markdown to PDF converter for instant results.

pdf
converter
export
tools
Markdown File Management
Working with .md files and file operations.


# Working with Markdown Files

## File Extensions
- `.md` - Standard Markdown
- `.markdown` - Alternative extension
- `.mdown` - Another variant
- `.mkd` - Short variant

## File Operations
### Creating Files
```bash
touch README.md
echo "# My Project" > README.md
```

### File Structure
```
project/
├── README.md
├── docs/
│   ├── api.md
│   └── guide.md
└── src/
```

Use our **file upload** feature to work with existing .md files.
Rendered output:
Working with Markdown Files
File Extensions
.md - Standard Markdown
.markdown - Alternative extension
.mdown - Another variant
.mkd - Short variant
File Operations
Creating Files
touch README.md
echo "# My Project" > README.md
File Structure
project/
├── README.md
├── docs/
│   ├── api.md
│   └── guide.md
└── src/
Use our file upload feature to work with existing .md files.

files
management
extension
basic
Markdown Editor Features
Essential features to look for in Markdown editors.


# Markdown Editor Features

## Essential Features
- [x] **Live Preview** - Real-time rendering
- [x] **Syntax Highlighting** - Color-coded syntax  
- [x] **Split View** - Side-by-side editing
- [x] **Export Options** - PDF, HTML, Word
- [x] **File Management** - Upload/download support

## Advanced Features
- [ ] Table editing assistance
- [ ] Math equation support (LaTeX)
- [ ] Diagram support (Mermaid)
- [ ] Collaboration tools
- [ ] Version control integration

## Our Editor
**MarkdownLivePreview.dev** includes:
✅ Live preview ✅ File upload ✅ PDF export
✅ LaTeX math ✅ Table generator ✅ Free to use

Try our **online markdown editor** now!
Rendered output:
Markdown Editor Features
Essential Features
 Live Preview - Real-time rendering
 Syntax Highlighting - Color-coded syntax
 Split View - Side-by-side editing
 Export Options - PDF, HTML, Word
 File Management - Upload/download support
Advanced Features
 Table editing assistance
 Math equation support (LaTeX)
 Diagram support (Mermaid)
 Collaboration tools
 Version control integration
Our Editor
MarkdownLivePreview.dev includes: ✅ Live preview ✅ File upload ✅ PDF export ✅ LaTeX math ✅ Table generator ✅ Free to use

Try our online markdown editor now!

editor
features
tools
online
Markdown Syntax Quick Reference
Most commonly used Markdown syntax at a glance.


# Markdown Syntax Quick Reference

## Text Formatting
`**bold**` → **bold**
`*italic*` → *italic*
`~~strike~~` → ~~strike~~

## Headers
`# H1` → # Header 1
`## H2` → ## Header 2  
`### H3` → ### Header 3

## Lists
`- item` → • item
`1. item` → 1. item
`- [ ] task` → ☐ task

## Links & Images
`[text](url)` → [text](url)
`![alt](img.jpg)` → image

## Code
``code`` → `code`
```python` → code block

Perfect for quick lookups and syntax checking!
Rendered output:
Markdown Syntax Quick Reference
Text Formatting
**bold** → bold *italic* → italic ~~strike~~ → strike

Headers
# H1 → # Header 1 ## H2 → ## Header 2
### H3 → ### Header 3

Lists
- item → • item 1. item → 1. item - [ ] task → ☐ task

Links & Images
[text](url) → text ![alt](img.jpg) → image

Code
code → code ```python` → code block

Perfect for quick lookups and syntax checking!

syntax
reference
quick
basic
Markdown Table Generator Guide
Creating and formatting tables efficiently.


# Markdown Table Creation

## Basic Table
```
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## Table with Alignment
```
| Left | Center | Right |
|:-----|:------:|------:|
| L    | C      | R     |
```

## Pro Tips
- Use our **Table Generator** tool for complex tables
- Align pipes for better readability
- Test in live preview before finalizing

## Common Patterns
| Use Case | Syntax |
|----------|--------|
| Product comparison | Features in rows |
| Data display | Numbers right-aligned |
| Status tracking | Center-align status |

Try our **markdown table generator** for instant table creation!
Rendered output:
Markdown Table Creation
Basic Table
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
Table with Alignment
| Left | Center | Right |
|:-----|:------:|------:|
| L    | C      | R     |
Pro Tips
Use our Table Generator tool for complex tables
Align pipes for better readability
Test in live preview before finalizing
Common Patterns
Use Case	Syntax
Product comparison	Features in rows
Data display	Numbers right-aligned
Status tracking	Center-align status
Try our markdown table generator for instant table creation!

tables
generator
formatting
tools
Markdown Formatting Examples
Complete formatting examples for common use cases.


# Markdown Formatting Examples

## Text Styles
**Bold text** for emphasis
*Italic text* for subtle emphasis  
~~Strikethrough~~ for corrections
`Inline code` for technical terms

## Document Structure
# Main Title
## Section Header
### Subsection
#### Minor Section

## Lists and Tasks
- [x] Completed task
- [ ] Pending task
- Regular bullet point

1. First step
2. Second step
3. Final step

## Quotes and Code
> "Markdown makes writing for the web fast and easy."

```javascript
function hello() {
    console.log("Hello, Markdown!");
}
```

Perfect examples for learning **markdown formatting**!
Rendered output:
Markdown Formatting Examples
Text Styles
Bold text for emphasis Italic text for subtle emphasis
Strikethrough for corrections Inline code for technical terms

Document Structure
Main Title
Section Header
Subsection
Minor Section
Lists and Tasks
 Completed task
 Pending task
Regular bullet point
First step
Second step
Final step
Quotes and Code
"Markdown makes writing for the web fast and easy."

function hello() {
    console.log("Hello, Markdown!");
}
Perfect examples for learning markdown formatting!

formatting
examples
basic
reference