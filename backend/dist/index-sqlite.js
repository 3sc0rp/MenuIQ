"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '3001');
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
// File upload configuration
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/json', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only JSON, CSV, and Excel files are allowed.'));
        }
    }
});
// Database initialization
let db;
async function initializeDatabase() {
    db = await (0, sqlite_1.open)({
        filename: path_1.default.join(__dirname, '../database.sqlite'),
        driver: sqlite3_1.default.Database
    });
    // Create tables
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      file_name TEXT NOT NULL,
      items_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'processed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      category TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (menu_id) REFERENCES menus (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_id INTEGER NOT NULL,
      insight_type TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (menu_id) REFERENCES menus (id) ON DELETE CASCADE
    );
  `);
    console.log('✅ SQLite database initialized successfully');
}
// Authentication middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await db.get('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.userId]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
// Admin middleware
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'MenuIQ API is running',
        database: 'SQLite',
        version: '2.0.0',
        features: ['Authentication', 'Menu Management', 'AI Insights', 'User Management']
    });
});
// Authentication routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }
        // Check if user already exists
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create user
        const result = await db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: result.lastID }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: result.lastID,
                email,
                name,
                role: 'user'
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // Find user
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Check password
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get user info' });
    }
});
// User management routes
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await db.all('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, users });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
app.put('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role } = req.body;
        await db.run('UPDATE users SET name = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [name, role, id]);
        res.json({ success: true, message: 'User updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});
app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Don't allow admin to delete themselves
        if (parseInt(id) === req.user?.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }
        await db.run('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
// Menu upload with authentication
app.post('/api/menu/upload', authenticateToken, upload.single('menu'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { title } = req.body;
        const userId = req.user.id;
        // Parse menu data based on file type
        let menuItems = [];
        let itemsCount = 0;
        if (req.file.mimetype === 'application/json') {
            const menuData = JSON.parse(req.file.buffer.toString());
            menuItems = Array.isArray(menuData) ? menuData : menuData.items || [];
            itemsCount = menuItems.length;
        }
        else {
            // For CSV and Excel files, you would need additional parsing logic
            itemsCount = 0;
        }
        // Insert menu
        const menuResult = await db.run('INSERT INTO menus (user_id, title, file_name, items_count) VALUES (?, ?, ?, ?)', [userId, title || req.file.originalname, req.file.originalname, itemsCount]);
        const menuId = menuResult.lastID;
        // Insert menu items
        if (menuItems.length > 0) {
            for (const item of menuItems) {
                await db.run('INSERT INTO menu_items (menu_id, name, description, price, category, tags) VALUES (?, ?, ?, ?, ?, ?)', [
                    menuId,
                    item.name || item.title || '',
                    item.description || '',
                    item.price || 0,
                    item.category || '',
                    item.tags ? JSON.stringify(item.tags) : ''
                ]);
            }
        }
        // Generate insights
        await generateInsights(menuId, menuItems);
        res.json({
            success: true,
            message: 'Menu uploaded successfully',
            menuId,
            itemsCount,
            insights: true
        });
    }
    catch (error) {
        console.error('Menu upload error:', error);
        res.status(500).json({ error: 'Failed to upload menu' });
    }
});
// Get user's menus
app.get('/api/menus', authenticateToken, async (req, res) => {
    try {
        const menus = await db.all('SELECT * FROM menus WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json({ success: true, menus });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch menus' });
    }
});
// Get menu details
app.get('/api/menu/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await db.get('SELECT * FROM menus WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (!menu) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        const items = await db.all('SELECT * FROM menu_items WHERE menu_id = ? ORDER BY name', [id]);
        res.json({
            success: true,
            menu: { ...menu, items }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});
// Get menu insights
app.get('/api/menu/:id/insights', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        // Check if menu belongs to user
        const menu = await db.get('SELECT * FROM menus WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (!menu) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        // Get stored insights or generate new ones
        let insights = await db.get('SELECT * FROM insights WHERE menu_id = ? ORDER BY created_at DESC LIMIT 1', [id]);
        if (!insights) {
            // Generate insights if none exist
            const items = await db.all('SELECT * FROM menu_items WHERE menu_id = ?', [id]);
            await generateInsights(parseInt(id), items);
            insights = await db.get('SELECT * FROM insights WHERE menu_id = ? ORDER BY created_at DESC LIMIT 1', [id]);
        }
        const parsedInsights = insights ? JSON.parse(insights.data) : {};
        res.json({
            success: true,
            insights: parsedInsights
        });
    }
    catch (error) {
        console.error('Insights error:', error);
        res.status(500).json({ error: 'Failed to fetch insights' });
    }
});
// Delete menu
app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.run('DELETE FROM menus WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        res.json({ success: true, message: 'Menu deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete menu' });
    }
});
// Generate insights function
async function generateInsights(menuId, items) {
    try {
        const insights = {
            totalItems: items.length,
            priceAnalysis: {
                averagePrice: 0,
                highestPrice: 0,
                lowestPrice: Infinity,
                priceRange: '0-0'
            },
            categoryAnalysis: {},
            recommendations: [],
            trends: []
        };
        if (items.length > 0) {
            // Price analysis
            const prices = items.map(item => parseFloat(item.price) || 0).filter(price => price > 0);
            if (prices.length > 0) {
                insights.priceAnalysis.averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
                insights.priceAnalysis.highestPrice = Math.max(...prices);
                insights.priceAnalysis.lowestPrice = Math.min(...prices);
                insights.priceAnalysis.priceRange = `${insights.priceAnalysis.lowestPrice.toFixed(2)}-${insights.priceAnalysis.highestPrice.toFixed(2)}`;
            }
            // Category analysis
            const categories = items.reduce((acc, item) => {
                const category = item.category || 'Uncategorized';
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {});
            insights.categoryAnalysis = categories;
            // Recommendations
            const expensiveItems = items.filter(item => (parseFloat(item.price) || 0) > insights.priceAnalysis.averagePrice * 1.5);
            const cheapItems = items.filter(item => (parseFloat(item.price) || 0) < insights.priceAnalysis.averagePrice * 0.5);
            insights.recommendations = [
                {
                    type: 'pricing',
                    message: `Consider adjusting prices. ${expensiveItems.length} items are priced significantly above average.`,
                    items: expensiveItems.slice(0, 3)
                },
                {
                    type: 'value',
                    message: `${cheapItems.length} items are priced below average - great value options!`,
                    items: cheapItems.slice(0, 3)
                }
            ];
            // Trends
            insights.trends = [
                {
                    type: 'popular_categories',
                    data: Object.entries(categories)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([category, count]) => ({ category, count: count }))
                }
            ];
        }
        // Store insights
        await db.run('INSERT INTO insights (menu_id, insight_type, data) VALUES (?, ?, ?)', [menuId, 'comprehensive', JSON.stringify(insights)]);
    }
    catch (error) {
        console.error('Error generating insights:', error);
    }
}
// Dashboard statistics
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        // Get user's menu statistics
        const menuStats = await db.get('SELECT COUNT(*) as totalMenus, SUM(items_count) as totalItems FROM menus WHERE user_id = ?', [userId]);
        // Get recent menus
        const recentMenus = await db.all('SELECT * FROM menus WHERE user_id = ? ORDER BY created_at DESC LIMIT 5', [userId]);
        // Get category distribution
        const categoryStats = await db.all(`
      SELECT category, COUNT(*) as count 
      FROM menu_items mi 
      JOIN menus m ON mi.menu_id = m.id 
      WHERE m.user_id = ? 
      GROUP BY category 
      ORDER BY count DESC 
      LIMIT 5
    `, [userId]);
        res.json({
            success: true,
            stats: {
                totalMenus: menuStats.totalMenus || 0,
                totalItems: menuStats.totalItems || 0,
                averageItemsPerMenu: menuStats.totalMenus ? Math.round(menuStats.totalItems / menuStats.totalMenus) : 0
            },
            recentMenus,
            categoryStats
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});
// Start server
const startServer = async () => {
    try {
        console.log('Initializing database...');
        await initializeDatabase();
        console.log('Database initialized, starting server...');
        const server = app.listen(port, '127.0.0.1', () => {
            console.log(`🚀 MenuIQ API server running on port ${port}`);
            console.log(`📊 Health check: http://localhost:${port}/api/health`);
            console.log(`🔐 Authentication: http://localhost:${port}/api/auth`);
            console.log(`📈 Dashboard: http://localhost:${port}/api/dashboard`);
        });
        server.on('error', (error) => {
            console.error('Server error:', error);
        });
        server.on('listening', () => {
            console.log(`✅ Server is listening on http://127.0.0.1:${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
startServer();
//# sourceMappingURL=index-sqlite.js.map