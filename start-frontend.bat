@echo off
echo ========================================
echo Starting Beam Analysis Frontend
echo ========================================
echo.

cd frontend

echo Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Checking if dependencies are installed...
if not exist node_modules (
    echo Installing dependencies...
    npm install
    echo.
)

echo.
echo Starting React development server...
echo Frontend will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start

pause
