import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, FileText, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData } from '../utils/api';

interface DashboardStats {
  totalMenus: number;
  totalItems: number;
  averageItemsPerMenu: number;
}

interface RecentMenu {
  id: number;
  title: string;
  itemsCount: number;
  createdAt: string;
}

interface CategoryStat {
  category: string;
  count: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentMenus: RecentMenu[];
  categoryStats: CategoryStat[];
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  // Mock data for when backend is not available
  const mockData: DashboardData = {
    stats: {
      totalMenus: 5,
      totalItems: 67,
      averageItemsPerMenu: 13
    },
    recentMenus: [
      {
        id: 1,
        title: "Summer Menu 2024",
        itemsCount: 15,
        createdAt: "2024-08-04T10:30:00Z"
      },
      {
        id: 2,
        title: "Weekend Specials",
        itemsCount: 12,
        createdAt: "2024-08-03T14:20:00Z"
      },
      {
        id: 3,
        title: "Holiday Menu",
        itemsCount: 18,
        createdAt: "2024-08-02T09:15:00Z"
      }
    ],
    categoryStats: [
      { category: "Appetizers", count: 8 },
      { category: "Main Courses", count: 12 },
      { category: "Desserts", count: 6 },
      { category: "Beverages", count: 4 }
    ]
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const responseData = await getDashboardData(token);
      if (responseData.success) {
        setData(responseData);
      } else {
        throw new Error(responseData.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      setData(mockData);
      setError('Backend server is not available. Showing demo data.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-700 rounded-lg p-6">
                <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-600 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Unable to load dashboard</h2>
          <p className="text-gray-400">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your menu analytics and insights.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Menus</p>
              <p className="text-2xl font-bold text-white">{data.stats.totalMenus}</p>
            </div>
            <FileText className="w-8 h-8 text-accent-cyan" />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Items</p>
              <p className="text-2xl font-bold text-white">{data.stats.totalItems}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-accent-purple" />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Items/Menu</p>
              <p className="text-2xl font-bold text-white">{data.stats.averageItemsPerMenu}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent-green" />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">1</p>
            </div>
            <Users className="w-8 h-8 text-accent-orange" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Menus */}
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Menus</h3>
          <div className="space-y-4">
            {data.recentMenus.map((menu) => (
              <div key={menu.id} className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{menu.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {menu.itemsCount} items • {new Date(menu.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-accent-cyan">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
          <div className="space-y-4">
            {data.categoryStats.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <span className="text-white">{category.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-accent-cyan h-2 rounded-full" 
                      style={{ width: `${(category.count / Math.max(...data.categoryStats.map(c => c.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-sm w-8 text-right">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 