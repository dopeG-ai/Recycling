# PowerShell script to start the backend server in development mode
Write-Host "Starting backend server in development mode..."

# Check if node_modules exists
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

# Check database connection
try {
    # Test MySQL connection using mysql command
    mysql -u root -p"PaperCut42@" -e "SELECT 1;" 2>$null
    Write-Host "Database connection successful"
} catch {
    Write-Host "Error: Could not connect to database. Please check if MySQL is running and credentials are correct"
    exit 1
}

# Start the server with nodemon
Write-Host "Starting server..."
npm run dev
