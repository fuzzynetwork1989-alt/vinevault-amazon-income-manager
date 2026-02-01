# 🐳 Quick Docker Setup for VineVault

## ⚠️ Docker Desktop Issue Detected

It appears Docker Desktop is not running or has connection issues. Here's how to fix it:

## 🔧 Quick Fix Steps

### 1. Restart Docker Desktop

```bash
# Close Docker Desktop completely
# Then restart it from Start Menu
```

### 2. Verify Docker is Working

```bash
docker --version
docker run hello-world
```

### 3. Start VineVault Services

```bash
# Navigate to project directory
cd "VineVault Secure Your Amazon Income Streams"

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### 4. Access Applications

- **Main App**: <http://localhost>
- **API**: <http://localhost/api/>
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🚀 Alternative: Manual Setup (If Docker Issues Persist)

If Docker continues to have issues, you can run the services manually:

### Backend (Node.js + PostgreSQL)

```bash
# Install PostgreSQL locally or use cloud service
# Then run backend:
cd backend
npm install
npm start
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## 📋 What Was Set Up

The Docker configuration includes:

- ✅ **PostgreSQL 15** - Production database
- ✅ **Redis 7** - Caching layer
- ✅ **Node.js Backend** - API server
- ✅ **React Frontend** - Web application
- ✅ **Nginx** - Reverse proxy
- ✅ **Health checks** - All services monitored
- ✅ **Volume persistence** - Data survives restarts

## 🔍 Troubleshooting

### Docker Commands

```bash
# View running containers
docker ps

# View logs
docker-compose logs

# Stop all services
docker-compose down

# Remove volumes (fresh start)
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

### Port Conflicts

If ports are in use, change them in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"      # Use 8080 instead of 80
  - "5433:5432"    # Use 5433 for PostgreSQL
```

### Database Connection

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U vinevault -d vinevault

# View tables
\dt

# Test connection
SELECT COUNT(*) FROM vine_products;
```

## 📊 Database Schema

The PostgreSQL database includes:

- `vine_products` - Amazon Vine items
- `inventory_items` - Resale inventory
- `monetization_links` - Affiliate links
- `income_events` - Income tracking
- `expenses` - Expense tracking

## 🎯 Next Steps

1. **Fix Docker Desktop** - Restart the application
2. **Run docker-compose up -d** - Start services
3. **Test endpoints** - Verify API is working
4. **Access web app** - Open <http://localhost>

## 📞 Help

If Docker issues persist:

1. Check Docker Desktop is running
2. Verify Docker has sufficient resources
3. Try restarting your computer
4. Use manual setup as fallback

---

**🎉 Once Docker is working, your VineVault app will be fully containerized with PostgreSQL!**
