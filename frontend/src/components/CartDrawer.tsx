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
        <div className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="cart-drawer-header">
                    <h2 className="premium-title">Shopping Bag</h2>
                    <button className="close-drawer-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="cart-drawer-body">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-view">
                            <i className="fas fa-shopping-bag"></i>
                            <p>Your bag is currently empty.</p>
                            <button onClick={() => { onClose(); navigate('/shop'); }} className="btn btn-secondary compact">Continue Shopping</button>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div key={item.product} className="cart-item-row">
                                    <div className="cart-item-img">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="cart-item-top">
                                            <h4 className="item-name">{item.name}</h4>
                                            <button className="remove-item-btn" onClick={() => removeFromCart(item.product)}>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                        <div className="cart-item-bottom">
                                            <div className="qty-selector">
                                                <button onClick={() => item.qty > 1 && addToCart({ _id: item.product, name: item.name, image: item.image, price: item.price, countInStock: item.countInStock } as IProduct, -1)}>-</button>
                                                <span className="qty-value">{item.qty}</span>
                                                <button onClick={() => addToCart({ _id: item.product, name: item.name, image: item.image, price: item.price, countInStock: item.countInStock } as IProduct, 1)}>+</button>
                                            </div>
                                            <span className="item-price">₦{(item.price * item.qty).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="footer-summary">
                            <span className="label">Estimated Subtotal:</span>
                            <span className="value">₦{subtotal.toLocaleString()}</span>
                        </div>
                        <p className="footer-note">Shipping and taxes calculated at checkout.</p>
                        <button onClick={() => { onClose(); navigate('/checkout'); }} className="btn btn-primary checkout-btn">Checkout Now</button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default CartDrawer;
