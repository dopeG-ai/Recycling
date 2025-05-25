Write-Host "Testing backend server connection..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/test" -Method GET
    Write-Host "Backend server is running! Response:" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "Failed to connect to backend server:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
