# Quick Reference - Firebase Authentication

## 🚀 Current Status

✅ Firebase authentication **fully integrated**  
✅ All code **ready to use**  
⚠️ Firebase project **needs configuration**  

## 📍 Servers Running

- **Frontend**: http://localhost:5175/
- **Backend**: http://localhost:3001/

## 🔧 Quick Setup (5 Minutes)

### 1. Create Firebase Project
```
https://console.firebase.google.com/
→ Create project → Enable Google Auth
```

### 2. Get Credentials
```
Project Settings → Your apps → Web app
→ Copy firebaseConfig
```

### 3. Configure
```bash
cd USER2/lexicode-workspace/frontend
copy .env.example .env
# Add your Firebase credentials to .env
```

### 4. Restart Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 5. Test
```
Open http://localhost:5175/
→ Click "Sign in with Google"
→ Done!
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `frontend/src/lib/firebase.js` | Firebase config |
| `frontend/src/components/Auth.jsx` | Login screen |
| `frontend/.env` | Your credentials (create this) |
| `FIREBASE-SETUP.md` | Detailed setup guide |

## 🎨 What You'll See

### Without Firebase Setup
- Auth screen displays
- "Sign in with Google" button (won't work yet)

### With Firebase Setup
- Auth screen displays
- Click button → Google popup
- Select account → Access workspace
- Profile in header → Sign out works

## 📚 Documentation

- **Setup Guide**: `FIREBASE-SETUP.md`
- **Complete Summary**: `AUTHENTICATION-COMPLETE.md`
- **Session Details**: `SESSION-SUMMARY.md`
- **This File**: `QUICK-REFERENCE.md`

## 🐛 Common Issues

**Auth button doesn't work**  
→ Add Firebase credentials to `.env`

**"Unauthorized domain" error**  
→ Add `localhost` to Firebase authorized domains

**Popup blocked**  
→ Allow popups for localhost

## 💡 Features Integrated

✅ Google Sign-In  
✅ User profile with photo  
✅ Logout button  
✅ Auth persistence  
✅ Protected workspace  
✅ Beautiful UI  

## 🎯 Next Steps

1. Set up Firebase project (5 min)
2. Add credentials to `.env`
3. Test authentication
4. Optional: Add Firestore for cloud storage

## 📞 Need Help?

Check these files in order:
1. `QUICK-REFERENCE.md` (this file)
2. `FIREBASE-SETUP.md` (detailed guide)
3. `TROUBLESHOOTING.md` (common issues)
