import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, ShieldCheck, Train, CheckCircle2, QrCode } from 'lucide-react';

export const QRCodeCard = ({
  passengerName = 'Harshavardhan S',
  mainPnr = '4567891234',
  subPnr = 'PA01',
  trainNumber = '20607',
  trainName = 'Chennai – Mysuru Vande Bharat Express',
  coach = 'C2',
  seat = '36',
  travelClass = 'CC',
  boardingStation = 'Chennai Central (MAS)',
  destination = 'Bengaluru KSR (SBC)',
  journeyDate = '25 September 2026',
  departureTime = '05:50 AM',
  status = 'READY FOR BOARDING'
}) => {
  const qrPayload = JSON.stringify({
    app: 'BoardEazy',
    mainPnr,
    subPnr,
    name: passengerName,
    coach,
    seat,
    travelClass,
    train: trainNumber,
    valid: true,
    token: `BEZ-${subPnr}-${mainPnr.slice(-4)}-VERIFIED`
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert(`Boarding Pass for ${passengerName} (${subPnr}) downloaded as PDF.`);
  };

  return (
    <div className="printable-area" style={{
      maxWidth: '520px',
      margin: '0 auto',
      background: '#ffffff',
      borderRadius: '20px',
      border: '2px solid var(--primary-100)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2d59 0%, #1565c0 100%)',
        color: '#ffffff',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '0.4rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Train size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.02em', margin: 0 }}>
              BoardEazy
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#90caf9', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Digital Railway Boarding Pass
            </span>
          </div>
        </div>

        <div style={{
          background: 'rgba(5, 150, 105, 0.25)',
          border: '1px solid #10b981',
          padding: '0.25rem 0.65rem',
          borderRadius: '999px',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#a7f3d0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          <ShieldCheck size={13} />
          BIOMETRIC VERIFIED
        </div>
      </div>

      {/* Main Boarding Pass Body */}
      <div style={{ padding: '1.5rem' }}>
        {/* Passenger & Sub-PNR Highlight Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--primary-50)',
          border: '1.5px dashed var(--primary-200)',
          borderRadius: '12px',
          padding: '0.875rem 1.25rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Passenger Name
            </span>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: '0.1rem 0' }}>
              {passengerName}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Main PNR: <strong style={{ fontFamily: 'JetBrains Mono', color: 'var(--primary-800)' }}>{mainPnr}</strong>
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Sub-PNR
            </span>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'JetBrains Mono',
              color: 'var(--primary-600)',
              background: '#ffffff',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--primary-200)'
            }}>
              {subPnr}
            </div>
          </div>
        </div>

        {/* Coach & Seat Highlight Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          background: '#f8fafc',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center',
          marginBottom: '1.25rem'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Coach
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'Plus Jakarta Sans' }}>
              {coach}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Seat / Berth
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'Plus Jakarta Sans' }}>
              {seat}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Class
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'Plus Jakarta Sans', marginTop: '0.15rem' }}>
              {travelClass}
            </div>
          </div>
        </div>

        {/* Journey Details */}
        <div style={{
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Train:</span>
            <strong style={{ color: 'var(--primary-900)' }}>{trainNumber} – {trainName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Date & Departure:</span>
            <span><strong>{journeyDate}</strong> at <strong>{departureTime}</strong></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Boarding Station:</span>
            <strong>{boardingStation}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Destination:</span>
            <strong>{destination}</strong>
          </div>
        </div>

        {/* QR Code Section */}
        <div style={{
          textAlign: 'center',
          padding: '1rem 0',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.75rem',
            background: '#ffffff',
            borderRadius: '12px',
            border: '2px solid var(--primary-500)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative'
          }}>
            <QRCodeSVG
              value={qrPayload}
              size={170}
              level="H"
              includeMargin={false}
              fgColor="#0a2d59"
            />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.82rem',
            color: 'var(--primary-700)',
            fontWeight: 700,
            marginTop: '0.75rem',
            background: 'var(--primary-50)',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px'
          }}>
            <QrCode size={15} />
            SCAN THIS QR AT RAILWAY STATION ENTRY GATE
          </div>
        </div>

        {/* Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          background: 'var(--success-green-light)',
          color: '#065f46',
          padding: '0.6rem',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.875rem',
          marginBottom: '1.25rem'
        }}>
          <CheckCircle2 size={16} />
          STATUS: {status}
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn btn-outline">
            <Printer size={16} />
            Print Pass
          </button>
          <button onClick={handleDownload} className="btn btn-primary">
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeCard;
