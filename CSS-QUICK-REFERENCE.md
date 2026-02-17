# External CSS - Quick Reference Card

## 📋 Syntax

```html
<!-- CSS: path/to/file.css -->
<!DOCTYPE html>
<html>
...
```

---

## ✅ Valid Examples

### Project CSS
```html
<!-- CSS: public/css/style.css -->
```

### CDN CSS
```html
<!-- CSS: https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css -->
```

### Multiple Files
```html
<!-- CSS: public/css/reset.css -->
<!-- CSS: public/css/layout.css -->
<!-- CSS: https://fonts.googleapis.com/css2?family=Inter -->
```

---

## ❌ Common Mistakes

```html
❌ <!--CSS: file.css--> (no spaces)
❌ <!-- CSS:file.css --> (no space after colon)
❌ <!DOCTYPE html>
   <!-- CSS: file.css --> (after DOCTYPE)
❌ <!-- CSS: /public/css/style.css --> (leading slash)
```

---

## 🎯 Quick Test

Copy and paste this into DocMark:

```html
<!-- CSS: public/css/github-markdown-light.css -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CSS Test</title>
</head>
<body class="markdown-body" style="padding: 40px;">
    <h1>It Works!</h1>
    <p>If you see GitHub-style formatting, CSS is loading!</p>
</body>
</html>
```

---

## 🔧 Popular CDN Links

### Tailwind CSS
```html
<!-- CSS: https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css -->
```

### Bootstrap
```html
<!-- CSS: https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css -->
```

### Google Fonts
```html
<!-- CSS: https://fonts.googleapis.com/css2?family=Inter:wght@400;700 -->
```

### Animate.css
```html
<!-- CSS: https://cdn.jsdelivr.net/npm/animate.css@4/animate.min.css -->
```

---

## 💡 Pro Tips

1. **Always put CSS comments FIRST** (before `<!DOCTYPE>`)
2. **Use relative paths** for project files (no leading `/`)
3. **Use absolute URLs** for CDN files
4. **Click refresh button** after adding CSS comments
5. **Check browser console** if CSS doesn't load

---

## 🚀 Your Turn!

1. Open DocMark
2. Add CSS comment at top
3. Paste your HTML
4. Click refresh button
5. Enjoy styled preview!

---

**App URL**: http://localhost:5174/
