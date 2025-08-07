import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { Pool } from 'pg';
import { PersonalizedMenuService } from './services/personalizedMenuService';
import { CustomerPreferences } from './types/menu';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'menuiq',
  password: process.env.DB_PASSWORD || 'root',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Database initialization
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        menu_id INTEGER REFERENCES menus(id),
        name TEXT,
        price NUMERIC,
        cost NUMERIC,
        tags TEXT[],
        sales_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    client.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    console.log('⚠️  Database connection failed. The API will still work but menu data will not be persisted.');
    console.log('💡 To fix this, ensure PostgreSQL is running and update the .env file with correct credentials.');
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MenuIQ API is running' });
});

// Menu upload endpoint
app.post('/api/menu/upload', upload.single('menu'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, userId } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Menu title is required' });
    }

    // Parse the uploaded file (CSV, JSON, etc.)
    const fileContent = req.file.buffer.toString();
    let menuItems = [];

    if (req.file.mimetype === 'application/json') {
      menuItems = JSON.parse(fileContent);
    } else if (req.file.mimetype === 'text/csv') {
      // Simple CSV parsing (you might want to use a proper CSV library)
      const lines = fileContent.split('\n');
      const headers = lines[0].split(',');
      menuItems = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() || '';
          return obj;
        }, {} as any);
      });
    }

    // Insert menu into database
    const client = await pool.connect();
    
    const menuResult = await client.query(
      'INSERT INTO menus (user_id, title) VALUES ($1, $2) RETURNING id',
      [userId || 1, title]
    );

    const menuId = menuResult.rows[0].id;

    // Insert menu items
    for (const item of menuItems) {
      await client.query(
        'INSERT INTO menu_items (menu_id, name, price, cost, tags) VALUES ($1, $2, $3, $4, $5)',
        [
          menuId,
          item.name || item.title || '',
          parseFloat(item.price) || 0,
          parseFloat(item.cost) || 0,
          item.tags ? (Array.isArray(item.tags) ? item.tags : [item.tags]) : []
        ]
      );
    }

    client.release();

    res.json({
      success: true,
      menuId,
      message: 'Menu uploaded successfully',
      itemsCount: menuItems.length
    });

  } catch (error) {
    console.error('Menu upload error:', error);
    res.status(500).json({ error: 'Failed to upload menu' });
  }
});

// Get menu by ID
app.get('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await pool.connect();
    
    const menuResult = await client.query(
      'SELECT * FROM menus WHERE id = $1',
      [id]
    );

    if (menuResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: 'Menu not found' });
    }

    const menu = menuResult.rows[0];

    const itemsResult = await client.query(
      'SELECT * FROM menu_items WHERE menu_id = $1 ORDER BY created_at',
      [id]
    );

    client.release();

    res.json({
      menu,
      items: itemsResult.rows
    });

  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Failed to get menu' });
  }
});

// Get menu insights
app.get('/api/menu/:id/insights', async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await pool.connect();
    
    // Get menu items with sales data
    const itemsResult = await client.query(
      'SELECT * FROM menu_items WHERE menu_id = $1 ORDER BY sales_count DESC',
      [id]
    );

    const items = itemsResult.rows;

    // Calculate insights
    const totalRevenue = items.reduce((sum, item) => sum + (item.price * item.sales_count), 0);
    const totalCost = items.reduce((sum, item) => sum + (item.cost * item.sales_count), 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Top performing items
    const topItems = items
      .sort((a, b) => b.sales_count - a.sales_count)
      .slice(0, 5);

    // Low performing items
    const lowItems = items
      .sort((a, b) => a.sales_count - b.sales_count)
      .slice(0, 5);

    // Price analysis
    const avgPrice = items.length > 0 ? items.reduce((sum, item) => sum + item.price, 0) / items.length : 0;
    const priceRange = items.length > 0 ? {
      min: Math.min(...items.map(item => item.price)),
      max: Math.max(...items.map(item => item.price))
    } : { min: 0, max: 0 };

    client.release();

    res.json({
      menuId: id,
      insights: {
        totalItems: items.length,
        totalRevenue,
        totalCost,
        totalProfit,
        profitMargin: Math.round(profitMargin * 100) / 100,
        avgPrice: Math.round(avgPrice * 100) / 100,
        priceRange,
        topPerformingItems: topItems,
        lowPerformingItems: lowItems,
        recommendations: [
          'Consider increasing prices for top-performing items',
          'Review pricing strategy for low-performing items',
          'Analyze cost structure for better profit margins'
        ]
      }
    });

  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ error: 'Failed to get insights' });
  }
});

// Dashboard endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Get total menus
    const menusResult = await client.query('SELECT COUNT(*) as total FROM menus');
    const totalMenus = parseInt(menusResult.rows[0].total);
    
    // Get total items
    const itemsResult = await client.query('SELECT COUNT(*) as total FROM menu_items');
    const totalItems = parseInt(itemsResult.rows[0].total);
    
    // Calculate average items per menu
    const averageItemsPerMenu = totalMenus > 0 ? Math.round(totalItems / totalMenus) : 0;
    
    // Get recent menus (last 5)
    const recentMenusResult = await client.query(`
      SELECT m.*, COUNT(mi.id) as items_count 
      FROM menus m 
      LEFT JOIN menu_items mi ON m.id = mi.menu_id 
      GROUP BY m.id 
      ORDER BY m.created_at DESC 
      LIMIT 5
    `);
    
    // Get category stats (using tags as categories)
    const categoryStatsResult = await client.query(`
      SELECT 
        unnest(tags) as category,
        COUNT(*) as count
      FROM menu_items 
      WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
      GROUP BY unnest(tags)
      ORDER BY count DESC
      LIMIT 10
    `);
    
    client.release();

    res.json({
      totalMenus,
      totalItems,
      averageItemsPerMenu,
      recentMenus: recentMenusResult.rows,
      categoryStats: categoryStatsResult.rows
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all menus for a user
app.get('/api/menus', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT * FROM menus WHERE user_id = $1 ORDER BY created_at DESC',
      [userId || 1]
    );

    client.release();

    res.json({
      menus: result.rows
    });

  } catch (error) {
    console.error('Get menus error:', error);
    res.status(500).json({ error: 'Failed to get menus' });
  }
});

// Delete menu endpoint
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await pool.connect();
    
    // First delete all menu items
    await client.query('DELETE FROM menu_items WHERE menu_id = $1', [id]);
    
    // Then delete the menu
    const result = await client.query('DELETE FROM menus WHERE id = $1', [id]);
    
    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json({ success: true, message: 'Menu deleted successfully' });

  } catch (error) {
    console.error('Delete menu error:', error);
    res.status(500).json({ error: 'Failed to delete menu' });
  }
});

// User settings endpoints
app.get('/api/user/settings', async (req, res) => {
  try {
    // For now, return default settings
    res.json({
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
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

app.post('/api/user/settings', async (req, res) => {
  try {
    const { profile, notifications, appearance } = req.body;
    
    // In a real app, you would save these to the database
    console.log('Saving settings:', { profile, notifications, appearance });
    
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Personalized menu suggestions endpoint
app.post('/api/menu/:id/suggestions', async (req, res) => {
  try {
    const { id } = req.params;
    const preferences: CustomerPreferences = req.body.preferences || {};
    const limit = req.body.limit || 10;
    
    const client = await pool.connect();
    
    // Get menu items
    const itemsResult = await client.query(
      'SELECT * FROM menu_items WHERE menu_id = $1 ORDER BY sales_count DESC',
      [id]
    );

    if (itemsResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: 'No menu items found' });
    }

    const menuItems = itemsResult.rows;
    client.release();

    // Initialize the personalized menu service
    const personalizedService = new PersonalizedMenuService();
    
    // Generate personalized suggestions
    const suggestions = personalizedService.generatePersonalizedSuggestions(
      menuItems,
      preferences,
      limit
    );

    res.json({
      success: true,
      menuId: id,
      suggestions
    });

  } catch (error) {
    console.error('Personalized suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate personalized suggestions' });
  }
});

// Start server
app.listen(port, async () => {
  console.log(`🚀 MenuIQ API server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  await initializeDatabase();
}); 