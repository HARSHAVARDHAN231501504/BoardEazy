import React, { useState } from 'react';
import { User, ShieldCheck, AlertCircle, Cpu, Clock, CheckCircle2 } from 'lucide-react';

export const SeatMap = ({
  coach = 'C2',
  passengers = [],
  onSelectSeat,
  selectedSeat = null
}) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Group into 52 seats
  const totalSeats = 52;
  const seatsData = Array.from({ length: totalSeats }, (_, i) => {
    const seatNum = i + 1;
    const match = passengers.find(p => p.seat == seatNum);
    return {
      seat: seatNum,
      occupied: !!match,
      passenger: match || null,
      status: match ? match.status : 'AVAILABLE'
    };
  });

  const getSeatColor = (status) => {
    switch (status) {
      case 'BOARDED':
        return { bg: '#ecfdf5', border: '#059669', text: '#065f46', iconColor: '#059669' };
      case 'PENDING':
        return { bg: '#fef3c7', border: '#d97706', text: '#92400e', iconColor: '#d97706' };
      case 'NO_SHOW':
        return { bg: '#fee2e2', border: '#dc2626', text: '#991b1b', iconColor: '#dc2626' };
      case 'AUTO_ALLOCATED':
        return { bg: '#ede9fe', border: '#7c3aed', text: '#5b21b6', iconColor: '#7c3aed' };
      default:
        return { bg: '#f8fafc', border: '#cbd5e1', text: '#64748b', iconColor: '#94a3b8' };
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
      {/* Coach Header & Legend */}
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
          <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: 0 }}>
            Coach Layout: {coach} (52 Berths)
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Vande Bharat Executive AC Chair Car configuration
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.75rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#059669' }} />
            <span>Boarded</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#d97706' }} />
            <span>Pending</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#dc2626' }} />
            <span>No-Show</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#7c3aed' }} />
            <span>AI Reallocated</span>
          </div>
        </div>
      </div>

      {/* Coach Grid (13 rows of 4 seats: [A, B] AISLE [C, D]) */}
      <div style={{
        background: 'var(--primary-25)',
        border: '2px solid var(--primary-100)',
        borderRadius: '16px',
        padding: '1.25rem',
        position: 'relative'
      }}>
        {/* Train direction indicator */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--primary-600)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span>▲ ENGINE DIRECTION (MAS → SBC) ▲</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(13, minmax(36px, 1fr))',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {seatsData.map(({ seat, status, passenger }) => {
            const colors = getSeatColor(status);
            const isSelected = selectedSeat === seat;

            return (
              <div
                key={seat}
                onClick={() => onSelectSeat && onSelectSeat({ seat, passenger, status })}
                onMouseEnter={() => setHoveredSeat({ seat, passenger, status })}
                onMouseLeave={() => setHoveredSeat(null)}
                style={{
                  background: colors.bg,
                  border: `1.5px solid ${isSelected ? 'var(--primary-900)' : colors.border}`,
                  borderRadius: '8px',
                  height: '54px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isSelected ? '0 0 0 2px var(--primary-700)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: colors.text }}>
                  {seat}
                </span>

                {status === 'BOARDED' && <CheckCircle2 size={12} color={colors.iconColor} />}
                {status === 'PENDING' && <Clock size={12} color={colors.iconColor} />}
                {status === 'NO_SHOW' && <AlertCircle size={12} color={colors.iconColor} />}
                {status === 'AUTO_ALLOCATED' && <Cpu size={12} color={colors.iconColor} />}
                {status === 'AVAILABLE' && <User size={12} color={colors.iconColor} opacity={0.4} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Selected or Hovered Seat Details Box */}
      {(hoveredSeat || selectedSeat) && (
        <div style={{
          marginTop: '1rem',
          background: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem'
        }}>
          <div>
            <strong style={{ color: 'var(--primary-900)' }}>
              Seat {hoveredSeat?.seat || selectedSeat}:
            </strong>{' '}
            <span>{hoveredSeat?.passenger?.name || 'Available / Unassigned'}</span>
            {hoveredSeat?.passenger?.subPnr && (
              <span style={{ marginLeft: '0.5rem', fontFamily: 'JetBrains Mono', color: 'var(--primary-700)' }}>
                ({hoveredSeat.passenger.subPnr})
              </span>
            )}
          </div>
          <div>
            <span style={{
              fontWeight: 700,
              color: getSeatColor(hoveredSeat?.status || 'AVAILABLE').text,
              textTransform: 'uppercase',
              fontSize: '0.75rem'
            }}>
              Status: {hoveredSeat?.status || 'AVAILABLE'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
