import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { userInfo, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  React.useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const { data } = await axios.post('/api/auth/login', { email, password });
        login(data);
        navigate(redirect);
      } else {
        await axios.post('/api/auth/register', { name, email, password, phone });
        setSuccess('Registration successful! Please log in below to access your account.');
        setMode('login');
        setName('');
        setPhone('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setSuccess('');
    setName('');
    setPhone('');
  };

  return (
    <main className="container auth-main-container">
      <div className="auth-box reveal-anim stagger-1">
        <div className="auth-header">
          <span className="item-badge">{mode === 'login' ? 'Login' : 'Register'}</span>
          <h1 className="premium-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login' ? 'Enter your email and password.' : 'Fill in the details to register.'}
          </p>
        </div>

        <form onSubmit={submitHandler} className="auth-form-card reveal-anim stagger-2">
          
          {error && <div className="error-banner">{error}</div>}
          {success && (
            <div className="success-banner" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              color: '#10b981',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" placeholder="Your full name" required={mode==='register'}
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" placeholder="Your phone number" required={mode==='register'}
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="form-input" />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" placeholder="your@email.com" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" placeholder="••••••••" required
               value={password} onChange={(e) => setPassword(e.target.value)}
               className="form-input" />
          </div>
          
          <div className="form-actions-secondary">
            {mode === 'login' && (
              <Link to="/forgotpassword" className="forgot-link">
                Forgot Password?
              </Link>
            )}
          </div>

          <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'login' ? 'Login' : 'Register')}
          </button>

          <p className="auth-switch">
            <span>{mode === 'login' ? 'Need an account? ' : 'Already have an account? '}</span>
            <a href="#" onClick={toggleMode} className="switch-link">
              {mode === 'login' ? 'Create an account' : 'Sign in here'}
            </a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Auth;
