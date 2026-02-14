# Puppeteer PDF Export - Setup Guide

## 🎯 The Perfect Solution

Puppeteer uses Chrome's headless browser to render HTML with full CSS support and generate PDFs with:
- ✅ Perfect visual layout (exactly like HTML)
- ✅ Selectable and searchable text
- ✅ All CSS features (flexbox, grid, shadows, fonts)
- ✅ Professional quality output

This is the same technology used by professional online PDF tools.

## 📦 Installation

### Step 1: Install Dependencies

```bash
npm install puppeteer express cors
```

This will:
- Install Puppeteer (~300MB, includes Chrome)
- Install Express (web server)
- Install CORS (allow frontend requests)

### Step 2: Start the PDF Server

```bash
node pdf-server.js
```

You should see:
```
🚀 PDF Export Server Started
📍 Server running at http://localhost:3000
🏥 Health check: http://localhost:3000/health
📄 Generate PDF: POST http://localhost:3000/generate-pdf

✨ Ready to generate PDFs with perfect layout!
```

### Step 3: Test with Client

Open `test-puppeteer-client.html` in your browser and click "Export with Puppeteer"

## 🔧 Files Created

1. **pdf-server.js** - Express server that runs Puppeteer
2. **pdf-export-puppeteer.js** - Standalone CLI script
3. **test-puppeteer-client.html** - Test client
4. **PUPPETEER_SETUP_GUIDE.md** - This file

## 🚀 Usage Options

### Option A: Via Server (Recommended for Web App)

**Server:**
```bash
node pdf-server.js
```

**Client (JavaScript):**
```javascript
async function exportPDF() {
    const html = document.documentElement.outerHTML;
    
    const response = await fetch('http://localhost:3000/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            html: html,
            filename: 'document.pdf'
        })
    });
    
    const blob = await response.blob();
    // Download blob...
}
```

### Option B: CLI (For Testing)

```bash
node pdf-export-puppeteer.js input.html output.pdf
```

Example:
```bash
node pdf-export-puppeteer.js DocMark_Vscode_Light_2026-02-14T11-35-24.html CV_Perfect.pdf
```

## 🔗 Integration with DocMark

### Step 1: Add Export Button Handler

In `src/main.js`, update the PDF export function:

```javascript
let exportPreviewToPdf = async () => {
    const outputElement = document.querySelector('#output');
    if (!outputElement) {
        alert('No content to export');
        return;
    }

    try {
        // Get full HTML with styles
        const container = outputElement.cloneNode(true);
        
        // Create complete HTML document
        const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        ${getPreviewStyles()}
    </style>
</head>
<body>
    ${container.outerHTML}
</body>
</html>`;

        // Send to Puppeteer server
        const response = await fetch('http://localhost:3000/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html: fullHtml,
                filename: `DocMark_${new Date().toISOString().slice(0,19)}.pdf`
            })
        });

        if (!response.ok) {
            throw new Error('PDF generation failed');
        }

        // Download PDF
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DocMark_${new Date().toISOString().slice(0,19)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('PDF export failed:', error);
        alert('PDF export failed. Make sure the PDF server is running (node pdf-server.js)');
    }
};

function getPreviewStyles() {
    // Extract current preview styles
    const styleSheets = Array.from(document.styleSheets);
    let styles = '';
    
    styleSheets.forEach(sheet => {
        try {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach(rule => {
                styles += rule.cssText + '\n';
            });
        } catch (e) {
            // Skip external stylesheets
        }
    });
    
    return styles;
}
```

### Step 2: Start Server with App

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "pdf-server": "node pdf-server.js",
    "dev-with-pdf": "concurrently \"npm run dev\" \"npm run pdf-server\""
  }
}
```

Install concurrently:
```bash
npm install --save-dev concurrently
```

Then run both together:
```bash
npm run dev-with-pdf
```

## 🌐 Deployment Options

### Option 1: Serverless Function (Recommended)

Deploy the PDF server as a serverless function:

**Vercel:**
```bash
# Create api/generate-pdf.js
module.exports = async (req, res) => {
    const puppeteer = require('puppeteer-core');
    const chrome = require('chrome-aws-lambda');
    
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath
    });
    
    // ... rest of PDF generation code
};
```

**Netlify Functions:**
Similar approach with Netlify Functions

**Cost:** ~$0-5/month for typical usage

### Option 2: Dedicated Server

Deploy `pdf-server.js` to:
- Heroku
- DigitalOcean
- AWS EC2
- Any Node.js hosting

**Cost:** ~$5-10/month

### Option 3: Docker Container

```dockerfile
FROM node:18
RUN apt-get update && apt-get install -y chromium
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "pdf-server.js"]
```

## 🔒 Security Considerations

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **Authentication**: Add API key or JWT authentication
3. **Input Validation**: Sanitize HTML input
4. **CORS**: Configure CORS for your domain only
5. **Timeout**: Set reasonable timeouts for PDF generation

Example with rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 10 requests per windowMs
});

app.use('/generate-pdf', limiter);
```

## 📊 Performance

- **Generation Time**: 2-5 seconds per PDF
- **Memory Usage**: ~200-500MB per request
- **Concurrent Requests**: 2-5 (depending on server)
- **File Size**: 50-500KB (text-based, not images)

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F
```

### Puppeteer installation fails
```bash
# Install with specific Chrome version
npm install puppeteer@19.0.0
```

### PDF generation timeout
Increase timeout in server:
```javascript
await page.setContent(html, {
    waitUntil: 'networkidle0',
    timeout: 60000 // 60 seconds
});
```

### CORS errors
Make sure server is running and CORS is enabled:
```javascript
app.use(cors({
    origin: 'http://localhost:5173' // Your Vite dev server
}));
```

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] Test client can generate PDF
- [ ] PDF has perfect layout
- [ ] Text is selectable in PDF
- [ ] File size is reasonable
- [ ] Generation completes in <10 seconds

## 🎉 Result

You now have a professional PDF export system that:
- Renders HTML with perfect CSS fidelity
- Generates PDFs with selectable text
- Works exactly like online professional tools
- Can be deployed to production

This is the industry-standard solution used by tools like Notion, Confluence, and GitBook!
