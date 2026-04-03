@echo off
echo ========================================
echo   LexiCode Workspace - Full Stack App
echo ========================================
echo.
echo Starting backend server on port 3005...
cd server
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
start "LexiCode Backend" cmd /k "npm start"
cd ..

echo.
echo Starting frontend on port 5173...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
echo.
echo Backend: http://localhost:3005
echo Frontend: http://localhost:5173
echo.
call npm run dev
