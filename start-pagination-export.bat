@echo off
echo Starting Pagination PDF Export Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Launching server on http://localhost:3001
echo Press Ctrl+C to stop the server
echo.

node pagination-pdf-export-server.js
