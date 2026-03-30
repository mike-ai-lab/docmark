@echo off
echo Starting LexiCode Backend Server...
cd server
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
if not exist .env (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and configure your API keys
    pause
    exit /b 1
)
echo Starting server on port 3005...
node index.js
USER2\lexicode-workspace\start-backend.bat