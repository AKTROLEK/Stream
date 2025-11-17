@echo off
echo 🎬 Stream Manager Bot - Setup Script
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js is installed
node -v
echo.

REM Check MongoDB warning
echo ⚠️  Make sure MongoDB is installed and running!
echo.

REM Install root dependencies
echo 📦 Installing bot dependencies...
call npm install
echo.

REM Install dashboard dependencies
echo 📦 Installing dashboard dependencies...
cd dashboard
call npm install
cd ..
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ✅ .env file created. Please edit it with your credentials.
    echo.
) else (
    echo ⚠️  .env file already exists. Skipping...
    echo.
)

echo ✨ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your credentials
echo 2. Set up MongoDB database
echo 3. Create Discord bot and get token
echo 4. Get API keys for platforms (YouTube, Twitch, etc.)
echo 5. Get OpenAI API key
echo 6. Configure Discord channel and role IDs
echo.
echo 🚀 To start the bot: npm start
echo 🌐 To start the dashboard: cd dashboard ^&^& npm run dev
echo 📚 Read README.md for more information
echo.
pause
