@echo off
echo ========================================
echo   LexiCode Workspace - Single File App
echo ========================================
echo.
echo Starting frontend only (no backend needed)...
echo.
cd frontend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo.
echo Starting Vite dev server...
echo App will be available at: http://localhost:5173
echo.
call npm run dev
