# User Guide: Easy Formatting Features

This guide shows you how to use the new user-friendly features. No coding knowledge needed!

---

## Feature 1: Print to PDF Button

**What it does:** Creates a perfect PDF that matches exactly what you see in the preview.

**How to use:**
1. Write your markdown content
2. Click the **"Print to PDF"** button in the toolbar
3. A new window opens with your document
4. The browser print dialog appears automatically
5. Choose "Save as PDF" or print directly

**Benefits:**
- ✅ Perfect match with preview
- ✅ All formatting preserved (tables, colors, styles)
- ✅ Works with all three styles (GitHub, GitBook, VSCode)

---

## Feature 2: Quick Insert Buttons

**What they do:** Add common formatting with one click - no HTML knowledge needed!

### + Header Button
Inserts a professional header with title and date:
- Title on the left
- Today's date on the right
- Works in both preview and PDF export

**How to use:**
1. Click **"+ Header"** button
2. Edit "Document Title" to your title
3. Date is added automatically

### + Footer Button
Inserts a professional footer with signature section:
- Signature section on left
- Client section on right
- Today's date included

**How to use:**
1. Click **"+ Footer"** button
2. Edit "SIGNATURE" and "CLIENT" text as needed
3. Date is added automatically

### + Break Button
Inserts a horizontal line separator:
- Creates visual separation between sections
- Works everywhere

**How to use:**
1. Click **"+ Break"** button
2. A horizontal line appears

---

## Feature 3: YAML Metadata (Auto Headers/Footers)

**What it does:** Automatically generates headers and footers from simple text at the top of your document.

**How to use:**

Add this at the very top of your markdown file:

```
---
title: Commercial Cost Breakdown Report
date: 11 Feb 2026
footer-left: SIGNATURE
footer-right: CLIENT
---
```

Then write your content below. The header and footer are generated automatically!

**Example:**

```markdown
---
title: Project Proposal
date: 15 March 2026
footer-left: PREPARED BY
footer-right: APPROVED BY
---

## Introduction

Your content here...
```

**Result:**
- Header with "Project Proposal" on left, "15 March 2026" on right
- Footer with "PREPARED BY" on left, "APPROVED BY" on right
- All automatic!

---

## Which Method Should I Use?

### For Quick Documents:
Use **+ Header** and **+ Footer** buttons - fastest!

### For Templates:
Use **YAML metadata** - write once, reuse many times

### For Perfect PDFs:
Use **Print to PDF** button - always gives perfect results

---

## Tips & Tricks

1. **Line Breaks:**
   - Single Enter = new line (no gap)
   - Double Enter = new paragraph (with gap)
   - Use **+ Break** button for horizontal lines

2. **Dates:**
   - Buttons use today's date automatically
   - YAML metadata lets you set any date
   - Format: "11 Feb 2026" or "2026-02-11"

3. **Editing Templates:**
   - After clicking **+ Header** or **+ Footer**, just edit the text
   - Don't worry about the HTML code - just change the words you see

4. **PDF Export:**
   - **Export PDF** button = jsPDF (simple, fast)
   - **Print to PDF** button = browser print (perfect quality)
   - Both work great!

---

## Example: Complete Document

```markdown
---
title: Commercial Cost Breakdown Report
date: 11 Feb 2026
footer-left: SIGNATURE
footer-right: CLIENT
---

## Project Details
**Regions:** Riyadh – Al Qassim – Hail  
**Project Type:** Small-scale commercial  

---

## 1. External Cement Plaster

| Supplier | Product | Price (SAR) |
| --- | --- | --- |
| Madar | Premix Plaster | 24.15 |
| Al Rajhi | Ready Mix | 19.50 |

---

## Summary

* Prices reflect real B2B supplier data
* Add 10% for waste and transport
```

This creates a professional document with:
- Header with title and date
- Your content in the middle
- Footer with signature sections
- All formatting works in preview and PDF!

---

## Need Help?

- Click buttons to see what they do
- Edit the inserted text to customize
- Use **Print to PDF** for best results
- YAML metadata is optional - buttons work great too!

**No coding knowledge needed - just click and edit!** 🎉
