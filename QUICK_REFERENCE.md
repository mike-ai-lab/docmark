# Quick Reference: New Features

## 🖨️ Print to PDF
**Button:** "Print to PDF"  
**Result:** Opens browser print dialog with perfect preview match  
**Use when:** You want exact preview styling in PDF

---

## ➕ Quick Insert Buttons

### + Header
```
Inserts:
┌─────────────────────────────────────────┐
│ Document Title          │    11 Feb 2026 │
└─────────────────────────────────────────┘
```
**Edit:** Change "Document Title" to your title

### + Footer
```
Inserts:
─────────────────────────────────────────
SIGNATURE              CLIENT
Document Name          11 Feb 2026
```
**Edit:** Change "SIGNATURE", "CLIENT", "Document Name"

### + Break
```
Inserts:
─────────────────────────────────────────
```
**Use:** Separate sections visually

---

## 📝 YAML Metadata (Auto Headers/Footers)

**Add at top of file:**
```yaml
---
title: Your Document Title
date: 11 Feb 2026
footer-left: SIGNATURE
footer-right: CLIENT
---
```

**Then write your content below!**

Header and footer appear automatically.

---

## 📋 Line Break Cheat Sheet

| What You Type | What You Get |
|---|---|
| Single Enter | New line (no gap) |
| Double Enter | New paragraph (gap) |
| `---` | Horizontal line |
| **+ Break** button | Horizontal line |
| `<br>` | Line break |

---

## 💡 Pro Tips

1. **For perfect PDFs:** Use "Print to PDF" button
2. **For quick formatting:** Use + Header, + Footer, + Break buttons
3. **For templates:** Use YAML metadata at top
4. **Dates auto-update:** Buttons use today's date
5. **Edit freely:** After inserting, just change the text you see

---

## 🎯 Common Tasks

### Add header with date
1. Click **+ Header**
2. Edit title
3. Done!

### Add footer with signature
1. Click **+ Footer**
2. Edit names
3. Done!

### Create perfect PDF
1. Click **Print to PDF**
2. Choose "Save as PDF"
3. Done!

### Use template
1. Add YAML at top:
   ```
   ---
   title: My Report
   date: 11 Feb 2026
   ---
   ```
2. Write content
3. Done!

---

## ❓ FAQ

**Q: Which PDF button should I use?**  
A: "Print to PDF" for perfect quality, "Export PDF" for quick export

**Q: Do I need to know HTML?**  
A: No! Just click buttons and edit text

**Q: Can I edit the inserted templates?**  
A: Yes! Just change the text you see

**Q: What if I don't want a footer?**  
A: Don't click the button or don't add footer metadata

**Q: How do I change the date?**  
A: Edit it after inserting, or set it in YAML metadata

---

**No coding needed - just click and edit!** ✨
