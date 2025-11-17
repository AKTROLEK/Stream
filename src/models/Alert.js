import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  streamerId: {
    type: String,
    required: true,
    index: true
  },
  
  type: {
    type: String,
    enum: [
      'new_video',           // فيديو جديد
      'stream_started',      // بث بدأ
      'stream_ended',        // بث انتهى
      'week_inactive',       // توقف أسبوع
      'rule_violation',      // مخالفة قوانين
      'schedule_reminder',   // تذكير بالجدول
      'weekly_goal_achieved',// هدف أسبوعي
      'milestone',          // milestone
      'credit_earned',      // كريدت مكتسب
      'warning'             // تحذير
    ],
    required: true
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  title: {
    ar: String,
    en: String
  },
  
  message: {
    ar: String,
    en: String
  },
  
  platform: String,
  
  data: mongoose.Schema.Types.Mixed,
  
  sent: {
    type: Boolean,
    default: false
  },
  
  sentAt: Date,
  
  read: {
    type: Boolean,
    default: false
  },
  
  readAt: Date
}, {
  timestamps: true
});

alertSchema.index({ streamerId: 1, sent: 1 });
alertSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model('Alert', alertSchema);
