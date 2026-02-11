# Test 1: Using table with right-aligned cell

<table style="width: 100%; border: none;">
<tr style="border: none;">
<td style="border: none; text-align: left;"><h1 style="margin: 0; border: none;">Commercial Cost Breakdown Report</h1></td>
<td style="border: none; text-align: right; vertical-align: bottom; white-space: nowrap; color: #666;">11 Feb 2026</td>
</tr>
</table>

---

# Test 2: Using flexbox (should work)

<div style="display: flex; justify-content: space-between; align-items: baseline; width: 100%;">
  <h1 style="margin: 0; border: none;">Commercial Cost Breakdown Report</h1>
  <span style="color: #666; white-space: nowrap; font-size: 0.9em;">11 Feb 2026</span>
</div>

---

# Test 3: Using grid layout

<div style="display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: baseline; width: 100%;">
  <h1 style="margin: 0; border: none;">Commercial Cost Breakdown Report</h1>
  <span style="color: #666; white-space: nowrap; font-size: 0.9em;">11 Feb 2026</span>
</div>

---

# Test 4: Absolute positioning with relative parent

<div style="position: relative; min-height: 60px;">
  <h1 style="margin: 0; border: none;">Commercial Cost Breakdown Report</h1>
  <span style="position: absolute; top: 0; right: 0; color: #666; font-size: 0.9em;">11 Feb 2026</span>
</div>

---

# Test 5: Simple right-aligned div above heading

<div style="text-align: right; color: #666; font-size: 0.9em; margin-bottom: -10px;">11 Feb 2026</div>

# Commercial Cost Breakdown Report

---

# Test 6: Using margin-left auto (inline-block)

<div style="width: 100%;">
  <h1 style="display: inline-block; margin: 0; border: none;">Commercial Cost Breakdown Report</h1>
  <span style="display: inline-block; margin-left: auto; float: right; color: #666; font-size: 0.9em;">11 Feb 2026</span>
</div>
<div style="clear: both;"></div>

---

# Test 7: Two-column table (no borders, no padding)

| Commercial Cost Breakdown Report | <div style="text-align: right;">11 Feb 2026</div> |
|:---|---:|
| | |

(Note: This creates a table but might look cleaner)

---

# Test 8: Using text-align on parent

<div style="text-align: right;">
  <h1 style="display: inline-block; text-align: left; margin: 0; border: none; width: 70%;">Commercial Cost Breakdown Report</h1>
  <span style="display: inline-block; color: #666; font-size: 0.9em; width: 28%;">11 Feb 2026</span>
</div>

---

## Which one works best?

Test each one in the preview to see which renders correctly!
