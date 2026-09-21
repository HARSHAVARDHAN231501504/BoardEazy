import React, { useState } from 'react';
import { useBoardEazy } from '../context/BoardEazyContext';
import StatusBadge from '../components/StatusBadge';
import SeatMap from '../components/SeatMap';
import AIAllocationPanel from '../components/AIAllocationPanel';
import {
  Train,
  ShieldCheck,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  MapPin
} from 'lucide-react';

export const TTEDashboardPage = () => {
  const {
    coachPassengers,
    selectedCoach,
    setSelectedCoach,
    currentUser,
    simulateNextStation15Km
  } = useBoardEazy();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSeatDetails, setSelectedSeatDetails] = useState(null);

  // Compute live occupancy metrics for selected coach
  const totalSeats = 52;
  const boardedCount = coachPassengers.filter(p => p.status === 'BOARDED').length;
  const pendingCount = coachPassengers.filter(p => p.status === 'PENDING' || p.status === 'STATION_ENTERED').length;
  const noShowCount = coachPassengers.filter(p => p.status === 'NO_SHOW').length;
  const racAllocatedCount = coachPassengers.filter(p => p.status === 'AUTO_ALLOCATED').length;

  // Filter passengers
  const filteredList = coachPassengers.filter(p => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subPnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.seat?.toString().includes(searchTerm);

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{
              background: '#fffbeb',
              color: '#92400e',
              border: '1px solid #fde68a',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              TTE LIVE ONBOARD MONITOR
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Officer: <strong>{currentUser?.name || 'R. Ramanathan (TTE Mas Div)'}</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', color: 'var(--primary-900)', margin: 0 }}>
            Train 20607 Chennai – Mysuru Vande Bharat
          </h1>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Date: 25 September 2026 • Sector: MAS (05:50 AM) → SBC (10:20 AM) • Active Coach: <strong>{selectedCoach}</strong>
          </span>
        </div>

        {/* Live Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            LIVE TELEMETRY SYNCED
          </div>
        </div>
      </div>

      {/* TTE "MONITOR ONLY" COMPLIANCE BANNER */}
      <div style={{
        background: '#fffbeb',
        border: '1.5px solid #fde68a',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={26} color="#d97706" />
          <div>
            <strong style={{ color: '#92400e', fontSize: '0.925rem', display: 'block' }}>
              TTE Role Notice: MONITOR ONLY (Manual Seat Assignment Disabled)
            </strong>
            <span style={{ fontSize: '0.8rem', color: '#b45309' }}>
              Under BoardEazy Intelligent Operations, all vacant berths caused by no-shows are allocated autonomously by the AI Engine. The TTE strictly observes live occupancy.
            </span>
          </div>
        </div>

        <span className="badge badge-ai" style={{ fontSize: '0.72rem' }}>
          <Cpu size={12} />
          AI ENGINE IN CHARGE
        </span>
      </div>

      {/* Occupancy Stats Counter Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Total Coach Capacity
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-900)', fontFamily: 'Plus Jakarta Sans' }}>
            {totalSeats}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Berths in Coach {selectedCoach}</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '1px solid #a7f3d0', background: 'linear-gradient(180deg, #ffffff, #f0fdf4)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#047857', fontWeight: 700 }}>
            Verified Boarded
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', fontFamily: 'Plus Jakarta Sans' }}>
            {boardedCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#065f46' }}>Biometric Matched</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '1px solid #fde68a', background: 'linear-gradient(180deg, #ffffff, #fffbeb)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#92400e', fontWeight: 700 }}>
            Pending Boarding
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#d97706', fontFamily: 'Plus Jakarta Sans' }}>
            {pendingCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309' }}>Awaiting Coach Gate</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '1px solid #fecaca', background: 'linear-gradient(180deg, #ffffff, #fef2f2)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#991b1b', fontWeight: 700 }}>
            No-Show Candidates
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626', fontFamily: 'Plus Jakarta Sans' }}>
            {noShowCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#991b1b' }}>Exceeded GPS Limit</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '1px solid #c7d2fe', background: 'linear-gradient(180deg, #ffffff, #f5f3ff)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#5b21b6', fontWeight: 700 }}>
            AI RAC Allocated
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7c3aed', fontFamily: 'Plus Jakarta Sans' }}>
            {racAllocatedCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6d28d9' }}>Auto-Assigned</span>
        </div>
      </div>

      {/* Visual Coach Seat Map */}
      <div style={{ marginBottom: '2.5rem' }}>
        <SeatMap
          coach={selectedCoach}
          passengers={coachPassengers}
          onSelectSeat={(details) => setSelectedSeatDetails(details)}
          selectedSeat={selectedSeatDetails?.seat}
        />
      </div>

      {/* Interactive AI Seat Allocation Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <AIAllocationPanel />
      </div>

      {/* Passenger Monitoring Table */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', margin: 0 }}>
              Coach {selectedCoach} Passenger Manifest
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {filteredList.length} of {totalSeats} seats
            </span>
          </div>

          {/* Coach Switcher & Filter Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Coach:</span>
              <select
                className="form-select"
                value={selectedCoach}
                onChange={(e) => setSelectedCoach(e.target.value)}
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
              >
                <option value="C1">Coach C1 (CC)</option>
                <option value="C2">Coach C2 (CC - Active Demo)</option>
                <option value="C3">Coach C3 (CC)</option>
                <option value="E1">Coach E1 (Executive EC)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="BOARDED">Boarded</option>
                <option value="PENDING">Pending</option>
                <option value="AUTO_ALLOCATED">AI Reallocated</option>
                <option value="NO_SHOW">No-Show</option>
              </select>
            </div>

            <div style={{ minWidth: '180px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search passenger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Passenger Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-50)', color: 'var(--primary-900)', borderBottom: '2px solid var(--primary-200)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Seat</th>
                <th style={{ padding: '0.75rem 1rem' }}>Sub-PNR</th>
                <th style={{ padding: '0.75rem 1rem' }}>Passenger Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Coach</th>
                <th style={{ padding: '0.75rem 1rem' }}>Boarding Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Scan Timestamp</th>
                <th style={{ padding: '0.75rem 1rem' }}>Allocation Origin</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((p) => (
                <tr
                  key={p.seat}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    background: p.status === 'AUTO_ALLOCATED' ? '#faf5ff' : p.seat === 38 ? '#fff1f2' : '#ffffff'
                  }}
                >
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    {p.seat}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--primary-700)' }}>
                    {p.subPnr || '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                    {p.name}
                    {p.isRacReallocation && (
                      <span style={{ fontSize: '0.7rem', color: '#7c3aed', display: 'block', fontWeight: 700 }}>
                        (AI Allocated from RAC Queue)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                    {selectedCoach}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <StatusBadge status={p.status} />
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {p.time || 'Awaiting Gate Scan'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {p.isRacReallocation ? (
                      <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>
                        AI Autonomous
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Original Booking
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TTEDashboardPage;
