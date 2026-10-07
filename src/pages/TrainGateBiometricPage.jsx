import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import BiometricScanner from '../components/BiometricScanner';
import { sendBoardedSMS } from '../services/notificationService';
import {
  Train,
  Fingerprint,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  UserCheck,
  Cpu,
  Clock
} from 'lucide-react';

export const TrainGateBiometricPage = () => {
  const { updatePassengerStatus, coachPassengers } = useBoardEazy();

  const [selectedSubPnr, setSelectedSubPnr] = useState('PA01');
  const [boardedRecord, setBoardedRecord] = useState(null);

  const passengerList = [
    { subPnr: 'PA01', name: 'Harshavardhan S', coach: 'C2', seat: '36', mobile: '+919176591451' },
    { subPnr: 'PA02', name: 'Meenakshi S', coach: 'C2', seat: '37', mobile: '+919176591451' }
  ];

  const activeP = passengerList.find(p => p.subPnr === selectedSubPnr) || passengerList[0];

  const handleBiometricVerificationSuccess = (scanData) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update global state
    updatePassengerStatus('4567891234', activeP.subPnr, 'BOARDED', timestamp);

    setBoardedRecord({
      name: activeP.name,
      subPnr: activeP.subPnr,
      coach: activeP.coach,
      seat: activeP.seat,
      timestamp,
      status: 'BOARDED',
      gateLocation: 'Coach C2 Automated Sliding Door (MAS Platform 1)'
    });

    // Send boarded SMS (fire-and-forget)
    sendBoardedSMS({
      name: activeP.name,
      subPnr: activeP.subPnr,
      mobile: activeP.mobile || '+919176591451',
      coach: activeP.coach,
      seat: activeP.seat,
      trainName: 'Chennai – Mysuru Vande Bharat (20607)',
      scanTime: timestamp,
    }).then(result => {
      if (!result.success) {
        console.warn('[SMS] Boarded SMS failed:', result.error);
      }
    });
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '780px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--success-green-light)',
          color: '#065f46',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          border: '1px solid #a7f3d0'
        }}>
          <Train size={14} />
          COACH ENTRANCE HARDWARE SIMULATOR
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-900)' }}>
          Train Gate Biometric Verification
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Physical coach entrance biometric scanner simulation. Confirms passenger physical entry and marks status as <strong>BOARDED</strong>.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', borderRadius: '20px', boxShadow: 'var(--shadow-xl)', background: '#ffffff' }}>
        {/* Train & Coach info header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--primary-25)',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid var(--primary-100)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--primary-500)', color: '#ffffff', padding: '0.5rem', borderRadius: '8px' }}>
              <Train size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '1rem', color: 'var(--primary-900)', display: 'block' }}>
                Train 20607 — Chennai – Mysuru Vande Bharat
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Coach C2 Entry Door Sensor (Reader RD-C2-DOOR-01)
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
              Selected Passenger
            </span>
            <span style={{ fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'JetBrains Mono' }}>
              {activeP.subPnr} ({activeP.name})
            </span>
          </div>
        </div>

        {/* Passenger selection tabs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Select Passenger at Coach Door:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {passengerList.map(p => (
              <button
                key={p.subPnr}
                type="button"
                onClick={() => { setSelectedSubPnr(p.subPnr); setBoardedRecord(null); }}
                style={{
                  background: selectedSubPnr === p.subPnr ? 'var(--primary-50)' : '#ffffff',
                  border: selectedSubPnr === p.subPnr ? '2px solid var(--primary-500)' : '1px solid var(--border-medium)',
                  padding: '0.6rem 0.4rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <strong style={{ fontSize: '0.8rem', color: 'var(--primary-900)', display: 'block' }}>{p.name}</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-600)', fontFamily: 'JetBrains Mono' }}>{p.subPnr} (Seat {p.seat})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Biometric Scanner Component */}
        <BiometricScanner
          passengerName={activeP.name}
          subPnr={activeP.subPnr}
          title="Coach Door Biometric Verification"
          subtitle={`Place finger on Coach ${activeP.coach} biometric reader to verify boarding`}
          onVerificationComplete={handleBiometricVerificationSuccess}
        />

        {/* Boarded Confirmation Banner */}
        {boardedRecord && (
          <div style={{
            marginTop: '1.5rem',
            background: '#ecfdf5',
            border: '2px solid #10b981',
            borderRadius: '16px',
            padding: '1.5rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={26} color="#059669" />
              <div>
                <h4 style={{ fontSize: '1.2rem', color: '#065f46', margin: 0 }}>
                  ✓ Biometric Verified — Boarding Status: BOARDED
                </h4>
                <span style={{ fontSize: '0.78rem', color: '#047857' }}>
                  Recorded at {boardedRecord.timestamp} • Synchronized with TTE Dashboard
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#065f46', marginBottom: '1.25rem' }}>
              Passenger <strong>{boardedRecord.name} ({boardedRecord.subPnr})</strong> has successfully boarded <strong>Coach {boardedRecord.coach}, Seat {boardedRecord.seat}</strong>. Live occupancy counts in the TTE monitor have updated immediately.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Link to="/tte-dashboard" className="btn btn-primary">
                View Live TTE Monitor
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainGateBiometricPage;
