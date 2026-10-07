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
  Sparkles
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
    departure: '05:50 AM',
    arrival: '10:20 AM',
    classes: [{ code: '3A', fare: 1250 }]
  };
  const travelClass = stateData.travelClass || '3A';
  const quota = stateData.quota || 'General';
  const journeyDate = stateData.journeyDate || '25 September 2026';
  const passengers = stateData.passengers || [
    { name: 'Harshavardhan S', age: 22, gender: 'Male', berthPreference: 'Window' },
    { name: 'Meenakshi S', age: 21, gender: 'Female', berthPreference: 'Aisle' }
  ];

  const [paymentMode, setPaymentMode] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Compute Fare
  const baseFarePerPerson = train.classes?.find(c => c.code === travelClass)?.fare || 1250;
  const totalBase = baseFarePerPerson * passengers.length;
  const resFee = 40 * passengers.length;
  const sfFee = 45 * passengers.length;
  const gst = Math.round((totalBase + resFee + sfFee) * 0.05);
  const grandTotal = totalBase + resFee + sfFee + gst;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Create new booking in context
      const newBooking = createBooking(train, passengers, travelClass, quota);

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

      setTimeout(() => {
        navigate('/booking-confirmation', {
          state: {
            booking: newBooking
          }
        });
      }, 1000);
    }, 1800);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '840px' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-900)' }}>
          Review Booking & Simulated Payment
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Verify your journey details and complete simulated payment to issue Main & Sub-PNRs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left Column: Journey Recap & Passenger List */}
        <div>
          {/* Train Recap Card */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <Train size={22} color="var(--primary-700)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: 0 }}>
                {train.number} – {train.name}
              </h3>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div><strong>Date:</strong> {journeyDate} (05:50 AM Dep)</div>
              <div><strong>Route:</strong> {train.fromStation || 'MAS'} → {train.toStation || 'SBC'}</div>
              <div><strong>Class & Quota:</strong> {travelClass} ({quota})</div>
            </div>
          </div>

          {/* Passenger Sub-PNR Table */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
              Assigned Passenger Sub-PNRs
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {passengers.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--primary-25)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--primary-100)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--primary-900)' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                      {p.age} yrs • {p.gender} • Berth: {p.berthPreference}
                    </span>
                  </div>

                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 800,
                    color: 'var(--primary-700)',
                    background: '#ffffff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--primary-200)',
                    fontSize: '0.8rem'
                  }}>
                    PA0{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fare Breakdown & Payment Options */}
        <div>
          {/* Fare Breakdown Card */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
              Fare Breakdown ({passengers.length} Traveler{passengers.length > 1 ? 's' : ''})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Base Ticket Fare ({passengers.length} × ₹{baseFarePerPerson}):</span>
                <span>₹{totalBase.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Reservation Fee:</span>
                <span>₹{resFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Superfast Supplementary Charge:</span>
                <span>₹{sfFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Applicable GST (5%):</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>

              <div style={{
                borderTop: '1.5px dashed var(--border-medium)',
                paddingTop: '0.75rem',
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--primary-800)'
              }}>
                <span>Total Amount:</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '0.875rem' }}>
              Select Payment Method (Simulated)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: paymentMode === 'upi' ? '2px solid var(--primary-500)' : '1px solid var(--border-medium)',
                background: paymentMode === 'upi' ? 'var(--primary-50)' : '#ffffff',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMode === 'upi'}
                  onChange={() => setPaymentMode('upi')}
                />
                <QrCode size={18} color="var(--primary-700)" />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-900)', display: 'block' }}>UPI Instant Pay (QR / VPA)</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPay, PhonePe, Paytm, BHIM</span>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: paymentMode === 'card' ? '2px solid var(--primary-500)' : '1px solid var(--border-medium)',
                background: paymentMode === 'card' ? 'var(--primary-50)' : '#ffffff',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMode === 'card'}
                  onChange={() => setPaymentMode('card')}
                />
                <CreditCard size={18} color="var(--primary-700)" />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-900)', display: 'block' }}>Credit / Debit Card</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa, MasterCard, RuPay</span>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: paymentMode === 'netbanking' ? '2px solid var(--primary-500)' : '1px solid var(--border-medium)',
                background: paymentMode === 'netbanking' ? 'var(--primary-50)' : '#ffffff',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMode === 'netbanking'}
                  onChange={() => setPaymentMode('netbanking')}
                />
                <Building size={18} color="var(--primary-700)" />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-900)', display: 'block' }}>Net Banking</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SBI, HDFC, ICICI, Axis Bank</span>
                </div>
              </label>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing || paymentSuccess}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Processing Payment...
                </>
              ) : paymentSuccess ? (
                <>
                  <CheckCircle2 size={18} />
                  Payment Successful!
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Pay ₹{grandTotal.toLocaleString()} & Book Ticket
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              🔒 <em>Payment gateway is simulated in this demo. No actual money will be charged.</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPaymentPage;
