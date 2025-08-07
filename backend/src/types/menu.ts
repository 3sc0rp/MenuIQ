export interface MenuItem {
  id: number;
  menu_id: number;
  name: string;
  price: number;
  cost: number;
  tags: string;
  sales_count: number;
  created_at: string;
}

export interface Menu {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
}

export interface MenuWithItems {
  menu: Menu;
  items: MenuItem[];
}

export interface MenuIQScore {
  score: number;
  category: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  breakdown: {
    profitMargin: number;
    salesVolume: number;
    wasteRisk: number;
    seasonalityRisk: number;
  };
  insights: string[];
  recommendations: string[];
  suggestedAction: string;
  actionType: 'promote' | 'remove' | 'reprice' | 'seasonal' | 'top-performer' | 'monitor';
  salesTrend: 'increasing' | 'stable' | 'declining';
}

export interface MenuItemScore {
  item: MenuItem;
  score: MenuIQScore;
}

export interface InsightCategory {
  profitability: MenuItem[];
  popularity: MenuItem[];
  waste: MenuItem[];
  seasonality: MenuItem[];
}

export interface ItemCluster {
  tag: string;
  items: MenuItem[];
  count: number;
}

export interface ActionCounts {
  promote: number;
  remove: number;
  reprice: number;
  seasonal: number;
  'top-performer': number;
  monitor: number;
}

export interface MenuInsights {
  menuId: number;
  overallScore: number;
  itemScores: MenuItemScore[];
  categories: InsightCategory;
  recommendations: string[];
  clusters: ItemCluster[];
  actionCounts: ActionCounts;
}

// Personalized Menu Suggestion Types
export interface CustomerPreferences {
  dietary?: string[];
  preferences?: string[];
  budget?: 'low' | 'moderate' | 'high' | 'premium';
  spiceLevel?: 'mild' | 'medium' | 'spicy' | 'very-spicy';
  cuisine?: string[];
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'appetizer';
}

export interface GuestFeedback {
  itemId: number;
  itemName: string;
  feedback: string[];
  rating: number;
  date: string;
}

export interface SeasonalTrend {
  season: string;
  popularTags: string[];
  trendingItems: string[];
  seasonalIngredients: string[];
}

export interface MenuSuggestion {
  item: MenuItem;
  score: number;
  reasons: string[];
  notes: string;
  matchScore: number;
  priceCategory: 'budget' | 'moderate' | 'premium';
  dietaryCompliance: string[];
  preferenceMatch: string[];
}

export interface PersonalizedMenuResponse {
  suggestions: MenuSuggestion[];
  summary: {
    totalSuggestions: number;
    averagePrice: number;
    dietaryOptions: string[];
    preferenceMatches: string[];
    budgetRange: string;
  };
  insights: {
    topPerformers: string[];
    seasonalPicks: string[];
    crowdFavorites: string[];
    valueOptions: string[];
  };
} 