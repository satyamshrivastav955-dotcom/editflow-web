// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../redux/store';
import { login, register, logout } from '../redux/authSlice';
import type { LoginFormData, RegisterFormData } from '../types';

/**
 * Reusable auth hook.
 * Provides the current user, auth state, and actions.
 */
export const useAuth = () => {
  const dispatch   = useDispatch<AppDispatch>();
  const navigate   = useNavigate();
  const authState  = useSelector((state: RootState) => state.auth);

  const handleLogin = async (data: LoginFormData) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
    return result;
  };

  const handleRegister = async (data: RegisterFormData) => {
    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
    return result;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    ...authState,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
