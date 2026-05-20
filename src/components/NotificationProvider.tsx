import React, { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useAppStore } from '../store/appStore';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
          },
          success: {
            style: {
              background: '#10b981'
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981'
            }
          },
          error: {
            style: {
              background: '#ef4444'
            }
          }
        }}
      />
      {children}
    </>
  );
};

export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (type === 'success') {
    toast.success(message);
  } else if (type === 'error') {
    toast.error(message);
  } else {
    toast(message);
  }
};

// Hook para recordatorios automáticos
export const useReminders = () => {
  const { stats } = useAppStore();

  useEffect(() => {
    if (!stats.notificationsEnabled) return;

    // Recordatorio de agua cada 2 horas
    const waterInterval = setInterval(
      () => {
        showNotification('💧 ¡Recuerda beber agua! Mantente hidratado.', 'info');
      },
      2 * 60 * 60 * 1000
    );

    // Recordatorio de ejercicio a las 7 AM
    const exerciseReminder = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 7 && now.getMinutes() === 0) {
        showNotification('⚡ ¡Es hora de ejercitarse! Inicia tu sesión de entrenamiento.', 'info');
      }
    }, 60 * 1000);

    // Recordatorio de meditación a las 8 PM
    const meditationReminder = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 20 && now.getMinutes() === 0) {
        showNotification('🧘 ¡Hora de meditar! Dedica 10 minutos a la tranquilidad.', 'info');
      }
    }, 60 * 1000);

    return () => {
      clearInterval(waterInterval);
      clearInterval(exerciseReminder);
      clearInterval(meditationReminder);
    };
  }, [stats.notificationsEnabled]);
};
