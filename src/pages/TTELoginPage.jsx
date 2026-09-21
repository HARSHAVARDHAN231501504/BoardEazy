import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import { ShieldCheck, Train, KeyRound, ArrowRight, Lock, UserCheck } from 'lucide-react';

export const TTELoginPage = () => {
  const navigate = useNavigate();
  const { loginWithCredentials } = useBoardEazy();

  const [username, setUsername] = useState('tte@boardeazy.com');
  const [pin, setPin] = useState('5678');
  const [error, setError] = useState('');

  const handleTTELogin = (e) => {
    e.preventDefault();
    const res = loginWithCredentials(username, pin);
    if (res.success && res.role === 'tte') {
      navigate('/tte/dashboard');
    } else {
      setError('Invalid TTE credentials or Official PIN.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #0b1f3a 0%, #1e3a8a 100%)',
      color: '#ffffff'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#ffffff',
        color: 'var(--text-primary)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0d2868 100%)',
          color: '#ffffff',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'var(--railway-gold)',
            color: '#000000',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)'
          }}>
            <ShieldCheck size={32} />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0, fontWeight: 900 }}>
            TTE Official Portal
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '0.35rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Southern Railway Onboard Telemetry System
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '2rem' }}>
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.8rem',
            color: '#92400e',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Lock size={16} color="#d97706" />
            <span>Authorized Indian Railways TTE & Onboard Staff Only</span>
          </div>

          {error && (
            <div style={{ background: 'var(--danger-red-light)', color: '#991b1b', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '0.825rem', marginBottom: '1rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleTTELogin}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">TTE Officer ID / Username</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. tte@boardeazy.com"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">4-Digit Official Security PIN</label>
              <input
                type="password"
                maxLength={4}
                className="form-input"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="• • • •"
                style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.4em', fontFamily: 'JetBrains Mono', fontWeight: 800 }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '1rem' }}>
              <span>Access Live Coach Monitor</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick demo fill */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Demo TTE Login: </span>
            <code style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
              tte@boardeazy.com / 5678
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTELoginPage;
