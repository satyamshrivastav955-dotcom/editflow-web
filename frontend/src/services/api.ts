// src/services/api.ts
import axios from 'axios';
import type {
  LoginFormData,
  ProjectFormData,
  RegisterFormData,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Attach JWT to every request if present ───────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('editflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────
export const registerUser = (data: RegisterFormData) =>
  api.post('/auth/register', data);

export const loginUser = (data: LoginFormData) =>
  api.post('/auth/login', data);

export const getMe = () =>
  api.get('/auth/me');

// ─── Projects ─────────────────────────────────────────────────────────────
export const getProjects = () =>
  api.get('/projects');

export const getProject = (id: number | string) =>
  api.get(`/projects/${id}`);

export const createProject = (data: Omit<ProjectFormData, 'budget'> & { budget: number }) =>
  api.post('/projects', data);

export const updateProject = (
  id: number | string,
  data: Partial<ProjectFormData> & { status?: string }
) => api.put(`/projects/${id}`, data);

export const deleteProject = (id: number | string) =>
  api.delete(`/projects/${id}`);

export default api;
