import React from 'react';
import { X, Printer, Download, Train, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const ETicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '750px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        border: '1px solid var(--border-light)'
      }}>
        {/* Modal Controls */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--primary-25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Train size={20} color="var(--primary-700)" />
            <h4 style={{ margin: 0, color: 'var(--primary-900)' }}>
              Electronic Reservation Slip (ERS) — BoardEazy
            </h4>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={handlePrint} className="btn btn-outline btn-sm">
              <Printer size={14} />
              Print Ticket
            </button>
            <button onClick={onClose} style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* E-Ticket Printable Canvas */}
        <div className="printable-area" style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid var(--primary-700)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-800)', letterSpacing: '0.02em' }}>
                  BoardEazy
                </span>
                <span style={{ fontSize: '0.75rem', background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                  SMART RAILWAY ERS
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Indian Railways Smart Passenger Booking, Boarding & AI Seat Allocation System
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Main PNR Number
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--primary-800)' }}>
                {booking.mainPnr}
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                <CheckCircle2 size={11} />
                CONFIRMED
              </span>
            </div>
          </div>

          {/* Journey Information Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            background: 'var(--primary-25)',
            border: '1px solid var(--primary-100)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Train No. & Name
              </span>
              <strong style={{ color: 'var(--primary-900)' }}>{booking.trainNumber} – {booking.trainName}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Date of Journey
              </span>
              <strong style={{ color: 'var(--primary-900)' }}>{booking.journeyDate}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                From Station
              </span>
              <strong style={{ color: 'var(--primary-900)' }}>{booking.fromStation}</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dep: {booking.departureTime}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                To Station
              </span>
              <strong style={{ color: 'var(--primary-900)' }}>{booking.toStation}</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Arr: {booking.arrivalTime}</span>
            </div>
          </div>

          {/* Passenger Details & Sub-PNRs Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '0.95rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              Passenger & Sub-PNR Details
            </h5>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-50)', color: 'var(--primary-900)', borderBottom: '2px solid var(--primary-200)' }}>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Sub-PNR</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Passenger Name</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Age / Sex</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Coach / Seat</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Berth Pref</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Boarding Status</th>
                </tr>
              </thead>
              <tbody>
                {booking.passengers?.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--primary-700)' }}>
                      {p.subPnr}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>{p.age} / {p.gender[0]}</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                      {p.coach} / {p.seat}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>{p.berthType}</td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <span className={`badge ${p.boardingStatus === 'BOARDED' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                        {p.boardingStatus || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fare Summary & QR Verification Footer */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '1.5rem',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ticket Base Fare:</span>
                <span>₹{booking.fareSummary?.baseFare?.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Reservation & Superfast Fee:</span>
                <span>₹{(booking.fareSummary?.reservationCharges + booking.fareSummary?.superfastCharges)?.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Applicable GST (5%):</span>
                <span>₹{booking.fareSummary?.gst?.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-800)', borderTop: '1px dashed var(--border-medium)', paddingTop: '0.4rem', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Amount Paid:</span>
                <span>₹{booking.fareSummary?.total?.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-light)', paddingLeft: '1.25rem' }}>
              <QRCodeSVG
                value={`BOARDEAZY-TICKET-${booking.mainPnr}`}
                size={80}
                fgColor="#0a2d59"
              />
              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Official ERS Verification
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="no-print" style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          background: '#f8fafc'
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} />
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default ETicketModal;
