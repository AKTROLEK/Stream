import Streamer from '../models/Streamer.js';
import CreditTransaction from '../models/CreditTransaction.js';
import dotenv from 'dotenv';

dotenv.config();

class CreditService {
  constructor() {
    this.rates = {
      video: parseInt(process.env.CREDIT_PER_VIDEO) || 10,
      stream: parseInt(process.env.CREDIT_PER_STREAM) || 20,
      weeklyGoal: parseInt(process.env.CREDIT_PER_WEEKLY_GOAL) || 50,
      engagement: parseInt(process.env.CREDIT_PER_ENGAGEMENT_MILESTONE) || 15
    };
  }
  
  async addCredits(streamerId, amount, type, description, metadata = {}) {
    const streamer = await Streamer.findOne({ discordId: streamerId });
    if (!streamer) throw new Error('Streamer not found');
    
    streamer.credits.balance += amount;
    streamer.credits.totalEarned += amount;
    await streamer.save();
    
    const transaction = await CreditTransaction.create({
      streamerId,
      type,
      amount,
      balanceAfter: streamer.credits.balance,
      description,
      ...metadata
    });
    
    return { streamer, transaction };
  }
  
  async deductCredits(streamerId, amount, type, description, metadata = {}) {
    const streamer = await Streamer.findOne({ discordId: streamerId });
    if (!streamer) throw new Error('Streamer not found');
    
    if (streamer.credits.balance < amount) {
      throw new Error('Insufficient credits');
    }
    
    streamer.credits.balance -= amount;
    streamer.credits.totalSpent += amount;
    await streamer.save();
    
    const transaction = await CreditTransaction.create({
      streamerId,
      type,
      amount: -amount,
      balanceAfter: streamer.credits.balance,
      description,
      ...metadata
    });
    
    return { streamer, transaction };
  }
  
  async transferCredits(fromStreamerId, toStreamerId, amount) {
    const fromStreamer = await Streamer.findOne({ discordId: fromStreamerId });
    const toStreamer = await Streamer.findOne({ discordId: toStreamerId });
    
    if (!fromStreamer || !toStreamer) {
      throw new Error('Streamer not found');
    }
    
    if (fromStreamer.credits.balance < amount) {
      throw new Error('Insufficient credits');
    }
    
    // Deduct from sender
    fromStreamer.credits.balance -= amount;
    await fromStreamer.save();
    
    await CreditTransaction.create({
      streamerId: fromStreamerId,
      type: 'transfer_out',
      amount: -amount,
      balanceAfter: fromStreamer.credits.balance,
      description: `Transfer to ${toStreamer.username}`,
      relatedUser: toStreamerId
    });
    
    // Add to receiver
    toStreamer.credits.balance += amount;
    await toStreamer.save();
    
    await CreditTransaction.create({
      streamerId: toStreamerId,
      type: 'transfer_in',
      amount,
      balanceAfter: toStreamer.credits.balance,
      description: `Transfer from ${fromStreamer.username}`,
      relatedUser: fromStreamerId
    });
    
    return { fromStreamer, toStreamer };
  }
  
  async getTransactionHistory(streamerId, limit = 50) {
    return await CreditTransaction.find({ streamerId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
  
  async earnFromVideo(streamerId, platform, videoId) {
    return await this.addCredits(
      streamerId,
      this.rates.video,
      'earn_video',
      `Published video on ${platform}`,
      { platform, contentId: videoId }
    );
  }
  
  async earnFromStream(streamerId, platform, streamId) {
    return await this.addCredits(
      streamerId,
      this.rates.stream,
      'earn_stream',
      `Streamed on ${platform}`,
      { platform, contentId: streamId }
    );
  }
  
  async earnWeeklyGoal(streamerId) {
    return await this.addCredits(
      streamerId,
      this.rates.weeklyGoal,
      'earn_weekly_goal',
      'Achieved weekly goal'
    );
  }
  
  async earnEngagement(streamerId, platform) {
    return await this.addCredits(
      streamerId,
      this.rates.engagement,
      'earn_engagement',
      `Engagement milestone on ${platform}`,
      { platform }
    );
  }
}

export default new CreditService();
