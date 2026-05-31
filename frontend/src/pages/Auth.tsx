import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

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
      } else if (mode === 'register') {
        await axios.post('/api/auth/register', { name, email, password, phone });
        setSuccess('Verification code sent! Please enter the 6-digit code sent to your email.');
        setMode('otp');
        setName('');
        setPhone('');
        setPassword('');
      } else if (mode === 'otp') {
        const { data } = await axios.post('/api/auth/verify-otp', { email, code: otp });
        setSuccess('Account activated successfully! Logging you in...');
        setTimeout(() => {
          login(data);
          navigate(redirect);
        }, 1500);
      }
    } catch (err: any) {
      const errMsg = err.response && err.response.data.message ? err.response.data.message : err.message;
      setError(errMsg);
      // Auto-toggle to verification state if they try to login with an unverified account
      if (mode === 'login' && errMsg.toLowerCase().includes('verify your account')) {
        setMode('otp');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtpHandler = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setResendLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/auth/resend-otp', { email });
      setSuccess('A new verification code has been dispatched to your email.');
    } catch (err: any) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const toggleMode = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setSuccess('');
    setName('');
    setPhone('');
    setOtp('');
  };

  return (
    <main className="container auth-main-container">
      <div className="auth-box reveal-anim stagger-1">
        <div className="auth-header">
          <span className="item-badge">
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Verification'}
          </span>
          <h1 className="premium-title">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Activate Account'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Enter your email and password.'
              : mode === 'register'
              ? 'Fill in the details to register.'
              : 'Enter the 6-digit OTP code sent to your email.'}
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

          {mode !== 'otp' ? (
            <>
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
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Verification Code (OTP)</label>
                <input type="text" placeholder="Enter 6-digit code" required={mode==='otp'}
                  value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="form-input" maxLength={6} style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }} />
              </div>
            </>
          )}
          
          <div className="form-actions-secondary">
            {mode === 'login' && (
              <Link to="/forgotpassword" className="forgot-link">
                Forgot Password?
              </Link>
            )}
            {mode === 'otp' && (
              <a href="#" onClick={resendOtpHandler} className="forgot-link" style={{ cursor: resendLoading ? 'not-allowed' : 'pointer' }}>
                {resendLoading ? 'Resending...' : 'Resend Verification Code?'}
              </a>
            )}
          </div>

          <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Verify & Activate')}
          </button>

          <p className="auth-switch">
            <span>
              {mode === 'otp'
                ? 'Back to '
                : mode === 'login'
                ? 'Need an account? '
                : 'Already have an account? '}
            </span>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              if (mode === 'otp') {
                setMode('register');
                setError('');
                setSuccess('');
              } else {
                toggleMode(e);
              }
            }} className="switch-link">
              {mode === 'otp' ? 'Register Screen' : mode === 'login' ? 'Create an account' : 'Sign in here'}
            </a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Auth;
