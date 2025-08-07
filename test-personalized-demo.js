// Personalized Menu Suggestions Demo
// This script demonstrates the personalized menu suggestion logic

console.log('🍽️  Personalized Menu Suggestions Demo\n');

// Sample menu items
const menuItems = [
  {
    id: 1,
    name: "Grilled Salmon",
    price: 28.00,
    cost: 12.00,
    sales_count: 45,
    tags: "seafood,healthy,popular",
    created_at: "2024-01-01"
  },
  {
    id: 2,
    name: "Beef Burger",
    price: 16.00,
    cost: 8.00,
    sales_count: 78,
    tags: "burger,popular,main",
    created_at: "2024-01-01"
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 12.00,
    cost: 4.00,
    sales_count: 32,
    tags: "salad,healthy,vegetarian",
    created_at: "2024-01-01"
  },
  {
    id: 4,
    name: "Pasta Carbonara",
    price: 18.00,
    cost: 6.00,
    sales_count: 56,
    tags: "pasta,italian,main",
    created_at: "2024-01-01"
  },
  {
    id: 5,
    name: "Chicken Wings",
    price: 14.00,
    cost: 7.00,
    sales_count: 89,
    tags: "appetizer,popular,spicy",
    created_at: "2024-01-01"
  },
  {
    id: 6,
    name: "Truffle Fries",
    price: 8.00,
    cost: 2.00,
    sales_count: 67,
    tags: "side,popular,vegetarian",
    created_at: "2024-01-01"
  },
  {
    id: 7,
    name: "Lobster Bisque",
    price: 22.00,
    cost: 15.00,
    sales_count: 12,
    tags: "soup,seafood,premium",
    created_at: "2024-01-01"
  },
  {
    id: 8,
    name: "Margherita Pizza",
    price: 20.00,
    cost: 8.00,
    sales_count: 34,
    tags: "pizza,italian,vegetarian",
    created_at: "2024-01-01"
  },
  {
    id: 9,
    name: "Steak Frites",
    price: 35.00,
    cost: 18.00,
    sales_count: 28,
    tags: "steak,premium,main",
    created_at: "2024-01-01"
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

// Personalized menu suggestion algorithm
function generatePersonalizedSuggestions(menuItems, preferences, limit = 5) {
  const scoredItems = menuItems.map(item => {
    let score = 0;
    let reasons = [];
    let notes = "";
    let matchScore = 0;
    let priceCategory = "moderate";
    let dietaryCompliance = [];
    let preferenceMatch = [];

    // Sales performance score (0-30 points)
    const maxSales = Math.max(...menuItems.map(i => i.sales_count));
    const salesScore = (item.sales_count / maxSales) * 30;
    score += salesScore;
    if (salesScore > 20) reasons.push("High performer");

    // Budget matching (0-20 points)
    if (preferences.budget) {
      if (preferences.budget === "low" && item.price <= 15) {
        score += 20;
        reasons.push("Budget-friendly");
        priceCategory = "budget";
      } else if (preferences.budget === "moderate" && item.price > 15 && item.price <= 25) {
        score += 20;
        reasons.push("Moderate pricing");
        priceCategory = "moderate";
      } else if (preferences.budget === "premium" && item.price > 25) {
        score += 20;
        reasons.push("Premium option");
        priceCategory = "premium";
      }
    }

    // Dietary restrictions (0-25 points)
    if (preferences.dietary) {
      const itemTags = item.tags.toLowerCase().split(',');
      if (preferences.dietary.includes("vegetarian") && itemTags.includes("vegetarian")) {
        score += 25;
        reasons.push("Vegetarian-friendly");
        dietaryCompliance.push("vegetarian");
      }
      if (preferences.dietary.includes("gluten-free") && !itemTags.includes("pasta") && !itemTags.includes("burger")) {
        score += 25;
        reasons.push("Gluten-free option");
        dietaryCompliance.push("gluten-free");
      }
    }

    // Preference matching (0-15 points)
    if (preferences.preferences) {
      const itemTags = item.tags.toLowerCase().split(',');
      preferences.preferences.forEach(pref => {
        if (itemTags.includes(pref.toLowerCase())) {
          score += 15;
          reasons.push(`Matches ${pref} preference`);
          preferenceMatch.push(pref);
        }
      });
    }

    // Spice level matching (0-10 points)
    if (preferences.spiceLevel) {
      const itemTags = item.tags.toLowerCase().split(',');
      if (preferences.spiceLevel === "spicy" && itemTags.includes("spicy")) {
        score += 10;
        reasons.push("Spicy option");
      } else if (preferences.spiceLevel === "mild" && !itemTags.includes("spicy")) {
        score += 10;
        reasons.push("Mild option");
      }
    }

    // Calculate match percentage
    matchScore = Math.min(100, (score / 100) * 100);

    // Generate notes
    if (reasons.length > 0) {
      notes = `Recommended based on: ${reasons.join(', ')}`;
    } else {
      notes = "Good overall option";
    }

    return {
      item,
      score: Math.round(score * 10) / 10,
      reasons,
      notes,
      matchScore: Math.round(matchScore * 10) / 10,
      priceCategory,
      dietaryCompliance,
      preferenceMatch
    };
  });

  // Sort by score and take top suggestions
  const topSuggestions = scoredItems
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Generate summary
  const totalSuggestions = topSuggestions.length;
  const averagePrice = topSuggestions.reduce((sum, s) => sum + s.item.price, 0) / totalSuggestions;
  const dietaryOptions = [...new Set(topSuggestions.flatMap(s => s.dietaryCompliance))];
  const preferenceMatches = [...new Set(topSuggestions.flatMap(s => s.preferenceMatch))];
  const budgetRange = preferences.budget || "moderate";

  const summary = {
    totalSuggestions,
    averagePrice: Math.round(averagePrice * 100) / 100,
    dietaryOptions,
    preferenceMatches,
    budgetRange
  };

  // Generate insights
  const insights = {
    topPerformers: topSuggestions.filter(s => s.reasons.includes("High performer")).map(s => s.item.name),
    seasonalPicks: topSuggestions.filter(s => s.reasons.includes("Seasonal")).map(s => s.item.name),
    crowdFavorites: topSuggestions.filter(s => s.reasons.includes("Popular")).map(s => s.item.name),
    valueOptions: topSuggestions.filter(s => s.priceCategory === "budget").map(s => s.item.name)
  };

  return {
    suggestions: topSuggestions,
    summary,
    insights
  };
}

// Test each preference profile
testPreferences.forEach(profile => {
  console.log(`👤 Testing: ${profile.name}`);
  console.log(`📋 Preferences: ${JSON.stringify(profile.preferences, null, 2)}`);
  
  const suggestions = generatePersonalizedSuggestions(menuItems, profile.preferences, 5);
  
  console.log('\n🎯 Top Suggestions:');
  suggestions.suggestions.forEach((suggestion, index) => {
    console.log(`${index + 1}. ${suggestion.item.name} - $${suggestion.item.price}`);
    console.log(`   Score: ${suggestion.score} | Match: ${suggestion.matchScore}%`);
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
  
  console.log('─'.repeat(80));
  console.log('');
});

console.log('✅ Personalized menu suggestion demo completed!');
console.log('\n🎯 Key Features Demonstrated:');
console.log('• Multi-factor scoring algorithm (sales, budget, dietary, preferences)');
console.log('• Personalized recommendations based on customer preferences');
console.log('• Dietary restriction compliance (vegetarian, gluten-free)');
console.log('• Budget matching (low, moderate, premium)');
console.log('• Spice level preferences');
console.log('• Detailed reasoning and match scores');
console.log('• Summary statistics and insights');
