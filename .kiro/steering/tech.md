---
inclusion: always
---

# Technology Stack

## Build System

- **Bundler**: Vite 6.4.1
- **Package Manager**: npm
- **Build Tool**: Make (optional wrapper)

## Core Libraries

- **Editor**: Monaco Editor 0.52.2 (ESM import from CDN)
- **Markdown Parser**: marked 15.0.7
- **HTML Sanitizer**: DOMPurify 3.2.5
- **Styling**: github-markdown-css 5.8.1
- **Storage**: storehouse-js (localStorage wrapper)
- **PDF Generation**: jsPDF 2.5.1 (CDN)

## Deployment

- **Hosting**: Netlify
- **Target Directory**: `dist/`

## Common Commands

### Development
```bash
npm run dev       # Start Vite dev server
```

### Building
```bash
npm run build     # Build production bundle
```

### Preview
```bash
npm run preview   # Preview production build
```

### Serving Built Files
```bash
npm run serve-dist        # Serve dist folder on port 5001
npm run build-and-serve   # Build and serve in one command
```

### Setup
```bash
npm install       # Install dependencies
```

### Cleaning
```bash
npm run clean     # Remove dist directory (if available)
```

## Browser Requirements

- Modern browser with ES6+ support
- Clipboard API support for copy/paste features
- localStorage for persistence
