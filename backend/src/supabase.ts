import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  MENUS: 'menus',
  MENU_ITEMS: 'menu_items',
  UPLOADS: 'uploads',
  SETTINGS: 'user_settings',
  INSIGHTS: 'insights'
} as const;

// Database types
export interface User {
  id: string;
  email: string;
  full_name: string;
  restaurant_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  menu_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  dietary_info?: string[];
  allergens?: string[];
  created_at: string;
}

export interface Upload {
  id: string;
  user_id: string;
  menu_id: string;
  file_name: string;
  file_size: number;
  status: 'processing' | 'completed' | 'failed';
  items_processed: number;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  profile: {
    full_name: string;
    email: string;
    restaurant_name: string;
  };
  notifications: {
    email_notifications: boolean;
    push_notifications: boolean;
  };
  appearance: {
    dark_mode: boolean;
    auto_save: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Insight {
  id: string;
  menu_id: string;
  type: 'pricing' | 'popularity' | 'category' | 'dietary';
  data: any;
  created_at: string;
}

// Database helper functions
export const dbHelpers = {
  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return null;
    return data;
  },

  // Menu operations
  async createMenu(menuData: Partial<Menu>): Promise<Menu> {
    const { data, error } = await supabase
      .from(TABLES.MENUS)
      .insert(menuData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMenusByUserId(userId: string): Promise<Menu[]> {
    const { data, error } = await supabase
      .from(TABLES.MENUS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getMenuById(id: string): Promise<Menu | null> {
    const { data, error } = await supabase
      .from(TABLES.MENUS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  async updateMenu(id: string, updates: Partial<Menu>): Promise<Menu> {
    const { data, error } = await supabase
      .from(TABLES.MENUS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteMenu(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.MENUS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Menu items operations
  async createMenuItem(itemData: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from(TABLES.MENU_ITEMS)
      .insert(itemData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMenuItems(menuId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from(TABLES.MENU_ITEMS)
      .select('*')
      .eq('menu_id', menuId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Upload operations
  async createUpload(uploadData: Partial<Upload>): Promise<Upload> {
    const { data, error } = await supabase
      .from(TABLES.UPLOADS)
      .insert(uploadData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUpload(id: string, updates: Partial<Upload>): Promise<Upload> {
    const { data, error } = await supabase
      .from(TABLES.UPLOADS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Settings operations
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from(TABLES.SETTINGS)
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) return null;
    return data;
  },

  async createUserSettings(settingsData: Partial<UserSettings>): Promise<UserSettings> {
    const { data, error } = await supabase
      .from(TABLES.SETTINGS)
      .insert(settingsData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    const { data, error } = await supabase
      .from(TABLES.SETTINGS)
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Dashboard statistics
  async getDashboardStats(userId: string) {
    const { data: menus, error: menusError } = await supabase
      .from(TABLES.MENUS)
      .select('id, items_count')
      .eq('user_id', userId);
    
    if (menusError) throw menusError;

    const totalMenus = menus?.length || 0;
    const totalItems = menus?.reduce((sum, menu) => sum + (menu.items_count || 0), 0) || 0;
    const averageItemsPerMenu = totalMenus > 0 ? Math.round(totalItems / totalMenus) : 0;

    const { data: recentMenus, error: recentError } = await supabase
      .from(TABLES.MENUS)
      .select('id, title, items_count, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    return {
      stats: {
        totalMenus,
        totalItems,
        averageItemsPerMenu
      },
      recentMenus: recentMenus || []
    };
  }
}; 