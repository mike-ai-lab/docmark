#!/bin/bash
# DocMark Vercel Deployment Script
# Quick reference for deploying to Vercel

echo "🚀 DocMark Vercel Deployment"
echo "=============================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Show current status
echo "📋 Deployment Configuration:"
echo "  - Static Build: Vite (dist/)"
echo "  - Serverless Functions:"
echo "    • /api/pdf-import (PDF extraction)"
echo "    • /api/generate-pdf (PDF generation)"
echo "    • /api/health (Health check)"
echo ""

# Deployment options
echo "🔧 Deployment Options:"
echo ""
echo "1. Deploy to production:"
echo "   vercel --prod"
echo ""
echo "2. Deploy to preview:"
echo "   vercel"
echo ""
echo "3. Deploy locally (for testing):"
echo "   vercel dev"
echo ""
echo "4. View deployment logs:"
echo "   vercel logs"
echo ""

# Verification commands
echo "✔️  Verification Commands (after deployment):"
echo ""
echo "# Check health endpoint"
echo "curl https://your-domain.vercel.app/api/health"
echo ""
echo "# Expected response:"
echo '{\"status\":\"ok\",\"service\":\"docmark-api\",\"timestamp\":\"...\"}'
echo ""

# Testing
echo "🧪 Testing PDF Features:"
echo ""
echo "1. Open the application in browser"
echo "2. Click PDF Import button (top toolbar)"
echo "3. Select a PDF file"
echo "4. Verify preview shows extracted content"
echo "5. Click 'Insert into Editor'"
echo "6. Verify content appears in editor"
echo ""
echo "7. Click PDF Export button"
echo "8. Verify PDF downloads successfully"
echo "9. Open PDF and verify formatting"
echo ""

# Troubleshooting
echo "🔍 Troubleshooting:"
echo ""
echo "If PDF Import fails (404):"
echo "  - Check: vercel.json has pdf-import.js build"
echo "  - Check: api/pdf-import.js exists"
echo "  - Check: package.json has formidable and pdfjs-dist"
echo ""
echo "If PDF Export fails (404):"
echo "  - Check: vercel.json has generate-pdf.js build"
echo "  - Check: api/generate-pdf.js exists"
echo "  - Check: package.json has @sparticuz/chromium and puppeteer-core"
echo ""
echo "If CORS errors appear:"
echo "  - Check: API endpoints have Access-Control-Allow-Origin headers"
echo "  - Check: OPTIONS method is handled"
echo ""

# Next steps
echo "📝 Next Steps:"
echo ""
echo "1. Commit changes to git:"
echo "   git add ."
echo "   git commit -m 'Fix: PDF import/export serverless functions'"
echo ""
echo "2. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "3. Test all features"
echo ""
echo "4. Monitor in Vercel dashboard:"
echo "   https://vercel.com/dashboard"
echo ""

echo "✨ Done! Your DocMark instance is ready for deployment."
