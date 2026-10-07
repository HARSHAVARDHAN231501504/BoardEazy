import React from 'react';
import { useBoardEazy } from '../context/BoardEazyContext';
import { INITIAL_TRAINS } from '../data/mockData';
import {
  Sliders,
  Train,
  Users,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Activity,
  Sparkles
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { bookings, aiAllocationLogs, coachPassengers } = useBoardEazy();

  const boardedCount = coachPassengers.filter(p => p.status === 'BOARDED').length;
  const pendingCount = coachPassengers.filter(p => p.status === 'PENDING' || p.status === 'STATION_ENTERED').length;
  const noShowCount = coachPassengers.filter(p => p.status === 'NO_SHOW').length;
  const racAllocCount = coachPassengers.filter(p => p.status === 'AUTO_ALLOCATED').length;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span style={{
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              SOUTHERN RAILWAY (MAS DIVISION)
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Operations Center
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', color: 'var(--primary-900)', margin: 0 }}>
            Divisional Operations & AI Analytics
          </h1>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time Passenger Flow, Biometric Gate Telemetry & Autonomous Seat Reallocation Analytics
          </span>
        </div>

        <div style={{
          background: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Activity size={16} color="var(--primary-600)" />
          <span>System Health: <strong>100% Operational</strong></span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Total Registered Users</span>
            <Users size={16} color="var(--primary-600)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary-900)', margin: '0.35rem 0 0.15rem' }}>
            14,820
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--success-green)', fontWeight: 700 }}>
            ↑ +12.4% this month
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Total Active Bookings</span>
            <Ticket size={16} color="var(--primary-600)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary-900)', margin: '0.35rem 0 0.15rem' }}>
            8,450
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            Across 42 active trains
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Boarding Completion</span>
            <CheckCircle2 size={16} color="#059669" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#059669', margin: '0.35rem 0 0.15rem' }}>
            {Math.round((boardedCount / 52) * 100)}%
          </div>
          <span style={{ fontSize: '0.72rem', color: '#047857' }}>
            {boardedCount} of 52 in Coach C2
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>AI Auto-Allocations</span>
            <Cpu size={16} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#7c3aed', margin: '0.35rem 0 0.15rem' }}>
            {182 + racAllocCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 700 }}>
            Zero manual interventions
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Chart Card 1: Boarding Status Distribution */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
            Passenger Boarding Status Breakdown
          </h4>

          {/* Graphical Bar */}
          <div style={{ height: '24px', width: '100%', display: 'flex', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <div style={{ width: `${(boardedCount / 52) * 100}%`, background: '#059669' }} title="Boarded" />
            <div style={{ width: `${(pendingCount / 52) * 100}%`, background: '#d97706' }} title="Pending" />
            <div style={{ width: `${(noShowCount / 52) * 100}%`, background: '#dc2626' }} title="No-Show" />
            <div style={{ width: `${(racAllocCount / 52) * 100}%`, background: '#7c3aed' }} title="AI Reallocated" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '10px', height: '10px', background: '#059669', borderRadius: '2px' }} />
                <span>Verified Boarded</span>
              </div>
              <strong>{boardedCount} ({Math.round((boardedCount / 52) * 100)}%)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '10px', height: '10px', background: '#d97706', borderRadius: '2px' }} />
                <span>Pending Boarding</span>
              </div>
              <strong>{pendingCount} ({Math.round((pendingCount / 52) * 100)}%)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '10px', height: '10px', background: '#dc2626', borderRadius: '2px' }} />
                <span>No-Show Released</span>
              </div>
              <strong>{noShowCount} ({Math.round((noShowCount / 52) * 100)}%)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '10px', height: '10px', background: '#7c3aed', borderRadius: '2px' }} />
                <span>AI RAC Reassigned</span>
              </div>
              <strong>{racAllocCount} ({Math.round((racAllocCount / 52) * 100)}%)</strong>
            </div>
          </div>
        </div>

        {/* Chart Card 2: AI Engine Utilization Rate */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
            AI Engine Efficiency & Reallocation Speed
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Average response time to detect unboarded berth and reassign to highest RAC passenger:
          </p>

          <div style={{
            background: 'var(--primary-25)',
            border: '1px solid var(--primary-100)',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4f46e5', fontFamily: 'Plus Jakarta Sans' }}>
              0.84s
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Average Automated Reallocation Latency
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Algorithmic Fairness: <strong>100%</strong></span>
            <span>Manual Overrides: <strong>0 (Disabled)</strong></span>
          </div>
        </div>
      </div>

      {/* Active Trains Management Table */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
          Divisional Train Fleet Management
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-50)', color: 'var(--primary-900)', borderBottom: '2px solid var(--primary-200)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Train No.</th>
                <th style={{ padding: '0.75rem 1rem' }}>Train Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Route</th>
                <th style={{ padding: '0.75rem 1rem' }}>Dep / Arr</th>
                <th style={{ padding: '0.75rem 1rem' }}>Biometric Gates</th>
                <th style={{ padding: '0.75rem 1rem' }}>AI Allocation</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_TRAINS.map(t => (
                <tr key={t.number} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--primary-800)' }}>
                    {t.number}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{t.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{t.source || t.from} → {t.destination || t.to}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem' }}>{t.departure || (t.routeStops && t.routeStops[0]?.departure) || '05:50 AM'} → {t.arrival || (t.routeStops && t.routeStops[t.routeStops.length - 1]?.arrival) || '12:20 PM'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                      ONLINE (RD-Active)
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>
                      AUTOMATED
                    </span>
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

export default AdminDashboardPage;
