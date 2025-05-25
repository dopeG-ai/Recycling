# PowerShell script to set up the database
$mysqlCmd = "mysql"
$mysqlUser = "root"
$mysqlPass = "PaperCut42@"

# Create temporary SQL file for initialization
$initSQL = @"
DROP DATABASE IF EXISTS recycling_db;
CREATE DATABASE recycling_db;
USE recycling_db;
"@

$initSQL | Out-File -Encoding UTF8 "init_db.sql"

# Run the initialization SQL
Write-Host "Initializing database..."
Get-Content "init_db.sql" | & $mysqlCmd -u $mysqlUser -p"$mysqlPass"

# Run the main setup script
Write-Host "Setting up tables..."
Get-Content "db_setup.sql" | & $mysqlCmd -u $mysqlUser -p"$mysqlPass" recycling_db

# Clean up
Remove-Item "init_db.sql"
Write-Host "Database setup completed!"
