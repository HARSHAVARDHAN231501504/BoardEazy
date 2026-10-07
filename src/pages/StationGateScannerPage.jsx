import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import { sendStationEntrySMS } from '../services/notificationService';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Train,
  ArrowRight,
  RefreshCw,
  Sparkles,
  UserCheck,
  ScanLine
} from 'lucide-react';

export const StationGateScannerPage = () => {
  const { updatePassengerStatus, bookings } = useBoardEazy();

  // Collect all passengers from bookings or provide defaults
  const allAvailablePassengers = [];
  bookings.forEach(b => {
    b.passengers.forEach(p => {
      allAvailablePassengers.push({
        mainPnr: b.mainPnr,
        subPnr: p.subPnr,
        name: p.name,
        coach: p.coach,
        seat: p.seat,
        trainName: b.trainName
      });
    });
  });

  const passengerOptions = allAvailablePassengers.length > 0 ? allAvailablePassengers : [
    { mainPnr: '4567891234', subPnr: 'PA01', name: 'Harshavardhan S', coach: 'C2', seat: '21', trainName: 'Vande Bharat' },
    { mainPnr: '4567891234', subPnr: 'PA02', name: 'Meenakshi S', coach: 'C2', seat: '22', trainName: 'Vande Bharat' }
  ];

  const [selectedPassengerIdx, setSelectedPassengerIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const selectedP = passengerOptions[selectedPassengerIdx] || passengerOptions[0];

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const scanTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update state in context
      updatePassengerStatus(selectedP.mainPnr, selectedP.subPnr, 'STATION_ENTERED', scanTime);

      // Send station entry SMS (fire-and-forget)
      const booking = bookings.find(b => b.mainPnr === selectedP.mainPnr);
      const passenger = booking?.passengers.find(p => p.subPnr === selectedP.subPnr);
      if (passenger?.mobile) {
        sendStationEntrySMS({
          name: selectedP.name,
          subPnr: selectedP.subPnr,
          mobile: passenger.mobile,
          coach: selectedP.coach,
          seat: selectedP.seat.toString(),
          gateId: 'GATE-MAS-NORTH-04',
          scanTime,
        }).then(result => {
          if (!result.success) {
            console.warn('[SMS] Station entry SMS failed:', result.error);
          }
        });
      }

      setScanResult({
        name: selectedP.name,
        subPnr: selectedP.subPnr,
        mainPnr: selectedP.mainPnr,
        coach: selectedP.coach,
        seat: selectedP.seat,
        status: 'Station Entry Verified',
        scanTime,
        gateId: 'GATE-MAS-NORTH-04'
      });
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '780px' }}>
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
          <QrCode size={14} />
          STATION PHYSICAL ACCESS SIMULATOR
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-900)' }}>
          Station Gate Scanner
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Railway staff security turnstile simulation. Validates passenger QR Boarding Pass at station entrance.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', borderRadius: '20px', boxShadow: 'var(--shadow-xl)', background: '#ffffff' }}>
        {/* Gate Info Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--primary-25)',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--primary-100)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Railway Station Gate
            </span>
            <strong style={{ color: 'var(--primary-900)', display: 'block' }}>Chennai Central (MAS) — North Concourse Gate 04</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Reader Mode
            </span>
            <span style={{ color: '#059669', fontWeight: 800 }}>LIVE OPTICAL SCANNER</span>
          </div>
        </div>

        {/* Passenger selector for demo */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Select Passenger Boarding Pass to Scan:</label>
          <select
            className="form-select"
            value={selectedPassengerIdx}
            onChange={(e) => setSelectedPassengerIdx(parseInt(e.target.value, 10))}
          >
            {passengerOptions.map((p, idx) => (
              <option key={idx} value={idx}>
                {p.name} ({p.subPnr} • PNR: {p.mainPnr} • Coach {p.coach} - Seat {p.seat})
              </option>
            ))}
          </select>
        </div>

        {/* Optical Scanner Visual Box */}
        <div style={{
          position: 'relative',
          width: '260px',
          height: '260px',
          margin: '0 auto 1.5rem',
          borderRadius: '20px',
          background: '#0a192f',
          border: '3px solid var(--primary-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: isScanning ? '0 0 25px rgba(33, 150, 243, 0.5)' : 'var(--shadow-md)'
        }}>
          {/* Target Corners */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', width: '25px', height: '25px', borderTop: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8' }} />
          <div style={{ position: 'absolute', top: '15px', right: '15px', width: '25px', height: '25px', borderTop: '3px solid #38bdf8', borderRight: '3px solid #38bdf8' }} />
          <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '25px', height: '25px', borderBottom: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8' }} />
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '25px', height: '25px', borderBottom: '3px solid #38bdf8', borderRight: '3px solid #38bdf8' }} />

          <QrCode size={120} color={isScanning ? '#38bdf8' : '#64748b'} style={{ opacity: isScanning ? 1 : 0.4 }} />

          {/* Laser beam */}
          {isScanning && (
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)',
              boxShadow: '0 0 15px 4px #38bdf8',
              animation: 'scanLine 1.2s ease-in-out infinite alternate'
            }} />
          )}
        </div>

        {/* Simulate Button */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="btn btn-primary btn-lg"
            style={{ minWidth: '240px' }}
          >
            {isScanning ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Validating QR Pass...
              </>
            ) : (
              <>
                <ScanLine size={18} />
                Simulate QR Scan
              </>
            )}
          </button>
        </div>

        {/* Scan Result Card */}
        {scanResult && (
          <div style={{
            background: '#ecfdf5',
            border: '2px solid #10b981',
            borderRadius: '16px',
            padding: '1.5rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <CheckCircle2 size={24} color="#059669" />
              <div>
                <h4 style={{ fontSize: '1.15rem', color: '#065f46', margin: 0 }}>
                  ✓ QR Verified — Station Entry Authorized
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#047857' }}>
                  Recorded at {scanResult.gateId} ({scanResult.scanTime})
                </span>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.75rem',
              background: '#ffffff',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #a7f3d0',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passenger</span>
                <strong style={{ color: 'var(--primary-900)', display: 'block' }}>{scanResult.name}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sub-PNR</span>
                <strong style={{ color: 'var(--primary-700)', fontFamily: 'JetBrains Mono', display: 'block' }}>{scanResult.subPnr}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coach / Seat</span>
                <strong style={{ color: 'var(--primary-900)', display: 'block' }}>{scanResult.coach} - {scanResult.seat}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</span>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  {scanResult.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Link to="/tte/train-gate" className="btn btn-success btn-sm">
                Next: Proceed to Train Gate Biometric
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationGateScannerPage;
