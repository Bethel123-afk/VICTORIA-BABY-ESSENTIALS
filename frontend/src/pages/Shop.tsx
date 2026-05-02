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
      <section className="shop-hero">
        <PremiumImage src="https://images.unsplash.com/photo-1544126592-807daa2b5652?auto=format&fit=crop&w=2000&q=80" alt="Atelier Setting" style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.4 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="reveal-anim shop-hero-text">
                <span className="item-badge stagger-1 shop-hero-badge">CATALOGUE D'EXCELLENCE</span>
                <h1 className="stagger-2 shop-hero-title">Bespoke <span>Inventory</span></h1>
            </div>
        </div>
      </section>

      <section className="shop-content">
        <div className="container">
          <div className="shop-layout">
            
            {/* Advanced Diagnostic Sidebar */}
            <aside className="reveal-anim shop-sidebar">
                <div className="filter-card">
                    <h3 className="filter-title">Diagnostic Filters</h3>
                    
                    <div className="filter-group">
                        <label className="filter-label">CATEGORY REGISTRY</label>
                        <div className="filter-options">
                            {['all', 'Essential', 'Collection', 'Feeding', 'Skincare'].map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`filter-option-btn ${filter === cat ? 'active' : ''}`}
                                >
                                    {cat.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">VALUATION RANGE (₦)</label>
                        <input 
                            type="range" 
                            min="0" 
                            max="250000" 
                            step="5000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            className="price-range"
                        />
                        <div className="price-display">
                            <span>₦0</span>
                            <span className="current-price">₦{maxPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="stock-filter">
                            <input 
                                type="checkbox" 
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                            />
                            AVAILABLE IN REGISTRY
                        </label>
                    </div>

                    <button 
                        className="btn btn-secondary reset-btn" 
                        onClick={() => {setFilter('all'); setMaxPrice(250000); setInStockOnly(false); setSearchTerm('');}}
                    >
                        RESET PROTOCOL
                    </button>
                </div>
            </aside>

            {/* Product Feed */}
            <div className="product-feed-container">
                <div className="shop-controls glass-panel">
                    <div className="search-box-wrapper">
                        <input 
                            type="text" 
                            placeholder="SEARCH INVENTORY..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="shop-search-input"
                        />
                        <i className="fas fa-search"></i>
                    </div>

                    <div className="shop-meta-controls">
                        <span className="units-count">{filteredProducts.length} UNITS IDENTIFIED</span>
                        <div className="divider"></div>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="newest">LATEST ARRIVAL</option>
                            <option value="price-asc">VALUATION: LOW-HIGH</option>
                            <option value="price-desc">VALUATION: HIGH-LOW</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="items-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton-card">
                                <Skeleton width="100%" height="280px" borderRadius="8px" marginBottom="20px" />
                                <Skeleton width="40%" height="10px" marginBottom="15px" />
                                <Skeleton width="80%" height="20px" marginBottom="15px" />
                                <div className="skeleton-footer">
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
                    <div className="items-grid">
                        {filteredProducts.map((item, idx) => (
                            <div className={`item-card-premium reveal-anim stagger-${(idx % 3) + 1}`} key={item._id}>
                                <div className="img-wrapper">
                                    <PremiumImage src={item.image} alt={item.name} className="product-image" />
                                    <button className="add-to-wishlist" onClick={() => addToWishlist(item)}>
                                        <i className={isInWishlist(item._id) ? "fas fa-heart" : "far fa-heart"} style={isInWishlist(item._id) ? { color: 'var(--heart)' } : {}}></i>
                                    </button>
                                    <div className="quick-action">
                                        <button className="btn-acquire-compact" onClick={() => addToCart(item)}>PROCURE</button>
                                    </div>
                                    {item.countInStock === 0 && (
                                        <div className="stock-badge">DEPLETED</div>
                                    )}
                                </div>
                                <div className="item-meta">
                                    <span className="category-label">{item.category}</span>
                                    <h4 className="item-title">{item.name}</h4>
                                    <div className="item-footer">
                                        <p className="item-price">₦{item.price.toLocaleString()}</p>
                                        <Link to={`/product/${item._id}`} className="view-detail-link">VIEW</Link>
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
