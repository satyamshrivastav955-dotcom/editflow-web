// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { RegisterFormData } from '../types';

type Errors = Partial<Record<keyof RegisterFormData, string>>;

const ROLES = [
  { value: 'client', label: 'Client' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin',  label: 'Admin'  },
] as const;

export default function RegisterPage() {
  const { handleRegister, loading, error } = useAuth();

  const [form, setForm] = useState<RegisterFormData>({
    name:     '',
    email:    '',
    password: '',
    role:     'client',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState('');

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim())    e.name     = 'Full name is required.';
    if (!form.email.trim())   e.email    = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              e.email    = 'Please enter a valid email address.';
    if (!form.password)       e.password = 'Password is required.';
    else if (form.password.length < 6)
                              e.password = 'Password must be at least 6 characters.';
    if (!form.role)           e.role     = 'Please select a role.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;
    const result = await handleRegister(form);
    // Navigation handled inside useAuth on success
    if ((result as { type: string }).type?.endsWith('rejected')) {
      // error displayed via redux state
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>✂️ EditFlow</h1>
          <p>Create your account to get started</p>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Satyam Sharma"
              autoComplete="name"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Role <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`form-control ${errors.role ? 'is-invalid' : ''}`}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.role && <p className="form-error">{errors.role}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
