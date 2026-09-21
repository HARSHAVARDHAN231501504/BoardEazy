import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import {
  Train,
  KeyRound,
  ShieldCheck,
  User,
  ArrowRight,
  Fingerprint,
  Sparkles,
  Info,
  Mail,
  UserPlus
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithCredentials } = useBoardEazy();

  const [email, setEmail] = useState('harshavardhan@gmail.com');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (!pin || pin.length !== 4) {
      setError('Please enter a valid 4-digit security PIN.');
      return;
    }
    const res = loginWithCredentials(email, pin);
    if (res.success) {
      if (res.role === 'tte') navigate('/tte/dashboard');
      else if (res.role === 'admin') navigate('/admin-dashboard');
      else navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid Gmail address or 4-digit PIN.');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at 50% 20%, #e0f2fe 0%, #f0f4f9 60%)'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1.5px solid var(--border-light)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden'
      }}>
        {/* Brand Header */}
        <div style={{
          background: 'linear-gradient(135deg, #072a56 0%, #0d47a1 100%)',
          color: '#ffffff',
          padding: '2rem 2rem 1.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1565c0, #2196f3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}>
            <Train size={32} color="#ffffff" />
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
            Board<span style={{ color: '#64b5f6' }}>Eazy</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#90caf9', marginTop: '0.35rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Smart Railway Booking & Boarding
          </p>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Zero-OTP Notice */}
          <div style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.8rem',
            color: 'var(--primary-800)'
          }}>
            <ShieldCheck size={18} color="var(--primary-600)" style={{ flexShrink: 0 }} />
            <div>
              <strong>Zero-OTP Security:</strong> Access your account securely using your Gmail address and 4-digit biometric PIN.
            </div>
          </div>

          {error && (
            <div style={{
              background: 'var(--danger-red-light)',
              color: '#991b1b',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handlePinSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Gmail / Email ID</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. harshavardhan@gmail.com"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">4-Digit Security PIN</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                  Encrypted PIN
                </span>
              </div>
              <input
                type="password"
                maxLength={4}
                className="form-input"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="• • • •"
                style={{
                  letterSpacing: '0.5em',
                  fontSize: '1.3rem',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontFamily: 'JetBrains Mono'
                }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '1.25rem' }}>
              Login to BoardEazy
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Create Account CTA */}
          <div style={{
            background: 'var(--primary-25)',
            border: '1px solid var(--primary-100)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              New to BoardEazy?
            </span>
            <Link to="/setup-profile" className="btn btn-secondary" style={{ width: '100%', fontWeight: 700 }}>
              <UserPlus size={16} />
              Create Account with Gmail & Biometric
            </Link>
          </div>

          {/* Staff Login Link */}
          <div style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <Link to="/tte/login" style={{ color: 'var(--primary-700)', fontWeight: 600, textDecoration: 'none' }}>
              🚆 TTE Official Portal Login →
            </Link>
            <Link to="/admin-dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Admin Ops
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
