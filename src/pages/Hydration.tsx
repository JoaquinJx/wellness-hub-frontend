import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { inputValidators } from '../utils/validation';

interface HydrationEntry {
  id: number;
  date: string;
  amountMl: number;
  notes?: string;
}

const Hydration: React.FC = () => {
  const [entries, setEntries] = useState<HydrationEntry[]>([]);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const response = await api.get('/hydration');
    setEntries(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/hydration', { amountMl: parseInt(amount), notes: notes || undefined });
    setAmount('');
    setNotes('');
    fetchEntries();
  };

  const getDailyTotal = () => {
    const today = new Date().toDateString();
    return entries.filter((entry) => new Date(entry.date).toDateString() === today).reduce((sum, entry) => sum + entry.amountMl, 0);
  };

  const getProgressPercentage = () => {
    const dailyGoal = 2000; // 2 liters
    const current = getDailyTotal();
    return Math.min((current / dailyGoal) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-sky-50 px-4 py-6 sm:p-8 page-animate">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-cyan-900">💧 Hydration</h1>
        <p className="text-cyan-700 mb-6 sm:mb-8">Stay hydrated and track your daily water intake</p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-900 mb-4 sm:mb-6">Log Water Intake</h2>

            <div className="mb-6">
              <div className="bg-cyan-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-700 font-semibold">Today's Progress</span>
                  <span className="text-2xl font-bold text-cyan-700">{getDailyTotal()}ml</span>
                </div>
                <div className="w-full bg-cyan-200 rounded-full h-3 mb-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-sky-500 h-3 rounded-full transition-all duration-500" style={{ width: `${getProgressPercentage()}%` }}></div>
                </div>
                <p className="text-sm text-cyan-600">Goal: 2000ml ({Math.round(getProgressPercentage())}% complete)</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-cyan-800 mb-2">Amount (ml)</label>
                <input type="number" placeholder="250" value={amount} onChange={(e) => setAmount(inputValidators.handleNumericInput(amount, e.target.value))} required className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 focus:border-cyan-500 outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-cyan-800 mb-2">Notes</label>
                <textarea placeholder="What did you drink?" value={notes} onChange={(e) => setNotes(inputValidators.handleTextInput(notes, e.target.value))} className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 focus:border-cyan-500 outline-none transition-colors h-24" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                Log Water Intake
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-900 mb-4 sm:mb-6">Water Log</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No entries yet. Start drinking water!</p>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-l-4 border-cyan-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-cyan-700">{entry.amountMl}ml</span>
                          <span className="text-cyan-600">💧</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl">🥤</div>
                      </div>
                    </div>

                    {entry.notes && <p className="text-cyan-600 text-sm italic mt-2">📝 {entry.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-900 mb-4 sm:mb-6">Hydration Insights</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💧</div>
              <div className="text-2xl font-bold text-cyan-700">{getDailyTotal()}ml</div>
              <p className="text-cyan-600">Today</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-cyan-700">{entries.length}</div>
              <p className="text-cyan-600">Total Entries</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-cyan-700">{entries.length > 0 ? Math.round(entries.reduce((sum, entry) => sum + entry.amountMl, 0) / entries.length) : 0}ml</div>
              <p className="text-cyan-600">Average</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-cyan-700">{getDailyTotal() >= 2000 ? '✅' : '⏳'}</div>
              <p className="text-cyan-600">Goal Met</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hydration;
