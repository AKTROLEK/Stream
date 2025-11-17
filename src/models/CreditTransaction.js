import mongoose from 'mongoose';

const creditTransactionSchema = new mongoose.Schema({
  streamerId: {
    type: String,
    required: true,
    index: true
  },
  
  type: {
    type: String,
    enum: [
      'earn_video',         // نشر مقطع
      'earn_stream',        // فتح بث
      'earn_weekly_goal',   // تحقيق هدف أسبوعي
      'earn_engagement',    // تحقيق تفاعل
      'earn_milestone',     // milestone achievement
      'earn_bonus',         // مكافأة من الإدارة
      'spend_reward',       // استبدال في المتجر
      'spend_promotion',    // ترويج
      'spend_service',      // خدمة
      'penalty',            // عقوبة
      'transfer_in',        // تحويل وارد
      'transfer_out',       // تحويل صادر
      'admin_adjustment'    // تعديل إداري
    ],
    required: true
  },
  
  amount: {
    type: Number,
    required: true
  },
  
  balanceAfter: {
    type: Number,
    required: true
  },
  
  description: String,
  
  // For transfers
  relatedUser: String,
  
  // For rewards/purchases
  rewardId: mongoose.Schema.Types.ObjectId,
  
  // Platform specific
  platform: String,
  contentId: String, // video/stream ID
  
  // Staff actions
  adminId: String,
  adminUsername: String,
  
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

creditTransactionSchema.index({ streamerId: 1, createdAt: -1 });
creditTransactionSchema.index({ type: 1 });

export default mongoose.model('CreditTransaction', creditTransactionSchema);
