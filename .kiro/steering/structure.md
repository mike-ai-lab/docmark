---
inclusion: always
---

# Project Structure

## Directory Layout

```
.
├── src/
│   └── main.js              # Main application logic (3400+ lines)
├── public/
│   ├── css/                 # Stylesheets
│   │   ├── style.css        # Main application styles
│   │   ├── github-markdown-*.css  # GitHub theme variants
│   │   ├── gitbook-style.css      # GitBook theme
│   │   └── vscode-style.css       # VSCode theme
│   ├── image/               # Static images
│   └── 404.html             # Error page
├── dist/                    # Build output (generated)
├── index.html               # Entry point
├── package.json             # Dependencies and scripts
├── netlify.toml             # Netlify deployment config
└── Makefile                 # Build shortcuts (optional)
```

## Key Files

### Entry Point
- `index.html` - HTML shell with inline theme bootstrap script

### Application Logic
- `src/main.js` - Single-file application containing:
  - Monaco editor setup and configuration
  - Markdown parsing and rendering
  - Scroll and cursor synchronization
  - PDF export functionality
  - Theme and style management
  - localStorage persistence
  - UI event handlers

### Styling
- `public/css/style.css` - Main application styles (layout, header, panels, controls)
- `public/css/github-markdown-*.css` - GitHub-style markdown rendering (light/dark variants)
- `public/css/gitbook-style.css` - GitBook-style markdown rendering
- `public/css/vscode-style.css` - VSCode-style markdown rendering

## Architecture Patterns

### Single-Page Application
- No routing or multiple pages
- All functionality in one HTML file + one main JS module
- State managed via closures and localStorage

### Split-Pane Layout
- Editor pane (left/top) - Monaco editor
- Preview pane (right/bottom) - Rendered markdown
- Optional cheatsheet panel (right side)
- Resizable dividers between panes

### Data Flow
1. User types in Monaco editor
2. `onDidChangeModelContent` event fires
3. Markdown converted to HTML via `marked`
4. HTML sanitized via `DOMPurify`
5. Line mapping attributes added to elements
6. Output rendered in preview pane
7. Content auto-saved to localStorage

### Theme System
- CSS custom properties for theming
- `data-theme` attribute on `<html>` element
- Separate CSS files for preview styles
- Dynamic stylesheet switching

### Storage Strategy
- localStorage keys prefixed with `com.markdownlivepreview`
- Separate keys for content, settings, theme, layout
- Auto-save on content change
- Settings persist across sessions

## Code Organization

The main.js file is organized as a single IIFE with:
- Configuration constants at top
- Helper functions in middle
- Initialization logic at bottom
- Event handlers attached after DOM ready

## Naming Conventions

- **Functions**: camelCase (e.g., `syncCursorToPreview`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `PREVIEW_CSS_LIGHT`)
- **localStorage keys**: dot-separated namespace (e.g., `com.markdownlivepreview.theme_settings`)
- **CSS classes**: kebab-case (e.g., `split-container`, `cursor-highlight`)
- **Data attributes**: kebab-case (e.g., `data-source-line`)
