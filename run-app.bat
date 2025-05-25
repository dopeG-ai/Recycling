@echo off
echo Starting RecyclePay Services...

REM Check if MySQL is running
echo Checking MySQL status...
sc query MySQL80 | find "RUNNING"
if %ERRORLEVEL% NEQ 0 (
    echo Starting MySQL...
    net start MySQL80
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to start MySQL. Please start it manually or run as administrator.
        pause
        exit /b 1
    )
    timeout /t 5 /nobreak
)

REM Kill any existing node processes
echo Stopping any existing Node.js processes...
taskkill /F /IM node.exe /T 2>nul

REM Start PowerShell with execution policy bypass and run the backend
echo Starting backend server...
start "Backend Server" powershell.exe -ExecutionPolicy Bypass -Command "cd './src/Back-end'; npm install; npm run dev"

REM Wait for backend to initialize
echo Waiting for backend to initialize...
timeout /t 5 /nobreak

REM Start frontend in a new PowerShell window
echo Starting frontend server...
start "Frontend Server" powershell.exe -ExecutionPolicy Bypass -Command "npm install; npm start"

echo.
echo Servers are starting up...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C in the respective windows to stop the servers
pause
