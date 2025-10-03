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

echo "✅ Setup complete! You can now run the development servers:"
echo "   - Run both: pnpm dev"
echo "   - Frontend only: pnpm dev:frontend"
echo "   - Backend only: pnpm dev:backend"
