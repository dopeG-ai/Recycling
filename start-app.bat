@echo off
echo Starting RecyclePay Application...

REM Kill any existing node processes
taskkill /F /IM node.exe /T 2>nul

REM Start backend server
cd src\Back-end
start "Backend Server" cmd /c "npm install && npm run dev"
echo Backend server starting...

REM Wait for backend to initialize
timeout /t 5 /nobreak

REM Start frontend
cd ..\..
start "Frontend Server" cmd /c "npm install && npm start"
echo Frontend server starting...

echo.
echo Servers are starting up...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C in the respective windows to stop the servers

REM Check if servers are running
timeout /t 10 /nobreak
node check-servers.js
