# LangBridge Project Setup Script for Windows PowerShell
# This script helps you set up the LangBridge project quickly

Write-Host "🌍 Welcome to LangBridge Setup!" -ForegroundColor Green
Write-Host "This script will help you set up the LangBridge language learning platform." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Cyan
npm install

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location BACKEND
npm install
Set-Location ..

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location FRONTEND
npm install
Set-Location ..

Write-Host ""
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up your environment variables:" -ForegroundColor White
Write-Host "   - Copy BACKEND/.env.example to BACKEND/.env" -ForegroundColor Gray
Write-Host "   - Copy FRONTEND/.env.example to FRONTEND/.env" -ForegroundColor Gray
Write-Host "   - Fill in your MongoDB URI and Stream.io API keys" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Set up MongoDB:" -ForegroundColor White
Write-Host "   - Install MongoDB locally OR use MongoDB Atlas" -ForegroundColor Gray
Write-Host "   - Update MONGO_URI in BACKEND/.env" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Set up Stream.io:" -ForegroundColor White
Write-Host "   - Create account at https://getstream.io/" -ForegroundColor Gray
Write-Host "   - Create a new app and get API keys" -ForegroundColor Gray
Write-Host "   - Add keys to both BACKEND/.env and FRONTEND/.env" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start the application:" -ForegroundColor White
Write-Host "   Backend:  cd BACKEND && npm run dev" -ForegroundColor Gray
Write-Host "   Frontend: cd FRONTEND && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Setup complete! Happy language learning! 🌍📚" -ForegroundColor Green
