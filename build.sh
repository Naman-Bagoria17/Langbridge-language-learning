#!/bin/bash

# LangBridge Build Script for Deployment
echo "🚀 Starting LangBridge build process..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd BACKEND && npm install && cd ..

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd FRONTEND && npm install && cd ..

# Build frontend
echo "🏗️ Building frontend..."
cd FRONTEND && npm run build && cd ..

echo "✅ Build completed successfully!"
