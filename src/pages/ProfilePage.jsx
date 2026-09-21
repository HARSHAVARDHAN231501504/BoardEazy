import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import BiometricScanner from '../components/BiometricScanner';
import {
  User,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Mail,
  Phone,
  LogOut,
  CheckCircle2,
  Lock,
  Edit,
  Sparkles
} from 'lucide-react';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, completeFirstTimeSetup } = useBoardEazy();

  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePinChangeSubmit = (e) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      alert('PIN must be 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      alert('PINs do not match.');
      return;
    }
    completeFirstTimeSetup({ pin: newPin });
    setShowPinModal(false);
    setNewPin('');
    setConfirmPin('');
    setToastMsg('Security PIN changed successfully!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleBiometricReScanComplete = () => {
    setShowBiometricModal(false);
    setToastMsg('Biometric reference template refreshed successfully!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem', maxWidth: '780px' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.9rem', color: 'var(--primary-900)' }}>
          Profile & Security Center
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Manage your BoardEazy identity, biometric token registration, and 4-digit PIN authentication.
        </p>
      </div>

      {toastMsg && (
        <div style={{
          background: 'var(--success-green-light)',
          color: '#065f46',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid #a7f3d0',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} />
          {toastMsg}
        </div>
      )}

      {/* Main Profile Card */}
      <div className="card" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-700), var(--primary-500))',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(13, 62, 122, 0.25)'
          }}>
            {currentUser?.name ? currentUser.name[0] : 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-900)', margin: 0 }}>
                {currentUser?.name || 'Harshavardhan S'}
              </h2>
              <span className="badge badge-primary">
                {currentUser?.role?.toUpperCase() || 'PASSENGER'}
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'block' }}>
              Connected with Google Identity • BoardEazy Verified Profile
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ background: 'var(--primary-25)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--primary-100)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              Google Account / Email
            </span>
            <strong style={{ color: 'var(--primary-900)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={15} color="var(--primary-600)" />
              {currentUser?.email || 'passenger@demo.com'}
            </strong>
          </div>

          <div style={{ background: 'var(--primary-25)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--primary-100)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              Registered Mobile
            </span>
            <strong style={{ color: 'var(--primary-900)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={15} color="var(--primary-600)" />
              {currentUser?.phone || '+91 98765 43210'}
            </strong>
          </div>
        </div>

        {/* Security Status Block */}
        <div>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
            Zero-OTP Security Credentials
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Google */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '0.875rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-900)' }}>Google Authentication</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Connected with {currentUser?.email || 'passenger@demo.com'}</span>
                </div>
              </div>
              <span className="badge badge-success">
                Connected
              </span>
            </div>

            {/* Biometric */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '0.875rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Fingerprint size={20} color="var(--primary-600)" />
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-900)' }}>Hardware Biometric Token</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>RD-Service Registered & Bound to Sub-PNRs</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-success">Registered</span>
                <button onClick={() => setShowBiometricModal(true)} className="btn btn-secondary btn-sm">
                  Re-Scan
                </button>
              </div>
            </div>

            {/* PIN */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '0.875rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <KeyRound size={20} color="var(--primary-600)" />
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-900)' }}>4-Digit Security PIN</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Configured (Encrypted PIN: • • • •)</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-success">Enabled</span>
                <button onClick={() => setShowPinModal(true)} className="btn btn-secondary btn-sm">
                  Change PIN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1.5rem',
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <button onClick={() => alert('Profile details updated successfully.')} className="btn btn-outline">
            <Edit size={16} />
            Update Profile
          </button>

          <button onClick={handleLogout} className="btn btn-danger">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Biometric Re-scan Modal */}
      {showBiometricModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '20px', maxWidth: '500px', width: '100%' }}>
            <BiometricScanner
              passengerName={currentUser?.name || 'Harshavardhan S'}
              subPnr="REFRESH-PROFILE"
              title="Refresh Biometric Reference"
              subtitle="Place registered finger on sensor to update reference token"
              onVerificationComplete={handleBiometricReScanComplete}
            />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button onClick={() => setShowBiometricModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {showPinModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '20px', maxWidth: '440px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
              Change 4-Digit PIN
            </h3>
            <form onSubmit={handlePinChangeSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-input"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  placeholder="• • • •"
                  style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.4em', fontFamily: 'JetBrains Mono', fontWeight: 800 }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-input"
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value)}
                  placeholder="• • • •"
                  style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.4em', fontFamily: 'JetBrains Mono', fontWeight: 800 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowPinModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save New PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
