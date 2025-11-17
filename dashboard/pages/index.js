import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useLanguage } from '../lib/language';
import { streamerAPI, analyticsAPI, creditAPI } from '../lib/api';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, analyticsRes] = await Promise.all([
        streamerAPI.getProfile(),
        analyticsAPI.getWeekly(),
      ]);

      setProfile(profileRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl">{t('loading')}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t('welcome')}, {profile?.username}!</h1>
          <p className="text-gray-400 mt-1">{t('dashboard')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Credits */}
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">{t('balance')}</h3>
            <p className="text-3xl font-bold text-primary mt-2">
              {profile?.credits?.balance || 0}
            </p>
            <div className="mt-4 space-y-1 text-sm text-gray-400">
              <div>{t('totalEarned')}: {profile?.credits?.totalEarned || 0}</div>
              <div>{t('totalSpent')}: {profile?.credits?.totalSpent || 0}</div>
            </div>
          </div>

          {/* Videos */}
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">{t('videos')}</h3>
            <p className="text-3xl font-bold text-success mt-2">
              {analytics?.totalVideos || 0}
            </p>
            <div className="mt-4 text-sm text-gray-400">
              {t('weeklyReport')}
            </div>
          </div>

          {/* Stream Hours */}
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">{t('streamHours')}</h3>
            <p className="text-3xl font-bold text-secondary mt-2">
              {analytics?.totalStreamHours?.toFixed(1) || 0}
            </p>
            <div className="mt-4 text-sm text-gray-400">
              {t('weeklyReport')}
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        {analytics?.platforms && Object.keys(analytics.platforms).length > 0 && (
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">{t('platforms')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analytics.platforms).map(([platform, stats]) => (
                <div key={platform} className="bg-dark rounded-lg p-4">
                  <h3 className="font-semibold capitalize mb-2">{platform}</h3>
                  <div className="space-y-1 text-sm text-gray-400">
                    <div>{t('videos')}: {stats.videos}</div>
                    <div>{t('streamHours')}: {stats.streamHours.toFixed(1)}</div>
                    <div>{t('views')}: {stats.views.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
