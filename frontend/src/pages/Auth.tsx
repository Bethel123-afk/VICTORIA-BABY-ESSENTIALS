import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { data } = await axios.post('/api/auth/login', { email, password });
        login(data);
        navigate(redirect);
      } else {
        const { data } = await axios.post('/api/auth/register', { name, email, password });
        login(data);
        navigate(redirect);
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
  };

  return (
    <main className="container auth-main-container" style={{paddingTop: '160px', paddingBottom: '100px'}}>
      <div className="auth-container reveal-anim stagger-1" id="auth-box">
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="item-badge">{mode === 'login' ? 'Login' : 'Register'}</span>
          <h1 id="auth-title" style={{ fontSize: '3rem', marginBottom: '10px' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p id="auth-subtitle" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {mode === 'login' ? 'Enter your email and password.' : 'Fill in the details to register.'}
          </p>
        </div>

        <form onSubmit={submitHandler} className="checkout-card reveal-anim stagger-2"
          style={{ padding: '40px', border: '1px solid var(--gray-200)', background: 'var(--white)' }}>
          
          {error && <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>{error}</div>}

          {mode === 'register' && (
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 700 }}>
                Full Name
              </label>
              <input type="text" placeholder="Your full name" required={mode==='register'}
                value={name} onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '15px', border: '1px solid var(--gray-200)', fontFamily: 'inherit' }} />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 700 }}>
              Email Address
            </label>
            <input type="email" placeholder="your@email.com" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '15px', border: '1px solid var(--gray-200)', fontFamily: 'inherit' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '10px', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 700 }}>
              Password
            </label>
            <input type="password" placeholder="••••••••" required
               value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '15px', border: '1px solid var(--gray-200)', fontFamily: 'inherit' }} />
          </div>
          
          <div style={{ textAlign: 'right', margin: '15px 0 30px' }} id="forgot-link-container">
            {mode === 'login' && (
              <Link to="/forgotpassword" id="forgot-pass-link" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginBottom: '20px' }}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'login' ? 'Login' : 'Register')}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>{mode === 'login' ? 'Need an account? ' : 'Already have an account? '}</span>
            <a href="#" onClick={toggleMode} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              {mode === 'login' ? 'Create an account' : 'Sign in here'}
            </a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Auth;
