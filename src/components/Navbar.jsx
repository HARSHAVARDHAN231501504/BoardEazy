import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import {
  Train,
  Ticket,
  Fingerprint,
  Search,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Cpu,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout, notifications, userRole } = useBoardEazy();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isTTERoute = location.pathname.startsWith('/tte');
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    if (isTTERoute) {
      navigate('/tte/login');
    } else {
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  // Render dedicated TTE Header for TTE routes
  if (isTTERoute) {
    return (
      <header className="navbar-wrapper no-print" style={{
        background: 'linear-gradient(135deg, #0b1f3a 0%, #1e3a8a 100%)',
        color: '#ffffff',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 990
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem'
        }}>
          {/* TTE Brand */}
          <Link to="/tte/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: '#ffffff'
          }}>
            <div style={{
              background: 'var(--railway-gold)',
              color: '#000000',
              padding: '0.45rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'Plus Jakarta Sans', color: '#ffffff' }}>
                  BoardEazy <span style={{ color: '#fde047' }}>TTE</span>
                </span>
                <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  MONITOR ONLY
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>
                Train Onboard Telemetry & Manifest
              </span>
            </div>
          </Link>

          {/* TTE Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              to="/tte/dashboard"
              style={{
                color: isActive('/tte/dashboard') ? '#ffffff' : '#bfdbfe',
                background: isActive('/tte/dashboard') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              Coach Manifest
            </Link>

            <Link
              to="/tte/ai-allocation"
              style={{
                color: '#ffffff',
                background: 'linear-gradient(135deg, var(--ai-indigo), var(--ai-purple))',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Cpu size={14} />
              AI Reallocation
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <LogOut size={14} />
              Exit Portal
            </button>
          </nav>
        </div>
      </header>
    );
  }

  // Standard Passenger Header (TTE and Admin links are completely omitted!)
  return (
    <header className="navbar-wrapper no-print" style={{
      background: 'linear-gradient(135deg, #072a56 0%, #0d47a1 100%)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-md)',
      position: 'sticky',
      top: 0,
      zIndex: 990
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem'
      }}>
        {/* Brand Logo */}
        <Link to="/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          color: '#ffffff'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1565c0, #2196f3)',
            color: '#ffffff',
            padding: '0.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Train size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                fontFamily: 'Plus Jakarta Sans',
                color: '#ffffff'
              }}>
                Board<span style={{ color: '#64b5f6' }}>Eazy</span>
              </span>
            </div>
            <span style={{
              fontSize: '0.68rem',
              color: '#90caf9',
              display: 'block',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              fontWeight: 600
            }}>
              Smart Railway Booking & Boarding
            </span>
          </div>
        </Link>

        {/* Passenger Navigation Menu */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.35rem'
        }} className="desktop-nav">
          <Link
            to="/dashboard"
            style={{
              color: isActive('/dashboard') ? '#ffffff' : '#bbdefb',
              background: isActive('/dashboard') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            Home
          </Link>
          <Link
            to="/book"
            style={{
              color: isActive('/book') ? '#ffffff' : '#bbdefb',
              background: isActive('/book') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Ticket size={16} />
            Book Ticket
          </Link>
          <Link
            to="/my-bookings"
            style={{
              color: isActive('/my-bookings') ? '#ffffff' : '#bbdefb',
              background: isActive('/my-bookings') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            My Bookings
          </Link>
          <Link
            to="/boarding"
            style={{
              color: '#ffffff',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
            }}
          >
            <Fingerprint size={16} />
            Boarding Platform
          </Link>
          <Link
            to="/pnr-status"
            style={{
              color: isActive('/pnr-status') ? '#ffffff' : '#bbdefb',
              background: isActive('/pnr-status') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Search size={15} />
            PNR Status
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* User Profile Pill */}
          {currentUser ? (
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.825rem',
                fontWeight: 600
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'var(--primary-400)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.75rem'
              }}>
                {currentUser.name ? currentUser.name[0] : 'H'}
              </div>
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name || 'Harshavardhan S'}
              </span>
            </Link>
          ) : (
            <Link to="/login" className="btn btn-sm btn-secondary">
              Login
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fca5a5',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Logout"
          >
            <LogOut size={18} />
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.4rem'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#0a2d59',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <Link onClick={() => setMobileMenuOpen(false)} to="/dashboard" style={{ color: '#ffffff', padding: '0.5rem', textDecoration: 'none' }}>
            Home Dashboard
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/book" style={{ color: '#ffffff', padding: '0.5rem', textDecoration: 'none' }}>
            Book Ticket
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/my-bookings" style={{ color: '#ffffff', padding: '0.5rem', textDecoration: 'none' }}>
            My Bookings
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/boarding" style={{ color: '#a7f3d0', fontWeight: 700, padding: '0.5rem', textDecoration: 'none' }}>
            Digital Boarding Platform
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/pnr-status" style={{ color: '#93c5fd', padding: '0.5rem', textDecoration: 'none' }}>
            PNR Status
          </Link>
          <Link onClick={() => setMobileMenuOpen(false)} to="/profile" style={{ color: '#ffffff', padding: '0.5rem', textDecoration: 'none' }}>
            My Profile
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
