import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import FlutterwavePayment from '../components/FlutterwavePayment';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Logistics, 2: Authorization
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState(userInfo ? userInfo.name : '');
  const [email, setEmail] = useState(userInfo ? userInfo.email : '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
  }, [userInfo, navigate]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = 0; // Free for now
  const totalPrice = itemsPrice + shippingPrice;

  const handleOrderPlaced = async (response: any) => {
    if (!userInfo) return;
    
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress: {
          fullName,
          address,
          city: 'Lagos',
          postalCode: '100001',
          country: 'Nigeria',
          phone: userInfo.phone || '0000000000',
        },
        paymentMethod: 'Flutterwave',
        totalPrice: totalPrice,
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentResult: {
          id: response.transaction_id,
          status: response.status,
          update_time: Date.now().toString(),
          email_address: userInfo.email,
        },
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      
      await axios.put(`/api/orders/${data._id}/pay`, {
          id: response.transaction_id,
          status: response.status,
          update_time: Date.now(),
          payer: { email_address: userInfo.email }
      }, config);

      clearCart();
      navigate(`/order/success/${data._id}`);
    } catch (err: any) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateLogistics = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!address || !fullName || !email) {
          setError('Incomplete Logistics Protocol Data.');
          return;
      }
      setStep(2);
      setError('');
  };

  if (!userInfo) return null;

  return (
    <main style={{ background: '#fafafa', minHeight: '100vh', paddingTop: '180px', paddingBottom: '120px' }}>
      <div className="container">
        {/* Checkout Progress - Protocol Style */}
        <div className="reveal-anim" style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginBottom: '100px' }}>
            {[
                { step: 1, label: 'Logistics', status: step === 1 ? 'active' : 'completed' },
                { step: 2, label: 'Authorization', status: step === 2 ? 'active' : 'pending' }
            ].map((s, idx) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ 
                            display: 'block', 
                            width: '35px', 
                            height: '35px', 
                            borderRadius: '50%', 
                            background: s.status === 'active' ? 'var(--primary)' : s.status === 'completed' ? 'var(--secondary)' : 'transparent', 
                            border: (s.status === 'active' || s.status === 'completed') ? 'none' : '1px solid var(--gray-200)',
                            color: (s.status === 'active' || s.status === 'completed') ? 'white' : 'var(--text-muted)', 
                            margin: '0 auto 10px', 
                            fontSize: '0.8rem', 
                            lineHeight: '35px', 
                            fontWeight: 700 
                        }}>
                            {s.status === 'completed' ? <i className="fas fa-check"></i> : s.step}
                        </span>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, opacity: s.status !== 'pending' ? 1 : 0.3 }}>
                            {s.label}
                        </span>
                    </div>
                    {idx < 1 && <div style={{ width: '60px', height: '1px', background: 'var(--gray-200)', marginTop: '-20px' }}></div>}
                </div>
            ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '100px', alignItems: 'start' }}>
            {/* Left: Secure Form */}
            <div className="reveal-anim stagger-1">
                <header style={{ marginBottom: '60px' }}>
                    <span className="item-badge" style={{ marginBottom: '15px' }}>SECURE PROCUREMENT PROTOCOL</span>
                    <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginBottom: '15px' }}>Finalize <span>Manifest</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>Ensure all logistics and valuation instruments are correctly identified before authorization.</p>
                </header>

                {error && <div className="reveal-anim" style={{ background: 'rgba(231, 76, 60, 0.05)', border: '1px solid var(--heart)', color: 'var(--heart)', padding: '20px', borderRadius: '4px', marginBottom: '40px', fontSize: '0.85rem' }}>{error}</div>}

                {step === 1 ? (
                    <form onSubmit={validateLogistics}>
                        <section style={{ marginBottom: '60px' }}>
                            <h3 style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '35px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '15px' }}>Logistics Registry</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div className="profile-field">
                                    <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '10px' }}>CLIENT FULL NAME</label>
                                    <input type="text" placeholder="Identity Verification" required value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '18px', background: 'white', border: '1px solid var(--gray-100)', borderRadius: '4px', outline: 'none' }} />
                                </div>
                                <div className="profile-field">
                                    <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '10px' }}>PROTOCOL EMAIL</label>
                                    <input type="email" placeholder="Communication Node" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '18px', background: 'white', border: '1px solid var(--gray-100)', borderRadius: '4px', outline: 'none' }} />
                                </div>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '10px' }}>LOGISTICS DESTINATION (STREET ADDRESS)</label>
                                <input type="text" placeholder="Physical Receipt Coordinates" required value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '18px', background: 'white', border: '1px solid var(--gray-100)', borderRadius: '4px', outline: 'none' }} />
                            </div>
                        </section>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '25px', borderRadius: '4px', letterSpacing: '4px', fontSize: '0.9rem' }}>
                            PROCEED TO AUTHORIZATION
                        </button>
                    </form>
                ) : (
                    <section className="reveal-anim">
                        <h3 style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '35px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '15px' }}>Financial Authorization</h3>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <i className="fas fa-circle-notch fa-spin" style={{ color: 'var(--secondary)', fontSize: '2rem' }}></i>
                                <p style={{ marginTop: '15px', fontSize: '0.7rem', letterSpacing: '1px' }}>TRANSMITTING MANIFEST...</p>
                            </div>
                        ) : (
                            <FlutterwavePayment 
                                amount={totalPrice} 
                                email={email}
                                userInfo={userInfo}
                                onOrderPlaced={handleOrderPlaced}
                                setError={setError}
                            />
                        )}
                        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', marginTop: '20px' }}>
                            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Adjust Logistics
                        </button>
                    </section>
                )}
                
                <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                    <i className="fas fa-shield-check" style={{ marginRight: '8px', color: 'var(--secondary)' }}></i> RAVE BY FLUTTERWAVE SECURE NODE
                </p>
            </div>

            {/* Right: Glassmorphism Summary */}
            <aside className="reveal-anim stagger-2" style={{ position: 'sticky', top: '150px' }}>
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.7)', 
                    backdropFilter: 'blur(20px)', 
                    padding: '45px', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.06)'
                }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '35px' }}>Manifest <span>Registry</span></h3>
                    
                    <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '15px', marginBottom: '40px' }}>
                        {cartItems.map(item => (
                            <div key={item.product} style={{ display: 'flex', gap: '20px', marginBottom: '25px', alignItems: 'center' }}>
                                <div style={{ width: '65px', height: '65px', background: 'white', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--gray-100)' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '5px', fontWeight: 600 }}>{item.name}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>UNIT QTY: {item.qty}</span>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>₦{(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <span style={{ letterSpacing: '1px' }}>Inventory Valuation</span>
                            <span>₦{itemsPrice.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <span style={{ letterSpacing: '1px' }}>Logistics Protocol</span>
                            <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>SUBSIDIZED</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '25px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '3px' }}>Total Liabilities</h3>
                            <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', fontWeight: 700 }}>₦{totalPrice.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div style={{ marginTop: '50px', display: 'flex', gap: '15px', padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                        <i className="fas fa-info-circle" style={{ color: 'var(--primary)', opacity: 0.3, marginTop: '3px' }}></i>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>Proceeding with authorization constitutes a legal acknowledgment of the Victoria Baby Essentials Procurement Protocol.</p>
                    </div>
                </div>
            </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
