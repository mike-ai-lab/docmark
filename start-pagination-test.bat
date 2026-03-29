@echo off
title Pagination PDF Server
echo ========================================
echo   Pagination Test with PDF Export
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
node --version
echo.

REM Check if dependencies are installed
echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take a few minutes (Puppeteer downloads Chromium)...
    echo.
    npm install express cors puppeteer
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
) else (
    echo Dependencies already installed
)
echo.

REM Start the PDF server
echo ========================================
echo   Starting PDF Server...
echo ========================================
echo.
echo Server will start on http://localhost:3001
echo.
echo Instructions:
echo   1. Wait for server to start
echo   2. Open your browser to:
echo      http://localhost:3001/pagination-test-merged.html
echo   3. Edit content and test PDF export
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

node pagination-pdf-server.js

REM Keep window open if server crashes
if errorlevel 1 (
    echo.
    echo Server stopped with error!
    pause
)
