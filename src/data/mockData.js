export const INITIAL_STATIONS = [
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'SBC', name: 'KSR Bengaluru City Jn', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'CBE', name: 'Coimbatore Main Jn', city: 'Coimbatore', state: 'Tamil Nadu' },
  { code: 'MDU', name: 'Madurai Jn', city: 'Madurai', state: 'Tamil Nadu' },
  { code: 'MYS', name: 'Mysuru Jn', city: 'Mysuru', state: 'Karnataka' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
  { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi' },
  { code: 'HWH', name: 'Howrah Jn', city: 'Kolkata', state: 'West Bengal' },
  { code: 'PUNE', name: 'Pune Jn', city: 'Pune', state: 'Maharashtra' },
  { code: 'BVI', name: 'Mumbai Borivali', city: 'Mumbai', state: 'Maharashtra' }
];

export const INITIAL_TRAINS = [
  {
    number: '20607',
    name: 'Chennai – Mysuru Vande Bharat Express',
    type: 'Vande Bharat',
    from: 'MAS',
    fromStation: 'Chennai Central',
    to: 'SBC',
    toStation: 'Bengaluru KSR',
    finalDestination: 'Mysuru Jn (MYS)',
    departure: '05:50 AM',
    arrival: '10:20 AM',
    duration: '04h 30m',
    runsOn: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    distanceKm: 359,
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 995, status: 'AVAILABLE', seatsLeft: 18 },
      { code: 'EC', name: 'Exec. Chair Car', fare: 1885, status: 'AVAILABLE', seatsLeft: 6 },
      { code: '3A', name: 'AC 3 Tier (Special)', fare: 1250, status: 'AVAILABLE', seatsLeft: 18 }
    ],
    amenities: ['Onboard WiFi', 'Catering Available', 'Biometric Coach Gates', 'AI Berth Allocation', 'CCTV Security']
  },
  {
    number: '12007',
    name: 'Chennai – Mysuru Shatabdi Express',
    type: 'Shatabdi',
    from: 'MAS',
    fromStation: 'Chennai Central',
    to: 'SBC',
    toStation: 'Bengaluru KSR',
    finalDestination: 'Mysuru Jn (MYS)',
    departure: '06:00 AM',
    arrival: '10:45 AM',
    duration: '04h 45m',
    runsOn: ['All Days Except Tue'],
    distanceKm: 359,
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 870, status: 'AVAILABLE', seatsLeft: 42 },
      { code: 'EC', name: 'Exec. Chair Car', fare: 1640, status: 'RAC 04', seatsLeft: 0 }
    ],
    amenities: ['Morning Breakfast', 'Biometric Enabled', 'New LHB Coaches']
  },
  {
    number: '12677',
    name: 'KSR Bengaluru Intercity SF Express',
    type: 'Superfast',
    from: 'MAS',
    fromStation: 'Chennai Central',
    to: 'SBC',
    toStation: 'Bengaluru KSR',
    finalDestination: 'Bengaluru KSR',
    departure: '06:10 AM',
    arrival: '11:30 AM',
    duration: '05h 20m',
    runsOn: ['All Days'],
    distanceKm: 359,
    classes: [
      { code: '2S', name: 'Second Sitting', fare: 165, status: 'AVAILABLE', seatsLeft: 84 },
      { code: 'CC', name: 'AC Chair Car', fare: 595, status: 'AVAILABLE', seatsLeft: 12 },
      { code: '3A', name: 'AC 3 Tier', fare: 780, status: 'WL 08', seatsLeft: 0 }
    ],
    amenities: ['Pantry Car', 'Digital Boarding Gate Ready']
  },
  {
    number: '12657',
    name: 'Chennai – Bengaluru Mail',
    type: 'Superfast Mail',
    from: 'MAS',
    fromStation: 'Chennai Central',
    to: 'SBC',
    toStation: 'Bengaluru KSR',
    finalDestination: 'Bengaluru KSR',
    departure: '23:15 PM',
    arrival: '04:30 AM',
    duration: '05h 15m',
    runsOn: ['All Days'],
    distanceKm: 359,
    classes: [
      { code: 'SL', name: 'Sleeper', fare: 275, status: 'AVAILABLE', seatsLeft: 36 },
      { code: '3A', name: 'AC 3 Tier', fare: 730, status: 'AVAILABLE', seatsLeft: 22 },
      { code: '2A', name: 'AC 2 Tier', fare: 1045, status: 'RAC 02', seatsLeft: 0 },
      { code: '1A', name: 'AC First Class', fare: 1750, status: 'AVAILABLE', seatsLeft: 4 }
    ],
    amenities: ['Overnight Bedroll', 'Charging Ports', 'Smart Biometric Check-in']
  }
];

// Start with empty previous bookings as requested by user
export const INITIAL_BOOKINGS = [];

export const INITIAL_RAC_QUEUE = [
  {
    racId: 'RAC01',
    mainPnr: '7821940129',
    subPnr: 'PA01',
    name: 'Vikramaditya Rao',
    age: 28,
    gender: 'Male',
    class: '3A',
    trainNumber: '20607',
    quota: 'General',
    priorityScore: 98.4,
    status: 'RAC_WAITING',
    checkinComplete: true,
    boardingStation: 'MAS',
    allocatedSeat: null
  },
  {
    racId: 'RAC02',
    mainPnr: '7129384102',
    subPnr: 'PA01',
    name: 'Deepika Sundaram',
    age: 26,
    gender: 'Female',
    class: '3A',
    trainNumber: '20607',
    quota: 'Ladies',
    priorityScore: 94.2,
    status: 'RAC_WAITING',
    checkinComplete: true,
    boardingStation: 'MAS',
    allocatedSeat: null
  },
  {
    racId: 'RAC03',
    mainPnr: '6391028475',
    subPnr: 'PA01',
    name: 'Manoj Kumar',
    age: 42,
    gender: 'Male',
    class: '3A',
    trainNumber: '20607',
    quota: 'Senior',
    priorityScore: 89.0,
    status: 'RAC_WAITING',
    checkinComplete: false,
    boardingStation: 'MAS',
    allocatedSeat: null
  }
];

export const INITIAL_COACH_PASSENGERS = [
  { seat: 1, subPnr: 'P901', name: 'R. K. Sharma', status: 'BOARDED', time: '05:22 AM' },
  { seat: 2, subPnr: 'P902', name: 'Sunita Sharma', status: 'BOARDED', time: '05:22 AM' },
  { seat: 3, subPnr: 'P903', name: 'G. Balachandar', status: 'BOARDED', time: '05:25 AM' },
  { seat: 4, subPnr: 'P904', name: 'Lakshmi B', status: 'BOARDED', time: '05:26 AM' },
  { seat: 5, subPnr: 'P905', name: 'Karthik N', status: 'BOARDED', time: '05:28 AM' },
  { seat: 6, subPnr: 'P906', name: 'Divya M', status: 'BOARDED', time: '05:30 AM' },
  { seat: 7, subPnr: 'P907', name: 'V. Sundaresan', status: 'BOARDED', time: '05:31 AM' },
  { seat: 8, subPnr: 'P908', name: 'Shanti S', status: 'BOARDED', time: '05:31 AM' },
  { seat: 9, subPnr: 'P909', name: 'Naveen Raj', status: 'BOARDED', time: '05:33 AM' },
  { seat: 10, subPnr: 'P910', name: 'Meera N', status: 'BOARDED', time: '05:33 AM' },
  { seat: 11, subPnr: 'P911', name: 'Sanjay Dutt', status: 'BOARDED', time: '05:35 AM' },
  { seat: 12, subPnr: 'P912', name: 'Ayesha Khan', status: 'BOARDED', time: '05:35 AM' },
  { seat: 13, subPnr: 'P913', name: 'C. Venkatesh', status: 'BOARDED', time: '05:37 AM' },
  { seat: 14, subPnr: 'P914', name: 'Radha V', status: 'BOARDED', time: '05:37 AM' },
  { seat: 15, subPnr: 'P915', name: 'Gautam Menon', status: 'BOARDED', time: '05:38 AM' },
  { seat: 16, subPnr: 'P916', name: 'Anu Emmanuel', status: 'BOARDED', time: '05:38 AM' },
  { seat: 17, subPnr: 'P917', name: 'Rajesh V', status: 'BOARDED', time: '05:39 AM' },
  { seat: 18, subPnr: 'P918', name: 'Pooja R', status: 'BOARDED', time: '05:39 AM' },
  { seat: 19, subPnr: 'P919', name: 'Sudhir Nayak', status: 'BOARDED', time: '05:40 AM' },
  { seat: 20, subPnr: 'P920', name: 'Aparna S', status: 'BOARDED', time: '05:40 AM' },
  { seat: 21, subPnr: 'P921', name: 'Jayant Patel', status: 'BOARDED', time: '05:41 AM' },
  { seat: 22, subPnr: 'P922', name: 'Bhavna J', status: 'BOARDED', time: '05:41 AM' },
  { seat: 23, subPnr: 'P923', name: 'V. Prakash', status: 'BOARDED', time: '05:42 AM' },
  { seat: 24, subPnr: 'P924', name: 'Geetha P', status: 'BOARDED', time: '05:42 AM' },
  { seat: 25, subPnr: 'P925', name: 'K. Swaminathan', status: 'BOARDED', time: '05:43 AM' },
  { seat: 26, subPnr: 'P926', name: 'Revathi S', status: 'BOARDED', time: '05:43 AM' },
  { seat: 27, subPnr: 'P927', name: 'R. Raghuram', status: 'BOARDED', time: '05:44 AM' },
  { seat: 28, subPnr: 'P928', name: 'Anitha R', status: 'BOARDED', time: '05:44 AM' },
  { seat: 29, subPnr: 'P929', name: 'Kishore Kumar', status: 'BOARDED', time: '05:45 AM' },
  { seat: 30, subPnr: 'P930', name: 'Sandhya K', status: 'BOARDED', time: '05:45 AM' },
  { seat: 31, subPnr: 'P931', name: 'Ajit Doval', status: 'BOARDED', time: '05:46 AM' },
  { seat: 32, subPnr: 'P932', name: 'Sneha Roy', status: 'BOARDED', time: '05:46 AM' },
  { seat: 33, subPnr: 'P933', name: 'Amitabh Sen', status: 'BOARDED', time: '05:47 AM' },
  { seat: 34, subPnr: 'P934', name: 'Jaya Sen', status: 'BOARDED', time: '05:47 AM' },
  { seat: 35, subPnr: 'P935', name: 'M. S. Dhoni', status: 'BOARDED', time: '05:48 AM' },
  
  // Passenger seat 36 (Harshavardhan S) & 37 (Meenakshi S)
  { seat: 36, subPnr: 'PA01', name: 'Harshavardhan S', status: 'PENDING', time: null },
  { seat: 37, subPnr: 'PA02', name: 'Meenakshi S', status: 'PENDING', time: null },
  { seat: 38, subPnr: 'PA03', name: 'S. Ranganathan', status: 'PENDING', time: null }, // Unboarded passenger for No-Show test
  { seat: 39, subPnr: 'PA04', name: 'Arun K', status: 'BOARDED', time: '05:38 AM' },
  { seat: 40, subPnr: 'PA05', name: 'Priya S', status: 'BOARDED', time: '05:40 AM' },

  // Seats 41 to 52
  { seat: 41, subPnr: 'P941', name: 'N. Chandrasekaran', status: 'BOARDED', time: '05:48 AM' },
  { seat: 42, subPnr: 'P942', name: 'Preetha Reddy', status: 'BOARDED', time: '05:49 AM' },
  { seat: 43, subPnr: 'P943', name: 'Rohit Sharma', status: 'PENDING', time: null },
  { seat: 44, subPnr: 'P944', name: 'Ritika Sajdeh', status: 'PENDING', time: null },
  { seat: 45, subPnr: 'P945', name: 'S. Jaishankar', status: 'BOARDED', time: '05:49 AM' },
  { seat: 46, subPnr: 'P946', name: 'Kyoko S', status: 'BOARDED', time: '05:49 AM' },
  { seat: 47, subPnr: 'P947', name: 'Raghavan Iyer', status: 'PENDING', time: null },
  { seat: 48, subPnr: 'P948', name: 'Padma Iyer', status: 'PENDING', time: null },
  { seat: 49, subPnr: 'P949', name: 'V. Anand', status: 'BOARDED', time: '05:50 AM' },
  { seat: 50, subPnr: 'P950', name: 'Aruna Anand', status: 'BOARDED', time: '05:50 AM' },
  { seat: 51, subPnr: 'P951', name: 'Deepak Parekh', status: 'BOARDED', time: '05:50 AM' },
  { seat: 52, subPnr: 'P952', name: 'Smriti Mandhana', status: 'BOARDED', time: '05:50 AM' }
];

export const DEMO_USERS = {
  passenger: {
    email: 'harshavardhan@gmail.com',
    pin: '1234',
    name: 'Harshavardhan S',
    role: 'passenger',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    googleConnected: true,
    biometricRegistered: true,
    firstTimeSetupDone: true
  },
  tte: {
    email: 'tte@boardeazy.com',
    pin: '5678',
    name: 'R. Ramanathan (TTE Mas Div)',
    role: 'tte',
    badgeNumber: 'TTE-SR-8941',
    trainAssigned: '20607 Chennai – Mysuru Vande Bharat',
    assignedCoach: 'C2',
    zone: 'Southern Railway (MAS)'
  },
  admin: {
    email: 'admin@boardeazy.com',
    pin: '9999',
    name: 'Divisional Railway Ops Admin',
    role: 'admin',
    department: 'Passenger Operations & AI Logistics',
    division: 'Chennai Division (MAS)'
  }
};
