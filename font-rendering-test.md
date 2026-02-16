# Font Rendering Test

This document tests how different markdown elements render with the current font stack.

## Regular Paragraph Text

This is regular paragraph text using the default font family defined in the CSS. It should render with -apple-system, BlinkMacSystemFont, Segoe UI, or fallback system fonts depending on your operating system.

## Text Styles

**Bold text** uses font-weight: 600

*Italic text* uses font-style: italic

***Bold and italic*** combines both

~~Strikethrough text~~ has text-decoration

## Code Elements

Inline `code snippets` use monospace font family (Consolas, Monaco, Courier New, monospace)

```javascript
// Code blocks also use monospace fonts
function example() {
    return "This uses a monospace font stack";
}
```

## Headings Hierarchy

# H1 Heading - Font weight 600
## H2 Heading - Font weight 600
### H3 Heading - Font weight 600
#### H4 Heading - Font weight 600
##### H5 Heading - Font weight 600
###### H6 Heading - Font weight 600, different color

## Lists

- Bullet point using body font
- Another item with **bold** and *italic*
- Item with `inline code`

1. Numbered list item
2. Second item with [a link](https://example.com)
3. Third item

## Blockquote

> This is a blockquote that uses the same font family but may have different color styling.
> 
> It can span multiple lines.

## Table

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Regular  | **Bold** | *Italic* |
| `Code`   | Text     | More     |

## Special Characters

Testing Unicode: café, naïve, 日本語, 한글, Ελληνικά, Русский

Testing Emojis: 😀 🎉 ✨ 🚀 💻

---

**Test Instructions:**
1. Switch between GitHub, GitBook, and VSCode styles
2. Toggle dark/light mode
3. Verify all text renders clearly with appropriate fonts
4. Code blocks should use monospace fonts
5. Body text should use system font stack
