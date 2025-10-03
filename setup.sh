#!/bin/bash

# Web3 Message Signer & Verifier - Monorepo Setup Script

echo "🚀 Setting up Web3 Message Signer & Verifier monorepo..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build shared package
echo "🔨 Building shared package..."
pnpm --filter @web3-message-signer/shared build

# Create environment files if they don't exist
if [ ! -f ./frontend/.env ]; then
    echo "📝 Creating frontend .env file..."
    cp ./frontend/.env.example ./frontend/.env
    echo "⚠️  Please update frontend/.env with your Dynamic.xyz environment ID"
fi

if [ ! -f ./backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp ./backend/.env.example ./backend/.env
fi

# Clean up unwanted files
echo "🧹 Cleaning up project files..."

# Remove unused files in frontend
if [ -f "frontend/src/logo.svg" ]; then
  echo "Removing unused logo.svg..."
  rm frontend/src/logo.svg
fi

# Remove empty directories
echo "Removing empty directories..."
find . -type d -empty -not -path "*/node_modules/*" -not -path "*/.git/*" -delete

# Remove any backup files
echo "Removing backup files..."
find . -name "*~" -delete
find . -name "*.bak" -delete

# Remove any temporary or build files
echo "Removing temporary and build files..."
find . -name "*.log" -delete
find . -name "*.tmp" -delete

# Remove any IDE-specific files that shouldn't be committed
echo "Removing IDE-specific files..."
find . -name ".DS_Store" -delete
find . -name "Thumbs.db" -delete

# Remove any build directories that shouldn't be committed
if [ -d "frontend/build" ]; then
  echo "Removing frontend build directory..."
  rm -rf frontend/build
fi

if [ -d "backend/dist" ]; then
  echo "Removing backend dist directory..."
  rm -rf backend/dist
fi

if [ -d "packages/shared/dist" ]; then
  echo "Removing shared package dist directory..."
  rm -rf packages/shared/dist
fi

# Remove any coverage reports
find . -name "coverage" -type d -exec rm -rf {} +

echo "✅ Setup complete! You can now run the development servers:"
echo "   - Run both: pnpm dev"
echo "   - Frontend only: pnpm dev:frontend"
echo "   - Backend only: pnpm dev:backend"
