import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  ar: {
    dashboard: 'لوحة التحكم',
    home: 'الرئيسية',
    analytics: 'التحليلات',
    credits: 'الكريدت',
    schedule: 'الجدول',
    rewards: 'المكافآت',
    tickets: 'التذاكر',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    welcome: 'مرحباً',
    balance: 'الرصيد',
    totalEarned: 'إجمالي المكتسب',
    totalSpent: 'إجمالي المصروف',
    videos: 'المقاطع',
    streamHours: 'ساعات البث',
    views: 'المشاهدات',
    weeklyReport: 'التقرير الأسبوعي',
    monthlyReport: 'التقرير الشهري',
    topStreamers: 'أفضل الستريمرز',
    platforms: 'المنصات',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
  },
  en: {
    dashboard: 'Dashboard',
    home: 'Home',
    analytics: 'Analytics',
    credits: 'Credits',
    schedule: 'Schedule',
    rewards: 'Rewards',
    tickets: 'Tickets',
    settings: 'Settings',
    logout: 'Logout',
    welcome: 'Welcome',
    balance: 'Balance',
    totalEarned: 'Total Earned',
    totalSpent: 'Total Spent',
    videos: 'Videos',
    streamHours: 'Stream Hours',
    views: 'Views',
    weeklyReport: 'Weekly Report',
    monthlyReport: 'Monthly Report',
    topStreamers: 'Top Streamers',
    platforms: 'Platforms',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar');

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved) setLanguage(saved);
  }, []);

  const switchLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
