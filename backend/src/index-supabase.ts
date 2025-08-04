import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { supabase, dbHelpers, TABLES } from './supabase';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/json', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JSON, CSV, and Excel files are allowed.'));
    }
  }
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await dbHelpers.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MenuIQ API Server with Supabase is running!',
    timestamp: new Date().toISOString(),
    database: 'Supabase'
  });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user from Supabase
    const user = await dbHelpers.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, we'll use a simple password check
    // In production, you should store hashed passwords in Supabase
    const isValidPassword = password === 'password123'; // Demo password

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Dashboard endpoint
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboardData = await dbHelpers.getDashboardStats(userId);

    // Get category statistics (mock data for now)
    const categoryStats = [
      { category: "Appetizers", count: 8 },
      { category: "Main Courses", count: 12 },
      { category: "Desserts", count: 6 },
      { category: "Beverages", count: 4 }
    ];

    res.json({
      success: true,
      ...dashboardData,
      categoryStats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all menus for a user
app.get('/api/menus', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const menus = await dbHelpers.getMenusByUserId(userId);

    res.json({
      success: true,
      menus: menus.map(menu => ({
        id: menu.id,
        title: menu.title,
        itemsCount: menu.items_count,
        status: menu.status,
        createdAt: menu.created_at
      }))
    });
  } catch (error) {
    console.error('Get menus error:', error);
    res.status(500).json({ error: 'Failed to get menus' });
  }
});

// Upload menu endpoint
app.post('/api/upload', authenticateToken, upload.single('menu'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user.id;
    const title = req.body.title || req.file.originalname.replace(/\.[^/.]+$/, '');

    // Create menu in Supabase
    const menuData = {
      user_id: userId,
      title: title,
      status: 'published' as const,
      items_count: Math.floor(Math.random() * 20) + 5, // Mock items count
    };

    const menu = await dbHelpers.createMenu(menuData);

    // Create upload record
    const uploadData = {
      user_id: userId,
      menu_id: menu.id,
      file_name: req.file.originalname,
      file_size: req.file.size,
      status: 'completed' as const,
      items_processed: menuData.items_count
    };

    await dbHelpers.createUpload(uploadData);

    res.json({
      success: true,
      message: 'Menu uploaded successfully!',
      menuId: menu.id,
      itemsCount: menuData.items_count
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload menu' });
  }
});

// Delete menu endpoint
app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
  try {
    const menuId = req.params.id;
    const userId = req.user.id;

    // Verify menu belongs to user
    const menu = await dbHelpers.getMenuById(menuId);
    if (!menu || menu.user_id !== userId) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    await dbHelpers.deleteMenu(menuId);

    res.json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu error:', error);
    res.status(500).json({ error: 'Failed to delete menu' });
  }
});

// User settings endpoints
app.get('/api/user/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await dbHelpers.getUserSettings(userId);

    if (!settings) {
      // Return default settings if none exist
      res.json({
        profile: {
          fullName: req.user.full_name,
          email: req.user.email,
          restaurantName: req.user.restaurant_name || 'My Restaurant'
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
    } else {
      res.json({
        profile: {
          fullName: settings.profile.full_name,
          email: settings.profile.email,
          restaurantName: settings.profile.restaurant_name
        },
        notifications: {
          emailNotifications: settings.notifications.email_notifications,
          pushNotifications: settings.notifications.push_notifications
        },
        appearance: {
          darkMode: settings.appearance.dark_mode,
          autoSave: settings.appearance.auto_save
        }
      });
    }
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.post('/api/user/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    const settingsData = {
      user_id: userId,
      profile: {
        full_name: settings.profile.fullName,
        email: settings.profile.email,
        restaurant_name: settings.profile.restaurantName
      },
      notifications: {
        email_notifications: settings.notifications.emailNotifications,
        push_notifications: settings.notifications.pushNotifications
      },
      appearance: {
        dark_mode: settings.appearance.darkMode,
        auto_save: settings.appearance.autoSave
      }
    };

    const existingSettings = await dbHelpers.getUserSettings(userId);
    
    if (existingSettings) {
      await dbHelpers.updateUserSettings(userId, settingsData);
    } else {
      await dbHelpers.createUserSettings(settingsData);
    }

    res.json({
      success: true,
      message: 'Settings saved successfully!'
    });
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Start server
const startServer = async () => {
  try {
    console.log('🚀 Starting MenuIQ API server with Supabase...');
    console.log('📊 Health check: http://localhost:3001/api/health');
    console.log('🔐 Authentication: http://localhost:3001/api/auth');
    console.log('📈 Dashboard: http://localhost:3001/api/dashboard');

    const server = app.listen(port, '127.0.0.1', () => {
      console.log(`✅ Server is listening on http://127.0.0.1:${port}`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
    });

    server.on('listening', () => {
      console.log(`✅ Server is listening on http://127.0.0.1:${port}`);
    });
  } catch (error) {
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