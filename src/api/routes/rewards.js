import express from 'express';
import Reward from '../../models/Reward.js';
import { authenticateToken } from '../middleware/auth.js';
import CreditService from '../../services/CreditService.js';

const router = express.Router();

// Get all available rewards
router.get('/', async (req, res) => {
  try {
    const rewards = await Reward.find({ available: true })
      .sort({ cost: 1 });
    
    res.json({
      success: true,
      data: rewards
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rewards'
    });
  }
});

// Purchase reward
router.post('/:rewardId/purchase', authenticateToken, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found'
      });
    }
    
    if (!reward.available) {
      return res.status(400).json({
        success: false,
        message: 'Reward not available'
      });
    }
    
    if (reward.stock !== -1 && reward.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Reward out of stock'
      });
    }
    
    // Deduct credits
    await CreditService.deductCredits(
      req.user.discordId,
      reward.cost,
      'spend_reward',
      `Purchased: ${reward.name.en}`,
      { rewardId: reward._id }
    );
    
    // Update stock
    if (reward.stock !== -1) {
      reward.stock -= 1;
      await reward.save();
    }
    
    res.json({
      success: true,
      message: 'Reward purchased successfully'
    });
  } catch (error) {
    console.error('Purchase reward error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to purchase reward'
    });
  }
});

export default router;
