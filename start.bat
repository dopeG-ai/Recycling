@echo off
echo Starting servers...

REM Start backend
cd src\Back-end
start "Backend Server" cmd /k "npm install && node start.js"

REM Wait a moment
timeout /t 5

REM Start frontend
cd ..\..
start "Frontend Server" cmd /k "npm install && npm start"

echo Servers are starting...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:5000
