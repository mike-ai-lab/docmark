@echo off
echo Starting LexiCode Frontend...
cd frontend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
if not exist .env (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and configure your Supabase credentials
    pause
    exit /b 1
)
echo Starting Vite dev server...
call npm run dev
