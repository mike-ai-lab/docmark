---
inclusion: always
---

# Tech Stack

## Build System

- **Framework**: Vanilla JavaScript (no framework)
- **Build Tool**: Vite 6.4.1
- **Package Manager**: npm
- **Module System**: CommonJS (type: "commonjs" in package.json)
- **Module Format**: ES modules in browser (`import`/`export`)

## Core Dependencies

### Editor & Rendering
- **Monaco Editor** 0.52.2 - Code editor (VS Code engine)
- **marked** 15.0.7 - Markdown parser
- **DOMPurify** 3.2.5 - HTML sanitization
- **highlight.js** 11.9.0 - Syntax highlighting

### PDF Handling
- **jsPDF** 2.5.1 - Client-side PDF generation
- **pdfjs-dist** 4.10.38 - PDF parsing and import
- **Puppeteer** 24.37.2 - Server-side PDF generation
- **@sparticuz/chromium** 131.0.0 - Headless Chrome for serverless

### Storage & Utilities
- **storehouse-js** - localStorage wrapper
- **jszip** 3.10.1 - ZIP file handling
- **jsdom** 25.0.1 - Server-side DOM manipulation

### Server (Development & PDF Export)
- **Express** 5.2.1 - Web server
- **cors** 2.8.6 - CORS middleware
- **multer** 1.4.5-lts.1 - File upload handling

### Desktop (Optional)
- **Electron** 40.6.1 - Desktop app wrapper
- **electron-builder** 26.8.1 - Desktop app packaging

## Common Commands

```bash
# Development
npm install              # Install dependencies
npm run dev              # Start dev server (Vite + PDF server on port 3000)
npm run dev:vite-only    # Start Vite only (no PDF server)

# Build
npm run build            # Production build (outputs to dist/)
npm run vercel-build     # Vercel-specific build

# Preview & Serve
npm run preview          # Preview production build
npm run serve-dist       # Serve dist/ on port 5001
npm run build-and-serve  # Build then serve

# PDF Server
npm run pdf-server       # Start PDF generation server (port 3000)

# Electron (Desktop)
npm run electron:dev           # Run Electron in dev mode
npm run electron:build         # Build for all platforms
npm run electron:build-win     # Build for Windows only

# Testing
npm test                 # Run Node.js tests
npm run test:browser     # Instructions for browser tests
```

## Development Server

The dev server runs two processes concurrently:
1. **Vite dev server** - Main app (default port 5173)
2. **PDF server** - Puppeteer-based PDF generation (port 3000)

Vite proxies `/api`, `/generate-pdf`, and `/health` to the PDF server.

## Deployment

### Vercel (Recommended)
- Serverless functions in `api/` directory
- Automatic configuration via `vercel.json`
- PDF import requires serverless function support

### Other Hosts
- Build with `npm run build`
- Upload `dist/` directory
- Note: PDF import requires serverless functions (Vercel, Netlify, AWS Lambda)

## Browser Requirements

- ES6+ JavaScript support
- Clipboard API (copy/paste)
- localStorage (auto-save)
- FileReader API (media uploads)
