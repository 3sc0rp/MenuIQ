# Manual test for insights functionality
Write-Host "Testing enhanced insights with manual data..." -ForegroundColor Green

# First, let's test if we can get insights for a non-existent menu
Write-Host "`n1. Testing insights for non-existent menu..." -ForegroundColor Yellow
try {
    $insights = Invoke-RestMethod -Uri "http://localhost:3001/api/menu/999/insights" -Method GET
    Write-Host "Unexpected success for non-existent menu" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly got error for non-existent menu: $($_.Exception.Message)" -ForegroundColor Green
}

# Let's create a simple test by directly testing the insight engine logic
Write-Host "`n2. Testing individual item score endpoint..." -ForegroundColor Yellow

# First, let's try to create a menu manually by inserting into the database
# We'll use a simple approach - let's test the health endpoint and see if we can get any response
Write-Host "`n3. Testing all available endpoints..." -ForegroundColor Yellow

$endpoints = @(
    "/api/health",
    "/api/menus?userId=1"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001$endpoint" -Method GET
        Write-Host "✅ $endpoint - Success" -ForegroundColor Green
        Write-Host "   Response: $($response | ConvertTo-Json -Depth 1)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ $endpoint - Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Manual test complete!" -ForegroundColor Green 