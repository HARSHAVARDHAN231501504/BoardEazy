import React, { useState } from 'react';
import { useBoardEazy } from '../context/BoardEazyContext';
import AIAllocationPanel from '../components/AIAllocationPanel';
import StatusBadge from '../components/StatusBadge';
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Activity,
  GitBranch,
  Layers,
  AlertTriangle
} from 'lucide-react';

export const AISeatAllocationPage = () => {
  const { racQueue, aiAllocationLogs, coachPassengers } = useBoardEazy();

  const seat38 = coachPassengers.find(cp => cp.seat === 38);
  const isAllocated = seat38?.status === 'AUTO_ALLOCATED';

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--ai-indigo-light)',
          color: 'var(--ai-indigo)',
          border: '1px solid #c7d2fe',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          <Cpu size={14} />
          AUTONOMOUS RAILWAY LOGISTICS CORE
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-900)' }}>
          AI Seat Allocation Engine & RAC Priority Matrix
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Autonomous Berth Recovery on "Next Station + 15 km" No-Show Trigger. Eliminates manual TTE corruption & optimizes railway seat utilization.
        </p>
      </div>

      {/* Primary Interactive AI Panel */}
      <div style={{ marginBottom: '2.5rem' }}>
        <AIAllocationPanel />
      </div>

      {/* Deep-dive Architecture & Mathematical Logic */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: The "Next Station + 15 KM" Rule */}
        <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <GitBranch size={22} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', margin: 0 }}>
              The "Next Station + 15 KM" Rule
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            In traditional Indian Railways, berths vacated by no-show passengers often remained empty or were assigned manually. BoardEazy calculates a deterministic geo-spatial threshold:
          </p>

          <div style={{
            background: 'var(--primary-25)',
            border: '1px solid var(--primary-100)',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '0.825rem',
            color: 'var(--primary-900)'
          }}>
            <code>
              IF (Passenger_Status != 'BOARDED') AND (Train_Distance_From_Station &gt; 15.0 km) <br />
              THEN Vacate_Berth(Coach, Seat) $\rightarrow$ Trigger_AI_RAC_Engine();
            </code>
          </div>
        </div>

        {/* Card 2: Deterministic RAC Priority Evaluation */}
        <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Activity size={22} color="#7c3aed" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', margin: 0 }}>
              Deterministic Priority Ranking
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            The AI engine ranks RAC passengers based on booking priority score, quota classification, check-in completion, and coach compatibility. It guarantees 100% fair allocation with zero human discretion.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {racQueue.map((r, idx) => (
              <div
                key={r.racId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: r.status === 'AUTO_ALLOCATED' ? '#ecfdf5' : '#f8fafc',
                  border: r.status === 'AUTO_ALLOCATED' ? '1px solid #10b981' : '1px solid var(--border-light)',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--primary-900)' }}>Rank #{idx + 1}: {r.name}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                    {r.racId} • Quota: {r.quota} • Class: {r.class}
                  </span>
                </div>
                <div>
                  {r.status === 'AUTO_ALLOCATED' ? (
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                      ALLOCATED ({r.allocatedSeat})
                    </span>
                  ) : (
                    <span style={{ fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'JetBrains Mono' }}>
                      Score {r.priorityScore}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISeatAllocationPage;
