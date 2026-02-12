# PDF Export Style Differences

## Overview
Each style now has distinct characteristics that make them clearly different from each other.

---

## 🎨 GitBook Style
**Character:** Clean, modern, spacious, professional

### Key Features:
- **Margins:** 20mm (most spacious)
- **Font Family:** Helvetica (clean sans-serif)
- **Font Sizes:**
  - H1: 14pt (largest)
  - H2: 12pt
  - H3: 11pt
  - Paragraph: 9pt (larger for readability)
  - Table: 9pt
- **Line Spacing:** 1.8 (most spacious)
- **Heading Spacing:** 1.5 (generous)

### Table Style:
- **Borders:** ALL (horizontal + vertical grid)
- **Border Weight:** 0.3 (thickest)
- **Border Color:** #e0e0e0 (light gray)
- **Header Background:** #f5f5f5 (subtle gray)

### Other Features:
- **Links:** Dark gray (80, 80, 80)
- **Code Background:** Yes (#f8f8f8)
- **Blockquote Border:** Yes (#d0d0d0)

**Best For:** Documentation, guides, professional reports

---

## 💻 VSCode Style
**Character:** Compact, technical, minimal, code-focused

### Key Features:
- **Margins:** 15mm (standard)
- **Font Family:** Courier (monospace - technical feel)
- **Font Sizes:**
  - H1: 12pt
  - H2: 11pt
  - H3: 10pt
  - Paragraph: 8pt (compact)
  - Table: 8pt
  - Code: 7pt (smallest)
- **Line Spacing:** 1.4 (most compact)
- **Heading Spacing:** 1.2 (tight)

### Table Style:
- **Borders:** HORIZONTAL only
- **Border Weight:** 0.2 (medium)
- **Border Color:** #cccccc (medium gray)
- **Header Background:** NONE (no background)

### Other Features:
- **Links:** Dark gray (60, 60, 60)
- **Code Background:** No (clean)
- **Blockquote Border:** No

**Best For:** Technical documentation, code-heavy documents, API docs

---

## 📄 GitHub Style
**Character:** Traditional, balanced, professional, familiar

### Key Features:
- **Margins:** 15mm (standard)
- **Font Family:** Helvetica (classic)
- **Font Sizes:**
  - H1: 13pt
  - H2: 11pt
  - H3: 10pt
  - Paragraph: 8pt (standard)
  - Table: 8pt
- **Line Spacing:** 1.5 (balanced)
- **Heading Spacing:** 1.3 (moderate)

### Table Style:
- **Borders:** HORIZONTAL only
- **Border Weight:** 0.15 (thin)
- **Border Color:** #d0d0d0 (light gray)
- **Header Background:** #fafafa (very subtle gray)

### Other Features:
- **Links:** Dark gray (70, 70, 70)
- **Code Background:** Yes (#f6f6f6)
- **Blockquote Border:** Yes (#ddd)

**Best For:** README files, general documentation, markdown exports

---

## Visual Comparison

### Spacing
```
GitBook:  ████████████████████ (most spacious)
GitHub:   ███████████████      (balanced)
VSCode:   ████████████         (most compact)
```

### Font Sizes
```
GitBook:  ████████████████ (largest)
GitHub:   ██████████████   (medium)
VSCode:   ████████████     (smallest)
```

### Table Borders
```
GitBook:  ┌─┬─┬─┐  (full grid)
          ├─┼─┼─┤
          └─┴─┴─┘

GitHub:   ─────────  (horizontal only, thin)
          ─────────

VSCode:   ═════════  (horizontal only, medium, no header bg)
          ─────────
```

### Font Families
```
GitBook:  Helvetica (clean, modern)
GitHub:   Helvetica (classic, familiar)
VSCode:   Courier   (monospace, technical)
```

---

## Color Palette (All Gray - Professional)

### GitBook
- Border: #e0e0e0 (light gray)
- Header BG: #f5f5f5 (subtle gray)
- Code BG: #f8f8f8 (very light gray)
- Links: rgb(80, 80, 80) (dark gray)

### VSCode
- Border: #cccccc (medium gray)
- Header BG: none
- Code BG: none
- Links: rgb(60, 60, 60) (darker gray)

### GitHub
- Border: #d0d0d0 (light gray)
- Header BG: #fafafa (barely visible gray)
- Code BG: #f6f6f6 (very light gray)
- Links: rgb(70, 70, 70) (dark gray)

---

## When to Use Each Style

### Use GitBook when:
- Creating professional documentation
- Need maximum readability
- Want a modern, clean look
- Document will be printed
- Need clear table structure

### Use VSCode when:
- Writing technical/API documentation
- Document is code-heavy
- Want compact, efficient layout
- Targeting developer audience
- Need to fit more content per page

### Use GitHub when:
- Exporting README files
- General purpose documentation
- Want familiar markdown look
- Balanced between readability and density
- Standard professional documents

---

## Key Improvements Made

✅ **Removed all blue colors** - Now using professional gray tones
✅ **Made styles truly distinct** - Each has unique characteristics
✅ **Different font families** - VSCode uses Courier for technical feel
✅ **Varied spacing** - GitBook spacious, VSCode compact, GitHub balanced
✅ **Different table styles** - GitBook has full grid, others horizontal only
✅ **Unique font sizes** - Each style has different hierarchy
✅ **VSCode has no backgrounds** - Clean, minimal approach
✅ **Clear use cases** - Each style serves different needs
