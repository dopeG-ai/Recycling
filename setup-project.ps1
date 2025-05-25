# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "This script needs to be run as Administrator. Attempting to elevate..."
    try {
        Start-Process powershell.exe -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
        exit
    }
    catch {
        Write-Host "Failed to run as administrator. Please right-click the script and select 'Run as Administrator'"
        exit 1
    }
}

# Set execution policy for this process
try {
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
    Write-Host "Successfully set execution policy for this process"
}
catch {
    Write-Host "Failed to set execution policy: $_"
    exit 1
}

# Navigate to the backend directory
$backendPath = Join-Path $PSScriptRoot "src\Back-end"
Set-Location $backendPath

# Run the database setup script
try {
    Write-Host "Running database setup script..."
    & "$backendPath\setup_database.ps1"
}
catch {
    Write-Host "Error running database setup: $_"
    exit 1
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Cyan
try {
    npm install
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install backend dependencies: $_" -ForegroundColor Red
    exit
}

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Cyan
try {
    Set-Location -Path "c:\Users\USER\Documents\CeeJay\Recycling"
    npm install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install frontend dependencies: $_" -ForegroundColor Red
    exit
}

# Start servers
Write-Host "`nStarting servers..." -ForegroundColor Cyan
try {
    # Kill any existing node processes
    Get-Process | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Start backend
    Set-Location -Path "c:\Users\USER\Documents\CeeJay\Recycling\src\Back-end"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    
    # Start frontend
    Set-Location -Path "c:\Users\USER\Documents\CeeJay\Recycling"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
    
    Write-Host "✅ Servers started successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to start servers: $_" -ForegroundColor Red
    exit
}

Write-Host "`n✨ Setup completed! The application should be running at:" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
