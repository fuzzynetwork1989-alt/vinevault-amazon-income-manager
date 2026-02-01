# 🚀 Railway Deployment Step-by-Step Guide

## Step 1: Prepare Your Repository

Your backend is now ready with these files:
- ✅ railway.json (Railway configuration)
- ✅ nixpacks.toml (Build configuration)  
- ✅ .env.example (Environment template)
- ✅ package.json (Updated for Node 18+)

## Step 2: Create Railway Account

1. Go to https://railway.app
2. Click "Sign up with GitHub"
3. Authorize Railway to access your repositories
4. Verify your email address

## Step 3: Create New Project

1. In Railway dashboard, click "New Project"
2. Click "Deploy from GitHub repo"
3. Find and select your "VineVault Secure Your Amazon Income Streams" repository
4. Click "Import"

## Step 4: Configure Backend Service

### Service Settings:
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: `3000`

### Environment Variables (Required):
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:password@host:5432/railway
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Environment Variables (Optional):
```
OLLAMA_API_URL=https://your-ollama-instance.com
EBAY_APP_ID=your-ebay-app-id
```

## Step 5: Add PostgreSQL Database

1. In your Railway project, click "+ New Service"
2. Select "PostgreSQL" from the service list
3. Choose the "Free" plan (includes 1GB storage)
4. Click "Add PostgreSQL"

### Connect Database to Backend:
1. Railway will automatically provide a DATABASE_URL
2. Go to your backend service settings
3. Update the DATABASE_URL environment variable with the PostgreSQL URL
4. Click "Save Variables"

## Step 6: Deploy

1. Railway will automatically detect changes and deploy
2. Wait for deployment to complete (2-3 minutes)
3. Monitor the build logs for any errors

## Step 7: Test Your Backend

Once deployed, your backend will be available at:
`https://your-app-name.railway.app`

### Test Commands:
```bash
# Health check
curl https://your-app-name.railway.app/api/health

# Test API endpoints
curl https://your-app-name.railway.app/api/vine
curl https://your-app-name.railway.app/api/inventory
```

## Step 8: Get Your Backend URL

1. In Railway dashboard, click on your backend service
2. Copy the "URL" (e.g., https://vinevault-api.railway.app)
3. Save this URL for frontend deployment

## Troubleshooting

### Common Issues:

**Build Fails:**
- Check package.json engines field (should be Node >=18)
- Verify all dependencies are in package.json
- Check for syntax errors in server.js

**Database Connection Failed:**
- Verify DATABASE_URL format
- Check if PostgreSQL service is running
- Ensure database migrations ran

**CORS Errors:**
- Set CORS_ORIGIN environment variable
- Check backend CORS configuration

**Port Issues:**
- Ensure PORT=3000 in environment variables
- Check if your app listens on process.env.PORT

### Railway CLI Commands:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs

# View variables
railway variables

# Restart service
railway restart
```

## Next Steps After Railway Setup

1. **Deploy Frontend** to Vercel with your Railway backend URL
2. **Update CORS_ORIGIN** to your Vercel domain
3. **Set up custom domain** (optional)
4. **Configure monitoring** and alerts

---

## Quick Checklist

- [ ] Railway account created with GitHub
- [ ] Repository imported into Railway
- [ ] Backend service configured with correct root directory
- [ ] PostgreSQL database service added
- [ ] Environment variables set (DATABASE_URL, CORS_ORIGIN)
- [ ] Deployment successful
- [ ] API endpoints tested and working
- [ ] Backend URL saved for frontend deployment

---

**🎯 Your VineVault backend will be live at: `https://your-app-name.railway.app`**
