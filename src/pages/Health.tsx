import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { inputValidators } from '../utils/validation';

interface HealthRecord {
  id: number;
  date: string;
  weight?: number;
  bloodPressure?: string;
  heartRate?: number;
  notes?: string;
}

const Health: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [form, setForm] = useState({ weight: '', bloodPressure: '', heartRate: '', notes: '' });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const response = await api.get('/health');
    setRecords(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/health', {
      weight: form.weight ? parseFloat(form.weight) : undefined,
      bloodPressure: form.bloodPressure || undefined,
      heartRate: form.heartRate ? parseInt(form.heartRate) : undefined,
      notes: form.notes || undefined
    });
    setForm({ weight: '', bloodPressure: '', heartRate: '', notes: '' });
    fetchRecords();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-10 page-animate">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-[32px] bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-xl p-4 sm:p-6 md:p-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-green-600">Health</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-extrabold text-green-900">Track your health vitals</h1>
            <p className="mt-2 sm:mt-3 text-slate-600">Record weight, blood pressure, heart rate and notes for a complete health overview.</p>
          </div>

          <div className="grid gap-6 sm:gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/80 p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mb-4">Add Health Record</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="72.4"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: inputValidators.handleNumericInput(form.weight, e.target.value) })}
                    className="w-full rounded-3xl border border-emerald-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Blood pressure</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={form.bloodPressure}
                    onChange={(e) => setForm({ ...form, bloodPressure: inputValidators.handleAlphanumericInput(form.bloodPressure, e.target.value) })}
                    className="w-full rounded-3xl border border-emerald-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Heart rate (bpm)</label>
                  <input
                    type="number"
                    placeholder="72"
                    value={form.heartRate}
                    onChange={(e) => setForm({ ...form, heartRate: inputValidators.handleNumericInput(form.heartRate, e.target.value) })}
                    className="w-full rounded-3xl border border-emerald-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                  <textarea
                    placeholder="How are you feeling today?"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: inputValidators.handleTextInput(form.notes, e.target.value) })}
                    className="w-full min-h-[120px] rounded-3xl border border-emerald-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-slate-900"
                  />
                </div>

                <button type="submit" className="w-full rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 shadow-lg transition hover:scale-[1.01]">
                  Save Health Record
                </button>
              </form>
            </div>

            <div className="rounded-[28px] border border-emerald-100 bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mb-4">Recent Records</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {records.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No records yet. Add one above!</p>
                ) : (
                  records.map((record) => (
                    <div key={record.id} className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4 shadow-sm transition hover:shadow-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-sm text-slate-500">{new Date(record.date).toLocaleDateString()}</p>
                          <h3 className="text-lg font-semibold text-green-900">Health snapshot</h3>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Latest</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3 text-sm text-slate-700">
                        {record.weight != null && <div className="rounded-2xl bg-white p-3">⚖️ {record.weight} kg</div>}
                        {record.bloodPressure && <div className="rounded-2xl bg-white p-3">💉 {record.bloodPressure}</div>}
                        {record.heartRate != null && <div className="rounded-2xl bg-white p-3">♥️ {record.heartRate} bpm</div>}
                      </div>
                      {record.notes && <p className="mt-3 text-slate-600 italic">📝 {record.notes}</p>}
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

export default Health;
