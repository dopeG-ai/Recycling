@echo off
echo Restarting RecyclePay Application...

REM Kill any existing node processes
echo Stopping existing Node.js processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak

REM Clear npm cache
echo Clearing npm cache...
call npm cache clean --force

REM Install dependencies
echo Installing dependencies...
call npm install

REM Install backend dependencies
cd src\Back-end
echo Installing backend dependencies...
call npm install
cd ..\..

REM Start the backend server
echo Starting backend server...
start "Backend Server" cmd /c "cd src\Back-end && npm run dev"

REM Wait for backend to initialize
echo Waiting for backend to initialize...
timeout /t 5 /nobreak

REM Start the frontend
echo Starting frontend...
start "Frontend Server" cmd /c "npm start"

echo.
echo Servers are restarting...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C in the respective windows to stop the servers
