import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex gap-2 items-center">
      <button onClick={() => changeLanguage('es')} className={`px-3 py-1 rounded-lg font-semibold text-sm transition-all ${i18n.language === 'es' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} title="Cambiar a Español">
        🇪🇸 ES
      </button>
      <button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded-lg font-semibold text-sm transition-all ${i18n.language === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} title="Change to English">
        🇺🇸 EN
      </button>
    </div>
  );
};

export default LanguageSelector;
