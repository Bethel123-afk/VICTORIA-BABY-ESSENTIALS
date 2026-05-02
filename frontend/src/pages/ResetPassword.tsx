import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const { resettoken } = useParams<{ resettoken: string }>();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.put(`/api/users/resetpassword/${resettoken}`, { password });
            setMessage('Password reset successful! Redirecting...');
            
            // Login the user automatically
            localStorage.setItem('userInfo', JSON.stringify(data));
            // Reload to update context or just redirect to login
            setTimeout(() => {
                navigate('/login');
                window.location.reload();
            }, 2000);
        } catch (err: any) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container" style={{paddingTop: '150px', paddingBottom: '100px', display: 'flex', justifyContent: 'center'}}>
            <div className="reveal-anim" style={{maxWidth: '400px', width: '100%', background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <span className="item-badge">Security</span>
                    <h2 style={{fontSize: '2rem', marginTop: '10px'}}>New Password</h2>
                    <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Enter your new password below.</p>
                </div>

                {message && <div style={{padding: '15px', background: '#e6fffa', color: '#2c7a7b', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem'}}>{message}</div>}
                {error && <div style={{padding: '15px', background: '#fff5f5', color: '#c53030', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem'}}>{error}</div>}

                <form onSubmit={submitHandler}>
                    <div className="form-group" style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px'}}>New Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter new password" 
                            required 
                            style={{width: '100%', padding: '12px', border: '1px solid var(--gray-200)', borderRadius: '4px'}}
                        />
                    </div>
                    <div className="form-group" style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px'}}>Confirm Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Confirm your password" 
                            required 
                            style={{width: '100%', padding: '12px', border: '1px solid var(--gray-200)', borderRadius: '4px'}}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
                        {loading ? 'Reseting...' : 'Reset Password'}
                    </button>
                </form>

                <div style={{marginTop: '30px', textAlign: 'center'}}>
                    <Link to="/login" style={{color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem'}}>
                        <i className="fas fa-arrow-left"></i> Back to Login
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ResetPassword;
