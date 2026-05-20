import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || t('register.failed');
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 py-12 page-animate">
      <div className="w-full max-w-md rounded-[32px] bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-xl p-5 sm:p-8">
        <div className="mb-6 sm:mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-600 mb-3 sm:mb-4">{t('register.startJourney')}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('register.createAccount')}</h1>
          <p className="mt-3 text-sm text-slate-500">{t('register.registerSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('register.name')}</label>
            <input
              type="text"
              placeholder={t('register.placeholderName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('register.email')}</label>
            <input
              type="email"
              placeholder={t('register.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('register.password')}</label>
            <input
              type="password"
              placeholder={t('register.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <button type="submit" className="w-full rounded-3xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-5 py-3 text-white text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-xl">
            {t('register.submit')}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-sm text-fuchsia-600">{error}</p>}

        <p className="mt-8 text-center text-sm text-slate-600">
          {t('register.loginPrompt')}{' '}
          <Link to="/login" className="font-semibold text-pink-600 hover:text-pink-700">
            {t('register.loginHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
