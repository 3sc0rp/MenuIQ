# MenuIQ - AI-Driven Restaurant Menu Optimization

MenuIQ is a SaaS platform that helps restaurants optimize their menus using AI-driven insights and analytics.

## 🚀 Features

- **Menu Upload**: Upload CSV, JSON, and Excel menu files
- **AI Insights**: Get detailed analytics on menu performance
- **Dashboard**: Real-time overview of menu metrics
- **Settings**: User profile and application preferences

## 🧱 Tech Stack

### Frontend
- **React** with TypeScript
- **TailwindCSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for database
- **Multer** for file uploads

## 📁 Project Structure

```
MenuIQ/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── ...
│   └── ...
├── backend/           # Express API server
│   ├── src/
│   │   └── index.ts   # Main server file
│   └── ...
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   PORT=3001
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=menuiq
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 📊 API Endpoints

### Menu Management
- `POST /api/menu/upload` - Upload a new menu file
- `GET /api/menu/:id` - Get menu details by ID
- `GET /api/menu/:id/insights` - Get AI insights for a menu
- `GET /api/menus` - Get all menus for a user

### Health Check
- `GET /api/health` - API health status

## 🎨 Design System

### Colors
- **Background**: `#0A1A2F` (Dark blue)
- **Accent Cyan**: `#00C4CC`
- **Accent Blue**: `#007DFF`

### Typography
- **Primary Font**: Inter
- **Secondary Font**: DM Sans

## 📝 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT
);
```

### Menus Table
```sql
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  menu_id INTEGER REFERENCES menus(id),
  name TEXT,
  price NUMERIC,
  cost NUMERIC,
  tags TEXT[],
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`

### Backend (Railway/Supabase)
1. Deploy to Railway or Supabase
2. Set environment variables
3. Configure PostgreSQL database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@menuiq.com or create an issue in this repository. 