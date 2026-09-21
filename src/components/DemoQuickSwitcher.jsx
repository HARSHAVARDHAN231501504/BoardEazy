import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import {
  User,
  ShieldAlert,
  Sliders,
  QrCode,
  Fingerprint,
  RotateCcw,
  Sparkles,
  Train
} from 'lucide-react';

export const DemoQuickSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, login, resetDemoData } = useBoardEazy();

  const handleRoleSwitch = (roleKey, targetPath) => {
    login(roleKey);
    navigate(targetPath);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo bookings, seat allocations, and scan states to original defaults?')) {
      resetDemoData();
      alert('Demo data restored to initial pristine state.');
    }
  };

  const currentPath = location.pathname;

  return (
    <div className="demo-switcher no-print" style={{
      background: 'linear-gradient(90deg, #061d38 0%, #0a2d59 100%)',
      color: '#ffffff',
      padding: '0.45rem 1.25rem',
      fontSize: '0.78rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.6rem',
      zIndex: 999,
      position: 'sticky',
      top: 0
    }}>
      {/* Demo Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          background: 'var(--railway-gold)',
          color: '#000000',
          fontWeight: 800,
          fontSize: '0.65rem',
          padding: '0.15rem 0.45rem',
          borderRadius: '4px',
          letterSpacing: '0.04em'
        }}>
          DEMO QUICK SWITCHER
        </span>
        <span style={{ color: '#90caf9', display: 'none', mdDisplay: 'inline' }}>
          Active View: <strong>{currentUser?.role?.toUpperCase() || 'PASSENGER'}</strong>
        </span>
      </div>

      {/* Role & Simulator Quick Switch Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleRoleSwitch('passenger', '/dashboard')}
          style={{
            background: currentPath.includes('/dashboard') || currentPath.includes('/book') || currentPath.includes('/my-bookings')
              ? 'var(--primary-500)'
              : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: 'none',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <User size={12} />
          Passenger
        </button>

        <button
          onClick={() => navigate('/boarding')}
          style={{
            background: currentPath === '/boarding' ? 'var(--primary-500)' : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: 'none',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <Fingerprint size={12} />
          Digital Boarding
        </button>

        <button
          onClick={() => navigate('/station-gate')}
          style={{
            background: currentPath === '/station-gate' ? '#059669' : 'rgba(5, 150, 105, 0.3)',
            color: '#ffffff',
            border: 'none',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <QrCode size={12} />
          Station Gate Scanner
        </button>

        <button
          onClick={() => navigate('/train-gate')}
          style={{
            background: currentPath === '/train-gate' ? '#059669' : 'rgba(5, 150, 105, 0.3)',
            color: '#ffffff',
            border: 'none',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <Train size={12} />
          Coach Gate Biometric
        </button>

        <button
          onClick={() => handleRoleSwitch('tte', '/tte-dashboard')}
          style={{
            background: currentPath === '/tte-dashboard' ? 'var(--warning-amber)' : 'rgba(217, 119, 6, 0.3)',
            color: '#ffffff',
            border: 'none',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <ShieldAlert size={12} />
          TTE Live Monitor
        </button>

        <button
          onClick={() => navigate('/ai-allocation')}
          style={{
            background: currentPath === '/ai-allocation' ? '#7c3aed' : 'rgba(124, 58, 237, 0.35)',
            color: '#ffffff',
            border: 'none',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <Sparkles size={12} />
          AI Seat Engine
        </button>

        <button
          onClick={() => handleRoleSwitch('admin', '/admin-dashboard')}
          style={{
            background: currentPath === '/admin-dashboard' ? 'var(--primary-600)' : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: 'none',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <Sliders size={12} />
          Admin Analytics
        </button>

        <button
          onClick={handleReset}
          title="Reset demo data"
          style={{
            background: 'transparent',
            color: '#f87171',
            border: '1px solid rgba(248, 113, 113, 0.4)',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <RotateCcw size={11} />
          Reset Demo
        </button>
      </div>
    </div>
  );
};

export default DemoQuickSwitcher;
