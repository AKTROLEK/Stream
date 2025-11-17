import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useLanguage } from '../lib/language';
import { analyticsAPI } from '../lib/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('weekly');
  const [report, setReport] = useState(null);
  const [platforms, setPlatforms] = useState(null);
  const [topStreamers, setTopStreamers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportRes, platformsRes, topRes] = await Promise.all([
        period === 'weekly' ? analyticsAPI.getWeekly() : analyticsAPI.getMonthly(),
        analyticsAPI.getPlatforms(),
        analyticsAPI.getTop(period, 3),
      ]);

      setReport(reportRes.data.data);
      setPlatforms(platformsRes.data.data);
      setTopStreamers(topRes.data.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
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

  const platformData = platforms ? Object.entries(platforms).map(([name, stats]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    videos: stats.videos,
    hours: parseFloat(stats.streamHours.toFixed(1)),
    views: stats.views,
  })) : [];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('analytics')}</h1>
            <p className="text-gray-400 mt-1">
              {language === 'ar' ? 'تحليل أدائك' : 'Analyze your performance'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'weekly'
                  ? 'bg-primary text-white'
                  : 'bg-dark text-gray-300 hover:bg-gray-700'
              }`}
            >
              {language === 'ar' ? 'أسبوعي' : 'Weekly'}
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'monthly'
                  ? 'bg-primary text-white'
                  : 'bg-dark text-gray-300 hover:bg-gray-700'
              }`}
            >
              {language === 'ar' ? 'شهري' : 'Monthly'}
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">{t('videos')}</h3>
            <p className="text-3xl font-bold text-success mt-2">
              {report?.totalVideos || 0}
            </p>
          </div>
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">{t('streamHours')}</h3>
            <p className="text-3xl font-bold text-secondary mt-2">
              {report?.totalStreamHours?.toFixed(1) || 0}
            </p>
          </div>
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">{t('views')}</h3>
            <p className="text-3xl font-bold text-primary mt-2">
              {report?.totalViews?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">
              {language === 'ar' ? 'التفاعل' : 'Engagement'}
            </h3>
            <p className="text-3xl font-bold text-warning mt-2">
              {report?.totalEngagement?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Platform Charts */}
        {platformData.length > 0 && (
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">{t('platforms')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2C2F33', border: '1px solid #444' }}
                />
                <Legend />
                <Bar dataKey="videos" fill="#57F287" name={t('videos')} />
                <Bar dataKey="hours" fill="#EB459E" name={t('streamHours')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Streamers */}
        {topStreamers.length > 0 && (
          <div className="bg-darker rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">{t('topStreamers')}</h2>
            <div className="space-y-4">
              {topStreamers.map((streamer, index) => (
                <div
                  key={streamer._id}
                  className="flex items-center justify-between p-4 bg-dark rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-400' :
                      'text-amber-700'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{streamer.username}</div>
                      <div className="text-sm text-gray-400">
                        {streamer.totalVideos} {language === 'ar' ? 'مقاطع' : 'videos'} • {' '}
                        {streamer.totalStreamHours?.toFixed(1)} {language === 'ar' ? 'ساعات' : 'hours'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {streamer.totalViews?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">{language === 'ar' ? 'مشاهدات' : 'views'}</div>
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
