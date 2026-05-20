import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/appStore';
import TwoFactorSettings from '../components/TwoFactorSettings';
import LanguageSelector from '../components/LanguageSelector';
import api from '../services/api';
import { showNotification } from '../components/NotificationProvider';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { stats, setNotificationsEnabled, setDarkMode } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      showNotification(t('settings.passwordMismatch'), 'error');
      return;
    }

    if (passwords.new.length < 8) {
      showNotification(t('settings.passwordLengthError'), 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      showNotification(t('notifications.passwordChanged'), 'success');
      setShowPasswordForm(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      showNotification(error.response?.data?.message || t('notifications.passwordChangeError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm(t('settings.deleteConfirmation'))) {
      try {
        await api.post('/auth/delete-account');
        showNotification(t('notifications.accountDeleted'), 'success');
        logout();
      } catch (error: any) {
        showNotification(error.response?.data?.message || 'Error al eliminar cuenta', 'error');
      }
    }
  };

  return (
    <div className={`min-h-screen ${stats.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-slate-100'} py-10 page-animate`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`rounded-[32px] ${stats.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} border shadow-2xl backdrop-blur-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className={`text-2xl sm:text-4xl font-bold ${stats.darkMode ? 'text-white' : 'text-slate-900'}`}>⚙️ {t('settings.title')}</h1>
              <p className={`mt-3 ${stats.darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{t('settings.subtitle')}</p>
            </div>
            <LanguageSelector />
          </div>
        </div>

        {/* Perfil */}
        <div className={`rounded-[28px] ${stats.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} border shadow-sm p-4 sm:p-6 mb-6 sm:mb-8`}>
          <h3 className={`text-2xl font-semibold ${stats.darkMode ? 'text-white' : 'text-slate-900'}`}>👤 Perfil</h3>
          <div className="mt-6 space-y-4">
            <div>
              <label className={`block text-sm font-semibold ${stats.darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{t('settings.email')}</label>
              <p className={`mt-2 px-4 py-2 rounded-lg ${stats.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{user?.email}</p>
            </div>
            <div>
              <label className={`block text-sm font-semibold ${stats.darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{t('settings.name')}</label>
              <p className={`mt-2 px-4 py-2 rounded-lg ${stats.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{user?.name || 'No especificado'}</p>
            </div>
          </div>
        </div>

        {/* Cambiar Contraseña */}
        <div className={`rounded-[28px] ${stats.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} border shadow-sm p-4 sm:p-6 mb-6 sm:mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-2xl font-semibold ${stats.darkMode ? 'text-white' : 'text-slate-900'}`}>🔑 {t('settings.changePassword')}</h3>
              <p className={`mt-1 text-sm ${stats.darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{t('settings.changePassword')}</p>
            </div>
            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="px-6 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition">
              {showPasswordForm ? t('common.cancel') : t('settings.changePassword')}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              <div>
                <label className={`block text-sm font-semibold ${stats.darkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>{t('settings.currentPassword')}</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border-2 ${stats.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-indigo-200'} focus:border-indigo-500 outline-none transition`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${stats.darkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>{t('settings.newPassword')}</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border-2 ${stats.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-indigo-200'} focus:border-indigo-500 outline-none transition`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${stats.darkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>{t('settings.confirmPassword')}</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border-2 ${stats.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-indigo-200'} focus:border-indigo-500 outline-none transition`}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full px-6 py-2 rounded-2xl bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold transition">
                {loading ? t('settings.processing') : t('settings.changePassword')}
              </button>
            </form>
          )}
        </div>

        {/* Seguridad */}
        <div className="mb-8">
          <TwoFactorSettings />
        </div>

        {/* Preferencias */}
        <div className={`rounded-[28px] ${stats.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} border shadow-sm p-4 sm:p-6 mb-6 sm:mb-8`}>
          <h3 className={`text-2xl font-semibold ${stats.darkMode ? 'text-white' : 'text-slate-900'} mb-6`}>🎨 Preferencias</h3>

          <div className="space-y-4">
            {/* Tema Oscuro */}
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: stats.darkMode ? '#374151' : '#f3f4f6' }}>
              <div>
                <h4 className={`font-semibold ${stats.darkMode ? 'text-white' : 'text-slate-900'}`}>🌙 {t('settings.darkMode')}</h4>
                <p className={`text-sm ${stats.darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{t('settings.darkModeDesc')}</p>
              </div>
              <button onClick={() => setDarkMode(!stats.darkMode)} className={`px-4 py-2 rounded-lg font-semibold text-white transition ${stats.darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                {stats.darkMode ? t('settings.lightMode') : t('settings.darkModeShort')}
              </button>
            </div>

            {/* Notificaciones */}
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: stats.darkMode ? '#374151' : '#f3f4f6' }}>
              <div>
                <h4 className={`font-semibold ${stats.darkMode ? 'text-white' : 'text-slate-900'}`}>🔔 {t('settings.notifications')}</h4>
                <p className={`text-sm ${stats.darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{t('settings.notificationsDesc')}</p>
              </div>
              <button onClick={() => setNotificationsEnabled(!stats.notificationsEnabled)} className={`px-4 py-2 rounded-lg font-semibold text-white transition ${stats.notificationsEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {stats.notificationsEnabled ? t('settings.enabled') : t('settings.disabled')}
              </button>
            </div>
          </div>
        </div>

        {/* Zona de Peligro */}
        <div className={`rounded-[28px] border-2 ${stats.darkMode ? 'bg-gray-800 border-red-700' : 'bg-red-50 border-red-200'} shadow-sm p-6`}>
          <h3 className="text-2xl font-semibold text-red-600 mb-4">⚠️ {t('settings.dangerZone')}</h3>
          <p className={`text-sm ${stats.darkMode ? 'text-gray-400' : 'text-slate-600'} mb-4`}>{t('settings.deleteAccountDesc')}</p>

          <button onClick={handleDeleteAccount} className="w-full px-6 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition">
            🗑️ {t('settings.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
