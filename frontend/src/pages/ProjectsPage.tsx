// src/pages/ProjectsPage.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchProjects, removeProject } from '../redux/projectSlice';
import ProjectList from '../components/projects/ProjectList';
import Spinner from '../components/common/Spinner';

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((s: RootState) => s.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(removeProject(id));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Projects</h1>
          <p>Manage all your video editing projects.</p>
        </div>
        <Link to="/projects/create" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <Spinner />
      ) : (
        <ProjectList projects={projects} onDelete={handleDelete} />
      )}
    </div>
  );
}
