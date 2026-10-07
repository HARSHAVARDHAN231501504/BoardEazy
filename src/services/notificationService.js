/**
 * BoardEazy Notification Service
 * ================================
 * All SMS API calls go through this module.
 * React components and context NEVER call the backend directly.
 *
 * Backend base URL reads from Vite env (VITE_API_URL) so it works
 * in both dev (localhost:8000) and any future deployed environment.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Internal helper — POST JSON to the backend, return parsed response.
 * Errors are caught and returned as { success: false, error } so callers
 * never crash the UI on a failed SMS.
 */
async function post(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || 'Unknown error' };
    }
    return { success: true, ...data };
  } catch (err) {
    // Network error or backend down — log and fail silently so the UI keeps working
    console.error(`[NotificationService] ${path} failed:`, err.message);
    return { success: false, error: err.message };
  }
}

// ---------------------------------------------------------------------------
// Booking confirmation — called after payment completes
// ---------------------------------------------------------------------------
export async function sendBookingConfirmationSMS({
  pnr,
  trainName,
  trainNumber,
  journeyDate,
  fromStation,
  toStation,
  passengers,   // array of { name, subPnr, mobile, coach, seat }
  totalFare,
}) {
  return post('/api/notifications/booking-confirmed', {
    pnr,
    trainName,
    trainNumber,
    journeyDate,
    fromStation,
    toStation,
    passengers,
    totalFare,
  });
}

// ---------------------------------------------------------------------------
// Station entry — called after QR scan at gate
// ---------------------------------------------------------------------------
export async function sendStationEntrySMS({
  name,
  subPnr,
  mobile,
  coach,
  seat,
  gateId,
  scanTime,
}) {
  return post('/api/notifications/station-entry', {
    name,
    subPnr,
    mobile,
    coach,
    seat,
    gateId,
    scanTime,
  });
}

// ---------------------------------------------------------------------------
// Boarded — called after biometric verification at coach door
// ---------------------------------------------------------------------------
export async function sendBoardedSMS({
  name,
  subPnr,
  mobile,
  coach,
  seat,
  trainName,
  scanTime,
}) {
  return post('/api/notifications/boarded', {
    name,
    subPnr,
    mobile,
    coach,
    seat,
    trainName,
    scanTime,
  });
}

// ---------------------------------------------------------------------------
// RAC upgrade — called after AI allocates a confirmed berth
// ---------------------------------------------------------------------------
export async function sendRacUpgradeSMS({
  name,
  racId,
  mobile,
  coach,
  seat,
  trainName,
}) {
  return post('/api/notifications/rac-upgrade', {
    name,
    racId,
    mobile,
    coach,
    seat,
    trainName,
  });
}
