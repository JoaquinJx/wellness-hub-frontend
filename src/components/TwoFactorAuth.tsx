import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

interface TwoFactorAuthProps {
  onSuccess: () => void;
  email: string;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ onSuccess, email }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-2fa', { email, code });
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        onSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error && (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || t('twoFactor.invalidCode'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex items-center justify-center py-10">
      <div className="rounded-[32px] bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">🔐 {t('twoFactor.title')}</h1>
          <p className="text-slate-600">{t('twoFactor.sentCode', { email })}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="2fa-code" className="block text-sm font-semibold text-slate-700 mb-2">
              {t('twoFactor.verificationCode')}
            </label>
            <input
              id="2fa-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder={t('twoFactor.codePlaceholder')}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 outline-none transition-colors text-2xl tracking-widest text-center"
              aria-label={t('twoFactor.verificationCode')}
              aria-required="true"
              aria-invalid={!!error}
            />
          </div>

          {error && (
            <div role="alert" className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 shadow-lg transition hover:scale-[1.01]"
            aria-busy={loading}
          >
            {loading ? t('twoFactor.verifying') : t('twoFactor.verify')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <p>{t('twoFactor.noCodeReceived')}</p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
