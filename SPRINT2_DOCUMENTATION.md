# 🚀 MenuIQ Sprint 2: Intelligent Menu Optimization

## 🎯 Sprint 2 Overview

**Goal**: Deliver intelligent features that provide real insights to restaurant operators through AI-powered menu analysis.

## ✅ Implemented Features

### 1. MenuIQ Score Engine
- **Score Range**: 0-100 for each menu item
- **Weighted Algorithm**: 
  - Profit margin (40%)
  - Sales volume (30%)
  - Waste risk (20%)
  - Seasonality risk (10%)

### 2. Insight Categories
- **Profitability**: Items with low profit margins
- **Popularity**: Items with low sales volume
- **Waste**: Items at risk of waste due to low turnover
- **Seasonality**: Items with seasonal tags

### 3. Intelligent Recommendations
- **Item-specific**: Tailored recommendations for each menu item
- **Category-based**: Grouped insights by problem type
- **Overall menu health**: Complete menu optimization score

## 🔧 Technical Implementation

### Backend Services

#### 1. MenuIQ Insight Engine (`backend/src/services/insightEngine.ts`)
```typescript
export class MenuIQInsightEngine {
  calculateMenuIQScore(item: MenuItem, allItems: MenuItem[]): MenuIQScore
  categorizeItems(items: MenuItem[]): InsightCategory
  calculateMenuHealthScore(items: MenuItem[]): number
}
```

#### 2. Enhanced API Endpoints
- `GET /api/menu/:id/insights` - Complete menu analysis
- `GET /api/menu/:menuId/item/:itemId/score` - Individual item score
- `GET /api/menu/:id/insights/:category` - Category-specific insights

#### 3. TypeScript Types (`backend/src/types/menu.ts`)
```typescript
interface MenuIQScore {
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
}
```

### Frontend Components

#### 1. Insights Page (`frontend/src/pages/Insights.tsx`)
- **Overall Menu Health Score**: Visual score with progress bar
- **Tabbed Interface**: Overview, Item Scores, Categories
- **Interactive Elements**: Score breakdowns and recommendations
- **Real-time Data**: Live API integration

#### 2. Score Visualization
- **Color-coded scores**: Green (excellent) to Red (critical)
- **Progress bars**: Visual representation of scores
- **Category icons**: Intuitive status indicators

## 📊 MenuIQ Score Algorithm

### Score Calculation
```typescript
const rawScore = (
  (profitMarginScore * 0.4) +
  (salesVolumeScore * 0.3) +
  (wasteRiskScore * 0.2) +
  (seasonalityRiskScore * 0.1)
);
```

### Score Categories
- **85-100**: Excellent (Green)
- **70-84**: Good (Blue)
- **50-69**: Average (Yellow)
- **30-49**: Poor (Orange)
- **0-29**: Critical (Red)

### Individual Score Components

#### 1. Profit Margin Score (40% weight)
```typescript
// Based on margin percentage
if (marginPercentage >= 70) return 100;
if (marginPercentage >= 50) return 80;
if (marginPercentage >= 30) return 60;
if (marginPercentage >= 15) return 40;
if (marginPercentage >= 5) return 20;
return 0;
```

#### 2. Sales Volume Score (30% weight)
```typescript
// Normalized against highest volume item
const normalizedVolume = salesCount / maxVolume;
if (normalizedVolume >= 0.8) return 100;
if (normalizedVolume >= 0.6) return 80;
// ... etc
```

#### 3. Waste Risk Score (20% weight)
```typescript
// Higher score = lower waste risk
if (salesCount >= 20) return 100;
if (salesCount >= 15) return 80;
if (salesCount >= 10) return 60;
if (salesCount >= 5) return 40;
if (salesCount >= 2) return 20;
return 0; // High waste risk
```

#### 4. Seasonality Risk Score (10% weight)
```typescript
// Detect seasonal tags
const isSeasonal = tags.some(tag => 
  tag.includes('seasonal') || tag.includes('summer') || 
  tag.includes('winter') || tag.includes('spring') || 
  tag.includes('fall')
);
return isSeasonal ? 60 : 100;
```

## 🎨 User Interface Features

### 1. Overview Dashboard
- **Overall Menu Health**: Large score display with progress bar
- **Recommendations**: Actionable insights list
- **Category Summary**: Quick stats for each problem type

### 2. Item Scores Tab
- **Individual Scores**: Each item with detailed breakdown
- **Score Components**: Profit margin, sales volume, waste risk, seasonality
- **Recommendations**: Item-specific action items

### 3. Categories Tab
- **Problem Groups**: Items grouped by issue type
- **Detailed Analysis**: Specific problems and solutions
- **Action Items**: Clear next steps for each category

## 🔍 Insight Categories

### 1. Profitability Issues
- **Criteria**: Margin percentage < 20%
- **Recommendations**: 
  - Increase price by 10-15%
  - Reduce ingredient costs
  - Review supplier pricing

### 2. Popularity Issues
- **Criteria**: Sales count < 5
- **Recommendations**:
  - Promote item on menu
  - Consider removal
  - Cross-promotion opportunities

### 3. Waste Risk
- **Criteria**: Sales count < 3
- **Recommendations**:
  - Reduce portion sizes
  - Remove from menu
  - Limited-time offers

### 4. Seasonality
- **Criteria**: Tags contain seasonal keywords
- **Recommendations**:
  - Plan for off-season
  - Seasonal pricing strategy
  - Alternative ingredients

## 📈 API Response Examples

### Menu Insights Response
```json
{
  "menuId": 1,
  "overallScore": 72,
  "itemScores": [
    {
      "item": {
        "id": 1,
        "name": "Grilled Salmon",
        "price": 28.00,
        "cost": 12.00,
        "sales_count": 45
      },
      "score": {
        "score": 85,
        "category": "excellent",
        "breakdown": {
          "profitMargin": 100,
          "salesVolume": 80,
          "wasteRisk": 100,
          "seasonalityRisk": 100
        },
        "insights": ["Excellent profit margin - consider premium pricing"],
        "recommendations": ["Consider featuring this item prominently"]
      }
    }
  ],
  "categories": {
    "profitability": [...],
    "popularity": [...],
    "waste": [...],
    "seasonality": [...]
  },
  "recommendations": [
    "Excellent menu performance - maintain current strategy",
    "Consider removing 2 low-performing items"
  ]
}
```

## 🚀 Testing the Features

### 1. Upload Sample Menu
```bash
# Use the sample-menu.json file
curl -X POST http://localhost:3001/api/menu/upload \
  -F "menu=@sample-menu.json" \
  -F "title=Sample Restaurant Menu" \
  -F "userId=1"
```

### 2. Get Menu Insights
```bash
curl http://localhost:3001/api/menu/1/insights
```

### 3. Get Individual Item Score
```bash
curl http://localhost:3001/api/menu/1/item/1/score
```

## 🎯 Business Value

### 1. Data-Driven Decisions
- **Objective scoring**: Remove guesswork from menu decisions
- **Actionable insights**: Clear recommendations for each item
- **Performance tracking**: Monitor improvements over time

### 2. Profit Optimization
- **Margin analysis**: Identify low-profit items
- **Pricing guidance**: Specific price increase recommendations
- **Cost reduction**: Supplier and portion size suggestions

### 3. Waste Reduction
- **Low-turnover detection**: Identify items at risk of waste
- **Inventory management**: Better stock planning
- **Menu optimization**: Remove underperforming items

### 4. Seasonal Planning
- **Seasonal item identification**: Plan for off-season
- **Pricing strategies**: Seasonal pricing recommendations
- **Menu rotation**: Optimize seasonal offerings

## 🔮 Future Enhancements

### 1. Machine Learning Integration
- **Historical data analysis**: Learn from past performance
- **Predictive analytics**: Forecast item performance
- **Dynamic pricing**: AI-powered price optimization

### 2. Advanced Analytics
- **Trend analysis**: Identify emerging patterns
- **Competitive benchmarking**: Compare to industry standards
- **Customer preference modeling**: Understand customer behavior

### 3. Real-time Updates
- **Live sales data**: Real-time score updates
- **Automated alerts**: Notifications for critical issues
- **Performance tracking**: Monitor improvements over time

## 📋 Sprint 2 Checklist

✅ **MenuIQ Score Engine**: Complete scoring algorithm  
✅ **Insight Categories**: Profitability, popularity, waste, seasonality  
✅ **API Endpoints**: Enhanced backend with new insights  
✅ **Frontend Components**: Interactive insights dashboard  
✅ **TypeScript Types**: Complete type safety  
✅ **Sample Data**: Test menu with realistic scenarios  
✅ **Documentation**: Comprehensive feature documentation  

## 🎉 Sprint 2 Complete!

The intelligent menu optimization features are now **production-ready** and provide restaurant operators with:

- **AI-powered scoring** for every menu item
- **Actionable recommendations** based on data analysis
- **Category-based insights** for targeted optimization
- **Professional UI** with intuitive visualizations
- **Real-time API** for live menu analysis

**Next Steps**: Deploy to production and gather user feedback for Sprint 3 enhancements! 