// src/components/layout/Sidebar.tsx
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard',       icon: '📊' },
  { label: 'Projects',  to: '/projects',        icon: '🎬' },
  { label: 'New Project', to: '/projects/create', icon: '➕' },
];

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>✂️ EditFlow</h2>
        <span>Video Project Manager</span>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            item.to === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.to);

          return (
            <li key={item.to} className={`sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <NavLink to={item.to}>
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <ul className="sidebar-nav" style={{ padding: 0 }}>
          <li className="sidebar-nav-item">
            <button onClick={handleLogout}>
              <span className="sidebar-icon">🚪</span>
              Logout
            </button>
          </li>
        </ul>
        <p style={{ marginTop: '0.5rem' }}>Module 1 · EditFlow</p>
      </div>
    </aside>
  );
}
