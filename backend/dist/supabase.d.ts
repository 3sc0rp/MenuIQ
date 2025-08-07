export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare const TABLES: {
    readonly USERS: "users";
    readonly MENUS: "menus";
    readonly MENU_ITEMS: "menu_items";
    readonly UPLOADS: "uploads";
    readonly SETTINGS: "user_settings";
    readonly INSIGHTS: "insights";
};
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
export declare const dbHelpers: {
    createUser(userData: Partial<User>): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    createMenu(menuData: Partial<Menu>): Promise<Menu>;
    getMenusByUserId(userId: string): Promise<Menu[]>;
    getMenuById(id: string): Promise<Menu | null>;
    updateMenu(id: string, updates: Partial<Menu>): Promise<Menu>;
    deleteMenu(id: string): Promise<void>;
    createMenuItem(itemData: Partial<MenuItem>): Promise<MenuItem>;
    getMenuItems(menuId: string): Promise<MenuItem[]>;
    createUpload(uploadData: Partial<Upload>): Promise<Upload>;
    updateUpload(id: string, updates: Partial<Upload>): Promise<Upload>;
    getUserSettings(userId: string): Promise<UserSettings | null>;
    createUserSettings(settingsData: Partial<UserSettings>): Promise<UserSettings>;
    updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings>;
    getDashboardStats(userId: string): Promise<{
        stats: {
            totalMenus: number;
            totalItems: number;
            averageItemsPerMenu: number;
        };
        recentMenus: {
            id: any;
            title: any;
            items_count: any;
            created_at: any;
        }[];
    }>;
};
//# sourceMappingURL=supabase.d.ts.map