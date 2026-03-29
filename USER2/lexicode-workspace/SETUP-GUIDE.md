# LexiCode Workspace - Quick Setup Guide

## Step-by-Step Setup (Windows)

### Step 1: Install Prerequisites

1. **Node.js** (if not installed):
   - Download from https://nodejs.org/
   - Install version 18 or higher
   - Verify: Open CMD and run `node --version`

### Step 2: Setup Supabase Database

1. Go to https://supabase.com and sign up (free)
2. Click "New Project"
3. Fill in:
   - Name: "LexiCode"
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Wait for project to be created (~2 minutes)
5. Go to **SQL Editor** (left sidebar)
6. Click "New Query"
7. Copy and paste the entire contents of `server/supabase-schema.sql`
8. Click "Run" to create the tables
9. Go to **Settings > API** and copy:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - anon/public key (long string starting with "eyJ...")

### Step 3: Get OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to **API Keys** section
4. Click "Create new secret key"
5. Copy the key (starts with "sk-...")
6. **Important**: Add credits to your account if needed

### Step 4: Configure Backend

1. Open `server` folder
2. Copy `.env.example` to `.env`
3. Edit `.env` file with your keys:
   ```
   OPENAI_API_KEY=sk-your-key-here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   PORT=3001
   ```
4. Save the file

### Step 5: Configure Frontend

1. Open `frontend` folder
2. Copy `.env.example` to `.env`
3. Edit `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_API_URL=http://localhost:3001
   ```
4. Save the file

### Step 6: Install Dependencies

Open two separate Command Prompt windows:

**Window 1 - Backend:**
```cmd
cd USER2\lexicode-workspace\server
npm install
```

**Window 2 - Frontend:**
```cmd
cd USER2\lexicode-workspace\frontend
npm install
```

Wait for both to complete (~2-3 minutes each).

### Step 7: Create Sample Data

1. Go to your Supabase project
2. Click **Table Editor** (left sidebar)
3. Open `projects` table
4. Click "Insert row"
5. Fill in:
   - name: "Website Redesign"
   - Leave other fields as default
6. Click "Save"
7. Copy the generated `id` (UUID)

8. Open `files` table
9. Click "Insert row"
10. Fill in:
    - project_id: (paste the UUID from step 7)
    - name: "index.html"
    - path: "src/index.html"
    - type: "html"
    - content: `<html><head><title>My Site</title></head><body><h1>Hello World</h1></body></html>`
11. Click "Save"

### Step 8: Start the Application

**Option A: Using Batch Files (Easiest)**

1. Double-click `start-backend.bat`
2. Wait for "LexiCode Server running on http://localhost:3001"
3. Double-click `start-frontend.bat`
4. Wait for "Local: http://localhost:5173"
5. Open browser to http://localhost:5173

**Option B: Manual Start**

**Terminal 1 - Backend:**
```cmd
cd server
npm start
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm run dev
```

### Step 9: Test the Application

1. You should see "Website Redesign" in the left sidebar
2. Click on it to expand
3. Click on "index.html" to open the file
4. The Monaco editor should show your HTML content
5. In the right panel (AI Assistant), type:
   ```
   Add a meta viewport tag in the head section
   ```
6. Click "Apply Semantic Edit"
7. Watch as the AI modifies your file!

## Troubleshooting

### Backend won't start
- Check that port 3001 is not in use
- Verify .env file exists and has correct keys
- Run `npm install` again in server folder

### Frontend won't start
- Check that port 5173 is not in use
- Verify .env file exists in frontend folder
- Run `npm install` again in frontend folder

### "No projects found"
- Make sure you created a project in Supabase
- Check your Supabase credentials in .env files
- Verify the tables were created correctly

### AI edits not working
- Check OpenAI API key is valid
- Ensure you have credits in your OpenAI account
- Check browser console for errors (F12)

## Next Steps

- Create more files in different formats (js, md, json)
- Try complex AI instructions
- Export files to DOCX format
- Explore the version history feature

## Support

For issues, check:
- Browser console (F12 > Console tab)
- Backend terminal for error messages
- Supabase logs in dashboard
