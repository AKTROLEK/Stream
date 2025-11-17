import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useLanguage } from '../lib/language';
import { rewardAPI, creditAPI } from '../lib/api';

export default function Rewards() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [balance, setBalance] = useState(0);
  const [purchasing, setPurchasing] = useState(null);

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
      const [rewardsRes, balanceRes] = await Promise.all([
        rewardAPI.getAll(),
        creditAPI.getBalance(),
      ]);

      setRewards(rewardsRes.data.data);
      setBalance(balanceRes.data.data.balance);
    } catch (error) {
      console.error('Error loading rewards:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (rewardId, cost) => {
    if (balance < cost) {
      alert(language === 'ar' ? 'رصيد غير كافٍ' : 'Insufficient balance');
      return;
    }

    if (!confirm(language === 'ar' ? 'هل أنت متأكد من الشراء؟' : 'Are you sure you want to purchase?')) {
      return;
    }

    setPurchasing(rewardId);
    try {
      await rewardAPI.purchase(rewardId);
      alert(language === 'ar' ? 'تم الشراء بنجاح!' : 'Purchase successful!');
      loadData(); // Reload to update balance
    } catch (error) {
      alert(error.response?.data?.message || (language === 'ar' ? 'فشل الشراء' : 'Purchase failed'));
    } finally {
      setPurchasing(null);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{language === 'ar' ? 'متجر المكافآت' : 'Rewards Store'}</h1>
            <p className="text-gray-400 mt-1">
              {language === 'ar' ? 'استبدل الكريدت للحصول على مكافآت' : 'Exchange credits for rewards'}
            </p>
          </div>
          <div className="bg-darker rounded-lg px-6 py-3 border border-gray-700">
            <div className="text-sm text-gray-400">{language === 'ar' ? 'رصيدك' : 'Your Balance'}</div>
            <div className="text-2xl font-bold text-primary">{balance}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = balance >= reward.cost;
            const isAvailable = reward.available && (reward.stock === -1 || reward.stock > 0);
            
            return (
              <div
                key={reward._id}
                className={`bg-darker rounded-lg p-6 border ${
                  isAvailable && canAfford ? 'border-primary' : 'border-gray-700'
                } ${!isAvailable && 'opacity-50'}`}
              >
                <h3 className="text-xl font-bold mb-2">
                  {language === 'ar' ? reward.name.ar : reward.name.en}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {language === 'ar' ? reward.description?.ar : reward.description?.en}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-primary">
                    {reward.cost} {language === 'ar' ? 'كريدت' : 'Credits'}
                  </div>
                  <button
                    onClick={() => handlePurchase(reward._id, reward.cost)}
                    disabled={!isAvailable || !canAfford || purchasing === reward._id}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isAvailable && canAfford
                        ? 'bg-primary hover:bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {purchasing === reward._id
                      ? (language === 'ar' ? 'جاري الشراء...' : 'Purchasing...')
                      : !isAvailable
                      ? (language === 'ar' ? 'غير متوفر' : 'Unavailable')
                      : !canAfford
                      ? (language === 'ar' ? 'رصيد غير كافٍ' : 'Insufficient')
                      : (language === 'ar' ? 'شراء' : 'Purchase')}
                  </button>
                </div>
                {reward.stock !== -1 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {language === 'ar' ? 'المتوفر:' : 'Stock:'} {reward.stock}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {rewards.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {language === 'ar' ? 'لا توجد مكافآت متاحة حالياً' : 'No rewards available at the moment'}
          </div>
        )}
      </div>
    </Layout>
  );
}
