import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_STATIONS, findTrainsBetweenStations, RAILWAY_CLASSES, DATA_SOURCE_CONFIG } from '../data/mockData';
import TrainCard from '../components/TrainCard';
import {
  Train,
  ArrowRightLeft,
  Calendar,
  MapPin,
  Database
} from 'lucide-react';

export const BookTicketPage = () => {
  const navigate = useNavigate();

  const [fromStation, setFromStation] = useState('MAS');
  const [toStation, setToStation] = useState('SBC');
  const [journeyDate, setJourneyDate] = useState('2026-09-25');
  const [quota, setQuota] = useState('General');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [trainTypeFilter, setTrainTypeFilter] = useState('ALL');

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  // Route-Aware Trains Search
  const searchResults = useMemo(() => {
    return findTrainsBetweenStations(fromStation, toStation, quota, selectedClass);
  }, [fromStation, toStation, quota, selectedClass]);

  // Secondary Filter by Train Type / Name
  const filteredTrains = useMemo(() => {
    return searchResults.filter(t => {
      const matchType = trainTypeFilter === 'ALL' || t.type === trainTypeFilter;
      const matchSearch = !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.number.includes(searchTerm);
      return matchType && matchSearch;
    });
  }, [searchResults, trainTypeFilter, searchTerm]);

  const handleSelectTrain = (train, clsCode) => {
    const fromObj = INITIAL_STATIONS.find(s => s.code === fromStation);
    const toObj = INITIAL_STATIONS.find(s => s.code === toStation);

    navigate('/passenger-details', {
      state: {
        train,
        travelClass: clsCode || (train.availableClasses && train.availableClasses[0]?.code) || 'CC',
        quota,
        journeyDate: '25 September 2026',
        fromStation: fromObj ? `${fromObj.name} (${fromObj.code})` : fromStation,
        toStation: toObj ? `${toObj.name} (${toObj.code})` : toStation,
        fromCode: fromStation,
        toCode: toStation
      }
    });
  };

  const fromObj = INITIAL_STATIONS.find(s => s.code === fromStation);
  const toObj = INITIAL_STATIONS.find(s => s.code === toStation);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Title & Data Source Badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-900)', margin: 0 }}>
            Book Train Ticket
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
            Multi-Route Railway Engine • Dynamic Coach Composition & Individual Sub-PNR Allocation
          </p>
        </div>

        {/* Prototype Data Mode Indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'var(--primary-50)',
          color: 'var(--primary-800)',
          border: '1px solid var(--primary-200)',
          padding: '0.4rem 0.85rem',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 700
        }}>
          <Database size={14} color="var(--primary-600)" />
          <span>{DATA_SOURCE_CONFIG.label} ({DATA_SOURCE_CONFIG.mode})</span>
        </div>
      </div>

      {/* Main Search Bar Box */}
      <div className="card" style={{
        padding: '1.75rem',
        borderRadius: '20px',
        marginBottom: '2rem',
        border: '1.5px solid var(--border-light)',
        boxShadow: 'var(--shadow-md)',
        background: '#ffffff'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          alignItems: 'flex-end'
        }}>
          {/* FROM STATION */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} color="var(--primary-600)" />
              FROM STATION
            </label>
            <select
              className="form-select"
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
              style={{ fontWeight: 600 }}
            >
              {INITIAL_STATIONS.map(st => (
                <option key={st.code} value={st.code}>
                  {st.city} - {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '0.25rem' }}>
            <button
              type="button"
              onClick={handleSwap}
              className="btn btn-secondary btn-icon"
              title="Swap From and To stations"
              style={{ borderRadius: '50%', width: '42px', height: '42px' }}
            >
              <ArrowRightLeft size={18} />
            </button>
          </div>

          {/* TO STATION */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} color="var(--success-green)" />
              TO STATION
            </label>
            <select
              className="form-select"
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
              style={{ fontWeight: 600 }}
            >
              {INITIAL_STATIONS.map(st => (
                <option key={st.code} value={st.code}>
                  {st.city} - {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          {/* JOURNEY DATE */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} color="var(--primary-600)" />
              JOURNEY DATE
            </label>
            <input
              type="date"
              className="form-input"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
            />
          </div>

          {/* QUOTA */}
          <div>
            <label className="form-label">QUOTA</label>
            <select
              className="form-select"
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Ladies">Ladies</option>
              <option value="Tatkal">Tatkal</option>
              <option value="Senior Citizen">Senior Citizen</option>
              <option value="Divyangjan">Divyangjan</option>
            </select>
          </div>

          {/* CLASS FILTER */}
          <div>
            <label className="form-label">CLASS</label>
            <select
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="ALL">All Available Classes</option>
              {Object.entries(RAILWAY_CLASSES).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Popular Route Pills */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          fontSize: '0.8rem'
        }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Popular Corridors:</span>
          {[
            { from: 'MAS', to: 'SBC', label: 'Chennai ⇄ Bengaluru' },
            { from: 'MAS', to: 'MYS', label: 'Chennai ⇄ Mysuru' },
            { from: 'MAS', to: 'CBE', label: 'Chennai ⇄ Coimbatore' },
            { from: 'MS', to: 'MDU', label: 'Chennai ⇄ Madurai' },
            { from: 'MAS', to: 'NDLS', label: 'Chennai ⇄ Delhi' },
            { from: 'CSMT', to: 'NDLS', label: 'Mumbai ⇄ Delhi' }
          ].map((pair, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setFromStation(pair.from); setToStation(pair.to); }}
              style={{
                background: fromStation === pair.from && toStation === pair.to ? 'var(--primary-100)' : 'var(--bg-subtle)',
                color: fromStation === pair.from && toStation === pair.to ? 'var(--primary-900)' : 'var(--text-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: '999px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {pair.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header & Secondary Filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', margin: 0 }}>
            {filteredTrains.length} Trains Found on Route
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {fromObj?.name || fromStation} ({fromStation}) ➔ {toObj?.name || toStation} ({toStation}) • {quota} Quota
          </span>
        </div>

        {/* Filter by Train Type */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'Vande Bharat', 'Shatabdi', 'Rajdhani', 'Superfast'].map(tType => (
            <button
              key={tType}
              onClick={() => setTrainTypeFilter(tType)}
              className={`btn btn-sm ${trainTypeFilter === tType ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem' }}
            >
              {tType}
            </button>
          ))}
        </div>
      </div>

      {/* Train List / Empty State */}
      {filteredTrains.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTrains.map((train) => (
            <TrainCard
              key={train.number}
              train={train}
              selectedClass={selectedClass !== 'ALL' ? selectedClass : null}
              onSelectTrain={handleSelectTrain}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1.5px dashed var(--border-medium)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Train size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
            No direct trains found for this route in current dataset
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            No configured trains operate directly between <strong>{fromStation}</strong> and <strong>{toStation}</strong>. Try selecting another corridor or swap stations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setFromStation('MAS'); setToStation('SBC'); }}
              className="btn btn-primary btn-sm"
            >
              Check Chennai ➔ Bengaluru
            </button>
            <button
              onClick={() => { setFromStation('MAS'); setToStation('MYS'); }}
              className="btn btn-outline btn-sm"
            >
              Check Chennai ➔ Mysuru
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTicketPage;
