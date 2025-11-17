import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  streamerId: {
    type: String,
    required: true,
    index: true
  },
  
  platform: {
    type: String,
    enum: ['youtube', 'twitch', 'tiktok', 'kick', 'instagram', 'facebook'],
    required: true
  },
  
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // Video metrics
  videos: {
    count: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    averageDuration: { type: Number, default: 0 }
  },
  
  // Stream metrics
  streams: {
    count: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    totalViewers: { type: Number, default: 0 },
    peakViewers: { type: Number, default: 0 },
    averageViewers: { type: Number, default: 0 }
  },
  
  // Engagement
  engagement: {
    total: { type: Number, default: 0 },
    rate: { type: Number, default: 0 } // percentage
  },
  
  // Growth
  growth: {
    newFollowers: { type: Number, default: 0 },
    newSubscribers: { type: Number, default: 0 }
  },
  
  // Period type
  periodType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  }
}, {
  timestamps: true
});

analyticsSchema.index({ streamerId: 1, platform: 1, date: -1 });
analyticsSchema.index({ periodType: 1, date: -1 });

export default mongoose.model('Analytics', analyticsSchema);
