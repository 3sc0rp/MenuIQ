# Supabase Setup Guide for MenuIQ

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a name (e.g., "menuiq-db")
4. Set a database password (save this!)
5. Choose a region close to your users

### 2. Get Your Supabase Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the entire contents of `supabase-schema.sql`
3. Click **Run** to create all tables and policies

### 4. Configure Environment Variables

Create a `.env` file in your `backend` directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 5. Install Dependencies

```bash
cd backend
npm install @supabase/supabase-js
```

### 6. Start the Supabase Backend

```bash
npm run dev:supabase
```

## 📊 Database Structure

### Tables Created:

1. **users** - User profiles and authentication
2. **menus** - Restaurant menus
3. **menu_items** - Individual menu items
4. **uploads** - File upload tracking
5. **user_settings** - User preferences
6. **insights** - AI-generated insights

### Key Features:

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **UUID Primary Keys** - Secure, unique identifiers
- ✅ **Automatic Timestamps** - Created/updated tracking
- ✅ **Foreign Key Constraints** - Data integrity
- ✅ **JSONB Storage** - Flexible settings and insights

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only view/edit their own data
- Automatic data isolation
- No cross-user data leakage

### Authentication
- JWT-based authentication
- Secure token validation
- User session management

## 🛠️ API Endpoints

Your backend now supports these endpoints with Supabase:

- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/menus` - Get user's menus
- `POST /api/upload` - Upload menu files
- `DELETE /api/menu/:id` - Delete menu
- `GET /api/user/settings` - Get user settings
- `POST /api/user/settings` - Save user settings

## 🔧 Configuration Options

### Environment Variables

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Optional
JWT_SECRET=your-jwt-secret
PORT=3001
NODE_ENV=development
```

### Frontend Configuration

Update your frontend environment variables:

```env
# Development
REACT_APP_API_URL=http://localhost:3001

# Production
REACT_APP_API_URL=https://your-backend-url.com
```

## 📈 Monitoring & Analytics

### Supabase Dashboard Features:

1. **Database** - View tables, data, and relationships
2. **Authentication** - User management and sessions
3. **Storage** - File uploads (if needed)
4. **Logs** - API request logs
5. **Analytics** - Usage statistics

### Useful Queries:

```sql
-- View all users
SELECT * FROM users;

-- View menus with user info
SELECT m.*, u.full_name 
FROM menus m 
JOIN users u ON m.user_id = u.id;

-- Get dashboard stats
SELECT 
  COUNT(*) as total_menus,
  SUM(items_count) as total_items,
  AVG(items_count) as avg_items
FROM menus;
```

## 🚀 Deployment

### Backend Deployment Options:

1. **Railway** (Recommended)
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Deploy
   railway login
   railway init
   railway up
   ```

2. **Render**
   - Connect your GitHub repo
   - Set environment variables
   - Deploy automatically

3. **Heroku**
   ```bash
   heroku create menuiq-backend
   heroku config:set SUPABASE_URL=your-url
   heroku config:set SUPABASE_ANON_KEY=your-key
   git push heroku main
   ```

### Frontend Deployment:

Your frontend is already configured for Vercel deployment. Just update the `REACT_APP_API_URL` to point to your deployed backend.

## 🔍 Testing

### Test Database Connection:

```bash
# Test the health endpoint
curl http://localhost:3001/api/health

# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Sample Data:

The schema includes a test user:
- Email: `test@example.com`
- Password: `password123`

## 🛡️ Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for dev/prod
   - Rotate keys regularly

2. **Database Security**
   - RLS is enabled by default
   - Use prepared statements
   - Validate all inputs

3. **API Security**
   - JWT tokens expire in 24h
   - Validate all requests
   - Rate limiting (implement as needed)

## 🔧 Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Check your `.env` file
   - Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`

2. **"Table doesn't exist"**
   - Run the schema SQL in Supabase
   - Check table names match exactly

3. **"Authentication failed"**
   - Verify JWT_SECRET is set
   - Check user exists in database

4. **"CORS errors"**
   - Add your frontend URL to CORS settings
   - Check Supabase RLS policies

### Debug Commands:

```bash
# Check if Supabase is accessible
curl https://your-project.supabase.co/rest/v1/

# Test database connection
npm run dev:supabase

# View logs
tail -f backend/logs/app.log
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Configure environment variables
4. ✅ Test backend connection
5. ✅ Deploy backend
6. ✅ Update frontend API URL
7. ✅ Deploy frontend
8. ✅ Test full application

Your MenuIQ application is now ready with a production-ready Supabase database! 🚀 