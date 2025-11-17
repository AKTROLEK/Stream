# 🎬 Complete Setup & Usage Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the System](#running-the-system)
5. [Using Discord Commands](#using-discord-commands)
6. [Using the Dashboard](#using-the-dashboard)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js 18+**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **MongoDB**
   - **Option A - Local**: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
   - **Option B - Cloud**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
   - Verify: `mongod --version` or check Atlas connection

3. **Discord Bot Account**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application"
   - Go to "Bot" section and create a bot
   - Enable these Privileged Gateway Intents:
     - ✅ Server Members Intent
     - ✅ Message Content Intent
   - Copy the bot token (keep it secret!)

4. **Git** (optional)
   - Download from [git-scm.com](https://git-scm.com/)

---

## Installation

### Step 1: Get the Code

**Option A - Clone Repository:**
```bash
git clone https://github.com/AKTROLEK/Stream.git
cd Stream
```

**Option B - Download ZIP:**
1. Download the repository as ZIP
2. Extract to a folder
3. Open terminal/command prompt in that folder

### Step 2: Run Setup Script

**On Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```bash
setup.bat
```

This will:
- Install bot dependencies
- Install dashboard dependencies
- Create `.env` file

**Manual Installation (if scripts fail):**
```bash
# Install bot dependencies
npm install

# Install dashboard dependencies
cd dashboard
npm install
cd ..
```

---

## Configuration

### Step 1: Edit Environment Variables

Open `.env` file and fill in your credentials:

```env
# ==========================================
# DISCORD CONFIGURATION (Required)
# ==========================================
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_application_id_here
DISCORD_GUILD_ID=your_server_id_here

# ==========================================
# DATABASE (Required)
# ==========================================
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/streamer_bot

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streamer_bot

# ==========================================
# PLATFORM APIs (Optional but recommended)
# ==========================================
YOUTUBE_API_KEY=your_youtube_api_key
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
TIKTOK_API_KEY=your_tiktok_api_key
KICK_API_KEY=not_required
INSTAGRAM_API_KEY=your_instagram_api_key
FACEBOOK_API_KEY=your_facebook_api_key

# ==========================================
# OPENAI (Optional but recommended)
# ==========================================
OPENAI_API_KEY=your_openai_api_key

# ==========================================
# SECURITY (Required)
# ==========================================
JWT_SECRET=change_this_to_a_random_string_min_32_chars

# ==========================================
# API SERVER (Optional)
# ==========================================
API_PORT=3001
DASHBOARD_URL=http://localhost:3000

# ==========================================
# DISCORD CHANNELS & ROLES (Required for tickets)
# ==========================================
TICKET_CATEGORY_ID=your_category_id
ADMIN_LOG_CHANNEL_ID=your_log_channel_id
NOTIFICATION_CHANNEL_ID=your_notification_channel_id

SOCIAL_MEDIA_MANAGER_ROLE=your_role_id
SOCIAL_TEAM_ROLE=your_role_id
STREAMER_MANAGEMENT_ROLE=your_role_id
STREAMER_ROLE=your_role_id

# ==========================================
# CREDIT SYSTEM (Optional)
# ==========================================
CREDIT_PER_VIDEO=10
CREDIT_PER_STREAM=20
CREDIT_PER_WEEKLY_GOAL=50
CREDIT_PER_ENGAGEMENT_MILESTONE=15

# ==========================================
# LANGUAGE (Optional)
# ==========================================
DEFAULT_LANGUAGE=ar
```

### Step 2: Get Required IDs

#### Discord Guild ID (Server ID):
1. Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
2. Right-click your server → Copy ID

#### Discord Channel IDs:
1. Right-click the channel → Copy ID
2. You need:
   - A category for tickets
   - A channel for admin logs
   - A channel for notifications

#### Discord Role IDs:
1. Go to Server Settings → Roles
2. Right-click role → Copy ID

### Step 3: Get API Keys

#### YouTube API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → API Key
5. Copy the API key

#### Twitch API:
1. Go to [Twitch Developers](https://dev.twitch.tv/console)
2. Register your application
3. Copy Client ID and Client Secret

#### OpenAI API:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy the key (you won't see it again!)

---

## Running the System

### Step 1: Start MongoDB

**Local MongoDB:**
```bash
# Linux
sudo systemctl start mongod

# Mac
brew services start mongodb-community

# Windows (if installed as service)
net start MongoDB
```

**MongoDB Atlas:**
- Already running, just verify connection string in `.env`

### Step 2: Start the Bot

```bash
npm start
```

You should see:
```
MongoDB Connected: ...
Started refreshing application (/) commands.
Successfully reloaded application (/) commands.
✅ Bot is ready! Logged in as YourBotName#1234
📊 Serving 1 guild(s)
Scheduled tasks set up successfully
```

### Step 3: Start the API Server (Optional)

In a new terminal:
```bash
node src/api/server.js
```

You should see:
```
MongoDB Connected: ...
🚀 API Server running on port 3001
📊 Dashboard URL: http://localhost:3000
```

### Step 4: Start the Dashboard (Optional)

In another new terminal:
```bash
cd dashboard
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000
```

Visit: http://localhost:3000

---

## Using Discord Commands

### For Users:

#### Create a Ticket
```
/ticket type:application
```
Then fill in the modal form.

#### Check Credits
```
/credits
```

#### View Credit History
```
/credit-history
```

#### Transfer Credits
```
/transfer user:@username amount:50
```

#### View Statistics
```
/stats period:weekly
```

#### Set Schedule
```
/schedule set day:1 start_time:14:00 end_time:18:00 platform:youtube
```

#### View Schedule
```
/schedule view
```

#### Change Language
```
/language lang:en
```

### For Admins:

#### Add Credits to User
```
/add-credits user:@username amount:100 reason:Great content this week
```

---

## Using the Dashboard

### Step 1: Get Your Discord ID

1. Enable Developer Mode in Discord
2. Right-click your username → Copy ID

### Step 2: Login

1. Go to http://localhost:3000
2. Enter your Discord ID
3. Click Login

### Step 3: Navigate

- **Home**: View your stats overview
- **Analytics**: Detailed charts and reports
- **Credits**: Balance and transaction history
- **Rewards**: Browse and purchase rewards
- **Tickets**: View your support tickets

### Step 4: Change Language

Click the language button (AR/EN) in the sidebar to switch languages.

---

## Deployment

### Deploy Bot to Railway

1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Add environment variables (all from `.env`)
4. Deploy!

### Deploy Bot to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-bot-name`
4. Add MongoDB: `heroku addons:create mongolab`
5. Set variables: `heroku config:set DISCORD_TOKEN=...`
6. Deploy: `git push heroku main`

### Deploy Dashboard to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Navigate to dashboard: `cd dashboard`
4. Deploy: `vercel`
5. Set environment variables in Vercel dashboard:
   - `API_URL`
   - `NEXT_PUBLIC_API_URL`
6. Production deploy: `vercel --prod`

---

## Troubleshooting

### Bot Won't Start

**Error: "Invalid token"**
- Check `DISCORD_TOKEN` in `.env`
- Generate new token in Discord Developer Portal

**Error: "Cannot find module"**
- Run `npm install` again
- Check Node.js version: `node --version` (needs 18+)

**Error: "MongoDB connection failed"**
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- For Atlas, check if IP is whitelisted

### Commands Not Showing

**No slash commands in Discord**
- Check `DISCORD_CLIENT_ID` and `DISCORD_GUILD_ID`
- Wait a few minutes (Discord caches commands)
- Try kicking and re-inviting the bot

**Bot lacks permissions**
- Re-invite bot with this URL:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```
Replace `YOUR_CLIENT_ID` with your bot's client ID

### Dashboard Issues

**"Login failed"**
- Check if API server is running
- Verify Discord ID is correct
- Check if user exists in database (must use bot first)

**"API connection error"**
- Check `API_URL` in dashboard `.env`
- Verify API server is running on correct port
- Check CORS settings in `src/api/server.js`

### Platform API Errors

**YouTube API Error**
- Check if API key is valid
- Verify YouTube Data API v3 is enabled
- Check quota limits

**Twitch API Error**
- Verify Client ID and Secret
- Check if credentials are for correct app

**OpenAI API Error**
- Check if API key is valid
- Verify you have credits in OpenAI account
- Check rate limits

---

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set up proper MongoDB backup
- [ ] Configure error logging (PM2 or external service)
- [ ] Set up monitoring (UptimeRobot, etc.)
- [ ] Enable HTTPS for dashboard
- [ ] Set up rate limiting on API
- [ ] Review and restrict bot permissions
- [ ] Set up automatic database backups
- [ ] Configure CDN for dashboard static assets
- [ ] Set up environment-specific configs
- [ ] Test all features thoroughly
- [ ] Prepare user documentation
- [ ] Set up support channel in Discord

---

## Getting Help

- **Documentation**: Read README.md and PROJECT_SUMMARY.md
- **Discord**: Create a ticket using `/ticket type:support`
- **GitHub**: Open an issue on the repository
- **API Docs**: Check inline comments in code

---

## Security Notes

⚠️ **Never commit `.env` file to version control!**

⚠️ **Keep your Discord token secret!**

⚠️ **Use strong JWT_SECRET in production!**

⚠️ **Regularly update dependencies:** `npm update`

⚠️ **Monitor for security alerts:** `npm audit`

---

## License

MIT License - See LICENSE file for details

---

## Credits

Built with:
- Discord.js
- Next.js
- MongoDB
- OpenAI
- And many other amazing open-source libraries

---

**🎉 You're all set! Enjoy your Stream Manager Bot!**
