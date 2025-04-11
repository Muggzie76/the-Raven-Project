import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../auth/authService';
import PostsTab from './PostsTab';
import OverviewTab from './OverviewTab';
import IILogsViewer from './IILogsViewer';
import NuanceImportTab from './NuanceImportTab';
import { FaHome, FaNewspaper, FaUsers, FaCog, FaSignOutAlt, FaShieldAlt, FaDownload } from 'react-icons/fa';
import './NuanceImportTab.css';

const AdminDashboard = ({ section = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(section);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await authService.isAuthenticated();
        if (!isAuthenticated) {
          navigate('/admin/login', { state: { from: window.location.pathname } });
          return;
        }
        
        // Get user principal ID
        const principal = authService.getPrincipalText();
        setUser({
          principal,
          isAdmin: authService.isAdmin()
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Update active tab when section prop changes
  useEffect(() => {
    if (section) {
      setActiveTab(section);
    }
  }, [section]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout fails
      navigate('/admin/login');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'posts':
        return <PostsTab />;
      case 'users':
        return (
          <div className="tab-placeholder">
            <h2>User Management</h2>
            <p>This feature is coming soon. User management will be available in the next update.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="tab-placeholder">
            <h2>Settings</h2>
            <p>This feature is coming soon. Settings management will be available in the next update.</p>
          </div>
        );
      case 'security':
        return <IILogsViewer />;
      case 'import':
        return <NuanceImportTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h1>Raven Admin</h1>
          {user && (
            <div className="admin-principal">
              <span className="principal-label">Principal:</span>
              <span className="principal-id">{user.principal}</span>
            </div>
          )}
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaHome /> <span>Overview</span>
          </button>
          <button
            className={`nav-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <FaNewspaper /> <span>Posts</span>
          </button>
          <button
            className={`nav-button ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <FaDownload /> <span>Nuance Import</span>
          </button>
          <button
            className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> <span>Users</span>
          </button>
          <button
            className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> <span>Settings</span>
          </button>
          <button
            className={`nav-button ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaShieldAlt /> <span>Security Logs</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="content-header">
          <h2>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'posts' && 'Post Management'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'settings' && 'Settings'}
            {activeTab === 'security' && 'Security Logs'}
            {activeTab === 'import' && 'Nuance Article Import'}
          </h2>
        </header>
        
        <div className="content-body">
          {renderTabContent()}
        </div>
      </main>
      
      <style jsx>{`
        .admin-dashboard {
          display: grid;
          grid-template-columns: 250px 1fr;
          min-height: 100vh;
          background-color: #2F2F2F;
          color: #FFFFFF;
        }
        
        .dashboard-sidebar {
          background-color: #1A1A1A;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(148, 0, 211, 0.3);
        }
        
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(148, 0, 211, 0.3);
        }
        
        .sidebar-header h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #9400D3;
        }
        
        .admin-principal {
          margin-top: 10px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .principal-label {
          display: block;
          margin-bottom: 3px;
          font-weight: 600;
        }
        
        .principal-id {
          display: block;
          font-family: monospace;
          word-break: break-all;
        }
        
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem 0;
        }
        
        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.5rem;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          text-align: left;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .nav-button:hover {
          background: rgba(148, 0, 211, 0.1);
          color: #FFFFFF;
        }
        
        .nav-button.active {
          background: rgba(148, 0, 211, 0.2);
          color: #9400D3;
          border-left: 3px solid #9400D3;
        }
        
        .sidebar-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(148, 0, 211, 0.3);
        }
        
        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 0, 0, 0.1);
          color: #f44336;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .logout-button:hover {
          background: rgba(255, 0, 0, 0.2);
        }
        
        .dashboard-content {
          display: flex;
          flex-direction: column;
        }
        
        .content-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(148, 0, 211, 0.3);
        }
        
        .content-header h2 {
          margin: 0;
          color: #9400D3;
        }
        
        .content-body {
          flex: 1;
          overflow: auto;
          padding: 20px;
        }
        
        .tab-placeholder {
          padding: 2rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #2F2F2F;
          color: #FFFFFF;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(148, 0, 211, 0.3);
          border-top: 4px solid #9400D3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .admin-dashboard {
            grid-template-columns: 1fr;
          }
          
          .dashboard-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 250px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 10;
          }
          
          .dashboard-sidebar.active {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard; 