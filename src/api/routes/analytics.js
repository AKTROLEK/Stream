import express from 'express';
import Analytics from '../../models/Analytics.js';
import { authenticateToken } from '../middleware/auth.js';
import AnalyticsService from '../../services/AnalyticsService.js';

const router = express.Router();

// Get weekly report
router.get('/weekly', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.query;
    
    const report = await AnalyticsService.getWeeklyReport(
      req.user.discordId,
      platform || null
    );
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get weekly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get weekly report'
    });
  }
});

// Get monthly report
router.get('/monthly', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.query;
    
    const report = await AnalyticsService.getMonthlyReport(
      req.user.discordId,
      platform || null
    );
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get monthly report'
    });
  }
});

// Get platform comparison
router.get('/platforms', authenticateToken, async (req, res) => {
  try {
    const comparison = await AnalyticsService.compareplatforms(req.user.discordId);
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Get platform comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get platform comparison'
    });
  }
});

// Get top streamers
router.get('/top', async (req, res) => {
  try {
    const { period = 'weekly', limit = 3 } = req.query;
    
    const topStreamers = await AnalyticsService.getTopStreamers(
      period,
      parseInt(limit)
    );
    
    res.json({
      success: true,
      data: topStreamers
    });
  } catch (error) {
    console.error('Get top streamers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get top streamers'
    });
  }
});

export default router;
