import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import ETicketModal from '../components/ETicketModal';
import {
  CheckCircle2,
  Train,
  Ticket,
  Fingerprint,
  Download,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';

export const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookings } = useBoardEazy();

  const [showETicket, setShowETicket] = useState(false);

  // Grab booking from navigation state or default to latest
  const booking = location.state?.booking || bookings[0];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem', maxWidth: '800px' }}>
      {/* Confirmation Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-xl)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
        }}>
          <CheckCircle2 size={38} color="#ffffff" />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.35rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#a7f3d0', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
          Your train reservation is secured. Individual passenger Sub-PNRs have been successfully provisioned for biometric check-in.
        </p>

        {/* Main PNR Badge */}
        <div style={{
          display: 'inline-flex',
          flexDirection: 'column',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '0.75rem 2rem',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a7f3d0' }}>
            Main PNR Number
          </span>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'JetBrains Mono', color: '#ffffff', letterSpacing: '0.08em' }}>
            {booking?.mainPnr || '4567891234'}
          </span>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="card" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
        {/* Train info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'var(--primary-50)',
              color: 'var(--primary-700)',
              padding: '0.6rem',
              borderRadius: '10px'
            }}>
              <Train size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '1.15rem', color: 'var(--primary-900)', display: 'block' }}>
                {booking?.trainNumber} – {booking?.trainName}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {booking?.journeyDate} • {booking?.fromStation} → {booking?.toStation}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Class & Quota
            </span>
            <strong style={{ color: 'var(--primary-800)' }}>
              {booking?.travelClass || booking?.passengers?.[0]?.classCode || 'CC'} ({booking?.quota || 'General'})
            </strong>
          </div>
        </div>

        {/* Passenger Sub-PNRs List */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
            Confirmed Passengers & Sub-PNRs
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {booking?.passengers?.map((p) => (
              <div
                key={p.subPnr}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--primary-25)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid var(--primary-100)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ color: 'var(--primary-900)' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ({p.age} yrs, {p.gender})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                    Coach {p.coach} • Berth {p.seat} ({p.berthType})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
                      Sub-PNR
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--primary-700)', fontSize: '0.95rem' }}>
                      {p.subPnr}
                    </span>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    CONFIRMED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.875rem'
        }}>
          <button onClick={() => setShowETicket(true)} className="btn btn-outline">
            <Ticket size={16} />
            View / Print E-Ticket
          </button>

          <Link to="/boarding" className="btn btn-success">
            <Fingerprint size={16} />
            Proceed to Digital Boarding
          </Link>

          <Link to="/my-bookings" className="btn btn-secondary">
            Go to My Bookings
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* E-Ticket Printable Modal */}
      {showETicket && booking && (
        <ETicketModal
          booking={booking}
          onClose={() => setShowETicket(false)}
        />
      )}
    </div>
  );
};

export default BookingConfirmationPage;
