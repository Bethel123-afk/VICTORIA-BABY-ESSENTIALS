import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IProduct } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, addToCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', height: '100%', zIndex: 10000, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Backdrop */}
            <div onClick={onClose} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}></div>
            
            {/* Drawer */}
            <div className="reveal-anim" style={{ position: 'relative', width: '100%', maxWidth: '450px', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
                <div style={{ padding: '30px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', margin: 0 }}>Shopping Bag</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--primary)' }}><i className="fas fa-times"></i></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <i className="fas fa-shopping-bag" style={{ fontSize: '3rem', color: 'var(--gray-200)', marginBottom: '20px' }}></i>
                            <p style={{ color: 'var(--text-muted)' }}>Your bag is currently empty.</p>
                            <button onClick={() => { onClose(); navigate('/shop'); }} className="btn btn-secondary compact" style={{ marginTop: '20px' }}>Continue Shopping</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {cartItems.map((item) => (
                                <div key={item.product} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '20px' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{item.name}</h4>
                                            <button onClick={() => removeFromCart(item.product)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '0.8rem' }}><i className="fas fa-trash-alt"></i></button>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                            <div style={{ display: 'flex', border: '1px solid var(--gray-200)', borderRadius: '4px' }}>
                                                <button onClick={() => item.qty > 1 && addToCart({ _id: item.product, name: item.name, image: item.image, price: item.price, countInStock: item.countInStock } as IProduct, -1)} style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>-</button>
                                                <span style={{ padding: '2px 10px', fontSize: '0.8rem', borderLeft: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)' }}>{item.qty}</span>
                                                <button onClick={() => addToCart({ _id: item.product, name: item.name, image: item.image, price: item.price, countInStock: item.countInStock } as IProduct, 1)} style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                                            </div>
                                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₦{(item.price * item.qty).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div style={{ padding: '30px', background: 'var(--gray-100)', borderTop: '1px solid var(--gray-200)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Estimated Subtotal:</span>
                            <span style={{ fontWeight: 600 }}>₦{subtotal.toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Shipping and taxes calculated at checkout.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => { onClose(); navigate('/checkout'); }} className="btn btn-primary" style={{ flex: 1 }}>Checkout Now</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
