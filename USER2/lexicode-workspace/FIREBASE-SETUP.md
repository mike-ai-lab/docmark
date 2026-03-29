# Firebase Authentication Setup Guide

## Overview

LexiCode Workspace now includes Firebase authentication with Google Sign-In. This allows users to:
- Securely sign in with their Google account
- Store projects and files in Firestore (cloud database)
- Access their workspace from any device
- Collaborate and share projects (future feature)

## Features Integrated

✅ **Google Authentication** - Sign in with Google account  
✅ **User Profile** - Display name and photo in header  
✅ **Logout Functionality** - Secure sign out  
✅ **Auth State Persistence** - Stay logged in across sessions  
✅ **Protected Routes** - Auth screen shown when not logged in  

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `lexicode-workspace` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### 2. Enable Google Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Set **Project support email** (your email)
5. Click **Save**

### 3. Register Web App

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app:
   - **App nickname**: `LexiCode Web`
   - Check "Also set up Firebase Hosting" (optional)
5. Click **Register app**

### 4. Get Firebase Configuration

After registering, you'll see your Firebase config object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 5. Configure Environment Variables

1. Copy `.env.example` to `.env` in the `frontend` directory:
   ```bash
   cd USER2/lexicode-workspace/frontend
   copy .env.example .env
   ```

2. Edit `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. **IMPORTANT**: Never commit `.env` to Git! It's already in `.gitignore`.

### 6. Set Up Firestore Database (Optional - for cloud storage)

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (closest to your users)
5. Click **Enable**

### 7. Configure Firestore Security Rules

Once Firestore is enabled, set up security rules:

1. Go to **Firestore Database** → **Rules**
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Projects
    match /projects/{projectId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Files
    match /files/{fileId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

## Testing Authentication

### 1. Start the Development Server

```bash
cd USER2/lexicode-workspace/frontend
npm run dev
```

### 2. Open Browser

Navigate to `http://localhost:5173`

### 3. Test Sign In

1. You should see the **Auth screen** with "Sign in with Google" button
2. Click the button
3. Select your Google account
4. Grant permissions
5. You should be redirected to the main workspace

### 4. Test Sign Out

1. Click your **profile picture/name** in the top-right header
2. Click **Sign Out**
3. You should return to the Auth screen

## File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── firebase.js          # Firebase configuration and auth functions
│   ├── components/
│   │   ├── Auth.jsx             # Login screen component
│   │   └── Header.jsx           # Updated with logout button
│   ├── store/
│   │   └── useDemoStore.js      # Updated with user state
│   └── App.jsx                  # Updated with auth check
├── .env                         # Your Firebase credentials (DO NOT COMMIT)
└── .env.example                 # Template for environment variables
```

## Current Implementation

### localStorage Mode (Default)
- Works without Firebase
- Data stored locally in browser
- No authentication required
- Good for development and testing

### Firebase Mode (When Configured)
- Requires Firebase setup
- Google Sign-In authentication
- Cloud storage in Firestore
- Data synced across devices

## Switching Between Modes

The app automatically uses Firebase when:
1. Firebase credentials are configured in `.env`
2. User successfully signs in

To force localStorage mode (for testing):
```javascript
// In useDemoStore.js
useFirebase: false  // Set to false
```

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Add your domain to authorized domains:
1. Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Add `localhost` and your production domain

### "Firebase: Error (auth/popup-blocked)"
**Solution**: Allow popups in your browser for localhost

### "Firebase: Error (auth/operation-not-allowed)"
**Solution**: Enable Google Sign-In in Firebase Console:
- Authentication → Sign-in method → Google → Enable

### Environment variables not loading
**Solution**: 
1. Restart Vite dev server after changing `.env`
2. Ensure variables start with `VITE_`
3. Check `.env` is in `frontend/` directory

### User stays logged in after closing browser
**Solution**: This is expected behavior (persistence). To change:
```javascript
// In firebase.js
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
setPersistence(auth, browserLocalPersistence);
```

## Security Best Practices

1. ✅ **Never commit `.env`** - Already in `.gitignore`
2. ✅ **Use environment variables** - Credentials in `.env` only
3. ✅ **Firestore security rules** - Protect user data
4. ✅ **HTTPS in production** - Firebase requires HTTPS
5. ✅ **Authorized domains** - Limit where auth can be used

## Next Steps

### Implement Firestore Integration (Optional)
Currently, the app uses localStorage. To use Firestore:

1. Update `useDemoStore.js` to use Firestore collections
2. Replace localStorage calls with Firestore operations
3. Add real-time listeners for live updates
4. Implement offline support with Firestore cache

### Add More Auth Providers
Firebase supports multiple providers:
- Email/Password
- GitHub
- Microsoft
- Apple
- Anonymous

### Add User Profiles
- Store user preferences in Firestore
- Custom profile pictures
- User settings and themes

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

For LexiCode Workspace issues:
- Check `TROUBLESHOOTING.md`
- Review browser console for errors
- Ensure all dependencies are installed

## Summary

✅ Firebase installed and configured  
✅ Google Sign-In implemented  
✅ Auth screen created  
✅ User profile in header  
✅ Logout functionality  
✅ Environment variables setup  
✅ Security rules documented  

**Ready to use!** Just add your Firebase credentials to `.env` and restart the dev server.
