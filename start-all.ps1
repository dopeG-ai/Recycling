# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "This script needs to be run as Administrator. Attempting to elevate..."
    try {
        Start-Process powershell.exe -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
        exit
    }
    catch {
        Write-Host "Failed to run as administrator. Please right-click PowerShell and select 'Run as Administrator'"
        exit 1
    }
}

# Function to check if a service exists
function Test-ServiceExists {
    param ($serviceName)
    return Get-Service -Name $serviceName -ErrorAction SilentlyContinue
}

# Function to check if a port is in use
function Test-PortInUse {
    param($port)
    $listener = $null
    try {
        $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $port)
        $listener.Start()
        return $false
    }
    catch {
        return $true
    }
    finally {
        if ($listener) {
            $listener.Stop()
        }
    }
}

Write-Host "Starting RecyclePay Services..." -ForegroundColor Cyan

# Check and start MySQL
$mysqlService = Test-ServiceExists "MySQL80"
if ($mysqlService) {
    Write-Host "Found MySQL Service..." -ForegroundColor Yellow
    if ($mysqlService.Status -ne 'Running') {
        Write-Host "Starting MySQL..." -ForegroundColor Yellow
        try {
            Start-Service MySQL80
            Start-Sleep -Seconds 5
            if ((Get-Service MySQL80).Status -eq 'Running') {
                Write-Host "✅ MySQL started successfully" -ForegroundColor Green
            } else {
                throw "MySQL failed to start"
            }
        }
        catch {
            Write-Host "❌ Failed to start MySQL: $_" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ MySQL is already running" -ForegroundColor Green
    }
} else {
    Write-Host "❌ MySQL service not found. Please install MySQL first" -ForegroundColor Red
    exit 1
}

# Kill any existing Node processes on ports 3000 and 5000
Write-Host "Checking for existing processes..." -ForegroundColor Yellow
if (Test-PortInUse 3000) {
    Write-Host "Killing process on port 3000..." -ForegroundColor Yellow
    $process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($process) { Stop-Process -Id $process -Force -ErrorAction SilentlyContinue }
}
if (Test-PortInUse 5000) {
    Write-Host "Killing process on port 5000..." -ForegroundColor Yellow
    $process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($process) { Stop-Process -Id $process -Force -ErrorAction SilentlyContinue }
}

# Start Backend
Write-Host "`nStarting Backend Server..." -ForegroundColor Cyan
try {
    Set-Location -Path "src\Back-end"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm install && npm run dev"
    Write-Host "✅ Backend server starting" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to start backend: $_" -ForegroundColor Red
    exit 1
}

# Wait for backend to initialize
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "`nStarting Frontend Server..." -ForegroundColor Cyan
try {
    Set-Location -Path "..\..\"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm install && npm start"
    Write-Host "✅ Frontend server starting" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to start frontend: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✨ Setup completed! The application should be running at:" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C in the respective windows to stop the servers" -ForegroundColor Yellow
