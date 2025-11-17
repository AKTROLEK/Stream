import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useLanguage } from '../lib/language';
import { ticketAPI } from '../lib/api';

export default function Tickets() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

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
      const response = await ticketAPI.getMy();
      setTickets(response.data.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-success text-white';
      case 'in_progress': return 'bg-warning text-dark';
      case 'closed': return 'bg-gray-600 text-gray-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      ar: {
        application: 'تقديم',
        issue: 'مشكلة',
        credit_edit: 'تعديل كريدت',
        promotion: 'ترويج',
        support: 'دعم فني'
      },
      en: {
        application: 'Application',
        issue: 'Issue',
        credit_edit: 'Credit Edit',
        promotion: 'Promotion',
        support: 'Support'
      }
    };
    return labels[language][type] || type;
  };

  const getStatusLabel = (status) => {
    const labels = {
      ar: {
        open: 'مفتوح',
        in_progress: 'قيد المعالجة',
        closed: 'مغلق'
      },
      en: {
        open: 'Open',
        in_progress: 'In Progress',
        closed: 'Closed'
      }
    };
    return labels[language][status] || status;
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
          <h1 className="text-3xl font-bold">{t('tickets')}</h1>
          <p className="text-gray-400 mt-1">
            {language === 'ar' ? 'تذاكر الدعم الخاصة بك' : 'Your support tickets'}
          </p>
        </div>

        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-darker rounded-lg p-12 text-center border border-gray-700">
              <div className="text-6xl mb-4">🎫</div>
              <div className="text-xl text-gray-400">
                {language === 'ar' ? 'لا توجد تذاكر' : 'No tickets yet'}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {language === 'ar'
                  ? 'استخدم /ticket في Discord لإنشاء تذكرة'
                  : 'Use /ticket in Discord to create a ticket'}
              </div>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-darker rounded-lg p-6 border border-gray-700 hover:border-primary transition-colors cursor-pointer"
                onClick={() => router.push(`/tickets/${ticket.ticketId}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{ticket.ticketId}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {getTypeLabel(ticket.type)} • {' '}
                      {new Date(ticket.createdAt).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="font-semibold mb-1">{ticket.title}</div>
                  <div className="text-gray-400 text-sm line-clamp-2">
                    {ticket.description}
                  </div>
                </div>
                {ticket.messages?.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {ticket.messages.length} {language === 'ar' ? 'رسائل' : 'messages'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
