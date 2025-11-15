#!/bin/bash

# Boom Audio Visuals - Development Server Launcher
# This script starts both frontend and backend servers

echo "🚀 Starting Boom Audio Visuals Development Servers..."
echo ""

# Check if .env exists in server directory
if [ ! -f "server/.env" ]; then
    echo "❌ Error: server/.env file not found!"
    echo "Please create server/.env with your MongoDB and email credentials."
    echo "See server/.env.example for reference."
    exit 1
fi

# Check if node_modules exists in server
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server && npm install && cd ..
fi

# Check if node_modules exists in root
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "Starting servers..."
echo "  📍 Backend:  https://jemo.codewithseth.co.ke"
echo "  📍 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend (this will block)
npm run dev

# When frontend stops (Ctrl+C), kill backend too
kill $BACKEND_PID 2>/dev/null
