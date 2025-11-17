import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  username: String,
  
  type: {
    type: String,
    enum: [
      'application',      // تقديم
      'issue',           // مشاكل
      'credit_edit',     // طلب تعديل كريدت
      'promotion',       // طلب ترويج
      'support'          // دعم فني
    ],
    required: true
  },
  
  status: {
    type: String,
    enum: ['open', 'in_progress', 'closed'],
    default: 'open'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Ticket content
  title: String,
  description: String,
  
  // Application specific fields
  applicationData: {
    platforms: [String],
    experience: String,
    sampleContent: String,
    weeklyAvailability: String
  },
  
  // Discord channel
  channelId: String,
  
  // Staff handling
  assignedTo: String,
  handledBy: String,
  
  // Messages and updates
  messages: [{
    userId: String,
    username: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
    isStaff: Boolean
  }],
  
  closedAt: Date,
  closedBy: String,
  closeReason: String
}, {
  timestamps: true
});

ticketSchema.index({ ticketId: 1 });
ticketSchema.index({ userId: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ type: 1 });

export default mongoose.model('Ticket', ticketSchema);
