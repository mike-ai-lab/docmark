# External CSS Loading Guide

## 🎯 Problem Solved

When your HTML references external CSS files, they won't load in the iframe preview because the paths are relative to the HTML file location, not the app.

## ✅ Solution: CSS Comment Syntax

Add special comments at the **top of your HTML** to specify CSS file paths:

```html
<!-- CSS: path/to/your/file.css -->
<!-- CSS: another/file.css -->
<!DOCTYPE html>
<html>
...
```

---

## 📝 Syntax

### Basic Format
```html
<!-- CSS: path/to/file.css -->
```

### Multiple Files
```html
<!-- CSS: public/css/style.css -->
<!-- CSS: public/css/github-markdown-light.css -->
<!-- CSS: https://cdn.example.com/library.css -->
```

### Rules:
- Must be at the **top of the file** (before `<!DOCTYPE>` or `<html>`)
- One CSS file per comment
- Supports both relative and absolute paths
- Supports CDN URLs (https://)

---

## 🔧 How It Works

1. **Parser** scans for `<!-- CSS: ... -->` comments
2. **Extracts** all CSS file paths
3. **Removes** the comments from HTML
4. **Injects** `<link>` tags into `<head>`
5. **Renders** HTML with CSS loaded

### Example Transformation:

**Your HTML:**
```html
<!-- CSS: public/css/style.css -->
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello</h1>
</body>
</html>
```

**Rendered as:**
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/public/css/style.css">
    <title>My Page</title>
</head>
<body>
    <h1>Hello</h1>
</body>
</html>
```

---

## 📂 Path Types

### 1. Relative Paths (from project root)
```html
<!-- CSS: public/css/style.css -->
<!-- CSS: css/custom.css -->
<!-- CSS: styles/theme.css -->
```
These are converted to: `/public/css/style.css`, `/css/custom.css`, etc.

### 2. Absolute URLs (CDN)
```html
<!-- CSS: https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css -->
<!-- CSS: https://fonts.googleapis.com/css2?family=Inter -->
```
These are used as-is.

### 3. Multiple Files
```html
<!-- CSS: public/css/reset.css -->
<!-- CSS: public/css/layout.css -->
<!-- CSS: public/css/theme.css -->
<!-- CSS: https://cdn.example.com/icons.css -->
```
All files are loaded in order.

---

## 🎨 Use Cases

### Use Case 1: Project CSS Files
```html
<!-- CSS: public/css/style.css -->
<!-- CSS: public/css/github-markdown-light.css -->
<!DOCTYPE html>
<html>
<head>
    <title>My Document</title>
</head>
<body class="markdown-body">
    <h1>Styled with Project CSS</h1>
</body>
</html>
```

### Use Case 2: CDN Libraries
```html
<!-- CSS: https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css -->
<!DOCTYPE html>
<html>
<head>
    <title>Bootstrap Page</title>
</head>
<body>
    <div class="container">
        <h1 class="display-1">Bootstrap Styling!</h1>
    </div>
</body>
</html>
```

### Use Case 3: Mixed Sources
```html
<!-- CSS: public/css/base.css -->
<!-- CSS: https://fonts.googleapis.com/css2?family=Roboto -->
<!-- CSS: https://cdn.jsdelivr.net/npm/animate.css@4/animate.min.css -->
<!DOCTYPE html>
<html>
<head>
    <title>Mixed CSS</title>
</head>
<body>
    <h1 class="animate__animated animate__bounce">Hello!</h1>
</body>
</html>
```

---

## 🧪 Test Files

### Test 1: Project CSS
**File**: `test-external-css.html`
- Uses `public/css/style.css`
- Uses `public/css/github-markdown-light.css`
- Tests relative path loading

### Test 2: CDN CSS
**File**: `test-cdn-css.html`
- Uses Tailwind CSS from CDN
- Tests absolute URL loading
- Colorful Tailwind styling

---

## 📋 Step-by-Step Example

### Step 1: Create Your HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

### Step 2: Add CSS Comments
```html
<!-- CSS: public/css/style.css -->
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

### Step 3: Paste into DocMark
- Copy the entire HTML
- Paste into DocMark editor
- CSS automatically loads!

### Step 4: Refresh if Needed
- Click the blue refresh button
- CSS applies to your HTML

---

## 🎯 Common Patterns

### Pattern 1: GitHub Markdown Style
```html
<!-- CSS: public/css/github-markdown-light.css -->
<!DOCTYPE html>
<html>
<body class="markdown-body" style="padding: 40px;">
    <h1>Markdown Styled Content</h1>
</body>
</html>
```

### Pattern 2: Tailwind CSS
```html
<!-- CSS: https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css -->
<!DOCTYPE html>
<html>
<body class="bg-blue-500 text-white p-8">
    <h1 class="text-4xl font-bold">Tailwind!</h1>
</body>
</html>
```

### Pattern 3: Bootstrap
```html
<!-- CSS: https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css -->
<!DOCTYPE html>
<html>
<body>
    <div class="container">
        <button class="btn btn-primary">Bootstrap Button</button>
    </div>
</body>
</html>
```

---

## 🔍 Troubleshooting

### CSS Not Loading?

**Check 1: Comment Syntax**
```html
✅ Correct: <!-- CSS: path/to/file.css -->
❌ Wrong:   <!-- CSS:path/to/file.css --> (no space)
❌ Wrong:   <!--CSS: path/to/file.css--> (no spaces)
```

**Check 2: File Path**
```html
✅ Correct: <!-- CSS: public/css/style.css -->
❌ Wrong:   <!-- CSS: /public/css/style.css --> (leading slash)
❌ Wrong:   <!-- CSS: ./public/css/style.css --> (dot-slash)
```

**Check 3: Comment Position**
```html
✅ Correct: 
<!-- CSS: file.css -->
<!DOCTYPE html>

❌ Wrong:
<!DOCTYPE html>
<!-- CSS: file.css --> (after DOCTYPE)
```

### Still Not Working?

1. **Check browser console** for 404 errors
2. **Verify file exists** at the specified path
3. **Try absolute URL** (CDN) to test
4. **Click refresh button** after adding CSS comments
5. **Hard refresh** browser (Ctrl+Shift+R)

---

## 💡 Pro Tips

### Tip 1: Use CDN for Testing
Start with CDN URLs to verify the feature works:
```html
<!-- CSS: https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css -->
```

### Tip 2: Multiple Files for Organization
```html
<!-- CSS: public/css/reset.css -->
<!-- CSS: public/css/layout.css -->
<!-- CSS: public/css/components.css -->
<!-- CSS: public/css/theme.css -->
```

### Tip 3: Combine with Inline Styles
```html
<!-- CSS: public/css/base.css -->
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Additional inline styles */
        .custom { color: red; }
    </style>
</head>
<body>
    <h1 class="custom">Mixed Styling</h1>
</body>
</html>
```

### Tip 4: Use for Your Portfolio
```html
<!-- CSS: public/css/style.css -->
<!-- CSS: https://fonts.googleapis.com/css2?family=Inter -->
<!DOCTYPE html>
<html>
<head>
    <title>My Portfolio</title>
</head>
<body>
    <!-- Your portfolio content -->
</body>
</html>
```

---

## 📊 Before vs After

| Scenario | Before | After |
|----------|--------|-------|
| External CSS | ❌ Not loaded | ✅ Auto-loaded |
| CDN Links | ❌ Manual injection | ✅ Comment syntax |
| Multiple Files | ❌ Complex setup | ✅ Multiple comments |
| Path Handling | ❌ Manual fixing | ✅ Auto-resolved |

---

## ✨ Summary

**Add this to your HTML:**
```html
<!-- CSS: path/to/file.css -->
```

**And your CSS will:**
- ✅ Automatically load
- ✅ Apply to your HTML
- ✅ Work with CDN links
- ✅ Support multiple files
- ✅ Refresh on demand

No more unstyled HTML previews! 🎉
