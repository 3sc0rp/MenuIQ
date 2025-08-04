# 🚀 MenuIQ Enhanced Insights - Sprint 2.5

## 🎯 Enhanced Features Overview

**Goal**: Deliver intelligent suggested actions and advanced analytics for restaurant menu optimization.

## ✅ New Features Implemented

### 1. Suggested Actions Engine
- **"Promote this item"** (high margin + low sales)
- **"Consider removing"** (low margin + low sales)
- **"Reprice for profit"** (high sales + low margin)
- **"Seasonal – monitor performance"** (seasonal items)
- **"Top Performer"** (high sales + high margin)
- **"Monitor performance"** (default for other items)

### 2. Sales Trend Analysis
- **Increasing**: Items with high sales volume (≥50)
- **Stable**: Items with moderate sales (20-49)
- **Declining**: Items with low sales (<20)

### 3. Item Clustering
- **Tag-based clustering**: Groups items with similar tags
- **Cluster analysis**: Identifies menu patterns
- **Multi-item clusters**: Only shows clusters with 2+ items

### 4. Enhanced Frontend
- **Sortable table**: Sort by score, margin, sales, name
- **Action filtering**: Filter by action type
- **Color-coded indicators**: Visual action status
- **Trend indicators**: Sales trend visualization

## 🔧 Technical Implementation

### Backend Enhancements

#### 1. Enhanced MenuIQ Score Interface
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
  suggestedAction: string;
  actionType: 'promote' | 'remove' | 'reprice' | 'seasonal' | 'top-performer' | 'monitor';
  salesTrend: 'increasing' | 'stable' | 'declining';
}
```

#### 2. Suggested Action Algorithm
```typescript
private generateSuggestedAction(item: MenuItem, scores: any): { action: string; type: MenuIQScore['actionType'] } {
  const margin = (item.price || 0) - (item.cost || 0);
  const marginPercentage = item.price > 0 ? (margin / item.price) * 100 : 0;
  const salesCount = item.sales_count || 0;
  
  // High margin + low sales = Promote
  if (marginPercentage >= 50 && salesCount < 10) {
    return { action: 'Promote this item', type: 'promote' };
  }
  
  // Low margin + low sales = Remove
  if (marginPercentage < 20 && salesCount < 5) {
    return { action: 'Consider removing', type: 'remove' };
  }
  
  // High sales + low margin = Reprice
  if (salesCount >= 20 && marginPercentage < 30) {
    return { action: 'Reprice for profit', type: 'reprice' };
  }
  
  // Seasonal items
  if (isSeasonal) {
    return { action: 'Seasonal – monitor performance', type: 'seasonal' };
  }
  
  // High sales + high margin = Top performer
  if (salesCount >= 30 && marginPercentage >= 50) {
    return { action: 'Top Performer', type: 'top-performer' };
  }
  
  return { action: 'Monitor performance', type: 'monitor' };
}
```

#### 3. Clustering Algorithm
```typescript
clusterItemsByTags(items: MenuItem[]): ItemCluster[] {
  const tagMap = new Map<string, MenuItem[]>();
  
  items.forEach(item => {
    const tags = item.tags ? JSON.parse(item.tags) : [];
    tags.forEach((tag: string) => {
      const normalizedTag = tag.toLowerCase().trim();
      if (!tagMap.has(normalizedTag)) {
        tagMap.set(normalizedTag, []);
      }
      tagMap.get(normalizedTag)!.push(item);
    });
  });
  
  // Convert to array and filter clusters with multiple items
  const clusters: ItemCluster[] = [];
  tagMap.forEach((items, tag) => {
    if (items.length > 1) {
      clusters.push({ tag, items, count: items.length });
    }
  });
  
  return clusters.sort((a, b) => b.count - a.count);
}
```

### Frontend Enhancements

#### 1. Enhanced Insights Table
- **Sortable columns**: Click headers to sort
- **Action indicators**: Color-coded action badges
- **Trend indicators**: Visual sales trend icons
- **Filtering**: Dropdown to filter by action type

#### 2. Action Summary Cards
- **Promote**: Green indicators for items to promote
- **Remove**: Red indicators for items to remove
- **Reprice**: Orange indicators for pricing adjustments
- **Seasonal**: Blue indicators for seasonal items
- **Top Performers**: Purple indicators for star items
- **Monitor**: Gray indicators for items to watch

#### 3. Clustering Display
- **Tag clusters**: Groups of items with similar tags
- **Cluster counts**: Number of items in each cluster
- **Item previews**: Shows first 3 items in each cluster

## 📊 Action Logic Examples

### 1. "Promote this item" (High Margin + Low Sales)
```json
{
  "name": "Premium Wagyu Burger",
  "price": 45.00,
  "cost": 15.00,
  "sales_count": 5,
  "margin_percentage": 66.7,
  "action": "Promote this item",
  "actionType": "promote"
}
```

### 2. "Consider removing" (Low Margin + Low Sales)
```json
{
  "name": "Failed Experiment",
  "price": 8.00,
  "cost": 7.00,
  "sales_count": 2,
  "margin_percentage": 12.5,
  "action": "Consider removing",
  "actionType": "remove"
}
```

### 3. "Reprice for profit" (High Sales + Low Margin)
```json
{
  "name": "Budget Pasta",
  "price": 12.00,
  "cost": 10.00,
  "sales_count": 25,
  "margin_percentage": 16.7,
  "action": "Reprice for profit",
  "actionType": "reprice"
}
```

### 4. "Top Performer" (High Sales + High Margin)
```json
{
  "name": "Star Performer",
  "price": 25.00,
  "cost": 8.00,
  "sales_count": 45,
  "margin_percentage": 68.0,
  "action": "Top Performer",
  "actionType": "top-performer"
}
```

## 🎨 UI/UX Features

### 1. Color-Coded Action Indicators
- **Green**: Promote items (high potential)
- **Red**: Remove items (low performance)
- **Orange**: Reprice items (pricing opportunity)
- **Blue**: Seasonal items (planning needed)
- **Purple**: Top performers (maintain excellence)
- **Gray**: Monitor items (watch and wait)

### 2. Interactive Table Features
- **Sortable columns**: Click any column header
- **Hover effects**: Visual feedback on interaction
- **Responsive design**: Works on all screen sizes
- **Loading states**: Smooth loading animations

### 3. Filtering Capabilities
- **Action-based filtering**: Filter by suggested action
- **Count indicators**: Shows number of items in each category
- **Quick filters**: One-click filtering options

## 🧪 Testing Implementation

### 1. Unit Tests
```typescript
describe('generateSuggestedAction', () => {
  it('should suggest "Promote this item" for high margin + low sales', () => {
    const score = engine.calculateMenuIQScore(mockItems[0], mockItems);
    expect(score.suggestedAction).toBe('Promote this item');
    expect(score.actionType).toBe('promote');
  });
  
  it('should suggest "Consider removing" for low margin + low sales', () => {
    const score = engine.calculateMenuIQScore(mockItems[1], mockItems);
    expect(score.suggestedAction).toBe('Consider removing');
    expect(score.actionType).toBe('remove');
  });
});
```

### 2. Sample Data Testing
The enhanced sample menu includes:
- **High margin + low sales**: Premium Wagyu Burger
- **Low margin + low sales**: Failed Experiment
- **High sales + low margin**: Budget Pasta
- **Seasonal items**: Spring Asparagus, Winter Squash Soup
- **Top performers**: Star Performer, Grilled Salmon

## 📈 API Response Enhancement

### Enhanced Insights Response
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
        "suggestedAction": "Top Performer",
        "actionType": "top-performer",
        "salesTrend": "increasing"
      }
    }
  ],
  "actionCounts": {
    "promote": 2,
    "remove": 1,
    "reprice": 1,
    "seasonal": 3,
    "top-performer": 4,
    "monitor": 9
  },
  "clusters": [
    {
      "tag": "italian",
      "items": [...],
      "count": 3
    }
  ]
}
```

## 🚀 Usage Instructions

### 1. Upload Enhanced Menu
```bash
curl -X POST http://localhost:3001/api/menu/upload \
  -F "menu=@sample-menu.json" \
  -F "title=Enhanced Test Menu" \
  -F "userId=1"
```

### 2. Get Enhanced Insights
```bash
curl http://localhost:3001/api/menu/1/insights
```

### 3. Frontend Access
- Navigate to http://localhost:3000/insights
- Use the filter dropdown to view specific action types
- Click column headers to sort the table
- View action summary cards for quick overview

## 🎯 Business Value

### 1. Actionable Intelligence
- **Clear recommendations**: Specific actions for each item
- **Priority-based**: Focus on high-impact changes first
- **Risk assessment**: Identify items at risk of waste

### 2. Performance Optimization
- **Promotion opportunities**: Identify high-margin, low-sales items
- **Pricing optimization**: Target items with pricing potential
- **Menu cleanup**: Remove underperforming items

### 3. Strategic Planning
- **Seasonal planning**: Prepare for seasonal item changes
- **Trend analysis**: Monitor sales trends over time
- **Pattern recognition**: Identify menu clusters and themes

## 🔮 Future Enhancements

### 1. Advanced Analytics
- **Historical trend analysis**: Compare week-over-week performance
- **Predictive modeling**: Forecast item performance
- **Competitive benchmarking**: Compare to industry standards

### 2. Machine Learning Integration
- **Dynamic pricing**: AI-powered price optimization
- **Demand forecasting**: Predict seasonal demand patterns
- **Personalization**: Tailored recommendations per restaurant

### 3. Real-time Features
- **Live updates**: Real-time score updates
- **Automated alerts**: Notifications for critical changes
- **Performance tracking**: Monitor improvement over time

## 📋 Implementation Checklist

✅ **Suggested Actions Engine**: Complete action logic  
✅ **Sales Trend Analysis**: Trend determination algorithm  
✅ **Item Clustering**: Tag-based clustering system  
✅ **Enhanced API**: Updated response format  
✅ **Frontend Table**: Sortable and filterable interface  
✅ **Action Indicators**: Color-coded visual system  
✅ **Unit Tests**: Comprehensive test coverage  
✅ **Sample Data**: Enhanced test menu with all action types  
✅ **Documentation**: Complete feature documentation  

## 🎉 Enhanced Insights Complete!

The MenuIQ platform now provides **intelligent suggested actions** and **advanced analytics** that help restaurant operators:

- **Make data-driven decisions** with clear action recommendations
- **Optimize menu performance** through targeted improvements
- **Identify opportunities** for promotion, pricing, and removal
- **Plan strategically** with seasonal and trend analysis
- **Monitor progress** with comprehensive performance tracking

**Ready for production deployment and user feedback!** 