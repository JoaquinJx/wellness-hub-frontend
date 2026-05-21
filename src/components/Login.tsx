import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const resolveError = (err: any): string => {
    const status  = err?.response?.status;
    const message = err?.response?.data?.message;

    if (status === 401) return t('login.errorCredentials');
    if (status === 429) return t('login.errorTooMany');
    if (status === 405) return t('login.errorServer');
    if (status >= 500)  return t('login.errorServer');
    if (message)        return typeof message === 'string' ? message : t('login.invalidCredentials');
    return t('login.invalidCredentials');
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(resolveError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12 page-animate">
      <div className="w-full max-w-md rounded-[32px] bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-xl p-5 sm:p-8">
        <div className="mb-6 sm:mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 mb-3 sm:mb-4">{t('login.welcomeBack')}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('login.loginTo', { app: t('common.appName') })}</h1>
          <p className="mt-3 text-sm text-slate-500">{t('login.loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('login.email')}</label>
            <input
              type="email"
              placeholder={t('login.emailPlaceholder')}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('login.password')}</label>
            <input
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <p className="mt-1.5 text-xs text-slate-400">{t('login.passwordHint')}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-white text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('common.loading') : t('login.submit')}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          {t('login.registerPrompt')}{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            {t('login.registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
