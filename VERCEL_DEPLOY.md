# Deploy to Vercel with PDF Import

## Quick Deploy

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Install dependencies**:
```bash
npm install
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy**:
```bash
vercel --prod
```

That's it! The PDF import will work automatically.

## What Was Set Up

✅ **Serverless Function**: `/api/pdf-import.js` handles PDF processing
✅ **Full Table Detection**: Preserves complex nested tables
✅ **Vercel Config**: `vercel.json` routes API requests correctly
✅ **Dependencies**: Added `formidable` for file uploads

## How It Works

- Frontend sends PDF to `/api/pdf-import`
- Vercel serverless function processes it
- Returns markdown with tables preserved
- No manual server management needed

## Environment Variables

None required! Everything works out of the box.

## Testing Locally

```bash
npm run dev
```

The local dev server will proxy `/api` requests to the PDF server.

## Vercel Dashboard

After deployment, you can:
- View logs at https://vercel.com/dashboard
- Monitor function performance
- See deployment history

## Cost

Vercel Free Tier includes:
- 100GB bandwidth/month
- 100 serverless function executions/day
- More than enough for PDF imports

## Troubleshooting

If PDF import fails:
1. Check Vercel function logs
2. Ensure `formidable` is installed
3. Verify `pdfjs-dist` is in dependencies
4. Check CORS headers in function

## Manual Steps (if needed)

If automatic deployment doesn't work:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect the configuration
4. Click "Deploy"

Done!
