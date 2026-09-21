import React, { useState } from 'react';
import { Train, Clock, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const TrainCard = ({
  train,
  selectedClass,
  onSelectClass,
  onSelectTrain
}) => {
  const [activeClassCode, setActiveClassCode] = useState(
    selectedClass || (train.classes && train.classes[0]?.code) || 'CC'
  );

  const activeClassObj = train.classes?.find(c => c.code === activeClassCode) || train.classes[0];

  const handleClassClick = (clsCode, e) => {
    e.stopPropagation();
    setActiveClassCode(clsCode);
    if (onSelectClass) onSelectClass(clsCode);
  };

  return (
    <div className="card card-interactive" style={{
      padding: '1.5rem',
      marginBottom: '1.25rem',
      borderRadius: '16px',
      border: '1.5px solid var(--border-light)',
      background: '#ffffff'
    }}>
      {/* Train Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            background: 'var(--primary-50)',
            color: 'var(--primary-700)',
            padding: '0.65rem',
            borderRadius: '12px',
            border: '1px solid var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Train size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'JetBrains Mono',
                fontWeight: 800,
                fontSize: '1.15rem',
                color: 'var(--primary-800)',
                background: 'var(--primary-25)',
                padding: '0.1rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--primary-100)'
              }}>
                {train.number}
              </span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', margin: 0 }}>
                {train.name}
              </h3>
              {train.type === 'Vande Bharat' && (
                <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                  <Sparkles size={11} />
                  SMART BIOMETRIC EXPRESS
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
              Runs On: {Array.isArray(train.runsOn) ? train.runsOn.join(', ') : train.runsOn} • Distance: {train.distanceKm} km
            </span>
          </div>
        </div>

        {/* Departure -> Duration -> Arrival */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          background: 'var(--primary-25)',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          border: '1px solid var(--primary-50)'
        }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-900)' }}>
              {train.departure}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {train.from}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {train.duration}
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--primary-400)',
              width: '80px',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ height: '2px', background: 'var(--primary-200)', width: '100%' }} />
              <ArrowRight size={14} color="var(--primary-600)" style={{ position: 'absolute', right: 0 }} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-900)' }}>
              {train.arrival}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {train.to}
            </div>
          </div>
        </div>
      </div>

      {/* Class Selector Boxes & Pricing */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.875rem',
        marginBottom: '1.25rem'
      }}>
        {train.classes?.map(cls => {
          const isSelected = cls.code === activeClassCode;
          const isAvail = cls.status.includes('AVAILABLE');

          return (
            <div
              key={cls.code}
              onClick={(e) => handleClassClick(cls.code, e)}
              style={{
                cursor: 'pointer',
                padding: '0.875rem',
                borderRadius: '12px',
                border: isSelected ? '2px solid var(--primary-500)' : '1px solid var(--border-medium)',
                background: isSelected ? 'var(--primary-50)' : '#ffffff',
                boxShadow: isSelected ? '0 0 0 3px rgba(21, 101, 192, 0.12)' : 'none',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary-900)', fontSize: '0.95rem' }}>
                  {cls.code}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  ₹{cls.fare.toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {cls.name}
              </div>
              <div>
                <StatusBadge status={cls.status} />
                {isAvail && cls.seatsLeft > 0 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--success-green)', fontWeight: 700, marginLeft: '0.35rem' }}>
                    ({cls.seatsLeft} left)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA & Amenities */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingTop: '0.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {train.amenities?.map((item, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.72rem',
                background: '#f1f5f9',
                color: 'var(--text-secondary)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Check size={11} color="#059669" />
              {item}
            </span>
          ))}
        </div>

        <button
          onClick={() => onSelectTrain && onSelectTrain(train, activeClassCode)}
          className="btn btn-primary"
          style={{ minWidth: '160px' }}
        >
          Select Train
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TrainCard;
