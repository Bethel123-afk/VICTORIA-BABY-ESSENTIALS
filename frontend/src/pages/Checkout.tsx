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
    <main className="checkout-main">
      <div className="container">
        {/* Checkout Progress - Protocol Style */}
        <div className="checkout-progress-bar reveal-anim">
            {[
                { step: 1, label: 'Logistics', status: step === 1 ? 'active' : 'completed' },
                { step: 2, label: 'Authorization', status: step === 2 ? 'active' : 'pending' }
            ].map((s, idx) => (
                <div key={s.step} className="progress-step">
                    <div className="step-indicator">
                        <span className={`step-number ${s.status}`}>
                            {s.status === 'completed' ? <i className="fas fa-check"></i> : s.step}
                        </span>
                        <span className="step-label">
                            {s.label}
                        </span>
                    </div>
                    {idx < 1 && <div className="step-connector"></div>}
                </div>
            ))}
        </div>

        <div className="checkout-layout">
            {/* Left: Secure Form */}
            <div className="checkout-form-column reveal-anim stagger-1">
                <header className="checkout-header">
                    <span className="item-badge">SECURE PROCUREMENT PROTOCOL</span>
                    <h1 className="checkout-main-title">Finalize <span>Manifest</span></h1>
                    <p className="checkout-desc">Ensure all logistics and valuation instruments are correctly identified before authorization.</p>
                </header>

                {error && <div className="error-banner reveal-anim">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={validateLogistics} className="checkout-form">
                        <section className="form-section">
                            <h3 className="section-subtitle-small">Logistics Registry</h3>
                            <div className="form-grid-dual">
                                <div className="form-group">
                                    <label className="form-label-muted">CLIENT FULL NAME</label>
                                    <input type="text" placeholder="Identity Verification" required value={fullName} onChange={e => setFullName(e.target.value)} className="form-input-light" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label-muted">PROTOCOL EMAIL</label>
                                    <input type="email" placeholder="Communication Node" required value={email} onChange={e => setEmail(e.target.value)} className="form-input-light" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label-muted">LOGISTICS DESTINATION (STREET ADDRESS)</label>
                                <input type="text" placeholder="Physical Receipt Coordinates" required value={address} onChange={e => setAddress(e.target.value)} className="form-input-light" />
                            </div>
                        </section>
                        <button type="submit" className="btn btn-primary checkout-btn-large">
                            PROCEED TO AUTHORIZATION
                        </button>
                    </form>
                ) : (
                    <section className="authorization-section reveal-anim">
                        <h3 className="section-subtitle-small">Financial Authorization</h3>
                        {loading ? (
                            <div className="loading-state">
                                <i className="fas fa-circle-notch fa-spin"></i>
                                <p>TRANSMITTING MANIFEST...</p>
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
                        <button onClick={() => setStep(1)} className="back-btn">
                            <i className="fas fa-arrow-left"></i> Adjust Logistics
                        </button>
                    </section>
                )}
                
                <p className="security-note">
                    <i className="fas fa-shield-check"></i> RAVE BY FLUTTERWAVE SECURE NODE
                </p>
            </div>

            {/* Right: Summary */}
            <aside className="checkout-summary-column reveal-anim stagger-2">
                <div className="checkout-summary-card">
                    <h3 className="summary-title">Manifest <span>Registry</span></h3>
                    
                    <div className="summary-items-list">
                        {cartItems.map(item => (
                            <div key={item.product} className="summary-item-row">
                                <div className="item-img-small">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-info">
                                    <h4 className="item-name-tiny">{item.name}</h4>
                                    <div className="item-price-row">
                                        <span className="item-qty">UNIT QTY: {item.qty}</span>
                                        <span className="item-subtotal">₦{(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="summary-calculations">
                        <div className="calc-row">
                            <span className="label">Inventory Valuation</span>
                            <span className="value">₦{itemsPrice.toLocaleString()}</span>
                        </div>
                        <div className="calc-row">
                            <span className="label">Logistics Protocol</span>
                            <span className="value highlight">SUBSIDIZED</span>
                        </div>
                        <div className="total-row">
                            <h3 className="total-label">Total Liabilities</h3>
                            <h3 className="total-value">₦{totalPrice.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="legal-note">
                        <i className="fas fa-info-circle"></i>
                        <p>Proceeding with authorization constitutes a legal acknowledgment of the Victoria Baby Essentials Procurement Protocol.</p>
                    </div>
                </div>
            </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
