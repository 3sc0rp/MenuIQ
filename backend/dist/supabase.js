"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbHelpers = exports.TABLES = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY');
}
// Create Supabase client
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Database table names
exports.TABLES = {
    USERS: 'users',
    MENUS: 'menus',
    MENU_ITEMS: 'menu_items',
    UPLOADS: 'uploads',
    SETTINGS: 'user_settings',
    INSIGHTS: 'insights'
};
// Database helper functions
exports.dbHelpers = {
    // User operations
    async createUser(userData) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.USERS)
            .insert(userData)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async getUserById(id) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.USERS)
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            return null;
        return data;
    },
    async getUserByEmail(email) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.USERS)
            .select('*')
            .eq('email', email)
            .single();
        if (error)
            return null;
        return data;
    },
    // Menu operations
    async createMenu(menuData) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.MENUS)
            .insert(menuData)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async getMenusByUserId(userId) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.MENUS)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data || [];
    },
    async getMenuById(id) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.MENUS)
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            return null;
        return data;
    },
    async updateMenu(id, updates) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.MENUS)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async deleteMenu(id) {
        const { error } = await exports.supabase
            .from(exports.TABLES.MENUS)
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    },
    // Menu items operations
    async createMenuItem(itemData) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.MENU_ITEMS)
            .insert(itemData)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async getMenuItems(menuId) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.MENU_ITEMS)
            .select('*')
            .eq('menu_id', menuId)
            .order('created_at', { ascending: true });
        if (error)
            throw error;
        return data || [];
    },
    // Upload operations
    async createUpload(uploadData) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.UPLOADS)
            .insert(uploadData)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async updateUpload(id, updates) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.UPLOADS)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // Settings operations
    async getUserSettings(userId) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.SETTINGS)
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error)
            return null;
        return data;
    },
    async createUserSettings(settingsData) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.SETTINGS)
            .insert(settingsData)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async updateUserSettings(userId, updates) {
        const { data, error } = await exports.supabase
            .from(exports.TABLES.SETTINGS)
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // Dashboard statistics
    async getDashboardStats(userId) {
        const { data: menus, error: menusError } = await exports.supabase
            .from(exports.TABLES.MENUS)
            .select('id, items_count')
            .eq('user_id', userId);
        if (menusError)
            throw menusError;
        const totalMenus = menus?.length || 0;
        const totalItems = menus?.reduce((sum, menu) => sum + (menu.items_count || 0), 0) || 0;
        const averageItemsPerMenu = totalMenus > 0 ? Math.round(totalItems / totalMenus) : 0;
        const { data: recentMenus, error: recentError } = await exports.supabase
            .from(exports.TABLES.MENUS)
            .select('id, title, items_count, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);
        if (recentError)
            throw recentError;
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
//# sourceMappingURL=supabase.js.map