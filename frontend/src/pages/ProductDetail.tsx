import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IProduct } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [rating, setRating] = useState<number | string>(0);
  const [comment, setComment] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);
  const [successReview, setSuccessReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist } = useWishlist();
  const { userInfo } = useAuth();
  const { addToast } = useToast();

  const isInWishlist = product ? wishlistItems.some(x => x._id === product._id) : false;

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      
      const { data: allData } = await axios.get('/api/products');
      setRelatedProducts(allData.filter((p: IProduct) => p._id !== id).slice(0, 4));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, successReview]);

  const submitReviewHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInfo) return;
    
    setLoadingReview(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
      setSuccessReview(true);
      setComment('');
      setRating(0);
      addToast('Clinical Log Successfully Integrated', 'success');
    } catch (err: any) {
      const msg = err.response && err.response.data.message ? err.response.data.message : err.message;
      setReviewError(msg);
      addToast(msg, 'error');
    } finally {
      setLoadingReview(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '150px'}}><i className="fas fa-circle-notch fa-spin fa-3x" style={{ color: 'var(--secondary)' }}></i></div>;
  if (error || !product) return <div style={{textAlign: 'center', padding: '150px', color: 'red'}}>{error || 'Product not found'}</div>;

  return (
    <main style={{ background: '#fafafa' }}>
      <section style={{ padding: '180px 0 120px 0' }}>
        <div className="container">
            <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'start' }}>
                <div className="reveal-anim stagger-1" style={{ position: 'sticky', top: '150px' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                    </div>
                </div>

                <div className="reveal-anim stagger-2">
                    <nav style={{ marginBottom: '30px', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Inventory</Link> / {product.category} / {product.name}
                    </nav>
                    
                    <span className="item-badge" style={{ marginBottom: '20px' }}>{product.category.toUpperCase()} PROTOCOL</span>
                    <h1 style={{ fontSize: '4rem', fontFamily: 'Playfair Display, serif', marginBottom: '20px', lineHeight: 1.1 }}>{product.name}</h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <i key={star} className={star <= (product.rating || 0) ? "fas fa-star" : "far fa-star"}></i>
                            ))}
                        </div>
                        <span style={{ fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 700, opacity: 0.4 }}>{product.numReviews} VALIDATED FEEDBACKS</span>
                    </div>

                    <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '40px' }}>₦{product.price.toLocaleString()}</p>
                    
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '50px' }}>{product.description}</p>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
                        <button className="btn btn-primary" style={{ flex: 3, padding: '25px', letterSpacing: '2px' }} onClick={() => addToCart(product)}>
                            INITIATE PROCUREMENT
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white', color: 'var(--primary)' }}
                            onClick={() => addToWishlist(product)}
                        >
                            <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"} style={isInWishlist ? { color: 'var(--heart)' } : { fontSize: '1.2rem' }}></i>
                        </button>
                    </div>

                    <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '40px' }}>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '10px' }}>AVAILABILITY</span>
                                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{(product.countInStock || 0) > 0 ? `${product.countInStock} UNITS IN REGISTRY` : 'REGISTRY DEPLETED'}</span>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '10px' }}>AUTHENTICITY</span>
                                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>VERIFIED BOUTIQUE ORIGIN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section style={{ padding: '120px 0', background: 'white' }}>
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '100px' }}>
                <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '50px' }}>Client Experience</h3>
                    {product.reviews && product.reviews.length === 0 ? (
                        <div style={{ padding: '60px', border: '1px dashed var(--gray-200)', textAlign: 'center', borderRadius: '8px' }}>
                            <i className="fas fa-comment-medical" style={{ fontSize: '3rem', opacity: 0.1, marginBottom: '20px' }}></i>
                            <p style={{ color: 'var(--text-muted)', letterSpacing: '1px' }}>No clinical feedback recorded for this unit yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {product.reviews?.map(review => (
                                <div key={review._id} className="reveal-anim" style={{ background: '#fafafa', padding: '30px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div>
                                            <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem' }}>{review.name.toUpperCase()}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ color: 'var(--secondary)', fontSize: '0.7rem' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <i key={star} className={star <= review.rating ? "fas fa-star" : "far fa-star"}></i>
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--primary)', fontStyle: 'italic' }}>"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '50px', borderRadius: '12px', position: 'sticky', top: '150px' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '15px' }}>Submit Feedback</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '35px', lineHeight: 1.6 }}>Share your maternal experience with this unit to assist other clients in their procurement process.</p>
                        
                        {userInfo ? (
                            <form onSubmit={submitReviewHandler}>
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '2px', marginBottom: '10px', opacity: 0.5 }}>VALUATION RATING</label>
                                    <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', outline: 'none' }} required>
                                        <option value="" style={{color: 'black'}}>Select Score...</option>
                                        <option value="5" style={{color: 'black'}}>5 - Superior Excellence</option>
                                        <option value="4" style={{color: 'black'}}>4 - High Quality</option>
                                        <option value="3" style={{color: 'black'}}>3 - Standard</option>
                                        <option value="2" style={{color: 'black'}}>2 - Suboptimal</option>
                                        <option value="1" style={{color: 'black'}}>1 - Critical Failure</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '35px' }}>
                                    <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '2px', marginBottom: '10px', opacity: 0.5 }}>OBSERVATION LOG</label>
                                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', height: '120px', outline: 'none', resize: 'none' }} required placeholder="Input observations..."></textarea>
                                </div>
                                <button type="submit" disabled={loadingReview} className="btn btn-secondary" style={{ width: '100%', padding: '20px', letterSpacing: '2px' }}>
                                    {loadingReview ? 'TRANSMITTING...' : 'VALIDATE LOG'}
                                </button>
                                {reviewError && <p style={{ color: 'var(--heart)', marginTop: '15px', fontSize: '0.7rem', textAlign: 'center' }}>{reviewError}</p>}
                                {successReview && <p style={{ color: 'var(--secondary)', marginTop: '15px', fontSize: '0.7rem', textAlign: 'center' }}>LOG SUCCESSFULLY INTEGRATED</p>}
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '30px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Authentication required to submit clinical feedback.</p>
                                <Link to="/login" className="btn btn-secondary" style={{ display: 'block', padding: '15px' }}>LOGON SYSTEM</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section style={{ padding: '120px 0', borderTop: '1px solid var(--gray-100)' }}>
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <span className="item-badge">Bespoke Selection</span>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem' }}>Complementary <span>Units</span></h2>
            </div>
            <div className="items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
                {relatedProducts.map((item, idx) => (
                    <div key={item._id} className={`reveal-anim stagger-${idx + 1}`} style={{ background: 'white', border: '1px solid var(--gray-100)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                         <div style={{ height: '250px', overflow: 'hidden' }}>
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         </div>
                         <div style={{ padding: '20px' }}>
                            <span style={{ fontSize: '0.55rem', opacity: 0.5, letterSpacing: '1px' }}>{item.category.toUpperCase()}</span>
                            <h4 style={{ fontSize: '1rem', margin: '5px 0' }}>{item.name}</h4>
                            <p style={{ fontWeight: 700, color: 'var(--primary)' }}>₦{item.price.toLocaleString()}</p>
                            <Link to={`/product/${item._id}`} style={{ fontSize: '0.65rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: 700, letterSpacing: '1px', marginTop: '10px', display: 'inline-block' }}>SPECS</Link>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
