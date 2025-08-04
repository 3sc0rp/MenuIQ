const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

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

// Mock data
let mockMenus = [
  {
    id: 1,
    title: "Sample Menu 1",
    fileName: "menu1.json",
    itemsCount: 15,
    status: "processed",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Sample Menu 2", 
    fileName: "menu2.json",
    itemsCount: 12,
    status: "processed",
    createdAt: new Date().toISOString()
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MenuIQ API Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  try {
    const stats = {
      totalMenus: mockMenus.length,
      totalItems: mockMenus.reduce((sum, menu) => sum + menu.itemsCount, 0),
      averageItemsPerMenu: Math.round(mockMenus.reduce((sum, menu) => sum + menu.itemsCount, 0) / mockMenus.length) || 0
    };

    const recentMenus = mockMenus.slice(0, 5);
    const categoryStats = [
      { category: "Appetizers", count: 8 },
      { category: "Main Courses", count: 12 },
      { category: "Desserts", count: 6 },
      { category: "Beverages", count: 4 }
    ];

    res.json({
      success: true,
      stats,
      recentMenus,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all menus
app.get('/api/menus', (req, res) => {
  try {
    res.json({
      success: true,
      menus: mockMenus
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get menus' });
  }
});

// Upload menu
app.post('/api/upload', upload.single('menu'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const title = req.body.title || req.file.originalname.replace(/\.[^/.]+$/, '');
    
    // Simulate processing
    const newMenu = {
      id: mockMenus.length + 1,
      title: title,
      fileName: req.file.originalname,
      itemsCount: Math.floor(Math.random() * 20) + 5, // Random items count
      status: "processed",
      createdAt: new Date().toISOString()
    };

    mockMenus.unshift(newMenu);

    res.json({
      success: true,
      message: 'Menu uploaded successfully!',
      menuId: newMenu.id,
      itemsCount: newMenu.itemsCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload menu' });
  }
});

// Delete menu
app.delete('/api/menu/:id', (req, res) => {
  try {
    const menuId = parseInt(req.params.id);
    const menuIndex = mockMenus.findIndex(menu => menu.id === menuId);
    
    if (menuIndex === -1) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    mockMenus.splice(menuIndex, 1);

    res.json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu' });
  }
});

// User settings endpoints
app.get('/api/user/settings', (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.post('/api/user/settings', (req, res) => {
  try {
    // In a real app, you would save to database
    res.json({
      success: true,
      message: 'Settings saved successfully!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Authentication endpoints (mock)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mock authentication
    if (email === 'test@example.com' && password === 'password123') {
      res.json({
        success: true,
        token: 'mock-jwt-token-12345',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Start server
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`🚀 MenuIQ API Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`📈 Dashboard: http://localhost:${port}/api/dashboard`);
  console.log(`📤 Upload: http://localhost:${port}/api/upload`);
  console.log(`⚙️ Settings: http://localhost:${port}/api/user/settings`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.on('listening', () => {
  console.log(`✅ Server is listening on http://127.0.0.1:${port}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 