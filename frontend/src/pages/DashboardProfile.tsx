import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DashboardProfile: React.FC = () => {
    const { userInfo, login } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [profilePic, setProfilePic] = useState('');
    
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setEmail(userInfo.email || '');
            setPhone(userInfo.phone || '');
            setProfilePic(userInfo.profilePic || '');
        }
    }, [userInfo]);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userInfo) return;
        
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            
            const { data } = await axios.put('/api/users/profile', { name, email, password, phone, profilePic }, config);
            login(data); // update global context
            setMessage('Profile Updated Successfully');
            setEditMode(false);
            setPassword(''); // clear password field
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) return null;

    return (
        <>
            <header className="content-header">
                <span className="breadcrumb">Account / Profile Settings</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{fontSize: '2.8rem', margin: '10px 0 0 0'}}>Personal Registry</h1>
                        <p className="section-description" style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.6 }}>
                            Update your biological data and account credentials within the Victoria system.
                        </p>
                    </div>
                    {!editMode && (
                        <button onClick={() => setEditMode(true)} className="btn btn-primary compact" style={{ padding: '15px 30px' }}>
                            <i className="fas fa-edit" style={{marginRight: '10px'}}></i> Modify Data
                        </button>
                    )}
                </div>
            </header>

            <div className="profile-card-premium reveal-anim" style={{ 
                background: 'rgba(255, 255, 255, 0.7)', 
                backdropFilter: 'blur(10px)', 
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                position: 'relative',
                overflow: 'visible',
                borderRadius: '8px'
            }}>
                {/* Profile Pic Floating */}
                <div style={{ 
                    position: 'absolute', 
                    top: '-45px', 
                    right: '50px', 
                    width: '90px', 
                    height: '90px', 
                    borderRadius: '50%', 
                    background: 'var(--white)', 
                    border: '5px solid var(--background)', 
                    overflow: 'hidden', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 2
                }}>
                    <img src={userInfo?.profilePic || `https://ui-avatars.com/api/?name=${userInfo?.name}&background=2C3E50&color=fff`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {message && (
                    <div className="reveal-anim" style={{ 
                        color: 'var(--secondary)', 
                        marginBottom: '30px', 
                        padding: '15px 25px', 
                        backgroundColor: 'rgba(142, 151, 117, 0.1)', 
                        borderRadius: '4px', 
                        borderLeft: '4px solid var(--secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}>
                        <i className="fas fa-check-circle" style={{marginRight: '10px'}}></i> {message}
                    </div>
                )}
                {error && (
                    <div className="reveal-anim" style={{ 
                        color: 'var(--heart)', 
                        marginBottom: '30px', 
                        padding: '15px 25px', 
                        backgroundColor: 'rgba(231, 76, 60, 0.1)', 
                        borderRadius: '4px', 
                        borderLeft: '4px solid var(--heart)',
                        fontSize: '0.9rem'
                    }}>
                        <i className="fas fa-exclamation-triangle" style={{marginRight: '10px'}}></i> {error}
                    </div>
                )}

                {!editMode ? (
                    <div className="reveal-anim">
                        <section style={{marginBottom: '50px'}}>
                            <h3 style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--secondary)', marginBottom: '30px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px'}}>
                                Biological Identity
                            </h3>
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px'}}>
                                <div className="profile-field">
                                    <label>Legal Name</label>
                                    <p style={{fontSize: '1.2rem'}}>{userInfo?.name}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Electronic Mail</label>
                                    <p style={{fontSize: '1.2rem'}}>{userInfo?.email}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Phone Signature</label>
                                    <p style={{fontSize: '1.2rem'}}>{userInfo?.phone || 'Pending Registration'}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Account Status</label>
                                    <p style={{fontSize: '1.2rem', color: 'var(--secondary)'}}>
                                        <i className="fas fa-shield-alt" style={{marginRight: '8px'}}></i> Verified Member
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--secondary)', marginBottom: '30px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px'}}>
                                Security Protocol
                            </h3>
                            <div style={{display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', background: 'var(--background)', borderRadius: '4px'}}>
                                <i className="fas fa-lock" style={{color: 'var(--primary)', fontSize: '1.2rem'}}></i>
                                <div>
                                    <p style={{margin: 0, fontSize: '0.9rem', fontWeight: 600}}>Password Protection</p>
                                    <p style={{margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)'}}>Last updated recently. Ensure your password remains confidential.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <form onSubmit={submitHandler} className="reveal-anim">
                        <h3 style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--secondary)', marginBottom: '30px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px'}}>
                            Modify Registry Data
                        </h3>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px'}}>
                            <div className="profile-field">
                                <label>Legal Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter full name" />
                            </div>
                            <div className="profile-field">
                                <label>Electronic Mail</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" />
                            </div>
                            <div className="profile-field">
                                <label>Phone Signature</label>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 ..." />
                            </div>
                            <div className="profile-field">
                                <label>Avatar Resource (URL)</label>
                                <input type="text" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} placeholder="https://..." />
                            </div>
                        </div>

                        <h3 style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--secondary)', margin: '40px 0 30px 0', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px'}}>
                            Security Update
                        </h3>
                        <div className="profile-field" style={{maxWidth: '100%'}}>
                            <label>Secret Key (New Password)</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to maintain current" />
                        </div>

                        <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Synchronize Profile'}
                            </button>
                            <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                                Abort Modification
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default DashboardProfile;
