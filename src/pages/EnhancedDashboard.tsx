import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/appStore';
import ThemeToggle from '../components/ThemeToggle';
import { useReminders } from '../components/NotificationProvider';

const StatsCharts = lazy(() => import('../components/StatsCharts'));
const AchievementsPanel = lazy(() => import('../components/AchievementsPanel'));
const PersonalizedRecommendations = lazy(() => import('../components/PersonalizedRecommendations'));
const ExportComponent = lazy(() => import('../components/ExportComponent'));

const EnhancedDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { stats } = useAppStore();
  useReminders(); // Activar recordatorios

  const bgClass = stats.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-slate-100';
  const textClass = stats.darkMode ? 'text-white' : 'text-slate-900';
  const secondaryTextClass = stats.darkMode ? 'text-gray-400' : 'text-slate-600';
  const cardBgClass = stats.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200';

  return (
    <div className={`min-h-screen ${bgClass} py-10 page-animate`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className={`rounded-[32px] ${cardBgClass} border shadow-2xl backdrop-blur-xl p-8 mb-8`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${stats.darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{t('dashboard.advancedHeader')}</p>
              <h1 className={`mt-3 text-4xl font-extrabold ${textClass}`}>{t('dashboard.title')}</h1>
              <p className={`mt-3 ${secondaryTextClass}`}>{t('dashboard.subtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <ThemeToggle />
              <button onClick={logout} className="rounded-2xl bg-cyan-500 px-5 py-2 text-white font-semibold shadow-lg transition hover:bg-cyan-600">
                {t('common.logout')}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: t('dashboard.workouts'), value: stats.totalWorkouts, icon: '💪', color: 'from-cyan-500 to-violet-500' },
            { title: t('dashboard.meditation'), value: `${stats.totalMeditationMinutes}m`, icon: '🧘', color: 'from-teal-500 to-emerald-500' },
            { title: t('dashboard.water'), value: `${stats.totalWaterIntake}ml`, icon: '💧', color: 'from-sky-500 to-blue-500' },
            { title: t('dashboard.streak'), value: `${stats.currentStreak}d`, icon: '🔥', color: 'from-orange-500 to-red-500' }
          ].map((stat) => (
            <div key={stat.title} className={`rounded-[24px] ${cardBgClass} border shadow-sm p-6`}>
              <div className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${stat.color} p-3 text-2xl text-white shadow-lg`}>{stat.icon}</div>
              <h3 className={`mt-4 text-3xl font-bold ${textClass}`}>{stat.value}</h3>
              <p className={`mt-1 text-sm ${secondaryTextClass}`}>{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Export Section */}
        <div className={`rounded-[28px] ${cardBgClass} border shadow-sm p-6 mb-8`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className={`text-xl font-semibold ${textClass}`}>📥 {t('dashboard.exportData')}</h3>
              <p className={`mt-2 text-sm ${secondaryTextClass}`}>{t('dashboard.exportDesc')}</p>
            </div>
            <Suspense fallback={null}>
              <ExportComponent />
            </Suspense>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-64 rounded-2xl bg-white/5 animate-pulse" />}>
            <StatsCharts darkMode={stats.darkMode} />
          </Suspense>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-32 rounded-2xl bg-white/5 animate-pulse" />}>
            <PersonalizedRecommendations />
          </Suspense>
        </div>

        {/* Achievements */}
        <div>
          <Suspense fallback={<div className="h-32 rounded-2xl bg-white/5 animate-pulse" />}>
            <AchievementsPanel />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
