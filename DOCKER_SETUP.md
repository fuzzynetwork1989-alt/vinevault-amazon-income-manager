# 🐳 Docker & PostgreSQL Setup Guide for VineVault

## Overview

This guide sets up VineVault with Docker containers using PostgreSQL as the production database instead of SQLite.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend       │    │   Backend       │    │   PostgreSQL    │
│   (Nginx)        │◄──►│   (Node.js)     │◄──►│   Database      │
│   Port: 5173     │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      Redis Cache         │
                    │   Port: 6379              │
                    └───────────────────────────┘
```

## 📋 Prerequisites

1. **Docker Desktop** - Install from https://docker.com
2. **Docker Compose** - Usually included with Docker Desktop
3. **Git** - For cloning the repository

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd "VineVault Secure Your Amazon Income Streams"
```

### 2. Start All Services
```bash
docker-compose up -d
```

### 3. Verify Services
```bash
# Check all containers are running
docker-compose ps

# Check logs
docker-compose logs -f

# Test health endpoints
curl http://localhost/api/health
curl http://localhost:5173/health
```

### 4. Access Applications
- **Frontend**: http://localhost (via Nginx)
- **Backend API**: http://localhost/api/
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🗄️ Database Configuration

### Connection Details
- **Host**: localhost:5432
- **Database**: vinevault
- **Username**: vinevault
- **Password**: vinevault123

### Connect with psql
```bash
psql -h localhost -p 5432 -U vinevault -d vinevault
```

### Connect with GUI Tools
- **DBeaver**: Free universal database tool
- **pgAdmin**: PostgreSQL web interface
- **DataGrip**: JetBrains database IDE

## 📁 Project Structure

```
VineVault/
├── docker-compose.yml          # Main orchestration file
├── .dockerignore              # Files to exclude from Docker
├── database/
│   └── init.sql              # PostgreSQL initialization script
├── nginx/
│   └── nginx.conf            # Reverse proxy configuration
├── backend/
│   ├── Dockerfile            # Backend container definition
│   └── server.js             # Node.js application
├── frontend/
│   ├── Dockerfile            # Frontend container definition
│   └── nginx.conf            # Frontend Nginx config
└── DOCKER_SETUP.md           # This guide
```

## 🔧 Configuration

### Environment Variables
Edit `docker-compose.yml` to customize:

```yaml
environment:
  POSTGRES_DB: vinevault          # Database name
  POSTGRES_USER: vinevault        # Database user
  POSTGRES_PASSWORD: vinevault123 # Database password
  DATABASE_URL: postgresql://vinevault:vinevault123@postgres:5432/vinevault
  REDIS_URL: redis://redis:6379
  OLLAMA_API_URL: http://host.docker.internal:11434
```

### Port Mapping
```yaml
ports:
  - "80:80"        # Nginx (main entry point)
  - "443:443"      # HTTPS (production)
  - "5432:5432"    # PostgreSQL (for local access)
  - "6379:6379"    # Redis (for local access)
```

## 🛠️ Development Workflow

### 1. Make Changes
Edit your source code in the `backend/` and `frontend/` directories.

### 2. Rebuild Services
```bash
# Rebuild specific service
docker-compose up -d --build backend

# Rebuild all services
docker-compose up -d --build
```

### 3. View Logs
```bash
# Follow all logs
docker-compose logs -f

# Follow specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres
```

### 4. Access Containers
```bash
# Access backend container
docker-compose exec backend sh

# Access PostgreSQL
docker-compose exec postgres psql -U vinevault -d vinevault

# Access Redis
docker-compose exec redis redis-cli
```

## 📊 Database Management

### View Tables
```sql
\dt  -- List all tables
\d vine_products  -- Describe table structure
SELECT * FROM vine_products LIMIT 10;  -- Sample data
```

### Backup Database
```bash
# Create backup
docker-compose exec postgres pg_dump -U vinevault vinevault > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U vinevault vinevault < backup.sql
```

### Reset Database
```bash
# Stop and remove volumes
docker-compose down -v

# Restart (will reinitialize)
docker-compose up -d
```

## 🔒 Security Considerations

### Production Security
1. **Change default passwords** in docker-compose.yml
2. **Use HTTPS** with proper SSL certificates
3. **Enable firewalls** to restrict port access
4. **Regular updates** of Docker images
5. **Environment variables** for sensitive data

### SSL Certificates
```bash
# Generate self-signed certificates (development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem

# Use Let's Encrypt (production)
certbot --nginx -d yourdomain.com
```

## 📈 Monitoring & Health Checks

### Built-in Health Checks
All services include health checks:
- **PostgreSQL**: `pg_isready -U vinevault`
- **Redis**: `redis-cli ping`
- **Backend**: `curl -f http://localhost:3000/api/health`
- **Frontend**: `curl -f http://localhost:5173`

### Monitoring Tools
```bash
# View resource usage
docker stats

# View container details
docker inspect vinevault-backend

# View network connections
docker network ls
docker network inspect vinevault_vinevault-network
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :80
netstat -tulpn | grep :5432

# Change ports in docker-compose.yml
ports:
  - "8080:80"  # Use different host port
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Test connection manually
docker-compose exec postgres psql -U vinevault -d vinevault -c "SELECT 1;"
```

#### 3. Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### 4. Permission Issues
```bash
# Fix volume permissions
docker-compose down
sudo chown -R $USER:$USER .  # Linux/Mac
# Restart containers
docker-compose up -d
```

### Debug Mode
```bash
# Run with debug logs
docker-compose --log-level DEBUG up

# Access shell in container
docker-compose exec backend sh
```

## 🚀 Production Deployment

### 1. Environment Preparation
```bash
# Set production environment
export NODE_ENV=production

# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Performance Optimization
- **Enable Redis caching** for frequently accessed data
- **Use connection pooling** for PostgreSQL
- **Enable gzip compression** in Nginx
- **Configure proper resource limits**

### 3. Backup Strategy
```bash
# Automated backups
0 2 * * * docker-compose exec postgres pg_dump -U vinevault vinevault > /backups/backup_$(date +\%Y\%m\%d).sql

# Log rotation
docker-compose exec nginx logrotate /etc/logrotate.d/nginx
```

## 📞 Support

### Getting Help
1. **Check logs**: `docker-compose logs`
2. **Verify connectivity**: `docker-compose ps`
3. **Test endpoints**: `curl http://localhost/api/health`
4. **Review configuration**: Check docker-compose.yml

### Resources
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Redis Documentation](https://redis.io/documentation)

---

**🎉 Your VineVault application is now running with Docker and PostgreSQL!**

This setup provides:
- ✅ **Production-ready database** (PostgreSQL)
- ✅ **Containerized deployment** (Docker)
- ✅ **Reverse proxy** (Nginx)
- ✅ **Caching layer** (Redis)
- ✅ **Health monitoring**
- ✅ **Easy scaling**
