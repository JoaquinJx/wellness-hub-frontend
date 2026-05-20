import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { inputValidators } from '../utils/validation';

interface Goal {
  id: number;
  title: string;
  description?: string;
  targetDate?: string;
  status: string;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState({ title: '', description: '', targetDate: '', status: 'open' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const response = await api.get('/goals');
    setGoals(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/goals', {
      title: form.title,
      description: form.description || undefined,
      targetDate: form.targetDate || undefined,
      status: form.status
    });
    setForm({ title: '', description: '', targetDate: '', status: 'open' });
    fetchGoals();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'open':
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in progress':
        return '🔄';
      case 'open':
        return '🎯';
      default:
        return '📋';
    }
  };

  const isOverdue = (targetDate?: string) => {
    if (!targetDate) return false;
    return new Date(targetDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-6 sm:p-8 page-animate">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-amber-900">🎯 Goals</h1>
        <p className="text-amber-700 mb-6 sm:mb-8">Set and achieve your wellness targets</p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mb-4 sm:mb-6">Create New Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-2">Goal Title</label>
                <input
                  type="text"
                  placeholder="What do you want to achieve?"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: inputValidators.handleAlphanumericInput(form.title, e.target.value) })}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-2">Description</label>
                <textarea
                  placeholder="Describe your goal in detail"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: inputValidators.handleTextInput(form.description, e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition-colors h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-2">Target Date</label>
                <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-2">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none transition-colors">
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                Create Goal
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mb-4 sm:mb-6">Your Goals</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {goals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No goals yet. Create your first goal!</p>
              ) : (
                goals.map((goal) => (
                  <div key={goal.id} className={`bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-l-4 ${getStatusColor(goal.status).split(' ')[2]}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getStatusEmoji(goal.status)}</span>
                        <div>
                          <h3 className="font-bold text-amber-900">{goal.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(goal.status)}`}>{goal.status}</span>
                            {goal.targetDate && <span className={`text-xs ${isOverdue(goal.targetDate) ? 'text-cyan-600' : 'text-amber-600'}`}>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {goal.description && <p className="text-amber-700 text-sm mt-2">{goal.description}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mb-4 sm:mb-6">Goal Progress</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-amber-700">{goals.length}</div>
              <p className="text-amber-600">Total Goals</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-amber-700">{goals.filter((g) => g.status === 'completed').length}</div>
              <p className="text-amber-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔄</div>
              <div className="text-2xl font-bold text-amber-700">{goals.filter((g) => g.status === 'in progress').length}</div>
              <p className="text-amber-600">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-amber-700">{goals.length > 0 ? Math.round((goals.filter((g) => g.status === 'completed').length / goals.length) * 100) : 0}%</div>
              <p className="text-amber-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
