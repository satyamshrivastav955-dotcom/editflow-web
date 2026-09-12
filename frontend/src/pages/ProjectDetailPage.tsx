// src/pages/ProjectDetailPage.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchProject, removeProject } from '../redux/projectSlice';
import StatusBadge from '../components/common/StatusBadge';
import Spinner from '../components/common/Spinner';

export default function ProjectDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentProject: project, loading, error } = useSelector((s: RootState) => s.projects);

  useEffect(() => {
    if (id) dispatch(fetchProject(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!project) return;
    if (window.confirm(`Are you sure you want to delete "${project.project_name}"?`)) {
      const result = await dispatch(removeProject(project.id));
      if (removeProject.fulfilled.match(result)) {
        navigate('/projects');
      }
    }
  };

  if (loading) return <Spinner />;
  if (error)   return <div className="alert alert-error">{error}</div>;
  if (!project) return null;

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div>
      {/* ── Header ─────────────────────────────── */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
            <h1 style={{ margin: 0 }}>{project.project_name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Created {fmt(project.created_at)} · Last updated {fmt(project.updated_at)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/projects/${project.id}/edit`} className="btn btn-secondary">
            ✏️ Edit Project
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            🗑 Delete
          </button>
        </div>
      </div>

      {/* ── Project Information ─────────────────── */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="card-title">📋 Project Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Project Type</label>
            <p>{project.project_type}</p>
          </div>
          <div className="info-item">
            <label>Deadline</label>
            <p>{fmt(project.deadline)}</p>
          </div>
          <div className="info-item">
            <label>Budget</label>
            <p>₹{Number(project.budget).toLocaleString('en-IN')}</p>
          </div>
          <div className="info-item">
            <label>Status</label>
            <p><StatusBadge status={project.status} /></p>
          </div>
        </div>
        <div className="info-item" style={{ marginTop: '0.5rem' }}>
          <label>Description</label>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.3rem', lineHeight: 1.7 }}>{project.description}</p>
        </div>
      </div>

      {/* ── Editing Requirements ────────────────── */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="card-title">🎨 Editing Requirements</h3>
        <div className="info-grid">
          {project.resolution && (
            <div className="info-item">
              <label>Resolution</label>
              <p>{project.resolution}</p>
            </div>
          )}
          {project.aspect_ratio && (
            <div className="info-item">
              <label>Aspect Ratio</label>
              <p>{project.aspect_ratio}</p>
            </div>
          )}
          {project.editing_style && (
            <div className="info-item">
              <label>Editing Style</label>
              <p>{project.editing_style}</p>
            </div>
          )}
          <div className="info-item">
            <label>Subtitles</label>
            <p>{project.subtitles_required ? '✅ Required' : '❌ Not Required'}</p>
          </div>
          <div className="info-item">
            <label>Background Music</label>
            <p>{project.music_required ? '✅ Required' : '❌ Not Required'}</p>
          </div>
          <div className="info-item">
            <label>Color Grading</label>
            <p>{project.color_grading_required ? '✅ Required' : '❌ Not Required'}</p>
          </div>
        </div>
        {project.additional_instructions && (
          <div className="info-item" style={{ marginTop: '1rem' }}>
            <label>Additional Instructions</label>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.3rem', lineHeight: 1.7 }}>
              {project.additional_instructions}
            </p>
          </div>
        )}
      </div>

      {/* ── Future Module Placeholders ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {[
          { icon: '👤', title: 'Editor Assignment', desc: 'Assign an editor to this project.' },
          { icon: '🎞️', title: 'Video Versions',    desc: 'Upload and manage video versions.' },
          { icon: '⏱️', title: 'Revision Timeline',  desc: 'Timestamp-based revision workflow.' },
          { icon: '💳', title: 'Payments',           desc: 'Track payments and milestones.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="placeholder-section">
            <strong>{icon} {title}</strong>
            <p>{desc}</p>
            <small style={{ color: 'var(--color-primary)', marginTop: '0.4rem', display: 'block' }}>
              Coming in Module 2
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
