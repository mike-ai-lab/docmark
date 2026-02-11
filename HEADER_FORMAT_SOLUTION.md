# Solution: Full-Width Header with Date

## The Problem
The table-based header doesn't span full width - it stops short on the right side.

## The Solution
Use a combination of heading and right-aligned div:

---

# Commercial Cost Breakdown Report

<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">11 Feb 2026</div>

---

## How It Works

1. **H1 heading** creates the title on the left
2. **Negative margin** (`margin-top: -40px`) pulls the date up to align with title
3. **Right alignment** (`text-align: right`) puts date on the right
4. **Full width** - No table constraints, spans entire width

## Complete Example

```markdown
# Commercial Cost Breakdown Report

<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">11 Feb 2026</div>

## Project Details
**Regions:** Riyadh – Al Qassim – Hail  
**Project Type:** Small-scale commercial (MOMRAH regulated)  

---

## Your content here...
```

## Alternative: Horizontal Rule Above

If you want a line under the header:

```markdown
# Commercial Cost Breakdown Report

<div style="text-align: right; margin-top: -40px; margin-bottom: 10px; color: #666; font-size: 0.9em;">11 Feb 2026</div>

---

## Project Details
```

## For Footer (Full Width)

```markdown
---

<div style="display: flex; justify-content: space-between; margin-top: 20px;">
  <div>
    <strong>SIGNATURE</strong><br>
    <span style="color: #666;">Commercial Cost Breakdown Report</span>
  </div>
  <div style="text-align: right;">
    <strong>CLIENT</strong><br>
    <span style="color: #666;">11 Feb 2026</span>
  </div>
</div>
```

## Why This Works

✅ **Full width** - No table width constraints  
✅ **Works in renderer** - CSS positioning supported  
✅ **Works in PDF** - Simple layout, no complex CSS  
✅ **Clean markdown** - Easy to read and edit  
✅ **Flexible** - Easy to adjust spacing  

## Updated Insert Header Button

The "+ Header" button should insert this format instead of the table.

---

**Test it below:**

