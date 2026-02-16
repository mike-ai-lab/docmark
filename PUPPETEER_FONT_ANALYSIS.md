# Puppeteer Font Preservation Analysis

## Current Status: ⚠️ POTENTIAL FONT ISSUES

### The Problem

Your Puppeteer implementation **does NOT properly handle web fonts**, which can cause font preservation issues in PDFs.

---

## How Fonts Are Currently Handled

### 1. CSS Collection (`collectHtmlForPuppeteer`)

The function collects CSS in this order:
```javascript
// 1. Fetches external CSS (github-markdown-*.css, gitbook-style.css, vscode-style.css)
const response = await fetch(ghMarkdownLink.href);
markdownCss = await response.text();

// 2. Collects inline <style> tags
const styleTags = document.querySelectorAll('style');

// 3. Inlines everything into the HTML sent to Puppeteer
```

### 2. Font References Found in CSS

**style.css** (main app styles):
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
```

**GitHub/GitBook/VSCode styles**:
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
```

---

## The Bug: Web Fonts Not Loading

### Issue #1: Google Fonts Import
- `style.css` imports **Inter font from Google Fonts** via `@import`
- When CSS is fetched and inlined, the `@import` is included
- **BUT**: Puppeteer may not wait for the font to download before generating PDF
- Result: Falls back to system fonts (Helvetica, Arial)

### Issue #2: System Font Fallbacks
- CSS uses system font stacks like `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`
- These fonts exist on the user's machine but **may not exist in Puppeteer's headless Chrome**
- Puppeteer runs in a minimal Linux environment (if on server) with limited fonts
- Result: Falls back to generic sans-serif/monospace

### Issue #3: No Font Loading Wait
```javascript
await page.setContent(html, {
    waitUntil: 'domcontentloaded', // ⚠️ Does NOT wait for fonts!
    timeout: 120000
});
```

The code uses `domcontentloaded` which fires before fonts are loaded. Should use `networkidle0` or explicitly wait for fonts.

---

## Evidence from Session History

From `session14.md`:
> "i can observe the font is different and the size of the font is breaking the visual matching"

> "the PDF either is even not preserving the exact layout like for example the margin... the spacing between the lines within a single block or a paragraph"

This confirms fonts are NOT being preserved correctly!

---

## The Fix: Proper Font Handling

### Option 1: Wait for Fonts to Load (Recommended)

**In pdf-server.js**, change:
```javascript
// BEFORE (current - broken)
await page.setContent(html, {
    waitUntil: 'domcontentloaded',
    timeout: 120000
});

// AFTER (fixed)
await page.setContent(html, {
    waitUntil: 'networkidle0', // Wait for all network requests including fonts
    timeout: 120000
});

// Then explicitly wait for fonts
await page.evaluateHandle('document.fonts.ready');
```

### Option 2: Embed Fonts as Base64

**In main.js** `collectHtmlForPuppeteer()`:
1. Fetch Google Fonts CSS
2. Parse font URLs from CSS
3. Download font files
4. Convert to base64
5. Replace URLs with data URIs

This ensures fonts are embedded in the HTML.

### Option 3: Use PDF-Safe Fonts Only

Replace web fonts with standard PDF fonts:
- Helvetica (sans-serif)
- Times (serif)  
- Courier (monospace)

These are guaranteed to work in PDFs but lose visual fidelity.

---

## Recommended Solution

### Immediate Fix (pdf-server.js)

```javascript
// After setContent, add:
await page.evaluateHandle('document.fonts.ready');

// Also change waitUntil:
await page.setContent(html, {
    waitUntil: 'networkidle0', // Changed from 'domcontentloaded'
    timeout: 120000
});
```

### Long-term Fix (main.js)

Add font embedding to `collectHtmlForPuppeteer()`:

```javascript
// After fetching CSS, process @import and @font-face
markdownCss = await embedFontsInCss(markdownCss);

async function embedFontsInCss(css) {
    // Find @import url() for fonts
    const importRegex = /@import\s+url\(['"]([^'"]+)['"]\)/g;
    let match;
    
    while ((match = importRegex.exec(css)) !== null) {
        const fontCssUrl = match[1];
        if (fontCssUrl.includes('fonts.googleapis.com')) {
            // Fetch the font CSS
            const fontCss = await fetch(fontCssUrl).then(r => r.text());
            
            // Replace @import with actual font CSS
            css = css.replace(match[0], fontCss);
        }
    }
    
    // Now find @font-face url() and convert to base64
    const fontUrlRegex = /url\(['"]?([^'"()]+\.(?:woff2?|ttf|otf))['"]?\)/g;
    
    while ((match = fontUrlRegex.exec(css)) !== null) {
        const fontUrl = match[1];
        try {
            const fontData = await fetch(fontUrl).then(r => r.arrayBuffer());
            const base64 = btoa(String.fromCharCode(...new Uint8Array(fontData)));
            const mimeType = fontUrl.endsWith('woff2') ? 'font/woff2' : 
                           fontUrl.endsWith('woff') ? 'font/woff' : 'font/ttf';
            const dataUri = `url('data:${mimeType};base64,${base64}')`;
            css = css.replace(match[0], dataUri);
        } catch (e) {
            console.warn('Failed to embed font:', fontUrl);
        }
    }
    
    return css;
}
```

---

## Summary

**Current State**: Fonts are NOT properly preserved
- Web fonts may not load before PDF generation
- System fonts may not exist in Puppeteer environment
- No explicit font loading wait

**Impact**: 
- Different fonts in PDF vs preview
- Broken spacing and layout
- Visual mismatch

**Fix Priority**: HIGH - This directly affects PDF quality

**Easiest Fix**: Add `await page.evaluateHandle('document.fonts.ready')` to pdf-server.js

**Best Fix**: Embed fonts as base64 in the HTML sent to Puppeteer
