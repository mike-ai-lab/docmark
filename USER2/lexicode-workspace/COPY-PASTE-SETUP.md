# Copy-Paste Firebase Setup (2 Minutes!)

## Step 1: Create Firebase Project (30 seconds)

1. Go to: https://console.firebase.google.com/
2. Click: **"Add project"**
3. Name: `lexicode` (or anything)
4. Click: **"Continue"** → **"Continue"** → **"Create project"**

## Step 2: Enable Google Sign-In (30 seconds)

1. Click: **"Authentication"** (left sidebar)
2. Click: **"Get started"**
3. Click: **"Google"** (in sign-in providers)
4. Toggle: **"Enable"**
5. Select your email from dropdown
6. Click: **"Save"**

## Step 3: Get Your Config (30 seconds)

1. Click: **⚙️ (gear icon)** → **"Project settings"**
2. Scroll down to: **"Your apps"**
3. Click: **Web icon** (`</>`)
4. App nickname: `LexiCode`
5. Click: **"Register app"**
6. You'll see this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456",
  appId: "1:123456:web:abc"
};
```

## Step 4: Create .env File (30 seconds)

1. Open: `USER2/lexicode-workspace/frontend/`
2. Create file: `.env`
3. Copy-paste this template:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

4. Fill in the values from Step 3

### Example (with your real values):

```env
VITE_FIREBASE_API_KEY=AIzaSyDXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
VITE_FIREBASE_AUTH_DOMAIN=lexicode-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lexicode-12345
VITE_FIREBASE_STORAGE_BUCKET=lexicode-12345.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

## Step 5: Restart Server (30 seconds)

```bash
# In terminal, press Ctrl+C to stop server
# Then run:
npm run dev
```

## Step 6: Test! (30 seconds)

1. Open: http://localhost:5175/
2. Click: **"Sign in with Google"**
3. Select your Google account
4. Done! ✅

---

## That's It!

**Total time**: 2 minutes  
**No service accounts**: ✅  
**No JSON files**: ✅  
**No complexity**: ✅  

---

## Troubleshooting

### "Unauthorized domain" error?
1. Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Add: `localhost`

### Popup blocked?
Allow popups for localhost in your browser

### Still not working?
1. Check `.env` file is in `frontend/` directory
2. Check all 6 values are filled in
3. Restart dev server
4. Hard refresh browser (Ctrl+Shift+R)

---

## Quick Reference

**Firebase Console**: https://console.firebase.google.com/  
**Your .env location**: `USER2/lexicode-workspace/frontend/.env`  
**Your app URL**: http://localhost:5175/  

**Need more help?** See `SIMPLE-FIREBASE-GUIDE.md`
