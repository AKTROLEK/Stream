import { useLanguage } from '../lib/language';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { t, language, switchLanguage } = useLanguage();
  const router = useRouter();

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('analytics'), href: '/analytics' },
    { name: t('credits'), href: '/credits' },
    { name: t('rewards'), href: '/rewards' },
    { name: t('tickets'), href: '/tickets' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-darkest">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 right-0 w-64 bg-darker border-l border-gray-700">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-700">
            <h1 className="text-xl font-bold text-primary">Stream Manager</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  router.pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-dark'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <button
              onClick={() => switchLanguage(language === 'ar' ? 'en' : 'ar')}
              className="w-full px-4 py-2 text-sm bg-dark rounded-lg hover:bg-gray-700 transition-colors"
            >
              {language === 'ar' ? 'English' : 'عربي'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm bg-danger rounded-lg hover:bg-red-600 transition-colors"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="mr-64 p-8">
        {children}
      </main>
    </div>
  );
}
