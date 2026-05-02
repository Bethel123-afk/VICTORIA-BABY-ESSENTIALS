import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { cartItems, openDrawer } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search');
    navigate(`/shop?search=${searchTerm}`);
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/" className="logo" onClick={closeMenu}>
            VICTORIA<span>ESTD. 2026</span>
          </Link>
          <nav className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}><i className="fas fa-home" style={{marginRight: '5px', fontSize: '0.9em'}}></i>Home</Link>
            <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''} onClick={closeMenu}><i className="fas fa-gem" style={{marginRight: '5px', fontSize: '0.9em'}}></i>Shop Collection</Link>
          </nav>

          <form onSubmit={handleSearch} className="header-search no-mobile" style={{ flex: 1, maxWidth: '300px', margin: '0 30px', position: 'relative' }}>
            <input name="search" type="text" placeholder="Search essentials..." style={{ width: '100%', padding: '10px 40px 10px 15px', borderRadius: '50px', border: '1px solid var(--gray-200)', fontSize: '0.8rem', background: 'var(--gray-100)' }} />
            <button type="submit" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)' }}><i className="fas fa-search"></i></button>
          </form>

          <div className="header-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {userInfo ? (
              <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                <Link to="/dashboard" style={{color: 'var(--primary)', fontSize: '1.2rem'}} title="My Dashboard"><i className="far fa-user"></i></Link>
                {userInfo.isAdmin && <Link to="/admin" style={{background: 'var(--secondary)', color: 'white', padding: '5px 10px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700}}>ADMIN</Link>}
              </div>
            ) : (
                <Link to="/login" style={{color: 'var(--primary)', fontSize: '1.2rem'}} title="Sign In"><i className="far fa-user"></i></Link>
            )}
            <button className="menu-toggle" id="mobile-menu-toggle" onClick={toggleMenu}
              style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--primary)', cursor: 'pointer' }}>
              <i className="fas fa-bars"></i>
            </button>
            <Link to="/dashboard/wishlist" className="wishlist-link"
              style={{ color: 'var(--primary)', fontSize: '1.2rem', transition: 'var(--transition)', position: 'relative' }}>
              <i className="far fa-heart"></i>
              {wishlistItems.length > 0 && (
                <span className="cart-count" style={{position: 'absolute', top: '-8px', right: '-8px', width: '16px', height: '16px', fontSize: '0.6rem'}}>{wishlistItems.length}</span>
              )}
            </Link>
            <div className="cart-icon" id="cart-toggle" onClick={openDrawer} style={{cursor: 'pointer'}}>
              <i className="fas fa-shopping-bag"></i>
              <span className="cart-count">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} id="mobile-menu">
        <div className="mobile-menu-content">
          <button className="close-menu" id="close-menu" onClick={closeMenu}>
            <i className="fas fa-times"></i>
          </button>
          <nav className="mobile-nav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}><i className="fas fa-home" style={{marginRight: '12px', color: 'var(--secondary)'}}></i>Home</Link>
            <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''} onClick={closeMenu}><i className="fas fa-gem" style={{marginRight: '12px', color: 'var(--secondary)'}}></i>Shop Collection</Link>
            <Link to="/dashboard/wishlist" className={location.pathname === '/dashboard/wishlist' ? 'active' : ''} onClick={closeMenu}><i className="fas fa-heart" style={{marginRight: '12px', color: 'var(--secondary)'}}></i>My Wishlist</Link>
            {userInfo ? (
              <>
                <Link to="/dashboard" onClick={closeMenu}><i className="fas fa-user-circle" style={{marginRight: '12px', color: 'var(--secondary)'}}></i>Dashboard</Link>
                {userInfo.isAdmin && <Link to="/admin" className="mobile-nav-auth" onClick={closeMenu} style={{background: 'var(--secondary)'}}><i className="fas fa-cog" style={{marginRight: '8px'}}></i>Admin</Link>}
              </>
            ) : (
              <Link to="/login" className="mobile-nav-auth" onClick={closeMenu}><i className="fas fa-sign-in-alt" style={{marginRight: '8px'}}></i>Sign In</Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
