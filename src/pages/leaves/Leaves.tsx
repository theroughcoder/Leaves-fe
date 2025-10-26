import React from 'react';
import './Leaves.css';

const Leaves: React.FC = () => {
  return (
    <div className="leaves-page">
      <div className="page-header">
        <h1>Leave Management</h1>
        <p>Request and track your leave applications</p>
      </div>
      
      <div className="leaves-container">
        <div className="leaves-header">
          <h3>My Leaves</h3>
          <button className="btn-primary">Request Leave</button>
        </div>
        <div className="leaves-stats">
          <div className="stat-card">
            <h4>Total Leaves</h4>
            <span className="stat-value">24</span>
          </div>
          <div className="stat-card">
            <h4>Used Leaves</h4>
            <span className="stat-value">8</span>
          </div>
          <div className="stat-card">
            <h4>Remaining</h4>
            <span className="stat-value">16</span>
          </div>
        </div>
        <div className="leaves-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dec 15, 2024</td>
                <td>Annual Leave</td>
                <td><span className="status approved">Approved</span></td>
                <td>1 day</td>
              </tr>
              <tr>
                <td>Dec 20, 2024</td>
                <td>Sick Leave</td>
                <td><span className="status pending">Pending</span></td>
                <td>2 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaves;
