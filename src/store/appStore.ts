import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  progress: number;
  target: number;
  type: 'streak' | 'milestone' | 'challenge';
}

export interface UserStats {
  totalWorkouts: number;
  totalMeditationMinutes: number;
  totalWaterIntake: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  darkMode: boolean;
  notificationsEnabled: boolean;
}

interface AppStore {
  stats: UserStats;
  setDarkMode: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  addWorkout: () => void;
  addMeditationMinutes: (minutes: number) => void;
  addWaterIntake: (ml: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  resetStats: () => void;
}

const initialStats: UserStats = {
  totalWorkouts: 0,
  totalMeditationMinutes: 0,
  totalWaterIntake: 0,
  currentStreak: 0,
  longestStreak: 0,
  achievements: [
    {
      id: 'first-workout',
      name: 'First Steps',
      description: 'Complete your first workout',
      icon: '🏃',
      unlockedAt: null,
      progress: 0,
      target: 1,
      type: 'milestone'
    },
    {
      id: 'week-streak',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '⚡',
      unlockedAt: null,
      progress: 0,
      target: 7,
      type: 'streak'
    },
    {
      id: 'month-streak',
      name: 'Month Master',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      unlockedAt: null,
      progress: 0,
      target: 30,
      type: 'streak'
    },
    {
      id: 'meditation-master',
      name: 'Mindfulness Master',
      description: 'Complete 100 minutes of meditation',
      icon: '🧘',
      unlockedAt: null,
      progress: 0,
      target: 100,
      type: 'milestone'
    },
    {
      id: 'hydration-hero',
      name: 'Hydration Hero',
      description: 'Drink 2L of water for 7 days straight',
      icon: '💧',
      unlockedAt: null,
      progress: 0,
      target: 7,
      type: 'challenge'
    },
    {
      id: 'fitness-fanatic',
      name: 'Fitness Fanatic',
      description: 'Complete 50 workouts',
      icon: '💪',
      unlockedAt: null,
      progress: 0,
      target: 50,
      type: 'milestone'
    }
  ],
  darkMode: false,
  notificationsEnabled: true
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      stats: initialStats,

      setDarkMode: (enabled: boolean) =>
        set((state) => ({
          stats: { ...state.stats, darkMode: enabled }
        })),

      setNotificationsEnabled: (enabled: boolean) =>
        set((state) => ({
          stats: { ...state.stats, notificationsEnabled: enabled }
        })),

      addWorkout: () =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalWorkouts: state.stats.totalWorkouts + 1,
            currentStreak: state.stats.currentStreak + 1,
            longestStreak: Math.max(state.stats.currentStreak + 1, state.stats.longestStreak)
          }
        })),

      addMeditationMinutes: (minutes: number) =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalMeditationMinutes: state.stats.totalMeditationMinutes + minutes
          }
        })),

      addWaterIntake: (ml: number) =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalWaterIntake: state.stats.totalWaterIntake + ml
          }
        })),

      unlockAchievement: (achievementId: string) =>
        set((state) => ({
          stats: {
            ...state.stats,
            achievements: state.stats.achievements.map((ach) => (ach.id === achievementId ? { ...ach, unlockedAt: new Date().toISOString() } : ach))
          }
        })),

      updateAchievementProgress: (achievementId: string, progress: number) =>
        set((state) => {
          const updatedAchievements = state.stats.achievements.map((ach) => (ach.id === achievementId ? { ...ach, progress } : ach));

          const achievement = updatedAchievements.find((a) => a.id === achievementId);
          if (achievement && progress >= achievement.target && !achievement.unlockedAt) {
            achievement.unlockedAt = new Date().toISOString();
          }

          return {
            stats: {
              ...state.stats,
              achievements: updatedAchievements
            }
          };
        }),

      resetStats: () =>
        set({
          stats: initialStats
        })
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        stats: state.stats
      })
    }
  )
);
