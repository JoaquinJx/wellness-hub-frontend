/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        health: '#10b981',
        fitness: '#ef4444',
        nutrition: '#fbbf24',
        sleep: '#8b5cf6',
        'mental-health': '#ec4899',
        hydration: '#06b6d4',
        goals: '#f59e0b',
        meditation: '#14b8a6'
      }
    }
  },
  plugins: []
};
