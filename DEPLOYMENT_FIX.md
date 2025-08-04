# MenuIQ Deployment Fix Guide

## Issue: "Network error. Please try again." on Vercel

The network error you're experiencing is caused by the frontend trying to connect to `http://localhost:3001` when deployed on Vercel. Here's how to fix it:

## Step 1: Deploy Backend to Vercel

1. **Navigate to your backend directory:**
   ```bash
   cd backend
   ```

2. **Deploy backend to Vercel:**
   ```bash
   vercel
   ```
   - Choose "Create new project"
   - Set project name: `menuiq-backend`
   - Deploy

3. **Note your backend URL** (e.g., `https://menuiq-backend-xyz.vercel.app`)

## Step 2: Update Frontend Environment Variables

1. **Go to your Vercel dashboard**
2. **Select your frontend project**
3. **Go to Settings → Environment Variables**
4. **Add the following variable:**
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.vercel.app` (replace with your actual backend URL)
   - Environment: Production

## Step 3: Redeploy Frontend

1. **Trigger a new deployment:**
   ```bash
   vercel --prod
   ```

## Step 4: Test the Fix

1. **Test login with these credentials:**
   - Email: `test@example.com`
   - Password: `password123`

2. **Test registration with any email/password**

## Alternative: Quick Fix for Testing

If you want to test immediately, you can temporarily hardcode the backend URL:

1. **Edit `frontend/src/contexts/AuthContext.tsx`**
2. **Replace the API URL with your backend URL:**
   ```javascript
   const apiUrl = 'https://your-backend-url.vercel.app';
   ```

## Troubleshooting

### If you still get network errors:

1. **Check CORS settings:**
   - Your backend now includes CORS configuration
   - Make sure your frontend domain is allowed

2. **Verify environment variables:**
   - Check that `REACT_APP_API_URL` is set correctly
   - Redeploy after adding environment variables

3. **Test backend directly:**
   - Visit `https://your-backend-url.vercel.app/api/health`
   - Should return: `{"status":"OK","message":"MenuIQ API Server is running!"}`

### Common Issues:

1. **Environment variables not working:**
   - Make sure they start with `REACT_APP_`
   - Redeploy after adding them

2. **CORS errors:**
   - The backend is configured to allow requests from your Vercel domain
   - Check browser console for CORS errors

3. **Backend not responding:**
   - Check Vercel function logs
   - Ensure all dependencies are in `package.json`

## File Changes Made

1. **Fixed `frontend/src/contexts/AuthContext.tsx`:**
   - Now uses `process.env.REACT_APP_API_URL` instead of hardcoded localhost

2. **Updated `backend/working-server.js`:**
   - Added missing `/api/auth/register` and `/api/auth/me` endpoints

3. **Created `backend/api/index.js`:**
   - Serverless version for Vercel deployment
   - Proper CORS configuration

4. **Created `backend/vercel.json`:**
   - Vercel configuration for backend deployment

## Testing Credentials

- **Login:** `test@example.com` / `password123`
- **Register:** Any email/password combination will work (mock registration)

## Next Steps

1. Deploy backend to Vercel
2. Set environment variable in frontend
3. Redeploy frontend
4. Test authentication

The network error should be resolved once these steps are completed! 