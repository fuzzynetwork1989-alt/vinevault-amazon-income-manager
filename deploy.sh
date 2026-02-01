#!/bin/bash

# VineVault Production Deployment Script

echo "🚀 Starting VineVault Production Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create production environment file if it doesn't exist
if [ ! -f .env.production ]; then
    echo "📝 Creating .env.production file..."
    cp .env.production.example .env.production
    echo "⚠️  Please edit .env.production with your production values before continuing."
    exit 1
fi

# Load production environment variables
export $(cat .env.production | xargs)

# Build and start production containers
echo "🔨 Building production containers..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check backend
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
fi

# Check frontend
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding"
fi

# Show running containers
echo "📊 Running containers:"
docker-compose -f docker-compose.prod.yml ps

echo "🎉 VineVault Production Deployment Complete!"
echo "🌐 Application available at: http://localhost"
echo "📊 API available at: http://localhost:3000/api/health"
