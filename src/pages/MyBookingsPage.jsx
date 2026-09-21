import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import StatusBadge from '../components/StatusBadge';
import ETicketModal from '../components/ETicketModal';
import {
  Train,
  Ticket,
  Fingerprint,
  Download,
  Printer,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings } = useBoardEazy();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(b => {
    if (!searchTerm) return true;
    return (
      b.mainPnr.includes(searchTerm) ||
      b.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trainNumber.includes(searchTerm)
    );
  });

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-900)' }}>
            My Bookings & Digital Tickets
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Manage upcoming journeys, download electronic reservation slips, and initiate biometric boarding.
          </p>
        </div>

        <Link to="/book" className="btn btn-primary">
          <Ticket size={16} />
          Book Another Ticket
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: '0.75rem 1.25rem',
        borderRadius: '14px',
        border: '1px solid var(--border-light)',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`btn btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Upcoming Journeys ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Past Journeys
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by PNR or Train..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Bookings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="card card-interactive"
            style={{
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1.5px solid var(--border-light)',
              background: '#ffffff'
            }}
          >
            {/* Header: PNR + Train + Status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '1rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Main PNR:
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-800)' }}>
                    {booking.mainPnr}
                  </span>
                  <span className="badge badge-success">
                    CONFIRMED
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', margin: 0 }}>
                  {booking.trainNumber} – {booking.trainName}
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  Booking Date
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {booking.bookingDate || '21 Sep 2026'}
                </span>
              </div>
            </div>

            {/* Journey Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              background: 'var(--primary-25)',
              border: '1px solid var(--primary-100)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                  Date of Journey
                </span>
                <strong style={{ color: 'var(--primary-900)' }}>{booking.journeyDate}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                  From & Departure
                </span>
                <strong style={{ color: 'var(--primary-900)' }}>{booking.fromStation}</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dep: {booking.departureTime}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                  To & Arrival
                </span>
                <strong style={{ color: 'var(--primary-900)' }}>{booking.toStation}</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Arr: {booking.arrivalTime}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                  Total Fare Paid
                </span>
                <strong style={{ color: 'var(--primary-800)', fontSize: '1rem' }}>
                  ₹{booking.fareSummary?.total?.toLocaleString()}
                </strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class: {booking.travelClass || '3A'}</span>
              </div>
            </div>

            {/* Sub-PNR Passengers Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Passengers ({booking.passengers.length})
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {booking.passengers.map(p => (
                  <div
                    key={p.subPnr}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-medium)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--primary-700)' }}>
                      {p.subPnr}:
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{p.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({p.coach}-{p.seat})</span>
                    <StatusBadge status={p.boardingStatus} style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setSelectedTicket(booking)}
                className="btn btn-outline btn-sm"
              >
                <Ticket size={14} />
                View / Print Ticket
              </button>

              <Link
                to={`/boarding?pnr=${booking.mainPnr}&subPnr=${booking.passengers[0]?.subPnr || 'PA01'}`}
                className="btn btn-success btn-sm"
              >
                <Fingerprint size={14} />
                Digital Boarding Pass
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* E-Ticket Modal */}
      {selectedTicket && (
        <ETicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;
