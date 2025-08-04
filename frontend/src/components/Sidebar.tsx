import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  Settings, 
  Users, 
  Shield, 
  Menu as MenuIcon,
  TrendingUp,
  FileText,
  Database
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      name: 'Menu Upload',
      href: '/upload',
      icon: Upload,
      description: 'Upload and manage menus'
    },
    {
      name: 'Insights',
      href: '/insights',
      icon: BarChart3,
      description: 'AI-powered insights'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Account and preferences'
    }
  ];

  const adminNavigation = [
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      description: 'Manage users and roles'
    },
    {
      name: 'System Analytics',
      href: '/admin/analytics',
      icon: TrendingUp,
      description: 'System-wide analytics'
    },
    {
      name: 'Database',
      href: '/admin/database',
      icon: Database,
      description: 'Database management'
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MenuIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MenuIQ</h1>
            <p className="text-xs text-gray-400">AI Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main
          </h3>
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </h3>
            <div className="space-y-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-700/50 rounded-lg">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Menus</span>
              </div>
              <span className="text-sm font-medium text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Insights</span>
              </div>
              <span className="text-sm font-medium text-white">8</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">Users</span>
              </div>
              <span className="text-sm font-medium text-white">24</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-400">MenuIQ v2.0.0</p>
          <p className="text-xs text-gray-500 mt-1">AI-Powered Menu Optimization</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 