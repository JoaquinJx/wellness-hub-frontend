import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { showNotification } from './NotificationProvider';

const TwoFactorSettings: React.FC = () => {
  const { t } = useTranslation();
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      if (twoFAEnabled) {
        await api.post('/auth/disable-2fa');
        showNotification(t('twoFactor.disableSuccess'), 'success');
        setTwoFAEnabled(false);
      } else {
        await api.post('/auth/enable-2fa');
        showNotification(t('twoFactor.enableSuccess'), 'info');
        setTwoFAEnabled(true);
      }
    } catch (error: unknown) {
      const message = error instanceof Error && (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      showNotification(message || t('twoFactor.toggleError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-purple-200 bg-purple-50/80 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-purple-900">🔐 {t('twoFactor.title')}</h3>
          <p className="mt-2 text-sm text-purple-700">
            {twoFAEnabled ? t('twoFactor.protectedDesc') : t('twoFactor.enableDesc')}
          </p>
        </div>
        <button
          onClick={handleToggle2FA}
          disabled={loading}
          aria-pressed={twoFAEnabled}
          aria-busy={loading}
          className={`px-6 py-2 rounded-2xl font-semibold text-white transition-all ${
            twoFAEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } disabled:bg-gray-400`}
        >
          {loading ? t('twoFactor.processing') : twoFAEnabled ? t('twoFactor.disable') : t('twoFactor.enable')}
        </button>
      </div>
    </div>
  );
};

export default TwoFactorSettings;
