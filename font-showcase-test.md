# Font Showcase Test Document

This document tests multiple Google Fonts to ensure they are properly embedded in PDF exports.

## Inter Font Family

**Regular (400):** The quick brown fox jumps over the lazy dog. 0123456789

**Medium (500):** The quick brown fox jumps over the lazy dog. 0123456789

**Semi-Bold (600):** The quick brown fox jumps over the lazy dog. 0123456789

**Bold (700):** The quick brown fox jumps over the lazy dog. 0123456789

## Roboto Font Family

Regular: The quick brown fox jumps over the lazy dog. 0123456789

*Italic:* The quick brown fox jumps over the lazy dog. 0123456789

**Bold:** The quick brown fox jumps over the lazy dog. 0123456789

***Bold Italic:*** The quick brown fox jumps over the lazy dog. 0123456789

## Roboto Mono (Monospace)

```
Regular monospace: function test() { return true; }
Bold monospace: const API_KEY = "abc123def456";
Italic monospace: // This is a comment
```

Inline code: `const x = 42;` should use monospace font.

## Open Sans Font

This paragraph uses Open Sans font. It's a humanist sans-serif typeface designed by Steve Matteson. The font is optimized for print, web, and mobile interfaces, and has excellent legibility characteristics.

**Bold Open Sans:** This text should appear in bold Open Sans.

*Italic Open Sans:* This text should appear in italic Open Sans.

## Lora (Serif Font)

This paragraph uses Lora, a well-balanced contemporary serif with roots in calligraphy. It is a text typeface with moderate contrast well suited for body text.

**Bold Lora:** This is bold serif text that should maintain its elegant character.

*Italic Lora:* This is italic serif text with flowing letterforms.

## Fira Code (Code Font)

```javascript
// Fira Code with programming ligatures
const arrow = () => console.log('test');
if (x !== y) { return x >= y; }
```

## Playfair Display (Display Font)

# Elegant Heading in Playfair Display

This is a decorative serif typeface for titles and headings. It has high contrast and distinctive style.

## Merriweather (Reading Font)

This paragraph uses Merriweather, designed to be pleasant to read at very small sizes on screens. It features a very large x height, slightly condensed letterforms, a mild diagonal stress, sturdy serifs and open forms.

## Source Sans Pro

Source Sans Pro is Adobe's first open source typeface family. It was designed to work well in user interfaces.

**Bold Source Sans:** Clear and readable even in bold weight.

## Noto Sans (Universal Font)

Noto Sans supports a wide range of languages and scripts. This makes it ideal for international documents.

**Bold Noto Sans:** Maintains consistency across weights.

## Mixed Font Paragraph

This paragraph intentionally mixes **bold**, *italic*, and `code` styles to test how different font variations work together in a single paragraph. It should maintain proper spacing and alignment.

## Font Comparison Table

| Font Family | Style | Sample Text |
|-------------|-------|-------------|
| Inter | Regular | The quick brown fox |
| Roboto | Bold | The quick brown fox |
| Lora | Italic | The quick brown fox |
| Fira Code | Mono | `const x = 42;` |

## Special Characters Test

### Inter Font
- Accents: café, naïve, résumé, Zürich
- Symbols: © ® ™ € £ ¥ § ¶
- Math: × ÷ ± ≈ ≠ ≤ ≥
- Arrows: → ← ↑ ↓ ↔ ⇒

### Roboto Mono
```
Special chars: @#$%^&*()_+-={}[]|:;"'<>,.?/
Numbers: 0123456789
Brackets: () [] {} <> 
```

## Conclusion

If all fonts are properly embedded:
- Each section should display in its designated font family
- Bold and italic variations should be distinct
- Monospace fonts should have fixed-width characters
- Special characters should render correctly
- PDF file size should be significantly larger (200+ KB)
