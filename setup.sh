#!/bin/bash

# Fluento Project Setup Script for Unix/Linux/Mac
# This script helps you set up the Fluento project quickly

echo "🌍 Welcome to Fluento Setup!"
echo "This script will help you set up the Fluento language learning platform."
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js is installed: $NODE_VERSION"
else
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
echo "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm is installed: $NPM_VERSION"
else
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd BACKEND
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd FRONTEND
npm install
cd ..

echo ""
echo "✅ Dependencies installed successfully!"

echo ""
echo "🔧 Next Steps:"
echo "1. Set up your environment variables:"
echo "   - Copy BACKEND/.env.example to BACKEND/.env"
echo "   - Copy FRONTEND/.env.example to FRONTEND/.env"
echo "   - Fill in your MongoDB URI and Stream.io API keys"
echo ""
echo "2. Set up MongoDB:"
echo "   - Install MongoDB locally OR use MongoDB Atlas"
echo "   - Update MONGO_URI in BACKEND/.env"
echo ""
echo "3. Set up Stream.io:"
echo "   - Create account at https://getstream.io/"
echo "   - Create a new app and get API keys"
echo "   - Add keys to both BACKEND/.env and FRONTEND/.env"
echo ""
echo "4. Start the application:"
echo "   Backend:  cd BACKEND && npm run dev"
echo "   Frontend: cd FRONTEND && npm run dev"
echo ""
echo "🎉 Setup complete! Happy language learning! 🌍📚"
