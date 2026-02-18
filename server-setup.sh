#!/bin/bash

# Server Setup Script for mimevents.com
# Run this on your server after uploading files

echo "🚀 Setting up DocMark on mimevents.com"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18+ first"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo ""
    echo "⚠️  PM2 is not installed"
    echo "Installing PM2 globally..."
    npm install -g pm2
    
    if [ $? -eq 0 ]; then
        echo "✅ PM2 installed successfully"
    else
        echo "❌ Failed to install PM2"
        echo "You may need to run: sudo npm install -g pm2"
        exit 1
    fi
else
    echo "✅ PM2 is already installed"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    mkdir -p uploads/pdf-imports
    echo "✅ Created uploads directory"
else
    echo "✅ Uploads directory exists"
fi

# Set proper permissions
chmod 755 uploads
chmod 755 uploads/pdf-imports
echo "✅ Set directory permissions"

# Test the server
echo ""
echo "🧪 Testing server..."
node pdf-server.js &
SERVER_PID=$!
sleep 3

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server started successfully"
    
    # Test the API
    RESPONSE=$(curl -s http://localhost:3000/api/pdf-import-test)
    if [[ $RESPONSE == *"ok"* ]]; then
        echo "✅ API endpoint responding correctly"
    else
        echo "⚠️  API endpoint may not be working correctly"
    fi
    
    # Stop test server
    kill $SERVER_PID
    echo "✅ Test server stopped"
else
    echo "❌ Server failed to start"
    exit 1
fi

# Start with PM2
echo ""
echo "🚀 Starting server with PM2..."
pm2 start pdf-server.js --name "docmark-pdf-server"

if [ $? -eq 0 ]; then
    echo "✅ Server started with PM2"
    
    # Save PM2 configuration
    pm2 save
    echo "✅ PM2 configuration saved"
    
    # Setup PM2 startup
    echo ""
    echo "⚙️  Setting up PM2 startup..."
    pm2 startup
    
    echo ""
    echo "📊 Server Status:"
    pm2 status
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Configure your web server proxy (/api → localhost:3000)"
    echo "2. Restart your web server (Apache/Nginx)"
    echo "3. Test at https://mimevents.com/"
    echo ""
    echo "Useful commands:"
    echo "  pm2 status                    - Check server status"
    echo "  pm2 logs docmark-pdf-server   - View logs"
    echo "  pm2 restart docmark-pdf-server - Restart server"
    echo "  pm2 stop docmark-pdf-server    - Stop server"
    
else
    echo "❌ Failed to start server with PM2"
    exit 1
fi
