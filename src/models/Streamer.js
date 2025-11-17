import mongoose from 'mongoose';

const streamerSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  email: String,
  
  // Platform accounts
  platforms: {
    youtube: {
      channelId: String,
      channelName: String,
      enabled: { type: Boolean, default: false }
    },
    twitch: {
      channelId: String,
      channelName: String,
      enabled: { type: Boolean, default: false }
    },
    tiktok: {
      username: String,
      enabled: { type: Boolean, default: false }
    },
    kick: {
      channelName: String,
      enabled: { type: Boolean, default: false }
    },
    instagram: {
      username: String,
      enabled: { type: Boolean, default: false }
    },
    facebook: {
      pageId: String,
      pageName: String,
      enabled: { type: Boolean, default: false }
    }
  },
  
  // Credit system
  credits: {
    balance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  },
  
  // Streaming schedule
  schedule: [{
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday, 6 = Saturday
    startTime: String, // HH:MM format
    endTime: String,
    platform: String,
    timezone: { type: String, default: 'UTC' }
  }],
  
  // Platform-specific rules
  rules: {
    youtube: {
      minVideosPerWeek: { type: Number, default: 3 },
      minStreamHours: { type: Number, default: 10 }
    },
    twitch: {
      minVideosPerWeek: { type: Number, default: 2 },
      minStreamHours: { type: Number, default: 15 }
    },
    tiktok: {
      minVideosPerWeek: { type: Number, default: 5 },
      minStreamHours: { type: Number, default: 5 }
    },
    kick: {
      minVideosPerWeek: { type: Number, default: 2 },
      minStreamHours: { type: Number, default: 12 }
    },
    instagram: {
      minVideosPerWeek: { type: Number, default: 4 },
      minStreamHours: { type: Number, default: 5 }
    },
    facebook: {
      minVideosPerWeek: { type: Number, default: 3 },
      minStreamHours: { type: Number, default: 8 }
    }
  },
  
  // Statistics
  stats: {
    totalVideos: { type: Number, default: 0 },
    totalStreamHours: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalEngagement: { type: Number, default: 0 },
    lastStreamDate: Date,
    lastVideoDate: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'inactive'],
    default: 'pending'
  },
  
  // Preferences
  preferences: {
    language: { type: String, enum: ['ar', 'en'], default: 'ar' },
    notifications: { type: Boolean, default: true },
    timezone: { type: String, default: 'UTC' }
  },
  
  // Application data
  application: {
    submittedAt: Date,
    approvedAt: Date,
    approvedBy: String,
    experience: String,
    platforms: [String],
    sampleContent: String,
    notes: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
streamerSchema.index({ discordId: 1 });
streamerSchema.index({ status: 1 });
streamerSchema.index({ 'credits.balance': -1 });

export default mongoose.model('Streamer', streamerSchema);
