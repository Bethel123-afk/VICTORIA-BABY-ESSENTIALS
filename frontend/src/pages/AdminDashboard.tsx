import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { IOrder, IProduct, IUser } from '../types';

interface ChartDataItem {
    date: string;
    revenue: number;
}

interface CategoryDataItem {
    name: string;
    value: number;
}

const AdminDashboard: React.FC = () => {
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'users'>('orders');
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Security pin for design aesthetics
    const [pin, setPin] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [pinError, setPinError] = useState(false);

    // Prepare chart data with consistent dates
    const chartData: ChartDataItem[] = orders.reduce((acc: ChartDataItem[], order) => {
        const date = new Date(order.createdAt!).toISOString().split('T')[0];
        const existing = acc.find(item => item.date === date);
        if (existing) {
            existing.revenue += order.totalPrice;
        } else {
            acc.push({ date, revenue: order.totalPrice });
        }
        return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Category distribution data
    const categoryData: CategoryDataItem[] = products.reduce((acc: CategoryDataItem[], p) => {
        const existing = acc.find(item => item.name === p.category);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: p.category, value: 1 });
        }
        return acc;
    }, []);

    const COLORS = ['#8e9775', '#e28e8e', '#a3c4f3', '#f1c0e8', '#ffd6a5'];

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | string>(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState<number | string>(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }
        
        const fetchData = async () => {
            if (!authenticated) return;
            
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                
                const [ordersRes, productsRes, usersRes] = await Promise.all([
                    axios.get<IOrder[]>('/api/orders', config),
                    axios.get<IProduct[]>('/api/products'),
                    axios.get<IUser[]>('/api/users', config)
                ]);
                
                setOrders(ordersRes.data);
                setProducts(productsRes.data);
                setUsers(usersRes.data);
            } catch (err: any) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userInfo, navigate, authenticated]);

    const handlePinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (pin === '1234') { 
            setAuthenticated(true);
        } else {
            setPinError(true);
            setPin('');
        }
    };

    const updateStatus = async (id: string, status: string) => {
        if (!userInfo) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.put(`/api/orders/${id}/status`, { status }, config);
            setOrders(orders.map(o => o._id === id ? data : o));
        } catch (err) {
            alert('Status synchronization failure.');
        }
    };

    const deleteProduct = async (id: string) => {
        if (!userInfo) return;
        if (window.confirm('Are you certain you wish to purge this unit from the registry?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/products/${id}`, config);
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                alert('Registry deletion failure.');
            }
        }
    };

    const openEditModal = (product?: IProduct) => {
        if (product) {
            setEditingProduct(product);
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        } else {
            setEditingProduct(null);
            setName('');
            setPrice(0);
            setImage('');
            setCategory('');
            setCountInStock(0);
            setDescription('');
        }
        setShowModal(true);
    };

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitProductHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userInfo) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const productData = { name, price, image, category, countInStock, description };

        try {
            if (editingProduct) {
                const { data } = await axios.put(`/api/products/${editingProduct._id}`, productData, config);
                setProducts(products.map(p => p._id === data._id ? data : p));
            } else {
                const { data } = await axios.post('/api/products', productData, config);
                setProducts([...products, data]);
            }
            setShowModal(false);
        } catch (err) {
            alert('Product procurement synchronization failure.');
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Processing': return 'var(--accent)';
            case 'Shipped': return 'var(--primary)';
            case 'Delivered': return 'var(--secondary)';
            default: return 'var(--text-muted)';
        }
    };

    if (!authenticated) {
        return (
            <div style={{ 
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                background: 'linear-gradient(135deg, var(--primary) 0%, #1a252f 100%)', 
                zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
                <div className="reveal-anim" style={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    padding: '60px 40px', 
                    borderRadius: '12px', 
                    textAlign: 'center', 
                    width: '380px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto', color: 'white' }}>
                        <i className="fas fa-lock" style={{fontSize: '1.5rem'}}></i>
                    </div>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '10px', fontFamily: 'Playfair Display, serif' }}>Restricted Command</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Administrative PIN Required</p>
                    <form onSubmit={handlePinSubmit}>
                        <input type="password" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)}
                            style={{ 
                                width: '100%', padding: '20px', fontSize: '2rem', textAlign: 'center', 
                                letterSpacing: '10px', marginBottom: '30px', 
                                border: '1px solid var(--gray-200)', borderRadius: '8px',
                                background: 'var(--background)', outline: 'none', transition: '0.3s'
                            }} placeholder="••••" required autoFocus />
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '20px', letterSpacing: '4px' }}>AUTHORIZE ACCESS</button>
                    </form>
                    {pinError && <p style={{ marginTop: '20px', fontSize: '0.7rem', color: 'var(--heart)', fontWeight: 700, letterSpacing: '1px' }}>LOGON DENIED: INVALID CREDENTIALS</p>}
                </div>
            </div>
        );
    }

    const filteredOrders = orders.filter(o => {
        const userIdMatch = o._id.includes(searchTerm);
        const userNameMatch = typeof o.user !== 'string' && o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return userIdMatch || userNameMatch;
    });
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalCustomers = users.length;
    const lowStockCount = products.filter(p => p.countInStock < 5).length;

    return (
        <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', display: 'flex' }}>
            {/* Sidebar */}
            <div style={{ width: '300px', background: 'var(--primary)', color: 'white', position: 'fixed', height: '100%', padding: '50px 0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0 40px', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '1.2rem', letterSpacing: '4px', margin: 0, fontWeight: 300 }}>VICTORIA</h2>
                    <span style={{ fontSize: '0.6rem', color: 'var(--secondary)', letterSpacing: '4px', fontWeight: 700, textTransform: 'uppercase' }}>Command Center</span>
                </div>

                <nav style={{ flex: 1 }}>
                    <button onClick={() => setActiveTab('orders')} style={{ 
                        width: '100%', padding: '20px 40px', border: 'none', textAlign: 'left', cursor: 'pointer',
                        background: activeTab === 'orders' ? 'rgba(255,255,255,0.05)' : 'none',
                        color: activeTab === 'orders' ? 'var(--secondary)' : 'rgba(255,255,255,0.5)',
                        borderLeft: activeTab === 'orders' ? '4px solid var(--secondary)' : '4px solid transparent',
                        transition: '0.3s', display: 'flex', alignItems: 'center', gap: '15px'
                    }}>
                        <i className="fas fa-chart-line" style={{width: '20px'}}></i>
                        <span style={{fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px'}}>Operations</span>
                    </button>
                    <button onClick={() => setActiveTab('products')} style={{ 
                        width: '100%', padding: '20px 40px', border: 'none', textAlign: 'left', cursor: 'pointer',
                        background: activeTab === 'products' ? 'rgba(255,255,255,0.05)' : 'none',
                        color: activeTab === 'products' ? 'var(--secondary)' : 'rgba(255,255,255,0.5)',
                        borderLeft: activeTab === 'products' ? '4px solid var(--secondary)' : '4px solid transparent',
                        transition: '0.3s', display: 'flex', alignItems: 'center', gap: '15px'
                    }}>
                        <i className="fas fa-boxes" style={{width: '20px'}}></i>
                        <span style={{fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px'}}>Inventory</span>
                    </button>
                    <button onClick={() => setActiveTab('users')} style={{ 
                        width: '100%', padding: '20px 40px', border: 'none', textAlign: 'left', cursor: 'pointer',
                        background: activeTab === 'users' ? 'rgba(255,255,255,0.05)' : 'none',
                        color: activeTab === 'users' ? 'var(--secondary)' : 'rgba(255,255,255,0.5)',
                        borderLeft: activeTab === 'users' ? '4px solid var(--secondary)' : '4px solid transparent',
                        transition: '0.3s', display: 'flex', alignItems: 'center', gap: '15px'
                    }}>
                        <i className="fas fa-users-cog" style={{width: '20px'}}></i>
                        <span style={{fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px'}}>Registry</span>
                    </button>
                </nav>

                <div style={{ padding: '0 40px' }}>
                    <button onClick={logout} style={{ color: 'var(--heart)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Terminate Session</button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '300px', padding: '60px', width: 'calc(100% - 300px)' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                    <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '3px' }}>Administrative Console</span>
                        <h1 style={{ fontSize: '3rem', margin: '10px 0 0 0', fontFamily: 'Playfair Display, serif' }}>
                            {activeTab === 'orders' ? 'Operations Log' : activeTab === 'products' ? 'Master Registry' : 'Client Identity Database'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.8rem' }}></i>
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Query records..." style={{ padding: '15px 15px 15px 50px', borderRadius: '4px', border: '1px solid var(--gray-200)', width: '350px', background: 'white', fontSize: '0.85rem' }} />
                        </div>
                    </div>
                </header>

                {error && (
                    <div style={{ padding: '20px', background: '#fff5f5', color: '#c53030', borderRadius: '8px', marginBottom: '30px', border: '1px solid #feb2b2', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                    </div>
                )}

                {loading ? <div style={{textAlign: 'center', padding: '100px'}}><i className="fas fa-circle-notch fa-spin fa-2x" style={{color: 'var(--primary)'}}></i></div> : (
                    <>
                        {activeTab === 'orders' && (
                            <div className="reveal-anim">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '60px' }}>
                                    <div className="profile-card-premium" style={{ background: 'white', padding: '30px', borderRadius: '8px', border: '1px solid var(--gray-100)' }}>
                                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Aggregate Revenue</span>
                                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>₦{totalRevenue.toLocaleString()}</h2>
                                    </div>
                                    <div className="profile-card-premium" style={{ background: 'white', padding: '30px', borderRadius: '8px', border: '1px solid var(--gray-100)' }}>
                                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Processed Manifests</span>
                                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>{orders.length}</h2>
                                    </div>
                                    <div className="profile-card-premium" style={{ background: 'white', padding: '30px', borderRadius: '8px', border: '1px solid var(--gray-100)' }}>
                                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Validated Clients</span>
                                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>{totalCustomers}</h2>
                                    </div>
                                    <div className="profile-card-premium" style={{ background: 'white', padding: '30px', borderRadius: '8px', border: lowStockCount > 0 ? '1px solid var(--heart)' : '1px solid var(--gray-100)' }}>
                                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Stock Anomalies</span>
                                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700, color: lowStockCount > 0 ? 'var(--heart)' : 'inherit' }}>{lowStockCount}</h2>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', marginBottom: '60px' }}>
                                    {/* Analytics Chart */}
                                    <div style={{ background: 'white', padding: '40px', borderRadius: '8px', border: '1px solid var(--gray-100)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                                        <h3 style={{ marginBottom: '30px', fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>Revenue Temporality</h3>
                                        <div style={{ width: '100%', height: 300 }}>
                                            <ResponsiveContainer>
                                                <AreaChart data={chartData}>
                                                    <defs>
                                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.15}/>
                                                            <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#aaa'}} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#aaa'}} />
                                                    <Tooltip 
                                                        contentStyle={{ border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px' }}
                                                        itemStyle={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.7rem' }}
                                                    />
                                                    <Area type="monotone" dataKey="revenue" stroke="var(--secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Category Distribution */}
                                    <div style={{ background: 'white', padding: '40px', borderRadius: '8px', border: '1px solid var(--gray-100)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                                        <h3 style={{ marginBottom: '30px', fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>Classification Spread</h3>
                                        <div style={{ width: '100%', height: 300 }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={categoryData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {categoryData.map((_entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-container" style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Reference</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Client</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Liability</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Status</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map(order => (
                                                <tr key={order._id} style={{ borderBottom: '1px solid var(--gray-50)' }} className="table-row-hover">
                                                    <td style={{ padding: '25px', fontFamily: 'monospace', fontSize: '0.75rem' }}>#{order._id.slice(-8).toUpperCase()}</td>
                                                    <td style={{ padding: '25px', fontWeight: 600, fontSize: '0.85rem' }}>
                                                        {typeof order.user !== 'string' ? (order.user?.name || 'ANON') : order.user}
                                                    </td>
                                                    <td style={{ padding: '25px', fontWeight: 700, fontSize: '0.85rem' }}>₦{order.totalPrice.toLocaleString()}</td>
                                                    <td style={{ padding: '25px' }}>
                                                        <span style={{ 
                                                            padding: '5px 10px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase',
                                                            border: `1px solid ${getStatusColor(order.status)}`, color: getStatusColor(order.status), background: `${getStatusColor(order.status)}10`
                                                        }}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '25px' }}>
                                                        <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} style={{ padding: '8px', border: '1px solid var(--gray-100)', borderRadius: '4px', fontSize: '0.7rem' }}>
                                                            <option value="Placed">Placed</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="reveal-anim">
                                <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.3rem', fontFamily: 'Playfair Display, serif' }}>Registry Count: {products.length} Units</h3>
                                    <button className="btn btn-primary" onClick={() => openEditModal()}>+ INTEGRATE NEW ASSET</button>
                                </div>
                                <div className="table-container" style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Asset Identity</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Classification</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Stock Level</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Valuation</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Control</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map(p => (
                                                <tr key={p._id} style={{ borderBottom: '1px solid var(--gray-50)', background: p.countInStock < 5 ? '#fff5f5' : 'transparent' }}>
                                                    <td style={{ padding: '25px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                            <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '25px' }}><span style={{ fontSize: '0.6rem', padding: '4px 10px', background: 'var(--gray-100)', borderRadius: '20px' }}>{p.category.toUpperCase()}</span></td>
                                                    <td style={{ padding: '25px' }}>
                                                        <span style={{ fontWeight: 700, color: p.countInStock < 5 ? 'var(--heart)' : 'inherit' }}>{p.countInStock} UNITS</span>
                                                    </td>
                                                    <td style={{ padding: '25px', fontWeight: 700 }}>₦{p.price.toLocaleString()}</td>
                                                    <td style={{ padding: '25px' }}>
                                                        <div style={{display: 'flex', gap: '15px'}}>
                                                            <button onClick={() => openEditModal(p)} style={{background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer'}} className="btn-icon-hover"><i className="fas fa-edit"></i></button>
                                                            <button onClick={() => deleteProduct(p._id)} style={{background: 'none', border: 'none', color: 'var(--heart)', cursor: 'pointer'}} className="btn-icon-hover"><i className="fas fa-trash-alt"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="reveal-anim">
                                <h3 style={{ fontSize: '1.3rem', fontFamily: 'Playfair Display, serif', marginBottom: '40px' }}>Client Database: {users.length} Identities</h3>
                                <div className="table-container" style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Client Identity</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Email Alias</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Auth Status</th>
                                                <th style={{ textAlign: 'left', padding: '25px', color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Procurement Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(user => {
                                                const userTotal = orders.filter(o => {
                                                    const orderUserId = typeof o.user === 'string' ? o.user : o.user?._id;
                                                    return orderUserId === user._id;
                                                }).reduce((acc, o) => acc + o.totalPrice, 0);
                                                return (
                                                    <tr key={user._id} style={{ borderBottom: '1px solid var(--gray-50)' }} className="table-row-hover">
                                                        <td style={{ padding: '25px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                <div style={{ width: '35px', height: '35px', background: 'var(--primary)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{user.name.charAt(0)}</div>
                                                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.name}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '25px', fontSize: '0.85rem' }}>{user.email}</td>
                                                        <td style={{ padding: '25px' }}>
                                                            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: user.isAdmin ? 'var(--secondary)' : 'var(--text-muted)' }}>{user.isAdmin ? 'ADMINISTRATOR' : 'CLIENT'}</span>
                                                        </td>
                                                        <td style={{ padding: '25px', fontWeight: 700 }}>₦{userTotal.toLocaleString()}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal remains same but with improved styles */}
            {showModal && (
                <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(10px)'}}>
                    <div className="reveal-anim" style={{background: 'white', padding: '50px', borderRadius: '12px', width: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
                        <h2 style={{fontFamily: 'Playfair Display, serif', marginBottom: '30px'}}>{editingProduct ? 'Update Entry' : 'Integrate Asset'}</h2>
                        <form onSubmit={submitProductHandler}>
                             <div className="profile-field"><label>Nomenclature</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                             <div className="profile-field"><label>Valuation</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
                             <div className="profile-field"><label>Imagery URL</label><input type="text" value={image} onChange={(e) => setImage(e.target.value)} required /></div>
                             <div className="profile-field" style={{marginTop: '-15px', marginBottom: '15px'}}>
                                <input type="file" onChange={uploadFileHandler} style={{fontSize: '0.7rem'}} />
                                {uploading && <span style={{fontSize: '0.6rem', color: 'var(--primary)', marginLeft: '10px'}}><i className="fas fa-spinner fa-spin"></i> Processing Imagery...</span>}
                             </div>
                             <div className="profile-field"><label>Classification</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required /></div>
                             <div className="profile-field"><label>Stock Volume</label><input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required /></div>
                             <div className="profile-field"><label>Technical Specs</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea></div>
                             <div style={{display: 'flex', gap: '20px', marginTop: '30px'}}>
                                <button type="submit" className="btn btn-primary" style={{flex: 1}}>AUTHORIZE</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{flex: 1}}>CANCEL</button>
                             </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
