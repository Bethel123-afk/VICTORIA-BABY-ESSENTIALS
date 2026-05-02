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
         <h1 style={{fontSize: '3rem', margin: '10px 0 0 0'}}>Salutations, {userInfo.name.split(' ')[0]}</h1>
         <p style={{ color: 'var(--text-muted)', marginTop: '10px', fontSize: '1rem' }}>Synchronizing your boutique data for optimized neonatal care.</p>
      </header>

      <div className="stats-overview reveal-anim stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', marginBottom: '60px', marginTop: '40px' }}>
         <div className="stat-card-premium" style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', padding: '40px', borderRadius: '8px' }}>
            <div className="stat-icon" style={{ background: 'rgba(44, 62, 80, 0.05)', color: 'var(--primary)', width: '70px', height: '70px' }}>
                <i className="fas fa-archive" style={{fontSize: '1.5rem'}}></i>
            </div>
            <div className="stat-meta">
               <span className="stat-label" style={{ letterSpacing: '2px', fontSize: '0.6rem' }}>Manifest Count</span>
               <strong style={{ fontSize: '2rem' }}>{orders.length}</strong>
            </div>
         </div>
         <div className="stat-card-premium" style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', padding: '40px', borderRadius: '8px' }}>
            <div className="stat-icon" style={{ background: 'rgba(142, 151, 117, 0.05)', color: 'var(--secondary)', width: '70px', height: '70px' }}>
                <i className="fas fa-heart" style={{fontSize: '1.5rem'}}></i>
            </div>
            <div className="stat-meta">
               <span className="stat-label" style={{ letterSpacing: '2px', fontSize: '0.6rem' }}>Curated Items</span>
               <strong style={{ fontSize: '2rem' }}>{wishlistItems.length}</strong>
            </div>
         </div>
         <div className="stat-card-premium" style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', padding: '40px', borderRadius: '8px' }}>
            <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.05)', color: 'var(--accent)', width: '70px', height: '70px' }}>
                <i className="fas fa-shield-alt" style={{fontSize: '1.5rem'}}></i>
            </div>
            <div className="stat-meta">
               <span className="stat-label" style={{ letterSpacing: '2px', fontSize: '0.6rem' }}>Security Tier</span>
               <strong style={{fontSize: '0.75rem', color: 'var(--secondary)', letterSpacing: '1px'}}>VETTED MEMBER</strong>
            </div>
         </div>
      </div>

      <div className="recent-activity reveal-anim stagger-2" style={{ background: 'var(--white)', padding: '50px', borderRadius: '8px', border: '1px solid var(--gray-100)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
         <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '40px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '20px' }}>Expedited Protocol</h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <Link to="/dashboard/orders" className="btn btn-secondary compact" style={{ textAlign: 'center', padding: '18px' }}>Inspect Manifests</Link>
            <Link to="/dashboard/wishlist" className="btn btn-secondary compact" style={{ textAlign: 'center', padding: '18px' }}>Registry Access</Link>
            <Link to="/dashboard/profile" className="btn btn-secondary compact" style={{ textAlign: 'center', padding: '18px' }}>Identity Settings</Link>
            <Link to="/shop" className="btn btn-primary compact" style={{ textAlign: 'center', padding: '18px', letterSpacing: '2px' }}>Access Storefront</Link>
         </div>
      </div>
    </>
  );
};

export default DashboardHome;
