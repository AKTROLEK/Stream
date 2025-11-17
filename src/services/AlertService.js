import Alert from '../models/Alert.js';
import Streamer from '../models/Streamer.js';

class AlertService {
  async createAlert(streamerId, type, data = {}) {
    const streamer = await Streamer.findOne({ discordId: streamerId });
    if (!streamer) throw new Error('Streamer not found');
    
    const alert = await Alert.create({
      streamerId,
      type,
      priority: data.priority || 'medium',
      title: data.title || {},
      message: data.message || {},
      platform: data.platform,
      data: data.metadata || {}
    });
    
    return alert;
  }
  
  async getUnsentAlerts(streamerId = null) {
    const query = { sent: false };
    if (streamerId) query.streamerId = streamerId;
    
    return await Alert.find(query).sort({ priority: -1, createdAt: 1 });
  }
  
  async markAsSent(alertId) {
    const alert = await Alert.findById(alertId);
    if (!alert) throw new Error('Alert not found');
    
    alert.sent = true;
    alert.sentAt = new Date();
    await alert.save();
    
    return alert;
  }
  
  async markAsRead(alertId) {
    const alert = await Alert.findById(alertId);
    if (!alert) throw new Error('Alert not found');
    
    alert.read = true;
    alert.readAt = new Date();
    await alert.save();
    
    return alert;
  }
  
  async createStreamReminder(streamerId, platform, scheduledTime) {
    return await this.createAlert(streamerId, 'schedule_reminder', {
      priority: 'high',
      title: {
        ar: 'تذكير بموعد البث',
        en: 'Stream Reminder'
      },
      message: {
        ar: `لديك بث مجدول على ${platform} في ${scheduledTime}`,
        en: `You have a scheduled stream on ${platform} at ${scheduledTime}`
      },
      platform
    });
  }
  
  async createRuleViolationAlert(streamerId, platform, violations) {
    return await this.createAlert(streamerId, 'rule_violation', {
      priority: 'high',
      title: {
        ar: 'تنبيه: مخالفة القوانين',
        en: 'Alert: Rule Violation'
      },
      message: {
        ar: `لم تحقق الشروط المطلوبة لـ ${platform}`,
        en: `You haven't met the requirements for ${platform}`
      },
      platform,
      metadata: { violations }
    });
  }
  
  async createWeeklyGoalAlert(streamerId) {
    return await this.createAlert(streamerId, 'weekly_goal_achieved', {
      priority: 'medium',
      title: {
        ar: 'مبروك! حققت الهدف الأسبوعي',
        en: 'Congratulations! Weekly Goal Achieved'
      },
      message: {
        ar: 'أحسنت! لقد حققت جميع أهدافك الأسبوعية',
        en: 'Well done! You have achieved all your weekly goals'
      }
    });
  }
  
  async createInactivityWarning(streamerId, days) {
    return await this.createAlert(streamerId, 'week_inactive', {
      priority: 'critical',
      title: {
        ar: 'تحذير: عدم نشاط',
        en: 'Warning: Inactivity'
      },
      message: {
        ar: `لم تبث منذ ${days} أيام`,
        en: `You haven't streamed for ${days} days`
      }
    });
  }
}

export default new AlertService();
