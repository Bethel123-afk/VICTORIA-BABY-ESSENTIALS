import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FlutterwavePayment from '../components/FlutterwavePayment';
import { useAuth } from '../context/AuthContext';
import { IOrder } from '../types';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');



    const fetchOrder = async () => {
        if (!userInfo) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`/api/orders/${id}`, config);
            setOrder(data);
        } catch (err: any) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!order || order._id !== id) {
            fetchOrder();
        }
    }, [id, userInfo, order]);

    const onPaymentSuccess = async (response: any) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.put(`/api/orders/${id}/pay`, response, config);
            navigate(`/order/success/${id}`);
        } catch (err: any) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    const printInvoice = () => {
        window.print();
    };

    if (loading) return <div style={{padding: '100px', textAlign: 'center'}}><i className="fas fa-spinner fa-spin fa-2x"></i></div>;
    if (error || !order) return <div style={{padding: '100px', textAlign: 'center', color: 'red'}}>{error || 'Order not found'}</div>;
    if (!userInfo) return <div style={{padding: '100px', textAlign: 'center'}}>Please log in to view order details.</div>;

    return (
        <main className="container" style={{paddingTop: '160px', paddingBottom: '100px'}}>
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .header, .footer, .nav-main { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .container { padding-top: 0 !important; max-width: 100% !important; margin: 0 !important; }
                    .receipt-card { border: none !important; box-shadow: none !important; }
                    .watermark { display: block !important; }
                }
                .receipt-card {
                    background: white;
                    border: 1px solid var(--gray-100);
                    padding: 60px;
                    border-radius: 4px;
                    position: relative;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.03);
                }
                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-30deg);
                    font-size: 8rem;
                    opacity: 0.03;
                    pointer-events: none;
                    font-family: 'Playfair Display', serif;
                    display: none;
                }
            `}</style>
            
            <div className="reveal-anim" style={{maxWidth: '1000px', margin: '0 auto'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px'}} className="no-print">
                    <div>
                        <Link to="/dashboard/orders" style={{color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px'}}>
                            <i className="fas fa-arrow-left"></i> Procurement Log
                        </Link>
                        <h1 style={{fontSize: '3rem', fontFamily: 'Playfair Display, serif'}}>Order Manifest</h1>
                    </div>
                    <button onClick={printInvoice} className="btn btn-secondary" style={{padding: '15px 30px', letterSpacing: '2px', fontSize: '0.7rem'}}>
                        <i className="fas fa-print"></i> GENERATE PDF INVOICE
                    </button>
                </div>

                <div className="receipt-card">
                    <div className="watermark">VICTORIA</div>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary)', paddingBottom: '30px', marginBottom: '40px'}}>
                        <div>
                            <h2 style={{fontSize: '1.5rem', letterSpacing: '5px', margin: 0}}>VICTORIA</h2>
                            <span style={{fontSize: '0.6rem', color: 'var(--secondary)', letterSpacing: '3px', fontWeight: 700}}>BOUTIQUE ESSENTIALS</span>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <span style={{fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)'}}>Manifest Reference</span>
                            <h3 className="id-mono" style={{margin: '5px 0 0 0', fontSize: '1.2rem'}}>#{order._id.toUpperCase()}</h3>
                        </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '60px'}}>
                        <div>
                            <span style={{fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', display: 'block', marginBottom: '15px'}}>Client Identity</span>
                            <strong style={{display: 'block', fontSize: '0.9rem'}}>
                                {typeof order.user !== 'string' ? order.user?.name : 'Client'}
                            </strong>
                            <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                                {typeof order.user !== 'string' ? order.user?.email : ''}
                            </span>
                        </div>
                        <div>
                            <span style={{fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', display: 'block', marginBottom: '15px'}}>Logistics Destination</span>
                            <p style={{fontSize: '0.85rem', margin: 0, lineHeight: '1.6'}}>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <span style={{fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', display: 'block', marginBottom: '15px'}}>Temporal Record</span>
                            <strong style={{display: 'block', fontSize: '0.9rem'}}>{new Date(order.createdAt!).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}</strong>
                            <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{new Date(order.createdAt!).toLocaleTimeString()}</span>
                        </div>
                    </div>

                    <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '60px'}}>
                        <thead>
                            <tr style={{borderBottom: '1px solid var(--gray-200)'}}>
                                <th style={{textAlign: 'left', padding: '15px 0', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)'}}>Description</th>
                                <th style={{textAlign: 'center', padding: '15px 0', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)'}}>Qty</th>
                                <th style={{textAlign: 'right', padding: '15px 0', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)'}}>Unit Price</th>
                                <th style={{textAlign: 'right', padding: '15px 0', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)'}}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item, index) => (
                                <tr key={index} style={{borderBottom: '1px solid var(--gray-50)'}}>
                                    <td style={{padding: '25px 0'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                                            <div className="no-print" style={{width: '50px', height: '50px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden'}}>
                                                <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                            </div>
                                            <div>
                                                <strong style={{display: 'block', fontSize: '0.9rem'}}>{item.name}</strong>
                                                <span style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Boutique Unit</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{textAlign: 'center', padding: '25px 0', fontWeight: 600}}>{item.qty}</td>
                                    <td style={{textAlign: 'right', padding: '25px 0'}}>₦{item.price.toLocaleString()}</td>
                                    <td style={{textAlign: 'right', padding: '25px 0', fontWeight: 700}}>₦{(item.price * item.qty).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <div style={{width: '350px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid var(--gray-100)'}}>
                                <span style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Subtotal</span>
                                <span style={{fontWeight: 600}}>₦{order.totalPrice.toLocaleString()}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', padding: '25px 0', borderBottom: '2px solid var(--primary)'}}>
                                <span style={{fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px'}}>Total Liability</span>
                                <span style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)'}}>₦{order.totalPrice.toLocaleString()}</span>
                            </div>
                            
                            <div style={{marginTop: '40px', textAlign: 'right'}} className="no-print">
                                {!order.isPaid ? (
                                    <FlutterwavePayment 
                                        amount={order.totalPrice} 
                                        email={typeof order.user !== 'string' ? order.user?.email || userInfo.email : userInfo.email} 
                                        userInfo={userInfo} 
                                        onOrderPlaced={onPaymentSuccess} 
                                        setError={setError} 
                                    />
                                ) : (
                                    <div style={{padding: '20px', border: '1px solid var(--secondary)', borderRadius: '4px', textAlign: 'center'}}>
                                        <span style={{fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--secondary)', fontWeight: 700}}>
                                            <i className="fas fa-shield-check"></i> PAYMENT VERIFIED
                                        </span>
                                        <p style={{fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '5px'}}>TransID: {order.paymentResult?.id || 'AUTH-SYNC-OK'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--gray-100)', textAlign: 'center'}}>
                        <p style={{fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '10px'}}>Thank you for choosing Victoria Boutique Essentials.</p>
                        <span style={{fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--text-muted)'}}>Integrity • Elegance • Neonatal Excellence</span>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderDetails;
