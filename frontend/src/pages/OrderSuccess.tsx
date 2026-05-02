import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderSuccess: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [, setConfetti] = useState(false);

    useEffect(() => {
        setConfetti(true);
        // Clear cart or other post-purchase local logic if needed
        localStorage.removeItem('cartItems');
    }, []);

    return (
        <main className="container" style={{ paddingTop: '160px', paddingBottom: '100px', textAlign: 'center' }}>
            <div className="reveal-anim" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ 
                    width: '100px', height: '100px', background: 'var(--secondary)', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', margin: '0 auto 40px auto', color: 'white',
                    boxShadow: '0 20px 40px rgba(142, 151, 117, 0.3)'
                }}>
                    <i className="fas fa-check" style={{ fontSize: '3rem' }}></i>
                </div>

                <span className="item-badge" style={{ marginBottom: '20px' }}>Procurement Authorized</span>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', marginBottom: '20px' }}>Gratitude for Your Selection</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '40px' }}>
                    Your order <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>#{id?.slice(-8).toUpperCase()}</strong> has been successfully integrated into our fulfillment queue. 
                    A detailed manifest has been dispatched to your registered digital address.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '60px' }}>
                    <div style={{ background: 'var(--gray-100)', padding: '25px', borderRadius: '4px' }}>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Protocol Status</span>
                        <strong style={{ color: 'var(--secondary)' }}>PREPARING FOR LOGISTICS</strong>
                    </div>
                    <div style={{ background: 'var(--gray-100)', padding: '25px', borderRadius: '4px' }}>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Estimated Dispatch</span>
                        <strong>24-48 BUSINESS HOURS</strong>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Link to={`/order/${id}`} className="btn btn-primary" style={{ padding: '20px', letterSpacing: '2px' }}>
                        INSPECT FULL MANIFEST
                    </Link>
                    <Link to="/shop" className="btn btn-secondary" style={{ padding: '20px', letterSpacing: '2px' }}>
                        CONTINUE CURATION
                    </Link>
                </div>

                <p style={{ marginTop: '40px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Need immediate assistance? <Link to="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact Logistics Support</Link>
                </p>
            </div>
        </main>
    );
};

export default OrderSuccess;
