import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { id: 'calendar', label: 'Calendar', icon: '📅', path: '/calendar' },
    { id: 'leaves', label: 'Leaves', icon: '🍃', path: '/leaves' },
    { id: 'reports', label: 'Reports', icon: '📊', path: '/reports' },
    ...(isAdmin ? [{ id: 'users', label: 'Users', icon: '👥', path: '/admin/users' }] : []),
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' }
  ];

  return (
    <aside className={`sidebar${isAdmin ? ' admin-sidebar' : ''}`}>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
