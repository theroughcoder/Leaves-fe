import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardHeader.css';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    // Navigate to profile page or open profile modal
    console.log('Navigate to profile');
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    // Navigate to settings page or open settings modal
    console.log('Navigate to settings');
  };

  return (
    <header className={`dashboard-header${isAdmin ? ' admin-header' : ''}`}>
      <div className="header-left">
        <h1>Dashboard</h1>
      </div>
      <div className="header-right">
        <form className="search-box" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <span>🔍</span>
          </button>
        </form>
        <div className="user-menu">
          <div className="user-avatar">👤</div>
          {isAdmin && (
            <span className="admin-tag">ADMIN</span>
          )}
         
          <div className="user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            {user?.role === 'manager' && (
            <span className="manager-tag">MANAGE</span>
          )}
          </div>
          <div className="user-dropdown" ref={dropdownRef}>
            <button 
              className="dropdown-toggle" 
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              <span>▼</span>
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={handleProfileClick}>
                  <span>👤</span>
                  Profile
                </div>
                <div className="dropdown-item" onClick={handleSettingsClick}>
                  <span>⚙️</span>
                  Settings
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  <span>🚪</span>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
