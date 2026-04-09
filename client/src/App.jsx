import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import useAppStore from './store/useAppStore';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ExperimentViewer from './pages/ExperimentViewer';
import Dashboard from './pages/Dashboard';
import TeacherConsole from './pages/TeacherConsole';
import SimulationWorld from './pages/SimulationWorld';

// Components
import Navbar from './components/Navbar';

/* ── Protected Route: redirect to /login if not authenticated ── */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#06080f', color: '#00e5ff',
      fontFamily: 'Space Mono, monospace'
    }}>
      Loading...
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

/* ── Guest Route: redirect to /dashboard if already logged in ── */
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

/* ── Main Layout with Navbar ── */
function AppLayout({ children }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: '#06080f',
      overflow: 'hidden'
    }}>
      <Navbar />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

function AppContent() {
  const { accentColor } = useAppStore();

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  return (
    <AnimatePresence mode="wait">
      <Routes>

        {/* ── ROOT → always redirect to dashboard ── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── PUBLIC / GUEST ROUTES ── */}
        <Route path="/login" element={
          <GuestRoute><Login /></GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute><Register /></GuestRoute>
        } />

        {/* ── DASHBOARD (home page for logged-in users) ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />

        {/* ── EXPLORE (experiment library, formerly Home /) ── */}
        <Route path="/explore" element={
          <ProtectedRoute>
            <AppLayout><Home /></AppLayout>
          </ProtectedRoute>
        } />

        {/* ── EXPERIMENT VIEWER (full screen, no navbar) ── */}
        <Route path="/experiment/:sceneKey" element={
          <ProtectedRoute>
            <ExperimentViewer />
          </ProtectedRoute>
        } />

        {/* ── TEACHER CONSOLE ── */}
        <Route path="/teacher" element={
          <ProtectedRoute roles={['teacher']}>
            <AppLayout><TeacherConsole /></AppLayout>
          </ProtectedRoute>
        } />

        {/* ── SIMULATION WORLD ── */}
        <Route path="/simulation" element={
          <ProtectedRoute>
            <SimulationWorld />
          </ProtectedRoute>
        } />

        {/* ── CATCH ALL → dashboard ── */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>SciViz 3D | Interactive Science Simulations</title>
        <meta name="description" content="Immersive 3D science experiments for Classes 10 & 12." />
        <meta property="og:title" content="SciViz 3D" />
        <meta property="og:description" content="Explore science in 3D perspective." />
      </Helmet>
      <AuthProvider>
        <Router>
          <AppContent />
          <Toaster position="bottom-right" toastOptions={{
            style: {
              background: 'var(--surface-color)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(10px)'
            }
          }} />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
