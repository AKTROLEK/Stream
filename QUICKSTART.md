# Quick Start Guide

## 🚀 Installation

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community))
- Discord Bot Token ([Create Bot](https://discord.com/developers/applications))

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/AKTROLEK/Stream.git
cd Stream
```

2. **Run setup script**

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

3. **Configure environment**

Edit `.env` file with your credentials:
```env
# Discord
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_guild_id

# Database
MONGODB_URI=mongodb://localhost:27017/streamer_bot

# Platform APIs
YOUTUBE_API_KEY=your_youtube_api_key
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
OPENAI_API_KEY=your_openai_api_key

# Discord IDs
TICKET_CATEGORY_ID=your_category_id
ADMIN_LOG_CHANNEL_ID=your_log_channel_id
SOCIAL_MEDIA_MANAGER_ROLE=your_role_id
STREAMER_MANAGEMENT_ROLE=your_role_id
```

4. **Start MongoDB**
```bash
# Linux/Mac
sudo systemctl start mongod

# Windows (if installed as service)
net start MongoDB
```

5. **Start the bot**
```bash
npm start
```

6. **Start the dashboard** (in a new terminal)
```bash
cd dashboard
npm run dev
```

The dashboard will be available at http://localhost:3000

## 📝 Getting API Keys

### YouTube API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials (API Key)

### Twitch API
1. Go to [Twitch Developers](https://dev.twitch.tv/)
2. Register your application
3. Get Client ID and Client Secret

### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account
3. Generate API key from API Keys section

## 🎮 Using the Bot

### User Commands
- `/ticket` - Create a support ticket
- `/credits` - Check your credit balance
- `/transfer @user amount` - Transfer credits
- `/stats` - View your statistics
- `/schedule set` - Set streaming schedule
- `/language` - Change language preference

### Admin Commands
- `/add-credits @user amount reason` - Add credits to a user

## 🌐 Deploying Dashboard to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
- `API_URL` - Your API server URL
- `NEXT_PUBLIC_API_URL` - Your API server URL

## 🔧 Running API Server

The API server runs on port 3001 by default. To start it separately:

```bash
node src/api/server.js
```

## 📊 Database Setup

The bot will automatically create collections when needed. To manually set up:

```bash
# Connect to MongoDB
mongosh

# Create database
use streamer_bot

# Create collections (optional, auto-created)
db.createCollection("streamers")
db.createCollection("tickets")
db.createCollection("credittransactions")
db.createCollection("analytics")
db.createCollection("rewards")
db.createCollection("alerts")
```

## 🆘 Troubleshooting

### Bot won't start
- Check if MongoDB is running
- Verify `.env` file has correct values
- Check Discord token is valid

### Commands not showing
- Re-invite bot with correct permissions
- Check bot has "application.commands" scope
- Verify DISCORD_GUILD_ID is correct

### Dashboard won't load
- Check if API server is running
- Verify API_URL in dashboard `.env`
- Check browser console for errors

## 📚 More Help

- [Full Documentation](README.md)
- [Discord.js Guide](https://discordjs.guide/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Manual](https://docs.mongodb.com/manual/)

## 🤝 Support

For issues and questions:
- Create an issue on GitHub
- Open a ticket in Discord server
