import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useLanguage } from '../lib/language';
import { creditAPI } from '../lib/api';

export default function Credits() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      const [balanceRes, historyRes] = await Promise.all([
        creditAPI.getBalance(),
        creditAPI.getHistory({ page, limit: 20 }),
      ]);

      setBalance(balanceRes.data.data);
      setTransactions(historyRes.data.data);
      setTotalPages(historyRes.data.pagination.pages);
    } catch (error) {
      console.error('Error loading credits:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTransactionColor = (type) => {
    if (type.startsWith('earn')) return 'text-success';
    if (type.startsWith('spend') || type === 'penalty') return 'text-danger';
    return 'text-gray-300';
  };

  const getTransactionIcon = (type) => {
    if (type.startsWith('earn')) return '↑';
    if (type.startsWith('spend') || type === 'penalty') return '↓';
    if (type.includes('transfer')) return '↔';
    return '•';
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
        <div>
          <h1 className="text-3xl font-bold">{t('credits')}</h1>
          <p className="text-gray-400 mt-1">
            {language === 'ar' ? 'إدارة رصيد الكريدت' : 'Manage your credits'}
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-8 text-white">
          <div className="text-sm opacity-90 mb-2">{t('balance')}</div>
          <div className="text-5xl font-bold mb-6">{balance?.balance || 0}</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs opacity-75">{t('totalEarned')}</div>
              <div className="text-2xl font-semibold">+{balance?.totalEarned || 0}</div>
            </div>
            <div>
              <div className="text-xs opacity-75">{t('totalSpent')}</div>
              <div className="text-2xl font-semibold">-{balance?.totalSpent || 0}</div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-darker rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">
              {language === 'ar' ? 'سجل المعاملات' : 'Transaction History'}
            </h2>
          </div>
          <div className="divide-y divide-gray-700">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                {language === 'ar' ? 'لا توجد معاملات' : 'No transactions yet'}
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="p-4 hover:bg-dark transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="font-semibold">{transaction.description}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(transaction.createdAt).toLocaleString(
                          language === 'ar' ? 'ar-SA' : 'en-US'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
                    </div>
                    <div className="text-sm text-gray-400">
                      {language === 'ar' ? 'الرصيد:' : 'Balance:'} {transaction.balanceAfter}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-700 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-dark rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
              >
                {language === 'ar' ? 'السابق' : 'Previous'}
              </button>
              <div className="px-4 py-2 bg-dark rounded-lg">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-dark rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
              >
                {language === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
