import React from 'react';
import { Train, ShieldCheck, Cpu, Heart, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="no-print" style={{
      background: 'var(--primary-900)',
      color: '#ffffff',
      paddingTop: '3rem',
      paddingBottom: '2rem',
      marginTop: '4rem',
      borderTop: '3px solid var(--primary-500)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          {/* Col 1: Brand & Project */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.875rem' }}>
              <div style={{
                background: 'var(--primary-500)',
                padding: '0.4rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Train size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans', color: '#ffffff' }}>
                Board<span style={{ color: '#64b5f6' }}>Eazy</span>
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
              An Intelligent Railway Passenger Booking, Boarding & Automated Seat Allocation System. Academic Engineering Project Prototype.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              color: '#90caf9'
            }}>
              <Cpu size={13} />
              AI RAC Allocation Engine Active
            </div>
          </div>

          {/* Col 2: Architecture Highlights */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Key Architecture
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} color="#10b981" />
                Zero-OTP 4-Digit PIN & Google Auth
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} color="#10b981" />
                Individual Passenger Sub-PNR Tracking
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} color="#10b981" />
                Biometric Station & Coach Door Gates
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} color="#10b981" />
                Next Station + 15 KM No-Show Detection
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} color="#10b981" />
                TTE Monitor-Only (AI Autonomous Allocation)
              </li>
            </ul>
          </div>

          {/* Col 3: Demo Disclaimer */}
          <div>
            {/* <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Simulation Compliance
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
              This web application is a frontend demonstration prototype for presentation and evaluation. Biometrics, payments, and railway telemetry are simulated within client-side state.
            </p> */}
            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
              🔒 Zero sensitive passenger data stored.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div>
            © 2026 BoardEazy System. Designed for Intelligent Indian Railways.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Powered by React + Vite • Deep Blue UI Theme
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
