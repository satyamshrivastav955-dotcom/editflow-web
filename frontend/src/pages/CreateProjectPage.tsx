// src/pages/CreateProjectPage.tsx
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../redux/store';
import { addProject } from '../redux/projectSlice';
import ProjectForm from '../components/projects/ProjectForm';
import type { ProjectFormData } from '../types';

export default function CreateProjectPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, currentProject } = useSelector((s: RootState) => s.projects);

  const handleSubmit = async (data: ProjectFormData) => {
    const result = await dispatch(addProject(data));
    if (addProject.fulfilled.match(result)) {
      navigate(`/projects/${result.payload.id}`);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Create New Project</h1>
          <p>Fill in the details below to create your video editing project.</p>
        </div>
      </div>

      <div className="card">
        <ProjectForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitLabel="Create Project"
        />
      </div>
    </div>
  );
}
