# Test Personalized Menu Suggestions Service
# This script tests the personalized menu suggestion API with different customer preferences

$API_BASE_URL = "http://localhost:3001/api"

Write-Host "🍽️  Testing Personalized Menu Suggestions" -ForegroundColor Green
Write-Host ""

# Test customer preferences
$testPreferences = @(
    @{
        name = "Gluten-Free Health Conscious"
        preferences = @{
            dietary = @("gluten-free")
            preferences = @("healthy", "light")
            budget = "moderate"
            spiceLevel = "mild"
        }
    },
    @{
        name = "Spicy Food Lover"
        preferences = @{
            preferences = @("spicy", "bold")
            budget = "moderate"
            spiceLevel = "spicy"
        }
    },
    @{
        name = "Premium Diner"
        preferences = @{
            budget = "premium"
            preferences = @("premium", "elegant")
            cuisine = @("italian", "french")
        }
    },
    @{
        name = "Budget Conscious"
        preferences = @{
            budget = "low"
            preferences = @("value", "popular")
        }
    },
    @{
        name = "Vegetarian"
        preferences = @{
            dietary = @("vegetarian")
            preferences = @("fresh", "healthy")
            budget = "moderate"
        }
    }
)

# Sample menu data for testing
$sampleMenuItems = @(
    @{
        name = "Grilled Salmon"
        price = 28.00
        cost = 12.00
        sales_count = 45
        tags = @("seafood", "healthy", "popular")
    },
    @{
        name = "Beef Burger"
        price = 16.00
        cost = 8.00
        sales_count = 78
        tags = @("burger", "popular", "main")
    },
    @{
        name = "Caesar Salad"
        price = 12.00
        cost = 4.00
        sales_count = 32
        tags = @("salad", "healthy", "vegetarian")
    },
    @{
        name = "Pasta Carbonara"
        price = 18.00
        cost = 6.00
        sales_count = 56
        tags = @("pasta", "italian", "main")
    },
    @{
        name = "Chicken Wings"
        price = 14.00
        cost = 7.00
        sales_count = 89
        tags = @("appetizer", "popular", "spicy")
    },
    @{
        name = "Truffle Fries"
        price = 8.00
        cost = 2.00
        sales_count = 67
        tags = @("side", "popular", "vegetarian")
    },
    @{
        name = "Ice Cream Sundae"
        price = 9.00
        cost = 3.00
        sales_count = 23
        tags = @("dessert", "sweet")
    },
    @{
        name = "Lobster Bisque"
        price = 22.00
        cost = 15.00
        sales_count = 12
        tags = @("soup", "seafood", "premium")
    },
    @{
        name = "Margherita Pizza"
        price = 20.00
        cost = 8.00
        sales_count = 34
        tags = @("pizza", "italian", "vegetarian")
    },
    @{
        name = "Steak Frites"
        price = 35.00
        cost = 18.00
        sales_count = 28
        tags = @("steak", "premium", "main")
    }
)

try {
    # First, create a test menu
    Write-Host "📝 Creating test menu..." -ForegroundColor Yellow
    
    $menuBody = @{
        title = "Test Menu for Personalized Suggestions"
        userId = 1
    } | ConvertTo-Json
    
    $menuResponse = Invoke-RestMethod -Uri "$API_BASE_URL/menu/upload" -Method POST -Body $menuBody -ContentType "application/json"
    $menuId = $menuResponse.menuId
    Write-Host "✅ Created menu with ID: $menuId" -ForegroundColor Green
    Write-Host ""

    # Test each preference profile
    foreach ($profile in $testPreferences) {
        Write-Host "👤 Testing: $($profile.name)" -ForegroundColor Cyan
        Write-Host "📋 Preferences: $($profile.preferences | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
        
        try {
            $requestBody = @{
                preferences = $profile.preferences
                limit = 5
            } | ConvertTo-Json -Depth 3
            
            $response = Invoke-RestMethod -Uri "$API_BASE_URL/menu/$menuId/suggestions" -Method POST -Body $requestBody -ContentType "application/json"
            $suggestions = $response.suggestions
            
            Write-Host ""
            Write-Host "🎯 Top Suggestions:" -ForegroundColor Yellow
            
            for ($i = 0; $i -lt $suggestions.suggestions.Count; $i++) {
                $suggestion = $suggestions.suggestions[$i]
                Write-Host "$($i + 1). $($suggestion.item.name) - `$$($suggestion.item.price)" -ForegroundColor White
                Write-Host "   Score: $([math]::Round($suggestion.score, 1)) | Match: $([math]::Round($suggestion.matchScore, 1))%" -ForegroundColor Gray
                Write-Host "   Reasons: $($suggestion.reasons -join ', ')" -ForegroundColor Gray
                Write-Host "   Notes: $($suggestion.notes)" -ForegroundColor Gray
                Write-Host "   Price Category: $($suggestion.priceCategory)" -ForegroundColor Gray
                if ($suggestion.dietaryCompliance.Count -gt 0) {
                    Write-Host "   Dietary: $($suggestion.dietaryCompliance -join ', ')" -ForegroundColor Gray
                }
                Write-Host ""
            }
            
            Write-Host "📊 Summary:" -ForegroundColor Yellow
            Write-Host "   Total Suggestions: $($suggestions.summary.totalSuggestions)" -ForegroundColor Gray
            Write-Host "   Average Price: `$$($suggestions.summary.averagePrice)" -ForegroundColor Gray
            Write-Host "   Budget Range: $($suggestions.summary.budgetRange)" -ForegroundColor Gray
            if ($suggestions.summary.dietaryOptions.Count -gt 0) {
                Write-Host "   Dietary Options: $($suggestions.summary.dietaryOptions -join ', ')" -ForegroundColor Gray
            }
            Write-Host ""
            
            Write-Host "💡 Insights:" -ForegroundColor Yellow
            Write-Host "   Top Performers: $($suggestions.insights.topPerformers -join ', ')" -ForegroundColor Gray
            Write-Host "   Seasonal Picks: $($suggestions.insights.seasonalPicks -join ', ')" -ForegroundColor Gray
            Write-Host "   Crowd Favorites: $($suggestions.insights.crowdFavorites -join ', ')" -ForegroundColor Gray
            Write-Host "   Value Options: $($suggestions.insights.valueOptions -join ', ')" -ForegroundColor Gray
            
        } catch {
            Write-Host "❌ Error testing $($profile.name): $($_.Exception.Message)" -ForegroundColor Red
        }
        
        Write-Host "─" * 80 -ForegroundColor DarkGray
        Write-Host ""
    }
    
    Write-Host "✅ All personalized suggestion tests completed!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
}
