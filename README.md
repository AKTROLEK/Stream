# 🎬 Full Professional Streamer Management System

A comprehensive Discord bot and web dashboard for managing streamers across multiple platforms (YouTube, Twitch, TikTok, Kick, Instagram, Facebook Gaming).

## ✨ Features

### 1. Advanced Ticket System
- Streamer application system
- Support tickets with categories:
  - Application (تقديم)
  - Issues (مشاكل)
  - Credit Edit (تعديل كريدت)
  - Promotion (ترويج)
  - Technical Support (دعم فني)
- Private channels visible only to authorized staff roles

### 2. Platform-Specific Rules
- Customizable requirements for each platform:
  - YouTube, TikTok, Twitch, Kick, Instagram, Facebook Gaming
  - Minimum videos per week
  - Minimum stream hours
  - Content type requirements
- Automatic violation alerts

### 3. Performance Analytics
- Weekly and monthly reports
- View counts, engagement metrics
- Top 3 streamers leaderboard
- Platform comparison

### 4. Credit/Points System
- Automatic credit earning:
  - Publishing videos
  - Starting streams
  - Achieving weekly goals
  - Engagement milestones
- Credit wallet with transaction history
- Credit transfers between users
- Admin-only balance modifications

### 5. Rewards Store
- Exchange credits for:
  - Rank upgrades
  - Content promotion
  - Editing/design services
  - Gift cards
  - Physical rewards
  - Tools and software
  - Coaching sessions

### 6. Streaming Schedule
- Set streaming schedule by day/time
- Automatic reminders 1 hour before stream
- Missed stream alerts

### 7. Smart Alerts
- New video notifications
- Stream start/end notifications
- Inactivity warnings
- Rule violation alerts
- Goal achievement notifications
- Milestone celebrations

### 8. Full Platform Integration
- YouTube API
- Twitch API
- TikTok API
- Kick API
- Instagram API
- Facebook Gaming API
- Automatic metrics collection

### 9. Community Management
- Weekly workshops
- Personalized tips for streamers
- Consultation channels

### 10. AI Integration (OpenAI GPT)
- Smart responses
- Content analysis and improvement suggestions
- Optimal streaming time recommendations
- Title/description/script generation
- Automatic violation detection

### 11. Multi-Language Support
- Arabic (عربي)
- English
- Easy language switching

### 12. Interactive Dashboard
- Real-time statistics
- Stream hours tracking
- Video count
- Credit balance
- Performance ratings
- Deployed on Vercel

### 13. Multi-Streamer Support
- Unlimited streamers
- Individual profiles
- Separate credit wallets
- Custom rules per streamer
- Independent schedules
- Concurrent streaming support

## 🚀 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Discord Bot Token
- API Keys for platforms (YouTube, Twitch, etc.)
- OpenAI API Key

### Bot Setup

1. Clone the repository:
```bash
git clone https://github.com/AKTROLEK/Stream.git
cd Stream
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:
- Discord Bot Token
- MongoDB URI
- Platform API Keys
- OpenAI API Key
- Discord Channel/Role IDs

4. Start the bot:
```bash
npm start
```

### Dashboard Setup

1. Navigate to dashboard directory:
```bash
cd dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📦 Deployment

### Bot Deployment
Deploy the bot on any Node.js hosting service (Railway, Heroku, DigitalOcean, etc.)

### Dashboard Deployment on Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
- `API_URL`: Your API server URL
- `NEXT_PUBLIC_API_URL`: Your API server URL (for client-side)

## 🎮 Discord Commands

### User Commands
- `/ticket` - Create a support ticket
- `/credits` - Check credit balance
- `/transfer` - Transfer credits to another user
- `/stats` - View streaming statistics
- `/schedule` - Manage streaming schedule

### Admin Commands
- `/approve` - Approve streamer application
- `/reject` - Reject streamer application
- `/add-credits` - Add credits to a user
- `/remove-credits` - Remove credits from a user
- `/set-rules` - Configure platform rules
- `/view-analytics` - View detailed analytics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with Discord ID
- `GET /api/auth/verify` - Verify JWT token

### Streamers
- `GET /api/streamers/profile` - Get user profile
- `PUT /api/streamers/profile` - Update profile
- `GET /api/streamers/leaderboard` - Get top streamers

### Credits
- `GET /api/credits/history` - Get transaction history
- `GET /api/credits/balance` - Get credit balance

### Analytics
- `GET /api/analytics/weekly` - Weekly report
- `GET /api/analytics/monthly` - Monthly report
- `GET /api/analytics/platforms` - Platform comparison
- `GET /api/analytics/top` - Top streamers

### Tickets
- `GET /api/tickets/my` - Get user tickets
- `GET /api/tickets/:id` - Get ticket details

### Rewards
- `GET /api/rewards` - List all rewards
- `POST /api/rewards/:id/purchase` - Purchase reward

## 🌐 Platform Integration

### YouTube
Requires YouTube Data API v3 key

### Twitch
Requires Twitch Client ID and Secret

### TikTok
Requires approved TikTok API access

### Kick
Uses public Kick API

### Instagram & Facebook
Requires Graph API access tokens

## 🤖 AI Features

The bot uses OpenAI GPT-4 for:
- Content analysis and suggestions
- Optimal streaming time recommendations
- Automatic title and description generation
- Script writing assistance
- Violation detection
- Smart chat responses

## 📊 Database Schema

### Collections
- `streamers` - Streamer profiles and stats
- `tickets` - Support tickets
- `credittransactions` - Credit history
- `analytics` - Performance metrics
- `rewards` - Available rewards
- `alerts` - System notifications

## 🔒 Security

- JWT authentication for API
- Role-based access control
- Encrypted sensitive data
- Rate limiting on API endpoints
- Input validation and sanitization

## 🌍 Localization

The system supports:
- Arabic (RTL layout)
- English (LTR layout)

Add translations in:
- Bot: `src/utils/translations.js`
- Dashboard: `dashboard/lib/language.js`

## 📝 License

MIT License

## 👨‍💻 Author

AKTROLEK

## 🙏 Acknowledgments

- Discord.js
- Next.js
- MongoDB
- OpenAI
- Vercel

---

## Support

For support, open a ticket in Discord or create an issue on GitHub.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.