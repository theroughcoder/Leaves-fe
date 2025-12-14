import React from 'react';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import './Layout.css';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  return (
    <div className={`layout${isAdmin ? ' admin-theme' : ''}`}>
      <DashboardHeader />

      <div className="layout-body">
        <Sidebar />

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
