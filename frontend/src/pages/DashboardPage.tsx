// src/pages/DashboardPage.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchProjects, removeProject } from '../redux/projectSlice';
import ProjectCard from '../components/projects/ProjectCard';
import Spinner from '../components/common/Spinner';

export default function DashboardPage() {
  const dispatch  = useDispatch<AppDispatch>();
  const { user }  = useSelector((s: RootState) => s.auth);
  const { projects, loading } = useSelector((s: RootState) => s.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const total     = projects.length;
  const active    = projects.filter((p) => p.status === 'in_progress').length;
  const completed = projects.filter((p) => p.status === 'completed').length;
  const recent    = projects.slice(0, 4);

  return (
    <div>
      {/* ── Welcome banner ─────────────────── */}
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0] ?? 'User'} 👋</h1>
          <p>Here's an overview of your video projects.</p>
        </div>
        <Link to="/projects/create" className="btn btn-primary">
          + Create New Project
        </Link>
      </div>

      {/* ── Stats ──────────────────────────── */}
      <div className="stats-grid">
        <div className="stat-card total">
          <p className="stat-label">Total Projects</p>
          <p className="stat-value">{total}</p>
        </div>
        <div className="stat-card active">
          <p className="stat-label">Active Projects</p>
          <p className="stat-value">{active}</p>
        </div>
        <div className="stat-card done">
          <p className="stat-label">Completed</p>
          <p className="stat-value">{completed}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending</p>
          <p className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {projects.filter((p) => p.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* ── Recent Projects ─────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Projects</h2>
        <Link to="/projects" style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
          View all →
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : recent.length === 0 ? (
        <div className="empty-state">
          <h3>No projects yet</h3>
          <p>Create your first project to get started.</p>
          <Link to="/projects/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            + Create New Project
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {recent.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
