#!/bin/bash

# Web3 Message Signer & Verifier - Development Script

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

# Function to clean up processes on exit
cleanup() {
    echo "Cleaning up processes..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Build shared package first
echo "🔨 Building shared package..."
pnpm --filter @web3-message-signer/shared build

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
pnpm dev &
BACKEND_PID=$!
cd ..

# Start frontend in background
echo "🚀 Starting frontend server..."
cd frontend
pnpm start &
FRONTEND_PID=$!
cd ..

echo "✅ Development servers are running!"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:3001"
echo "   - Press Ctrl+C to stop both servers"

# Wait for processes to finish or for user to press Ctrl+C
wait $FRONTEND_PID $BACKEND_PID
