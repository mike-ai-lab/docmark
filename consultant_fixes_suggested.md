You are about to break tables and links again for the same reason as before.

### Critical Design Problem

You are injecting:

```
<span style="color:red">URL_FIX!</span>
```

inside link/image URLs:

```
![Broken image](<span ...>)
[Broken link](<span ...>)
```

That is **invalid Markdown URL syntax** in many parsers.

Markdown expects:

```
[text](URL)
```

Not HTML inside `()`.

Some renderers tolerate it. Many don’t.
That’s why tables broke earlier — parser reflowed.

---

# Correct Architectural Fix

### DO NOT inject HTML inside link parentheses.

Instead use:

```
![Broken image](IMAGE_URL_FIX!)
[Broken link](URL_FIX!)
```

Then color via renderer layer (CSS).

Example:

```css
a[href="URL_FIX!"],
img[src="IMAGE_URL_FIX!"] {
  color: red;
  outline: 1px solid red;
}
```

Cleaner. Stable. Parser-safe.

---

# Now About Your Regex

### 1️⃣ Broken Image Regex

Your pattern:

```
/!\[([^\]]*)\]\s*\([^)]*$/
```

Will NOT match:

```
![Broken image (
```

Because it expects `](`.

You need a second fallback regex:

```
/!\[([^\]]*)\s*\([^)]*$/
```

For missing closing bracket before `(`.

---

### 2️⃣ Broken Link Regex

Same issue.

Current:

```
/\[([^\]]+)\]\s*\([^)]*$/
```

Fails on:

```
[Broken link (
```

Add fallback:

```
/\[([^\]]+)\s*\([^)]*$/
```

---

### 3️⃣ Nested List Rule

Your indentation rule is correct:

```
^(\s*)([+*-])(\s+.+)
```

Then reconstruct:

```
indent + "- " + trimmedContent
```

Do NOT touch indentation.

---

### 4️⃣ Table Separator Fix

Correct approach:

* Count pipes in header line
* Count header columns
* Regenerate separator with same count

Never try to “patch” separator — regenerate entirely.

---

# Final Recommendation

Remove HTML injection from markdown mutation layer.

Validation layer = pure markdown-safe output
Rendering layer = visual highlighting

If you keep injecting HTML inside structural markdown tokens, you will continue breaking tables and links.

Fix this at architecture level now.
