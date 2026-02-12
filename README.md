# Markdown Live Preview (DocMark)

A powerful, browser-based markdown editor that lets you write and see your formatted document side-by-side in real-time. No installation needed, no backend required—just open and start writing.

---

## What Makes DocMark Special?

DocMark transforms the way you work with markdown by giving you instant visual feedback as you type. Whether you're writing documentation, creating reports, or drafting content, you'll see exactly how your document looks without switching between edit and preview modes.

### Write Naturally, See Results Instantly

As you type markdown on the left, your beautifully formatted document appears on the right. No refresh button, no delays—just seamless, real-time rendering that keeps you in the flow.

### Click to Navigate

Found something in the preview that needs editing? Just click it. DocMark instantly jumps your cursor to the exact line in the editor. It works both ways—click in the editor, and the preview scrolls to match. It's like having a direct connection between your source and output.

### Your Style, Your Way

Choose how your document looks with three professional themes:

- **GitHub Style**: The classic markdown look you know and love—clean, familiar, and perfect for technical documentation
- **GitBook Style**: Elegant and spacious, designed for long-form documentation with enhanced readability and professional margins
- **VSCode Style**: Developer-friendly aesthetics that feel right at home for code-heavy documents

Each style works everywhere—in the preview, in PDF exports, and in HTML exports. What you see is truly what you get.

### Export Like a Pro

When it's time to share your work, DocMark has you covered:

**PDF Export with Intelligence**
- Two export methods: quick jsPDF export or pixel-perfect browser print
- Automatic headers and footers from YAML metadata
- Clickable links that work in the PDF
- Style-aware formatting (GitBook PDFs get larger margins and better spacing)
- Professional table formatting with proper spacing
- Unicode character handling for international content

**HTML Export for Sharing**
- Complete, standalone HTML files
- All styling embedded—no external dependencies
- Works offline and looks identical to your preview
- Perfect for sharing with non-technical users

### Smart Document Features

**Table of Contents**
- Automatically generated from your headings
- Updates in real-time as you write
- Click any heading to jump directly to that section
- Included automatically in PDF exports
- Collapsible side panel that stays out of your way

**YAML Front Matter Support**
Add metadata at the top of your document to automatically generate headers and footers:

```yaml
---
title: Project Proposal
date: 15 March 2026
footer-left: PREPARED BY
footer-right: APPROVED BY
---
```

DocMark reads this and creates professional headers and footers in both preview and PDF exports.

**Quick Insert Buttons**
No need to remember HTML or complex markdown:
- **+ Header**: Adds a professional header with title and date
- **+ Footer**: Inserts signature sections with automatic date
- **+ Break**: Creates visual separators between sections

### Helpful Assistant (Mofu)

Meet Mofu, your friendly markdown companion! This interactive helper appears in the header and provides contextual tips and guidance as you work. Enable or disable helper messages in settings based on your preference.

### Flexible Workspace

**Resizable Panels**
Drag the divider between editor and preview to adjust the space. Need more room to write? Expand the editor. Want to focus on the output? Make the preview larger.

**Layout Options**
- **Horizontal Layout**: Editor on left, preview on right (default)
- **Vertical Layout**: Editor on top, preview on bottom
- **Flip Panels**: Swap editor and preview positions
- **Syntax Guide Panel**: Toggle a reference guide for markdown syntax
- **TOC Panel**: Show or hide the table of contents

**Dark Mode**
Easy on the eyes for late-night writing sessions. Toggle between light and dark themes with a single click, and your preference is remembered.

### Never Lose Your Work

DocMark automatically saves your content to your browser's local storage as you type. Close the tab, restart your browser, even reboot your computer—your work is still there when you come back.

### Synchronization That Just Works

**Scroll Sync**
Scroll in the editor, and the preview follows. Scroll in the preview, and the editor keeps pace. It's bidirectional and smooth, keeping your context aligned no matter where you're looking.

**Cursor Sync**
Move your cursor in the editor, and the corresponding section highlights in the preview. It's like having a laser pointer that shows exactly what you're working on.

Both sync features can be toggled on or off based on your workflow.

### Built for Speed

Powered by Monaco Editor (the same editor that powers VS Code), DocMark gives you:
- Syntax highlighting for markdown
- Keyboard shortcuts you already know
- Smooth scrolling and responsive typing
- Fast rendering even for large documents

---

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy
The app is configured for Netlify deployment. Simply connect your repository to Netlify and it will automatically build and deploy from the `dist/` directory.

---

## Tech Stack

- **Editor**: Monaco Editor 0.52.2
- **Markdown Parser**: marked 15.0.7
- **Build Tool**: Vite 6.4.1
- **Styling**: Custom CSS with multiple theme support
- **PDF Generation**: jsPDF 2.5.1
- **Syntax Highlighting**: highlight.js 11.9.0
- **HTML Sanitization**: DOMPurify 3.2.5

---

## Browser Requirements

DocMark works in all modern browsers that support:
- ES6+ JavaScript
- Clipboard API (for copy/paste features)
- localStorage (for auto-save)

---

## License

MIT License - See the [LICENSE](LICENSE) file for details.

---

## Who Is This For?

- **Developers** writing README files and technical documentation
- **Technical Writers** creating user guides and API documentation
- **Content Creators** drafting articles and blog posts in markdown
- **Students** taking notes and writing reports
- **Anyone** who wants a fast, distraction-free markdown editor

No backend, no sign-up, no complexity. Just open DocMark and start writing.

