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
      <section className="product-view-section">
        <div className="container">
            <div className="product-detail-grid">
                <div className="product-visual-column reveal-anim stagger-1">
                    <div className="product-image-card">
                        <img src={product.image} alt={product.name} className="main-product-img" />
                    </div>
                </div>

                <div className="product-info-column reveal-anim stagger-2">
                    <nav className="breadcrumb">
                        <Link to="/shop">Inventory</Link> / {product.category} / {product.name}
                    </nav>
                    
                    <span className="item-badge product-badge">{product.category.toUpperCase()} PROTOCOL</span>
                    <h1 className="product-title">{product.name}</h1>
                    
                    <div className="product-rating-row">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <i key={star} className={star <= (product.rating || 0) ? "fas fa-star" : "far fa-star"}></i>
                            ))}
                        </div>
                        <span className="reviews-count">{product.numReviews} VALIDATED FEEDBACKS</span>
                    </div>

                    <p className="product-price">₦{product.price.toLocaleString()}</p>
                    
                    <p className="product-description">{product.description}</p>

                    <div className="product-actions-row">
                        <button className="btn btn-primary procure-btn" onClick={() => addToCart(product)}>
                            INITIATE PROCUREMENT
                        </button>
                        <button 
                            className="btn btn-secondary wishlist-btn" 
                            onClick={() => addToWishlist(product)}
                        >
                            <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"} style={isInWishlist ? { color: 'var(--heart)' } : {}}></i>
                        </button>
                    </div>

                    <div className="product-meta-footer">
                        <div className="meta-grid">
                            <div className="meta-item">
                                <span className="meta-label">AVAILABILITY</span>
                                <span className="meta-value">{(product.countInStock || 0) > 0 ? `${product.countInStock} UNITS IN REGISTRY` : 'REGISTRY DEPLETED'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">AUTHENTICITY</span>
                                <span className="meta-value">VERIFIED BOUTIQUE ORIGIN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="product-feedback-section">
        <div className="container">
            <div className="feedback-grid">
                <div className="reviews-column">
                    <h3 className="section-subtitle">Client Experience</h3>
                    {product.reviews && product.reviews.length === 0 ? (
                        <div className="empty-reviews">
                            <i className="fas fa-comment-medical"></i>
                            <p>No clinical feedback recorded for this unit yet.</p>
                        </div>
                    ) : (
                        <div className="reviews-list">
                            {product.reviews?.map(review => (
                                <div key={review._id} className="review-card reveal-anim">
                                    <div className="review-header">
                                        <div className="review-user">
                                            <span className="user-name">{review.name.toUpperCase()}</span>
                                            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="stars">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <i key={star} className={star <= review.rating ? "fas fa-star" : "far fa-star"}></i>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-text">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="submit-review-column">
                    <div className="review-form-card">
                        <h3 className="form-title">Submit Feedback</h3>
                        <p className="form-desc">Share your maternal experience with this unit to assist other clients in their procurement process.</p>
                        
                        {userInfo ? (
                            <form onSubmit={submitReviewHandler} className="review-form">
                                <div className="form-group">
                                    <label className="form-label">VALUATION RATING</label>
                                    <select value={rating} onChange={(e) => setRating(e.target.value)} className="form-select" required>
                                        <option value="">Select Score...</option>
                                        <option value="5">5 - Superior Excellence</option>
                                        <option value="4">4 - High Quality</option>
                                        <option value="3">3 - Standard</option>
                                        <option value="2">2 - Suboptimal</option>
                                        <option value="1">1 - Critical Failure</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">OBSERVATION LOG</label>
                                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="form-textarea" required placeholder="Input observations..."></textarea>
                                </div>
                                <button type="submit" disabled={loadingReview} className="btn btn-secondary submit-btn">
                                    {loadingReview ? 'TRANSMITTING...' : 'VALIDATE LOG'}
                                </button>
                                {reviewError && <p className="error-msg">{reviewError}</p>}
                                {successReview && <p className="success-msg">LOG SUCCESSFULLY INTEGRATED</p>}
                            </form>
                        ) : (
                            <div className="auth-required">
                                <p>Authentication required to submit clinical feedback.</p>
                                <Link to="/login" className="btn btn-secondary auth-btn">LOGON SYSTEM</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="related-products-section">
        <div className="container">
            <div className="section-header-centered">
                <span className="item-badge">Bespoke Selection</span>
                <h2 className="section-title-large">Complementary <span>Units</span></h2>
            </div>
            <div className="items-grid">
                {relatedProducts.map((item, idx) => (
                    <div key={item._id} className={`related-item-card reveal-anim stagger-${idx + 1}`}>
                         <div className="item-visual-wrapper">
                            <img src={item.image} alt={item.name} className="item-img-square" />
                         </div>
                         <div className="item-meta-content">
                            <span className="item-category-label">{item.category.toUpperCase()}</span>
                            <h4 className="item-name-small">{item.name}</h4>
                            <p className="item-price-small">₦{item.price.toLocaleString()}</p>
                            <Link to={`/product/${item._id}`} className="specs-link">SPECS</Link>
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
