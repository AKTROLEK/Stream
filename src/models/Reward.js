import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  
  description: {
    ar: String,
    en: String
  },
  
  type: {
    type: String,
    enum: [
      'rank_upgrade',     // ترقية رتبة
      'promotion',        // ترويج
      'editing_service',  // خدمة مونتاج
      'design_service',   // تصميم
      'support',          // دعم
      'gift_card',        // قيفت كارد
      'physical_reward',  // جائزة مادية
      'tools',           // أدوات
      'coaching'         // تدريب
    ],
    required: true
  },
  
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  
  stock: {
    type: Number,
    default: -1  // -1 means unlimited
  },
  
  available: {
    type: Boolean,
    default: true
  },
  
  image: String,
  
  metadata: mongoose.Schema.Types.Mixed,
  
  // Requirements
  requirements: {
    minCredits: Number,
    minLevel: Number,
    requiredRole: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Reward', rewardSchema);
