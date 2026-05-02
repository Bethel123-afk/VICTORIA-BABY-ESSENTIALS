import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      alert('Thank you for subscribing to Victoria Journal!');
    }, 1200);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <h3>Victoria Boutique</h3>
            <p style={{ opacity: 0.7, lineHeight: 2 }}>A legacy of care, curated for the modern mother. We believe
                in simplicity, quality, and the profound beauty of life's earliest moments.</p>
          </div>
          <div className="footer-links">
            <h4>Atelier</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><a href="#about">About Us</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Customer Care</h4>
            <ul>
              <li><a href="#shipping"><i className="fas fa-truck" style={{marginRight: '8px', fontSize: '0.9em', color: 'var(--secondary)'}}></i>Shipping & Delivery</a></li>
              <li><a href="#returns"><i className="fas fa-undo" style={{marginRight: '8px', fontSize: '0.9em', color: 'var(--secondary)'}}></i>Returns Policy</a></li>
              <li><a href="#faq"><i className="fas fa-question-circle" style={{marginRight: '8px', fontSize: '0.9em', color: 'var(--secondary)'}}></i>FAQs</a></li>
              <li><a href="mailto:support@victoriababy.com"><i className="fas fa-envelope" style={{marginRight: '8px', fontSize: '0.9em', color: 'var(--secondary)'}}></i>Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>The Journal</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '20px' }}><i className="fas fa-envelope-open-text" style={{marginRight: '8px', color: 'var(--secondary)'}}></i>Join our archive for seasonal
                wisdom and new collections.</p>
            <form id="newsletter-form" onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                placeholder="Your Email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: 'white', flex: 1, fontFamily: 'inherit', fontSize: '0.8rem' }} />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ padding: '12px 20px', fontSize: '0.7rem' }}>
                {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : 'Join'}
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {(new Date()).getFullYear()} Victoria Boutique. All rights reserved.</p>
          <div className="footer-social">
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-snapchat"></i></a>
            <a href="#"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
