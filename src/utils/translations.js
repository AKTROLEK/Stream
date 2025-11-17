export default {
  ar: {
    // Ticket System
    ticket: {
      created: 'تم إنشاء التذكرة بنجاح! رقم التذكرة: {ticketId}',
      types: {
        application: 'تقديم طلب انضمام',
        issue: 'مشكلة تقنية',
        credit_edit: 'طلب تعديل كريدت',
        promotion: 'طلب ترويج',
        support: 'دعم فني'
      },
      closed: 'تم إغلاق التذكرة',
      notFound: 'التذكرة غير موجودة'
    },
    
    // Credit System
    credits: {
      balance: 'رصيدك الحالي: {balance} كريدت',
      earned: 'حصلت على {amount} كريدت! السبب: {reason}',
      spent: 'تم خصم {amount} كريدت. السبب: {reason}',
      insufficient: 'رصيد غير كافٍ. تحتاج {required} كريدت',
      transferred: 'تم تحويل {amount} كريدت إلى {username}',
      received: 'استلمت {amount} كريدت من {username}',
      history: 'سجل المعاملات'
    },
    
    // Alerts
    alerts: {
      streamReminder: 'تذكير: لديك بث مجدول بعد ساعة واحدة على {platform}',
      missedStream: 'تنبيه: فاتك موعد البث المجدول',
      weekInactive: 'تحذير: لم تبث لمدة أسبوع كامل',
      ruleViolation: 'تنبيه: لم تحقق الشروط المطلوبة لـ {platform}',
      goalAchieved: 'مبروك! حققت الهدف الأسبوعي',
      milestone: 'إنجاز رائع! وصلت إلى {milestone}'
    },
    
    // Analytics
    analytics: {
      weekly: 'التقرير الأسبوعي',
      monthly: 'التقرير الشهري',
      videos: 'المقاطع: {count}',
      hours: 'ساعات البث: {hours}',
      views: 'المشاهدات: {views}',
      engagement: 'التفاعل: {rate}%'
    },
    
    // Rewards
    rewards: {
      purchased: 'تم شراء {reward} بنجاح!',
      notAvailable: 'المكافأة غير متوفرة حالياً',
      outOfStock: 'المكافأة نفدت من المخزون'
    },
    
    // Application
    application: {
      submitted: 'تم تقديم طلبك بنجاح! سيتم مراجعته قريباً',
      approved: 'مبروك! تم قبول طلبك كستريمر',
      rejected: 'عذراً، تم رفض طلبك. السبب: {reason}'
    },
    
    // Schedule
    schedule: {
      set: 'تم تعيين جدول البث بنجاح',
      reminder: 'تذكير بموعد البث',
      updated: 'تم تحديث الجدول'
    },
    
    // Errors
    errors: {
      notFound: 'لم يتم العثور على البيانات',
      permission: 'ليس لديك صلاحية لهذا الإجراء',
      database: 'خطأ في قاعدة البيانات',
      api: 'خطأ في الاتصال بالمنصة'
    },
    
    // Common
    common: {
      success: 'تم بنجاح',
      failed: 'فشل',
      loading: 'جاري التحميل...',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      yes: 'نعم',
      no: 'لا'
    }
  },
  
  en: {
    // Ticket System
    ticket: {
      created: 'Ticket created successfully! Ticket ID: {ticketId}',
      types: {
        application: 'Application',
        issue: 'Technical Issue',
        credit_edit: 'Credit Edit Request',
        promotion: 'Promotion Request',
        support: 'Technical Support'
      },
      closed: 'Ticket closed',
      notFound: 'Ticket not found'
    },
    
    // Credit System
    credits: {
      balance: 'Your current balance: {balance} credits',
      earned: 'You earned {amount} credits! Reason: {reason}',
      spent: '{amount} credits deducted. Reason: {reason}',
      insufficient: 'Insufficient balance. You need {required} credits',
      transferred: 'Transferred {amount} credits to {username}',
      received: 'Received {amount} credits from {username}',
      history: 'Transaction History'
    },
    
    // Alerts
    alerts: {
      streamReminder: 'Reminder: You have a scheduled stream in 1 hour on {platform}',
      missedStream: 'Alert: You missed your scheduled stream',
      weekInactive: 'Warning: You haven\'t streamed for a full week',
      ruleViolation: 'Alert: You haven\'t met the requirements for {platform}',
      goalAchieved: 'Congratulations! You achieved your weekly goal',
      milestone: 'Great achievement! You reached {milestone}'
    },
    
    // Analytics
    analytics: {
      weekly: 'Weekly Report',
      monthly: 'Monthly Report',
      videos: 'Videos: {count}',
      hours: 'Stream Hours: {hours}',
      views: 'Views: {views}',
      engagement: 'Engagement: {rate}%'
    },
    
    // Rewards
    rewards: {
      purchased: 'Successfully purchased {reward}!',
      notAvailable: 'Reward is not currently available',
      outOfStock: 'Reward is out of stock'
    },
    
    // Application
    application: {
      submitted: 'Your application has been submitted successfully! It will be reviewed soon',
      approved: 'Congratulations! Your application as a streamer has been approved',
      rejected: 'Sorry, your application was rejected. Reason: {reason}'
    },
    
    // Schedule
    schedule: {
      set: 'Stream schedule set successfully',
      reminder: 'Stream schedule reminder',
      updated: 'Schedule updated'
    },
    
    // Errors
    errors: {
      notFound: 'Data not found',
      permission: 'You don\'t have permission for this action',
      database: 'Database error',
      api: 'Platform connection error'
    },
    
    // Common
    common: {
      success: 'Success',
      failed: 'Failed',
      loading: 'Loading...',
      cancel: 'Cancel',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No'
    }
  }
};
