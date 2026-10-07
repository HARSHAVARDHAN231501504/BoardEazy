import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { sendRacUpgradeSMS } from '../services/notificationService';
import {
  INITIAL_STATIONS,
  INITIAL_TRAINS,
  INITIAL_RAC_QUEUE,
  INITIAL_COACH_PASSENGERS,
  DEMO_USERS,
  DATA_SOURCE_CONFIG,
  findTrainsBetweenStations
} from '../data/mockData';
import { normalizeMobile, generateCoachSeats } from '../data/seatLayoutEngine';

const BoardEazyContext = createContext();

export const BoardEazyProvider = ({ children }) => {
  // 1. Current Authenticated User (with normalized mobile)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('boardeazy_user_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.phone && !parsed.normalizedMobile) {
          parsed.normalizedMobile = normalizeMobile(parsed.phone);
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return DEMO_USERS.passenger;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('boardeazy_user_v3') || true;
  });

  // 2. Master Bookings Storage
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('boardeazy_bookings_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // 3. Dynamic Coach Occupants Map: { "20607_C2": [ ...passengers ] }
  const [coachOccupantsMap, setCoachOccupantsMap] = useState(() => {
    const saved = localStorage.getItem('boardeazy_coach_map_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { '20607_C2': INITIAL_COACH_PASSENGERS };
      }
    }
    return {
      '20607_C2': INITIAL_COACH_PASSENGERS
    };
  });

  // 4. RAC Queue
  const [racQueue, setRacQueue] = useState(() => {
    const saved = localStorage.getItem('boardeazy_rac_queue_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RAC_QUEUE;
      }
    }
    return INITIAL_RAC_QUEUE;
  });

  // 5. Active TTE Selections
  const [activeTrainNumber, setActiveTrainNumber] = useState('20607');
  const [selectedCoach, setSelectedCoach] = useState('C2');

  // 6. AI Allocation Audit Logs
  const [aiAllocationLogs, setAiAllocationLogs] = useState(() => {
    const saved = localStorage.getItem('boardeazy_ai_logs_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'LOG-101',
        timestamp: '05:35 AM, 25 Sep 2026',
        event: 'AI Berth Allocation Engine Initialized',
        train: '20607 Vande Bharat Express',
        coach: 'C2',
        seat: 'Coach C2 Matrix',
        rule: 'BoardEazy Autonomous Logistics Monitor',
        details: 'System monitoring 78 berths under MAS-SBC-MYS corridor with sub-second telemetry.',
        type: 'SYSTEM'
      },
      {
        id: 'LOG-102',
        timestamp: '05:45 AM, 25 Sep 2026',
        event: 'Station Gate Biometric Batch Sync',
        train: '20607 Vande Bharat Express',
        coach: 'C2',
        seat: 'Gate Reader MAS-N1',
        rule: 'Station Perimeter Validation',
        details: '20 passengers verified at MAS North Turnstile Automatic Gates.',
        type: 'STATION_GATE'
      }
    ];
  });

  // 7. System Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'N1',
      title: 'Digital Boarding Gate Ready',
      message: 'Automated biometric gates open for MAS-SBC Train 20607.',
      time: '5m ago',
      read: false
    }
  ]);

  // Persist State Changes to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('boardeazy_user_v3', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('boardeazy_user_v3');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('boardeazy_bookings_v3', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('boardeazy_coach_map_v3', JSON.stringify(coachOccupantsMap));
  }, [coachOccupantsMap]);

  useEffect(() => {
    localStorage.setItem('boardeazy_rac_queue_v3', JSON.stringify(racQueue));
  }, [racQueue]);

  useEffect(() => {
    localStorage.setItem('boardeazy_ai_logs_v3', JSON.stringify(aiAllocationLogs));
  }, [aiAllocationLogs]);

  // Auth Functions
  const registerUser = (profileData) => {
    const normMobile = normalizeMobile(profileData.phone || '+91 98765 43210');
    const newUser = {
      name: profileData.name || 'Harshavardhan S',
      email: profileData.email || 'harshavardhan@gmail.com',
      phone: profileData.phone || '+91 98765 43210',
      normalizedMobile: normMobile,
      pin: profileData.pin || '1234',
      role: 'passenger',
      biometricRegistered: true,
      googleConnected: true,
      firstTimeSetupDone: true
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const loginWithCredentials = (identifier, pin) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanNorm = normalizeMobile(identifier);

    // TTE Check
    if ((cleanId === DEMO_USERS.tte.email || cleanNorm === normalizeMobile(DEMO_USERS.tte.phone)) && pin === DEMO_USERS.tte.pin) {
      setCurrentUser(DEMO_USERS.tte);
      setIsAuthenticated(true);
      return { success: true, role: 'tte' };
    }

    // Admin Check
    if ((cleanId === DEMO_USERS.admin.email || cleanNorm === normalizeMobile(DEMO_USERS.admin.phone)) && pin === DEMO_USERS.admin.pin) {
      setCurrentUser(DEMO_USERS.admin);
      setIsAuthenticated(true);
      return { success: true, role: 'admin' };
    }

    // Meenakshi Demo Account Check
    if ((cleanId === DEMO_USERS.meenakshi.email || cleanNorm === normalizeMobile(DEMO_USERS.meenakshi.phone)) && (pin === DEMO_USERS.meenakshi.pin || pin === '1234')) {
      setCurrentUser(DEMO_USERS.meenakshi);
      setIsAuthenticated(true);
      return { success: true, role: 'passenger' };
    }

    // Check Current or Custom registered user
    if (currentUser && (currentUser.email.toLowerCase() === cleanId || currentUser.normalizedMobile === cleanNorm) && currentUser.pin === pin) {
      setIsAuthenticated(true);
      return { success: true, role: currentUser.role || 'passenger' };
    }

    // Fallback Passenger Login
    if (pin === '1234' || cleanId.includes('@') || cleanNorm.length >= 10) {
      const user = {
        name: cleanId.includes('@') ? cleanId.split('@')[0] : 'Passenger User',
        email: cleanId.includes('@') ? cleanId : `${cleanNorm}@boardeazy.user`,
        phone: cleanNorm ? `+91 ${cleanNorm}` : '+91 98765 43210',
        normalizedMobile: cleanNorm || '9876543210',
        pin: pin || '1234',
        role: 'passenger',
        biometricRegistered: true,
        googleConnected: true
      };
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, role: 'passenger' };
    }

    return { success: false, message: 'Invalid Credentials. Use 4-digit PIN: 1234 (Passenger), 5678 (TTE), 9999 (Admin).' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('boardeazy_user_v3');
  };

  /**
   * Helper to retrieve coach layout & seats dynamically
   */
  const getCoachSeatsData = (trainNumber, coachNumber) => {
    const train = INITIAL_TRAINS.find(t => t.number === trainNumber) || INITIAL_TRAINS[0];
    const coachDef = train.coaches?.find(c => c.coachNumber === coachNumber) || {
      coachNumber: coachNumber || 'C2',
      coachType: 'CC',
      classCode: 'CC',
      capacity: 78,
      layoutType: 'CHAIR_CAR'
    };

    const key = `${trainNumber}_${coachDef.coachNumber}`;
    const occupants = coachOccupantsMap[key] || [];

    return generateCoachSeats(coachDef.coachNumber, coachDef.layoutType, coachDef.capacity, occupants);
  };

  /**
   * Create New Booking with Individual Sub-PNRs, Normalized Mobiles & Exact Seat Allocations
   */
  const createBooking = (train, passengersList, travelClass, quota = 'General', coachSelection = null, specificSeats = []) => {
    const randomPnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const trainNum = train.number || '20607';

    // Determine target coach from train composition matching travelClass
    const validCoaches = train.coaches?.filter(c => c.classCode === travelClass) || [];
    const assignedCoach = coachSelection || (validCoaches.length > 0 ? validCoaches[0].coachNumber : 'C2');
    const coachDef = train.coaches?.find(c => c.coachNumber === assignedCoach) || {
      coachNumber: assignedCoach,
      coachType: travelClass,
      classCode: travelClass,
      capacity: 78,
      layoutType: 'CHAIR_CAR'
    };

    // Find currently occupied seats in this coach
    const coachKey = `${trainNum}_${assignedCoach}`;
    const existingOccupants = coachOccupantsMap[coachKey] || [];
    const occupiedSeatNumbers = new Set(existingOccupants.map(o => parseInt(o.seat, 10)));

    let nextAvailableSeat = 21; // Starting index for realistic allocation

    const subPassengers = passengersList.map((p, index) => {
      const subPnr = `PA0${index + 1}`;
      const passengerNormMobile = normalizeMobile(p.mobile || currentUser?.phone || '9876543210');

      // Check if specific seat was picked, else assign next free seat
      let assignedSeatNum = null;
      if (specificSeats[index]) {
        assignedSeatNum = parseInt(specificSeats[index], 10);
      } else {
        while (occupiedSeatNumbers.has(nextAvailableSeat) && nextAvailableSeat <= coachDef.capacity) {
          nextAvailableSeat++;
        }
        assignedSeatNum = nextAvailableSeat <= coachDef.capacity ? nextAvailableSeat : (index + 1);
        occupiedSeatNumbers.add(assignedSeatNum);
        nextAvailableSeat++;
      }

      const berthName = p.berthPreference || (coachDef.layoutType === 'CHAIR_CAR' ? (assignedSeatNum % 5 === 1 || assignedSeatNum % 5 === 0 ? 'Window' : 'Aisle') : 'Lower Berth');

      return {
        subPnr,
        name: p.name || `Passenger ${index + 1}`,
        age: p.age || 25,
        gender: p.gender || 'Male',
        berthType: berthName,
        coach: assignedCoach,
        seat: assignedSeatNum,
        classCode: travelClass,
        mobile: p.mobile || currentUser?.phone || '+91 98765 43210',
        normalizedMobile: passengerNormMobile,
        email: p.email || currentUser?.email || 'passenger@boardeazy.com',
        bookingStatus: 'CONFIRMED',
        boardingStatus: 'PENDING',
        biometricRegistered: true,
        stationScanTime: null,
        trainScanTime: null
      };
    });

    // Compute fare breakdown
    const baseFarePerPassenger = train.classes?.find(c => c.code === travelClass)?.fare || 995;
    const totalBase = baseFarePerPassenger * subPassengers.length;
    const resCharges = 40 * subPassengers.length;
    const sfCharges = 45 * subPassengers.length;
    const gst = Math.round((totalBase + resCharges + sfCharges) * 0.05);

    const bookerNormMobile = normalizeMobile(currentUser?.phone || '9876543210');

    const newBooking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      mainPnr: randomPnr,
      trainNumber: trainNum,
      trainName: train.name,
      trainType: train.type || 'Superfast',
      journeyDate: '25 September 2026',
      departureTime: train.departure || '05:50 AM',
      arrivalTime: train.arrival || '10:20 AM',
      fromStation: `${train.fromStationName || train.fromStation || 'Chennai Central'} (${train.fromStationCode || train.from || 'MAS'})`,
      toStation: `${train.toStationName || train.toStation || 'Bengaluru KSR'} (${train.toStationCode || train.to || 'SBC'})`,
      fromCode: train.fromStationCode || train.from || 'MAS',
      toCode: train.toStationCode || train.to || 'SBC',
      quota,
      travelClass,
      bookingDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bookedBy: {
        name: currentUser?.name || 'Harshavardhan S',
        email: currentUser?.email || 'harshavardhan@gmail.com',
        phone: currentUser?.phone || '+91 98765 43210',
        normalizedMobile: bookerNormMobile,
        userId: currentUser?.email || 'harshavardhan@gmail.com'
      },
      fareSummary: {
        baseFare: totalBase,
        reservationCharges: resCharges,
        superfastCharges: sfCharges,
        gst,
        total: totalBase + resCharges + sfCharges + gst
      },
      passengers: subPassengers
    };

    // Update master bookings
    setBookings(prev => [newBooking, ...prev]);

    // Update Coach Occupancy State
    const newOccupantsForCoach = subPassengers.map(sp => ({
      seat: sp.seat,
      subPnr: sp.subPnr,
      name: sp.name,
      status: 'PENDING',
      mainPnr: randomPnr,
      mobile: sp.mobile,
      normalizedMobile: sp.normalizedMobile,
      time: null
    }));

    setCoachOccupantsMap(prev => {
      const existing = prev[coachKey] || [];
      // Remove any duplicate seats and prepend new
      const filtered = existing.filter(e => !newOccupantsForCoach.some(n => n.seat === e.seat));
      return {
        ...prev,
        [coachKey]: [...newOccupantsForCoach, ...filtered]
      };
    });

    return newBooking;
  };

  /**
   * Find passenger by Main PNR + Sub-PNR
   */
  const findPassengerByPnrs = (mainPnr, subPnr) => {
    if (!mainPnr) return null;
    const cleanMain = mainPnr.trim();
    const cleanSub = (subPnr || '').trim().toUpperCase();

    for (const b of bookings) {
      if (b.mainPnr === cleanMain) {
        if (!cleanSub) {
          return { booking: b, passenger: b.passengers[0] };
        }
        const p = b.passengers.find(item => item.subPnr.toUpperCase() === cleanSub);
        if (p) {
          return { booking: b, passenger: p };
        }
      }
    }
    return null;
  };

  /**
   * Update passenger boarding status (Station gate or Train door biometric)
   */
  const updatePassengerStatus = (mainPnr, subPnr, newStatus, timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) => {
    // 1. Update in Bookings Master
    setBookings(prev =>
      prev.map(b => {
        if (b.mainPnr === mainPnr) {
          return {
            ...b,
            passengers: b.passengers.map(p => {
              if (p.subPnr.toUpperCase() === subPnr.toUpperCase()) {
                return {
                  ...p,
                  boardingStatus: newStatus,
                  ...(newStatus === 'STATION_ENTERED' ? { stationScanTime: timestamp } : {}),
                  ...(newStatus === 'BOARDED' ? { trainScanTime: timestamp } : {})
                };
              }
              return p;
            })
          };
        }
        return b;
      })
    );

    // 2. Update in coachOccupantsMap
    setCoachOccupantsMap(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key] = updated[key].map(cp => {
          if (cp.mainPnr === mainPnr && cp.subPnr && cp.subPnr.toUpperCase() === subPnr.toUpperCase()) {
            return {
              ...cp,
              status: newStatus,
              time: timestamp
            };
          }
          return cp;
        });
      });
      return updated;
    });

    // 3. Add system audit log
    const eventName =
      newStatus === 'STATION_ENTERED'
        ? 'Station Entry Verified (QR Turnstile)'
        : newStatus === 'BOARDED'
        ? 'Coach Boarding Completed (Biometric Verification)'
        : `Status Transition: ${newStatus}`;

    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: `${timestamp}, 25 Sep 2026`,
      event: eventName,
      train: '20607 Vande Bharat Express',
      coach: 'C2',
      seat: `Sub-PNR ${subPnr}`,
      rule: 'BoardEazy Smart Verification Gate',
      details: `Passenger Sub-PNR ${subPnr} (Main PNR: ${mainPnr}) transitioned to status: ${newStatus}.`,
      type: newStatus === 'BOARDED' ? 'TRAIN_BOARDED' : 'STATION_GATE'
    };

    setAiAllocationLogs(prev => [newLog, ...prev]);
  };

  /**
   * CORE LOGIC: "Next Station + 15 km" No-Show Trigger & Autonomous RAC Allocation
   * (BoardEazy Prototype Operational Rule)
   */
  const simulateNextStation15Km = (targetSeat = 38, trainNum = '20607', coachNum = 'C2') => {
    const coachKey = `${trainNum}_${coachNum}`;
    const currentOccupants = coachOccupantsMap[coachKey] || [];
    const currentOccupant = currentOccupants.find(cp => cp.seat === targetSeat);

    // Find top eligible RAC passenger
    const topRac = racQueue.find(r => r.status === 'RAC_WAITING');
    if (!topRac) {
      alert('No eligible RAC passengers found in the priority queue.');
      return { success: false, message: 'RAC queue empty' };
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step 1: Update coach occupants
    setCoachOccupantsMap(prev => {
      const existing = prev[coachKey] || [];
      const updated = existing.map(cp => {
        if (cp.seat === targetSeat) {
          return {
            ...cp,
            status: 'AUTO_ALLOCATED',
            previousOccupant: cp.name,
            subPnr: topRac.subPnr,
            name: `${topRac.name} (${topRac.racId})`,
            mobile: topRac.mobile,
            normalizedMobile: topRac.normalizedMobile,
            time: timestamp,
            isRacReallocation: true
          };
        }
        return cp;
      });

      // If seat wasn't previously in list, add it
      if (!existing.some(cp => cp.seat === targetSeat)) {
        updated.push({
          seat: targetSeat,
          status: 'AUTO_ALLOCATED',
          previousOccupant: 'Unboarded Passenger',
          subPnr: topRac.subPnr,
          name: `${topRac.name} (${topRac.racId})`,
          mobile: topRac.mobile,
          normalizedMobile: topRac.normalizedMobile,
          time: timestamp,
          isRacReallocation: true
        });
      }

      return {
        ...prev,
        [coachKey]: updated
      };
    });

    // Step 2: Update RAC queue state
    setRacQueue(prev =>
      prev.map(r => {
        if (r.racId === topRac.racId) {
          return {
            ...r,
            status: 'AUTO_ALLOCATED',
            allocatedSeat: `${coachNum} - Seat ${targetSeat}`,
            allocationTime: timestamp
          };
        }
        return r;
      })
    );

    // Step 3: Add detailed AI audit log
    const newLog = {
      id: `AI-ALLOC-${Date.now()}`,
      timestamp: `${timestamp}, 25 Sep 2026`,
      event: 'Autonomous Berth Re-allocation Triggered',
      train: `${trainNum} Express`,
      coach: coachNum,
      seat: `Seat ${targetSeat}`,
      rule: 'BoardEazy Prototype Rule: "Next Station + 15 km" No-Show Threshold',
      previousPassenger: currentOccupant ? currentOccupant.name : 'Unconfirmed Passenger',
      allocatedPassenger: `${topRac.name} (${topRac.racId})`,
      details: `Berth ${coachNum}-${targetSeat} declared vacant due to unverified boarding after 15.0 km threshold. AI Engine assigned berth to highest priority candidate ${topRac.racId} (Priority: ${topRac.priorityScore}%). Zero human discretion applied.`,
      type: 'AI_ALLOCATION'
    };

    setAiAllocationLogs(prev => [newLog, ...prev]);

    // Step 4: Dispatch push notification
    setNotifications(prev => [
      {
        id: `N-${Date.now()}`,
        title: '🤖 AI Berth Auto-Allocated',
        message: `Berth ${coachNum}-${targetSeat} allocated to ${topRac.name} (${topRac.racId}) under deterministic RAC priority rules.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    // Send RAC upgrade SMS (fire-and-forget)
    sendRacUpgradeSMS({
      name: topRac.name,
      racId: topRac.racId,
      mobile: topRac.mobile || '+919176591451', // fallback for demo data
      coach: 'C2',
      seat: targetSeat.toString(),
      trainName: '20607 Chennai – Mysuru Vande Bharat',
    }).then(result => {
      if (!result.success) {
        console.warn('[SMS] RAC upgrade SMS failed:', result.error);
      }
    });

    return {
      success: true,
      allocatedTo: topRac,
      vacatedSeat: targetSeat,
      coach: coachNum,
      train: trainNum,
      log: newLog
    };
  };

  /**
   * Computed: Filtered Bookings for the Current Logged-in User
   * Categorizes into:
   * 1. `myCreatedBookings` (Bookings created by logged-in user)
   * 2. `ticketsBookedForMe` (Tickets where logged-in user is listed as a passenger in another user's booking)
   */
  const userBookingsClassification = useMemo(() => {
    if (!currentUser) return { myCreatedBookings: [], ticketsBookedForMe: [] };

    const currentNormMobile = currentUser.normalizedMobile || normalizeMobile(currentUser.phone);
    const currentEmail = (currentUser.email || '').toLowerCase().trim();

    const myCreated = [];
    const bookedForMe = [];

    bookings.forEach(b => {
      const bookerNormMobile = b.bookedBy?.normalizedMobile || normalizeMobile(b.bookedBy?.phone);
      const bookerEmail = (b.bookedBy?.email || '').toLowerCase().trim();

      const isCreator = (bookerNormMobile && bookerNormMobile === currentNormMobile) || (bookerEmail && bookerEmail === currentEmail);

      if (isCreator) {
        myCreated.push(b);
      } else {
        // Check if current user is a passenger inside this booking
        const passengerMatch = b.passengers.find(p => {
          const pNorm = p.normalizedMobile || normalizeMobile(p.mobile);
          const pEmail = (p.email || '').toLowerCase().trim();
          return (pNorm && pNorm === currentNormMobile) || (pEmail && pEmail === currentEmail);
        });

        if (passengerMatch) {
          bookedForMe.push({
            ...b,
            myPassengerRecord: passengerMatch,
            bookedByUserName: b.bookedBy?.name || 'Another BoardEazy User'
          });
        }
      }
    });

    return {
      myCreatedBookings: myCreated,
      ticketsBookedForMe: bookedForMe
    };
  }, [bookings, currentUser]);

  // Backward compatibility alias for coach passengers of active selection
  const coachPassengers = useMemo(() => {
    const key = `${activeTrainNumber}_${selectedCoach}`;
    return coachOccupantsMap[key] || INITIAL_COACH_PASSENGERS;
  }, [coachOccupantsMap, activeTrainNumber, selectedCoach]);

  const clearAllData = () => {
    setBookings([]);
    setCoachOccupantsMap({ '20607_C2': INITIAL_COACH_PASSENGERS });
    localStorage.removeItem('boardeazy_bookings_v3');
    localStorage.removeItem('boardeazy_coach_map_v3');
  };

  return (
    <BoardEazyContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        userRole: currentUser?.role || 'passenger',
        dataSourceConfig: DATA_SOURCE_CONFIG,
        bookings,
        myCreatedBookings: userBookingsClassification.myCreatedBookings,
        ticketsBookedForMe: userBookingsClassification.ticketsBookedForMe,
        coachPassengers,
        coachOccupantsMap,
        racQueue,
        selectedCoach,
        setSelectedCoach,
        activeTrainNumber,
        setActiveTrainNumber,
        aiAllocationLogs,
        notifications,
        getCoachSeatsData,
        registerUser,
        loginWithCredentials,
        logout,
        createBooking,
        findPassengerByPnrs,
        updatePassengerStatus,
        simulateNextStation15Km,
        clearAllData
      }}
    >
      {children}
    </BoardEazyContext.Provider>
  );
};

export const useBoardEazy = () => useContext(BoardEazyContext);
