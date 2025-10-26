import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'calendar', label: 'Calendar', icon: '📅', path: '/calendar' },
    { id: 'leaves', label: 'Leaves', icon: '🍃', path: '/leaves' },
    { id: 'reports', label: 'Reports', icon: '📊', path: '/reports' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
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
