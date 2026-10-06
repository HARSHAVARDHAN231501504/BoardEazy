import React, { useState } from 'react';
import { User, ShieldCheck, AlertCircle, Cpu, Clock, CheckCircle2, Info, Sparkles } from 'lucide-react';

export const SeatMap = ({
  coach = 'C2',
  coachDef = null,
  seats = [],
  onSelectSeat = null,
  selectedSeat = null,
  selectable = false,
  interactive = true,
  showLegend = true,
  title = null
}) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const layoutType = coachDef?.layoutType || (coach.startsWith('C') ? 'CHAIR_CAR' : coach.startsWith('E') ? 'EXEC_CHAIR_CAR' : coach.startsWith('B') || coach.startsWith('S') ? 'SLEEPER_3A' : coach.startsWith('A') ? 'AC_2_TIER' : coach.startsWith('H') ? 'FIRST_AC' : coach.startsWith('D') ? 'SECOND_SITTING' : 'CHAIR_CAR');

  const getSeatColor = (status, isSelected) => {
    if (isSelected) {
      return { bg: '#2563eb', border: '#1d4ed8', text: '#ffffff', iconColor: '#ffffff' };
    }
    switch (status) {
      case 'BOARDED':
        return { bg: '#ecfdf5', border: '#059669', text: '#065f46', iconColor: '#059669' };
      case 'PENDING':
      case 'STATION_ENTERED':
        return { bg: '#fef3c7', border: '#d97706', text: '#92400e', iconColor: '#d97706' };
      case 'NO_SHOW':
        return { bg: '#fee2e2', border: '#dc2626', text: '#991b1b', iconColor: '#dc2626' };
      case 'AUTO_ALLOCATED':
        return { bg: '#ede9fe', border: '#7c3aed', text: '#5b21b6', iconColor: '#7c3aed' };
      case 'OCCUPIED':
      case 'BOOKED':
        return { bg: '#f1f5f9', border: '#94a3b8', text: '#475569', iconColor: '#64748b' };
      default:
        // AVAILABLE
        return { bg: '#ffffff', border: '#cbd5e1', text: '#1e293b', iconColor: '#94a3b8' };
    }
  };

  const handleSeatClick = (seatObj) => {
    if (onSelectSeat) {
      onSelectSeat(seatObj);
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid var(--border-light)',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Coach Header & Details */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              COACH {coach}
            </span>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: 0 }}>
              {title || `Interactive Seat & Berth Matrix (${layoutType.replace('_', ' ')})`}
            </h4>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Capacity: <strong>{seats.length} Seats/Berths</strong> • Standard Indian Railways Layout
          </span>
        </div>

        {/* Legend */}
        {showLegend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ffffff', border: '1.5px solid #cbd5e1' }} />
              <span>Available</span>
            </div>
            {selectable && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#2563eb', border: '1.5px solid #1d4ed8' }} />
                <span>Selected</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ecfdf5', border: '1.5px solid #059669' }} />
              <span>Boarded</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fef3c7', border: '1.5px solid #d97706' }} />
              <span>Pending</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ede9fe', border: '1.5px solid #7c3aed' }} />
              <span>AI Allocated</span>
            </div>
          </div>
        )}
      </div>

      {/* Train Direction Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.4rem 0.8rem',
        background: 'var(--primary-25)',
        borderRadius: '8px',
        border: '1px solid var(--primary-100)',
        marginBottom: '1rem',
        fontSize: '0.75rem',
        color: 'var(--primary-800)',
        fontWeight: 600
      }}>
        <span>🚪 Front Vestibule (Mas/MAS End)</span>
        <span>◄── TRAIN DIRECTION ──►</span>
        <span>Rear Vestibule / Lavatory 🚪</span>
      </div>

      {/* Responsive Coach Grid Container */}
      <div style={{
        overflowX: 'auto',
        padding: '0.5rem 0',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{
          minWidth: layoutType === 'FIRST_AC' ? '480px' : '640px',
          display: 'grid',
          gridTemplateColumns: layoutType === 'FIRST_AC' ? 'repeat(auto-fill, minmax(130px, 1fr))' : layoutType === 'EXEC_CHAIR_CAR' ? 'repeat(auto-fill, minmax(70px, 1fr))' : 'repeat(auto-fill, minmax(64px, 1fr))',
          gap: '0.65rem'
        }}>
          {seats.map((s) => {
            const isSelected = selectedSeat === s.seatNumber || selectedSeat === s.seatNumber.toString();
            const colors = getSeatColor(s.status, isSelected);
            const isClickable = interactive || (selectable && s.status === 'AVAILABLE');

            return (
              <div
                key={s.seatNumber}
                onClick={() => isClickable && handleSeatClick(s)}
                onMouseEnter={() => setHoveredSeat(s)}
                onMouseLeave={() => setHoveredSeat(null)}
                style={{
                  background: colors.bg,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '10px',
                  padding: '0.5rem 0.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                }}
                title={`Seat ${s.seatNumber} - ${s.berthType} (${s.status})`}
              >
                {/* Seat Number */}
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 900,
                  fontFamily: 'JetBrains Mono',
                  color: colors.text
                }}>
                  {s.seatNumber}
                </div>

                {/* Berth Type Label */}
                <div style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: isSelected ? '#ffffff' : colors.text,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  marginTop: '0.1rem'
                }}>
                  {s.berthType?.split(' ')[0] || 'Seat'}
                </div>

                {/* Status Indicator Dot */}
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: colors.border,
                  marginTop: '0.2rem'
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Tooltip Details Bar */}
      {hoveredSeat && (
        <div style={{
          marginTop: '1.25rem',
          background: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          borderRadius: '10px',
          padding: '0.65rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--primary-900)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--primary-600)" />
            <span>
              <strong>Coach {coach} • Seat {hoveredSeat.seatNumber}</strong>: {hoveredSeat.berthType}
            </span>
          </div>
          <div>
            Status: <span style={{ fontWeight: 800 }}>{hoveredSeat.status}</span>
            {hoveredSeat.passenger && (
              <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                ({hoveredSeat.passenger.name} - {hoveredSeat.passenger.subPnr})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
