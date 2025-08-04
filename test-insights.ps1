# Test script for insights functionality
Write-Host "Testing MenuIQ Enhanced Insights..." -ForegroundColor Green

# Test 1: Health check
Write-Host "`n1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET
    Write-Host "✅ Health check passed: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Create a simple menu with test data
Write-Host "`n2. Testing menu creation..." -ForegroundColor Yellow
$testMenu = @{
    title = "Test Menu"
    userId = "1"
    items = @(
        @{
            name = "Premium Wagyu Burger"
            price = 45.00
            cost = 15.00
            sales_count = 5
            tags = @("burger", "premium", "wagyu")
        },
        @{
            name = "Failed Experiment"
            price = 8.00
            cost = 7.00
            sales_count = 2
            tags = @("experimental", "low-demand")
        },
        @{
            name = "Budget Pasta"
            price = 12.00
            cost = 10.00
            sales_count = 25
            tags = @("pasta", "budget", "italian")
        },
        @{
            name = "Star Performer"
            price = 25.00
            cost = 8.00
            sales_count = 45
            tags = @("popular", "main", "star")
        },
        @{
            name = "Spring Asparagus"
            price = 16.00
            cost = 6.00
            sales_count = 12
            tags = @("vegetable", "seasonal", "spring")
        }
    )
}

# Convert to JSON
$testMenuJson = $testMenu | ConvertTo-Json -Depth 3

# Test 3: Try to upload the test menu
Write-Host "`n3. Testing menu upload..." -ForegroundColor Yellow
try {
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"title`"",
        "",
        $testMenu.title,
        "--$boundary",
        "Content-Disposition: form-data; name=`"userId`"",
        "",
        $testMenu.userId,
        "--$boundary",
        "Content-Disposition: form-data; name=`"menu`"; filename=`"test-menu.json`"",
        "Content-Type: application/json",
        "",
        $testMenuJson,
        "--$boundary--"
    ) -join $LF
    
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/menu/upload" -Method POST -Body $bodyLines -ContentType "multipart/form-data; boundary=$boundary"
    Write-Host "✅ Menu upload successful: Menu ID $($response.menuId)" -ForegroundColor Green
    
    # Test 4: Get insights for the uploaded menu
    Write-Host "`n4. Testing insights endpoint..." -ForegroundColor Yellow
    $insights = Invoke-RestMethod -Uri "http://localhost:3001/api/menu/$($response.menuId)/insights" -Method GET
    Write-Host "✅ Insights retrieved successfully!" -ForegroundColor Green
    
    # Display key insights
    Write-Host "`n📊 MenuIQ Insights Summary:" -ForegroundColor Cyan
    Write-Host "Overall Score: $($insights.overallScore)" -ForegroundColor White
    Write-Host "Total Items: $($insights.itemScores.Count)" -ForegroundColor White
    
    Write-Host "`n🎯 Action Counts:" -ForegroundColor Cyan
    foreach ($action in $insights.actionCounts.PSObject.Properties) {
        if ($action.Value -gt 0) {
            Write-Host "  $($action.Name): $($action.Value)" -ForegroundColor White
        }
    }
    
    Write-Host "`n📋 Sample Item Scores:" -ForegroundColor Cyan
    $insights.itemScores | Select-Object -First 3 | ForEach-Object {
        $item = $_.item
        $score = $_.score
        Write-Host "  $($item.name): Score $($score.score) - $($score.suggestedAction)" -ForegroundColor White
    }
    
    if ($insights.clusters.Count -gt 0) {
        Write-Host "`n🏷️  Item Clusters:" -ForegroundColor Cyan
        $insights.clusters | ForEach-Object {
            Write-Host "  $($_.tag): $($_.count) items" -ForegroundColor White
        }
    }
    
} catch {
    Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host "`n🎉 Enhanced Insights Test Complete!" -ForegroundColor Green 