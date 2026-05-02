import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : 'VA';
  };

  if (!userInfo) return null;

  return (
    <main className="dashboard-container">
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-only sidebar-toggle-btn" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '110px',
          left: '20px',
          zIndex: 1002,
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}
      >
        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`dashboard-aside ${sidebarOpen ? 'active' : ''}`}>
        <div className="aside-profile">
          <div className="profile-avatar">
            <span id="user-initials">{getInitials(userInfo.name)}</span>
          </div>
          <div className="profile-info">
             <h2 id="user-name-sidebar">{userInfo.name}</h2>
             <span className="user-rank">Vetted Member</span>
          </div>
        </div>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className={`dash-tab-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}>
             <i className="fas fa-th-large"></i> Overview
          </Link>
          <Link to="/dashboard/orders" className={`dash-tab-btn ${location.pathname.includes('/orders') ? 'active' : ''}`}>
             <i className="fas fa-archive"></i> Order History
          </Link>
          <Link to="/dashboard/wishlist" className={`dash-tab-btn ${location.pathname.includes('/wishlist') ? 'active' : ''}`}>
             <i className="fas fa-heart"></i> My Wishlist
          </Link>
          <Link to="/dashboard/profile" className={`dash-tab-btn ${location.pathname.includes('/profile') ? 'active' : ''}`}>
             <i className="fas fa-user-shield"></i> Profile Settings
          </Link>
        </nav>

        <div className="aside-footer">
          <span className="footer-label">Storefront</span>
          <Link to="/" className="aside-link">
             <i className="fas fa-home"></i> Home
          </Link>
          <Link to="/shop" className="aside-link">
             <i className="fas fa-store"></i> Shop
          </Link>
          <button onClick={logoutHandler} className="dash-tab-btn logout-link">
             <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </aside>

      <div className="dashboard-content reveal-anim">
         <Outlet />
      </div>
    </main>
  );
};

export default DashboardLayout;

