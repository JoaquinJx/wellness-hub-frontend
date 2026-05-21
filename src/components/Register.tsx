import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { register } = useAuth();

  const passwordOk = password.length === 0 || password.length >= 8;
  const passwordStrength = password.length === 0
    ? null
    : password.length < 8
    ? 'weak'
    : password.length < 12
    ? 'medium'
    : 'strong';

  const resolveError = (err: any): string => {
    const status  = err?.response?.status;
    const message = err?.response?.data?.message;

    if (status === 409) return t('register.errorEmailTaken');
    if (status === 400) {
      if (Array.isArray(message)) return message.join(' · ');
      if (typeof message === 'string') return message;
      return t('register.errorValidation');
    }
    if (status === 429) return t('register.errorTooMany');
    if (status >= 500)  return t('register.errorServer');
    if (message)        return message;
    return t('register.failed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError(t('register.errorPasswordShort'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err: any) {
      setError(resolveError(err));
    } finally {
      setLoading(false);
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
          {/* Name */}
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

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('register.password')}</label>
            <input
              type="password"
              placeholder={t('register.passwordPlaceholder')}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
              className={`w-full rounded-3xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 ${
                !passwordOk
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-pink-500 focus:ring-pink-100'
              }`}
            />

            {/* Password requirements hint */}
            <div className="mt-2 space-y-1">
              <p className={`text-xs flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : 'text-slate-400'}`}>
                <span>{password.length >= 8 ? '✓' : '○'}</span>
                {t('register.reqMinChars')}
              </p>
            </div>

            {/* Strength bar */}
            {passwordStrength && (
              <div className="mt-2">
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength === 'weak'   ? 'w-1/3 bg-red-400' :
                    passwordStrength === 'medium' ? 'w-2/3 bg-yellow-400' :
                                                    'w-full bg-green-500'
                  }`} />
                </div>
                <p className={`text-xs mt-1 ${
                  passwordStrength === 'weak'   ? 'text-red-500' :
                  passwordStrength === 'medium' ? 'text-yellow-600' :
                                                  'text-green-600'
                }`}>
                  {t(`register.strength.${passwordStrength}`)}
                </p>
              </div>
            )}
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
            disabled={loading || !passwordOk}
            className="w-full rounded-3xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-5 py-3 text-white text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('common.loading') : t('register.submit')}
          </button>
        </form>

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
