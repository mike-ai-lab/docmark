# 🚀 Deploy to mimevents.com

## Deployment Instructions

### Step 1: Build for Production
```bash
npm install
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Step 2: Upload to Server

Upload the contents of the `dist/` folder to your web server at **mimevents.com**.

**Important:** Upload the CONTENTS of the `dist/` folder, not the folder itself.

Your server structure should look like:
```
mimevents.com/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── public/
│   ├── docs/
│   ├── css/
│   └── ...
├── src/
└── ...
```

### Step 3: Configure Server (if needed)

#### For Apache (.htaccess)
If using Apache, ensure you have this in your `.htaccess`:

```apache
# Enable CORS for fonts and assets
<FilesMatch "\.(ttf|otf|eot|woff|woff2)$">
    <IfModule mod_headers.c>
        Header set Access-Control-Allow-Origin "*"
    </IfModule>
</FilesMatch>

# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

#### For Nginx
If using Nginx, add to your config:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

# Gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Cache static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Step 4: Start Backend Server

The PDF import feature requires a Node.js backend server running on port 3000.

**On your server, run:**
```bash
cd /path/to/your/app
npm install
node pdf-server.js
```

**Or use PM2 for production:**
```bash
npm install -g pm2
pm2 start pdf-server.js --name "docmark-pdf-server"
pm2 save
pm2 startup
```

This ensures the server restarts automatically if it crashes or the server reboots.

### Step 5: Configure Proxy (Important!)

The frontend expects the PDF import API at `/api/pdf-import`. You need to proxy this to your Node.js server.

#### For Apache
Add to your `.htaccess` or Apache config:

```apache
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api
</IfModule>
```

#### For Nginx
Add to your Nginx config:

```nginx
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### Step 6: Verify Deployment

1. **Visit https://mimevents.com/**
2. **Test PDF Import:**
   - Click PDF icon (📄) in header
   - Upload a test PDF
   - Verify conversion works
3. **Check Documentation:**
   - Click Help → Documentation
   - Navigate to "PDF Import" section
4. **Test Other Features:**
   - Export to PDF
   - Validation
   - All features work

## Troubleshooting

### PDF Import Button Not Working
**Check:**
1. Is the backend server running? `pm2 status`
2. Is the proxy configured correctly?
3. Check browser console for errors (F12)
4. Test API directly: `curl http://localhost:3000/api/pdf-import-test`

### 404 Errors
**Solution:** Ensure your server is configured to serve `index.html` for all routes (SPA routing).

### CORS Errors
**Solution:** Ensure your proxy is configured correctly and the backend server is accessible.

### Backend Server Crashes
**Check logs:**
```bash
pm2 logs docmark-pdf-server
```

**Restart:**
```bash
pm2 restart docmark-pdf-server
```

## Production Checklist

- [ ] Built with `npm run build`
- [ ] Uploaded `dist/` contents to server
- [ ] Backend server running on port 3000
- [ ] Proxy configured for `/api` routes
- [ ] PM2 configured for auto-restart
- [ ] Tested PDF import feature
- [ ] Tested all other features
- [ ] Documentation accessible
- [ ] SSL certificate active (HTTPS)

## Server Requirements

**Minimum:**
- Node.js 18+ (for backend)
- 512MB RAM
- 1GB disk space

**Recommended:**
- Node.js 20+
- 1GB RAM
- 2GB disk space
- PM2 for process management

## Security Notes

1. **HTTPS Required:** Ensure SSL certificate is active
2. **File Upload Limits:** Backend limits uploads to 50MB
3. **Temporary Files:** Automatically cleaned up after processing
4. **No Data Storage:** PDFs are not stored permanently

## Monitoring

**Check server status:**
```bash
pm2 status
pm2 monit
```

**View logs:**
```bash
pm2 logs docmark-pdf-server --lines 100
```

**Restart if needed:**
```bash
pm2 restart docmark-pdf-server
```

## Backup Plan

If issues occur, you can disable the PDF import feature by commenting out the button in `index.html`:

```html
<!-- <button class="icon-button" id="pdf-import-button" title="Import PDF">
    ...
</button> -->
```

All other features will continue to work normally.

## Support

- **Documentation:** https://mimevents.com/docs/pdf-import.html
- **Technical Docs:** See `SUCCESS-PDFJS-WORKING.md`
- **Deployment Checklist:** See `DEPLOYMENT-READY-CHECKLIST.md`

---

**Ready to deploy!** Follow the steps above and your app will be live at https://mimevents.com/ 🚀
