// src/redux/projectSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProjects as apiGetProjects,
  getProject  as apiGetProject,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
} from '../services/api';
import type { Project, ProjectFormData, ProjectState } from '../types';

// ─── Async Thunks ─────────────────────────────────────────────────────────

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiGetProjects();
      return res.data.projects as Project[];
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects.');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchOne',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const res = await apiGetProject(id);
      return res.data.project as Project;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Project not found.');
    }
  }
);

export const addProject = createAsyncThunk(
  'projects/create',
  async (data: ProjectFormData, { rejectWithValue }) => {
    try {
      const payload = {
        ...data,
        budget: parseFloat(data.budget),
        project_type: data.project_type as Project['project_type'],
      };
      const res = await apiCreateProject(payload);
      return res.data.project as Project;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: { msg: string }[] } } };
      const msg =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        'Failed to create project.';
      return rejectWithValue(msg);
    }
  }
);

export const editProject = createAsyncThunk(
  'projects/update',
  async (
    { id, data }: { id: number | string; data: Partial<ProjectFormData> & { status?: string } },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiUpdateProject(id, data);
      return res.data.project as Project;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to update project.');
    }
  }
);

export const removeProject = createAsyncThunk(
  'projects/delete',
  async (id: number | string, { rejectWithValue }) => {
    try {
      await apiDeleteProject(id);
      return id;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project.');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────

const initialState: ProjectState = {
  projects:       [],
  currentProject: null,
  loading:        false,
  error:          null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectError(state) {
      state.error = null;
    },
    clearCurrentProject(state) {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchProjects.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.projects = a.payload; })
      .addCase(fetchProjects.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });

    // fetchOne
    builder
      .addCase(fetchProject.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProject.fulfilled, (s, a) => { s.loading = false; s.currentProject = a.payload; })
      .addCase(fetchProject.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });

    // create
    builder
      .addCase(addProject.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(addProject.fulfilled, (s, a) => {
        s.loading = false;
        s.projects.unshift(a.payload);
        s.currentProject = a.payload;
      })
      .addCase(addProject.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });

    // update
    builder
      .addCase(editProject.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(editProject.fulfilled, (s, a) => {
        s.loading = false;
        s.currentProject = a.payload;
        const idx = s.projects.findIndex((p) => p.id === a.payload.id);
        if (idx !== -1) s.projects[idx] = a.payload;
      })
      .addCase(editProject.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });

    // delete
    builder
      .addCase(removeProject.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(removeProject.fulfilled, (s, a) => {
        s.loading  = false;
        s.projects = s.projects.filter((p) => p.id !== a.payload);
        if (s.currentProject?.id === a.payload) s.currentProject = null;
      })
      .addCase(removeProject.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { clearProjectError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
