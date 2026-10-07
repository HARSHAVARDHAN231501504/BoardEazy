import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBoardEazy } from '../context/BoardEazyContext';
import { sendBookingConfirmationSMS } from '../services/notificationService';
import {
  Train,
  CheckCircle2,
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  ArrowRight,
  Lock,
  RefreshCw,
  Sparkles,
  MapPin,
  Calendar,
  UserCheck,
  Phone
} from 'lucide-react';

export const ReviewPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking } = useBoardEazy();

  const stateData = location.state || {};
  const train = stateData.train || {
    number: '20607',
    name: 'Chennai – Mysuru Vande Bharat Express',
    fromStation: 'Chennai Central (MAS)',
    toStation: 'Bengaluru KSR (SBC)',
    fromStationCode: 'MAS',
    toStationCode: 'SBC',
    departure: '05:50 AM',
    arrival: '10:20 AM',
    classes: [{ code: 'CC', fare: 995 }]
  };

  const travelClass = stateData.travelClass || 'CC';
  const quota = stateData.quota || 'General';
  const journeyDate = stateData.journeyDate || '25 September 2026';
  const fromStation = stateData.fromStation || 'Chennai Central (MAS)';
  const toStation = stateData.toStation || 'Bengaluru KSR (SBC)';
  const selectedCoach = stateData.selectedCoach || 'C2';

  const passengers = stateData.passengers || [
    { name: 'Harshavardhan S', age: 22, gender: 'Male', berthPreference: 'Window', mobile: '+91 98765 43210', subPnrPreview: 'PA01' },
    { name: 'Meenakshi S', age: 21, gender: 'Female', berthPreference: 'Aisle', mobile: '+91 98765 00001', subPnrPreview: 'PA02' }
  ];

  const [paymentMode, setPaymentMode] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Compute Fare
  const baseFarePerPerson = train.classes?.find(c => c.code === travelClass)?.fare || 995;
  const totalBase = baseFarePerPerson * passengers.length;
  const resFee = 40 * passengers.length;
  const sfFee = 45 * passengers.length;
  const gst = Math.round((totalBase + resFee + sfFee) * 0.05);
  const grandTotal = totalBase + resFee + sfFee + gst;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create new booking in context - dynamic seat allocation occurs here upon confirmed booking
      const newBooking = createBooking(train, passengers, travelClass, quota, selectedCoach, []);

      setIsProcessing(false);

      // Send booking confirmation SMS to each passenger (fire-and-forget)
      sendBookingConfirmationSMS({
        pnr: newBooking.mainPnr,
        trainName: newBooking.trainName,
        trainNumber: newBooking.trainNumber,
        journeyDate: newBooking.journeyDate,
        fromStation: newBooking.fromStation,
        toStation: newBooking.toStation,
        passengers: newBooking.passengers.map(p => ({
          name: p.name,
          subPnr: p.subPnr,
          mobile: p.mobile,
          coach: p.coach,
          seat: p.seat,
        })),
        totalFare: newBooking.fareSummary.total,
      }).then(result => {
        if (!result.success) {
          console.warn('[SMS] Booking confirmation SMS failed:', result.error);
        }
      });

      navigate('/booking-confirmation', {
        state: { booking: newBooking }
      });
    }, 1200);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '840px' }}>
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
          STEP 3 OF 4: REVIEW & INSTANT SETTLEMENT
        </div>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-900)', margin: 0 }}>
          Review Booking & Payment
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Verify your journey details, assigned Sub-PNRs, and complete secure simulated checkout.
        </p>
      </div>

      {/* Journey & Train Review Card */}
      <div className="card" style={{
        padding: '1.5rem',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        border: '1.5px solid var(--border-light)',
        background: '#ffffff'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'var(--primary-50)',
              color: 'var(--primary-700)',
              padding: '0.5rem',
              borderRadius: '10px'
            }}>
              <Train size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: 0 }}>
                {train.number} – {train.name}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Class: <strong>{travelClass}</strong> • Quota: <strong>{quota}</strong> • Preferred Coach: <strong>{selectedCoach}</strong>
              </span>
            </div>
          </div>

          <div style={{
            background: 'var(--primary-25)',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--primary-800)',
            border: '1px solid var(--primary-100)'
          }}>
            {journeyDate}
          </div>
        </div>

        {/* Route Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          background: 'var(--primary-25)',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--primary-100)',
          marginBottom: '1.25rem'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Departure</span>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-900)' }}>{train.departure}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{fromStation}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Arrival</span>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-900)' }}>{train.arrival}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{toStation}</div>
          </div>
        </div>

        {/* Passengers Matrix with Sub-PNR and Allocation Notice */}
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
            Allocated Passengers & Sub-PNRs ({passengers.length})
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {passengers.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-900)', display: 'block' }}>
                    {p.name}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {p.age} yrs • {p.gender} • Pref: {p.berthPreference}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                    <Phone size={11} />
                    Linked: {p.mobile}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    color: 'var(--primary-700)',
                    display: 'block'
                  }}>
                    {p.subPnrPreview || `PA0${idx + 1}`}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--primary-700)',
                    background: 'var(--primary-50)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    border: '1px solid var(--primary-200)',
                    display: 'inline-block',
                    marginTop: '0.2rem'
                  }}>
                    Coach {selectedCoach} • Auto Seat
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fare Breakdown Card */}
      <div className="card" style={{
        padding: '1.5rem',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        border: '1.5px solid var(--border-light)',
        background: '#ffffff'
      }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
          Fare Breakdown Summary
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Base Fare ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''} × ₹{baseFarePerPerson}):</span>
            <span>₹{totalBase.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Reservation Charges:</span>
            <span>₹{resFee.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Superfast Surcharge:</span>
            <span>₹{sfFee.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Applicable GST (5%):</span>
            <span>₹{gst.toLocaleString()}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1.5px solid var(--border-light)',
            paddingTop: '0.75rem',
            marginTop: '0.5rem',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: 'var(--primary-900)'
          }}>
            <span>Total Payable Amount:</span>
            <span style={{ color: 'var(--primary-700)' }}>₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Simulated Payment Modes */}
      <div className="card" style={{
        padding: '1.5rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        border: '1.5px solid var(--border-light)',
        background: '#ffffff'
      }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Lock size={18} color="var(--success-green)" />
          Payment Mode (Simulated Checkout)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'upi', label: 'UPI / Dynamic QR', icon: QrCode },
            { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
            { id: 'netbanking', label: 'Net Banking', icon: Building }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = paymentMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => setPaymentMode(mode.id)}
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--primary-500)' : '1px solid var(--border-medium)',
                  background: isSelected ? 'var(--primary-50)' : '#ffffff',
                  padding: '1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={20} color={isSelected ? 'var(--primary-600)' : 'var(--text-muted)'} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isSelected ? 'var(--primary-900)' : 'var(--text-primary)' }}>
                  {mode.label}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handlePay}
          disabled={isProcessing}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', fontWeight: 800 }}
        >
          {isProcessing ? (
            <>
              <RefreshCw size={18} className="spin-animation" />
              Allocating Berths & Issuing E-Reservation Slip...
            </>
          ) : (
            <>
              Pay ₹{grandTotal.toLocaleString()} & Confirm Reservation
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewPaymentPage;
