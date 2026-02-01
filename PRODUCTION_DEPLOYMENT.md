# 🚀 VineVault Production Deployment Guide

## Quick Start (Docker Production)

```bash
# 1. Set up production environment
cp .env.production.example .env.production
# Edit .env.production with your values

# 2. Deploy with Docker
chmod +x deploy.sh
./deploy.sh
```

## Cloud Deployment Options

### Option 1: Railway (Recommended for Backend)

**Pros:**
- Easy PostgreSQL database
- Automatic deployments from GitHub
- Built-in monitoring
- Generous free tier

**Steps:**
1. Create account at https://railway.app
2. Connect your GitHub repository
3. Create new project
4. Set environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://railway-provided-url
   OLLAMA_API_URL=your-ollama-instance
   ```
5. Deploy!

### Option 2: Vercel (Recommended for Frontend)

**Pros:**
- Free SSL certificates
- Global CDN
- Automatic deployments
- Great performance

**Steps:**
1. Create account at https://vercel.com
2. Connect your GitHub repository
3. Configure build settings:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Environment Variable: `VITE_API_URL=https://your-backend-url.railway.app`

### Option 3: AWS (Full Control)

**Services needed:**
- **RDS**: PostgreSQL database
- **ECS**: Container hosting
- **ALB**: Load balancer
- **Route 53**: DNS
- **ACM**: SSL certificates

**Estimated cost:** $50-100/month for small deployment

### Option 4: DigitalOcean (Budget Friendly)

**Services needed:**
- **Managed PostgreSQL**: $15/month
- **App Platform**: $10-20/month
- **Load Balancer**: $10/month

**Total:** ~$35-45/month

## Environment Variables Checklist

### Required for Production:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/database_name
CORS_ORIGIN=https://yourdomain.com
```

### Optional:
```env
REDIS_URL=redis://host:6379
OLLAMA_API_URL=https://ai.yourdomain.com
EBAY_APP_ID=your-ebay-app-id
```

## Security Checklist

### Before Going Live:
- [ ] Change default PostgreSQL passwords
- [ ] Set up SSL certificates
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up monitoring alerts
- [ ] Backup strategy configured
- [ ] Environment variables secured
- [ ] Remove development dependencies

### SSL Setup:
```bash
# Let's Encrypt (Free SSL)
certbot --nginx -d yourdomain.com
```

## Monitoring & Maintenance

### Health Checks:
- Backend: `GET /api/health`
- Frontend: `GET /`
- Database: PostgreSQL connection test

### Logging:
```bash
# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Backups:
```bash
# PostgreSQL backup
docker exec vinevault-postgres-prod pg_dump -U vinevault vinevault > backup.sql

# Automated daily backup
0 2 * * * docker exec vinevault-postgres-prod pg_dump -U vinevault vinevault > /backups/$(date +\%Y-\%m-\%d).sql
```

## Performance Optimization

### Database:
- Add indexes to frequently queried columns
- Configure connection pooling
- Monitor query performance

### Frontend:
- Enable gzip compression
- Set up CDN for static assets
- Optimize images and assets

### Backend:
- Implement caching with Redis
- Add rate limiting
- Monitor memory usage

## Domain Setup

### DNS Configuration:
```
A Record: @ -> your-server-ip
A Record: www -> your-server-ip
AAAA Record: @ -> your-ipv6-address (if available)
```

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/full_chain.pem;
    ssl_certificate_key /etc/nginx/ssl/private_key.pem;
    
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Common Issues:
1. **Database connection failed**: Check DATABASE_URL format
2. **CORS errors**: Verify CORS_ORIGIN setting
3. **502 Bad Gateway**: Check if backend is running
4. **SSL not working**: Verify certificate paths and permissions

### Debug Commands:
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs backend

# Test database connection
docker exec -it vinevault-postgres-prod psql -U vinevault -d vinevault

# Test API endpoints
curl -I https://yourdomain.com/api/health
```

## Scaling Considerations

### When to Scale:
- CPU usage > 80% for extended periods
- Memory usage > 80%
- Database query times > 500ms
- User response times > 2 seconds

### Scaling Options:
1. **Vertical**: Increase server resources
2. **Horizontal**: Add more container instances
3. **Database**: Read replicas, connection pooling
4. **CDN**: Global content delivery

---

**🎯 Recommendation**: Start with Railway + Vercel for ease of use, then migrate to AWS/DigitalOcean as you grow.
