import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

interface ChartData {
  date: string;
  value: number;
}

interface StatsChartsProps {
  darkMode?: boolean;
}

const StatsCharts: React.FC<StatsChartsProps> = ({ darkMode = false }) => {
  const [fitnessData, setFitnessData] = useState<ChartData[]>([]);
  const [sleepData, setSleepData] = useState<ChartData[]>([]);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [meditationData, setMeditationData] = useState<ChartData[]>([]);
  const [hydrationData, setHydrationData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const [fitness, sleep, nutrition, meditation, hydration] = await Promise.all([api.get('/fitness'), api.get('/sleep'), api.get('/nutrition'), api.get('/meditation'), api.get('/hydration')]);

      // Procesar datos de fitness
      const fitnessGrouped = groupByDate(fitness.data);
      setFitnessData(fitnessGrouped);

      // Procesar datos de sueño
      const sleepGrouped = groupByDate(sleep.data, 'durationMinutes');
      setSleepData(sleepGrouped);

      // Procesar datos de nutrición (macronutrientes)
      const nutritionGrouped = groupNutrition(nutrition.data);
      setNutritionData(nutritionGrouped);

      // Procesar datos de meditación
      const meditationGrouped = groupByDate(meditation.data, 'durationMinutes');
      setMeditationData(meditationGrouped);

      // Procesar datos de hidración
      const hydrationGrouped = groupByDate(hydration.data, 'amount');
      setHydrationData(hydrationGrouped);
    } catch (error) {
      console.log('Error fetching chart data');
    }
  };

  const groupByDate = (data: any[], valueField = 'weight') => {
    const grouped = data.reduce((acc: any, item: any) => {
      const date = new Date(item.date).toLocaleDateString();
      const existing = acc.find((d: any) => d.date === date);
      if (existing) {
        existing.value += item[valueField];
      } else {
        acc.push({ date, value: item[valueField] });
      }
      return acc;
    }, []);
    return grouped.slice(-7); // últimos 7 días
  };

  const groupNutrition = (data: any[]) => {
    const last7 = data.slice(-7);
    return last7.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString(),
      protein: item.protein || 0,
      carbs: item.carbs || 0,
      fat: item.fat || 0
    }));
  };

  const chartColor = darkMode ? '#e5e7eb' : '#1f2937';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  return (
    <div className="space-y-8">
      {/* Gráfico de Fitness */}
      {fitnessData.length > 0 && (
        <div className="rounded-[28px] border border-cyan-200 bg-cyan-50/80 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-cyan-900 mb-4">📊 Progreso de Fitness (últimos 7 días)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fitnessData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={chartColor} />
              <YAxis stroke={chartColor} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} name="Ejercicios" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Sueño */}
      {sleepData.length > 0 && (
        <div className="rounded-[28px] border border-violet-200 bg-violet-50/80 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-violet-900 mb-4">😴 Horas de Sueño (últimos 7 días)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={chartColor} />
              <YAxis stroke={chartColor} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="value" fill="#7c3aed" name="Minutos" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Nutrición */}
      {nutritionData.length > 0 && (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-amber-900 mb-4">🥗 Distribución de Macronutrientes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={chartColor} />
              <YAxis stroke={chartColor} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="protein" fill="#ef4444" name="Proteína (g)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="carbs" fill="#f59e0b" name="Carbohidratos (g)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="fat" fill="#8b5cf6" name="Grasa (g)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Meditación */}
      {meditationData.length > 0 && (
        <div className="rounded-[28px] border border-teal-200 bg-teal-50/80 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-teal-900 mb-4">🧘 Minutos de Meditación</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={meditationData}>
              <defs>
                <linearGradient id="colorMeditation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={chartColor} />
              <YAxis stroke={chartColor} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="value" stroke="#14b8a6" fillOpacity={1} fill="url(#colorMeditation)" name="Minutos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Hidración */}
      {hydrationData.length > 0 && (
        <div className="rounded-[28px] border border-sky-200 bg-sky-50/80 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-sky-900 mb-4">💧 Ingesta de Agua (ml)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hydrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={chartColor} />
              <YAxis stroke={chartColor} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0284c7" strokeWidth={2} name="Agua (ml)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatsCharts;
