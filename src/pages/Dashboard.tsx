import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 py-10 page-animate">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-[32px] bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">{t('dashboard.title')}</p>
              <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900">{t('dashboard.snapshotTitle')}</h1>
              <p className="mt-3 text-slate-600">{t('dashboard.subtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={logout} className="rounded-2xl bg-cyan-500 px-5 py-2 text-white font-semibold shadow-lg transition hover:bg-cyan-600">
                {t('dashboard.signOut')}
              </button>
              <Link to="/health" className="rounded-2xl bg-slate-900 px-5 py-2 text-white font-semibold shadow-lg transition hover:bg-slate-800">
                {t('dashboard.viewHealth')}
              </Link>
            </div>
          </div>

          <div className="mt-6 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { title: t('dashboard.cardHealthTitle'), desc: t('dashboard.cardHealthDesc'), link: '/health', color: 'from-green-500 to-emerald-500', emoji: '❤️' },
              { title: t('dashboard.cardFitnessTitle'), desc: t('dashboard.cardFitnessDesc'), link: '/fitness', color: 'from-cyan-500 to-violet-500', emoji: '💪' },
              { title: t('dashboard.cardNutritionTitle'), desc: t('dashboard.cardNutritionDesc'), link: '/nutrition', color: 'from-amber-400 to-yellow-500', emoji: '🥗' },
              { title: t('dashboard.cardSleepTitle'), desc: t('dashboard.cardSleepDesc'), link: '/sleep', color: 'from-purple-500 to-violet-500', emoji: '😴' },
              { title: t('dashboard.cardMentalTitle'), desc: t('dashboard.cardMentalDesc'), link: '/mental-health', color: 'from-pink-500 to-fuchsia-500', emoji: '🧠' },
              { title: t('dashboard.cardHydrationTitle'), desc: t('dashboard.cardHydrationDesc'), link: '/hydration', color: 'from-cyan-500 to-sky-500', emoji: '💧' }
            ].map((card) => (
              <Link key={card.title} to={card.link} className="group rounded-[28px] border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className={`inline-flex items-center justify-center rounded-3xl bg-gradient-to-r ${card.color} p-3 sm:p-4 text-xl text-white shadow-lg`}>{card.emoji}</div>
                <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-semibold text-slate-900 group-hover:text-slate-800">{card.title}</h2>
                <p className="mt-3 text-slate-600">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
