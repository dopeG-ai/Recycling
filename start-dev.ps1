# Kill any existing node processes
Get-Process | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force

Write-Host "Starting Backend Server..." -ForegroundColor Green
$backendPath = Join-Path $PSScriptRoot "src\Back-end"
Set-Location $backendPath

# Start backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm install; npm run dev"

Write-Host "Starting Frontend Server..." -ForegroundColor Green
$frontendPath = Join-Path $PSScriptRoot
Set-Location $frontendPath

# Start frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm install; npm start"

Write-Host "Servers are starting..." -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan

# Set execution policy for this process
try {
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
    Write-Host "Successfully set execution policy for this process"
}
catch {
    Write-Host "Failed to set execution policy: $_"
    exit 1
}

# Start the backend server
$backendPath = Join-Path $PSScriptRoot "src\Back-end"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; node server.js"

# Start the frontend
$frontendPath = $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start"

Write-Host "Development environment started successfully!"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend: http://localhost:5000"
