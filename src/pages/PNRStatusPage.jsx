import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import StatusBadge from '../components/StatusBadge';
import {
  Search,
  Train,
  Ticket,
  Fingerprint,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const PNRStatusPage = () => {
  const location = useLocation();
  const { bookings } = useBoardEazy();

  const queryParams = new URLSearchParams(location.search);
  const defaultPnr = queryParams.get('pnr') || '4567891234';

  const [pnrInput, setPnrInput] = useState(defaultPnr);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultPnr) {
      handleSearch(defaultPnr);
    }
  }, []);

  const handleSearch = (pnrQuery = pnrInput) => {
    setError('');
    const query = pnrQuery.trim();

    // Check if matching main PNR
    const match = bookings.find(b => b.mainPnr === query);
    if (match) {
      setSearchResult(match);
      return;
    }

    // Check if matching sub PNR
    for (let b of bookings) {
      const p = b.passengers.find(item => item.subPnr.toUpperCase() === query.toUpperCase());
      if (p) {
        setSearchResult(b);
        return;
      }
    }

    setError(`No records found for PNR "${query}". Please check the 10-digit Main PNR or Sub-PNR and try again.`);
    setSearchResult(null);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '840px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-900)' }}>
          PNR & Boarding Status Inquiry
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Check real-time reservation confirmation, assigned coach & seat, and gate boarding clearance.
        </p>
      </div>

      {/* Search Card */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: '16px', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(pnrInput); }} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            value={pnrInput}
            onChange={(e) => setPnrInput(e.target.value)}
            placeholder="Enter 10-Digit Main PNR (e.g. 4567891234) or Sub-PNR (e.g. PA01)..."
            style={{ flex: 1, minWidth: '240px', fontFamily: 'JetBrains Mono', fontSize: '1rem', fontWeight: 600 }}
          />
          <button type="submit" className="btn btn-primary btn-lg">
            <Search size={18} />
            Get Status
          </button>
        </form>

        {/* Demo Quick links */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Try Demo PNRs:</span>
          <button
            type="button"
            onClick={() => { setPnrInput('4567891234'); handleSearch('4567891234'); }}
            style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontFamily: 'JetBrains Mono' }}
          >
            4567891234 (MAS-SBC)
          </button>
          <button
            type="button"
            onClick={() => { setPnrInput('8821903412'); handleSearch('8821903412'); }}
            style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontFamily: 'JetBrains Mono' }}
          >
            8821903412 (Shatabdi)
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-red-light)', color: '#991b1b', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Search Results Display */}
      {searchResult && (
        <div className="card" style={{ padding: '2rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Main PNR:
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-800)' }}>
                  {searchResult.mainPnr}
                </span>
                <span className="badge badge-success">
                  CONFIRMED
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', margin: 0 }}>
                {searchResult.trainNumber} – {searchResult.trainName}
              </h3>
            </div>

            <Link to={`/boarding?pnr=${searchResult.mainPnr}&subPnr=PA01`} className="btn btn-success btn-sm">
              <Fingerprint size={15} />
              Open Digital Boarding Pass
            </Link>
          </div>

          {/* Timetable info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            background: 'var(--primary-25)',
            border: '1px solid var(--primary-100)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            fontSize: '0.85rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>Date of Journey</span>
              <strong style={{ color: 'var(--primary-900)' }}>{searchResult.journeyDate}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>From Station</span>
              <strong style={{ color: 'var(--primary-900)' }}>{searchResult.fromStation}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Dep: {searchResult.departureTime}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>To Station</span>
              <strong style={{ color: 'var(--primary-900)' }}>{searchResult.toStation}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Arr: {searchResult.arrivalTime}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>Class & Quota</span>
              <strong style={{ color: 'var(--primary-800)' }}>{searchResult.travelClass || '3A'} ({searchResult.quota || 'General'})</strong>
            </div>
          </div>

          {/* Passenger manifest list */}
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
              Passenger Sub-PNRs & Current Boarding Clearance
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {searchResult.passengers?.map((p) => (
                <div
                  key={p.subPnr}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#ffffff',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '12px',
                    padding: '0.875rem 1.25rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ color: 'var(--primary-900)' }}>{p.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({p.age} yrs, {p.gender})</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                      Coach {p.coach} • Seat {p.seat} ({p.berthType})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
                        Sub-PNR
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--primary-700)', fontSize: '0.95rem' }}>
                        {p.subPnr}
                      </span>
                    </div>
                    <StatusBadge status={p.boardingStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PNRStatusPage;
