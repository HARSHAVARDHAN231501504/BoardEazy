import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_STATIONS,
  INITIAL_TRAINS,
  INITIAL_BOOKINGS,
  INITIAL_RAC_QUEUE,
  INITIAL_COACH_PASSENGERS,
  DEMO_USERS
} from '../data/mockData';

const BoardEazyContext = createContext();

export const BoardEazyProvider = ({ children }) => {
  // Clear old stale mock data once if desired
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('boardeazy_user_v2');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('boardeazy_user_v2');
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('boardeazy_bookings_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [coachPassengers, setCoachPassengers] = useState(() => {
    const saved = localStorage.getItem('boardeazy_coach_passengers_v2');
    return saved ? JSON.parse(saved) : INITIAL_COACH_PASSENGERS;
  });

  const [racQueue, setRacQueue] = useState(() => {
    const saved = localStorage.getItem('boardeazy_rac_queue_v2');
    return saved ? JSON.parse(saved) : INITIAL_RAC_QUEUE;
  });

  const [selectedCoach, setSelectedCoach] = useState('C2');
  const [activeTrainNumber, setActiveTrainNumber] = useState('20607');

  const [aiAllocationLogs, setAiAllocationLogs] = useState(() => {
    const saved = localStorage.getItem('boardeazy_ai_logs_v2');
    return saved ? JSON.parse(saved) : [
      {
        id: 'LOG-101',
        timestamp: '05:35 AM, 25 Sep 2026',
        event: 'AI Berth Engine Initialized',
        train: '20607 Vande Bharat',
        coach: 'C2',
        details: 'System monitoring 52 berths under MAS-SBC sector.',
        type: 'SYSTEM'
      },
      {
        id: 'LOG-102',
        timestamp: '05:45 AM, 25 Sep 2026',
        event: 'Station Gate Batch Sync',
        train: '20607 Vande Bharat',
        coach: 'C2',
        details: '38 passengers verified at MAS Security Gate Reader.',
        type: 'STATION_GATE'
      }
    ];
  });

  const [notifications, setNotifications] = useState([
    {
      id: 'N1',
      title: 'Digital Boarding Open',
      message: 'Boarding verification is active for Train 20607 MAS-SBC.',
      time: '10m ago',
      read: false
    }
  ]);

  // Persist state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('boardeazy_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('boardeazy_user_v2');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('boardeazy_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('boardeazy_coach_passengers_v2', JSON.stringify(coachPassengers));
  }, [coachPassengers]);

  useEffect(() => {
    localStorage.setItem('boardeazy_rac_queue_v2', JSON.stringify(racQueue));
  }, [racQueue]);

  useEffect(() => {
    localStorage.setItem('boardeazy_ai_logs_v2', JSON.stringify(aiAllocationLogs));
  }, [aiAllocationLogs]);

  // Auth methods
  const registerUser = (profileData) => {
    const newUser = {
      name: profileData.name || 'Harshavardhan S',
      email: profileData.email || 'harshavardhan@gmail.com',
      phone: profileData.phone || '+91 98765 43210',
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

  const loginWithCredentials = (email, pin) => {
    // Check TTE
    if (email === DEMO_USERS.tte.email && pin === DEMO_USERS.tte.pin) {
      setCurrentUser(DEMO_USERS.tte);
      setIsAuthenticated(true);
      return { success: true, role: 'tte' };
    }
    // Check Admin
    if (email === DEMO_USERS.admin.email && pin === DEMO_USERS.admin.pin) {
      setCurrentUser(DEMO_USERS.admin);
      setIsAuthenticated(true);
      return { success: true, role: 'admin' };
    }
    // Check registered passenger or fallback
    if (currentUser && currentUser.email === email && currentUser.pin === pin) {
      setIsAuthenticated(true);
      return { success: true, role: 'passenger' };
    }
    if (pin === '1234' || email.includes('gmail.com') || email === 'passenger@demo.com') {
      const user = {
        name: email.split('@')[0],
        email,
        phone: '+91 98765 43210',
        pin: pin || '1234',
        role: 'passenger',
        biometricRegistered: true,
        googleConnected: true
      };
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, role: 'passenger' };
    }
    return { success: false, message: 'Invalid Email or 4-digit PIN' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('boardeazy_user_v2');
  };

  // Booking creation
  const createBooking = (train, passengersList, travelClass, quota = 'General') => {
    const randomPnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const subPassengers = passengersList.map((p, index) => ({
      subPnr: `PA0${index + 1}`,
      name: p.name || `Passenger ${index + 1}`,
      age: p.age || 22,
      gender: p.gender || 'Male',
      berthType: p.berthPreference || 'Window',
      coach: 'C2',
      seat: (35 + index + 1).toString(),
      mobile: p.mobile || currentUser?.phone || '+91 98765 43210',
      email: p.email || currentUser?.email || 'harshavardhan@gmail.com',
      bookingStatus: 'CONFIRMED',
      boardingStatus: 'PENDING',
      biometricRegistered: true,
      stationScanTime: null,
      trainScanTime: null
    }));

    const baseFarePerPassenger = train.classes.find(c => c.code === travelClass)?.fare || 1250;
    const totalBase = baseFarePerPassenger * subPassengers.length;
    const resCharges = 40 * subPassengers.length;
    const sfCharges = 45 * subPassengers.length;
    const gst = Math.round((totalBase + resCharges + sfCharges) * 0.05);

    const newBooking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      mainPnr: randomPnr,
      trainNumber: train.number,
      trainName: train.name,
      journeyDate: '25 September 2026',
      departureTime: train.departure,
      arrivalTime: train.arrival,
      fromStation: `${train.fromStation || 'Chennai Central'} (${train.from || 'MAS'})`,
      toStation: `${train.toStation || 'Bengaluru KSR'} (${train.to || 'SBC'})`,
      quota,
      travelClass,
      bookingDate: '21 Sep 2026, 09:00 AM',
      fareSummary: {
        baseFare: totalBase,
        reservationCharges: resCharges,
        superfastCharges: sfCharges,
        gst,
        total: totalBase + resCharges + sfCharges + gst
      },
      passengers: subPassengers
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update coach seats with new booked passengers
    setCoachPassengers(prev =>
      prev.map(cp => {
        const found = subPassengers.find(sp => sp.seat == cp.seat);
        if (found) {
          return {
            ...cp,
            name: found.name,
            subPnr: found.subPnr,
            status: 'PENDING',
            mainPnr: randomPnr,
            time: null
          };
        }
        return cp;
      })
    );

    return newBooking;
  };

  // Find passenger by PNR & Sub-PNR
  const findPassengerByPnrs = (mainPnr, subPnr) => {
    if (!mainPnr || !subPnr) return null;
    const cleanMain = mainPnr.trim();
    const cleanSub = subPnr.trim().toUpperCase();

    for (const b of bookings) {
      if (b.mainPnr === cleanMain) {
        const p = b.passengers.find(item => item.subPnr.toUpperCase() === cleanSub);
        if (p) {
          return { booking: b, passenger: p };
        }
      }
    }
    return null;
  };

  // Update passenger status (Station gate or Train door biometric)
  const updatePassengerStatus = (mainPnr, subPnr, newStatus, timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) => {
    // 1. Update in bookings state
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

    // 2. Update in coachPassengers seat map
    setCoachPassengers(prev =>
      prev.map(cp => {
        if (cp.subPnr && cp.subPnr.toUpperCase() === subPnr.toUpperCase()) {
          return {
            ...cp,
            status: newStatus,
            time: timestamp
          };
        }
        return cp;
      })
    );

    // 3. Add system log
    const eventName =
      newStatus === 'STATION_ENTERED'
        ? 'Station Entry Verified (QR Scan)'
        : newStatus === 'BOARDED'
        ? 'Coach Boarding Completed (Biometric Match)'
        : `Status Updated: ${newStatus}`;

    setAiAllocationLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: `${timestamp}, 25 Sep 2026`,
        event: eventName,
        train: '20607 Vande Bharat',
        coach: 'C2',
        details: `Passenger Sub-PNR ${subPnr} (Main: ${mainPnr}) transitioned to ${newStatus}.`,
        type: newStatus === 'BOARDED' ? 'TRAIN_BOARDED' : 'STATION_GATE'
      },
      ...prev
    ]);
  };

  // CORE LOGIC: "Next Station + 15 km" No-Show condition & AI RAC allocation
  const simulateNextStation15Km = (targetSeat = 38) => {
    const currentOccupant = coachPassengers.find(cp => cp.seat === targetSeat);
    
    // Check eligible top RAC candidate
    const topRac = racQueue.find(r => r.status === 'RAC_WAITING');
    if (!topRac) {
      alert('No eligible RAC passengers found in the priority queue.');
      return { success: false, message: 'RAC queue empty' };
    }

    const timestamp = '06:22 AM';

    // Step 1: Mark target seat occupant as AUTO_ALLOCATED to RAC
    setCoachPassengers(prev =>
      prev.map(cp => {
        if (cp.seat === targetSeat) {
          return {
            ...cp,
            status: 'AUTO_ALLOCATED',
            previousOccupant: cp.name,
            subPnr: topRac.subPnr,
            name: `${topRac.name} (${topRac.racId})`,
            time: timestamp,
            isRacReallocation: true
          };
        }
        return cp;
      })
    );

    // Step 2: Update RAC queue
    setRacQueue(prev =>
      prev.map(r => {
        if (r.racId === topRac.racId) {
          return {
            ...r,
            status: 'AUTO_ALLOCATED',
            allocatedSeat: `C2 - Seat ${targetSeat}`,
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
      train: '20607 Vande Bharat',
      coach: 'C2',
      seat: `Seat ${targetSeat}`,
      rule: 'Next Station (MAS) + 15 KM No-Show Threshold',
      previousPassenger: currentOccupant ? currentOccupant.name : 'Unconfirmed Passenger',
      allocatedPassenger: `${topRac.name} (${topRac.racId})`,
      details: `Berth C2-${targetSeat} released due to unverified boarding. AI Engine ranked ${topRac.racId} (Priority: ${topRac.priorityScore}%) as top eligible candidate. Berth automatically assigned.`,
      type: 'AI_ALLOCATION'
    };

    setAiAllocationLogs(prev => [newLog, ...prev]);

    // Send push notification
    setNotifications(prev => [
      {
        id: `N-${Date.now()}`,
        title: '🤖 AI Berth Auto-Allocated',
        message: `Seat C2-${targetSeat} automatically allocated to ${topRac.name} (${topRac.racId}) under RAC Priority Rules.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return {
      success: true,
      allocatedTo: topRac,
      vacatedSeat: targetSeat,
      log: newLog
    };
  };

  const clearAllData = () => {
    setBookings([]);
    localStorage.removeItem('boardeazy_bookings_v2');
  };

  return (
    <BoardEazyContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        userRole: currentUser?.role || 'passenger',
        bookings,
        coachPassengers,
        racQueue,
        selectedCoach,
        setSelectedCoach,
        activeTrainNumber,
        setActiveTrainNumber,
        aiAllocationLogs,
        notifications,
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
