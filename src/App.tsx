import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './components/NotificationProvider';
import LanguageSelector from './components/LanguageSelector';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingChatBot from './components/FloatingChatBot';
import './App.css';

// Lazy-loaded components — each page is a separate chunk
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Footer = lazy(() => import('./components/Footer'));
const NutritionChatBot = lazy(() => import('./components/NutritionChatBot'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EnhancedDashboard = lazy(() => import('./pages/EnhancedDashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Health = lazy(() => import('./pages/Health'));
const Fitness = lazy(() => import('./pages/Fitness'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const Sleep = lazy(() => import('./pages/Sleep'));
const MentalHealth = lazy(() => import('./pages/MentalHealth'));
const Hydration = lazy(() => import('./pages/Hydration'));
const Goals = lazy(() => import('./pages/Goals'));
const Meditation = lazy(() => import('./pages/Meditation'));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label="Cargando página">
    <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const showNavbarAndFooter = user && !['/login', '/register', '/'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-cyan-900 to-green-950 text-white page-animate flex flex-col">
      {showNavbarAndFooter && <Navbar />}

      <div className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard-enhanced" element={<ProtectedRoute><EnhancedDashboard /></ProtectedRoute>} />
            <Route path="/health" element={<ProtectedRoute><Health /></ProtectedRoute>} />
            <Route path="/fitness" element={<ProtectedRoute><Fitness /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
            <Route path="/sleep" element={<ProtectedRoute><Sleep /></ProtectedRoute>} />
            <Route path="/mental-health" element={<ProtectedRoute><MentalHealth /></ProtectedRoute>} />
            <Route path="/hydration" element={<ProtectedRoute><Hydration /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/meditation" element={<ProtectedRoute><Meditation /></ProtectedRoute>} />
            <Route path="/nutrition-chat" element={<ProtectedRoute><NutritionChatBot /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </div>

      {showNavbarAndFooter && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}

      {user && <FloatingChatBot />}
    </div>
  );
};

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  const modules = [
    { path: '/dashboard-enhanced', label: t('common.analytics'), icon: '📊' },
    { path: '/dashboard', label: t('common.dashboard'), icon: '🏠' },
    { path: '/health', label: t('navigation.health'), icon: '❤️' },
    { path: '/fitness', label: t('navigation.fitness'), icon: '💪' },
    { path: '/nutrition', label: t('navigation.nutrition'), icon: '🥗' },
    { path: '/sleep', label: t('navigation.sleep'), icon: '😴' },
    { path: '/mental-health', label: t('navigation.mental'), icon: '🧠' },
    { path: '/hydration', label: t('navigation.hydration'), icon: '💧' },
    { path: '/goals', label: t('navigation.goals'), icon: '🎯' },
    { path: '/meditation', label: t('navigation.meditation'), icon: '🧘' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 bg-gradient-to-r from-orange-800/95 via-cyan-800/95 to-green-800/95 backdrop-blur-xl shadow-lg border-b border-orange-700"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-cyan-300 bg-clip-text text-transparent" aria-label="Wellness Hub - Inicio">
            ✨ Wellness Hub
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <LanguageSelector />
            <span className="text-sm text-yellow-100" aria-label={`${t('common.welcome')}, ${user?.name || user?.email}`}>
              {t('common.welcome')}, <span className="font-semibold text-yellow-200">{user?.name || user?.email}</span>
            </span>
            <Link
              to="/settings"
              className="px-4 py-2 bg-indigo-700/50 hover:bg-indigo-600/50 text-yellow-100 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105"
              aria-label={t('common.settings')}
            >
              ⚙️ {t('common.settings')}
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 text-white rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105"
              aria-label={t('common.logout')}
            >
              {t('common.logout')}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide" role="menubar" aria-label="Módulos de bienestar">
          {modules.map((mod) => (
            <Link
              key={mod.path}
              to={mod.path}
              role="menuitem"
              aria-current={location.pathname === mod.path ? 'page' : undefined}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-2xl font-semibold whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
                location.pathname === mod.path
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                  : 'bg-orange-700/50 text-yellow-100 hover:bg-orange-600/50'
              }`}
            >
              <span aria-hidden="true">{mod.icon}</span> {mod.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Home: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const modules = [
    { path: '/health', emoji: '❤️', title: t('navigation.health'), desc: t('home.moduleDescHealth'), color: 'from-cyan-400 to-cyan-600', darkColor: 'from-cyan-600 to-cyan-800' },
    { emoji: '💪', title: t('navigation.fitness'), path: '/fitness', desc: t('home.moduleDescFitness'), color: 'from-orange-400 to-orange-600', darkColor: 'from-orange-600 to-orange-800' },
    { emoji: '🥗', title: t('navigation.nutrition'), path: '/nutrition', desc: t('home.moduleDescNutrition'), color: 'from-green-400 to-green-600', darkColor: 'from-green-600 to-green-800' },
    { emoji: '😴', title: t('navigation.sleep'), path: '/sleep', desc: t('home.moduleDescSleep'), color: 'from-purple-400 to-purple-600', darkColor: 'from-purple-600 to-purple-800' },
    { emoji: '🧠', title: t('navigation.mental'), path: '/mental-health', desc: t('home.moduleDescMental'), color: 'from-pink-400 to-pink-600', darkColor: 'from-pink-600 to-pink-800' },
    { emoji: '💧', title: t('navigation.hydration'), path: '/hydration', desc: t('home.moduleDescHydration'), color: 'from-cyan-400 to-cyan-600', darkColor: 'from-cyan-600 to-cyan-800' },
    { emoji: '🎯', title: t('navigation.goals'), path: '/goals', desc: t('home.moduleDescGoals'), color: 'from-yellow-400 to-yellow-600', darkColor: 'from-yellow-600 to-yellow-800' },
    { emoji: '🧘', title: t('navigation.meditation'), path: '/meditation', desc: t('home.moduleDescMeditation'), color: 'from-teal-400 to-teal-600', darkColor: 'from-teal-600 to-teal-800' },
  ];

  const features = [
    { title: t('home.features.goalTracking.title'), desc: t('home.features.goalTracking.desc') },
    { title: t('home.features.smartAnalytics.title'), desc: t('home.features.smartAnalytics.desc') },
    { title: t('home.features.fitnessPlans.title'), desc: t('home.features.fitnessPlans.desc') },
    { title: t('home.features.nutritionGuides.title'), desc: t('home.features.nutritionGuides.desc') },
    { title: t('home.features.sleepMonitoring.title'), desc: t('home.features.sleepMonitoring.desc') },
    { title: t('home.features.mindfulness.title'), desc: t('home.features.mindfulness.desc') },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center z-10 relative">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">{t('home.title')}</span>
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">{t('home.subtitle')}</p>

          {user ? (
            <div className="space-y-6">
              <p className="text-lg text-gray-400">
                {t('home.welcomeBack')}, <span className="font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">{user.name || user.email}</span>! 👋
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/dashboard" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 text-white text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-200">
                  📊 {t('home.goToDashboard')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 text-white text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-200">
                  📱 {t('home.login')}
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-200">
                  🎉 {t('home.register')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modules Grid Section */}
      {user && (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-24" aria-label={t('home.modulesTitle')}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{t('home.modulesTitle')}</h2>
              <p className="text-gray-400 text-base sm:text-lg">{t('home.modulesSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.map((module) => (
                <Link key={module.path} to={module.path} className="group relative overflow-hidden rounded-3xl p-5 sm:p-8 transition-all duration-300 transform hover:scale-105 cursor-pointer" aria-label={module.title}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.darkColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 transform group-hover:scale-125 transition-transform duration-300" aria-hidden="true">{module.emoji}</div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">{module.desc}</p>
                    <div className="mt-6 flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      {t('home.modulesExplore')} <span className="ml-2" aria-hidden="true">→</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-500" aria-hidden="true"></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section for non-authenticated users */}
      {!user && (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-24" aria-label={t('home.featuresTitle')}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{t('home.featuresTitle')}</h2>
              <p className="text-gray-400 text-base sm:text-lg">{t('home.featuresSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <article key={idx} className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-white/20 hover:border-green-400/50 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default App;
