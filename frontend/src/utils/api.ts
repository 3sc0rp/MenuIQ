// API configuration for different environments
const getApiBaseUrl = () => {
  // Use explicit environment variable if set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // In production, use Render backend URL
  return 'https://menuiq-backend.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

// API utility functions
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API functions
export const healthCheck = () => apiRequest('/api/health');

export const getDashboardData = (token: string) => 
  apiRequest('/api/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

export const getMenus = (token: string) => 
  apiRequest('/api/menus', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

export const uploadMenu = (token: string, formData: FormData) => 
  fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

export const deleteMenu = (token: string, menuId: number) => 
  apiRequest(`/api/menu/${menuId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

export const getSettings = (token: string) => 
  apiRequest('/api/user/settings', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

export const saveSettings = (token: string, settings: any) => 
  apiRequest('/api/user/settings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });

export const getPersonalizedSuggestions = (menuId: string, preferences: any, limit: number = 10) => 
  apiRequest(`/api/menu/${menuId}/suggestions`, {
    method: 'POST',
    body: JSON.stringify({ preferences, limit }),
  }); 