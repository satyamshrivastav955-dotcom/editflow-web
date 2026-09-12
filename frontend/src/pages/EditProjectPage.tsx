// src/pages/EditProjectPage.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchProject, editProject } from '../redux/projectSlice';
import ProjectForm from '../components/projects/ProjectForm';
import Spinner from '../components/common/Spinner';
import type { ProjectFormData } from '../types';

export default function EditProjectPage() {
  const { id }   = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentProject: project, loading, error } = useSelector((s: RootState) => s.projects);

  useEffect(() => {
    if (id) dispatch(fetchProject(id));
  }, [dispatch, id]);

  const handleSubmit = async (data: ProjectFormData) => {
    if (!id) return;
    const result = await dispatch(editProject({ id, data }));
    if (editProject.fulfilled.match(result)) {
      navigate(`/projects/${id}`);
    }
  };

  if (loading && !project) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Edit Project</h1>
          <p>{project?.project_name ?? ''}</p>
        </div>
      </div>

      <div className="card">
        {project && (
          <ProjectForm
            initialData={project}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            submitLabel="Save Changes"
          />
        )}
      </div>
    </div>
  );
}
