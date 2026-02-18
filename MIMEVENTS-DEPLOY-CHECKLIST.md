# ✅ mimevents.com Deployment Checklist

## Pre-Deployment

### 1. Build the App
```bash
npm install
npm run build
```
✅ Creates production build in `dist/` folder

### 2. Prepare Backend
```bash
# Test backend locally
node pdf-server.js
# Should see: "✅ PDF Server running on http://localhost:3000"
```

## Deployment Steps

### 3. Upload Frontend
- [ ] Upload contents of `dist/` folder to web root
- [ ] Verify `index.html` is at root level
- [ ] Check all assets uploaded correctly

### 4. Upload Backend Files
- [ ] Upload `pdf-server.js` to server
- [ ] Upload `package.json` to server
- [ ] Upload `src/pdf-import/` folder to server
- [ ] Run `npm install` on server

### 5. Start Backend Server
```bash
# Option A: Direct (for testing)
node pdf-server.js

# Option B: PM2 (recommended for production)
pm2 start pdf-server.js --name "docmark-pdf-server"
pm2 save
pm2 startup
```

### 6. Configure Proxy
- [ ] Add proxy rules to Apache/Nginx config
- [ ] Proxy `/api` to `http://localhost:3000`
- [ ] Restart web server

### 7. Test Deployment
- [ ] Visit https://mimevents.com/
- [ ] Click PDF import button (📄)
- [ ] Upload test PDF
- [ ] Verify table detection works
- [ ] Test other features (export, validation)
- [ ] Check documentation link

## Server Configuration

### Apache Proxy (.htaccess or config)
```apache
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api
</IfModule>
```

### Nginx Proxy
```nginx
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Verification Commands

### Check Backend Status
```bash
# If using PM2
pm2 status
pm2 logs docmark-pdf-server

# If running directly
ps aux | grep pdf-server
```

### Test API Endpoint
```bash
curl http://localhost:3000/api/pdf-import-test
# Should return: {"status":"ok","message":"PDF Import API is running"}
```

### Check Proxy
```bash
curl https://mimevents.com/api/pdf-import-test
# Should return same as above
```

## Post-Deployment

### Monitor
- [ ] Check PM2 status: `pm2 monit`
- [ ] Review logs: `pm2 logs`
- [ ] Test with various PDFs
- [ ] Monitor browser console for errors

### Announce
- [ ] Update project description
- [ ] Share new feature
- [ ] Update any external links

## Troubleshooting

### PDF Import Not Working
1. Check backend: `pm2 status`
2. Check logs: `pm2 logs docmark-pdf-server`
3. Test API: `curl http://localhost:3000/api/pdf-import-test`
4. Check proxy configuration
5. Check browser console (F12)

### Backend Crashes
```bash
pm2 restart docmark-pdf-server
pm2 logs docmark-pdf-server --lines 50
```

### 404 Errors
- Verify proxy configuration
- Check backend is running
- Ensure `/api` routes are proxied correctly

## Rollback Plan

If issues occur:
1. Stop backend: `pm2 stop docmark-pdf-server`
2. Comment out PDF button in `index.html`
3. Re-upload frontend
4. All other features continue working

## Success Criteria

✅ Frontend loads at https://mimevents.com/  
✅ PDF import button visible in header  
✅ PDF upload and conversion works  
✅ Tables detected and converted  
✅ Documentation accessible  
✅ All other features working  
✅ Backend server stable  
✅ No console errors  

## Files to Upload

### Frontend (to web root)
```
dist/
├── index.html
├── assets/
├── public/
├── src/
└── ...
```

### Backend (to app directory)
```
/path/to/app/
├── pdf-server.js
├── package.json
├── src/pdf-import/
└── node_modules/ (after npm install)
```

## Server Info

**Domain:** https://mimevents.com  
**Backend Port:** 3000  
**Node Version:** 18+ required  
**Process Manager:** PM2 recommended  

---

**Ready to deploy!** Follow this checklist step by step. 🚀
