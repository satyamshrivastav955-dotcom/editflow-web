// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'editor' | 'admin';
  created_at?: string;
}

export interface Project {
  id: number;
  client_id: number;
  client_name?: string;
  project_name: string;
  description: string;
  project_type: ProjectType;
  deadline: string;
  budget: number;
  resolution?: string;
  aspect_ratio?: string;
  editing_style?: string;
  subtitles_required: boolean;
  music_required: boolean;
  color_grading_required: boolean;
  additional_instructions?: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export type ProjectType =
  | 'YouTube Video'
  | 'Instagram Reel'
  | 'Short Film'
  | 'Advertisement'
  | 'Podcast'
  | 'Other';

export type ProjectStatus = 'pending' | 'in_progress' | 'completed';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

export interface ApiError {
  message: string;
  errors?: { msg: string; path: string }[];
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'editor' | 'admin';
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProjectFormData {
  project_name: string;
  description: string;
  project_type: ProjectType | '';
  deadline: string;
  budget: string;
  resolution: string;
  aspect_ratio: string;
  editing_style: string;
  subtitles_required: boolean;
  music_required: boolean;
  color_grading_required: boolean;
  additional_instructions: string;
}
