@echo on
set NPM_PATH="C:\Program Files\nodejs\npm.cmd"
echo Starting Frontend Server...

:: Change to root directory
cd "%~dp0"

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call %NPM_PATH% install
)

:: Start the React development server
echo Starting React development server...
call %NPM_PATH% start

pause
