import React from 'react';
import './Reports.css';

const Reports: React.FC = () => {
  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
        <p>Analytics and insights for leave management</p>
      </div>
      
      <div className="reports-container">
        <div className="reports-grid">
          <div className="report-card">
            <h3>Leave Summary</h3>
            <div className="report-content">
              <div className="report-chart">
                <div className="chart-bars">
                  {[65, 45, 80, 55, 70, 90, 75].map((height, index) => (
                    <div key={index} className="bar" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
              </div>
              <div className="report-stats">
                <div className="stat">
                  <span>Total Requests</span>
                  <span>156</span>
                </div>
                <div className="stat">
                  <span>Approved</span>
                  <span>142</span>
                </div>
                <div className="stat">
                  <span>Pending</span>
                  <span>14</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="report-card">
            <h3>Team Attendance</h3>
            <div className="attendance-list">
              <div className="attendance-item">
                <span>John Doe</span>
                <span className="attendance-rate">95%</span>
              </div>
              <div className="attendance-item">
                <span>Sarah Wilson</span>
                <span className="attendance-rate">98%</span>
              </div>
              <div className="attendance-item">
                <span>Mike Johnson</span>
                <span className="attendance-rate">92%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
