import { useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../lib/api';
import { useLanguage } from '../lib/language';

export default function Login() {
  const { t, language, switchLanguage } = useLanguage();
  const router = useRouter();
  const [discordId, setDiscordId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(discordId);
      localStorage.setItem('token', response.data.token);
      router.push('/');
    } catch (err) {
      setError(
        language === 'ar'
          ? 'فشل تسجيل الدخول. تحقق من Discord ID'
          : 'Login failed. Check your Discord ID'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkest">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Stream Manager</h1>
          <p className="text-gray-400">
            {language === 'ar' ? 'تسجيل الدخول إلى لوحة التحكم' : 'Login to Dashboard'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="discordId" className="block text-sm font-medium text-gray-300 mb-2">
              Discord ID
            </label>
            <input
              id="discordId"
              type="text"
              required
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              className="w-full px-4 py-3 bg-darker border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
              placeholder="123456789012345678"
            />
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading
              ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...')
              : (language === 'ar' ? 'تسجيل الدخول' : 'Login')}
          </button>
        </form>

        <button
          onClick={() => switchLanguage(language === 'ar' ? 'en' : 'ar')}
          className="w-full mt-4 px-4 py-2 text-sm bg-dark rounded-lg hover:bg-gray-700 transition-colors"
        >
          {language === 'ar' ? 'English' : 'عربي'}
        </button>
      </div>
    </div>
  );
}
