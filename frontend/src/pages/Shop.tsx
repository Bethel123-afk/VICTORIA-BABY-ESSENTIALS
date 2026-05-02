import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products as localProducts } from '../data/products';
import Skeleton from '../components/Skeleton';
import PremiumImage from '../components/PremiumImage';
import { IProduct } from '../types';

const Shop: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced Diagnostics
  const [minPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist } = useWishlist();
  const { search } = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
        } else {
            setProducts(localProducts as unknown as IProduct[]);
        }
        
        const params = new URLSearchParams(search);
        const q = params.get('search');
        if (q) setSearchTerm(q);
      } catch (err) {
        setProducts(localProducts as unknown as IProduct[]);
      } finally {
        setTimeout(() => setLoading(false), 800); // Slight delay for cinematic feel
      }
    };
    fetchProducts();
  }, [search]);

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'all' || p.category === filter;
    const desc = p.description || '';
    const matchesSearch = (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                         desc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    const matchesStock = !inStockOnly || p.countInStock > 0;
    
    return matchesFilter && matchesSearch && matchesPrice && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    }
    return 0;
  });

  const isInWishlist = (id: string) => wishlistItems.some(item => item._id === id);

  return (
    <main style={{ background: '#fafafa', minHeight: '100vh' }}>
      <section className="shop-hero" style={{ height: '40vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'var(--primary)' }}>
        <PremiumImage src="https://images.unsplash.com/photo-1544126592-807daa2b5652?auto=format&fit=crop&w=2000&q=80" alt="Atelier Setting" style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.4 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="reveal-anim">
                <span className="item-badge stagger-1" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>CATALOGUE D'EXCELLENCE</span>
                <h1 className="stagger-2" style={{ color: 'white', fontSize: '3.5rem', fontFamily: 'Playfair Display, serif' }}>Bespoke <span>Inventory</span></h1>
            </div>
        </div>
      </section>

      <section className="shop-content" style={{ marginTop: '-40px', position: 'relative', zIndex: 5, paddingBottom: '120px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '50px', alignItems: 'start' }}>
            
            {/* Advanced Diagnostic Sidebar */}
            <aside className="reveal-anim" style={{ position: 'sticky', top: '120px' }}>
                <div style={{ background: 'white', padding: '35px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', border: '1px solid var(--gray-100)' }}>
                    <h3 style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '30px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '15px' }}>Diagnostic Filters</h3>
                    
                    <div style={{ marginBottom: '40px' }}>
                        <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '15px' }}>CATEGORY REGISTRY</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {['all', 'Essential', 'Collection', 'Feeding', 'Skincare'].map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    style={{ 
                                        textAlign: 'left', 
                                        padding: '10px 15px', 
                                        fontSize: '0.75rem', 
                                        background: filter === cat ? 'var(--gray-100)' : 'transparent',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: filter === cat ? 'var(--primary)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontWeight: filter === cat ? 700 : 400,
                                        transition: '0.3s'
                                    }}
                                >
                                    {cat.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '20px' }}>VALUATION RANGE (₦)</label>
                        <input 
                            type="range" 
                            min="0" 
                            max="250000" 
                            step="5000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--secondary)', marginBottom: '15px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                            <span>₦0</span>
                            <span style={{ color: 'var(--secondary)' }}>₦{maxPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                            <input 
                                type="checkbox" 
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--secondary)' }}
                            />
                            AVAILABLE IN REGISTRY
                        </label>
                    </div>

                    <button 
                        className="btn btn-secondary" 
                        onClick={() => {setFilter('all'); setMaxPrice(250000); setInStockOnly(false); setSearchTerm('');}}
                        style={{ width: '100%', padding: '15px', fontSize: '0.65rem', letterSpacing: '2px' }}
                    >
                        RESET PROTOCOL
                    </button>
                </div>
            </aside>

            {/* Product Feed */}
            <div>
                <div className="glass-panel" style={{ padding: '25px 35px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', background: 'white' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <input 
                            type="text" 
                            placeholder="SEARCH INVENTORY..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 40px 12px 0', border: 'none', borderBottom: '1px solid var(--gray-100)', fontSize: '0.8rem', letterSpacing: '1px', outline: 'none' }}
                        />
                        <i className="fas fa-search" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }}></i>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>{filteredProducts.length} UNITS IDENTIFIED</span>
                        <div style={{ width: '1px', height: '20px', background: 'var(--gray-200)' }}></div>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="newest">LATEST ARRIVAL</option>
                            <option value="price-asc">VALUATION: LOW-HIGH</option>
                            <option value="price-desc">VALUATION: HIGH-LOW</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--gray-100)' }}>
                                <Skeleton width="100%" height="280px" borderRadius="8px" marginBottom="20px" />
                                <Skeleton width="40%" height="10px" marginBottom="15px" />
                                <Skeleton width="80%" height="20px" marginBottom="15px" />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Skeleton width="30%" height="20px" />
                                    <Skeleton width="20%" height="15px" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '120px 0', background: 'white', borderRadius: '12px' }}>
                        <i className="fas fa-microscope" style={{ fontSize: '4rem', opacity: 0.05, marginBottom: '20px' }}></i>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>No Matches Found</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Adjust your diagnostic parameters to broaden the search.</p>
                    </div>
                ) : (
                    <div className="items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                        {filteredProducts.map((item, idx) => (
                            <div className={`item-card-premium reveal-anim stagger-${(idx % 3) + 1}`} key={item._id} style={{ background: 'white', border: '1px solid var(--gray-100)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                                <div className="img-wrapper" style={{ height: '320px', overflow: 'hidden', background: '#f9f9f9', position: 'relative' }}>
                                    <PremiumImage src={item.image} alt={item.name} className="product-image" />
                                    <button className="add-to-wishlist" onClick={() => addToWishlist(item)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', border: 'none', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', cursor: 'pointer', zIndex: 10 }}>
                                        <i className={isInWishlist(item._id) ? "fas fa-heart" : "far fa-heart"} style={isInWishlist(item._id) ? { color: 'var(--heart)' } : { fontSize: '0.9rem' }}></i>
                                    </button>
                                    <div className="quick-action" style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', transform: 'translateY(20px)', opacity: 0, transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 10 }}>
                                        <button className="btn btn-primary" onClick={() => addToCart(item)} style={{ width: '100%', padding: '15px', fontSize: '0.65rem', letterSpacing: '2px' }}>INITIATE PROCUREMENT</button>
                                    </div>
                                    {item.countInStock === 0 && (
                                        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary)', color: 'white', padding: '5px 12px', fontSize: '0.6rem', fontWeight: 700, borderRadius: '2px', letterSpacing: '1px' }}>DEPLETED</div>
                                    )}
                                </div>
                                <div className="item-meta" style={{ padding: '25px' }}>
                                    <span style={{ fontSize: '0.55rem', opacity: 0.5, letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{item.category}</span>
                                    <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', marginBottom: '15px', lineHeight: 1.3 }}>{item.name}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>₦{item.price.toLocaleString()}</p>
                                        <Link to={`/product/${item._id}`} style={{ fontSize: '0.65rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: 700, letterSpacing: '1px' }}>DIAGNOSTICS</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>
      </section>
      
      <style>{`
        .item-card-premium:hover .product-image img { transform: scale(1.1); }
        .item-card-premium:hover .quick-action { transform: translateY(0); opacity: 1; }
        .item-card-premium { transition: 0.4s; }
        .item-card-premium:hover { 
            transform: translateY(-10px);
            box-shadow: 0 40px 80px rgba(0,0,0,0.06); 
            border-color: var(--secondary); 
        }
      `}</style>
    </main>
  );
};

export default Shop;
