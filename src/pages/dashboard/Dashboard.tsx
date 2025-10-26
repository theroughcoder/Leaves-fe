import React from 'react';
import './Dashboard.css';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Welcome to Dashboard</h1>
        <p>Manage your leaves and track your time off</p>
      </div>
      
      <div className="welcome-stats">
        <div className="stat-card">
          <h3>Total Leaves</h3>
          <div className="stat-value">24</div>
          <div className="stat-description">Annual leave days</div>
        </div>
        <div className="stat-card">
          <h3>Used This Year</h3>
          <div className="stat-value">8</div>
          <div className="stat-description">Days taken</div>
        </div>
        <div className="stat-card">
          <h3>Remaining</h3>
          <div className="stat-value">16</div>
          <div className="stat-description">Days available</div>
        </div>
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <div className="stat-value">2</div>
          <div className="stat-description">Awaiting approval</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

