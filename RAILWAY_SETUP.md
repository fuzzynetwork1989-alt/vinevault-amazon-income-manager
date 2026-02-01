# 🚀 Railway Setup Guide for VineVault

## Quick Start

### 1. Create Railway Account
1. Go to https://railway.app
2. Click "Sign up" 
3. Sign up with GitHub (recommended)
4. Verify your email

### 2. Create New Project
1. Click "New Project" in Railway dashboard
2. Click "Deploy from GitHub repo"
3. Connect your GitHub account if not already connected
4. Select your VineVault repository

### 3. Configure Project Settings

#### Backend Service Configuration:
- **Root Directory**: `./backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: 3000

#### Environment Variables:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:password@host:5432/railway
OLLAMA_API_URL=https://your-ollama-instance.com
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 4. Add PostgreSQL Database
1. In your Railway project, click "+ New Service"
2. Select "PostgreSQL"
3. Railway will automatically provide the DATABASE_URL
4. Update your backend environment variables with this URL

### 5. Deploy
1. Railway will automatically deploy when you push to GitHub
2. Or click "Deploy Now" to trigger manual deployment
3. Wait for deployment to complete (2-3 minutes)

### 6. Get Your Backend URL
- Your backend will be available at: `https://your-app-name.railway.app`
- API endpoints: `https://your-app-name.railway.app/api/health`

---

## Detailed Instructions

### Preparing Your Repository

Make sure your backend has these files:

#### package.json (Backend)
```json
{
  "name": "vinevault-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build step required'"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Dockerfile (Optional - Railway can use without Docker)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### .gitignore (Backend)
```
node_modules
.env
npm-debug.log
```

### Railway Configuration Files

#### railway.json (Create in backend root)
```json
{
  "build": {
    "builder": "NIXPACKS"
  }
}
```

#### nixpacks.toml (Create in backend root)
```toml
[phases.setup]
nixPkgs = ["postgresql", "nodejs"]

[phases.build]
cmds = ["npm install"]

[start]
cmd = "npm start"

[variables]
NODE_ENV = "production"
PORT = "3000"
```

### Environment Variables Setup

In Railway dashboard, set these variables:

#### Required:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:password@host:5432/railway
```

#### Optional:
```
OLLAMA_API_URL=https://your-ollama-instance.com
CORS_ORIGIN=https://your-frontend-domain.vercel.app
EBAY_APP_ID=your-ebay-app-id
```

### Database Setup

Railway provides a managed PostgreSQL database:

1. **Add Database Service**:
   - Click "+ New Service"
   - Select "PostgreSQL"
   - Choose a plan (Free tier available)

2. **Connect Backend to Database**:
   - Railway automatically sets DATABASE_URL
   - Your backend will use this to connect

3. **Migrate Database**:
   - Railway runs your database init automatically
   - Or add a migration script if needed

### Testing Your Deployment

#### Health Check:
```bash
curl https://your-app-name.railway.app/api/health
```

#### Test API Endpoints:
```bash
curl https://your-app-name.railway.app/api/vine
curl https://your-app-name.railway.app/api/inventory
```

### Troubleshooting

#### Common Issues:

1. **Build Fails**:
   - Check package.json engines field
   - Verify all dependencies are in package.json
   - Check for syntax errors in server.js

2. **Database Connection Failed**:
   - Verify DATABASE_URL format
   - Check if PostgreSQL service is running
   - Ensure database migrations ran

3. **CORS Errors**:
   - Set CORS_ORIGIN environment variable
   - Check backend CORS configuration

4. **Port Issues**:
   - Ensure PORT=3000 in environment variables
   - Check if your app listens on process.env.PORT

#### Debug Commands:
```bash
# Check Railway logs
railway logs

# Check specific service logs
railway logs backend

# View environment variables
railway variables

# Restart service
railway restart
```

### Scaling and Performance

#### Railway Features:
- **Auto-scaling**: Automatically adjusts based on traffic
- **SSL**: Free SSL certificates included
- **CDN**: Global content delivery
- **Monitoring**: Built-in metrics and logs

#### Performance Tips:
- Enable database connection pooling
- Use Redis for caching (add Redis service)
- Monitor memory usage
- Optimize database queries

### Costs

#### Free Tier (Monthly):
- **500 hours** of execution time
- **100GB** data transfer
- **1GB** storage
- **PostgreSQL** database included

#### Paid Plans:
- **Hobby**: $5/month (more hours, storage)
- **Pro**: $20/month (more resources, priority support)

### Next Steps After Railway Setup

1. **Deploy Frontend** to Vercel/Netlify
2. **Update CORS_ORIGIN** to your frontend domain
3. **Set up custom domain** (optional)
4. **Configure monitoring** and alerts
5. **Set up backups** for database

---

## Quick Checklist

- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Backend service configured
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] API endpoints tested
- [ ] CORS configured for frontend

---

**🎯 Your VineVault backend will be live at: `https://your-app-name.railway.app`**
