import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { inputValidators } from '../utils/validation';

interface NutritionEntry {
  id: number;
  date: string;
  mealType: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
}

const Nutrition: React.FC = () => {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [form, setForm] = useState({ mealType: '', calories: '', protein: '', carbs: '', fat: '', notes: '' });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const response = await api.get('/nutrition');
    setEntries(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/nutrition', {
      mealType: form.mealType,
      calories: form.calories ? parseInt(form.calories) : undefined,
      protein: form.protein ? parseInt(form.protein) : undefined,
      carbs: form.carbs ? parseInt(form.carbs) : undefined,
      fat: form.fat ? parseInt(form.fat) : undefined,
      notes: form.notes || undefined
    });
    setForm({ mealType: '', calories: '', protein: '', carbs: '', fat: '', notes: '' });
    fetchEntries();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 py-10 page-animate">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-[32px] bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-xl p-4 sm:p-6 md:p-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Nutrition</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-extrabold text-amber-900">Fuel your body with smarter meals</h1>
            <p className="mt-2 sm:mt-3 text-slate-600">Log meals, monitor macros, and keep your nutrition on track.</p>
          </div>

          <div className="grid gap-6 sm:gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-amber-100 bg-amber-50/80 p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-amber-900 mb-4">Add Nutrition Entry</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Meal type</label>
                    <input
                      type="text"
                      placeholder="Breakfast"
                      value={form.mealType}
                      onChange={(e) => setForm({ ...form, mealType: inputValidators.handleAlphanumericInput(form.mealType, e.target.value) })}
                      required
                      className="w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Calories</label>
                    <input
                      type="number"
                      placeholder="kcal"
                      value={form.calories}
                      onChange={(e) => setForm({ ...form, calories: inputValidators.handleNumericInput(form.calories, e.target.value) })}
                      className="w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Protein (g)</label>
                    <input
                      type="number"
                      placeholder="g"
                      value={form.protein}
                      onChange={(e) => setForm({ ...form, protein: inputValidators.handleNumericInput(form.protein, e.target.value) })}
                      className="w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Carbs (g)</label>
                    <input
                      type="number"
                      placeholder="g"
                      value={form.carbs}
                      onChange={(e) => setForm({ ...form, carbs: inputValidators.handleNumericInput(form.carbs, e.target.value) })}
                      className="w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fat (g)</label>
                    <input
                      type="number"
                      placeholder="g"
                      value={form.fat}
                      onChange={(e) => setForm({ ...form, fat: inputValidators.handleNumericInput(form.fat, e.target.value) })}
                      className="w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                  <textarea
                    placeholder="What did you eat?"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: inputValidators.handleTextInput(form.notes, e.target.value) })}
                    className="w-full min-h-[120px] rounded-3xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-slate-900"
                  />
                </div>

                <button type="submit" className="w-full rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-3 shadow-lg transition hover:scale-[1.01]">
                  Add Meal
                </button>
              </form>
            </div>

            <div className="rounded-[28px] border border-amber-100 bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-amber-900 mb-4">Nutrition log</h2>
              <div className="space-y-4">
                {entries.length === 0 ? (
                  <p className="text-slate-500">No nutrition entries yet. Add one above!</p>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="rounded-3xl border border-amber-100 bg-amber-50/70 p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold mb-1">{entry.mealType}</span>
                          <p className="text-sm text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                        </div>
                        {entry.calories && <span className="text-lg font-bold text-amber-700">{entry.calories} kcal</span>}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <span className="font-semibold text-amber-700">🥩</span>
                          <p>{entry.protein ?? '—'}g protein</p>
                        </div>
                        <div className="text-center">
                          <span className="font-semibold text-amber-700">🍞</span>
                          <p>{entry.carbs ?? '—'}g carbs</p>
                        </div>
                        <div className="text-center">
                          <span className="font-semibold text-amber-700">🧈</span>
                          <p>{entry.fat ?? '—'}g fat</p>
                        </div>
                      </div>

                      {entry.notes && <p className="text-amber-600 text-sm italic mt-2">📝 {entry.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
