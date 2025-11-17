#!/bin/bash

echo "🎬 Stream Manager Bot - Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is running (optional check)
echo "⚠️  Make sure MongoDB is installed and running!"
echo ""

# Install root dependencies
echo "📦 Installing bot dependencies..."
npm install
echo ""

# Install dashboard dependencies
echo "📦 Installing dashboard dependencies..."
cd dashboard
npm install
cd ..
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your credentials."
    echo ""
else
    echo "⚠️  .env file already exists. Skipping..."
    echo ""
fi

echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your credentials"
echo "2. Set up MongoDB database"
echo "3. Create Discord bot and get token"
echo "4. Get API keys for platforms (YouTube, Twitch, etc.)"
echo "5. Get OpenAI API key"
echo "6. Configure Discord channel and role IDs"
echo ""
echo "🚀 To start the bot: npm start"
echo "🌐 To start the dashboard: cd dashboard && npm run dev"
echo "📚 Read README.md for more information"
echo ""
