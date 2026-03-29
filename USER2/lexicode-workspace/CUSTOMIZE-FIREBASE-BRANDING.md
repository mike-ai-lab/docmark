# Customize Firebase Branding

## Problem

Google Sign-In shows generic Firebase project ID:
```
Sign in to lexi-5f30c.firebaseapp.com
```

This looks unprofessional! Let's fix it.

---

## Solution 1: Change Project Public Name (Easiest - 1 minute)

### Steps:

1. **Go to Firebase Console**
   ```
   https://console.firebase.google.com/project/lexi-5f30c/settings/general
   ```

2. **Edit Public-facing name**
   - Find "Public-facing name" field
   - Change from: `lexi-5f30c`
   - Change to: `LexiCode Workspace`
   - Click **Save**

3. **Result**
   ```
   Before: Sign in to lexi-5f30c.firebaseapp.com
   After:  Sign in to LexiCode Workspace
   ```

**That's it!** The Google Sign-In popup will now show "LexiCode Workspace" instead of the generic ID.

---

## Solution 2: Add Custom Domain (Professional - 10 minutes)

If you have a custom domain (like `lexicode.app`), you can use it:

### Steps:

1. **Go to Firebase Console**
   ```
   https://console.firebase.google.com/project/lexi-5f30c/authentication/providers
   ```

2. **Add Authorized Domain**
   - Click "Add domain"
   - Enter: `lexicode.app` (your domain)
   - Follow DNS verification steps

3. **Update Auth Domain in .env**
   ```env
   VITE_FIREBASE_AUTH_DOMAIN=lexicode.app
   ```

4. **Result**
   ```
   Sign in to lexicode.app
   ```

**Note**: Requires owning a domain and DNS configuration.

---

## Solution 3: OAuth Consent Screen (Advanced - 15 minutes)

For full branding control (logo, colors, etc.):

### Steps:

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com/apis/credentials/consent
   ```

2. **Configure OAuth Consent Screen**
   - Application name: `LexiCode Workspace`
   - Application logo: Upload your logo
   - Support email: Your email
   - Application homepage: Your website
   - Privacy policy: Your privacy policy URL
   - Terms of service: Your terms URL

3. **Result**
   - Custom app name
   - Your logo displayed
   - Professional branding

**Note**: Requires Google Cloud Console access and additional setup.

---

## Recommended Approach

### For Development/Testing
✅ **Solution 1** - Change public-facing name (1 minute)

### For Production
✅ **Solution 2** - Custom domain (if you have one)
✅ **Solution 3** - Full OAuth branding (for professional apps)

---

## Quick Fix (Right Now!)

1. Go to: https://console.firebase.google.com/project/lexi-5f30c/settings/general
2. Find "Public-facing name"
3. Change to: `LexiCode Workspace`
4. Click Save
5. Test sign-in again!

The popup will now say:
```
Sign in to LexiCode Workspace
```

Much better! ✨

---

## Additional Branding Tips

### 1. Add App Icon
In Firebase Console → Project Settings:
- Upload a project icon (shows in Firebase Console)

### 2. Add Support Email
In Authentication → Settings:
- Set a professional support email
- Shows in Google Sign-In popup

### 3. Add Privacy Policy & Terms
In OAuth Consent Screen:
- Add links to your privacy policy
- Add links to your terms of service
- Builds user trust

---

## What Users Will See

### Before (Generic)
```
┌─────────────────────────────────────┐
│ Sign in to lexi-5f30c.firebaseapp.com │
│                                     │
│ Google will allow lexi-5f30c...     │
│ to access this info about you       │
└─────────────────────────────────────┘
```

### After (Professional)
```
┌─────────────────────────────────────┐
│ Sign in to LexiCode Workspace      │
│                                     │
│ Google will allow LexiCode...       │
│ to access this info about you       │
└─────────────────────────────────────┘
```

---

## Summary

**Quick Fix (1 minute)**:
- Change "Public-facing name" in Firebase Console
- From: `lexi-5f30c`
- To: `LexiCode Workspace`

**Professional Setup (later)**:
- Add custom domain
- Configure OAuth consent screen
- Add logo and branding

**Do this now**: Change the public-facing name! It takes 1 minute and makes a huge difference! 🎯
