import React from 'react';
import './Calendar.css';

const Calendar: React.FC = () => {
  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Calendar</h1>
        <p>View and manage your leave calendar</p>
      </div>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <h3>Leave Calendar</h3>
          <div className="calendar-controls">
            <button className="btn-secondary">Today</button>
            <button className="btn-secondary">Month</button>
            <button className="btn-secondary">Year</button>
          </div>
        </div>
        <div className="calendar-grid">
          <div className="calendar-placeholder">
            <div className="calendar-month">
              <div className="month-header">December 2024</div>
              <div className="days-grid">
                {Array.from({ length: 31 }, (_, i) => (
                  <div key={i} className={`day ${i === 15 ? 'leave-day' : ''}`}>
                    {i + 1}
                    {i === 15 && <span className="leave-indicator">L</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
