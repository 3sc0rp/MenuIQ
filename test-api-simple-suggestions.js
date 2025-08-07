// Simple API Test for Personalized Menu Suggestions
// This script tests the personalized menu suggestion API endpoint directly

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

console.log('🍽️  Testing Personalized Menu Suggestions API\n');

// Test preferences
const testPreferences = [
  {
    name: "Vegetarian Moderate Budget",
    preferences: {
      dietary: ["vegetarian"],
      preferences: ["healthy"],
      budget: "moderate"
    }
  },
  {
    name: "Spicy Food Lover",
    preferences: {
      preferences: ["spicy"],
      budget: "moderate",
      spiceLevel: "spicy"
    }
  },
  {
    name: "Premium Diner",
    preferences: {
      budget: "premium",
      preferences: ["premium"]
    }
  }
];

async function testPersonalizedSuggestions() {
  for (const profile of testPreferences) {
    console.log(`👤 Testing: ${profile.name}`);
    console.log(`📋 Preferences: ${JSON.stringify(profile.preferences, null, 2)}`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/menu/1/suggestions`, {
        preferences: profile.preferences,
        limit: 3
      });
      
      const suggestions = response.data.suggestions;
      
      console.log('\n🎯 Top Suggestions:');
      suggestions.suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion.item.name} - $${suggestion.item.price}`);
        console.log(`   Score: ${suggestion.score} | Match: ${suggestion.matchScore}%`);
        console.log(`   Reasons: ${suggestion.reasons.join(', ')}`);
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
      console.log(`   Value Options: ${suggestions.insights.valueOptions.join(', ')}`);
      
    } catch (error) {
      console.log(`❌ Error testing ${profile.name}: ${error.response?.data?.error || error.message}`);
    }
    
    console.log('─'.repeat(80));
    console.log('');
  }
  
  console.log('✅ All API tests completed!');
}

// Test server health first
async function testServerHealth() {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log(`✅ Server is healthy: ${response.data.message}`);
    console.log(`📊 Database: ${response.data.database}`);
    console.log(`🔧 Version: ${response.data.version}`);
    console.log('');
    return true;
  } catch (error) {
    console.log(`❌ Server health check failed: ${error.message}`);
    console.log('Make sure the server is running with: npm run server:working');
    return false;
  }
}

// Run tests
async function runTests() {
  const isHealthy = await testServerHealth();
  if (isHealthy) {
    await testPersonalizedSuggestions();
  }
}

runTests();
