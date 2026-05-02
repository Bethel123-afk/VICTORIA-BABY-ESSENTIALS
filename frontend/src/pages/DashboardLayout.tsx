import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : 'VA';
  };

  if (!userInfo) return null;

  return (
    <main className="dashboard-container" style={{paddingTop: '100px'}}>
      <aside className="dashboard-aside">
        <div className="aside-profile">
          <div className="profile-avatar" style={{width: '60px', height: '60px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '1.2rem'}}>
            <span id="user-initials">{getInitials(userInfo.name)}</span>
          </div>
          <div className="profile-info" style={{marginTop: '15px'}}>
             <h2 id="user-name-sidebar" style={{fontSize: '1.2rem', margin: 0}}>{userInfo.name}</h2>
             <span className="user-rank" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Vetted Member</span>
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
          <button onClick={logoutHandler} className="dash-tab-btn logout-link" style={{border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: '10px'}}>
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
