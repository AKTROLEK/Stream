import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/database.js';

// Import routes
import authRoutes from './api/routes/auth.js';
import streamerRoutes from './api/routes/streamers.js';
import creditRoutes from './api/routes/credits.js';
import analyticsRoutes from './api/routes/analytics.js';
import ticketRoutes from './api/routes/tickets.js';
import rewardRoutes from './api/routes/rewards.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.DASHBOARD_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/streamers', streamerRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/rewards', rewardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 API Server running on port ${PORT}`);
      console.log(`📊 Dashboard URL: ${process.env.DASHBOARD_URL}`);
    });
  } catch (error) {
    console.error('Failed to start API server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
