import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { inputValidators } from '../utils/validation';

interface MeditationSession {
  id: number;
  date: string;
  durationMinutes: number;
  type?: string;
  notes?: string;
}

const Meditation: React.FC = () => {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [form, setForm] = useState({ durationMinutes: '', type: '', notes: '' });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const response = await api.get('/meditation');
    setSessions(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/meditation', {
      durationMinutes: parseInt(form.durationMinutes),
      type: form.type || undefined,
      notes: form.notes || undefined
    });
    setForm({ durationMinutes: '', type: '', notes: '' });
    fetchSessions();
  };

  const getTypeEmoji = (type?: string) => {
    const typeMap: { [key: string]: string } = {
      mindfulness: '🧘',
      breathing: '🌬️',
      guided: '🎧',
      transcendental: '✨',
      vipassana: '👁️',
      zen: '☯️',
      yoga: '🧘‍♀️',
      other: '🧘'
    };
    return typeMap[type?.toLowerCase() || 'other'] || '🧘';
  };

  const getTotalMinutes = () => {
    return sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  };

  const getWeeklyAverage = () => {
    if (sessions.length === 0) return 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklySessions = sessions.filter((session) => new Date(session.date) >= oneWeekAgo);
    return weeklySessions.length > 0 ? Math.round(weeklySessions.reduce((sum, session) => sum + session.durationMinutes, 0) / 7) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 px-4 py-6 sm:p-8 page-animate">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-teal-900">🧘 Meditation</h1>
        <p className="text-teal-700 mb-6 sm:mb-8">Find peace and mindfulness through meditation</p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-teal-900 mb-4 sm:mb-6">Log Meditation Session</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-teal-800 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  placeholder="20"
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: inputValidators.handleNumericInput(form.durationMinutes, e.target.value) })}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-teal-200 focus:border-teal-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-800 mb-2">Meditation Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 rounded-lg border-2 border-teal-200 focus:border-teal-500 outline-none transition-colors">
                  <option value="">Select type</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Breathing">Breathing</option>
                  <option value="Guided">Guided</option>
                  <option value="Transcendental">Transcendental</option>
                  <option value="Vipassana">Vipassana</option>
                  <option value="Zen">Zen</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-800 mb-2">Notes</label>
                <textarea
                  placeholder="How did the session go?"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: inputValidators.handleTextInput(form.notes, e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-teal-200 focus:border-teal-500 outline-none transition-colors h-24"
                />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                Log Session
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-900 mb-4 sm:mb-6">Meditation Journal</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sessions yet. Start your meditation journey!</p>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-l-4 border-teal-500">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getTypeEmoji(session.type)}</span>
                        <div>
                          <h3 className="font-bold text-teal-900">{session.durationMinutes} minutes</h3>
                          <p className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                          {session.type && <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full mt-1 inline-block">{session.type}</span>}
                        </div>
                      </div>
                    </div>

                    {session.notes && <p className="text-teal-600 text-sm italic mt-2">📝 {session.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-900 mb-4 sm:mb-6">Meditation Insights</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🧘</div>
              <div className="text-2xl font-bold text-teal-700">{sessions.length}</div>
              <p className="text-teal-600">Total Sessions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-teal-700">{getTotalMinutes()}</div>
              <p className="text-teal-600">Total Minutes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-teal-700">{sessions.length > 0 ? Math.round(getTotalMinutes() / sessions.length) : 0}</div>
              <p className="text-teal-600">Avg Session</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-teal-700">{getWeeklyAverage()}</div>
              <p className="text-teal-600">Weekly Avg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meditation;
