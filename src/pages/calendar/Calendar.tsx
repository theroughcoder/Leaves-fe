import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import './Calendar.css';
import MyCalendar from '../../components/Calendar';
import { Views } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
// @ts-ignore
import events from '../../data/events';

const Calendar: React.FC = () => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const goToToday = () => {
    setDate(new Date());
  };

  const goToPrevious = () => {
    let newDate: Date;
    if (view === Views.DAY) {
      newDate = dayjs(date).subtract(1, 'day').toDate();
    } else if (view === Views.WEEK) {
      newDate = dayjs(date).subtract(1, 'week').toDate();
    } else {
      newDate = dayjs(date).subtract(1, 'month').toDate();
    }
    setDate(newDate);
  };

  const goToNext = () => {
    let newDate: Date;
    if (view === Views.DAY) {
      newDate = dayjs(date).add(1, 'day').toDate();
    } else if (view === Views.WEEK) {
      newDate = dayjs(date).add(1, 'week').toDate();
    } else {
      newDate = dayjs(date).add(1, 'month').toDate();
    }
    setDate(newDate);
  };

  const summary = useMemo(() => {
    let dateLabel: string;
    if (view === Views.DAY) {
      dateLabel = dayjs(date).format('MMMM D, YYYY');
    } else if (view === Views.WEEK) {
      const weekStart = dayjs(date).startOf('week');
      const weekEnd = dayjs(date).endOf('week');
      if (weekStart.month() === weekEnd.month()) {
        dateLabel = `${weekStart.format('MMMM D')} - ${weekEnd.format('D, YYYY')}`;
      } else {
        dateLabel = `${weekStart.format('MMM D')} - ${weekEnd.format('MMM D, YYYY')}`;
      }
    } else {
      dateLabel = dayjs(date).format('MMMM, YYYY');
    }
    const totalEvents = events.length;
    return {
      dateLabel,
      totalEvents,
    };
  }, [date, view]);

  return (
    <div className="calendar-page">
      <div className="calendar-hero">
        <div>
          <p className="calendar-hero__eyebrow">Calendar</p>
          <div className="calendar-hero__title-wrapper">
            <button className="nav-button" onClick={goToPrevious} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="calendar-hero__title">{summary.dateLabel}</h1>
            <button className="nav-button" onClick={goToNext} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <button className="calendar-hero__events">
            <span role="img" aria-hidden="true">📅</span> {summary.totalEvents} event{summary.totalEvents !== 1 ? 's' : ''}
          </button>
        </div>
        <div className="calendar-hero__actions">
          <div className="timezone-pill">
            <span>UTC +1</span>
          </div>
          <button className="btn-primary" onClick={goToToday}>
            Jump to today
          </button>
        </div>
      </div>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-view-toggle">
            <button 
              className={`toggle ${view === Views.DAY ? 'active' : ''}`}
              onClick={() => setView(Views.DAY)}
            >
              Day
            </button>
            <button 
              className={`toggle ${view === Views.WEEK ? 'active' : ''}`}
              onClick={() => setView(Views.WEEK)}
            >
              Week
            </button>
            <button 
              className={`toggle ${view === Views.MONTH ? 'active' : ''}`}
              onClick={() => setView(Views.MONTH)}
            >
              Month
            </button>
          </div>
        </div>
        <div className="calendar-grid">
          <MyCalendar 
            view={view}
            onViewChange={handleViewChange}
            date={date}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
