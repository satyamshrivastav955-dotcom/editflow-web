// src/components/projects/ProjectCard.tsx
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types';
import StatusBadge from '../common/StatusBadge';

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${project.id}`)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{project.project_name}</h3>
        <StatusBadge status={project.status} />
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.8rem', lineHeight: 1.5 }}>
        {project.description.slice(0, 100)}{project.description.length > 100 ? '…' : ''}
      </p>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
        <span>🎬 {project.project_type}</span>
        <span>📅 {new Date(project.deadline).toLocaleDateString('en-IN')}</span>
        <span>💰 ₹{Number(project.budget).toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
