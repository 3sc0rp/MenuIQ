# Personalized Menu Suggestion Service

## Overview

The Personalized Menu Suggestion Service generates customized menu recommendations based on customer preferences, high-performing items, guest feedback, and seasonal trends. This service helps restaurants provide better customer experiences by suggesting items that match individual preferences and dietary requirements.

## Features

### 🎯 Personalized Recommendations
- **Customer Preferences**: Dietary restrictions, spice levels, cuisine preferences, budget constraints
- **High-Performing Items**: Items with strong sales performance and customer satisfaction
- **Guest Feedback Integration**: Real customer reviews and ratings
- **Seasonal Trends**: Recommendations based on current season and trending items

### 📊 Scoring System
The service uses a comprehensive scoring algorithm that considers:
- **Sales Performance** (30%): Items with higher sales get better scores
- **Guest Feedback** (25%): Customer ratings and positive reviews
- **Seasonal Relevance** (20%): Items trending in current season
- **Preference Matching** (15%): Alignment with customer preferences
- **Budget Compliance** (10%): Price range matching

### 🏷️ Dietary Compliance
Supports various dietary requirements:
- Gluten-free
- Vegetarian/Vegan
- Dairy-free
- Nut-free
- Low-carb/Keto
- Low-sodium
- Organic

## API Endpoint

### POST `/api/menu/:id/suggestions`

Generate personalized menu suggestions for a specific menu.

**Request Body:**
```json
{
  "preferences": {
    "dietary": ["gluten-free", "vegetarian"],
    "preferences": ["spicy", "healthy"],
    "budget": "moderate",
    "spiceLevel": "medium",
    "cuisine": ["italian", "asian"],
    "mealType": "dinner"
  },
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "menuId": 1,
  "suggestions": {
    "suggestions": [
      {
        "item": {
          "id": 1,
          "name": "Grilled Salmon",
          "price": 28.00,
          "cost": 12.00,
          "sales_count": 45,
          "tags": ["seafood", "healthy", "popular"]
        },
        "score": 85.5,
        "reasons": [
          "High-performing crowd favorite",
          "Guest feedback: perfectly cooked",
          "Matches your preferences: healthy",
          "Fits your moderate budget"
        ],
        "notes": "Premium item • Dietary compliant: gluten-free",
        "matchScore": 75,
        "priceCategory": "premium",
        "dietaryCompliance": ["gluten-free"],
        "preferenceMatch": ["healthy"]
      }
    ],
    "summary": {
      "totalSuggestions": 5,
      "averagePrice": 22.40,
      "dietaryOptions": ["gluten-free", "vegetarian"],
      "preferenceMatches": ["healthy", "spicy"],
      "budgetRange": "$12.00 - $35.00"
    },
    "insights": {
      "topPerformers": ["Chicken Wings", "Beef Burger", "Truffle Fries"],
      "seasonalPicks": ["Grilled Salmon", "Caesar Salad", "Fish Tacos"],
      "crowdFavorites": ["Chicken Wings", "Beef Burger", "Pasta Carbonara"],
      "valueOptions": ["Truffle Fries", "Ice Cream Sundae", "Fish Tacos"]
    }
  }
}
```

## Customer Preferences

### Dietary Restrictions
- `dietary`: Array of dietary requirements
  - `"gluten-free"`, `"vegetarian"`, `"vegan"`, `"dairy-free"`, `"nut-free"`, `"low-carb"`, `"low-sodium"`, `"organic"`

### General Preferences
- `preferences`: Array of general preferences
  - `"spicy"`, `"healthy"`, `"light"`, `"premium"`, `"value"`, `"popular"`, `"fresh"`, `"bold"`

### Budget Levels
- `budget`: Budget constraint
  - `"low"` ($0-$12), `"moderate"` ($12-$25), `"high"` ($25-$40), `"premium"` ($40+)

### Spice Levels
- `spiceLevel`: Preferred spice intensity
  - `"mild"`, `"medium"`, `"spicy"`, `"very-spicy"`

### Cuisine Types
- `cuisine`: Preferred cuisine types
  - `"italian"`, `"asian"`, `"mexican"`, `"french"`, `"american"`, etc.

### Meal Types
- `mealType`: Preferred meal type
  - `"breakfast"`, `"lunch"`, `"dinner"`, `"dessert"`, `"appetizer"`

## Seasonal Trends

The service automatically considers seasonal trends:

### Summer
- Popular tags: refreshing, light, grilled, seafood, salad
- Trending items: Grilled Salmon, Caesar Salad, Fish Tacos, Seasonal Berry Tart

### Winter
- Popular tags: comfort, warm, hearty, soup, stew
- Trending items: Lobster Bisque, Mushroom Risotto, Steak Frites, Chocolate Lava Cake

### Spring
- Popular tags: fresh, green, vegetarian, light, herbs
- Trending items: Caesar Salad, Mushroom Risotto, Margherita Pizza, Seasonal Berry Tart

### Fall
- Popular tags: comfort, warm, seasonal, hearty, spiced
- Trending items: Mushroom Risotto, Steak Frites, Chocolate Lava Cake, Lobster Bisque

## Guest Feedback Integration

The service includes sample guest feedback data with:
- Customer ratings (1-5 stars)
- Detailed feedback comments
- Positive and negative feedback tags
- Date tracking for trend analysis

## Usage Examples

### Example 1: Gluten-Free Health Conscious Customer
```json
{
  "preferences": {
    "dietary": ["gluten-free"],
    "preferences": ["healthy", "light"],
    "budget": "moderate",
    "spiceLevel": "mild"
  }
}
```

### Example 2: Spicy Food Lover
```json
{
  "preferences": {
    "preferences": ["spicy", "bold"],
    "budget": "moderate",
    "spiceLevel": "spicy"
  }
}
```

### Example 3: Premium Diner
```json
{
  "preferences": {
    "budget": "premium",
    "preferences": ["premium", "elegant"],
    "cuisine": ["italian", "french"]
  }
}
```

## Testing

Run the test script to see the service in action:

```bash
node test-personalized-suggestions.js
```

This will test various customer preference profiles and demonstrate the personalized recommendation capabilities.

## Implementation Details

### Service Architecture
- **PersonalizedMenuService**: Main service class
- **Scoring Algorithm**: Multi-factor scoring system
- **Seasonal Trends**: Automatic season detection and trend matching
- **Guest Feedback**: Integration with customer review data
- **Dietary Compliance**: Comprehensive dietary requirement checking

### Database Integration
- Fetches menu items from PostgreSQL database
- Supports existing menu structure
- Compatible with current API endpoints

### Extensibility
- Easy to add new dietary requirements
- Configurable scoring weights
- Pluggable feedback systems
- Customizable seasonal trends

## Future Enhancements

1. **Machine Learning Integration**: Use ML models for better preference prediction
2. **Real-time Feedback**: Integrate with live customer feedback systems
3. **Personalization History**: Track customer preferences over time
4. **A/B Testing**: Test different recommendation algorithms
5. **Multi-language Support**: Support for international cuisines and preferences
