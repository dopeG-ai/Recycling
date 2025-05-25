# Start RecyclePay Application
Write-Host "Starting RecyclePay Application..." -ForegroundColor Green

# Function to test if a port is in use
function Test-Port {
    param($Port)
    $result = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    return $result.TcpTestSucceeded
}

# Set working directories
$rootDir = $PSScriptRoot
$backendDir = Join-Path $rootDir "src\Back-end"
$frontendDir = $rootDir

# Kill any existing processes on the ports we need
if (Test-Port 3000) {
    Write-Host "Port 3000 is in use. Stopping existing process..." -ForegroundColor Yellow
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue
}
if (Test-Port 5000) {
    Write-Host "Port 5000 is in use. Stopping existing process..." -ForegroundColor Yellow
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue
}

# Check if MySQL is running
$mysqlService = Get-Service MySQL* -ErrorAction SilentlyContinue
if ($mysqlService.Status -ne 'Running') {
    Write-Host "MySQL is not running. Starting MySQL..." -ForegroundColor Yellow
    Start-Service MySQL* -ErrorAction Stop
    Start-Sleep -Seconds 5
}

# Start backend server
$backendPath = Join-Path $PSScriptRoot "src\Back-end"
Write-Host "Starting backend server..." -ForegroundColor Yellow
try {
    # First ensure all dependencies are installed
    Push-Location $backendPath
    npm install
    Start-Process -NoNewWindow -WorkingDirectory $backendPath -FilePath "node" -ArgumentList "start.js"
    Pop-Location
} catch {
    Write-Host "Error starting backend: $_" -ForegroundColor Red
    exit 1
}

# Wait a moment for backend to initialize
Start-Sleep -Seconds 5

# Start frontend
Write-Host "Starting frontend..." -ForegroundColor Yellow
try {
    # First ensure all dependencies are installed
    npm install
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start"
} catch {
    Write-Host "Error starting frontend: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Servers started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow

# Keep the script running and show server status
while ($true) {
    $backendRunning = Test-Port -Port 5000
    $frontendRunning = Test-Port -Port 3000
    
    Clear-Host
    Write-Host "RecyclePay Server Status" -ForegroundColor Green
    Write-Host "----------------------" -ForegroundColor Green
    Write-Host "Backend Server (Port 5000): $(if ($backendRunning) {'Running'} else {'Stopped'})" -ForegroundColor $(if ($backendRunning) {'Green'} else {'Red'})
    Write-Host "Frontend Server (Port 3000): $(if ($frontendRunning) {'Running'} else {'Stopped'})" -ForegroundColor $(if ($frontendRunning) {'Green'} else {'Red'})
    Write-Host "----------------------" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
    
    Start-Sleep -Seconds 5
}
