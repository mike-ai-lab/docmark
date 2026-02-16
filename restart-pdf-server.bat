@echo off
echo Stopping existing PDF server processes...

REM Kill any node processes running on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo Starting PDF server...
start "PDF Server" cmd /k "node pdf-server.js"

echo.
echo PDF server restarted!
echo Check the new window for server output.
