import React from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your profile and application preferences</p>
      </div>
      
      <div className="settings-grid">
        <div className="settings-section">
          <h3>Profile Settings</h3>
          <div className="setting-item">
            <label>Full Name</label>
            <input type="text" defaultValue="John Doe" />
          </div>
          <div className="setting-item">
            <label>Email</label>
            <input type="email" defaultValue="john@example.com" />
          </div>
          <div className="setting-item">
            <label>Department</label>
            <select>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>HR</option>
              <option>Finance</option>
            </select>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Leave Settings</h3>
          <div className="setting-item">
            <label>Annual Leave Days</label>
            <input type="number" defaultValue="24" />
          </div>
          <div className="setting-item">
            <label>Sick Leave Days</label>
            <input type="number" defaultValue="12" />
          </div>
          <div className="setting-item">
            <label>Email Notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
