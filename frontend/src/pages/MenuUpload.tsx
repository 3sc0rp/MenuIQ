import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MenuFile {
  id: number;
  name: string;
  date: string;
  status: string;
  menuId: number;
  items_count: number;
  title: string;
}

interface UploadMessage {
  type: 'success' | 'error';
  message: string;
}

const MenuUpload: React.FC = () => {
  const { token } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<MenuFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<UploadMessage | null>(null);

  // Mock data for when backend is not available
  const mockMenus: MenuFile[] = [
    {
      id: 1,
      name: "Summer Menu 2024",
      date: "2024-08-04",
      status: "processed",
      menuId: 1,
      items_count: 15,
      title: "Summer Menu 2024"
    },
    {
      id: 2,
      name: "Weekend Specials",
      date: "2024-08-03", 
      status: "processed",
      menuId: 2,
      items_count: 12,
      title: "Weekend Specials"
    },
    {
      id: 3,
      name: "Holiday Menu",
      date: "2024-08-02",
      status: "processed", 
      menuId: 3,
      items_count: 18,
      title: "Holiday Menu"
    }
  ];

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/menus', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedMenus = data.menus.map((menu: any) => ({
            id: menu.id,
            name: menu.title,
            date: new Date(menu.createdAt).toLocaleDateString(),
            status: menu.status,
            menuId: menu.id,
            items_count: menu.itemsCount,
            title: menu.title
          }));
          setUploadedFiles(formattedMenus);
        } else {
          throw new Error(data.error || 'Failed to fetch menus');
        }
      } else {
        throw new Error('Failed to fetch menus');
      }
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      setUploadedFiles(mockMenus);
      setUploadMessage({ 
        type: 'error', 
        message: 'Backend server is not available. Showing demo data.' 
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setUploadMessage(null);

      const formData = new FormData();
      formData.append('menu', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, '')); // Remove file extension for title

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add new menu to the list
        const newMenu: MenuFile = {
          id: Date.now(),
          name: file.name,
          date: new Date().toLocaleDateString(),
          status: 'processed',
          menuId: result.menuId,
          items_count: result.itemsCount,
          title: file.name.replace(/\.[^/.]+$/, '')
        };
        
        setUploadedFiles(prev => [newMenu, ...prev]);
        setUploadMessage({ type: 'success', message: `Menu uploaded successfully! ${result.itemsCount} items processed.` });
        
        // Refresh the menu list
        setTimeout(() => {
          fetchMenus();
        }, 1000);
      } else {
        const error = await response.json();
        setUploadMessage({ type: 'error', message: error.error || 'Upload failed' });
      }
    } catch (error) {
      console.warn('Backend not available, simulating upload:', error);
      // Simulate successful upload for demo
      const newMenu: MenuFile = {
        id: Date.now(),
        name: file.name,
        date: new Date().toLocaleDateString(),
        status: 'processed',
        menuId: mockMenus.length + 1,
        items_count: Math.floor(Math.random() * 20) + 5,
        title: file.name.replace(/\.[^/.]+$/, '')
      };
      
      setUploadedFiles(prev => [newMenu, ...prev]);
      setUploadMessage({ 
        type: 'success', 
        message: `Menu uploaded successfully! ${newMenu.items_count} items processed. (Demo mode - backend not available)` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/menu/${menuId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUploadedFiles(prev => prev.filter(menu => menu.menuId !== menuId));
        setUploadMessage({ type: 'success', message: 'Menu deleted successfully' });
      } else {
        setUploadMessage({ type: 'error', message: 'Failed to delete menu' });
      }
    } catch (error) {
      console.warn('Backend not available, simulating delete:', error);
      // Simulate successful delete for demo
      setUploadedFiles(prev => prev.filter(menu => menu.menuId !== menuId));
      setUploadMessage({ 
        type: 'success', 
        message: 'Menu deleted successfully (Demo mode - backend not available)' 
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Menu Upload</h1>
        <p className="text-gray-400">Upload and manage your restaurant menus for AI-powered analysis.</p>
      </div>

      {/* Upload Message */}
      {uploadMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          uploadMessage.type === 'success' 
            ? 'bg-green-400/10 border border-green-400/20' 
            : 'bg-red-400/10 border border-red-400/20'
        }`}>
          {uploadMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className={uploadMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {uploadMessage.message}
          </span>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-gray-700 rounded-lg p-6 mb-8">
        <div className="border-2 border-dashed border-gray-500 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Upload Menu File</h3>
          <p className="text-gray-400 mb-4">
            Drag and drop your menu file here, or click to browse
          </p>
          <input
            type="file"
            accept=".json,.csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-cyan hover:bg-accent-cyan/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-cyan cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Uploading...' : 'Choose File'}
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JSON, CSV, Excel (.xlsx, .xls)
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Uploaded Menus</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan mx-auto mb-4"></div>
            <p className="text-gray-400">Loading menus...</p>
          </div>
        ) : uploadedFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No menus uploaded yet</p>
            <p className="text-sm text-gray-500 mt-1">Upload your first menu to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {uploadedFiles.map((menu) => (
              <div key={menu.id} className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{menu.name}</h4>
                    <p className="text-sm text-gray-400">
                      {menu.items_count} items • {menu.date} • {menu.status}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMenu(menu.menuId)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                  title="Delete menu"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuUpload; 