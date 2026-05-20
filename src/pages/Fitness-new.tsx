import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface WorkoutPlan {
  id: number;
  name: string;
  description?: string;
  exercises: { id: number; name: string; sets?: number; reps?: number; duration?: number; notes?: string }[];
}

interface UserWorkout {
  id: number;
  workoutPlan: WorkoutPlan;
  date: string;
  completed: boolean;
  notes?: string;
}

const Fitness: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [workouts, setWorkouts] = useState<UserWorkout[]>([]);
  const [planForm, setPlanForm] = useState({ name: '', description: '', exercises: [{ name: '', sets: '', reps: '', duration: '', notes: '' }] });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchWorkouts();
  }, []);

  const fetchPlans = async () => {
    const response = await api.get('/fitness/plans');
    setPlans(response.data);
  };

  const fetchWorkouts = async () => {
    const response = await api.get('/fitness/workouts');
    setWorkouts(response.data);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const exercises = planForm.exercises.map((ex) => ({
      name: ex.name,
      sets: ex.sets ? parseInt(ex.sets) : undefined,
      reps: ex.reps ? parseInt(ex.reps) : undefined,
      duration: ex.duration ? parseInt(ex.duration) : undefined,
      notes: ex.notes || undefined
    }));
    await api.post('/fitness/plans', { name: planForm.name, description: planForm.description, exercises });
    setPlanForm({ name: '', description: '', exercises: [{ name: '', sets: '', reps: '', duration: '', notes: '' }] });
    setShowForm(false);
    fetchPlans();
  };

  const addExercise = () => {
    setPlanForm({ ...planForm, exercises: [...planForm.exercises, { name: '', sets: '', reps: '', duration: '', notes: '' }] });
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const newExercises = [...planForm.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setPlanForm({ ...planForm, exercises: newExercises });
  };

  const startWorkout = async (planId: number) => {
    await api.post('/fitness/workouts', { workoutPlanId: planId });
    fetchWorkouts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-cyan-900">💪 Fitness</h1>
        <p className="text-cyan-700 mb-8">Plan and track your workouts</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-cyan-900 mb-6">Workout Plans</h2>
            <button onClick={() => setShowForm(!showForm)} className="mb-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105">
              + New Plan
            </button>

            {showForm && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-cyan-900 mb-4">Create Workout Plan</h3>
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  <input type="text" placeholder="Plan Name" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} required className="w-full px-4 py-2 rounded-lg border-2 border-cyan-200 focus:border-cyan-500 outline-none" />
                  <textarea placeholder="Description" value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border-2 border-cyan-200 focus:border-cyan-500 outline-none h-20" />
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    {planForm.exercises.map((ex, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-cyan-500">
                        <input type="text" placeholder="Exercise Name" value={ex.name} onChange={(e) => updateExercise(index, 'name', e.target.value)} required className="w-full px-3 py-2 rounded border border-cyan-200 mb-2 outline-none focus:border-cyan-500" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" placeholder="Sets" value={ex.sets} onChange={(e) => updateExercise(index, 'sets', e.target.value)} className="px-3 py-2 rounded border border-cyan-200 outline-none focus:border-cyan-500" />
                          <input type="number" placeholder="Reps" value={ex.reps} onChange={(e) => updateExercise(index, 'reps', e.target.value)} className="px-3 py-2 rounded border border-cyan-200 outline-none focus:border-cyan-500" />
                        </div>
                        <input type="number" placeholder="Duration (min)" value={ex.duration} onChange={(e) => updateExercise(index, 'duration', e.target.value)} className="w-full px-3 py-2 rounded border border-cyan-200 mt-2 outline-none focus:border-cyan-500" />
                        <textarea placeholder="Notes" value={ex.notes} onChange={(e) => updateExercise(index, 'notes', e.target.value)} className="w-full px-3 py-2 rounded border border-cyan-200 mt-2 h-12 outline-none focus:border-cyan-500" />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addExercise} className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors">
                    + Add Exercise
                  </button>
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all">
                      Create Plan
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition-all">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {plans.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No plans yet. Create one above!</p>
              ) : (
                plans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-cyan-500">
                    <h3 className="text-xl font-bold text-cyan-900">{plan.name}</h3>
                    {plan.description && <p className="text-gray-600 text-sm mt-1">{plan.description}</p>}
                    <div className="mt-4 space-y-2">
                      {plan.exercises.map((ex) => (
                        <div key={ex.id} className="text-sm text-gray-700 bg-gray-50 p-3 rounded flex justify-between items-center">
                          <span className="font-semibold">{ex.name}</span>
                          <span className="text-xs text-gray-600">
                            {ex.sets ? `${ex.sets}x${ex.reps || '?'}` : ''} {ex.duration ? `${ex.duration}min` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => startWorkout(plan.id)} className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all">
                      Start Workout 🏃
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-900 mb-6">Workout History</h2>
            <div className="space-y-3 max-h-screen overflow-y-auto">
              {workouts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No workouts yet.</p>
              ) : (
                workouts.map((workout) => (
                  <div key={workout.id} className={`rounded-lg p-4 ${workout.completed ? 'bg-green-100 border-l-4 border-green-500' : 'bg-yellow-100 border-l-4 border-yellow-500'}`}>
                    <p className="font-bold text-gray-900">{workout.workoutPlan.name}</p>
                    <p className="text-xs text-gray-600">{new Date(workout.date).toLocaleDateString()}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${workout.completed ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>{workout.completed ? '✓ Completed' : 'In Progress'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitness;

