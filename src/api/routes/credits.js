import express from 'express';
import CreditTransaction from '../../models/CreditTransaction.js';
import { authenticateToken } from '../middleware/auth.js';
import CreditService from '../../services/CreditService.js';

const router = express.Router();

// Get credit history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const transactions = await CreditTransaction.find({
      streamerId: req.user.discordId
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await CreditTransaction.countDocuments({
      streamerId: req.user.discordId
    });
    
    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get credit history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get credit history'
    });
  }
});

// Get credit balance
router.get('/balance', authenticateToken, async (req, res) => {
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
      data: streamer.credits
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get balance'
    });
  }
});

export default router;
