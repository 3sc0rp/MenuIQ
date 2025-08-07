import { 
  MenuItem, 
  CustomerPreferences, 
  GuestFeedback, 
  SeasonalTrend, 
  MenuSuggestion, 
  PersonalizedMenuResponse 
} from '../types/menu';

export class PersonalizedMenuService {
  private seasonalTrends: SeasonalTrend[] = [
    {
      season: 'summer',
      popularTags: ['refreshing', 'light', 'grilled', 'seafood', 'salad'],
      trendingItems: ['Grilled Salmon', 'Caesar Salad', 'Fish Tacos', 'Seasonal Berry Tart'],
      seasonalIngredients: ['berries', 'citrus', 'fresh herbs', 'light proteins']
    },
    {
      season: 'winter',
      popularTags: ['comfort', 'warm', 'hearty', 'soup', 'stew'],
      trendingItems: ['Lobster Bisque', 'Mushroom Risotto', 'Steak Frites', 'Chocolate Lava Cake'],
      seasonalIngredients: ['root vegetables', 'warm spices', 'rich sauces', 'comfort carbs']
    },
    {
      season: 'spring',
      popularTags: ['fresh', 'green', 'vegetarian', 'light', 'herbs'],
      trendingItems: ['Caesar Salad', 'Mushroom Risotto', 'Margherita Pizza', 'Seasonal Berry Tart'],
      seasonalIngredients: ['spring greens', 'fresh herbs', 'light vegetables', 'delicate proteins']
    },
    {
      season: 'fall',
      popularTags: ['comfort', 'warm', 'seasonal', 'hearty', 'spiced'],
      trendingItems: ['Mushroom Risotto', 'Steak Frites', 'Chocolate Lava Cake', 'Lobster Bisque'],
      seasonalIngredients: ['pumpkin', 'squash', 'warm spices', 'comfort foods']
    }
  ];

  private guestFeedbackData: GuestFeedback[] = [
    {
      itemId: 1,
      itemName: 'Grilled Salmon',
      feedback: ['perfectly cooked', 'crowd favorite', 'healthy option', 'great presentation'],
      rating: 4.8,
      date: '2024-01-15'
    },
    {
      itemId: 2,
      itemName: 'Beef Burger',
      feedback: ['juicy', 'crowd favorite', 'great value', 'perfect seasoning'],
      rating: 4.6,
      date: '2024-01-15'
    },
    {
      itemId: 3,
      itemName: 'Caesar Salad',
      feedback: ['fresh ingredients', 'too salty', 'perfect dressing', 'light and crisp'],
      rating: 4.2,
      date: '2024-01-15'
    },
    {
      itemId: 4,
      itemName: 'Pasta Carbonara',
      feedback: ['creamy texture', 'authentic taste', 'crowd favorite', 'generous portion'],
      rating: 4.7,
      date: '2024-01-15'
    },
    {
      itemId: 5,
      itemName: 'Chicken Wings',
      feedback: ['perfectly crispy', 'amazing sauce', 'crowd favorite', 'great for sharing'],
      rating: 4.9,
      date: '2024-01-15'
    },
    {
      itemId: 6,
      itemName: 'Truffle Fries',
      feedback: ['addictive', 'perfect seasoning', 'crowd favorite', 'great side'],
      rating: 4.5,
      date: '2024-01-15'
    },
    {
      itemId: 7,
      itemName: 'Ice Cream Sundae',
      feedback: ['delicious', 'too sweet', 'perfect portion', 'beautiful presentation'],
      rating: 4.3,
      date: '2024-01-15'
    },
    {
      itemId: 8,
      itemName: 'Lobster Bisque',
      feedback: ['rich flavor', 'premium quality', 'perfect temperature', 'elegant presentation'],
      rating: 4.4,
      date: '2024-01-15'
    },
    {
      itemId: 9,
      itemName: 'Margherita Pizza',
      feedback: ['authentic', 'perfect crust', 'fresh mozzarella', 'crowd favorite'],
      rating: 4.6,
      date: '2024-01-15'
    },
    {
      itemId: 10,
      itemName: 'Steak Frites',
      feedback: ['perfectly cooked', 'premium quality', 'amazing fries', 'worth the price'],
      rating: 4.8,
      date: '2024-01-15'
    }
  ];

  /**
   * Generate personalized menu suggestions based on customer preferences
   */
  generatePersonalizedSuggestions(
    menuItems: MenuItem[],
    preferences: CustomerPreferences,
    limit: number = 10
  ): PersonalizedMenuResponse {
    const currentSeason = this.getCurrentSeason();
    const seasonalTrend = this.seasonalTrends.find(trend => trend.season === currentSeason);
    
    // Score each menu item based on preferences
    const scoredItems = menuItems.map(item => {
      const score = this.calculateItemScore(item, preferences, seasonalTrend);
      return { item, score };
    });

    // Sort by score and take top suggestions
    const topSuggestions = scoredItems
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ item, score }) => this.createMenuSuggestion(item, score, preferences, seasonalTrend));

    // Generate summary and insights
    const summary = this.generateSummary(topSuggestions, preferences);
    const insights = this.generateInsights(menuItems, seasonalTrend);

    return {
      suggestions: topSuggestions,
      summary,
      insights
    };
  }

  /**
   * Calculate a personalized score for a menu item
   */
  private calculateItemScore(
    item: MenuItem,
    preferences: CustomerPreferences,
    seasonalTrend?: SeasonalTrend
  ): number {
    let score = 0;

    // Base score from sales performance
    const maxSales = Math.max(...this.getAllMenuItems().map(i => i.sales_count || 0));
    const salesScore = (item.sales_count || 0) / maxSales * 30;
    score += salesScore;

    // Guest feedback score
    const feedback = this.getGuestFeedback(item.name);
    if (feedback) {
      score += feedback.rating * 5; // Rating * 5 for 0-50 points
    }

    // Seasonal trend score
    if (seasonalTrend) {
      const seasonalScore = this.calculateSeasonalScore(item, seasonalTrend);
      score += seasonalScore;
    }

    // Preference matching score
    const preferenceScore = this.calculatePreferenceScore(item, preferences);
    score += preferenceScore;

    // Budget compliance score
    const budgetScore = this.calculateBudgetScore(item, preferences.budget);
    score += budgetScore;

    // Dietary compliance score
    const dietaryScore = this.calculateDietaryScore(item, preferences.dietary);
    score += dietaryScore;

    return Math.min(score, 100);
  }

  /**
   * Calculate seasonal relevance score
   */
  private calculateSeasonalScore(item: MenuItem, seasonalTrend: SeasonalTrend): number {
    let score = 0;
    const itemTags = this.parseTags(item.tags);

    // Check if item tags match seasonal popular tags
    const matchingTags = itemTags.filter(tag => 
      seasonalTrend.popularTags.includes(tag)
    );
    score += matchingTags.length * 5;

    // Check if item is in trending items
    if (seasonalTrend.trendingItems.includes(item.name)) {
      score += 15;
    }

    // Check for seasonal ingredients
    const hasSeasonalIngredients = seasonalTrend.seasonalIngredients.some(ingredient =>
      item.name.toLowerCase().includes(ingredient) || 
      itemTags.some(tag => tag.includes(ingredient))
    );
    if (hasSeasonalIngredients) {
      score += 10;
    }

    return score;
  }

  /**
   * Calculate preference matching score
   */
  private calculatePreferenceScore(item: MenuItem, preferences: CustomerPreferences): number {
    let score = 0;
    const itemTags = this.parseTags(item.tags);

    // Spice level matching
    if (preferences.spiceLevel) {
      const spiceMatch = this.matchSpiceLevel(item, preferences.spiceLevel);
      score += spiceMatch ? 15 : 0;
    }

    // Cuisine preference matching
    if (preferences.cuisine) {
      const cuisineMatch = preferences.cuisine.some(cuisine =>
        itemTags.includes(cuisine) || item.name.toLowerCase().includes(cuisine)
      );
      score += cuisineMatch ? 10 : 0;
    }

    // General preferences matching
    if (preferences.preferences) {
      const preferenceMatches = preferences.preferences.filter(pref =>
        itemTags.includes(pref) || item.name.toLowerCase().includes(pref)
      );
      score += preferenceMatches.length * 5;
    }

    return score;
  }

  /**
   * Calculate budget compliance score
   */
  private calculateBudgetScore(item: MenuItem, budget?: string): number {
    if (!budget) return 0;

    const priceRanges = {
      low: { min: 0, max: 12 },
      moderate: { min: 12, max: 25 },
      high: { min: 25, max: 40 },
      premium: { min: 40, max: 100 }
    };

    const range = priceRanges[budget as keyof typeof priceRanges];
    if (!range) return 0;

    if (item.price >= range.min && item.price <= range.max) {
      return 20; // Perfect budget match
    } else if (item.price <= range.max + 5) {
      return 10; // Close to budget
    } else if (item.price <= range.max + 10) {
      return 5; // Slightly over budget
    }

    return -10; // Over budget penalty
  }

  /**
   * Calculate dietary compliance score
   */
  private calculateDietaryScore(item: MenuItem, dietary?: string[]): number {
    if (!dietary || dietary.length === 0) return 0;

    const itemTags = this.parseTags(item.tags);
    let score = 0;

    dietary.forEach(requirement => {
      const isCompliant = this.checkDietaryCompliance(item, requirement, itemTags);
      score += isCompliant ? 15 : -10; // Strong positive for compliance, penalty for non-compliance
    });

    return score;
  }

  /**
   * Check dietary compliance for a specific requirement
   */
  private checkDietaryCompliance(item: MenuItem, requirement: string, itemTags: string[]): boolean {
    const complianceMap: { [key: string]: string[] } = {
      'gluten-free': ['gluten-free', 'naturally gluten-free'],
      'vegetarian': ['vegetarian', 'veggie'],
      'vegan': ['vegan'],
      'dairy-free': ['dairy-free', 'vegan'],
      'nut-free': ['nut-free'],
      'low-carb': ['low-carb', 'keto'],
      'low-sodium': ['low-sodium', 'healthy'],
      'organic': ['organic', 'natural']
    };

    const compliantTags = complianceMap[requirement.toLowerCase()];
    if (!compliantTags) return true; // If we don't know the requirement, assume compliant

    return compliantTags.some(tag => itemTags.includes(tag));
  }

  /**
   * Match spice level preferences
   */
  private matchSpiceLevel(item: MenuItem, preferredSpiceLevel: string): boolean {
    const itemTags = this.parseTags(item.tags);
    const spiceLevels = {
      'mild': ['mild', 'gentle'],
      'medium': ['medium', 'moderate'],
      'spicy': ['spicy', 'hot'],
      'very-spicy': ['very-spicy', 'extra-hot', 'fiery']
    };

    const preferredTags = spiceLevels[preferredSpiceLevel as keyof typeof spiceLevels] || [];
    return preferredTags.some(tag => itemTags.includes(tag));
  }

  /**
   * Create a detailed menu suggestion
   */
  private createMenuSuggestion(
    item: MenuItem,
    score: number,
    preferences: CustomerPreferences,
    seasonalTrend?: SeasonalTrend
  ): MenuSuggestion {
    const reasons = this.generateReasons(item, preferences, seasonalTrend);
    const notes = this.generateNotes(item, preferences);
    const matchScore = this.calculateMatchScore(item, preferences);
    const priceCategory = this.getPriceCategory(item.price);
    const dietaryCompliance = this.getDietaryCompliance(item, preferences.dietary);
    const preferenceMatch = this.getPreferenceMatches(item, preferences);

    return {
      item,
      score,
      reasons,
      notes,
      matchScore,
      priceCategory,
      dietaryCompliance,
      preferenceMatch
    };
  }

  /**
   * Generate reasons for suggesting this item
   */
  private generateReasons(
    item: MenuItem,
    preferences: CustomerPreferences,
    seasonalTrend?: SeasonalTrend
  ): string[] {
    const reasons: string[] = [];
    const itemTags = this.parseTags(item.tags);

    // High performance reason
    if (item.sales_count > 50) {
      reasons.push('High-performing crowd favorite');
    }

    // Guest feedback reasons
    const feedback = this.getGuestFeedback(item.name);
    if (feedback) {
      const positiveFeedback = feedback.feedback.filter(f => 
        !f.includes('too') && !f.includes('not')
      );
      if (positiveFeedback.length > 0) {
        reasons.push(`Guest feedback: ${positiveFeedback[0]}`);
      }
    }

    // Seasonal reasons
    if (seasonalTrend && seasonalTrend.trendingItems.includes(item.name)) {
      reasons.push('Seasonal trending item');
    }

    // Preference reasons
    if (preferences.preferences) {
      const matchingPreferences = preferences.preferences.filter(pref =>
        itemTags.includes(pref) || item.name.toLowerCase().includes(pref)
      );
      if (matchingPreferences.length > 0) {
        reasons.push(`Matches your preferences: ${matchingPreferences.join(', ')}`);
      }
    }

    // Budget reasons
    if (preferences.budget) {
      reasons.push(`Fits your ${preferences.budget} budget`);
    }

    return reasons;
  }

  /**
   * Generate notes about the item
   */
  private generateNotes(item: MenuItem, preferences: CustomerPreferences): string {
    const notes: string[] = [];
    const itemTags = this.parseTags(item.tags);

    // Price note
    if (item.price > 25) {
      notes.push('Premium item');
    } else if (item.price < 15) {
      notes.push('Great value');
    }

    // Dietary notes
    if (preferences.dietary) {
      const compliant = preferences.dietary.filter(diet => 
        this.checkDietaryCompliance(item, diet, itemTags)
      );
      if (compliant.length > 0) {
        notes.push(`Dietary compliant: ${compliant.join(', ')}`);
      }
    }

    // Sales performance note
    if (item.sales_count > 70) {
      notes.push('Very popular choice');
    }

    return notes.join(' • ');
  }

  /**
   * Calculate match score (0-100)
   */
  private calculateMatchScore(item: MenuItem, preferences: CustomerPreferences): number {
    let matchScore = 50; // Base score

    // Preference matching
    if (preferences.preferences) {
      const itemTags = this.parseTags(item.tags);
      const matches = preferences.preferences.filter(pref =>
        itemTags.includes(pref) || item.name.toLowerCase().includes(pref)
      );
      matchScore += matches.length * 10;
    }

    // Budget matching
    if (preferences.budget) {
      const budgetScore = this.calculateBudgetScore(item, preferences.budget);
      matchScore += budgetScore / 2; // Normalize budget score
    }

    return Math.min(Math.max(matchScore, 0), 100);
  }

  /**
   * Get price category
   */
  private getPriceCategory(price: number): 'budget' | 'moderate' | 'premium' {
    if (price <= 12) return 'budget';
    if (price <= 25) return 'moderate';
    return 'premium';
  }

  /**
   * Get dietary compliance list
   */
  private getDietaryCompliance(item: MenuItem, dietary?: string[]): string[] {
    if (!dietary) return [];
    
    const itemTags = this.parseTags(item.tags);
    return dietary.filter(requirement => 
      this.checkDietaryCompliance(item, requirement, itemTags)
    );
  }

  /**
   * Get preference matches
   */
  private getPreferenceMatches(item: MenuItem, preferences: CustomerPreferences): string[] {
    if (!preferences.preferences) return [];
    
    const itemTags = this.parseTags(item.tags);
    return preferences.preferences.filter(pref =>
      itemTags.includes(pref) || item.name.toLowerCase().includes(pref)
    );
  }

  /**
   * Generate summary statistics
   */
  private generateSummary(suggestions: MenuSuggestion[], preferences: CustomerPreferences) {
    const totalSuggestions = suggestions.length;
    const averagePrice = suggestions.reduce((sum, s) => sum + s.item.price, 0) / totalSuggestions;
    const dietaryOptions = [...new Set(suggestions.flatMap(s => s.dietaryCompliance))];
    const preferenceMatches = [...new Set(suggestions.flatMap(s => s.preferenceMatch))];
    const budgetRange = this.getBudgetRange(suggestions);

    return {
      totalSuggestions,
      averagePrice: Math.round(averagePrice * 100) / 100,
      dietaryOptions,
      preferenceMatches,
      budgetRange
    };
  }

  /**
   * Generate insights about the menu
   */
  private generateInsights(menuItems: MenuItem[], seasonalTrend?: SeasonalTrend) {
    const topPerformers = menuItems
      .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
      .slice(0, 3)
      .map(item => item.name);

    const seasonalPicks = seasonalTrend?.trendingItems.slice(0, 3) || [];

    const crowdFavorites = this.guestFeedbackData
      .filter(feedback => feedback.rating >= 4.5)
      .slice(0, 3)
      .map(feedback => feedback.itemName);

    const valueOptions = menuItems
      .filter(item => item.price <= 15 && (item.sales_count || 0) > 30)
      .slice(0, 3)
      .map(item => item.name);

    return {
      topPerformers,
      seasonalPicks,
      crowdFavorites,
      valueOptions
    };
  }

  /**
   * Get budget range from suggestions
   */
  private getBudgetRange(suggestions: MenuSuggestion[]): string {
    if (suggestions.length === 0) return 'N/A';
    
    const prices = suggestions.map(s => s.item.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  }

  /**
   * Get current season
   */
  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  /**
   * Parse tags string into array
   */
  private parseTags(tags: string): string[] {
    if (!tags) return [];
    try {
      return JSON.parse(tags);
    } catch {
      return tags.split(',').map(tag => tag.trim());
    }
  }

  /**
   * Get guest feedback for an item
   */
  private getGuestFeedback(itemName: string): GuestFeedback | undefined {
    return this.guestFeedbackData.find(feedback => 
      feedback.itemName.toLowerCase() === itemName.toLowerCase()
    );
  }

  /**
   * Get all menu items (placeholder - in real app this would come from database)
   */
  private getAllMenuItems(): MenuItem[] {
    // This would typically come from the database
    // For now, return sample data for max sales calculation
    return [
      { id: 1, menu_id: 1, name: "Chicken Wings", price: 14.00, cost: 7.00, sales_count: 89, tags: "appetizer,popular,spicy", created_at: "2024-01-01" },
      { id: 2, menu_id: 1, name: "Beef Burger", price: 16.00, cost: 8.00, sales_count: 78, tags: "burger,popular,main", created_at: "2024-01-01" },
      { id: 3, menu_id: 1, name: "Truffle Fries", price: 8.00, cost: 2.00, sales_count: 67, tags: "side,popular,vegetarian", created_at: "2024-01-01" },
      { id: 4, menu_id: 1, name: "Pasta Carbonara", price: 18.00, cost: 6.00, sales_count: 56, tags: "pasta,italian,main", created_at: "2024-01-01" },
      { id: 5, menu_id: 1, name: "Grilled Salmon", price: 28.00, cost: 12.00, sales_count: 45, tags: "seafood,healthy,popular", created_at: "2024-01-01" }
    ];
  }
}
