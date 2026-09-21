import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import BiometricScanner from '../components/BiometricScanner';
import {
  User,
  Fingerprint,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Mail,
  Phone,
  Lock
} from 'lucide-react';

export const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useBoardEazy();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Harshavardhan S',
    email: 'harshavardhan@gmail.com',
    phone: '+91 98765 43210',
    pin: '',
    confirmPin: ''
  });

  const [error, setError] = useState('');

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in your Full Name, Gmail Address, and Mobile Number.');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBiometricComplete = () => {
    setTimeout(() => {
      setStep(3);
    }, 700);
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    if (formData.pin.length !== 4) {
      setError('Security PIN must be exactly 4 digits.');
      return;
    }
    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match. Please re-enter.');
      return;
    }

    // Register user profile
    registerUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      pin: formData.pin
    });

    navigate('/dashboard');
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem', maxWidth: '680px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--primary-50)',
          color: 'var(--primary-700)',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          border: '1px solid var(--primary-200)'
        }}>
          <Sparkles size={14} />
          ACCOUNT CREATION & ONBOARDING
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-900)' }}>
          Create your BoardEazy Account
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Connect your Gmail, capture your hardware biometric token, and configure your 4-digit PIN.
        </p>
      </div>

      {/* 3 Step Wizard Progress */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: step >= 1 ? 'var(--primary-500)' : '#e2e8f0',
          color: step >= 1 ? '#ffffff' : 'var(--text-muted)',
          padding: '0.75rem',
          borderRadius: '12px',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', opacity: 0.85 }}>Step 1</span>
          <strong style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Mail size={14} />
            Gmail & Profile
          </strong>
        </div>

        <div style={{
          background: step >= 2 ? 'var(--primary-500)' : '#e2e8f0',
          color: step >= 2 ? '#ffffff' : 'var(--text-muted)',
          padding: '0.75rem',
          borderRadius: '12px',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', opacity: 0.85 }}>Step 2</span>
          <strong style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Fingerprint size={14} />
            Biometric Token
          </strong>
        </div>

        <div style={{
          background: step >= 3 ? 'var(--primary-500)' : '#e2e8f0',
          color: step >= 3 ? '#ffffff' : 'var(--text-muted)',
          padding: '0.75rem',
          borderRadius: '12px',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', opacity: 0.85 }}>Step 3</span>
          <strong style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <KeyRound size={14} />
            Create PIN
          </strong>
        </div>
      </div>

      {/* Card Content */}
      <div className="card" style={{ padding: '2rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
        {error && (
          <div style={{
            background: 'var(--danger-red-light)',
            color: '#991b1b',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        {/* Step 1: Gmail & Profile Info */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--primary-25)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid var(--primary-100)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <div>
                <strong style={{ color: 'var(--primary-900)', fontSize: '0.95rem', display: 'block' }}>
                  Register with Google / Gmail Account
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Zero-OTP biometric binding to individual passenger Sub-PNRs
                </span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Harshavardhan S"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Gmail / Google Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. harshavardhan@gmail.com"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '1rem' }}>
              Continue to Step 2: Register Biometric
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                Already have an account? Login with PIN →
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Biometric Registration */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
                Step 2: Register Hardware Biometric
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Your biometric fingerprint profile is registered for contactless station and coach gate access.
              </p>
            </div>

            <BiometricScanner
              passengerName={formData.name}
              subPnr="REG-TOKEN"
              title="Biometric Fingerprint Registration"
              subtitle="Place your registered finger on the biometric sensor device"
              onVerificationComplete={handleBiometricComplete}
            />
          </div>
        )}

        {/* Step 3: Create 4-Digit Security PIN */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--success-green-light)',
                color: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem'
              }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
                Step 3: Create 4-Digit Security PIN
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Use this PIN to quickly sign in and authorize tickets without OTP delays.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
              <div className="form-group">
                <label className="form-label">Enter 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-input"
                  value={formData.pin}
                  onChange={e => setFormData({ ...formData, pin: e.target.value })}
                  placeholder="• • • •"
                  style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.4em', fontFamily: 'JetBrains Mono', fontWeight: 800 }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-input"
                  value={formData.confirmPin}
                  onChange={e => setFormData({ ...formData, confirmPin: e.target.value })}
                  placeholder="• • • •"
                  style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.4em', fontFamily: 'JetBrains Mono', fontWeight: 800 }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success btn-lg" style={{ width: '100%' }}>
              <CheckCircle2 size={18} />
              Complete Setup & Enter BoardEazy
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSetupPage;
