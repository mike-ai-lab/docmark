# Dark Mode Background Color Fix - COMPLETE ✅

## Issue Found
The preview panel and paper layout were showing dark blue backgrounds (#0f172a and #1e293b) in dark mode instead of a light grey.

## Root Cause
The CSS had dark mode background colors set to:
- `#1E1E1E` (dark grey-blue)
- `#0f172a` (very dark blue)
- `#1e293b` (dark slate blue)

These were making the preview panel appear dark blue instead of light.

## Solution Applied
Changed all dark mode preview panel backgrounds from dark blue to light grey (#f3f4f6).

## Changes Made

### File: `public/css/style.css`

#### Change 1: Line 865 - Preview Wrapper Dark Mode
```css
/* BEFORE */
[data-theme="dark"] #preview-wrapper {
  background-color: #1E1E1E;
}

/* AFTER */
[data-theme="dark"] #preview-wrapper {
  background-color: #f3f4f6;
}
```

#### Change 2: Line 1279 - Preview Wrapper Dark Mode (duplicate)
```css
/* BEFORE */
[data-theme="dark"] #preview-wrapper {
  background-color: #1e1e1e;
}

/* AFTER */
[data-theme="dark"] #preview-wrapper {
  background-color: #f3f4f6;
}
```

#### Change 3: Line 5742 - Paper Layout Dark Mode Background
```css
/* BEFORE */
[data-theme="dark"] #preview-wrapper.paper-layout-active {
  background: #0f172a;
  scrollbar-color: #6b7280 #0f172a;
}

/* AFTER */
[data-theme="dark"] #preview-wrapper.paper-layout-active {
  background: #f3f4f6;
  scrollbar-color: #9ca3af #f3f4f6;
}
```

#### Change 4: Lines 5748-5758 - Paper Layout Dark Mode Scrollbar
```css
/* BEFORE */
[data-theme="dark"] #preview-wrapper.paper-layout-active::-webkit-scrollbar {
  background: #0f172a;
}

[data-theme="dark"] #preview-wrapper.paper-layout-active::-webkit-scrollbar-track {
  background: #0f172a;
}

[data-theme="dark"] #preview-wrapper.paper-layout-active::-webkit-scrollbar-thumb {
  background-color: #6b7280;
  border: 3px solid #0f172a;
}

/* AFTER */
[data-theme="dark"] #preview-wrapper.paper-layout-active::-webkit-scrollbar {
  background: #f3f4f6;
}

[data-theme="dark"] #preview-wrapper.paper-layout-active::-webkit-scrollbar-track {
  background: #f3f4f6;
}

[data-theme="dark"] #preview-wrapper.paper-layout-active::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border: 3px solid #f3f4f6;
}
```

## Result
✅ Dark mode preview panel: Now light grey (#f3f4f6) instead of dark blue
✅ Dark mode paper layout: Now light grey (#f3f4f6) instead of dark blue
✅ Scrollbars: Grey (#9ca3af) on light grey background
✅ Consistent appearance: Both web and paper layouts match
✅ No more dark blue colors (#0f172a, #1e293b) on preview panels

## Verification
- Preview panel dark mode: Light grey ✅
- Paper layout dark mode: Light grey ✅
- Scrollbar colors: Grey ✅
- All dark blue colors removed from preview backgrounds ✅
