import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const DashboardHome: React.FC = () => {
  const { userInfo } = useAuth();
  const { wishlistItems } = useWishlist();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) return;
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, [userInfo]);

  if (!userInfo) return null;

  return (
    <>
      <header className="content-header">
         <span className="breadcrumb">Account / Strategic Overview</span>
         <h1 className="welcome-title">Salutations, {userInfo.name.split(' ')[0]}</h1>
         <p className="welcome-subtitle">Synchronizing your boutique data for optimized neonatal care.</p>
      </header>

      <div className="stats-overview reveal-anim stagger-1">
         <div className="stat-card-premium">
            <div className="stat-icon manifest-icon">
                <i className="fas fa-archive"></i>
            </div>
            <div className="stat-meta">
               <span className="stat-label">Manifest Count</span>
               <strong className="stat-value">{orders.length}</strong>
            </div>
         </div>
         <div className="stat-card-premium">
            <div className="stat-icon heart-icon">
                <i className="fas fa-heart"></i>
            </div>
            <div className="stat-meta">
               <span className="stat-label">Curated Items</span>
               <strong className="stat-value">{wishlistItems.length}</strong>
            </div>
         </div>
         <div className="stat-card-premium">
            <div className="stat-icon security-icon">
                <i className="fas fa-shield-alt"></i>
            </div>
            <div className="stat-meta">
               <span className="stat-label">Security Tier</span>
               <strong className="stat-badge">VETTED MEMBER</strong>
            </div>
         </div>
      </div>

      <div className="recent-activity reveal-anim stagger-2">
         <h3 className="section-subtitle">Recent Manifests</h3>
         {orders.length === 0 ? (
             <p className="no-data-msg">No recent procurements found. <Link to="/shop" className="explore-link">Explore catalogue</Link></p>
         ) : (
             <div className="activity-list">
                 {orders.slice(0, 3).map((order: any) => (
                     <div key={order._id} className="activity-item">
                         <div className="item-identity">
                             <span className="item-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                             <strong className="item-id">#{order._id.substring(0, 8).toUpperCase()}</strong>
                         </div>
                         <div className="item-status">
                             <span className={`status-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                                 {order.isPaid ? 'Paid' : 'Unpaid'}
                             </span>
                         </div>
                         <div className="item-price-total">
                             ₦{order.totalPrice.toLocaleString()}
                         </div>
                         <div className="item-actions">
                            <Link to={`/order/${order._id}`} className="btn btn-secondary compact">View</Link>
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>

      <div className="recent-activity reveal-anim stagger-3">
         <h3 className="section-subtitle">Expedited Protocol</h3>
         <div className="protocol-grid">
            <Link to="/dashboard/orders" className="btn btn-secondary compact">Inspect Manifests</Link>
            <Link to="/dashboard/wishlist" className="btn btn-secondary compact">Registry Access</Link>
            <Link to="/dashboard/profile" className="btn btn-secondary compact">Identity Settings</Link>
            <Link to="/shop" className="btn btn-primary compact">Access Storefront</Link>
         </div>
      </div>
    </>
  );
};

export default DashboardHome;
