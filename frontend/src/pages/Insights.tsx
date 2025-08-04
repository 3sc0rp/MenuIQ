import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Lightbulb,
  TrendingUp,
  Loader2,
  DollarSign,
  Star,
  Target
} from 'lucide-react';

interface MenuInsights {
  totalItems: number;
  priceAnalysis: {
    averagePrice: number;
    highestPrice: number;
    lowestPrice: number;
    priceRange: string;
  };
  categoryAnalysis: Record<string, number>;
  recommendations: Array<{
    type: string;
    message: string;
    items: any[];
  }>;
  trends: Array<{
    type: string;
    data: Array<{ category: string; count: number }>;
  }>;
}

const Insights: React.FC = () => {
  const { token } = useAuth();
  const [insights, setInsights] = useState<MenuInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu] = useState<number>(1);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/menu/${selectedMenu}/insights`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights);
      } else {
        console.error('Failed to fetch insights');
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMenu, token]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'pricing':
        return <DollarSign className="w-5 h-5 text-yellow-400" />;
      case 'value':
        return <Star className="w-5 h-5 text-green-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Insights</h1>
        <p className="text-gray-400">AI-powered analysis and recommendations for your menus.</p>
      </div>

      {insights ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Items</p>
                  <p className="text-2xl font-bold text-white">{insights.totalItems}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Average Price</p>
                  <p className="text-2xl font-bold text-white">${insights.priceAnalysis.averagePrice.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Price Range</p>
                  <p className="text-2xl font-bold text-white">${insights.priceAnalysis.priceRange}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-white">{Object.keys(insights.categoryAnalysis).length}</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <PieChart className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
            <div className="space-y-4">
              {insights.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-700/50 rounded-lg">
                  {getRecommendationIcon(recommendation.type)}
                  <div className="flex-1">
                    <p className="text-white font-medium">{recommendation.message}</p>
                    {recommendation.items.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recommendation.items.slice(0, 3).map((item, itemIndex) => (
                          <span key={itemIndex} className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
                            {item.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Category Distribution</h2>
              <div className="space-y-3">
                {Object.entries(insights.categoryAnalysis)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 8)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full" 
                            style={{ width: `${(count / insights.totalItems) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium text-sm">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Price Analysis</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Highest Price</span>
                  <span className="text-green-400 font-medium">${insights.priceAnalysis.highestPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Lowest Price</span>
                  <span className="text-red-400 font-medium">${insights.priceAnalysis.lowestPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Average Price</span>
                  <span className="text-blue-400 font-medium">${insights.priceAnalysis.averagePrice.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Price Distribution</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-2 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>${insights.priceAnalysis.lowestPrice.toFixed(0)}</span>
                    <span>${insights.priceAnalysis.averagePrice.toFixed(0)}</span>
                    <span>${insights.priceAnalysis.highestPrice.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trends */}
          {insights.trends.length > 0 && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Trends & Patterns</h2>
              <div className="space-y-4">
                {insights.trends.map((trend, index) => (
                  <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                    <h3 className="text-white font-medium mb-3 capitalize">
                      {trend.type.replace('_', ' ')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {trend.data.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-600/50 rounded">
                          <span className="text-gray-300 text-sm">{item.category}</span>
                          <span className="text-white font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Suggested Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-blue-400" />
                <span className="text-white text-sm">Review pricing strategy</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-white text-sm">Optimize menu items</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-white text-sm">Monitor performance</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Insights Available</h3>
          <p className="text-gray-400">Upload a menu to generate AI-powered insights and recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default Insights; 