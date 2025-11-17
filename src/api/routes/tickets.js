import express from 'express';
import Ticket from '../../models/Ticket.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's tickets
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.discordId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tickets'
    });
  }
});

// Get ticket by ID
router.get('/:ticketId', authenticateToken, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    // Check if user has access to this ticket
    if (ticket.userId !== req.user.discordId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ticket'
    });
  }
});

export default router;
