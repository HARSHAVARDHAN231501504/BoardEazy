import React, { useState, useMemo } from 'react';
import { useBoardEazy } from '../context/BoardEazyContext';
import { INITIAL_TRAINS } from '../data/mockData';
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
  MapPin,
  Phone,
  UserCheck
} from 'lucide-react';

export const TTEDashboardPage = () => {
  const {
    currentUser,
    activeTrainNumber,
    setActiveTrainNumber,
    selectedCoach,
    setSelectedCoach,
    getCoachSeatsData,
    updatePassengerStatus
  } = useBoardEazy();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSeatDetails, setSelectedSeatDetails] = useState(null);

  // Active Train Definition
  const activeTrain = useMemo(() => {
    return INITIAL_TRAINS.find(t => t.number === activeTrainNumber) || INITIAL_TRAINS[0];
  }, [activeTrainNumber]);

  // Available Coaches for active train
  const availableCoaches = useMemo(() => {
    return activeTrain.coaches || [
      { coachNumber: 'C1', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'C2', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'E1', coachType: 'EC', classCode: 'EC', capacity: 52, layoutType: 'EXEC_CHAIR_CAR' }
    ];
  }, [activeTrain]);

  // Active Coach Definition
  const activeCoachDef = useMemo(() => {
    return availableCoaches.find(c => c.coachNumber === selectedCoach) || availableCoaches[0];
  }, [availableCoaches, selectedCoach]);

  // Dynamic Coach Seats data
  const currentSeats = useMemo(() => {
    return getCoachSeatsData(activeTrain.number, activeCoachDef.coachNumber);
  }, [activeTrain.number, activeCoachDef.coachNumber, getCoachSeatsData]);

  // Compute live occupancy metrics
  const totalCapacity = currentSeats.length;
  const boardedCount = currentSeats.filter(s => s.status === 'BOARDED').length;
  const pendingCount = currentSeats.filter(s => s.status === 'PENDING' || s.status === 'STATION_ENTERED').length;
  const noShowCount = currentSeats.filter(s => s.status === 'NO_SHOW').length;
  const racAllocatedCount = currentSeats.filter(s => s.status === 'AUTO_ALLOCATED').length;

  // Filter passengers table
  const filteredList = currentSeats.filter(s => {
    const passengerName = s.passenger?.name || '';
    const subPnr = s.passenger?.subPnr || '';
    const seatStr = s.seatNumber.toString();

    const matchesSearch =
      !searchTerm ||
      passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subPnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seatStr.includes(searchTerm);

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return s.status === statusFilter;
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
            Train {activeTrain.number} – {activeTrain.name}
          </h1>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Route: <strong>{activeTrain.source} ➔ {activeTrain.destination}</strong> • Active Coach: <strong>{activeCoachDef.coachNumber} ({activeCoachDef.classCode})</strong>
          </span>
        </div>

        {/* Train Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>Assigned Train:</label>
          <select
            className="form-select"
            value={activeTrainNumber}
            onChange={(e) => {
              setActiveTrainNumber(e.target.value);
              const t = INITIAL_TRAINS.find(item => item.number === e.target.value);
              if (t && t.coaches && t.coaches.length > 0) {
                setSelectedCoach(t.coaches[0].coachNumber);
              }
            }}
            style={{ fontWeight: 700 }}
          >
            {INITIAL_TRAINS.map(t => (
              <option key={t.number} value={t.number}>
                {t.number} - {t.name}
              </option>
            ))}
          </select>
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
              TTE Role Notice: MONITOR ONLY (Manual Seat Discretion Disabled)
            </strong>
            <span style={{ fontSize: '0.8rem', color: '#b45309' }}>
              Vacated berths are automatically reclaimed & reassigned by the BoardEazy AI Engine under RAC Priority Rules upon crossing the "Next Station + 15 km" geo-threshold.
            </span>
          </div>
        </div>

        <span className="badge badge-ai" style={{ fontSize: '0.72rem' }}>
          <Cpu size={12} />
          AUTONOMOUS AI ENGINE IN CHARGE
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
            Coach Capacity
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-900)', fontFamily: 'Plus Jakarta Sans' }}>
            {totalCapacity}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Berths in Coach {activeCoachDef.coachNumber}</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '1px solid #a7f3d0', background: 'linear-gradient(180deg, #ffffff, #f0fdf4)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#047857', fontWeight: 700 }}>
            Verified Boarded
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', fontFamily: 'Plus Jakarta Sans' }}>
            {boardedCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#065f46' }}>Biometric Verified</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '1px solid #fde68a', background: 'linear-gradient(180deg, #ffffff, #fffbeb)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#92400e', fontWeight: 700 }}>
            Pending Boarding
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#d97706', fontFamily: 'Plus Jakarta Sans' }}>
            {pendingCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309' }}>Awaiting Door Scan</span>
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
          <span style={{ fontSize: '0.75rem', color: '#6d28d9' }}>Reallocated</span>
        </div>
      </div>

      {/* Dynamic Visual Coach Seat Map */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)' }}>Select Coach:</span>
            {availableCoaches.map(c => (
              <button
                key={c.coachNumber}
                type="button"
                onClick={() => setSelectedCoach(c.coachNumber)}
                className={`btn btn-sm ${selectedCoach === c.coachNumber ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontWeight: 800 }}
              >
                Coach {c.coachNumber} ({c.classCode})
              </button>
            ))}
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Layout: <strong>{activeCoachDef.layoutType}</strong> ({activeCoachDef.capacity} seats)
          </span>
        </div>

        <SeatMap
          coach={activeCoachDef.coachNumber}
          coachDef={activeCoachDef}
          seats={currentSeats}
          onSelectSeat={(details) => setSelectedSeatDetails(details)}
          selectedSeat={selectedSeatDetails?.seatNumber}
        />
      </div>

      {/* Interactive AI Seat Allocation Panel */}
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
              Coach {activeCoachDef.coachNumber} Passenger Manifest
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {filteredList.length} of {totalCapacity} seats
            </span>
          </div>

          {/* Filter Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                <option value="AVAILABLE">Available</option>
              </select>
            </div>

            <div style={{ minWidth: '180px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search passenger or seat..."
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
                <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Sub-PNR</th>
                <th style={{ padding: '0.75rem 1rem' }}>Passenger Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Coach</th>
                <th style={{ padding: '0.75rem 1rem' }}>Boarding Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Scan Timestamp</th>
                <th style={{ padding: '0.75rem 1rem' }}>Allocation Origin</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((s) => (
                <tr
                  key={s.seatNumber}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    background: s.status === 'AUTO_ALLOCATED' ? '#faf5ff' : s.seatNumber === 38 ? '#fff1f2' : '#ffffff'
                  }}
                >
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                    {s.seatNumber}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {s.berthType}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--primary-700)' }}>
                    {s.passenger?.subPnr || '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                    {s.passenger ? s.passenger.name : <span style={{ color: 'var(--text-muted)' }}>Vacant / Available</span>}
                    {s.passenger?.isRacReallocation && (
                      <span style={{ fontSize: '0.7rem', color: '#7c3aed', display: 'block', fontWeight: 700 }}>
                        (AI Allocated from RAC Queue)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                    {activeCoachDef.coachNumber}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <StatusBadge status={s.status} />
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {s.passenger?.time || (s.status === 'BOARDED' ? 'Verified' : '—')}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {s.passenger?.isRacReallocation ? (
                      <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>
                        AI Autonomous
                      </span>
                    ) : s.passenger ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Original Booking
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
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
