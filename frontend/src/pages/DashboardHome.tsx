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

      <div className="recent-activity reveal-anim stagger-2" style={{ background: 'var(--white)', padding: '50px', borderRadius: '8px', border: '1px solid var(--gray-100)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', marginBottom: '40px' }}>
         <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '40px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '20px' }}>Recent Manifests</h3>
         {orders.length === 0 ? (
             <p style={{ color: 'var(--text-muted)' }}>No recent procurements found. <Link to="/shop" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Explore catalogue</Link></p>
         ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {orders.slice(0, 3).map((order: any) => (
                     <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid var(--gray-100)', borderRadius: '8px', flexWrap: 'wrap', gap: '15px' }}>
                         <div>
                             <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '5px' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                             <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>#{order._id.substring(0, 8).toUpperCase()}</strong>
                         </div>
                         <div>
                             <span style={{ padding: '5px 12px', background: order.isPaid ? 'rgba(142, 151, 117, 0.1)' : 'rgba(231, 76, 60, 0.1)', color: order.isPaid ? 'var(--secondary)' : 'var(--heart)', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                 {order.isPaid ? 'Paid' : 'Unpaid'}
                             </span>
                         </div>
                         <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                             ₦{order.totalPrice.toLocaleString()}
                         </div>
                         <Link to={`/order/${order._id}`} className="btn btn-secondary compact" style={{ padding: '8px 15px', fontSize: '0.7rem' }}>View</Link>
                     </div>
                 ))}
             </div>
         )}
      </div>

      <div className="recent-activity reveal-anim stagger-3" style={{ background: 'var(--white)', padding: '50px', borderRadius: '8px', border: '1px solid var(--gray-100)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
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
