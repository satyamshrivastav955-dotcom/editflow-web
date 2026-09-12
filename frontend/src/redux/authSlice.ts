// src/redux/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../services/api';
import type {
  AuthState,
  LoginFormData,
  RegisterFormData,
  User,
} from '../types';

// ─── Async thunks ─────────────────────────────────────────────────────────

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterFormData, { rejectWithValue }) => {
    try {
      const res = await registerUser(data);
      return res.data as { token: string; user: User };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed.'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginFormData, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res.data as { token: string; user: User };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || 'Login failed.'
      );
    }
  }
);

// ─── Initial state ────────────────────────────────────────────────────────

const storedToken = localStorage.getItem('editflow_token');
const storedUser  = localStorage.getItem('editflow_user');

const initialState: AuthState = {
  user:            storedUser ? (JSON.parse(storedUser) as User) : null,
  token:           storedToken,
  isAuthenticated: !!storedToken,
  loading:         false,
  error:           null,
};

// ─── Slice ────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      state.error           = null;
      localStorage.removeItem('editflow_token');
      localStorage.removeItem('editflow_user');
    },
    clearAuthError(state) {
      state.error = null;
    },
    setCredentials(state, action: PayloadAction<{ token: string; user: User }>) {
      state.user            = action.payload.user;
      state.token           = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('editflow_token', action.payload.token);
      localStorage.setItem('editflow_user', JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading         = false;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('editflow_token', action.payload.token);
        localStorage.setItem('editflow_user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading         = false;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('editflow_token', action.payload.token);
        localStorage.setItem('editflow_user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });
  },
});

export const { logout, clearAuthError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
