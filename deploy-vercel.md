# Deploy to Vercel

## Frontend Deployment (Recommended for Vercel)

Vercel is optimized for frontend deployments. For full-stack apps, we recommend:
- **Frontend on Vercel** (React app)
- **Backend on Render** (Node.js API)

### 1. Frontend Deployment

#### Quick Deploy:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from root directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: your-username
# - Link to existing project: N
# - Project name: menuiq-frontend
# - In which directory is your code: ./
# - Want to override settings: N
```

#### Using Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com) and login
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Deploy

### 2. Environment Variables for Frontend
Add these in Vercel dashboard under "Environment Variables":
```
REACT_APP_API_URL=https://menuiq-backend.onrender.com/api
REACT_APP_ENV=production
```

### 3. Update Frontend API Configuration
Update `frontend/src/utils/api.ts`:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://menuiq-backend.onrender.com/api'
    : 'http://localhost:3001/api');
```

## Alternative: Full-Stack Deployment on Vercel

If you prefer everything on Vercel:

### 1. Backend as Serverless Functions
Create `api/` directory in root:
```bash
mkdir api
cp backend/working-server.js api/index.js
```

### 2. Update vercel.json for Full-Stack:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "outputDirectory": "frontend/build"
}
```

### 3. Environment Variables
In Vercel dashboard:
- `NODE_ENV`: `production`
- `JWT_SECRET`: (secure random string)

## Custom Domain

### 1. Add Domain:
1. Go to project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 2. Update CORS:
Update backend CORS settings to include your custom domain.

## Deployment Commands

### Manual Deployment:
```bash
# Frontend only
cd frontend
vercel --prod

# Full project
vercel --prod
```

### Automatic Deployment:
- Connect GitHub repository
- Automatic deployments on push to main branch
- Preview deployments for pull requests

## Troubleshooting

### Common Issues:
1. **Build Errors**: Check Node.js version compatibility
2. **API Proxy Issues**: Verify `vercel.json` routes configuration
3. **Environment Variables**: Ensure they're set in Vercel dashboard
4. **CORS Errors**: Update backend CORS settings

### Performance:
- Vercel automatically optimizes static assets
- Use Vercel Analytics for performance monitoring
- Consider Vercel Edge Functions for API routes
