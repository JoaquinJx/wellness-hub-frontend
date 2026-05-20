import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { inputValidators } from '../utils/validation';

interface SleepEntry {
  id: number;
  date: string;
  durationMinutes: number;
  quality?: string;
  notes?: string;
}

const Sleep: React.FC = () => {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [form, setForm] = useState({ durationMinutes: '', quality: '', notes: '' });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const response = await api.get('/sleep');
    setEntries(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/sleep', {
      durationMinutes: parseInt(form.durationMinutes),
      quality: form.quality || undefined,
      notes: form.notes || undefined
    });
    setForm({ durationMinutes: '', quality: '', notes: '' });
    fetchEntries();
  };

  const getQualityColor = (quality?: string) => {
    switch (quality?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 py-10 page-animate">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-[32px] bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-xl p-4 sm:p-6 md:p-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-600">Sleep</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-extrabold text-violet-900">Rest better, feel better</h1>
            <p className="mt-2 sm:mt-3 text-slate-600">Log your sleep sessions and keep track of recovery trends.</p>
          </div>

          <div className="grid gap-6 sm:gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-violet-100 bg-violet-50/80 p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-violet-900 mb-4">Log Sleep Session</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="480"
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: inputValidators.handleNumericInput(form.durationMinutes, e.target.value) })}
                    required
                    className="w-full rounded-3xl border border-violet-200 bg-white px-4 py-3 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sleep quality</label>
                  <select value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} className="w-full rounded-3xl border border-violet-200 bg-white px-4 py-3 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                    <option value="">Select quality</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                  <textarea
                    placeholder="How did you sleep?"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: inputValidators.handleTextInput(form.notes, e.target.value) })}
                    className="w-full min-h-[120px] rounded-3xl border border-violet-200 bg-white px-4 py-3 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-slate-900"
                  />
                </div>

                <button type="submit" className="w-full rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold py-3 shadow-lg transition hover:scale-[1.01]">
                  Log Sleep Session
                </button>
              </form>
            </div>

            <div className="rounded-[28px] border border-violet-100 bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-violet-900 mb-4">Sleep History</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {entries.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No sleep entries yet. Add one above!</p>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="rounded-3xl border border-violet-100 bg-violet-50/70 p-4 shadow-sm transition hover:shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-violet-700">
                              {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
                            </span>
                            {entry.quality && <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getQualityColor(entry.quality)}`}>{entry.quality}</span>}
                          </div>
                        </div>
                        <div className="text-2xl">🌙</div>
                      </div>
                      {entry.notes && <p className="text-violet-600 text-sm italic mt-2">📝 {entry.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-violet-900 mb-4 sm:mb-6">Sleep Insights</h2>
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center rounded-3xl border border-violet-100 p-5 bg-violet-50">
                <div className="text-3xl mb-2">⏰</div>
                <div className="text-2xl font-bold text-violet-700">{entries.length > 0 ? Math.round((entries.reduce((sum, entry) => sum + entry.durationMinutes, 0) / entries.length / 60) * 10) / 10 : 0}h</div>
                <p className="text-violet-600">Average Sleep</p>
              </div>
              <div className="text-center rounded-3xl border border-violet-100 p-5 bg-violet-50">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-violet-700">{entries.length}</div>
                <p className="text-violet-600">Total Entries</p>
              </div>
              <div className="text-center rounded-3xl border border-violet-100 p-5 bg-violet-50">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-violet-700">{entries.filter((e) => e.quality?.toLowerCase() === 'excellent').length}</div>
                <p className="text-violet-600">Excellent Nights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sleep;
