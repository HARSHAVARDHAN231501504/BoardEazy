import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BoardEazyProvider } from './context/BoardEazyContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Passenger Pages
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import PassengerDashboard from './pages/PassengerDashboard';
import BookTicketPage from './pages/BookTicketPage';
import PassengerDetailsPage from './pages/PassengerDetailsPage';
import ReviewPaymentPage from './pages/ReviewPaymentPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BoardingPlatformPage from './pages/BoardingPlatformPage';
import PNRStatusPage from './pages/PNRStatusPage';
import ProfilePage from './pages/ProfilePage';
import StationGateScannerPage from './pages/StationGateScannerPage';

// Separate TTE & Admin Portals
import TTELoginPage from './pages/TTELoginPage';
import TTEDashboardPage from './pages/TTEDashboardPage';
import AISeatAllocationPage from './pages/AISeatAllocationPage';
import TrainGateBiometricPage from './pages/TrainGateBiometricPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <BoardEazyProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Main Navigation Header (Demo Quick Switcher Removed) */}
          <Navbar />

          {/* Router Outlet */}
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Passenger Portal Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/setup-profile" element={<ProfileSetupPage />} />
              <Route path="/dashboard" element={<PassengerDashboard />} />
              <Route path="/book" element={<BookTicketPage />} />
              <Route path="/passenger-details" element={<PassengerDetailsPage />} />
              <Route path="/review-payment" element={<ReviewPaymentPage />} />
              <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/boarding" element={<BoardingPlatformPage />} />
              <Route path="/pnr-status" element={<PNRStatusPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/station-gate" element={<StationGateScannerPage />} />

              {/* Separate TTE Railway Staff Portal Routes */}
              <Route path="/tte" element={<Navigate to="/tte/login" replace />} />
              <Route path="/tte/login" element={<TTELoginPage />} />
              <Route path="/tte/dashboard" element={<TTEDashboardPage />} />
              <Route path="/tte/ai-allocation" element={<AISeatAllocationPage />} />
              <Route path="/tte/train-gate" element={<TrainGateBiometricPage />} />

              {/* Divisional Admin Route */}
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          {/* System Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </BoardEazyProvider>
  );
}

export default App;
