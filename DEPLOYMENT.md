# MenuIQ Deployment Guide

## Vercel Deployment

### Prerequisites
- Node.js 16+ installed
- Vercel CLI installed (`npm i -g vercel`)
- Git repository with your code

### Steps to Deploy

1. **Prepare the Frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # From the root directory
   vercel
   ```

3. **Configure Environment Variables**
   In your Vercel dashboard, add these environment variables:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.vercel.app`)

### Alternative: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a React app

3. **Configure Build Settings**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

### Troubleshooting

#### "react-scripts: command not found"
- **Solution**: Make sure `react-scripts` is in `devDependencies` (already fixed)
- **Alternative**: Add `"react-scripts": "5.0.1"` to `dependencies` if needed

#### Build Fails
- Check that all dependencies are properly installed
- Ensure TypeScript compilation passes locally
- Verify that all imports are correct

#### API Calls Fail
- Set the correct `REACT_APP_API_URL` environment variable
- Ensure your backend is deployed and accessible
- Check CORS settings on your backend

### Environment Variables

Create a `.env` file in the frontend directory for local development:

```env
REACT_APP_API_URL=http://localhost:3001
```

For production, set these in Vercel:
- `REACT_APP_API_URL`: Your production backend URL

### File Structure for Deployment

```
mmenu/
├── frontend/          # React app (this gets deployed)
│   ├── package.json
│   ├── src/
│   └── public/
├── backend/           # Backend (deploy separately)
├── vercel.json       # Vercel configuration
├── .vercelignore     # Files to exclude
└── DEPLOYMENT.md     # This file
```

### Backend Deployment

For the backend, you have several options:

1. **Vercel Functions** (Recommended)
   - Deploy as serverless functions
   - Use the `backend/working-server.js` file

2. **Railway/Render**
   - Deploy the Node.js backend separately
   - Update `REACT_APP_API_URL` to point to your backend

3. **Heroku**
   - Deploy the backend to Heroku
   - Set up environment variables

### Testing Deployment

1. **Local Testing**
   ```bash
   cd frontend
   npm start
   ```

2. **Production Testing**
   - Deploy and test all features
   - Check that API calls work
   - Verify that fallback data shows when backend is unavailable

### Common Issues

1. **CORS Errors**
   - Ensure your backend allows requests from your Vercel domain
   - Add your Vercel URL to CORS configuration

2. **Environment Variables Not Working**
   - Make sure they start with `REACT_APP_`
   - Redeploy after adding environment variables

3. **Build Errors**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are properly listed in `package.json`

### Performance Optimization

1. **Code Splitting**
   - React Router already handles this
   - Consider lazy loading for large components

2. **Image Optimization**
   - Use WebP format where possible
   - Optimize images before uploading

3. **Bundle Size**
   - Monitor bundle size with `npm run build`
   - Consider removing unused dependencies

### Security Considerations

1. **Environment Variables**
   - Never commit sensitive data
   - Use Vercel's environment variable system

2. **API Security**
   - Implement proper authentication
   - Use HTTPS in production
   - Validate all inputs

### Monitoring

1. **Vercel Analytics**
   - Enable in your Vercel dashboard
   - Monitor performance and errors

2. **Error Tracking**
   - Consider adding Sentry or similar
   - Monitor API call failures

### Updates and Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor for security vulnerabilities

2. **Backup Strategy**
   - Keep your code in Git
   - Document your deployment process

3. **Rollback Plan**
   - Vercel provides automatic rollbacks
   - Test changes in development first 