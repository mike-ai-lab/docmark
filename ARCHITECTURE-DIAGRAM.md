# Architecture Diagram - Pagination PDF Export

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │         pagination-test-merged.html                       │ │
│  │                                                           │ │
│  │  ┌─────────────────┐    ┌──────────────────────────┐    │ │
│  │  │   Left Sidebar  │    │    Right Preview Pane    │    │ │
│  │  │                 │    │                          │    │ │
│  │  │  • Editor       │    │  ┌────────────────────┐ │    │ │
│  │  │  • Margins      │    │  │   Page 1           │ │    │ │
│  │  │  • Format       │    │  │   [Content...]     │ │    │ │
│  │  │  • Options      │    │  │   [Margin guides]  │ │    │ │
│  │  │                 │    │  └────────────────────┘ │    │ │
│  │  │  [Sync Button]  │    │  ┌────────────────────┐ │    │ │
│  │  │  [Export PDF]   │    │  │   Page 2           │ │    │ │
│  │  │                 │    │  │   [Content...]     │ │    │ │
│  │  └─────────────────┘    │  └────────────────────┘ │    │ │
│  │                         │         ...              │    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                              │                                  │
│                              │ HTTP POST /generate-pdf          │
│                              │ { html, margins, format }        │
│                              ▼                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                    NODE.JS SERVER (Port 3001)                   │
│                   pagination-pdf-server.js                      │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Express.js Web Server                                    │ │
│  │                                                           │ │
│  │  Routes:                                                  │ │
│  │  • GET  /health          → Health check                  │ │
│  │  • POST /generate-pdf    → PDF generation                │ │
│  │  • GET  /*               → Static files                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              │ Launch Puppeteer                 │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Puppeteer (Headless Chrome)                             │ │
│  │                                                           │ │
│  │  1. Create new page                                      │ │
│  │  2. Set HTML content                                     │ │
│  │  3. Wait for fonts to load                               │ │
│  │  4. Generate PDF buffer                                  │ │
│  │  5. Return PDF to server                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              │ PDF Buffer                       │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Response Handler                                         │ │
│  │                                                           │ │
│  │  • Set Content-Type: application/pdf                     │ │
│  │  • Set Content-Disposition: attachment                   │ │
│  │  • Send PDF buffer to browser                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ HTTP Response (PDF file)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Download Manager                                         │ │
│  │                                                           │ │
│  │  📥 Pagination_Test_2024-03-28T10-30-45.pdf             │ │
│  │     Size: 245 KB                                         │ │
│  │     Location: C:\Users\...\Downloads\                    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────┐
│  User    │
│  Types   │
│  Content │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│  Monaco Editor  │
│  (Markdown)     │
└────┬────────────┘
     │
     │ onChange event
     ▼
┌─────────────────┐
│  Pagination     │
│  Engine         │
│                 │
│  • Parse MD     │
│  • Measure      │
│  • Split pages  │
└────┬────────────┘
     │
     │ Render
     ▼
┌─────────────────┐
│  Preview Pane   │
│                 │
│  Page 1         │
│  Page 2         │
│  Page 3         │
│  ...            │
└────┬────────────┘
     │
     │ User clicks "Export PDF"
     ▼
┌─────────────────┐
│  Collect HTML   │
│                 │
│  • Get pages    │
│  • Add styles   │
│  • Add margins  │
└────┬────────────┘
     │
     │ POST /generate-pdf
     ▼
┌─────────────────┐
│  PDF Server     │
│                 │
│  • Puppeteer    │
│  • Render       │
│  • Generate     │
└────┬────────────┘
     │
     │ PDF Buffer
     ▼
┌─────────────────┐
│  Browser        │
│  Download       │
│                 │
│  ✅ PDF Ready   │
└─────────────────┘
```

## Component Interaction

```
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Browser)                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐      ┌──────────────┐      ┌─────────────┐ │
│  │   Editor     │─────▶│  Pagination  │─────▶│   Preview   │ │
│  │   Component  │      │   Engine     │      │   Renderer  │ │
│  └──────────────┘      └──────────────┘      └─────────────┘ │
│         │                                            │         │
│         │                                            │         │
│         │              ┌──────────────┐              │         │
│         └─────────────▶│  PDF Export  │◀─────────────┘         │
│                        │   Handler    │                        │
│                        └──────┬───────┘                        │
│                               │                                │
└───────────────────────────────┼────────────────────────────────┘
                                │
                                │ fetch()
                                │
┌───────────────────────────────┼────────────────────────────────┐
│                        BACKEND (Node.js)                       │
├───────────────────────────────┼────────────────────────────────┤
│                               ▼                                │
│                        ┌──────────────┐                        │
│                        │   Express    │                        │
│                        │   Router     │                        │
│                        └──────┬───────┘                        │
│                               │                                │
│                               ▼                                │
│                        ┌──────────────┐                        │
│                        │  Puppeteer   │                        │
│                        │   Manager    │                        │
│                        └──────┬───────┘                        │
│                               │                                │
│                               ▼                                │
│                        ┌──────────────┐                        │
│                        │   Chromium   │                        │
│                        │   (Headless) │                        │
│                        └──────┬───────┘                        │
│                               │                                │
│                               │ PDF Buffer                     │
│                               ▼                                │
│                        ┌──────────────┐                        │
│                        │   Response   │                        │
│                        └──────────────┘                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Margin Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    MARGIN CONFIGURATION                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  User sets margins:     │
              │  Top: 25mm              │
              │  Right: 20mm            │
              │  Bottom: 25mm           │
              │  Left: 20mm             │
              └────────┬────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  PREVIEW MODE   │         │   PDF EXPORT    │
└─────────────────┘         └─────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│ Visual guides   │         │ CSS padding     │
│ (red dashed)    │         │ on body element │
│                 │         │                 │
│ Content         │         │ @page {         │
│ positioned      │         │   margin: 0;    │
│ within margins  │         │ }               │
│                 │         │                 │
│ Margin guides   │         │ body {          │
│ overlay on page │         │   padding: ...  │
│                 │         │ }               │
└─────────────────┘         └─────────────────┘
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  RESULT:        │
              │  Margins match  │
              │  in both modes  │
              └─────────────────┘
```

## PDF Generation Pipeline

```
┌──────────────┐
│ User clicks  │
│ Export PDF   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 1: Health Check                │
│ GET /health                          │
│ ✓ Server running?                   │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 2: Collect Pages                │
│ • Query all .page-container          │
│ • Extract .page-content              │
│ • Build pages array                  │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 3: Build HTML Document          │
│ • Add DOCTYPE and <html>             │
│ • Include Google Fonts               │
│ • Inline all CSS styles              │
│ • Add page break rules               │
│ • Apply margins as padding           │
│ • Insert page content                │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 4: Send to Server               │
│ POST /generate-pdf                   │
│ {                                    │
│   html: "<!DOCTYPE html>...",        │
│   filename: "Pagination_Test_...",   │
│   margins: { top: 0, ... },          │
│   pageFormat: "A4"                   │
│ }                                    │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 5: Puppeteer Processing         │
│ • Launch headless Chrome             │
│ • Create new page                    │
│ • Set viewport size                  │
│ • Load HTML content                  │
│ • Wait for networkidle0              │
│ • Wait for fonts.ready               │
│ • Additional 1s delay                │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 6: PDF Generation               │
│ page.pdf({                           │
│   format: 'A4',                      │
│   printBackground: true,             │
│   preferCSSPageSize: false,          │
│   margin: { top: 0, ... }            │
│ })                                   │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 7: Return PDF                   │
│ • Set Content-Type header            │
│ • Set Content-Disposition header     │
│ • Send PDF buffer                    │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Step 8: Browser Download             │
│ • Create blob from response          │
│ • Generate download URL              │
│ • Trigger download                   │
│ • Show success message               │
└──────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND STACK                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  • HTML5                                                │
│  • CSS3 (Flexbox, Grid)                                 │
│  • Vanilla JavaScript (ES6+)                            │
│  • Marked.js (Markdown parsing)                         │
│  • DOMPurify (HTML sanitization)                        │
│  • Highlight.js (Syntax highlighting)                   │
│  • Lucide Icons (UI icons)                              │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    BACKEND STACK                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  • Node.js (Runtime)                                    │
│  • Express.js (Web framework)                           │
│  • Puppeteer (Headless Chrome)                          │
│  • CORS (Cross-origin support)                          │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   COMMUNICATION                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  • HTTP/HTTPS                                           │
│  • REST API                                             │
│  • JSON payloads                                        │
│  • Binary PDF transfer                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## File Dependencies

```
pagination-test-merged.html
├── Marked.js (CDN)
├── DOMPurify (CDN)
├── Highlight.js (CDN)
├── Lucide Icons (CDN)
└── Google Fonts (CDN)

pagination-pdf-server.js
├── express (npm)
├── cors (npm)
└── puppeteer (npm)
    └── Chromium (bundled)
```

## Port Configuration

```
┌─────────────────────────────────────┐
│  Port 3001                          │
│  ├── HTTP Server (Express)          │
│  ├── Static file serving            │
│  ├── /health endpoint               │
│  └── /generate-pdf endpoint         │
└─────────────────────────────────────┘
```

## Security Considerations

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. DOMPurify Sanitization                              │
│     └── Prevents XSS attacks in markdown               │
│                                                         │
│  2. CORS Configuration                                  │
│     └── Controls cross-origin requests                 │
│                                                         │
│  3. Puppeteer Sandbox                                   │
│     └── Isolated Chrome instance                       │
│                                                         │
│  4. Content-Type Validation                             │
│     └── Ensures proper PDF handling                    │
│                                                         │
│  5. Request Size Limits                                 │
│     └── 50MB max payload (configurable)                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

This architecture provides a clean separation between presentation (browser), business logic (pagination), and PDF generation (server), making it easy to maintain and extend.
