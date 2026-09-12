// src/components/projects/ProjectList.tsx
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types';
import StatusBadge from '../common/StatusBadge';

interface Props {
  projects: Project[];
  onDelete?: (id: number) => void;
}

export default function ProjectList({ projects, onDelete }: Props) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <h3>No projects yet</h3>
        <p>Click "Create New Project" to get started.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Type</th>
            <th>Deadline</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>
                <button
                  onClick={() => navigate(`/projects/${p.id}`)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  {p.project_name}
                </button>
              </td>
              <td>{p.project_type}</td>
              <td>{new Date(p.deadline).toLocaleDateString('en-IN')}</td>
              <td>₹{Number(p.budget).toLocaleString('en-IN')}</td>
              <td><StatusBadge status={p.status} /></td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/projects/${p.id}/edit`)}
                  >
                    Edit
                  </button>
                  {onDelete && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm(`Delete "${p.project_name}"?`)) {
                          onDelete(p.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
