# Railway Deployment Checklist

## ✅ Pre-Deployment Checklist

### Repository Ready:
- [ ] railway.json created in backend/
- [ ] nixpacks.toml created in backend/
- [ ] .env.example created in backend/
- [ ] package.json updated (Node >=18)
- [ ] All files committed to Git

### Railway Account:
- [ ] Account created at https://railway.app
- [ ] GitHub connected to Railway
- [ ] Repository accessible to Railway

## 🚀 Deployment Steps

### 1. Create Project:
- [ ] "New Project" → "Deploy from GitHub repo"
- [ ] Select VineVault repository
- [ ] Click "Import"

### 2. Configure Backend Service:
- [ ] Root directory: `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Port: `3000`

### 3. Add Database:
- [ ] "+ New Service" → "PostgreSQL"
- [ ] Select Free plan
- [ ] Wait for database to be ready

### 4. Set Environment Variables:
- [ ] NODE_ENV=production
- [ ] PORT=3000
- [ ] DATABASE_URL=(from Railway PostgreSQL)
- [ ] CORS_ORIGIN=https://your-frontend-domain.vercel.app

### 5. Deploy:
- [ ] Railway auto-deploys
- [ ] Monitor build logs
- [ ] Wait for successful deployment

### 6. Test:
- [ ] Health check: `curl https://app-name.railway.app/api/health`
- [ ] API endpoints working
- [ ] Database connected

## 🎯 Post-Deployment

### Get Backend URL:
- [ ] Copy Railway backend URL
- [ ] Save for frontend deployment
- [ ] Test frontend connection

### Frontend Deployment:
- [ ] Deploy to Vercel/Netlify
- [ ] Set VITE_API_URL to Railway URL
- [ ] Test full application

### Production Ready:
- [ ] Custom domain (optional)
- [ ] SSL certificates (automatic)
- [ ] Monitoring configured
- [ ] Backup strategy

---

**🎉 Ready to deploy to Railway!**
