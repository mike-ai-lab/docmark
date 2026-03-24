# Visual Guide: Line-Based Pagination System

## The Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    .page-container                       │
│                  (Full A4: 210mm × 297mm)               │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              TOP MARGIN (25mm)                  │    │
│  ├────────────────────────────────────────────────┤    │
│  │ L │  .content-clip (overflow: hidden)      │ R │    │
│  │ E │  ┌──────────────────────────────────┐  │ I │    │
│  │ F │  │     .content-text                │  │ G │    │
│  │ T │  │  Line 1: Content here...         │  │ H │    │
│  │   │  │  Line 2: More content...         │  │ T │    │
│  │ M │  │  Line 3: Even more...            │  │   │    │
│  │ A │  │  ...                             │  │ M │    │
│  │ R │  │  Line 41: Last line on page      │  │ A │    │
│  │ G │  │  ─────────────────────────────── │  │ R │    │
│  │ I │  │  Line 42: CLIPPED (hidden)       │  │ G │    │
│  │ N │  │  Line 43: CLIPPED (hidden)       │  │ I │    │
│  │   │  └──────────────────────────────────┘  │ N │    │
│  │   │                                         │   │    │
│  ├────────────────────────────────────────────────┤    │
│  │            BOTTOM MARGIN (25mm)                 │    │
│  │              [unused: 14.6px]                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│              Page 1 of 3                                 │
└─────────────────────────────────────────────────────────┘
```

---

## How Content Flows Across Pages

### Page 1 (offset: 0px)
```
┌─────────────────────┐
│ Line 1              │ ← Visible
│ Line 2              │ ← Visible
│ ...                 │
│ Line 41             │ ← Visible (last line)
├─────────────────────┤ ← Clip boundary
│ Line 42             │ ← Hidden by overflow
│ Line 43             │ ← Hidden by overflow
└─────────────────────┘
```

### Page 2 (offset: -918.4px)
```
┌─────────────────────┐
│ Line 1              │ ← Hidden (above clip)
│ ...                 │
│ Line 41             │ ← Hidden (above clip)
├─────────────────────┤ ← Clip boundary (top)
│ Line 42             │ ← Visible (first line)
│ Line 43             │ ← Visible
│ ...                 │
│ Line 82             │ ← Visible (last line)
├─────────────────────┤ ← Clip boundary (bottom)
│ Line 83             │ ← Hidden (below clip)
└─────────────────────┘
```

### Page 3 (offset: -1836.8px)
```
┌─────────────────────┐
│ Line 1-82           │ ← Hidden (above clip)
├─────────────────────┤ ← Clip boundary (top)
│ Line 83             │ ← Visible (first line)
│ Line 84             │ ← Visible
│ ...                 │
│ Line 120            │ ← Visible (last line)
│                     │ ← Empty space (OK!)
└─────────────────────┘
```

---

## The Math Behind It

### Step 1: Measure
```
Font size: 14px
Line height: 1.6
Computed line height: 14 × 1.6 = 22.4px
```

### Step 2: Calculate Available Space
```
Page height:    297mm = 1122px
Top margin:      25mm =   94.5px
Bottom margin:   25mm =   94.5px
─────────────────────────────────
Available:              933px
```

### Step 3: Calculate Complete Lines
```
Lines per page = floor(933 / 22.4)
               = floor(41.65)
               = 41 lines ✅
```

### Step 4: Calculate Exact Content Height
```
Exact height = 41 × 22.4
             = 918.4px
```

### Step 5: Calculate Unused Space
```
Unused = 933 - 918.4
       = 14.6px (at bottom) ✅
```

---

## What Happens When You Change Margins

### Scenario 1: Increase Bottom Margin (25mm → 30mm)

**Before:**
```
Available: 933px
Lines: 41
Content: 918.4px
Unused: 14.6px
```

**After:**
```
Available: 914px (933 - 19px)
Lines: 40 (floor(914 / 22.4))
Content: 896px (40 × 22.4)
Unused: 18px
```

**Result:** You LOSE 1 line per page ✅

---

### Scenario 2: Set All Margins to 0mm

**Before:**
```
Available: 933px
Lines: 41
```

**After:**
```
Available: 1122px (full page)
Lines: 50 (floor(1122 / 22.4))
Content: 1120px (50 × 22.4)
Unused: 2px
```

**Result:** You GAIN 9 lines per page ✅
**Footer:** Still visible (fixed position at bottom)

---

## The Clipping Mechanism

### Without `overflow: hidden` (BROKEN)
```
┌─────────────────────┐
│ Line 40             │
│ Line 41             │
├─────────────────────┤ ← Margin boundary
│ Line 42             │ ← VISIBLE (BAD!)
│ Line 43             │ ← VISIBLE (BAD!)
└─────────────────────┘
   Content overflows into margin ❌
```

### With `overflow: hidden` (CORRECT)
```
┌─────────────────────┐
│ Line 40             │
│ Line 41             │
├─────────────────────┤ ← Margin boundary
│ [CLIPPED]           │ ← HIDDEN ✅
│ [CLIPPED]           │ ← HIDDEN ✅
└─────────────────────┘
   Content respects margin ✅
```

---

## Transform Offset Visualization

### How `translateY()` Works

**Page 1:**
```css
transform: translateY(0px);
```
```
┌─────────────┐
│ ┌─────────┐ │ ← Viewport (clip area)
│ │ Line 1  │ │
│ │ Line 2  │ │
│ │ ...     │ │
│ └─────────┘ │
└─────────────┘
```

**Page 2:**
```css
transform: translateY(-918.4px);
```
```
┌─────────────┐
│ [Line 1-41] │ ← Shifted up (hidden)
│ ┌─────────┐ │ ← Viewport (clip area)
│ │ Line 42 │ │
│ │ Line 43 │ │
│ │ ...     │ │
│ └─────────┘ │
└─────────────┘
```

**Page 3:**
```css
transform: translateY(-1836.8px);
```
```
┌─────────────┐
│ [Line 1-82] │ ← Shifted up (hidden)
│ ┌─────────┐ │ ← Viewport (clip area)
│ │ Line 83 │ │
│ │ Line 84 │ │
│ │ ...     │ │
│ └─────────┘ │
└─────────────┘
```

---

## Comparison: Old vs New System

### Old System (Element Distribution)
```
┌─────────────┐
│ <p>Line 1</p>│ ← Measure
│ <p>Line 2</p>│ ← Measure
│ <p>Line 3</p>│ ← Measure
│ ...          │
│ <p>Line 41</p>│ ← Fits!
│ <p>Line 42</p>│ ← Doesn't fit, move to next page
└─────────────┘

Problems:
❌ Complex logic
❌ Breaks with large paragraphs
❌ Can clip partial lines
❌ Slow with many elements
```

### New System (Offset-Based)
```
┌─────────────┐
│ [All content]│ ← Single measurement
│ translateY() │ ← Simple offset
│ overflow:    │ ← Clips automatically
│   hidden     │
└─────────────┘

Benefits:
✅ Simple logic
✅ Handles any content
✅ Never clips partial lines
✅ Fast rendering
```

---

## The "Unused Space" is Normal

### Word/Google Docs Behavior
```
┌─────────────────────┐
│ Last line of content│
│                     │ ← Empty space
│                     │ ← Empty space
│                     │ ← Empty space
├─────────────────────┤
│   Bottom Margin     │
└─────────────────────┘
```

**This is CORRECT behavior!**
- Professional word processors do this
- Alternative is clipping lines (BAD)
- Users don't notice small gaps
- It's part of the margin area

---

## Summary Diagram

```
┌──────────────────────────────────────────────┐
│  INPUT: Content + Margins                    │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  MEASURE: Line height + Total height         │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  CALCULATE: Lines per page (floor division)  │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  RENDER: Pages with offset + clipping        │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  OUTPUT: Perfect pagination, no clipped lines│
└──────────────────────────────────────────────┘
```

---

**Key Takeaway:** The system is simple, predictable, and reliable because it respects the fundamental unit of text: **the line**.
