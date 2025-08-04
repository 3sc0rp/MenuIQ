# Simple test for menu upload
Write-Host "Testing simple menu upload..." -ForegroundColor Green

# Create a simple test menu
$testData = @{
    title = "Simple Test Menu"
    userId = "1"
    items = @(
        @{
            name = "Test Burger"
            price = 15.00
            cost = 8.00
            sales_count = 10
            tags = @("burger", "test")
        }
    )
}

$jsonData = $testData | ConvertTo-Json -Depth 3

Write-Host "Test data:" -ForegroundColor Yellow
Write-Host $jsonData -ForegroundColor Gray

# Try to upload using a different approach
try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $body = @{
        title = "Simple Test Menu"
        userId = "1"
        menuData = $testData.items
    } | ConvertTo-Json -Depth 3
    
    Write-Host "`nAttempting upload..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/menu/upload" -Method POST -Body $body -Headers $headers
    Write-Host "✅ Upload successful: $($response | ConvertTo-Json)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
} 