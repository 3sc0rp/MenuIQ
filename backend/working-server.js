const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    database: 'SQLite',
    version: '2.0.0',
    features: ['Authentication', 'Menu Management', 'AI Insights', 'User Management', 'Personalized Suggestions'],
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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

app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Mock registration
    res.json({
      success: true,
      token: 'mock-jwt-token-new-user',
      user: {
        id: 2,
        email: email,
        name: name,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    // Mock token validation
    if (token === 'mock-jwt-token-12345') {
      res.json({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        }
      });
    } else if (token === 'mock-jwt-token-new-user') {
      res.json({
        user: {
          id: 2,
          email: 'newuser@example.com',
          name: 'New User',
          role: 'user'
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Personalized menu suggestions endpoint
app.post('/api/menu/:id/suggestions', (req, res) => {
  try {
    const { id } = req.params;
    const preferences = req.body.preferences || {};
    const limit = req.body.limit || 10;

    // Mock menu items for testing
    const menuItems = [
      {
        id: 1,
        menu_id: id,
        name: "Grilled Salmon",
        price: 28.00,
        cost: 12.00,
        sales_count: 45,
        tags: "seafood,healthy,popular",
        created_at: "2024-01-01"
      },
      {
        id: 2,
        menu_id: id,
        name: "Beef Burger",
        price: 16.00,
        cost: 8.00,
        sales_count: 78,
        tags: "burger,popular,main",
        created_at: "2024-01-01"
      },
      {
        id: 3,
        menu_id: id,
        name: "Caesar Salad",
        price: 12.00,
        cost: 4.00,
        sales_count: 32,
        tags: "salad,healthy,vegetarian",
        created_at: "2024-01-01"
      },
      {
        id: 4,
        menu_id: id,
        name: "Pasta Carbonara",
        price: 18.00,
        cost: 6.00,
        sales_count: 56,
        tags: "pasta,italian,main",
        created_at: "2024-01-01"
      },
      {
        id: 5,
        menu_id: id,
        name: "Chicken Wings",
        price: 14.00,
        cost: 7.00,
        sales_count: 89,
        tags: "appetizer,popular,spicy",
        created_at: "2024-01-01"
      },
      {
        id: 6,
        menu_id: id,
        name: "Truffle Fries",
        price: 8.00,
        cost: 2.00,
        sales_count: 67,
        tags: "side,popular,vegetarian",
        created_at: "2024-01-01"
      },
      {
        id: 7,
        menu_id: id,
        name: "Lobster Bisque",
        price: 22.00,
        cost: 15.00,
        sales_count: 12,
        tags: "soup,seafood,premium",
        created_at: "2024-01-01"
      },
      {
        id: 8,
        menu_id: id,
        name: "Margherita Pizza",
        price: 20.00,
        cost: 8.00,
        sales_count: 34,
        tags: "pizza,italian,vegetarian",
        created_at: "2024-01-01"
      },
      {
        id: 9,
        menu_id: id,
        name: "Steak Frites",
        price: 35.00,
        cost: 18.00,
        sales_count: 28,
        tags: "steak,premium,main",
        created_at: "2024-01-01"
      }
    ];

    // Simple scoring algorithm
    const scoredItems = menuItems.map(item => {
      let score = 0;
      let reasons = [];
      let notes = "";
      let matchScore = 0;
      let priceCategory = "moderate";
      let dietaryCompliance = [];
      let preferenceMatch = [];

      // Sales performance score (0-30 points)
      const maxSales = Math.max(...menuItems.map(i => i.sales_count));
      const salesScore = (item.sales_count / maxSales) * 30;
      score += salesScore;
      if (salesScore > 20) reasons.push("High performer");

      // Budget matching (0-20 points)
      if (preferences.budget) {
        if (preferences.budget === "low" && item.price <= 15) {
          score += 20;
          reasons.push("Budget-friendly");
          priceCategory = "budget";
        } else if (preferences.budget === "moderate" && item.price > 15 && item.price <= 25) {
          score += 20;
          reasons.push("Moderate pricing");
          priceCategory = "moderate";
        } else if (preferences.budget === "premium" && item.price > 25) {
          score += 20;
          reasons.push("Premium option");
          priceCategory = "premium";
        }
      }

      // Dietary restrictions (0-25 points)
      if (preferences.dietary) {
        const itemTags = item.tags.toLowerCase().split(',');
        if (preferences.dietary.includes("vegetarian") && itemTags.includes("vegetarian")) {
          score += 25;
          reasons.push("Vegetarian-friendly");
          dietaryCompliance.push("vegetarian");
        }
        if (preferences.dietary.includes("gluten-free") && !itemTags.includes("pasta") && !itemTags.includes("burger")) {
          score += 25;
          reasons.push("Gluten-free option");
          dietaryCompliance.push("gluten-free");
        }
      }

      // Preference matching (0-15 points)
      if (preferences.preferences) {
        const itemTags = item.tags.toLowerCase().split(',');
        preferences.preferences.forEach(pref => {
          if (itemTags.includes(pref.toLowerCase())) {
            score += 15;
            reasons.push(`Matches ${pref} preference`);
            preferenceMatch.push(pref);
          }
        });
      }

      // Spice level matching (0-10 points)
      if (preferences.spiceLevel) {
        const itemTags = item.tags.toLowerCase().split(',');
        if (preferences.spiceLevel === "spicy" && itemTags.includes("spicy")) {
          score += 10;
          reasons.push("Spicy option");
        } else if (preferences.spiceLevel === "mild" && !itemTags.includes("spicy")) {
          score += 10;
          reasons.push("Mild option");
        }
      }

      // Calculate match percentage
      matchScore = Math.min(100, (score / 100) * 100);

      // Generate notes
      if (reasons.length > 0) {
        notes = `Recommended based on: ${reasons.join(', ')}`;
      } else {
        notes = "Good overall option";
      }

      return {
        item,
        score: Math.round(score * 10) / 10,
        reasons,
        notes,
        matchScore: Math.round(matchScore * 10) / 10,
        priceCategory,
        dietaryCompliance,
        preferenceMatch
      };
    });

    // Sort by score and take top suggestions
    const topSuggestions = scoredItems
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Generate summary
    const totalSuggestions = topSuggestions.length;
    const averagePrice = topSuggestions.reduce((sum, s) => sum + s.item.price, 0) / totalSuggestions;
    const dietaryOptions = [...new Set(topSuggestions.flatMap(s => s.dietaryCompliance))];
    const preferenceMatches = [...new Set(topSuggestions.flatMap(s => s.preferenceMatch))];
    const budgetRange = preferences.budget || "moderate";

    const summary = {
      totalSuggestions,
      averagePrice: Math.round(averagePrice * 100) / 100,
      dietaryOptions,
      preferenceMatches,
      budgetRange
    };

    // Generate insights
    const insights = {
      topPerformers: topSuggestions.filter(s => s.reasons.includes("High performer")).map(s => s.item.name),
      seasonalPicks: topSuggestions.filter(s => s.reasons.includes("Seasonal")).map(s => s.item.name),
      crowdFavorites: topSuggestions.filter(s => s.reasons.includes("Popular")).map(s => s.item.name),
      valueOptions: topSuggestions.filter(s => s.priceCategory === "budget").map(s => s.item.name)
    };

    res.json({
      success: true,
      menuId: id,
      suggestions: {
        suggestions: topSuggestions,
        summary,
        insights
      }
    });

  } catch (error) {
    console.error('Personalized suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate personalized suggestions' });
  }
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
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