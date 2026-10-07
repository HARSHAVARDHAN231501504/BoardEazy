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
  Search,
  UserCheck,
  Phone,
  Sparkles,
  Users
} from 'lucide-react';

export const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { currentUser, myCreatedBookings, ticketsBookedForMe } = useBoardEazy();

  const [activeCategory, setActiveCategory] = useState('created'); // 'created' | 'booked_for_me'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const currentList = activeCategory === 'created' ? myCreatedBookings : ticketsBookedForMe;

  const filteredList = currentList.filter(b => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.mainPnr?.includes(term) ||
      b.trainName?.toLowerCase().includes(term) ||
      b.trainNumber?.includes(term) ||
      b.fromStation?.toLowerCase().includes(term) ||
      b.toStation?.toLowerCase().includes(term)
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span style={{
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              ACCOUNT: {currentUser?.name?.toUpperCase() || 'PASSENGER'}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Linked Mobile: <strong>{currentUser?.phone || '+91 98765 43210'}</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-900)', margin: 0 }}>
            My Bookings & Digital Tickets
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
            Access journeys booked by you or tickets booked for you by co-travelers via mobile identity linking.
          </p>
        </div>

        <Link to="/book" className="btn btn-primary">
          <Ticket size={16} />
          Book Another Ticket
        </Link>
      </div>

      {/* Cross-Account Category Switcher & Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: '0.75rem 1.25rem',
        borderRadius: '16px',
        border: '1px solid var(--border-light)',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Tab 1: MY CREATED BOOKINGS */}
          <button
            onClick={() => setActiveCategory('created')}
            className={`btn btn-sm ${activeCategory === 'created' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            <Ticket size={14} />
            My Bookings ({myCreatedBookings.length})
          </button>

          {/* Tab 2: TICKETS BOOKED FOR ME (Cross-Account Mobile Linking) */}
          <button
            onClick={() => setActiveCategory('booked_for_me')}
            className={`btn btn-sm ${activeCategory === 'booked_for_me' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              fontWeight: 700,
              background: activeCategory === 'booked_for_me' ? 'var(--primary-700)' : '#f1f5f9',
              color: activeCategory === 'booked_for_me' ? '#ffffff' : 'var(--text-primary)'
            }}
          >
            <Users size={14} />
            Tickets Booked for Me ({ticketsBookedForMe.length})
          </button>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="form-input"
            placeholder="Filter by PNR, Train, Station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Notice Banner for "Tickets Booked for Me" */}
      {activeCategory === 'booked_for_me' && (
        <div style={{
          background: '#f0fdf4',
          border: '1.5px solid #bbf7d0',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem',
          color: '#166534'
        }}>
          <Sparkles size={18} color="#16a34a" style={{ flexShrink: 0 }} />
          <div>
            <strong>Cross-Account Linked Journeys</strong>: These tickets were purchased by other users who entered your mobile number ({currentUser?.phone}). You can start biometric check-in and generate your passenger QR boarding pass directly below.
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredList.map((booking) => {
          const isLinkedTicket = activeCategory === 'booked_for_me';
          const targetPassenger = isLinkedTicket ? booking.myPassengerRecord : booking.passengers[0];

          return (
            <div
              key={booking.id}
              className="card card-interactive"
              style={{
                padding: '1.75rem',
                borderRadius: '16px',
                border: isLinkedTicket ? '2px solid #93c5fd' : '1.5px solid var(--border-light)',
                background: isLinkedTicket ? 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)' : '#ffffff'
              }}
            >
              {/* Header: PNR + Train + Booker Info */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Main PNR:
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-800)' }}>
                      {booking.mainPnr}
                    </span>
                    <span className="badge badge-success">
                      CONFIRMED
                    </span>
                    {isLinkedTicket && (
                      <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                        Booked by {booking.bookedByUserName}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', margin: 0 }}>
                    {booking.trainNumber} – {booking.trainName}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    Booking Date
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {booking.bookingDate || '25 Sep 2026'}
                  </span>
                </div>
              </div>

              {/* Journey Timetable Grid */}
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
                    From Station & Dep
                  </span>
                  <strong style={{ color: 'var(--primary-900)' }}>{booking.fromStation}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dep: {booking.departureTime}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                    To Station & Arr
                  </span>
                  <strong style={{ color: 'var(--primary-900)' }}>{booking.toStation}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Arr: {booking.arrivalTime}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                    Class & Fare Paid
                  </span>
                  <strong style={{ color: 'var(--primary-800)', fontSize: '1rem' }}>
                    {booking.travelClass} • ₹{booking.fareSummary?.total?.toLocaleString()}
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quota: {booking.quota || 'General'}</span>
                </div>
              </div>

              {/* Passengers / Sub-PNR Section */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  {isLinkedTicket ? 'Your Assigned Passenger Record' : `All Passengers (${booking.passengers.length})`}
                </span>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {booking.passengers.map(p => {
                    const isCurrentUserPassenger = isLinkedTicket && p.subPnr === targetPassenger?.subPnr;

                    return (
                      <div
                        key={p.subPnr}
                        style={{
                          background: isCurrentUserPassenger ? '#eff6ff' : '#ffffff',
                          border: isCurrentUserPassenger ? '2px solid #2563eb' : '1px solid var(--border-medium)',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--primary-700)' }}>
                          {p.subPnr}:
                        </span>
                        <span style={{ fontWeight: 700, color: 'var(--primary-900)' }}>{p.name}</span>
                        <span style={{
                          background: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 800
                        }}>
                          Coach {p.coach} • Seat {p.seat}
                        </span>
                        <StatusBadge status={p.boardingStatus} style={{ fontSize: '0.65rem' }} />
                      </div>
                    );
                  })}
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
                  View / Print E-Ticket
                </button>

                <Link
                  to={`/boarding?pnr=${booking.mainPnr}&subPnr=${targetPassenger?.subPnr || 'PA01'}`}
                  className="btn btn-success btn-sm"
                >
                  <Fingerprint size={14} />
                  {isLinkedTicket ? `Start My Boarding (${targetPassenger?.subPnr})` : 'Start Digital Boarding'}
                </Link>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="card" style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1.5px dashed var(--border-medium)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Ticket size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
              {activeCategory === 'created' ? 'No Created Bookings Found' : 'No Tickets Booked For You Yet'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
              {activeCategory === 'created'
                ? "You haven't booked any train tickets from this account yet. Search trains to plan your journey."
                : `No bookings found matching your registered mobile number (${currentUser?.phone || '+91 98765 43210'}). When someone enters this number during booking, it will appear here automatically.`}
            </p>
            <Link to="/book" className="btn btn-primary">
              Book Train Ticket
            </Link>
          </div>
        )}
      </div>

      {/* E-Ticket Printable Modal */}
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
