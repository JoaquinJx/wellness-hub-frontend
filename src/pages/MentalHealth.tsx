import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { inputValidators } from '../utils/validation';

interface MentalEntry {
  id: number;
  date: string;
  mood: string;
  stressLevel?: number;
  notes?: string;
}

const MentalHealth: React.FC = () => {
  const [entries, setEntries] = useState<MentalEntry[]>([]);
  const [form, setForm] = useState({ mood: '', stressLevel: '', notes: '' });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const response = await api.get('/mental-health');
    setEntries(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/mental-health', {
      mood: form.mood,
      stressLevel: form.stressLevel ? parseInt(form.stressLevel) : undefined,
      notes: form.notes || undefined
    });
    setForm({ mood: '', stressLevel: '', notes: '' });
    fetchEntries();
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      excellent: '😊',
      good: '🙂',
      okay: '😐',
      bad: '😞',
      terrible: '😢',
      happy: '😄',
      sad: '😢',
      anxious: '😰',
      calm: '😌',
      excited: '🤩',
      tired: '😴',
      energetic: '⚡'
    };
    return moodMap[mood.toLowerCase()] || '😐';
  };

  const getStressColor = (level?: number) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    if (level <= 3) return 'bg-green-100 text-green-800';
    if (level <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-cyan-100 text-cyan-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 px-4 py-6 sm:p-8 page-animate">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-pink-900">🧠 Mental Health</h1>
        <p className="text-pink-700 mb-6 sm:mb-8">Track your emotional well-being and mood</p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-pink-900 mb-4 sm:mb-6">Log Your Mood</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-pink-800 mb-2">How are you feeling?</label>
                <select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} required className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500 outline-none transition-colors">
                  <option value="">Select your mood</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Okay">Okay</option>
                  <option value="Bad">Bad</option>
                  <option value="Terrible">Terrible</option>
                  <option value="Happy">Happy</option>
                  <option value="Sad">Sad</option>
                  <option value="Anxious">Anxious</option>
                  <option value="Calm">Calm</option>
                  <option value="Excited">Excited</option>
                  <option value="Tired">Tired</option>
                  <option value="Energetic">Energetic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-pink-800 mb-2">Stress Level (1-10)</label>
                <input type="range" min="1" max="10" value={form.stressLevel} onChange={(e) => setForm({ ...form, stressLevel: inputValidators.handleNumericInput(form.stressLevel, e.target.value) })} className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs text-pink-600 mt-1">
                  <span>Low</span>
                  <span className="font-semibold">{form.stressLevel || 5}</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-pink-800 mb-2">Notes</label>
                <textarea
                  placeholder="What's on your mind?"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: inputValidators.handleTextInput(form.notes, e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500 outline-none transition-colors h-24"
                />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                Log Mood Entry
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-pink-900 mb-4 sm:mb-6">Mood Journal</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No entries yet. Start tracking your mood!</p>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-l-4 border-pink-500">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <h3 className="font-bold text-pink-900 capitalize">{entry.mood}</h3>
                          <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {entry.stressLevel && <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStressColor(entry.stressLevel)}`}>Stress: {entry.stressLevel}/10</span>}
                    </div>

                    {entry.notes && <p className="text-pink-600 text-sm italic mt-2">📝 {entry.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-pink-900 mb-4 sm:mb-6">Mental Health Insights</h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-pink-700">{entries.length}</div>
              <p className="text-pink-600">Total Entries</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">😊</div>
              <div className="text-2xl font-bold text-pink-700">{entries.filter((e) => ['excellent', 'good', 'happy', 'excited', 'calm'].includes(e.mood.toLowerCase())).length}</div>
              <p className="text-pink-600">Positive Days</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-pink-700">{entries.length > 0 ? Math.round((entries.reduce((sum, entry) => sum + (entry.stressLevel || 0), 0) / entries.length) * 10) / 10 : 0}</div>
              <p className="text-pink-600">Avg Stress Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealth;
