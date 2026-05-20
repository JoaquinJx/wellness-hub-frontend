import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';

interface Recommendation {
  type: 'exercise' | 'nutrition' | 'sleep' | 'hydration' | 'meditation';
  title: string;
  description: string;
  emoji: string;
  urgency: 'high' | 'medium' | 'low';
}

const PersonalizedRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { stats } = useAppStore();

  useEffect(() => {
    generateRecommendations();
  }, [stats]);

  const generateRecommendations = async () => {
    const recs: Recommendation[] = [];

    // Recomendación basada en entrenamientos
    if (stats.totalWorkouts < 3) {
      recs.push({
        type: 'exercise',
        title: 'Aumenta tu actividad física',
        description: 'Has completado menos de 3 entrenamientos. Intenta agregar al menos 30 minutos de ejercicio moderado hoy.',
        emoji: '💪',
        urgency: 'high'
      });
    } else if (stats.totalWorkouts < 10) {
      recs.push({
        type: 'exercise',
        title: 'Mantén tu rutina de ejercicio',
        description: 'Vas bien, pero puedes hacerlo mejor. Considera aumentar la intensidad o duración de tus entrenamientos.',
        emoji: '🏋️',
        urgency: 'medium'
      });
    }

    // Recomendación basada en meditación
    if (stats.totalMeditationMinutes < 50) {
      recs.push({
        type: 'meditation',
        title: 'Practica meditación diaria',
        description: 'La meditación mejora la salud mental. Intenta meditar al menos 10 minutos al día.',
        emoji: '🧘',
        urgency: 'medium'
      });
    }

    // Recomendación basada en hidración
    if (stats.totalWaterIntake < 10000) {
      recs.push({
        type: 'hydration',
        title: 'Bebe más agua',
        description: 'Mantente hidratado. El objetivo es beber 2-3 litros de agua al día. Has consumido menos.',
        emoji: '💧',
        urgency: 'high'
      });
    }

    // Recomendación basada en rachas
    if (stats.currentStreak === 0) {
      recs.push({
        type: 'sleep',
        title: 'Inicia una nueva racha',
        description: 'Hoy es el día perfecto para comenzar. Completa al menos una actividad de bienestar hoy.',
        emoji: '🌟',
        urgency: 'medium'
      });
    } else if (stats.currentStreak > 7) {
      recs.push({
        type: 'meditation',
        title: '¡Racha increíble!',
        description: `¡Felicidades! Llevas ${stats.currentStreak} días de racha. Mantén el impulso.`,
        emoji: '🔥',
        urgency: 'low'
      });
    }

    setRecommendations(recs);
  };

  const urgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'from-red-500 to-orange-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'low':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const urgencyBorder = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'border-red-300';
      case 'medium':
        return 'border-yellow-300';
      case 'low':
        return 'border-green-300';
      default:
        return 'border-blue-300';
    }
  };

  return (
    <div className="rounded-[28px] border border-indigo-200 bg-indigo-50/80 p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-indigo-900 mb-6">💡 Recomendaciones Personalizadas</h3>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-indigo-600">¡Excelente! Estás siguiendo tus metas. No hay recomendaciones en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {recommendations.map((rec, index) => (
            <div key={index} className={`rounded-2xl border-2 ${urgencyBorder(rec.urgency)} bg-white p-4 shadow-sm hover:shadow-md transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${urgencyColor(rec.urgency)} p-3 text-2xl text-white`}>{rec.emoji}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{rec.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{rec.description}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${urgencyColor(rec.urgency)} text-white`}>{rec.urgency === 'high' ? 'Urgente' : rec.urgency === 'medium' ? 'Importante' : 'Sugerencia'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;
