import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import BiometricScanner from '../components/BiometricScanner';
import QRCodeCard from '../components/QRCodeCard';
import StatusBadge from '../components/StatusBadge';
import {
  Fingerprint,
  QrCode,
  Train,
  CheckCircle2,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  Info,
  Phone,
  UserCheck
} from 'lucide-react';

export const BoardingPlatformPage = () => {
  const location = useLocation();
  const { bookings, findPassengerByPnrs, updatePassengerStatus } = useBoardEazy();

  const queryParams = new URLSearchParams(location.search);
  const initialPnr = queryParams.get('pnr') || '';
  const initialSubPnr = queryParams.get('subPnr') || '';

  const [mainPnrInput, setMainPnrInput] = useState(initialPnr);
  const [subPnrInput, setSubPnrInput] = useState(initialSubPnr);

  // Workflow Stages: 'search' -> 'verify_details' -> 'biometric' -> 'boarding_pass'
  const [stage, setStage] = useState(initialPnr && initialSubPnr ? 'verify_details' : 'search');
  const [retrievedData, setRetrievedData] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPnr && initialSubPnr) {
      const result = findPassengerByPnrs(initialPnr.trim(), initialSubPnr.trim());
      if (result) {
        setRetrievedData(result);
        setStage('verify_details');
      }
    }
  }, [initialPnr, initialSubPnr, bookings]);

  const handleRetrieve = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!mainPnrInput.trim()) {
      setError('Please enter your 10-digit Main PNR number.');
      return;
    }
    if (!subPnrInput.trim()) {
      setError('Please enter your Passenger Sub-PNR (e.g. PA01, PA02).');
      return;
    }

    const result = findPassengerByPnrs(mainPnrInput.trim(), subPnrInput.trim());

    if (result) {
      setRetrievedData(result);
      setStage('verify_details');
    } else {
      setError(`No booking record found for Main PNR: "${mainPnrInput.trim()}" and Sub-PNR: "${subPnrInput.trim().toUpperCase()}". Please verify your booked ticket details.`);
    }
  };

  const handleProceedToBiometric = () => {
    if (!acceptTerms) {
      setError('Please accept the BoardEazy Boarding Terms & Conditions to proceed.');
      return;
    }
    setError('');
    setStage('biometric');
  };

  const handleBiometricComplete = () => {
    if (retrievedData) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Update passenger boarding state
      updatePassengerStatus(
        retrievedData.booking.mainPnr,
        retrievedData.passenger.subPnr,
        'BOARDED',
        timestamp
      );
    }
    setTimeout(() => {
      setStage('boarding_pass');
    }, 600);
  };

  const handleResetSearch = () => {
    setStage('search');
    setRetrievedData(null);
    setError('');
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
          border: '1px solid #a7f3d0',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          <Fingerprint size={14} />
          SMART DIGITAL BOARDING GATEWAY
        </div>
        <h1 style={{ fontSize: '2.1rem', color: 'var(--primary-900)' }}>
          Digital Boarding Platform
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Enter your Main PNR and individual Sub-PNR to complete biometric verification and generate your individual QR Boarding Pass.
        </p>
      </div>

      {/* Stage 1: PNR & Sub-PNR Input Card */}
      {stage === 'search' && (
        <div className="card" style={{ padding: '2rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={20} color="var(--primary-600)" />
            Step 1: Enter Main PNR & Sub-PNR
          </h3>

          {error && (
            <div style={{ background: 'var(--danger-red-light)', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRetrieve}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Main PNR (10-Digit Master Booking)</label>
                <input
                  type="text"
                  className="form-input"
                  value={mainPnrInput}
                  onChange={(e) => setMainPnrInput(e.target.value)}
                  placeholder="Enter 10-digit Main PNR..."
                  style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.05rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passenger Sub-PNR</label>
                <input
                  type="text"
                  className="form-input"
                  value={subPnrInput}
                  onChange={(e) => setSubPnrInput(e.target.value)}
                  placeholder="e.g. PA01, PA02"
                  style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.05rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              Retrieve Passenger Details
              <ArrowRight size={18} />
            </button>
          </form>

          {bookings.length === 0 ? (
            <div style={{
              background: 'var(--primary-25)',
              border: '1px solid var(--primary-100)',
              borderRadius: '10px',
              padding: '0.875rem',
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              💡 <em>You haven't booked any tickets in this session yet. <Link to="/book" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>Book a ticket first</Link> to generate your PNR.</em>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Your Active Bookings & Sub-PNRs in this session:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {bookings.map(b => (
                  <div key={b.mainPnr} style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {b.passengers.map(p => (
                      <button
                        key={p.subPnr}
                        type="button"
                        onClick={() => {
                          setMainPnrInput(b.mainPnr);
                          setSubPnrInput(p.subPnr);
                          const res = findPassengerByPnrs(b.mainPnr, p.subPnr);
                          if (res) {
                            setRetrievedData(res);
                            setStage('verify_details');
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem' }}
                      >
                        {b.mainPnr} / {p.subPnr} ({p.name})
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stage 2: Retrieved Passenger Details Verification */}
      {stage === 'verify_details' && retrievedData && (
        <div className="card" style={{ padding: '2rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Retrieved Passenger Identity
              </span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-900)', margin: 0 }}>
                {retrievedData.passenger.name}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <Phone size={12} color="var(--primary-600)" />
                Linked Mobile: {retrievedData.passenger.mobile}
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Sub-PNR
              </span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                {retrievedData.passenger.subPnr}
              </span>
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--danger-red-light)', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            background: 'var(--primary-25)',
            border: '1px solid var(--primary-100)',
            borderRadius: '14px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            fontSize: '0.875rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                Train
              </span>
              <strong style={{ color: 'var(--primary-900)' }}>{retrievedData.booking.trainNumber} – {retrievedData.booking.trainName}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                Class & Quota
              </span>
              <strong style={{ color: 'var(--primary-800)' }}>
                {retrievedData.passenger.classCode || retrievedData.booking.travelClass || 'CC'} ({retrievedData.booking.quota || 'General'})
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                Coach & Seat
              </span>
              <strong style={{ color: 'var(--primary-800)', fontSize: '1.05rem' }}>
                Coach {retrievedData.passenger.coach}, Seat {retrievedData.passenger.seat} ({retrievedData.passenger.berthType})
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                Route
              </span>
              <strong style={{ color: 'var(--primary-900)' }}>
                {retrievedData.booking.fromStation} → {retrievedData.booking.toStation}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                Boarding Status
              </span>
              <StatusBadge status={retrievedData.passenger.boardingStatus} />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
          onClick={() => setAcceptTerms(!acceptTerms)}
          >
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="termsCheckbox" style={{ fontSize: '0.875rem', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>
              I confirm my passenger identity ({retrievedData.passenger.name}) and accept BoardEazy Digital Boarding verification protocols.
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <button onClick={handleResetSearch} className="btn btn-secondary">
              Back
            </button>
            <button onClick={handleProceedToBiometric} className="btn btn-primary btn-lg">
              <Fingerprint size={18} />
              Continue to Biometric Verification
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Stage 3: Biometric Verification */}
      {stage === 'biometric' && retrievedData && (
        <div>
          <BiometricScanner
            passengerName={retrievedData.passenger.name}
            subPnr={retrievedData.passenger.subPnr}
            title="Biometric Identity Verification"
            subtitle={`Verifying biometrics for ${retrievedData.passenger.name} (${retrievedData.passenger.subPnr})`}
            onVerificationComplete={handleBiometricComplete}
          />

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button onClick={() => setStage('verify_details')} className="btn btn-outline btn-sm">
              Cancel Verification
            </button>
          </div>
        </div>
      )}

      {/* Stage 4: QR Boarding Pass */}
      {stage === 'boarding_pass' && retrievedData && (
        <div>
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            borderRadius: '12px',
            padding: '0.875rem 1.25rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: 700
          }}>
            <ShieldCheck size={20} color="#059669" />
            Biometric Verified: {retrievedData.passenger.name} ({retrievedData.passenger.subPnr}) • Status: BOARDED
          </div>

          <QRCodeCard
            passengerName={retrievedData.passenger.name}
            mainPnr={retrievedData.booking.mainPnr}
            subPnr={retrievedData.passenger.subPnr}
            trainNumber={retrievedData.booking.trainNumber}
            trainName={retrievedData.booking.trainName}
            coach={retrievedData.passenger.coach}
            seat={retrievedData.passenger.seat}
            travelClass={retrievedData.passenger.classCode || retrievedData.booking.travelClass || 'CC'}
            boardingStation={retrievedData.booking.fromStation}
            destination={retrievedData.booking.toStation}
            journeyDate={retrievedData.booking.journeyDate}
            departureTime={retrievedData.booking.departureTime}
            status="READY FOR BOARDING"
          />

          <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={handleResetSearch} className="btn btn-outline">
              Check-in Another Passenger Sub-PNR
            </button>
            <Link to="/my-bookings" className="btn btn-secondary">
              Go to My Bookings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardingPlatformPage;
