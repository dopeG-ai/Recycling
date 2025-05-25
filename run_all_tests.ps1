# Run all tests in sequence
$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n=== Running Full Test Suite ===" -ForegroundColor Cyan

# Step 1: Setup database
Write-Host "`n1. Setting up database..." -ForegroundColor Yellow
try {
    & "$scriptPath\setup_database.ps1"
    if ($LASTEXITCODE -ne 0) {
        throw "Database setup failed with exit code $LASTEXITCODE"
    }
    Write-Host "✅ Database setup complete" -ForegroundColor Green
} catch {
    Write-Host "❌ Database setup failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Create test user
Write-Host "`n2. Creating test user..." -ForegroundColor Yellow
try {
    & "$scriptPath\tests\setup_test_user.ps1"
    if ($LASTEXITCODE -ne 0) {
        throw "Test user creation failed with exit code $LASTEXITCODE"
    }
    Write-Host "✅ Test user created" -ForegroundColor Green
} catch {
    Write-Host "❌ Test user creation failed: $_" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Using Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Step 3: Run login test
Write-Host "`n3. Testing login functionality..." -ForegroundColor Yellow
try {
    & node "$scriptPath\tests\test_login.js"
    if ($LASTEXITCODE -ne 0) {
        throw "Login test failed with exit code $LASTEXITCODE"
    }
    Write-Host "✅ Login test passed" -ForegroundColor Green
} catch {
    Write-Host "❌ Login test failed: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Run payment setup test
Write-Host "`n4. Testing payment setup..." -ForegroundColor Yellow
try {
    & node "$scriptPath\tests\test_payment_setup.js"
    if ($LASTEXITCODE -ne 0) {
        throw "Payment setup test failed with exit code $LASTEXITCODE"
    }
    Write-Host "✅ Payment setup test passed" -ForegroundColor Green
} catch {
    Write-Host "❌ Payment setup test failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Cyan
