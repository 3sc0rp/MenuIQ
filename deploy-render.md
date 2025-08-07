# Deploy to Render

## Step-by-Step Deployment Guide

### 1. Prepare Your Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Deploy to Render

#### Option A: Using render.yaml (Recommended)
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Set environment variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: `3001` (auto-set by Render)

#### Option B: Manual Setup
1. **Backend Service:**
   - Go to [render.com](https://render.com) → "New" → "Web Service"
   - Connect your GitHub repository
   - Name: `menuiq-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     - `NODE_ENV`: `production`
     - `JWT_SECRET`: (generate a secure key)

2. **Frontend Service:**
   - Create another "Static Site"
   - Name: `menuiq-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

### 3. Update Frontend API URL
After backend deployment, update `frontend/src/utils/api.ts`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://menuiq-backend.onrender.com/api'
  : 'http://localhost:3001/api';
```

### 4. Environment Variables
Set these in Render dashboard:
- `NODE_ENV`: `production`
- `JWT_SECRET`: (secure random string)
- `PORT`: `3001` (auto-configured)

### 5. Health Check
Your backend will be available at:
- Health: `https://menuiq-backend.onrender.com/api/health`
- Personalized Suggestions: `https://menuiq-backend.onrender.com/api/menu/1/suggestions`

### 6. Custom Domain (Optional)
1. Go to your service settings
2. Add custom domain
3. Update DNS records as instructed

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Port Issues**: Ensure you're using `process.env.PORT`
3. **CORS Errors**: Update CORS settings in working-server.js
4. **Database Issues**: SQLite files are persistent on Render

### Logs:
- Access logs from Render dashboard
- Use `console.log` for debugging in production
