// src/components/layout/Navbar.tsx
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const TITLES: Record<string, string> = {
  '/dashboard':       'Dashboard',
  '/projects':        'Projects',
  '/projects/create': 'Create New Project',
};

export default function Navbar() {
  const location = useLocation();
  const user     = useSelector((s: RootState) => s.auth.user);

  const title =
    Object.entries(TITLES).find(([path]) => location.pathname.startsWith(path))?.[1] ??
    'EditFlow';

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'EF';

  return (
    <header className="navbar">
      <span className="navbar-title">{title}</span>
      <div className="navbar-user">
        <div className="navbar-avatar">{initials}</div>
        <span className="navbar-name">{user?.name ?? 'User'}</span>
      </div>
    </header>
  );
}
