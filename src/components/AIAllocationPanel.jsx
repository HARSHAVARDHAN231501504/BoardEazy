import React, { useState } from 'react';
import { Cpu, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Zap, Users } from 'lucide-react';
import { useBoardEazy } from '../context/BoardEazyContext';

export const AIAllocationPanel = () => {
  const { racQueue, simulateNextStation15Km, aiAllocationLogs, coachPassengers } = useBoardEazy();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAllocResult, setLastAllocResult] = useState(null);

  // Check seat 38 state
  const seat38 = coachPassengers.find(cp => cp.seat === 38);
  const isSeat38Reallocated = seat38?.status === 'AUTO_ALLOCATED';

  const handleSimulateAI = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const result = simulateNextStation15Km(38);
      setLastAllocResult(result);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      border: '2px solid #c7d2fe',
      padding: '1.75rem',
      boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.12)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background AI glow accent */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--ai-indigo), var(--ai-purple))',
            color: '#ffffff',
            padding: '0.65rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', margin: 0 }}>
                AI Seat Allocation Engine
              </h3>
              <span className="badge badge-ai">
                <Sparkles size={11} />
                AUTONOMOUS v4.2
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Real-time Berth Reallocation on "Next Station + 15 KM" No-Show Trigger
            </span>
          </div>
        </div>

        {/* TTE Prohibition Banner */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          padding: '0.4rem 0.85rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#92400e',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <ShieldCheck size={14} color="#d97706" />
          TTE ROLE: MONITOR ONLY (Manual Allocation Disabled)
        </div>
      </div>

      {/* Visual Workflow Pipeline */}
      <div style={{
        background: 'var(--primary-25)',
        border: '1px solid var(--primary-100)',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-700)', marginBottom: '0.75rem' }}>
          Deterministic AI Decision Flow
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.5rem',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Step 1 */}
          <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--danger-red)', fontWeight: 700, display: 'block' }}>CONDITION 1</span>
            <strong style={{ fontSize: '0.8rem', color: 'var(--primary-900)' }}>Passenger Unboarded</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>No train gate scan</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary-400)' }}>
            <ArrowRight size={16} />
          </div>

          {/* Step 2 */}
          <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--warning-amber)', fontWeight: 700, display: 'block' }}>TRIGGER</span>
            <strong style={{ fontSize: '0.8rem', color: 'var(--primary-900)' }}>Next Station + 15 km</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>GPS Geo-fence breach</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary-400)' }}>
            <ArrowRight size={16} />
          </div>

          {/* Step 3 */}
          <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--primary-600)', fontWeight: 700, display: 'block' }}>ALGORITHM</span>
            <strong style={{ fontSize: '0.8rem', color: 'var(--primary-900)' }}>RAC Queue Rank</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Highest priority score</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary-400)' }}>
            <ArrowRight size={16} />
          </div>

          {/* Step 4 */}
          <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #059669' }}>
            <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 800, display: 'block' }}>EXECUTION</span>
            <strong style={{ fontSize: '0.8rem', color: '#065f46' }}>Berth Allocated</strong>
            <span style={{ fontSize: '0.7rem', color: '#047857', display: 'block' }}>Live database sync</span>
          </div>
        </div>
      </div>

      {/* Active Demonstration Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* Vacant Berth Candidate Box */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1.5px solid var(--border-light)',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Target Berth Candidate
            </span>
            <span className={`badge ${isSeat38Reallocated ? 'badge-ai' : 'badge-warning'}`}>
              {isSeat38Reallocated ? 'AI Reallocated' : 'Pending Verification'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: isSeat38Reallocated ? '#ede9fe' : '#fee2e2',
              color: isSeat38Reallocated ? '#6d28d9' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              C2-38
            </div>
            <div>
              <strong style={{ color: 'var(--primary-900)', fontSize: '0.95rem', display: 'block' }}>
                {isSeat38Reallocated ? seat38.name : 'S. Ranganathan (PA03)'}
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isSeat38Reallocated
                  ? 'Reallocated via RAC Priority Rank 1'
                  : 'Main PNR: 7891234560 • Status: Unboarded'}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: '#ffffff', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <strong>Reason:</strong> Confirmed passenger did not complete boarding verification prior to MAS + 15 km GPS milestone.
          </div>
        </div>

        {/* RAC Priority Evaluation Matrix */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1.5px solid var(--border-light)',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Configured RAC Priority Queue
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--ai-indigo)', fontWeight: 700 }}>
              {racQueue.filter(r => r.status === 'RAC_WAITING').length} in Queue
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {racQueue.slice(0, 3).map((r, idx) => {
              const isAlloc = r.status === 'AUTO_ALLOCATED';
              return (
                <div
                  key={r.racId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isAlloc ? '#ecfdf5' : '#ffffff',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: isAlloc ? '1px solid #10b981' : '1px solid var(--border-light)',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontWeight: 800,
                      color: isAlloc ? '#059669' : 'var(--primary-700)',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '0.75rem'
                    }}>
                      #{idx + 1} {r.racId}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{r.name}</span>
                  </div>
                  <div>
                    {isAlloc ? (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                        ALLOCATED C2-38
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Score: {r.priorityScore}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Execution Trigger Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%)',
        color: '#ffffff',
        padding: '1.25rem 1.5rem',
        borderRadius: '14px'
      }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: 0 }}>
            Simulate "Next Station + 15 KM" Departure
          </h4>
          <span style={{ fontSize: '0.8rem', color: '#90caf9' }}>
            Triggers automatic no-show identification & RAC priority reallocation in real time
          </span>
        </div>

        <button
          onClick={handleSimulateAI}
          disabled={isProcessing || isSeat38Reallocated}
          className="btn btn-ai btn-lg"
          style={{ minWidth: '220px' }}
        >
          {isProcessing ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Evaluating RAC Queue...
            </>
          ) : isSeat38Reallocated ? (
            <>
              <CheckCircle2 size={18} color="#a7f3d0" />
              AI Reallocation Completed
            </>
          ) : (
            <>
              <Zap size={18} />
              Execute AI Allocation
            </>
          )}
        </button>
      </div>

      {/* Live Reallocation Audit Log */}
      {aiAllocationLogs.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            Live Engine Event Audit Stream
          </span>
          <div style={{
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: '10px',
            padding: '0.875rem 1.25rem',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.78rem',
            maxHeight: '140px',
            overflowY: 'auto'
          }}>
            {aiAllocationLogs.slice(0, 4).map((log) => (
              <div key={log.id} style={{ marginBottom: '0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.35rem' }}>
                <span style={{ color: '#38bdf8' }}>[{log.timestamp}]</span>{' '}
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>{log.event}:</span>{' '}
                <span style={{ color: '#e2e8f0' }}>{log.details}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAllocationPanel;
