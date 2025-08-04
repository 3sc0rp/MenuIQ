# 🚀 MenuIQ Project Setup Guide

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Windows PowerShell

## 🔧 Quick Start

### Option 1: Automatic Setup (Recommended)
```powershell
# Run the startup script
.\start-project.ps1
```

### Option 2: Manual Setup

#### 1. Install Dependencies
```powershell
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

#### 2. Start Backend (SQLite - No Database Installation Required)
```powershell
cd backend
npm run dev:sqlite
```

#### 3. Start Frontend
```powershell
cd frontend
npm start
```

## 🗄️ Database Connection Options

### Option 1: SQLite (Recommended - No Installation Required)
✅ **Already configured!** The project now uses SQLite by default.

**Benefits:**
- No database installation required
- File-based database
- Works out of the box
- Perfect for development

**Database file:** `backend/database.sqlite`

### Option 2: PostgreSQL (For Production)

If you want to use PostgreSQL:

1. **Install PostgreSQL:**
   - Download from: https://www.postgresql.org/download/
   - Install with default settings

2. **Create Database:**
   ```sql
   CREATE DATABASE menuiq;
   ```

3. **Create Environment File:**
   Create `backend/.env`:
   ```
   PORT=3001
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=menuiq
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

4. **Use PostgreSQL Backend:**
   ```powershell
   cd backend
   npm run dev
   ```

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

## 📊 API Endpoints

### Health Check
```bash
GET http://localhost:3001/api/health
```

### Menu Management
```bash
POST http://localhost:3001/api/menu/upload
GET http://localhost:3001/api/menu/:id
GET http://localhost:3001/api/menu/:id/insights
GET http://localhost:3001/api/menus
```

## 🔍 Troubleshooting

### Port Already in Use
```powershell
# Find processes using ports 3000 and 3001
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Connection Issues
- **SQLite:** Check if `backend/database.sqlite` file exists
- **PostgreSQL:** Verify PostgreSQL service is running

### Frontend Issues
```powershell
cd frontend
npm install
npm start
```

### Backend Issues
```powershell
cd backend
npm install
npm run dev:sqlite  # For SQLite
# OR
npm run dev         # For PostgreSQL
```

## 🎯 Features

- ✅ **Menu Upload:** Upload CSV, JSON, and Excel files
- ✅ **AI Insights:** Get detailed analytics on menu performance
- ✅ **Dashboard:** Real-time overview of menu metrics
- ✅ **Settings:** User profile and application preferences
- ✅ **SQLite Database:** No external database required
- ✅ **Modern UI:** Beautiful dark theme with TailwindCSS

## 📁 Project Structure

```
mmenu/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── index.tsx
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── index.ts      # PostgreSQL version
│   │   └── index-sqlite.ts # SQLite version
│   └── package.json
├── start-project.ps1  # Startup script
└── SETUP.md          # This file
```

## 🚀 Next Steps

1. Open http://localhost:3000 in your browser
2. Upload a menu file (CSV or JSON format)
3. View insights and analytics
4. Customize settings as needed

## 💡 Tips

- Use the startup script for quick development
- SQLite database file is created automatically
- All API endpoints are documented in the README
- Frontend uses React with TypeScript and TailwindCSS 