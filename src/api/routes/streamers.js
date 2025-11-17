import express from 'express';
import Streamer from '../../models/Streamer.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get streamer profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const streamer = await Streamer.findOne({ discordId: req.user.discordId });
    
    if (!streamer) {
      return res.status(404).json({
        success: false,
        message: 'Streamer not found'
      });
    }
    
    res.json({
      success: true,
      data: streamer
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

// Update streamer profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { platforms, schedule, preferences } = req.body;
    
    const streamer = await Streamer.findOne({ discordId: req.user.discordId });
    
    if (!streamer) {
      return res.status(404).json({
        success: false,
        message: 'Streamer not found'
      });
    }
    
    if (platforms) streamer.platforms = { ...streamer.platforms, ...platforms };
    if (schedule) streamer.schedule = schedule;
    if (preferences) streamer.preferences = { ...streamer.preferences, ...preferences };
    
    await streamer.save();
    
    res.json({
      success: true,
      data: streamer
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Get all streamers (for leaderboard)
router.get('/leaderboard', async (req, res) => {
  try {
    const streamers = await Streamer.find({ status: 'active' })
      .sort({ 'stats.totalViews': -1 })
      .limit(10)
      .select('username stats credits');
    
    res.json({
      success: true,
      data: streamers
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard'
    });
  }
});

export default router;
