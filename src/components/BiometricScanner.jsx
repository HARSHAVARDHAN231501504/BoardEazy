import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle2, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

export const BiometricScanner = ({
  passengerName = 'Harshavardhan S',
  subPnr = 'PA01',
  onVerificationComplete,
  title = 'Biometric Verification',
  subtitle = 'Place your registered finger on the biometric hardware scanner'
}) => {
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'success'
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setScanState('scanning');
    setProgress(0);
  };

  useEffect(() => {
    let interval;
    if (scanState === 'scanning') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanState('success');
            if (onVerificationComplete) {
              setTimeout(() => {
                onVerificationComplete({ passengerName, subPnr, timestamp: new Date().toLocaleTimeString() });
              }, 400);
            }
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [scanState, onVerificationComplete, passengerName, subPnr]);

  const handleReset = () => {
    setScanState('idle');
    setProgress(0);
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '16px',
      border: '1.5px solid var(--border-light)',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: 'var(--shadow-lg)',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* Hardware simulator badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.3rem 0.75rem',
        background: '#e0f2fe',
        color: '#0369a1',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.04em',
        marginBottom: '1rem',
        border: '1px solid #bae6fd'
      }}>
        <Cpu size={13} />
        HARDWARE SENSOR SIMULATOR (RD SERVICE COMPLIANT)
      </div>

      <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        {subtitle}
      </p>

      {/* Passenger mini badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--primary-50)',
        border: '1px solid var(--primary-100)',
        padding: '0.65rem 1rem',
        borderRadius: '10px',
        marginBottom: '1.75rem',
        fontSize: '0.85rem'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Passenger
          </span>
          <span style={{ fontWeight: 700, color: 'var(--primary-900)' }}>{passengerName}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Sub-PNR
          </span>
          <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontFamily: 'JetBrains Mono' }}>{subPnr}</span>
        </div>
      </div>

      {/* Biometric Scanner Visualizer */}
      <div style={{
        position: 'relative',
        width: '180px',
        height: '220px',
        margin: '0 auto 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: scanState === 'success' ? '#ecfdf5' : '#0a2d59',
        borderRadius: '24px',
        border: `3px solid ${scanState === 'success' ? '#059669' : scanState === 'scanning' ? '#2196f3' : '#1e40af'}`,
        boxShadow: scanState === 'scanning' ? '0 0 25px rgba(33, 150, 243, 0.45)' : scanState === 'success' ? '0 0 25px rgba(5, 150, 105, 0.45)' : 'var(--shadow-md)',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        {/* Concentric rings */}
        <div style={{
          position: 'absolute',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          border: `1px dashed ${scanState === 'success' ? 'rgba(5, 150, 105, 0.3)' : 'rgba(255, 255, 255, 0.15)'}`,
          animation: scanState === 'scanning' ? 'radarSweep 3s linear infinite' : 'none'
        }} />

        {scanState === 'success' ? (
          <div style={{ textAlign: 'center', animation: 'scaleUp 0.3s ease' }}>
            <CheckCircle2 size={64} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#065f46' }}>
              MATCH 99.8%
            </span>
          </div>
        ) : (
          <Fingerprint
            size={90}
            color={scanState === 'scanning' ? '#60a5fa' : '#94a3b8'}
            style={{
              transition: 'all 0.3s ease',
              filter: scanState === 'scanning' ? 'drop-shadow(0 0 8px #3b82f6)' : 'none'
            }}
          />
        )}

        {/* Laser scan beam line during scanning */}
        {scanState === 'scanning' && (
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #38bdf8, #60a5fa, transparent)',
            boxShadow: '0 0 12px 3px #38bdf8',
            animation: 'scanLine 1.5s ease-in-out infinite alternate'
          }} />
        )}
      </div>

      {/* Scanning status text & progress */}
      {scanState === 'scanning' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-700)', marginBottom: '0.35rem' }}>
            <span>Scanning Biometric Data...</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-500), #38bdf8)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {scanState === 'success' && (
        <div style={{
          background: 'var(--success-green-light)',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '0.75rem',
          marginBottom: '1.25rem',
          color: '#065f46'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <ShieldCheck size={18} />
            Biometric Verified Successfully
          </div>
          <p style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: '#047857' }}>
            Passenger identity cryptographically confirmed for Sub-PNR <strong>{subPnr}</strong>.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        {scanState === 'idle' && (
          <button
            onClick={startScan}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            <Fingerprint size={20} />
            Start Biometric Scan
          </button>
        )}

        {scanState === 'scanning' && (
          <button disabled className="btn btn-secondary btn-lg" style={{ width: '100%', opacity: 0.8 }}>
            <RefreshCw size={18} className="animate-spin" />
            Reading Sensor...
          </button>
        )}

        {scanState === 'success' && (
          <button onClick={handleReset} className="btn btn-outline btn-sm" style={{ color: 'var(--text-secondary)' }}>
            <RefreshCw size={14} />
            Scan Again
          </button>
        )}
      </div>

      {/* Legal & Tech disclaimer */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-light)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)'
      }}>
        🔒 <em>Biometric integration is simulated in this demo. No live biometric data is stored or transferred.</em>
      </div>
    </div>
  );
};

export default BiometricScanner;
