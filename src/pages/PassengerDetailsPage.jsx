import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import {
  Train,
  User,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Info,
  Calendar,
  MapPin,
  Sparkles,
  Mail,
  Phone
} from 'lucide-react';

export const PassengerDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useBoardEazy();

  const stateData = location.state || {};
  const train = stateData.train || {
    number: '20607',
    name: 'Chennai – Mysuru Vande Bharat Express',
    fromStation: 'Chennai Central (MAS)',
    toStation: 'Bengaluru KSR (SBC)',
    departure: '05:50 AM',
    arrival: '10:20 AM',
    classes: [{ code: '3A', fare: 1250 }]
  };
  const travelClass = stateData.travelClass || '3A';
  const quota = stateData.quota || 'General';
  const journeyDate = stateData.journeyDate || '25 September 2026';

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

  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      alert('Maximum 6 passengers allowed per booking.');
      return;
    }
    const defaultName = passengers.length === 1 ? 'Meenakshi S' : '';
    const defaultGender = passengers.length === 1 ? 'Female' : 'Male';
    const defaultEmail = passengers.length === 1 ? 'meenakshi@gmail.com' : 'passenger@gmail.com';

    setPassengers([
      ...passengers,
      {
        name: defaultName,
        age: 21,
        gender: defaultGender,
        berthPreference: 'Aisle',
        mobile: '+91 98765 43211',
        email: defaultEmail
      }
    ]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length === 1) {
      alert('At least one passenger is required.');
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
    for (let p of passengers) {
      if (!p.name || !p.age || !p.mobile || !p.email) {
        alert('Please complete all passenger fields (Name, Age, Gender, Berth Preference, Mobile No, and Email ID).');
        return;
      }
    }

    navigate('/review-payment', {
      state: {
        train,
        travelClass,
        quota,
        journeyDate,
        passengers
      }
    });
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '880px' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-900)' }}>
          Passenger Details & Sub-PNR Allocation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Enter passenger information. Each traveler will be assigned an individual Sub-PNR for contactless digital boarding.
        </p>
      </div>

      {/* Train summary header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2d59 0%, #1565c0 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '0.6rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Train size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, background: 'rgba(255, 255, 255, 0.2)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                {train.number}
              </span>
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem', margin: 0 }}>
                {train.name}
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#90caf9', display: 'block', marginTop: '0.2rem' }}>
              {journeyDate} • {train.fromStation || 'MAS'} → {train.toStation || 'SBC'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
            Class: {travelClass}
          </span>
          <span style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
            Quota: {quota}
          </span>
        </div>
      </div>

      {/* Sub-PNR Info Callout */}
      <div style={{
        background: 'var(--primary-50)',
        border: '1.5px solid var(--primary-200)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <Info size={22} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--primary-900)', fontSize: '0.9rem', display: 'block' }}>
            Dual-Tier Sub-PNR Assignment:
          </strong>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0.5rem' }}>
            Each passenger receives an individual Sub-PNR (e.g. <code>PA01 - Harshavardhan S</code>, <code>PA02 - Meenakshi S</code>) under the Main Booking PNR.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {passengers.map((p, idx) => (
              <span
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--primary-300)',
                  borderRadius: '6px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--primary-800)',
                  fontFamily: 'JetBrains Mono'
                }}
              >
                PA0{idx + 1} – {p.name || `Passenger ${idx + 1}`}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Passenger Input Cards */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          {passengers.map((passenger, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1.5px solid var(--border-light)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', margin: 0 }}>
                      Passenger {index + 1} Details
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                      Sub-PNR: PA0{index + 1}
                    </span>
                  </div>
                </div>

                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePassenger(index)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--danger-red)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                )}
              </div>

              {/* Form Fields: Name, Age, Gender, Berth Preference, Mobile No, Gmail */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {/* 1. Name */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Passenger Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    placeholder="e.g. Harshavardhan S"
                    required
                  />
                </div>

                {/* 2. Age */}
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    className="form-input"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    placeholder="e.g. 22"
                    required
                  />
                </div>

                {/* 3. Gender */}
                <div className="form-group">
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

                {/* 4. Berth Preference */}
                <div className="form-group">
                  <label className="form-label">Berth Preference</label>
                  <select
                    className="form-select"
                    value={passenger.berthPreference}
                    onChange={(e) => handlePassengerChange(index, 'berthPreference', e.target.value)}
                  >
                    <option value="Window">Window Seat</option>
                    <option value="Aisle">Aisle Seat</option>
                    <option value="Lower">Lower Berth</option>
                    <option value="Middle">Middle Berth</option>
                    <option value="Upper">Upper Berth</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                  </select>
                </div>

                {/* 5. Mobile Number */}
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={passenger.mobile}
                    onChange={(e) => handlePassengerChange(index, 'mobile', e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                {/* 6. Gmail / Email */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Gmail / Email ID</label>
                  <input
                    type="email"
                    className="form-input"
                    value={passenger.email}
                    onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                    placeholder="e.g. harshavardhan@gmail.com"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <button
            type="button"
            onClick={handleAddPassenger}
            className="btn btn-outline"
          >
            <Plus size={16} />
            Add Another Passenger (e.g. Meenakshi S)
          </button>

          <button type="submit" className="btn btn-primary btn-lg">
            <span>Proceed to Review & Payment</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PassengerDetailsPage;
