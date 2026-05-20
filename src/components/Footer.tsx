import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const modules = [
    { name: t('navigation.health'), path: '/health', icon: '❤️' },
    { name: t('navigation.fitness'), path: '/fitness', icon: '💪' },
    { name: t('navigation.nutrition'), path: '/nutrition', icon: '🥗' },
    { name: t('navigation.sleep'), path: '/sleep', icon: '😴' },
    { name: t('navigation.mental'), path: '/mental-health', icon: '🧠' },
    { name: t('navigation.hydration'), path: '/hydration', icon: '💧' },
    { name: t('navigation.goals'), path: '/goals', icon: '🎯' },
    { name: t('navigation.meditation'), path: '/meditation', icon: '🧘' }
  ];

  return (
    <footer className="bg-gradient-to-r from-orange-800/95 via-cyan-800/95 to-green-800/95 backdrop-blur-xl border-t border-orange-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-12">
          {/* Brand section */}
          <div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-cyan-300 bg-clip-text text-transparent mb-4 block">
              ✨ Wellness Hub
            </Link>
            <p className="text-yellow-100 text-sm leading-relaxed">{t('footer.wellnessBlurb')}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-yellow-200 font-bold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {modules.slice(0, 4).map((mod) => (
                <Link key={mod.path} to={mod.path} className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  {mod.icon} {mod.name}
                </Link>
              ))}
            </div>
          </div>

          {/* More links */}
          <div>
            <h3 className="text-yellow-200 font-bold text-lg mb-4">{t('footer.moreFeatures')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {modules.slice(4, 8).map((mod) => (
                <Link key={mod.path} to={mod.path} className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  {mod.icon} {mod.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-orange-700 pt-8">
          {/* Stats/Info row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <p className="text-yellow-300 font-bold text-xl">{t('footer.modulesCount')}</p>
              <p className="text-yellow-100 text-sm">{t('footer.modulesLabel')}</p>
            </div>
            <div>
              <p className="text-orange-300 font-bold text-xl">100%</p>
              <p className="text-yellow-100 text-sm">{t('footer.healthFocused')}</p>
            </div>
            <div>
              <p className="text-cyan-300 font-bold text-xl">24/7</p>
              <p className="text-yellow-100 text-sm">{t('footer.available')}</p>
            </div>
            <div>
              <p className="text-green-300 font-bold text-xl">Real</p>
              <p className="text-yellow-100 text-sm">{t('footer.resultsTracking')}</p>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="border-t border-orange-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-yellow-200 text-sm">{t('footer.copyright', { year: currentYear })}</p>
            <div className="flex gap-6">
              <a href="#" className="text-yellow-200 hover:text-yellow-300 text-sm transition-colors">
                {t('footer.privacyPolicy')}
              </a>
              <a href="#" className="text-yellow-200 hover:text-yellow-300 text-sm transition-colors">
                {t('footer.termsOfService')}
              </a>
              <a href="#" className="text-yellow-200 hover:text-yellow-300 text-sm transition-colors">
                {t('footer.contact')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
