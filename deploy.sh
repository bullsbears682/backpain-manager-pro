#!/bin/bash

# BackPain Manager Pro - Deployment Script
# This script sets up the application for development or production

echo "🏥 BackPain Manager Pro - Setup Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "In Termux, run: pkg install nodejs npm"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    echo "In Termux, run: pkg install npm"
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🚀 Setup complete! You can now run the application:"
echo ""
echo "   npm start           - Start development server"
echo "   npm run build       - Build for production"
echo ""
echo "📱 Access the app at: http://localhost:3000"
echo ""
echo "🏥 BackPain Manager Pro is ready to help you manage your back pain!"
echo "   Professional healthcare application with clinical-grade features."
echo ""