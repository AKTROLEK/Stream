import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Streamer from '../../models/Streamer.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { discordId } = req.body;
    
    if (!discordId) {
      return res.status(400).json({
        success: false,
        message: 'Discord ID required'
      });
    }
    
    const streamer = await Streamer.findOne({ discordId });
    
    if (!streamer) {
      return res.status(404).json({
        success: false,
        message: 'Streamer not found'
      });
    }
    
    const token = jwt.sign(
      {
        id: streamer._id,
        discordId: streamer.discordId,
        username: streamer.username,
        isAdmin: false
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: streamer._id,
        discordId: streamer.discordId,
        username: streamer.username,
        credits: streamer.credits.balance,
        status: streamer.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

export default router;
