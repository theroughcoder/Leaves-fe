import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  const stats = [
    { title: 'Total Users', value: '2,543', change: '+12%', trend: 'up' },
    { title: 'Revenue', value: '$45,231', change: '+8%', trend: 'up' },
    { title: 'Orders', value: '1,234', change: '-3%', trend: 'down' },
    { title: 'Conversion', value: '3.2%', change: '+1.2%', trend: 'up' }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'created a new account', time: '2 minutes ago', type: 'user' },
    { id: 2, user: 'Sarah Wilson', action: 'completed a purchase', time: '5 minutes ago', type: 'purchase' },
    { id: 3, user: 'Mike Johnson', action: 'updated profile', time: '10 minutes ago', type: 'update' },
    { id: 4, user: 'Emily Davis', action: 'left a review', time: '15 minutes ago', type: 'review' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-header">
                    <h3>{stat.title}</h3>
                    <span className={`trend ${stat.trend}`}>
                      {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                    </span>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              ))}
            </div>
            
            <div className="content-grid">
              <div className="chart-container">
                <h3>Revenue Overview</h3>
                <div className="chart-placeholder">
                  <div className="chart-bars">
                    {[65, 45, 80, 55, 70, 90, 75].map((height, index) => (
                      <div key={index} className="bar" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="activity-container">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === 'user' && '👤'}
                        {activity.type === 'purchase' && '🛒'}
                        {activity.type === 'update' && '✏️'}
                        {activity.type === 'review' && '⭐'}
                      </div>
                      <div className="activity-content">
                        <div className="activity-text">
                          <strong>{activity.user}</strong> {activity.action}
                        </div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="dashboard-content">
            <h2>Analytics Dashboard</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Traffic Sources</h3>
                <div className="traffic-sources">
                  <div className="source-item">
                    <span>Direct</span>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '45%' }}></div>
                    </div>
                    <span>45%</span>
                  </div>
                  <div className="source-item">
                    <span>Social</span>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '30%' }}></div>
                    </div>
                    <span>30%</span>
                  </div>
                  <div className="source-item">
                    <span>Search</span>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '25%' }}></div>
                    </div>
                    <span>25%</span>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>User Engagement</h3>
                <div className="engagement-metrics">
                  <div className="metric">
                    <span className="metric-label">Page Views</span>
                    <span className="metric-value">12,543</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Session Duration</span>
                    <span className="metric-value">3m 24s</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Bounce Rate</span>
                    <span className="metric-value">42%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div className="dashboard-content">
            <h2>User Management</h2>
            <div className="users-table">
              <div className="table-header">
                <h3>All Users</h3>
                <button className="btn-primary">Add User</button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>john@example.com</td>
                      <td>Admin</td>
                      <td><span className="status active">Active</span></td>
                      <td>
                        <button className="btn-sm">Edit</button>
                        <button className="btn-sm btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Sarah Wilson</td>
                      <td>sarah@example.com</td>
                      <td>User</td>
                      <td><span className="status active">Active</span></td>
                      <td>
                        <button className="btn-sm">Edit</button>
                        <button className="btn-sm btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Mike Johnson</td>
                      <td>mike@example.com</td>
                      <td>User</td>
                      <td><span className="status inactive">Inactive</span></td>
                      <td>
                        <button className="btn-sm">Edit</button>
                        <button className="btn-sm btn-danger">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="dashboard-content">
            <h2>Settings</h2>
            <div className="settings-grid">
              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="setting-item">
                  <label>Site Name</label>
                  <input type="text" defaultValue="My Dashboard" />
                </div>
                <div className="setting-item">
                  <label>Email Notifications</label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="setting-item">
                  <label>Theme</label>
                  <select>
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>Security</h3>
                <div className="setting-item">
                  <label>Two-Factor Authentication</label>
                  <input type="checkbox" />
                </div>
                <div className="setting-item">
                  <label>Session Timeout</label>
                  <select>
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className="dashboard-content"><h2>Welcome to Dashboard</h2></div>;
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1>Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <span>🔍</span>
          </div>
          <div className="user-menu">
            <div className="user-avatar">👤</div>
            <span>{user?.firstName} {user?.lastName}</span>
            <div className="user-dropdown">
              <span>▼</span>
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <span>👤</span>
                  Profile
                </div>
                <div className="dropdown-item">
                  <span>⚙️</span>
                  Settings
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  <span>🚪</span>
                  Logout
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

