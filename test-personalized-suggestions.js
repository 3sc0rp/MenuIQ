const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

// Sample menu data for testing
const sampleMenuItems = [
  {
    name: "Grilled Salmon",
    price: 28.00,
    cost: 12.00,
    sales_count: 45,
    tags: ["seafood", "healthy", "popular"]
  },
  {
    name: "Beef Burger",
    price: 16.00,
    cost: 8.00,
    sales_count: 78,
    tags: ["burger", "popular", "main"]
  },
  {
    name: "Caesar Salad",
    price: 12.00,
    cost: 4.00,
    sales_count: 32,
    tags: ["salad", "healthy", "vegetarian"]
  },
  {
    name: "Pasta Carbonara",
    price: 18.00,
    cost: 6.00,
    sales_count: 56,
    tags: ["pasta", "italian", "main"]
  },
  {
    name: "Chicken Wings",
    price: 14.00,
    cost: 7.00,
    sales_count: 89,
    tags: ["appetizer", "popular", "spicy"]
  },
  {
    name: "Truffle Fries",
    price: 8.00,
    cost: 2.00,
    sales_count: 67,
    tags: ["side", "popular", "vegetarian"]
  },
  {
    name: "Ice Cream Sundae",
    price: 9.00,
    cost: 3.00,
    sales_count: 23,
    tags: ["dessert", "sweet"]
  },
  {
    name: "Lobster Bisque",
    price: 22.00,
    cost: 15.00,
    sales_count: 12,
    tags: ["soup", "seafood", "premium"]
  },
  {
    name: "Margherita Pizza",
    price: 20.00,
    cost: 8.00,
    sales_count: 34,
    tags: ["pizza", "italian", "vegetarian"]
  },
  {
    name: "Steak Frites",
    price: 35.00,
    cost: 18.00,
    sales_count: 28,
    tags: ["steak", "premium", "main"]
  },
  {
    name: "Seasonal Berry Tart",
    price: 11.00,
    cost: 4.00,
    sales_count: 8,
    tags: ["dessert", "seasonal", "summer"]
  },
  {
    name: "Mushroom Risotto",
    price: 19.00,
    cost: 7.00,
    sales_count: 15,
    tags: ["risotto", "vegetarian", "italian"]
  },
  {
    name: "Fish Tacos",
    price: 15.00,
    cost: 9.00,
    sales_count: 41,
    tags: ["tacos", "seafood", "popular"]
  },
  {
    name: "Chocolate Lava Cake",
    price: 10.00,
    cost: 3.00,
    sales_count: 19,
    tags: ["dessert", "chocolate", "popular"]
  }
];

// Test customer preferences
const testPreferences = [
  {
    name: "Gluten-Free Health Conscious",
    preferences: {
      dietary: ["gluten-free"],
      preferences: ["healthy", "light"],
      budget: "moderate",
      spiceLevel: "mild"
    }
  },
  {
    name: "Spicy Food Lover",
    preferences: {
      preferences: ["spicy", "bold"],
      budget: "moderate",
      spiceLevel: "spicy"
    }
  },
  {
    name: "Premium Diner",
    preferences: {
      budget: "premium",
      preferences: ["premium", "elegant"],
      cuisine: ["italian", "french"]
    }
  },
  {
    name: "Budget Conscious",
    preferences: {
      budget: "low",
      preferences: ["value", "popular"]
    }
  },
  {
    name: "Vegetarian",
    preferences: {
      dietary: ["vegetarian"],
      preferences: ["fresh", "healthy"],
      budget: "moderate"
    }
  }
];

async function testPersonalizedSuggestions() {
  console.log('🍽️  Testing Personalized Menu Suggestions\n');

  try {
    // First, create a test menu
    console.log('📝 Creating test menu...');
    const menuResponse = await axios.post(`${API_BASE_URL}/menu/upload`, {
      title: 'Test Menu for Personalized Suggestions',
      userId: 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const menuId = menuResponse.data.menuId;
    console.log(`✅ Created menu with ID: ${menuId}\n`);

    // Test each preference profile
    for (const profile of testPreferences) {
      console.log(`👤 Testing: ${profile.name}`);
      console.log(`📋 Preferences:`, JSON.stringify(profile.preferences, null, 2));
      
      try {
        const response = await axios.post(`${API_BASE_URL}/menu/${menuId}/suggestions`, {
          preferences: profile.preferences,
          limit: 5
        });

        const suggestions = response.data.suggestions;
        
        console.log('\n🎯 Top Suggestions:');
        suggestions.suggestions.forEach((suggestion, index) => {
          console.log(`${index + 1}. ${suggestion.item.name} - $${suggestion.item.price}`);
          console.log(`   Score: ${suggestion.score.toFixed(1)} | Match: ${suggestion.matchScore.toFixed(1)}%`);
          console.log(`   Reasons: ${suggestion.reasons.join(', ')}`);
          console.log(`   Notes: ${suggestion.notes}`);
          console.log(`   Price Category: ${suggestion.priceCategory}`);
          if (suggestion.dietaryCompliance.length > 0) {
            console.log(`   Dietary: ${suggestion.dietaryCompliance.join(', ')}`);
          }
          console.log('');
        });

        console.log('📊 Summary:');
        console.log(`   Total Suggestions: ${suggestions.summary.totalSuggestions}`);
        console.log(`   Average Price: $${suggestions.summary.averagePrice}`);
        console.log(`   Budget Range: ${suggestions.summary.budgetRange}`);
        if (suggestions.summary.dietaryOptions.length > 0) {
          console.log(`   Dietary Options: ${suggestions.summary.dietaryOptions.join(', ')}`);
        }
        console.log('');

        console.log('💡 Insights:');
        console.log(`   Top Performers: ${suggestions.insights.topPerformers.join(', ')}`);
        console.log(`   Seasonal Picks: ${suggestions.insights.seasonalPicks.join(', ')}`);
        console.log(`   Crowd Favorites: ${suggestions.insights.crowdFavorites.join(', ')}`);
        console.log(`   Value Options: ${suggestions.insights.valueOptions.join(', ')}`);
        
      } catch (error) {
        console.error(`❌ Error testing ${profile.name}:`, error.response?.data || error.message);
      }
      
      console.log('─'.repeat(80));
      console.log('');
    }

    console.log('✅ All personalized suggestion tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testPersonalizedSuggestions();
