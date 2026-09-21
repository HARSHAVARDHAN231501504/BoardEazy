import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_STATIONS, INITIAL_TRAINS } from '../data/mockData';
import TrainCard from '../components/TrainCard';
import {
  Train,
  ArrowRightLeft,
  Calendar,
  Filter,
  Search,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const BookTicketPage = () => {
  const navigate = useNavigate();

  const [fromStation, setFromStation] = useState('MAS');
  const [toStation, setToStation] = useState('SBC');
  const [journeyDate, setJourneyDate] = useState('2026-09-25');
  const [quota, setQuota] = useState('General');
  const [selectedClass, setSelectedClass] = useState('3A');
  const [hasSearched, setHasSearched] = useState(true);

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleSelectTrain = (train, clsCode) => {
    navigate('/passenger-details', {
      state: {
        train,
        travelClass: clsCode || selectedClass,
        quota,
        journeyDate: '25 September 2026',
        fromStation: INITIAL_STATIONS.find(s => s.code === fromStation)?.name || fromStation,
        toStation: INITIAL_STATIONS.find(s => s.code === toStation)?.name || toStation
      }
    });
  };

  const fromObj = INITIAL_STATIONS.find(s => s.code === fromStation);
  const toObj = INITIAL_STATIONS.find(s => s.code === toStation);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-900)' }}>
          Book Train Ticket
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Search Indian railway trains, check dynamic berth availability, and issue instant Sub-PNRs.
        </p>
      </div>

      {/* Large Search Card */}
      <div className="card" style={{
        padding: '2rem',
        borderRadius: '20px',
        border: '1.5px solid var(--border-light)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2.5rem',
        background: '#ffffff'
      }}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            alignItems: 'flex-end',
            marginBottom: '1.5rem'
          }}>
            {/* From Station */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="var(--primary-600)" />
                From Station
              </label>
              <select
                className="form-select"
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
              >
                {INITIAL_STATIONS.map(st => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '4px' }}>
              <button
                type="button"
                onClick={handleSwap}
                className="btn btn-secondary"
                title="Swap From & To Stations"
                style={{ width: '44px', height: '44px', borderRadius: '50%', padding: 0 }}
              >
                <ArrowRightLeft size={18} />
              </button>
            </div>

            {/* To Station */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="var(--primary-600)" />
                To Station
              </label>
              <select
                className="form-select"
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
              >
                {INITIAL_STATIONS.map(st => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} color="var(--primary-600)" />
                Journey Date
              </label>
              <input
                type="date"
                className="form-input"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
              />
            </div>

            {/* Quota */}
            <div className="form-group">
              <label className="form-label">Quota</label>
              <select
                className="form-select"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
              >
                <option value="General">General Quota (GN)</option>
                <option value="Tatkal">Tatkal (TQ)</option>
                <option value="Ladies">Ladies Quota (LD)</option>
                <option value="Senior Citizen">Senior Citizen / Divyaang</option>
              </select>
            </div>

            {/* Class Filter */}
            <div className="form-group">
              <label className="form-label">Preferred Class</label>
              <select
                className="form-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="3A">AC 3 Tier (3A)</option>
                <option value="CC">AC Chair Car (CC)</option>
                <option value="EC">Exec. Chair Car (EC)</option>
                <option value="2A">AC 2 Tier (2A)</option>
                <option value="1A">AC First Class (1A)</option>
                <option value="SL">Sleeper Class (SL)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Quick Demo Route Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Popular:</span>
              <button
                type="button"
                onClick={() => { setFromStation('MAS'); setToStation('SBC'); }}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  border: '1px solid var(--primary-200)',
                  cursor: 'pointer'
                }}
              >
                MAS → SBC (Chennai - Bengaluru)
              </button>
              <button
                type="button"
                onClick={() => { setFromStation('MAS'); setToStation('CBE'); }}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  border: '1px solid var(--primary-200)',
                  cursor: 'pointer'
                }}
              >
                MAS → CBE (Chennai - Coimbatore)
              </button>
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
              <Search size={18} />
              Search Trains
            </button>
          </div>
        </form>
      </div>

      {/* Train Search Results List */}
      {hasSearched && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', margin: 0 }}>
                Available Trains: {fromObj?.name || fromStation} → {toObj?.name || toStation}
              </h3>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {INITIAL_TRAINS.length} trains found for 25 September 2026 ({quota} Quota)
              </span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              <ShieldCheck size={14} />
              ALL TRAINS EQUIPPED WITH BIOMETRIC GATES
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {INITIAL_TRAINS.map(train => (
              <TrainCard
                key={train.number}
                train={train}
                selectedClass={selectedClass}
                onSelectTrain={handleSelectTrain}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTicketPage;
