import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IOrder } from '../types';

const DashboardOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { userInfo, logout } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch (err: any) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [userInfo]);

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'Delivered': return { background: 'rgba(142, 151, 117, 0.1)', color: 'var(--secondary)', border: '1px solid var(--secondary)' };
      case 'Shipped': return { background: 'rgba(44, 62, 80, 0.05)', color: 'var(--primary)', border: '1px solid var(--primary)' };
      case 'Processing': return { background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)' };
      default: return { background: 'var(--gray-100)', color: 'var(--text-muted)', border: '1px solid var(--gray-200)' };
    }
  };

  if (!userInfo) return null;

  return (
    <>
      <header className="content-header">
         <span className="breadcrumb">Account / Manifest History</span>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
               <h1 style={{fontSize: '2.8rem', margin: '10px 0 0 0'}}>Procurement History</h1>
               <p className="section-description" style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.6 }}>
                 A chronological registry of your neonatal essential acquisitions and their logistical status.
               </p>
             </div>
             <button onClick={logout} className="btn btn-primary compact" style={{ padding: '12px 25px', background: 'var(--heart)' }}>
                  <i className="fas fa-sign-out-alt"></i> Exit
             </button>
         </div>
      </header>

      <div id="order-list-full" className="reveal-anim" style={{marginTop: '40px'}}>
         {loading ? (
             <div className="empty-state-card" style={{padding: '100px 50px', background: 'var(--white)', border: '1px solid var(--gray-100)', textAlign: 'center', borderRadius: '8px'}}>
                 <i className="fas fa-circle-notch fa-spin fa-2x" style={{color: 'var(--primary)', marginBottom: '20px'}}></i>
                 <p style={{letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.7rem'}}>Accessing Manifest Records...</p>
             </div>
         ) : error ? (
             <div className="empty-state-card" style={{padding: '50px', background: 'rgba(231, 76, 60, 0.05)', color: 'var(--heart)', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--heart)'}}>
                 <i className="fas fa-exclamation-circle fa-2x" style={{marginBottom: '15px'}}></i>
                 <p>{error}</p>
             </div>
         ) : orders.length === 0 ? (
             <div className="empty-state-card" style={{padding: '100px 50px', background: 'rgba(255, 255, 255, 0.5)', border: '1px dashed var(--gray-200)', textAlign: 'center', borderRadius: '8px'}}>
                 <i className="fas fa-box-open fa-3x" style={{color: 'var(--gray-200)', marginBottom: '20px'}}></i>
                 <h2 style={{fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '10px'}}>No Records Found</h2>
                 <p style={{color: 'var(--text-muted)', marginBottom: '30px'}}>Your procurement history is currently empty.</p>
                 <Link to="/shop" className="btn btn-primary compact">Initiate Procurement</Link>
             </div>
         ) : (
             <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
               {orders.map(order => (
                 <div key={order._id} className="profile-card-premium reveal-anim" style={{padding: '35px', borderRadius: '8px', border: '1px solid var(--gray-100)', background: 'var(--white)', position: 'relative', overflow: 'hidden'}}>
                    {/* Progress Bar Top */}
                    <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: order.isPaid ? 'var(--secondary)' : 'var(--gray-200)'}}></div>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '25px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '20px'}}>
                       <div style={{display: 'flex', gap: '40px'}}>
                          <div>
                            <span style={{fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px'}}>Order Reference</span>
                            <h4 style={{fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 600}}>#{order._id.slice(-12).toUpperCase()}</h4>
                          </div>
                          <div>
                            <span style={{fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px'}}>Procurement Date</span>
                            <h4 style={{fontSize: '0.9rem'}}>{new Date(order.createdAt!).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}</h4>
                          </div>
                       </div>
                       <div style={{textAlign: 'right'}}>
                         <span style={{fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px'}}>Total Liability</span>
                         <h4 style={{fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 700}}>₦{order.totalPrice.toLocaleString()}</h4>
                       </div>
                    </div>

                    {/* History Items with Options */}
                    <div style={{ marginBottom: '25px' }}>
                       <h5 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Manifest Items</h5>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {order.orderItems && order.orderItems.map((item, index) => (
                             <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--gray-50)', padding: '15px', borderRadius: '8px', border: '1px solid var(--gray-100)', flexWrap: 'wrap', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                   <div style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', background: 'var(--white)', border: '1px solid var(--gray-200)', flexShrink: 0 }}>
                                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                   </div>
                                   <div>
                                      <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>{item.name}</p>
                                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.qty} × ₦{item.price.toLocaleString()}</p>
                                   </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                   <Link to={`/product/${item.product}`} className="btn btn-secondary compact" style={{ padding: '8px 15px', fontSize: '0.7rem', display: 'flex', alignItems: 'center' }}>
                                      <i className="fas fa-eye" style={{ marginRight: '5px' }}></i> View
                                   </Link>
                                   <Link to={`/product/${item.product}`} className="btn btn-primary compact" style={{ padding: '8px 15px', fontSize: '0.7rem', display: 'flex', alignItems: 'center' }}>
                                      <i className="fas fa-sync-alt" style={{ marginRight: '5px' }}></i> Reorder
                                   </Link>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
                       <div style={{display: 'flex', gap: '12px'}}>
                          <div style={{
                            ...getStatusStyle(order.status),
                            padding: '6px 15px',
                            borderRadius: '50px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor'}}></span>
                            {order.status || 'Placed'}
                          </div>
                          
                          <div style={{
                            background: order.isPaid ? 'rgba(142, 151, 117, 0.05)' : 'rgba(231, 76, 60, 0.05)',
                            color: order.isPaid ? 'var(--secondary)' : 'var(--heart)',
                            padding: '6px 15px',
                            borderRadius: '50px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            border: `1px solid ${order.isPaid ? 'var(--secondary)' : 'var(--heart)'}`
                          }}>
                             {order.isPaid ? 'Verified Payment' : 'Payment Required'}
                          </div>
                       </div>
                       
                       <Link to={`/order/${order._id}`} className="btn btn-primary compact" style={{padding: '10px 30px', fontSize: '0.65rem', letterSpacing: '1px'}}>
                          Inspect Manifest
                       </Link>
                    </div>
                 </div>
               ))}
             </div>
         )}
      </div>
    </>
  );
};

export default DashboardOrders;
