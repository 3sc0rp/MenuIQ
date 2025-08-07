# Deployment Checklist

## Pre-Deployment ✅

### Code Preparation
- [ ] All changes committed to Git
- [ ] Code tested locally
- [ ] Environment variables configured
- [ ] Dependencies updated in package.json
- [ ] Build process tested locally

### Configuration Files
- [ ] `render.yaml` configured for Render
- [ ] `vercel.json` configured for Vercel  
- [ ] `env.example` created with all required variables
- [ ] Backend updated to use `process.env.PORT`
- [ ] CORS configured for production domains
- [ ] Frontend API URLs updated for production

## Render Deployment

### Backend Deployment
- [ ] Create Render account at [render.com](https://render.com)
- [ ] Connect GitHub repository
- [ ] Create new Web Service or use Blueprint
- [ ] Configure build settings:
  - Build Command: `cd backend && npm install && npm run build`
  - Start Command: `cd backend && npm start`
- [ ] Set environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=[generate secure key]`
  - [ ] `PORT=3001` (auto-configured)
- [ ] Deploy and verify health endpoint

### Environment Variables for Render
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
PORT=3001
```

### Verification Steps
- [ ] Backend health check: `https://your-app.onrender.com/api/health`
- [ ] Test personalized suggestions endpoint
- [ ] Check logs for any errors
- [ ] Verify database connectivity

## Vercel Deployment

### Frontend Deployment
- [ ] Create Vercel account at [vercel.com](https://vercel.com)
- [ ] Connect GitHub repository
- [ ] Configure project settings:
  - Framework: Create React App
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `build`
- [ ] Set environment variables:
  - [ ] `REACT_APP_API_URL=https://your-render-backend.onrender.com`
  - [ ] `REACT_APP_ENV=production`
- [ ] Deploy and test

### Environment Variables for Vercel
```
REACT_APP_API_URL=https://menuiq-backend.onrender.com
REACT_APP_ENV=production
```

### Verification Steps
- [ ] Frontend loads correctly
- [ ] API calls work from frontend
- [ ] Authentication flow works
- [ ] All features functional

## Post-Deployment

### Testing
- [ ] Health check endpoints respond
- [ ] User authentication works
- [ ] Menu upload functionality
- [ ] Personalized suggestions working
- [ ] Dashboard loads correctly
- [ ] Settings page functional

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error tracking
- [ ] Monitor server logs
- [ ] Check performance metrics

### Documentation
- [ ] Update README with live URLs
- [ ] Document deployment process
- [ ] Update API documentation
- [ ] Share access credentials with team

## Troubleshooting

### Common Issues
- **Build Failures**: Check Node.js version, dependencies
- **CORS Errors**: Update backend CORS configuration
- **Environment Variables**: Verify all required vars are set
- **Port Issues**: Ensure using `process.env.PORT`
- **Database Issues**: Check SQLite file permissions

### Debug Commands
```bash
# Check backend logs on Render
# Available in Render dashboard

# Test API endpoints
curl https://your-app.onrender.com/api/health

# Test personalized suggestions
curl -X POST https://your-app.onrender.com/api/menu/1/suggestions \
  -H "Content-Type: application/json" \
  -d '{"preferences":{"budget":"moderate"},"limit":3}'
```

## Performance Optimization

### Backend (Render)
- [ ] Enable gzip compression
- [ ] Optimize database queries
- [ ] Add response caching
- [ ] Monitor memory usage

### Frontend (Vercel)
- [ ] Enable automatic optimizations
- [ ] Use Vercel Analytics
- [ ] Optimize bundle size
- [ ] Configure CDN caching

## Maintenance

### Regular Tasks
- [ ] Monitor uptime and performance
- [ ] Update dependencies regularly
- [ ] Review and rotate JWT secrets
- [ ] Backup database (if using PostgreSQL)
- [ ] Monitor error logs

### Scaling Considerations
- [ ] Consider upgrading to paid plans for better performance
- [ ] Implement proper database solution for production
- [ ] Add rate limiting and security headers
- [ ] Consider implementing caching layer
