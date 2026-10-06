import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import StatusBadge from '../components/StatusBadge';
import ETicketModal from '../components/ETicketModal';
import {
  Train,
  Ticket,
  Fingerprint,
  QrCode,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Users,
  Plus
} from 'lucide-react';

export const PassengerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, myCreatedBookings, ticketsBookedForMe, bookings } = useBoardEazy();
  const [activeETicket, setActiveETicket] = useState(null);
  const [quickPnrInput, setQuickPnrInput] = useState('');

  // Active booking could be created by user or booked for user
  const activeBooking = myCreatedBookings.length > 0
    ? myCreatedBookings[0]
    : ticketsBookedForMe.length > 0
    ? ticketsBookedForMe[0]
    : bookings.length > 0
    ? bookings[0]
    : null;

  const isBookedForMe = ticketsBookedForMe.length > 0 && activeBooking && ticketsBookedForMe.some(t => t.id === activeBooking.id);
  const myPassenger = isBookedForMe ? activeBooking.myPassengerRecord : (activeBooking?.passengers[0] || null);

  const handlePnrSearch = (e) => {
    e.preventDefault();
    if (quickPnrInput) {
      navigate(`/pnr-status?pnr=${quickPnrInput.trim()}`);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2d59 0%, #1565c0 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '0.875rem'
          }}>
            <Sparkles size={14} color="#fde047" />
            WELCOME, {currentUser?.name?.toUpperCase() || 'PASSENGER'}
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Travel Smarter with BoardEazy
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#bbdefb', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Book your journey, verify your boarding, and manage your seat digitally with next-generation biometric identification.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/book" className="btn btn-lg" style={{ background: '#ffffff', color: 'var(--primary-900)', fontWeight: 800 }}>
              <Ticket size={18} color="var(--primary-700)" />
              Book Ticket
            </Link>
            <Link to="/boarding" className="btn btn-lg btn-secondary" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <Fingerprint size={18} />
              Start Boarding
            </Link>
          </div>
        </div>
      </div>

      {/* Two Large Primary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: BOOK TICKET */}
        <div className="card card-interactive" style={{
          padding: '2rem',
          borderRadius: '20px',
          border: '1.5px solid var(--border-light)',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              border: '1px solid var(--primary-100)'
            }}>
              <Train size={28} />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
              BOOK TICKET
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Search multi-route Indian railway corridors, select coach/berth preferences, and generate instant Sub-PNRs.
            </p>
          </div>

          <Link to="/book" className="btn btn-primary" style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>Search & Book Journey</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Card 2: BOARDING PLATFORM */}
        <div className="card card-interactive" style={{
          padding: '2rem',
          borderRadius: '20px',
          border: '2px solid #a7f3d0',
          background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--success-green-light)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              border: '1px solid #a7f3d0'
            }}>
              <QrCode size={28} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#065f46', margin: 0 }}>
                BOARDING PLATFORM
              </h3>
              <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                DIGITAL
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Verify your boarding and generate your passenger-specific digital boarding pass with simulated biometric verification.
            </p>
          </div>

          <Link to="/boarding" className="btn btn-success" style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>Start Boarding</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Active Booking Card or Empty State */}
      {activeBooking ? (
        <div className="card" style={{
          padding: '2rem',
          borderRadius: '20px',
          marginBottom: '2.5rem',
          border: isBookedForMe ? '2px solid #93c5fd' : '1.5px solid var(--border-light)',
          background: isBookedForMe ? 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)' : '#ffffff'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Active Journey
                </span>
                <span className="badge badge-success">
                  CONFIRMED
                </span>
                {isBookedForMe && (
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    Booked for you by {activeBooking.bookedByUserName || activeBooking.bookedBy?.name}
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', margin: 0 }}>
                {activeBooking.trainNumber} – {activeBooking.trainName}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setActiveETicket(activeBooking)}
                className="btn btn-outline btn-sm"
              >
                <Ticket size={15} />
                View E-Ticket
              </button>
              <Link
                to={`/boarding?pnr=${activeBooking.mainPnr}&subPnr=${myPassenger?.subPnr || 'PA01'}`}
                className="btn btn-success btn-sm"
              >
                <Fingerprint size={15} />
                {isBookedForMe ? `Start My Boarding (${myPassenger?.subPnr})` : 'Start Boarding'}
              </Link>
            </div>
          </div>

          {/* Timetable Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            background: 'var(--primary-25)',
            border: '1px solid var(--primary-100)',
            borderRadius: '14px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Main PNR
              </span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--primary-800)' }}>
                {activeBooking.mainPnr}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Journey Date
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeBooking.journeyDate}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Departure & Route
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                {activeBooking.departureTime} • {activeBooking.fromStation} → {activeBooking.toStation}
              </div>
            </div>
          </div>

          {/* Sub-PNRs Passenger Matrix */}
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              {isBookedForMe ? 'Your Passenger Seat Allocation' : `Passengers & Individual Sub-PNRs (${activeBooking.passengers.length})`}
            </span>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem'
            }}>
              {activeBooking.passengers.map((p) => {
                const isCurrent = isBookedForMe && p.subPnr === myPassenger?.subPnr;
                return (
                  <div
                    key={p.subPnr}
                    style={{
                      background: isCurrent ? '#eff6ff' : '#ffffff',
                      border: isCurrent ? '2px solid #2563eb' : '1px solid var(--border-medium)',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--primary-900)' }}>{p.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        Coach {p.coach}, Seat {p.seat} ({p.berthType})
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'block',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: 'var(--primary-700)'
                      }}>
                        {p.subPnr}
                      </span>
                      <StatusBadge status={p.boardingStatus} style={{ fontSize: '0.65rem' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Empty Booking State */
        <div className="card" style={{
          padding: '2.5rem',
          borderRadius: '20px',
          textAlign: 'center',
          marginBottom: '2.5rem',
          background: '#ffffff',
          border: '1.5px dashed var(--border-medium)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Train size={30} />
          </div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
            No Active Bookings
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            You haven't booked any train tickets yet. Search available multi-route trains to reserve your seat and generate your Sub-PNR.
          </p>
          <Link to="/book" className="btn btn-primary">
            <Plus size={16} />
            Book a Journey Now
          </Link>
        </div>
      )}

      {/* Quick PNR Lookup Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid var(--border-light)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Search size={22} color="var(--primary-600)" />
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', margin: 0 }}>
              Quick PNR & Boarding Status Tracker
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Enter any 10-digit Main PNR or Sub-PNR to verify your reservation status
            </span>
          </div>
        </div>

        <form onSubmit={handlePnrSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            value={quickPnrInput}
            onChange={(e) => setQuickPnrInput(e.target.value)}
            placeholder="Enter Main PNR or Sub-PNR..."
            style={{ flex: '1', minWidth: '240px' }}
          />
          <button type="submit" className="btn btn-primary">
            <Search size={16} />
            Check Status
          </button>
        </form>
      </div>

      {/* Printable E-Ticket Modal */}
      {activeETicket && (
        <ETicketModal
          booking={activeETicket}
          onClose={() => setActiveETicket(null)}
        />
      )}
    </div>
  );
};

export default PassengerDashboard;
