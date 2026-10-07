import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import {
  ArrowRight,
  Plus,
  Trash2,
  Info,
  Sparkles,
  Phone,
  Mail,
  LayoutGrid,
  AlertCircle,
  Clock
} from 'lucide-react';
import { normalizeMobile } from '../data/seatLayoutEngine';

export const PassengerDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useBoardEazy();

  const stateData = location.state || {};
  const train = stateData.train || {
    number: '20607',
    name: 'Chennai – Mysuru Vande Bharat Express',
    type: 'Vande Bharat',
    fromStation: 'Chennai Central (MAS)',
    toStation: 'Bengaluru KSR (SBC)',
    fromStationCode: 'MAS',
    toStationCode: 'SBC',
    departure: '05:50 AM',
    arrival: '10:20 AM',
    classes: [{ code: 'CC', fare: 995 }, { code: 'EC', fare: 1885 }],
    coaches: [
      { coachNumber: 'C1', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'C2', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'E1', coachType: 'EC', classCode: 'EC', capacity: 52, layoutType: 'EXEC_CHAIR_CAR' }
    ]
  };

  const travelClass = stateData.travelClass || 'CC';
  const quota = stateData.quota || 'General';
  const journeyDate = stateData.journeyDate || '25 September 2026';
  const fromStation = stateData.fromStation || 'Chennai Central (MAS)';
  const toStation = stateData.toStation || 'Bengaluru KSR (SBC)';

  // Find valid coaches on this train for the selected class
  const availableCoaches = useMemo(() => {
    const list = train.coaches?.filter(c => c.classCode === travelClass) || [];
    return list.length > 0 ? list : [{ coachNumber: 'C2', coachType: travelClass, classCode: travelClass, capacity: 78, layoutType: 'CHAIR_CAR' }];
  }, [train, travelClass]);

  const [selectedCoach, setSelectedCoach] = useState(availableCoaches[0]?.coachNumber || 'C2');

  // Initial Passengers List (Berth Preference selectable, seat allocated only post-booking)
  const [passengers, setPassengers] = useState([
    {
      name: currentUser?.name || 'Harshavardhan S',
      age: 22,
      gender: 'Male',
      berthPreference: 'Window',
      mobile: currentUser?.phone || '+91 98765 43210',
      email: currentUser?.email || 'harshavardhan@gmail.com'
    }
  ]);

  const [contactMobile, setContactMobile] = useState(currentUser?.phone || '+91 98765 43210');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || 'harshavardhan@gmail.com');
  const [error, setError] = useState('');

  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      alert('Maximum 6 passengers allowed per booking.');
      return;
    }
    const idx = passengers.length;
    const defaultName = idx === 1 ? 'Meenakshi S' : idx === 2 ? 'Ravi Kumar' : '';
    const defaultGender = idx === 1 ? 'Female' : 'Male';
    const defaultMobile = idx === 1 ? '+91 98765 00001' : idx === 2 ? '+91 98765 00002' : '+91 98765 43210';
    const defaultEmail = idx === 1 ? 'meenakshi@gmail.com' : idx === 2 ? 'ravi@gmail.com' : 'passenger@gmail.com';

    setPassengers([
      ...passengers,
      {
        name: defaultName,
        age: 21,
        gender: defaultGender,
        berthPreference: 'Aisle',
        mobile: defaultMobile,
        email: defaultEmail
      }
    ]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length === 1) {
      alert('At least 1 passenger is required.');
      return;
    }
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name.trim()) {
        setError(`Please enter passenger name for Passenger #${i + 1}.`);
        return;
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        setError(`Please enter a valid age for Passenger #${i + 1}.`);
        return;
      }
      if (!p.mobile || p.mobile.replace(/\D/g, '').length < 10) {
        setError(`Please enter a valid 10-digit mobile number for Passenger #${i + 1} (${p.name || 'Passenger'}).`);
        return;
      }
    }

    navigate('/review-payment', {
      state: {
        train,
        travelClass,
        quota,
        journeyDate,
        fromStation,
        toStation,
        selectedCoach,
        passengers: passengers.map((p, idx) => ({
          ...p,
          subPnrPreview: `PA0${idx + 1}`,
          coach: selectedCoach,
          normalizedMobile: normalizeMobile(p.mobile)
        })),
        contactMobile,
        contactEmail
      }
    });
  };

  const baseFare = train.classes?.find(c => c.code === travelClass)?.fare || 995;
  const estimatedTotal = baseFare * passengers.length + (40 + 45) * passengers.length;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '880px' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--primary-50)',
          color: 'var(--primary-700)',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          <Sparkles size={14} />
          STEP 2 OF 4: PASSENGER & COACH CONFIGURATION
        </div>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-900)', margin: 0 }}>
          Passenger Details & Sub-PNR Configuration
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Assign individual Sub-PNRs with mobile-based account linking and choose your coach/berth preference.
        </p>
      </div>

      {/* Train & Journey Snapshot Card */}
      <div className="card" style={{
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        background: 'var(--primary-25)',
        border: '1px solid var(--primary-100)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>
                {train.number} – {train.name}
              </strong>
              <span className="badge badge-primary">{travelClass} Class</span>
              <span className="badge badge-secondary">{quota} Quota</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'block' }}>
              {journeyDate} • Dep: {train.departure} ({fromStation}) ➔ Arr: {train.arrival} ({toStation})
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Fare</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-800)' }}>
              ₹{estimatedTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Coach Selection & Allocation Notice */}
      <div className="card" style={{
        padding: '1.5rem',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        border: '1.5px solid var(--border-light)',
        background: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LayoutGrid size={18} color="var(--primary-600)" />
              Coach & Berth Preference
            </h3>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Select preferred coach for class <strong>{travelClass}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>Preferred Coach:</label>
            <select
              className="form-select"
              value={selectedCoach}
              onChange={(e) => setSelectedCoach(e.target.value)}
              style={{ width: '150px', fontWeight: 700 }}
            >
              {availableCoaches.map(c => (
                <option key={c.coachNumber} value={c.coachNumber}>
                  Coach {c.coachNumber} ({c.capacity} seats)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Seat Allocation Policy Note */}
        <div style={{
          marginTop: '1rem',
          background: 'var(--bg-subtle)',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.825rem',
          color: 'var(--text-secondary)'
        }}>
          <Clock size={16} color="var(--primary-600)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Note on Seat Allocation:</strong> In accordance with Indian Railways reservation rules, exact seat and berth numbers will be allocated automatically upon booking confirmation based on availability and your chosen preferences.
          </span>
        </div>
      </div>

      {/* Passenger Mobile Linking Notice Banner */}
      <div style={{
        background: '#eff6ff',
        border: '1.5px solid #bfdbfe',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: '#1e3a8a'
      }}>
        <Info size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <div>
          <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
            📱 Passenger Identity & Normalized Mobile Number Linking
          </strong>
          <span>
            Each passenger listed below will receive an individual <strong>Sub-PNR (e.g. PA01, PA02)</strong>. Entering their unique mobile number enables them to log into their own BoardEazy account, view this journey under <em>"Tickets Booked for Me"</em>, and complete biometric gate boarding independently.
          </span>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-red-light)',
          color: 'var(--danger-red)',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          border: '1px solid #fecaca',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700,
          fontSize: '0.875rem'
        }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Main Passengers Entry Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          {passengers.map((passenger, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1.5px solid var(--border-light)',
                background: '#ffffff',
                position: 'relative'
              }}
            >
              {/* Card Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--primary-100)',
                    color: 'var(--primary-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}>
                    {index + 1}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', margin: 0 }}>
                    Passenger #{index + 1}
                  </h3>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    background: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    border: '1px solid var(--primary-200)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    Sub-PNR: PA0{index + 1}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Coach {selectedCoach} • Seat allocated on booking
                  </span>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(index)}
                      className="btn btn-danger btn-icon btn-sm"
                      title="Remove Passenger"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem'
              }}>
                {/* Full Name */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Name (As on Govt ID)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    placeholder="e.g. Harshavardhan S / Meenakshi S"
                    required
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-input"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value, 10))}
                    min="1"
                    max="120"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>

                {/* Mobile Number (Key for Cross-Account Linking) */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={13} color="var(--primary-600)" />
                    Mobile Number (For Linking)
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={passenger.mobile}
                    onChange={(e) => handlePassengerChange(index, 'mobile', e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={13} color="var(--primary-600)" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={passenger.email}
                    onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                    placeholder="passenger@gmail.com"
                  />
                </div>

                {/* Berth Preference */}
                <div>
                  <label className="form-label">Berth / Seat Preference</label>
                  <select
                    className="form-select"
                    value={passenger.berthPreference}
                    onChange={(e) => handlePassengerChange(index, 'berthPreference', e.target.value)}
                  >
                    <option value="Window">Window Seat</option>
                    <option value="Aisle">Aisle Seat</option>
                    <option value="Lower Berth">Lower Berth</option>
                    <option value="Middle Berth">Middle Berth</option>
                    <option value="Upper Berth">Upper Berth</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                  </select>
                </div>

                {/* Allocation Status Indicator */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Seat Allocation
                  </span>
                  <div style={{
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: 'var(--primary-800)',
                    background: 'var(--primary-50)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--primary-200)',
                    marginTop: '0.25rem'
                  }}>
                    Assigned upon confirmation
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Passenger Button */}
        {passengers.length < 6 && (
          <button
            type="button"
            onClick={handleAddPassenger}
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '2rem', border: '1.5px dashed var(--border-medium)' }}
          >
            <Plus size={18} />
            Add Another Co-Passenger (Up to 6)
          </button>
        )}

        {/* Continue to Review CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => navigate('/book')}
            className="btn btn-secondary"
          >
            Back to Trains
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ minWidth: '220px' }}
          >
            Proceed to Review & Pay
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassengerDetailsPage;
