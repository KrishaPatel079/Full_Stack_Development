#!/bin/bash

echo "🚀 Setting up InterviewPrepAI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running. Please start MongoDB before running the app."
    fi
else
    echo "⚠️  MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
fi

# Install dependencies
echo "📦 Installing dependencies..."

echo "Installing root dependencies..."
npm install

echo "Installing server dependencies..."
cd server && npm install && cd ..

echo "Installing client dependencies..."
cd client && npm install && cd ..

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "🔧 Creating .env file..."
    cp server/env.example server/.env
    echo "⚠️  Please edit server/.env and add your OpenAI API key and other configuration."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your OpenAI API key"
echo "2. Start MongoDB (if using local MongoDB)"
echo "3. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "The app will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:5000"
echo ""
echo "Happy coding! 🚀"

