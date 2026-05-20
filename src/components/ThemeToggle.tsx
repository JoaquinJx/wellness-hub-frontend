import React from 'react';
import { useAppStore } from '../store/appStore';

const ThemeToggle: React.FC = () => {
  const { stats, setDarkMode } = useAppStore();

  return (
    <button
      onClick={() => setDarkMode(!stats.darkMode)}
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${stats.darkMode ? 'bg-gray-800 text-yellow-400 shadow-lg' : 'bg-gray-200 text-gray-800 shadow-md'}`}
      title={stats.darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {stats.darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
