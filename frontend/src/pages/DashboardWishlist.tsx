import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import PremiumImage from '../components/PremiumImage';

const DashboardWishlist: React.FC = () => {
  const { logout } = useAuth();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleClearWishlist = () => {
    if (window.confirm('Are you certain you wish to purge your curated selection?')) {
      clearWishlist();
    }
  };

  return (
    <>
      <header className="content-header">
         <span className="breadcrumb">Account / Wishlist Registry</span>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
               <h1 style={{fontSize: '2.8rem', margin: '10px 0 0 0'}}>Curated Essentials</h1>
               <p className="section-description" style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.6 }}>
                  A sophisticated archive of your selected neonatal requirements for future procurement.
               </p>
             </div>
             <div style={{display: 'flex', gap: '15px'}}>
               {wishlistItems.length > 0 && (
                 <button onClick={handleClearWishlist} className="btn btn-secondary compact" style={{ padding: '12px 25px' }}>
                    Purge Registry
                 </button>
               )}
               <button onClick={logout} className="btn btn-primary compact" style={{ padding: '12px 25px', background: 'var(--heart)' }}>
                    <i className="fas fa-sign-out-alt"></i> Exit
               </button>
             </div>
         </div>
      </header>

      <div className="reveal-anim" style={{marginTop: '40px'}}>
         {wishlistItems.length === 0 ? (
             <div className="empty-state-card" style={{
                 padding: '120px 50px', 
                 background: 'rgba(255, 255, 255, 0.5)', 
                 backdropFilter: 'blur(5px)',
                 border: '1px dashed var(--gray-200)', 
                 textAlign: 'center', 
                 borderRadius: '8px',
                 animation: 'premiumFadeUp 1s ease'
             }}>
                 <div style={{
                     width: '100px',
                     height: '100px',
                     background: 'var(--background)',
                     borderRadius: '50%',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     margin: '0 auto 30px auto',
                     color: 'var(--gray-200)'
                 }}>
                    <i className="far fa-heart" style={{fontSize: '2.5rem'}}></i>
                 </div>
                 <h2 style={{fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '10px'}}>Archive Empty</h2>
                 <p style={{color: 'var(--text-muted)', marginBottom: '35px', maxWidth: '400px', margin: '0 auto 35px auto'}}>Your registry currently holds no curated data. Explore the storefront to begin your selection.</p>
                 <Link to="/shop" className="btn btn-primary" style={{padding: '18px 40px', fontSize: '0.75rem'}}>Access Storefront</Link>
             </div>
         ) : (
            <div className="wishlist-grid order-records-grid">
                {wishlistItems.map(item => (
                    <div className="item-card reveal-anim wishlist-product-card" key={item._id} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '100%',
                        background: 'var(--white)',
                        borderRadius: '8px',
                        border: '1px solid var(--gray-100)',
                        transition: 'var(--transition-premium)'
                    }}>
                       <div className="img-wrapper wishlist-img-wrapper" style={{
                           background: 'var(--gray-100)', 
                           width: '100%', 
                           overflow: 'hidden', 
                           position: 'relative',
                           borderRadius: '4px'
                       }}>
                         <PremiumImage src={item.image} alt={item.name} />
                         <button 
                            onClick={() => removeFromWishlist(item._id)} 
                            className="btn-save-archive" 
                            style={{
                                position: 'absolute', 
                                top: '12px', 
                                right: '12px', 
                                background: 'rgba(255, 255, 255, 0.9)', 
                                color: 'var(--heart)',
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                transition: '0.3s'
                            }}>
                            <i className="fas fa-trash-alt" style={{fontSize: '0.85rem'}}></i>
                         </button>
                         <div style={{
                             position: 'absolute',
                             bottom: '10px',
                             left: '10px',
                             background: 'var(--secondary)',
                             color: 'white',
                             padding: '4px 10px',
                             fontSize: '0.6rem',
                             textTransform: 'uppercase',
                             letterSpacing: '1px',
                             fontWeight: 700,
                             borderRadius: '2px'
                         }}>
                             {item.category}
                         </div>
                       </div>
                       
                       <div className="item-meta" style={{marginTop: '20px', flex: 1}}>
                         <h4 style={{fontSize: '1.1rem', marginBottom: '8px', color: 'var(--primary)'}}>{item.name}</h4>
                         <p className="price" style={{fontSize: '1.3rem', color: 'var(--primary)', fontWeight: 700}}>₦{item.price.toLocaleString()}</p>
                       </div>
                       
                       <div style={{marginTop: '25px', display: 'flex', gap: '10px'}}>
                         <button 
                            onClick={() => addToCart(item)}
                            className="btn btn-primary compact" 
                            style={{flex: 2, padding: '12px 0', fontSize: '0.65rem'}}>
                            Procure Now
                         </button>
                         <Link 
                            to={`/product/${item._id}`} 
                            className="btn btn-secondary compact" 
                            style={{flex: 1, padding: '12px 0', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'}}>
                            View
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

export default DashboardWishlist;
