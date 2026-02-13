# Document Title

<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">13 Feb 2026</div>

---

# Image Export Test

##  WORKING: Data URL Image (Base64)

![sdgsdgsdgdff](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iNTAiIGZpbGw9IiMwMDY2Y2MiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxPR088L3RleHQ+PC9zdmc+)

##  BLOCKED: External URL (CORS)

![External Image](https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg)

---

<div style="page-break-after: always;"></div>
<img src="https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg" width="200">

##  How to Make Images Work in PDF:

### Option 1: Use Data URLs

Convert your image to base64 and embed it:

```markdown
![Logo](data:image/png;base64,iVBORw0KG...)
```

### Option 2: Host Images on Same Domain

Put images in `/public/image/` folder and use relative paths:

```markdown
![Logo](/image/my-logo.png)
```

### Option 3: Accept Placeholders

External images will show as clickable links in PDF (current behavior)

---

**Console Messages:**
-  = Processing image
-  = Success (embedded!)
-  = Failed (CORS blocked)
-  = Helpful tip

<div data-pdf-footer="true">

---

<div style="display: flex; justify-content: space-between; margin-top: 20px;">
<div>
<strong>SIGNATURE</strong><br>
<span style="color: #666;">Document Name</span>
</div>
<div style="text-align: right;">
<strong>CLIENT</strong><br>
<span style="color: #666;">13 Feb 2026</span>
</div>
</div>

</div>