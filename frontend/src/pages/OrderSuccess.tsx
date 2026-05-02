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
        <main className="container success-main">
            <div className="success-content reveal-anim">
                <div className="success-icon-wrapper">
                    <i className="fas fa-check"></i>
                </div>

                <span className="item-badge success-badge">Procurement Authorized</span>
                <h1 className="success-title">Gratitude for Your Selection</h1>
                <p className="success-desc">
                    Your order <strong className="id-mono">#{id?.slice(-8).toUpperCase()}</strong> has been successfully integrated into our fulfillment queue. 
                    A detailed manifest has been dispatched to your registered digital address.
                </p>

                <div className="success-stats-grid">
                    <div className="success-stat-card">
                        <span className="stat-label-small">Protocol Status</span>
                        <strong className="stat-value-highlight">PREPARING FOR LOGISTICS</strong>
                    </div>
                    <div className="success-stat-card">
                        <span className="stat-label-small">Estimated Dispatch</span>
                        <strong className="stat-value">24-48 BUSINESS HOURS</strong>
                    </div>
                </div>

                <div className="success-actions">
                    <Link to={`/order/${id}`} className="btn btn-primary action-btn">
                        INSPECT FULL MANIFEST
                    </Link>
                    <Link to="/shop" className="btn btn-secondary action-btn">
                        CONTINUE CURATION
                    </Link>
                </div>

                <p className="success-support">
                    Need immediate assistance? <Link to="/contact" className="support-link">Contact Logistics Support</Link>
                </p>
            </div>
        </main>
    );
};

export default OrderSuccess;
