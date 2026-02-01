# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### Frontend Ready:
- [ ] vercel.json created in frontend/
- [ ] .env.example created in frontend/
- [ ] package.json updated with vercel-build script
- [ ] All files committed to Git
- [ ] Local build test passed: `npm run build`

### Vercel Account:
- [ ] Account created at https://vercel.com
- [ ] GitHub connected to Vercel
- [ ] Repository accessible to Vercel

## 🚀 Deployment Steps

### 1. Import Project:
- [ ] "Add New..." → "Project"
- [ ] Select VineVault repository
- [ ] Click "Import"

### 2. Configure Settings:
- [ ] Framework: Vite
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Install command: `npm install`

### 3. Set Environment Variables:
- [ ] VITE_API_URL=https://your-railway-backend.railway.app
- [ ] VITE_OLLAMA_URL=https://your-ollama-instance.com (optional)

### 4. Deploy:
- [ ] Click "Deploy"
- [ ] Monitor build logs
- [ ] Wait for successful deployment

### 5. Test:
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] API calls to Railway succeed
- [ ] Mobile responsive design
- [ ] All features functional

## 🎯 Post-Deployment

### Get Frontend URL:
- [ ] Copy Vercel frontend URL
- [ ] Test in multiple browsers
- [ ] Share with team for feedback

### Railway Backend Integration:
- [ ] Update Railway CORS_ORIGIN to Vercel domain
- [ ] Test API endpoints
- [ ] Verify data flows correctly

### Production Ready:
- [ ] Custom domain (optional)
- [ ] SSL certificates (automatic)
- [ ] Analytics configured
- [ ] Error monitoring
- [ ] Performance optimization

---

## 🔗 Integration Checklist

### Railway + Vercel Connection:
- [ ] Railway backend deployed and healthy
- [ ] Vercel frontend deployed
- [ ] CORS configured on Railway
- [ ] API calls working between services
- [ ] Full application functional

### Environment Variables Sync:
- [ ] VITE_API_URL matches Railway URL
- [ ] CORS_ORIGIN on Railway matches Vercel URL
- [ ] All API endpoints accessible
- [ ] No CORS errors in browser console

---

**🎉 Full Stack Application Ready!**
