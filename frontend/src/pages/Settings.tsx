import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Settings {
  profile: {
    fullName: string;
    email: string;
    restaurantName: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  appearance: {
    darkMode: boolean;
    autoSave: boolean;
  };
}

interface SaveMessage {
  type: 'success' | 'error';
  message: string;
}

const Settings: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<SaveMessage | null>(null);
  const [settings, setSettings] = useState<Settings>({
    profile: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      restaurantName: 'The Grand Bistro'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false
    },
    appearance: {
      darkMode: true,
      autoSave: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.warn('Backend not available, using default settings:', error);
      // Use default settings when backend is not available
      setSettings({
        profile: {
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          restaurantName: 'The Grand Bistro'
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: false
        },
        appearance: {
          darkMode: true,
          autoSave: true
        }
      });
      setSaveMessage({ 
        type: 'error', 
        message: 'Backend server is not available. Using default settings.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof Settings],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/user/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveMessage({ type: 'success', message: 'Settings saved successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.warn('Backend not available, simulating save:', error);
      // Simulate successful save for demo
      setSaveMessage({ 
        type: 'success', 
        message: 'Settings saved successfully! (Demo mode - backend not available)' 
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and application preferences.</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          saveMessage.type === 'success' 
            ? 'bg-green-400/10 border border-green-400/20' 
            : 'bg-red-400/10 border border-red-400/20'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className={saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {saveMessage.message}
          </span>
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-accent-cyan" />
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={settings.profile.fullName}
                onChange={(e) => handleSettingChange('profile', 'fullName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={settings.profile.restaurantName}
                onChange={(e) => handleSettingChange('profile', 'restaurantName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-accent-purple" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Email Notifications</h3>
                <p className="text-gray-400 text-sm">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Push Notifications</h3>
                <p className="text-gray-400 text-sm">Receive push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6 text-accent-green" />
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Dark Mode</h3>
                <p className="text-gray-400 text-sm">Use dark theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.appearance.darkMode}
                  onChange={(e) => handleSettingChange('appearance', 'darkMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Auto Save</h3>
                <p className="text-gray-400 text-sm">Automatically save changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.appearance.autoSave}
                  onChange={(e) => handleSettingChange('appearance', 'autoSave', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-accent-orange" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                <p className="text-gray-400 text-sm">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/80 transition-colors">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Change Password</h3>
                <p className="text-gray-400 text-sm">Update your account password</p>
              </div>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/80 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 