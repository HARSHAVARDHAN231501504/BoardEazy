/**
 * BoardEazy Seat Layout Engine
 * Generates realistic Indian Railways coach layouts based on class & coach configuration:
 * - CHAIR_CAR (CC): 78 seats, 3x2 seating arrangement with Window, Middle, Aisle
 * - EXEC_CHAIR_CAR (EC): 52 seats, 2x2 luxury seating with Window, Aisle
 * - SLEEPER_3A (3A & SL): 72 berths, 8-berth bays (Lower, Middle, Upper, Lower, Middle, Upper, Side Lower, Side Upper)
 * - AC_2_TIER (2A): 48/54 berths, 6-berth bays (Lower, Upper, Lower, Upper, Side Lower, Side Upper)
 * - FIRST_AC (1A): 24 berths, 4-berth cabins & 2-berth coupes
 * - SECOND_SITTING (2S): 108 seats, 3x3 seating arrangement
 */

// Mobile normalizer helper
export const normalizeMobile = (phone) => {
  if (!phone) return '';
  const digits = phone.toString().replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 10) {
    return digits;
  }
  return digits.length > 10 ? digits.slice(-10) : digits;
};

/**
 * Determine berth type for Sleeper / 3A (Standard 8-berth bay)
 */
export const get3ABerthType = (seatNumber) => {
  const mod = seatNumber % 8;
  switch (mod) {
    case 1:
    case 4:
      return 'Lower Berth';
    case 2:
    case 5:
      return 'Middle Berth';
    case 3:
    case 6:
      return 'Upper Berth';
    case 7:
      return 'Side Lower';
    case 0:
      return 'Side Upper';
    default:
      return 'Berth';
  }
};

/**
 * Determine berth type for 2A (Standard 6-berth bay)
 */
export const get2ABerthType = (seatNumber) => {
  const mod = seatNumber % 6;
  switch (mod) {
    case 1:
    case 3:
      return 'Lower Berth';
    case 2:
    case 4:
      return 'Upper Berth';
    case 5:
      return 'Side Lower';
    case 0:
      return 'Side Upper';
    default:
      return 'Berth';
  }
};

/**
 * Determine seat type for Chair Car (CC - 3x2)
 */
export const getCCSeatType = (seatNumber) => {
  const mod = seatNumber % 5;
  switch (mod) {
    case 1:
      return 'Window (Left)';
    case 2:
      return 'Middle (Left)';
    case 3:
      return 'Aisle (Left)';
    case 4:
      return 'Aisle (Right)';
    case 0:
      return 'Window (Right)';
    default:
      return 'Chair';
  }
};

/**
 * Determine seat type for Exec Chair Car (EC - 2x2)
 */
export const getECSeatType = (seatNumber) => {
  const mod = seatNumber % 4;
  switch (mod) {
    case 1:
      return 'Window (Left)';
    case 2:
      return 'Aisle (Left)';
    case 3:
      return 'Aisle (Right)';
    case 0:
      return 'Window (Right)';
    default:
      return 'Executive Chair';
  }
};

/**
 * Determine seat type for Second Sitting (2S - 3x3)
 */
export const get2SSeatType = (seatNumber) => {
  const mod = seatNumber % 6;
  switch (mod) {
    case 1:
      return 'Window (Left)';
    case 2:
      return 'Middle (Left)';
    case 3:
      return 'Aisle (Left)';
    case 4:
      return 'Aisle (Right)';
    case 5:
      return 'Middle (Right)';
    case 0:
      return 'Window (Right)';
    default:
      return 'Second Sitting';
  }
};

/**
 * Determine berth type for First AC (1A - Cabins & Coupes)
 */
export const get1ABerthType = (seatNumber) => {
  if (seatNumber <= 4) return 'Cabin A - ' + (seatNumber % 2 === 1 ? 'Lower' : 'Upper');
  if (seatNumber <= 6) return 'Coupe B - ' + (seatNumber % 2 === 1 ? 'Lower' : 'Upper');
  if (seatNumber <= 10) return 'Cabin C - ' + (seatNumber % 2 === 1 ? 'Lower' : 'Upper');
  if (seatNumber <= 12) return 'Coupe D - ' + (seatNumber % 2 === 1 ? 'Lower' : 'Upper');
  if (seatNumber <= 16) return 'Cabin E - ' + (seatNumber % 2 === 1 ? 'Lower' : 'Upper');
  if (seatNumber <= 18) return 'Coupe F - ' + (seatNumber % 2 === 1 ? 'Lower' : 'Upper');
  return 'Cabin G - ' + (seatNumber % 2 === 1 ? 'Lower' : 'Upper');
};

/**
 * Generate all seats for a given coach definition
 */
export const generateCoachSeats = (coachNumber, layoutType, capacity = 78, existingOccupants = []) => {
  const seats = [];

  for (let i = 1; i <= capacity; i++) {
    let berthType = 'Seat';
    let rowNumber = 1;
    let columnPos = 1;

    if (layoutType === 'CHAIR_CAR') {
      berthType = getCCSeatType(i);
      rowNumber = Math.ceil(i / 5);
      columnPos = (i - 1) % 5 + 1;
    } else if (layoutType === 'EXEC_CHAIR_CAR') {
      berthType = getECSeatType(i);
      rowNumber = Math.ceil(i / 4);
      columnPos = (i - 1) % 4 + 1;
    } else if (layoutType === 'SLEEPER_3A' || layoutType === 'SLEEPER') {
      berthType = get3ABerthType(i);
      rowNumber = Math.ceil(i / 8);
      columnPos = (i - 1) % 8 + 1;
    } else if (layoutType === 'AC_2_TIER') {
      berthType = get2ABerthType(i);
      rowNumber = Math.ceil(i / 6);
      columnPos = (i - 1) % 6 + 1;
    } else if (layoutType === 'FIRST_AC') {
      berthType = get1ABerthType(i);
      rowNumber = Math.ceil(i / 4);
      columnPos = (i - 1) % 4 + 1;
    } else if (layoutType === 'SECOND_SITTING') {
      berthType = get2SSeatType(i);
      rowNumber = Math.ceil(i / 6);
      columnPos = (i - 1) % 6 + 1;
    }

    // Match with existing occupants if provided
    const match = existingOccupants.find(p => p.seat === i || p.seat === i.toString());

    seats.push({
      seatNumber: i,
      coachNumber,
      layoutType,
      berthType,
      rowNumber,
      columnPos,
      status: match ? match.status : 'AVAILABLE',
      passenger: match || null
    });
  }

  return seats;
};
