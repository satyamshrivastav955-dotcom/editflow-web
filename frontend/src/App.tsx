// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';

// Pages
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardPage    from './pages/DashboardPage';
import ProjectsPage     from './pages/ProjectsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import EditProjectPage  from './pages/EditProjectPage';

// Layout
import AppLayout from './components/layout/AppLayout';

// ─── Protected Route helper ────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// ─── Public Route (redirect if already logged in) ─────────────────────────
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected routes wrapped in AppLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"          element={<DashboardPage />} />
        <Route path="projects"           element={<ProjectsPage />} />
        <Route path="projects/create"    element={<CreateProjectPage />} />
        <Route path="projects/:id"       element={<ProjectDetailPage />} />
        <Route path="projects/:id/edit"  element={<EditProjectPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
