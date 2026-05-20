import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { inputValidators } from '../utils/validation';

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 py-10 page-animate">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-[32px] bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-xl p-4 sm:p-6 md:p-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Fitness</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-extrabold text-cyan-900">Build stronger routines</h1>
            <p className="mt-2 sm:mt-3 text-slate-600">Create workout plans, launch sessions, and review your recent progress.</p>
          </div>

          <div className="grid gap-6 sm:gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[28px] border border-cyan-100 bg-cyan-50/80 p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-cyan-900 mb-4">Create Workout Plan</h2>
              <form onSubmit={handleCreatePlan} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Plan name</label>
                  <input
                    type="text"
                    placeholder="Leg day blast"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: inputValidators.handleAlphanumericInput(planForm.name, e.target.value) })}
                    required
                    className="w-full rounded-3xl border border-cyan-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    placeholder="A compact plan for strength and endurance"
                    value={planForm.description}
                    onChange={(e) => setPlanForm({ ...planForm, description: inputValidators.handleTextInput(planForm.description, e.target.value) })}
                    className="w-full min-h-[100px] rounded-3xl border border-cyan-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-slate-900"
                  />
                </div>

                <div className="space-y-4">
                  {planForm.exercises.map((exercise, index) => (
                    <div key={index} className="rounded-3xl border border-cyan-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-cyan-900">Exercise {index + 1}</h3>
                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">Optional</span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', inputValidators.handleAlphanumericInput(exercise.name, e.target.value))}
                          className="w-full rounded-3xl border border-cyan-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-slate-900"
                        />
                        <input
                          type="number"
                          placeholder="Sets"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, 'sets', inputValidators.handleNumericInput(exercise.sets, e.target.value))}
                          className="w-full rounded-3xl border border-cyan-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-slate-900"
                        />
                        <input
                          type="number"
                          placeholder="Reps"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, 'reps', inputValidators.handleNumericInput(exercise.reps, e.target.value))}
                          className="w-full rounded-3xl border border-cyan-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-slate-900"
                        />
                        <input
                          type="number"
                          placeholder="Duration (min)"
                          value={exercise.duration}
                          onChange={(e) => updateExercise(index, 'duration', inputValidators.handleNumericInput(exercise.duration, e.target.value))}
                          className="w-full rounded-3xl border border-cyan-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-slate-900"
                        />
                        <textarea
                          placeholder="Notes"
                          value={exercise.notes}
                          onChange={(e) => updateExercise(index, 'notes', inputValidators.handleTextInput(exercise.notes, e.target.value))}
                          className="w-full col-span-full rounded-3xl border border-cyan-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-slate-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={addExercise} className="rounded-3xl border border-cyan-200 bg-white px-5 py-3 text-cyan-600 font-semibold transition hover:bg-cyan-50">
                    + Add Exercise
                  </button>
                  <button type="submit" className="rounded-3xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-white text-lg font-semibold shadow-lg transition hover:scale-[1.01] hover:shadow-xl">
                    Save Plan
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-cyan-100 bg-white p-4 sm:p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold text-cyan-900 mb-4">Workout plans</h2>
                <div className="space-y-4">
                  {plans.length === 0 ? (
                    <p className="text-slate-500">No workout plans yet. Create one to get moving.</p>
                  ) : (
                    plans.map((plan) => (
                      <div key={plan.id} className="rounded-3xl border border-cyan-100 bg-cyan-50/80 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-cyan-900">{plan.name}</h3>
                            <p className="mt-1 text-slate-600">{plan.description}</p>
                          </div>
                          <button onClick={() => startWorkout(plan.id)} className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700">
                            Start
                          </button>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-slate-600">
                          {plan.exercises.map((exercise) => (
                            <div key={exercise.id} className="rounded-2xl bg-white p-3 border border-cyan-100">
                              <div className="font-semibold text-cyan-800">{exercise.name}</div>
                              <div className="mt-1 text-slate-500">
                                {exercise.sets ? `Sets: ${exercise.sets}` : ''}
                                {exercise.reps ? ` · Reps: ${exercise.reps}` : ''}
                                {exercise.duration ? ` · ${exercise.duration} min` : ''}
                              </div>
                              {exercise.notes && <p className="mt-1 text-slate-500">{exercise.notes}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-cyan-100 bg-white p-4 sm:p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold text-cyan-900 mb-4">Recent sessions</h2>
                <div className="space-y-4">
                  {workouts.length === 0 ? (
                    <p className="text-slate-500">No sessions logged yet.</p>
                  ) : (
                    workouts.map((workout) => (
                      <div key={workout.id} className="rounded-3xl border border-cyan-100 bg-cyan-50/80 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-cyan-900">{workout.workoutPlan.name}</h3>
                            <p className="text-sm text-slate-600">{new Date(workout.date).toLocaleDateString()}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${workout.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{workout.completed ? 'Completed' : 'In progress'}</span>
                        </div>
                        {workout.notes && <p className="mt-3 text-slate-600">{workout.notes}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitness;
