import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';

const AchievementsPanel: React.FC = () => {
  const { stats } = useAppStore();

  const unlockedCount = useMemo(() => stats.achievements.filter((a) => a.unlockedAt).length, [stats.achievements]);

  return (
    <div className="rounded-[28px] border border-purple-200 bg-purple-50/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-purple-900">🏆 Logros</h3>
        <div className="text-right">
          <p className="text-sm text-purple-600">Desbloqueados</p>
          <p className="text-2xl font-bold text-purple-700">
            {unlockedCount}/{stats.achievements.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.achievements.map((achievement) => (
          <div key={achievement.id} className={`rounded-2xl p-4 transition-all duration-300 ${achievement.unlockedAt ? 'bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-400 shadow-md' : 'bg-white border-2 border-gray-200 opacity-70'}`}>
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <h4 className="font-bold text-gray-900 mb-1">{achievement.name}</h4>
            <p className="text-xs text-gray-600 mb-3">{achievement.description}</p>

            {!achievement.unlockedAt ? (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {achievement.progress}/{achievement.target}
                </p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-yellow-600">✨ Desbloqueado</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPanel;
