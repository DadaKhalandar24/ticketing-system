import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <div className="logo">Admin Panel</div>
        </div>
        
        <nav>
          <ul className="sidebar-nav">
            <li>
              <Link to="/" className={isActive('/')}>
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link to="/analytics" className={isActive('/analytics')}>
                📈 Analytics
              </Link>
            </li>
            <li>
              <Link to="/tickets" className={isActive('/tickets')}>
                🎫 Ticket Management
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link to="/users" className={isActive('/users')}>
                  👥 User Management
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                  Welcome back, {user?.name}
                </h1>
                <p style={{ margin: 0, opacity: 0.8 }}>
                  {user?.role === 'admin' ? 'Administrator' : 'Support Agent'} Panel
                </p>
              </div>
              <div className="user-info">
                <span className={`role-badge role-${user?.role}`}>
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </span>
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;