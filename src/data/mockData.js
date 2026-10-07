/**
 * BoardEazy Scalable Railway Dataset & Data Adapter
 *
 * DATA SOURCE CONFIGURATION:
 * Running in DEMO mode with realistic structured Indian Railways dataset.
 * Designed with a clean data adapter layer ready to connect to an authorized railway API.
 */

export const DATA_SOURCE_CONFIG = {
  mode: 'DEMO', // 'DEMO' | 'LIVE'
  label: 'Demo Railway Dataset',
  disclaimer: 'Running in Prototype Demo Mode with structured Indian Railways route data. Live API adapter ready.',
  version: '2.4.0'
};

/**
 * Master Stations Database
 */
export const INITIAL_STATIONS = [
  // Southern Railway / South Western
  { code: 'MAS', name: 'Chennai Central (Puratchi Thalaivar Dr. MGR)', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', division: 'MAS', lat: 13.0827, lng: 80.2707 },
  { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', division: 'MAS', lat: 13.0784, lng: 80.2612 },
  { code: 'AJJ', name: 'Arakkonam Jn', city: 'Arakkonam', state: 'Tamil Nadu', zone: 'SR', division: 'MAS', lat: 13.0792, lng: 79.6678 },
  { code: 'KPD', name: 'Katpadi Jn', city: 'Vellore', state: 'Tamil Nadu', zone: 'SR', division: 'MAS', lat: 12.9716, lng: 79.1333 },
  { code: 'JTJ', name: 'Jolarpettai Jn', city: 'Jolarpettai', state: 'Tamil Nadu', zone: 'SR', division: 'MAS', lat: 12.5684, lng: 78.5807 },
  { code: 'SA', name: 'Salem Jn', city: 'Salem', state: 'Tamil Nadu', zone: 'SR', division: 'SA', lat: 11.6643, lng: 78.1460 },
  { code: 'ED', name: 'Erode Jn', city: 'Erode', state: 'Tamil Nadu', zone: 'SR', division: 'SA', lat: 11.3410, lng: 77.7172 },
  { code: 'CBE', name: 'Coimbatore Main Jn', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'SR', division: 'SA', lat: 11.0018, lng: 76.9629 },
  { code: 'TPJ', name: 'Tiruchchirappalli Jn', city: 'Tiruchirappalli', state: 'Tamil Nadu', zone: 'SR', division: 'TPJ', lat: 10.7905, lng: 78.7047 },
  { code: 'MDU', name: 'Madurai Jn', city: 'Madurai', state: 'Tamil Nadu', zone: 'SR', division: 'MDU', lat: 9.9197, lng: 78.1132 },
  { code: 'SBC', name: 'KSR Bengaluru City Jn', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', division: 'SBC', lat: 12.9779, lng: 77.5713 },
  { code: 'YPR', name: 'Yesvantpur Jn', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', division: 'SBC', lat: 13.0238, lng: 77.5503 },
  { code: 'KJM', name: 'Krishnarajapuram', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', division: 'SBC', lat: 13.0006, lng: 77.6766 },
  { code: 'BWT', name: 'Bangarapet Jn', city: 'Bangarapet', state: 'Karnataka', zone: 'SWR', division: 'SBC', lat: 12.9972, lng: 78.1997 },
  { code: 'MYS', name: 'Mysuru Jn', city: 'Mysuru', state: 'Karnataka', zone: 'SWR', division: 'MYS', lat: 12.3168, lng: 76.6496 },

  // South Central / Central / Western
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', division: 'SC', lat: 17.3924, lng: 78.4682 },
  { code: 'SC', name: 'Secunderabad Jn', city: 'Secunderabad', state: 'Telangana', zone: 'SCR', division: 'SC', lat: 17.4344, lng: 78.5015 },
  { code: 'BZA', name: 'Vijayawada Jn', city: 'Vijayawada', state: 'Andhra Pradesh', zone: 'SCR', division: 'BZA', lat: 16.5186, lng: 80.6200 },
  { code: 'WL', name: 'Warangal', city: 'Warangal', state: 'Telangana', zone: 'SCR', division: 'SC', lat: 17.9689, lng: 79.5941 },
  { code: 'BPQ', name: 'Balharshah Jn', city: 'Balharshah', state: 'Maharashtra', zone: 'CR', division: 'NGP', lat: 19.8542, lng: 79.3524 },
  { code: 'NGP', name: 'Nagpur Jn', city: 'Nagpur', state: 'Maharashtra', zone: 'CR', division: 'NGP', lat: 21.1524, lng: 79.0888 },
  { code: 'PUNE', name: 'Pune Jn', city: 'Pune', state: 'Maharashtra', zone: 'CR', division: 'PUNE', lat: 18.5284, lng: 73.8743 },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus (Mumbai)', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', division: 'BB', lat: 18.9401, lng: 72.8354 },
  { code: 'BVI', name: 'Mumbai Borivali', city: 'Mumbai', state: 'Maharashtra', zone: 'WR', division: 'BCT', lat: 19.2291, lng: 72.8574 },
  { code: 'ADI', name: 'Ahmedabad Jn', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR', division: 'ADI', lat: 23.0225, lng: 72.5714 },

  // Northern & North Central
  { code: 'BPL', name: 'Bhopal Jn', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR', division: 'BPL', lat: 23.2599, lng: 77.4126 },
  { code: 'VGLJ', name: 'VGL Jhansi Jn', city: 'Jhansi', state: 'Uttar Pradesh', zone: 'NCR', division: 'JHS', lat: 25.4484, lng: 78.5685 },
  { code: 'GWL', name: 'Gwalior Jn', city: 'Gwalior', state: 'Madhya Pradesh', zone: 'NCR', division: 'JHS', lat: 26.2183, lng: 78.1828 },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', zone: 'NCR', division: 'AGC', lat: 27.1591, lng: 77.9917 },
  { code: 'KOTA', name: 'Kota Jn', city: 'Kota', state: 'Rajasthan', zone: 'WCR', division: 'KOTA', lat: 25.2235, lng: 75.8756 },
  { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi', zone: 'NR', division: 'DLI', lat: 28.6431, lng: 77.2197 },
  { code: 'NZM', name: 'Hazrat Nizamuddin (Delhi)', city: 'New Delhi', state: 'Delhi', zone: 'NR', division: 'DLI', lat: 28.5888, lng: 77.2534 },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'NCR', division: 'PRYJ', lat: 26.4547, lng: 80.3507 },
  { code: 'HWH', name: 'Howrah Jn (Kolkata)', city: 'Kolkata', state: 'West Bengal', zone: 'ER', division: 'HWH', lat: 22.5839, lng: 88.3426 }
];

/**
 * Master Train Classes Catalog
 */
export const RAILWAY_CLASSES = {
  '1A': { code: '1A', name: 'AC First Class', label: '1A – First AC', description: 'Private 4-berth cabins & 2-berth coupes with sliding lockable doors.' },
  '2A': { code: '2A', name: 'AC 2 Tier', label: '2A – AC 2 Tier', description: 'Spacious 6-berth bay with privacy curtains and individual reading lamps.' },
  '3A': { code: '3A', name: 'AC 3 Tier', label: '3A – AC 3 Tier', description: 'Air-conditioned 8-berth bay with clean bedding provided.' },
  '3E': { code: '3E', name: 'AC 3 Economy', label: '3E – AC 3 Economy', description: 'Modern 3-tier economy configuration with personalized vents.' },
  'CC': { code: 'CC', name: 'AC Chair Car', label: 'CC – AC Chair Car', description: 'Push-back ergonomic seating (3x2) with panoramic windows.' },
  'EC': { code: 'EC', name: 'Executive Chair Car', label: 'EC – Exec. Chair Car', description: 'Premium 2x2 luxury rotating seats with wide legroom.' },
  'SL': { code: 'SL', name: 'Sleeper Class', label: 'SL – Sleeper Class', description: 'Non-AC classic 8-berth open bay sleeper coaches.' },
  '2S': { code: '2S', name: 'Second Sitting', label: '2S – Second Sitting', description: 'Reserved cushioned 3x3 bench seating for day journeys.' }
};

/**
 * Master Multi-Route Train Database
 */
export const INITIAL_TRAINS = [
  // 1. Chennai – Mysuru Vande Bharat Express
  {
    number: '20607',
    name: 'Chennai – Mysuru Vande Bharat Express',
    type: 'Vande Bharat',
    source: 'MAS',
    destination: 'MYS',
    runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    routeStops: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: null, departure: '05:50 AM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'KPD', stationName: 'Katpadi Jn', arrival: '07:13 AM', departure: '07:15 AM', haltMinutes: 2, distanceKm: 130, day: 1 },
      { stationCode: 'KJM', stationName: 'Krishnarajapuram', arrival: '09:48 AM', departure: '09:50 AM', haltMinutes: 2, distanceKm: 345, day: 1 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrival: '10:15 AM', departure: '10:20 AM', haltMinutes: 5, distanceKm: 359, day: 1 },
      { stationCode: 'MYS', stationName: 'Mysuru Jn', arrival: '12:20 PM', departure: null, haltMinutes: 0, distanceKm: 497, day: 1 }
    ],
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 995, status: 'AVAILABLE', seatsLeft: 18 },
      { code: 'EC', name: 'Exec. Chair Car', fare: 1885, status: 'AVAILABLE', seatsLeft: 6 }
    ],
    coaches: [
      { coachNumber: 'C1', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'C2', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'C3', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'E1', coachType: 'EC', classCode: 'EC', capacity: 52, layoutType: 'EXEC_CHAIR_CAR' }
    ],
    amenities: ['160 kmph Semi-High Speed', 'Onboard Bio-Vacuum Toilets', 'Biometric Automated Doors', 'AI Berth Engine']
  },

  // 2. Mysuru – Chennai Vande Bharat Express (Return)
  {
    number: '20608',
    name: 'Mysuru – Chennai Vande Bharat Express',
    type: 'Vande Bharat',
    source: 'MYS',
    destination: 'MAS',
    runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    routeStops: [
      { stationCode: 'MYS', stationName: 'Mysuru Jn', arrival: null, departure: '13:05 PM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrival: '14:50 PM', departure: '14:55 PM', haltMinutes: 5, distanceKm: 138, day: 1 },
      { stationCode: 'KJM', stationName: 'Krishnarajapuram', arrival: '15:15 PM', departure: '15:17 PM', haltMinutes: 2, distanceKm: 152, day: 1 },
      { stationCode: 'KPD', stationName: 'Katpadi Jn', arrival: '17:53 PM', departure: '17:55 PM', haltMinutes: 2, distanceKm: 367, day: 1 },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: '19:30 PM', departure: null, haltMinutes: 0, distanceKm: 497, day: 1 }
    ],
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 995, status: 'AVAILABLE', seatsLeft: 24 },
      { code: 'EC', name: 'Exec. Chair Car', fare: 1885, status: 'AVAILABLE', seatsLeft: 4 }
    ],
    coaches: [
      { coachNumber: 'C1', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'C2', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'E1', coachType: 'EC', classCode: 'EC', capacity: 52, layoutType: 'EXEC_CHAIR_CAR' }
    ],
    amenities: ['160 kmph Semi-High Speed', 'Onboard Bio-Vacuum Toilets', 'Biometric Automated Doors']
  },

  // 3. Chennai – Mysuru Shatabdi Express
  {
    number: '12007',
    name: 'Chennai – Mysuru Shatabdi Express',
    type: 'Shatabdi',
    source: 'MAS',
    destination: 'MYS',
    runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    routeStops: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: null, departure: '06:00 AM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'KPD', stationName: 'Katpadi Jn', arrival: '07:38 AM', departure: '07:40 AM', haltMinutes: 2, distanceKm: 130, day: 1 },
      { stationCode: 'JTJ', stationName: 'Jolarpettai Jn', arrival: '08:48 AM', departure: '08:50 AM', haltMinutes: 2, distanceKm: 214, day: 1 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrival: '10:45 AM', departure: '10:50 AM', haltMinutes: 5, distanceKm: 359, day: 1 },
      { stationCode: 'MYS', stationName: 'Mysuru Jn', arrival: '13:00 PM', departure: null, haltMinutes: 0, distanceKm: 497, day: 1 }
    ],
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 870, status: 'AVAILABLE', seatsLeft: 42 },
      { code: 'EC', name: 'Exec. Chair Car', fare: 1640, status: 'RAC 04', seatsLeft: 0 }
    ],
    coaches: [
      { coachNumber: 'C1', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'C2', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'E1', coachType: 'EC', classCode: 'EC', capacity: 52, layoutType: 'EXEC_CHAIR_CAR' }
    ],
    amenities: ['Morning Breakfast Included', 'LHB High-Speed Coaches', 'Biometric Enabled']
  },

  // 4. Kovai Superfast Express (Chennai Central -> Coimbatore)
  {
    number: '12675',
    name: 'Kovai Superfast Express',
    type: 'Superfast',
    source: 'MAS',
    destination: 'CBE',
    runningDays: ['All Days'],
    routeStops: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: null, departure: '06:10 AM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'AJJ', stationName: 'Arakkonam Jn', arrival: '07:08 AM', departure: '07:10 AM', haltMinutes: 2, distanceKm: 69, day: 1 },
      { stationCode: 'KPD', stationName: 'Katpadi Jn', arrival: '07:58 AM', departure: '08:00 AM', haltMinutes: 2, distanceKm: 130, day: 1 },
      { stationCode: 'JTJ', stationName: 'Jolarpettai Jn', arrival: '09:08 AM', departure: '09:10 AM', haltMinutes: 2, distanceKm: 214, day: 1 },
      { stationCode: 'SA', stationName: 'Salem Jn', arrival: '10:37 AM', departure: '10:40 AM', haltMinutes: 3, distanceKm: 334, day: 1 },
      { stationCode: 'ED', stationName: 'Erode Jn', arrival: '11:40 AM', departure: '11:45 AM', haltMinutes: 5, distanceKm: 396, day: 1 },
      { stationCode: 'CBE', stationName: 'Coimbatore Main Jn', arrival: '14:05 PM', departure: null, haltMinutes: 0, distanceKm: 497, day: 1 }
    ],
    classes: [
      { code: '2S', name: 'Second Sitting', fare: 185, status: 'AVAILABLE', seatsLeft: 84 },
      { code: 'CC', name: 'AC Chair Car', fare: 645, status: 'AVAILABLE', seatsLeft: 28 }
    ],
    coaches: [
      { coachNumber: 'D1', coachType: '2S', classCode: '2S', capacity: 108, layoutType: 'SECOND_SITTING' },
      { coachNumber: 'D2', coachType: '2S', classCode: '2S', capacity: 108, layoutType: 'SECOND_SITTING' },
      { coachNumber: 'C1', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' },
      { coachNumber: 'C2', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' }
    ],
    amenities: ['Pantry Car', 'Intercity Day Fast Service', 'Digital Gate Verification']
  },

  // 5. Kovai Superfast Express Return (Coimbatore -> Chennai)
  {
    number: '12676',
    name: 'Kovai Superfast Express',
    type: 'Superfast',
    source: 'CBE',
    destination: 'MAS',
    runningDays: ['All Days'],
    routeStops: [
      { stationCode: 'CBE', stationName: 'Coimbatore Main Jn', arrival: null, departure: '15:15 PM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'ED', stationName: 'Erode Jn', arrival: '16:45 PM', departure: '16:50 PM', haltMinutes: 5, distanceKm: 101, day: 1 },
      { stationCode: 'SA', stationName: 'Salem Jn', arrival: '17:47 PM', departure: '17:50 PM', haltMinutes: 3, distanceKm: 163, day: 1 },
      { stationCode: 'JTJ', stationName: 'Jolarpettai Jn', arrival: '19:28 PM', departure: '19:30 PM', haltMinutes: 2, distanceKm: 283, day: 1 },
      { stationCode: 'KPD', stationName: 'Katpadi Jn', arrival: '20:33 PM', departure: '20:35 PM', haltMinutes: 2, distanceKm: 367, day: 1 },
      { stationCode: 'AJJ', stationName: 'Arakkonam Jn', arrival: '21:28 PM', departure: '21:30 PM', haltMinutes: 2, distanceKm: 428, day: 1 },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: '22:50 PM', departure: null, haltMinutes: 0, distanceKm: 497, day: 1 }
    ],
    classes: [
      { code: '2S', name: 'Second Sitting', fare: 185, status: 'AVAILABLE', seatsLeft: 96 },
      { code: 'CC', name: 'AC Chair Car', fare: 645, status: 'AVAILABLE', seatsLeft: 31 }
    ],
    coaches: [
      { coachNumber: 'D1', coachType: '2S', classCode: '2S', capacity: 108, layoutType: 'SECOND_SITTING' },
      { coachNumber: 'C1', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' }
    ],
    amenities: ['Pantry Car', 'Digital Boarding']
  },

  // 6. Vaigai Superfast Express (Chennai Egmore -> Madurai)
  {
    number: '12635',
    name: 'Vaigai Superfast Express',
    type: 'Superfast',
    source: 'MS',
    destination: 'MDU',
    runningDays: ['All Days'],
    routeStops: [
      { stationCode: 'MS', stationName: 'Chennai Egmore', arrival: null, departure: '13:50 PM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'TPJ', stationName: 'Tiruchchirappalli Jn', arrival: '18:55 PM', departure: '19:00 PM', haltMinutes: 5, distanceKm: 337, day: 1 },
      { stationCode: 'MDU', stationName: 'Madurai Jn', arrival: '21:30 PM', departure: null, haltMinutes: 0, distanceKm: 497, day: 1 }
    ],
    classes: [
      { code: '2S', name: 'Second Sitting', fare: 175, status: 'AVAILABLE', seatsLeft: 110 },
      { code: 'CC', name: 'AC Chair Car', fare: 620, status: 'AVAILABLE', seatsLeft: 35 }
    ],
    coaches: [
      { coachNumber: 'D1', coachType: '2S', classCode: '2S', capacity: 108, layoutType: 'SECOND_SITTING' },
      { coachNumber: 'C1', coachType: 'CC', classCode: 'CC', capacity: 78, layoutType: 'CHAIR_CAR' }
    ],
    amenities: ['Intercity Fast Connector', 'High On-Time Performance']
  },

  // 7. Chennai – Bengaluru Mail (Overnight MAS -> SBC)
  {
    number: '12657',
    name: 'Chennai – Bengaluru Mail',
    type: 'Superfast Mail',
    source: 'MAS',
    destination: 'SBC',
    runningDays: ['All Days'],
    routeStops: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: null, departure: '23:15 PM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'AJJ', stationName: 'Arakkonam Jn', arrival: '00:13 AM', departure: '00:15 AM', haltMinutes: 2, distanceKm: 69, day: 2 },
      { stationCode: 'KPD', stationName: 'Katpadi Jn', arrival: '01:03 AM', departure: '01:05 AM', haltMinutes: 2, distanceKm: 130, day: 2 },
      { stationCode: 'JTJ', stationName: 'Jolarpettai Jn', arrival: '02:23 AM', departure: '02:25 AM', haltMinutes: 2, distanceKm: 214, day: 2 },
      { stationCode: 'BWT', stationName: 'Bangarapet Jn', arrival: '03:34 AM', departure: '03:35 AM', haltMinutes: 1, distanceKm: 289, day: 2 },
      { stationCode: 'KJM', stationName: 'Krishnarajapuram', arrival: '04:13 AM', departure: '04:15 AM', haltMinutes: 2, distanceKm: 345, day: 2 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrival: '05:00 AM', departure: null, haltMinutes: 0, distanceKm: 359, day: 2 }
    ],
    classes: [
      { code: 'SL', name: 'Sleeper', fare: 275, status: 'AVAILABLE', seatsLeft: 46 },
      { code: '3A', name: 'AC 3 Tier', fare: 730, status: 'AVAILABLE', seatsLeft: 22 },
      { code: '2A', name: 'AC 2 Tier', fare: 1045, status: 'RAC 02', seatsLeft: 0 },
      { code: '1A', name: 'AC First Class', fare: 1750, status: 'AVAILABLE', seatsLeft: 4 }
    ],
    coaches: [
      { coachNumber: 'S1', coachType: 'SL', classCode: 'SL', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'S2', coachType: 'SL', classCode: 'SL', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'B1', coachType: '3A', classCode: '3A', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'B2', coachType: '3A', classCode: '3A', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'A1', coachType: '2A', classCode: '2A', capacity: 48, layoutType: 'AC_2_TIER' },
      { coachNumber: 'H1', coachType: '1A', classCode: '1A', capacity: 24, layoutType: 'FIRST_AC' }
    ],
    amenities: ['Overnight Bedroll Kit', 'Biometric Boarding Verified', 'Charging Points']
  },

  // 8. Tamil Nadu Superfast Express (Chennai Central -> New Delhi)
  {
    number: '12621',
    name: 'Tamil Nadu Superfast Express',
    type: 'Superfast',
    source: 'MAS',
    destination: 'NDLS',
    runningDays: ['All Days'],
    routeStops: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: null, departure: '22:00 PM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'BZA', stationName: 'Vijayawada Jn', arrival: '03:55 AM', departure: '04:05 AM', haltMinutes: 10, distanceKm: 431, day: 2 },
      { stationCode: 'WL', stationName: 'Warangal', arrival: '06:58 AM', departure: '07:00 AM', haltMinutes: 2, distanceKm: 638, day: 2 },
      { stationCode: 'BPQ', stationName: 'Balharshah Jn', arrival: '10:45 AM', departure: '10:50 AM', haltMinutes: 5, distanceKm: 881, day: 2 },
      { stationCode: 'NGP', stationName: 'Nagpur Jn', arrival: '13:50 PM', departure: '13:55 PM', haltMinutes: 5, distanceKm: 1089, day: 2 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrival: '20:10 PM', departure: '20:20 PM', haltMinutes: 10, distanceKm: 1479, day: 2 },
      { stationCode: 'VGLJ', stationName: 'VGL Jhansi Jn', arrival: '00:26 AM', departure: '00:31 AM', haltMinutes: 5, distanceKm: 1771, day: 3 },
      { stationCode: 'GWL', stationName: 'Gwalior Jn', arrival: '01:32 AM', departure: '01:34 AM', haltMinutes: 2, distanceKm: 1868, day: 3 },
      { stationCode: 'AGC', stationName: 'Agra Cantt', arrival: '03:05 AM', departure: '03:07 AM', haltMinutes: 2, distanceKm: 1987, day: 3 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrival: '06:30 AM', departure: null, haltMinutes: 0, distanceKm: 2182, day: 3 }
    ],
    classes: [
      { code: 'SL', name: 'Sleeper', fare: 795, status: 'AVAILABLE', seatsLeft: 120 },
      { code: '3A', name: 'AC 3 Tier', fare: 2090, status: 'AVAILABLE', seatsLeft: 34 },
      { code: '2A', name: 'AC 2 Tier', fare: 3045, status: 'AVAILABLE', seatsLeft: 12 },
      { code: '1A', name: 'AC First Class', fare: 5210, status: 'AVAILABLE', seatsLeft: 6 }
    ],
    coaches: [
      { coachNumber: 'S1', coachType: 'SL', classCode: 'SL', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'S2', coachType: 'SL', classCode: 'SL', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'B1', coachType: '3A', classCode: '3A', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'B2', coachType: '3A', classCode: '3A', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'A1', coachType: '2A', classCode: '2A', capacity: 48, layoutType: 'AC_2_TIER' },
      { coachNumber: 'H1', coachType: '1A', classCode: '1A', capacity: 24, layoutType: 'FIRST_AC' }
    ],
    amenities: ['Onboard Pantry & Dining', 'Long Haul Flagship Express', 'AI Berth Redistribution']
  },

  // 9. Mumbai Central – New Delhi Tejas Rajdhani Express
  {
    number: '12951',
    name: 'Mumbai – New Delhi Tejas Rajdhani Express',
    type: 'Rajdhani',
    source: 'CSMT',
    destination: 'NDLS',
    runningDays: ['All Days'],
    routeStops: [
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arrival: null, departure: '17:00 PM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'BVI', stationName: 'Mumbai Borivali', arrival: '17:22 PM', departure: '17:24 PM', haltMinutes: 2, distanceKm: 30, day: 1 },
      { stationCode: 'KOTA', stationName: 'Kota Jn', arrival: '03:15 AM', departure: '03:20 AM', haltMinutes: 5, distanceKm: 918, day: 2 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrival: '08:32 AM', departure: null, haltMinutes: 0, distanceKm: 1386, day: 2 }
    ],
    classes: [
      { code: '3A', name: 'AC 3 Tier', fare: 2465, status: 'AVAILABLE', seatsLeft: 18 },
      { code: '2A', name: 'AC 2 Tier', fare: 3585, status: 'AVAILABLE', seatsLeft: 8 },
      { code: '1A', name: 'AC First Class', fare: 5925, status: 'AVAILABLE', seatsLeft: 4 }
    ],
    coaches: [
      { coachNumber: 'B1', coachType: '3A', classCode: '3A', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'B2', coachType: '3A', classCode: '3A', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'A1', coachType: '2A', classCode: '2A', capacity: 48, layoutType: 'AC_2_TIER' },
      { coachNumber: 'H1', coachType: '1A', classCode: '1A', capacity: 24, layoutType: 'FIRST_AC' }
    ],
    amenities: ['Catering Included', 'Tejas Smart Bio-Sensors', 'Automated Doors']
  },

  // 10. New Delhi – Mumbai Tejas Rajdhani Express Return
  {
    number: '12952',
    name: 'New Delhi – Mumbai Tejas Rajdhani Express',
    type: 'Rajdhani',
    source: 'NDLS',
    destination: 'CSMT',
    runningDays: ['All Days'],
    routeStops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrival: null, departure: '16:55 PM', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'KOTA', stationName: 'Kota Jn', arrival: '21:30 PM', departure: '21:35 PM', haltMinutes: 5, distanceKm: 468, day: 1 },
      { stationCode: 'BVI', stationName: 'Mumbai Borivali', arrival: '07:40 AM', departure: '07:42 AM', haltMinutes: 2, distanceKm: 1356, day: 2 },
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arrival: '08:35 AM', departure: null, haltMinutes: 0, distanceKm: 1386, day: 2 }
    ],
    classes: [
      { code: '3A', name: 'AC 3 Tier', fare: 2465, status: 'AVAILABLE', seatsLeft: 22 },
      { code: '2A', name: 'AC 2 Tier', fare: 3585, status: 'AVAILABLE', seatsLeft: 10 },
      { code: '1A', name: 'AC First Class', fare: 5925, status: 'AVAILABLE', seatsLeft: 2 }
    ],
    coaches: [
      { coachNumber: 'B1', coachType: '3A', classCode: '3A', capacity: 72, layoutType: 'SLEEPER_3A' },
      { coachNumber: 'A1', coachType: '2A', classCode: '2A', capacity: 48, layoutType: 'AC_2_TIER' },
      { coachNumber: 'H1', coachType: '1A', classCode: '1A', capacity: 24, layoutType: 'FIRST_AC' }
    ],
    amenities: ['Catering Included', 'Tejas Smart Bio-Sensors']
  }
];

/**
 * Route-Aware Train Search Function
 * Finds all trains where both fromCode and toCode exist in routeStops, and fromIndex < toIndex.
 */
export const findTrainsBetweenStations = (fromCode, toCode, quota = 'General', classCode = 'ALL') => {
  if (!fromCode || !toCode || fromCode === toCode) return [];

  const matchingTrains = [];

  for (const train of INITIAL_TRAINS) {
    const stops = train.routeStops || [];
    const fromIndex = stops.findIndex(s => s.stationCode.toUpperCase() === fromCode.toUpperCase());
    const toIndex = stops.findIndex(s => s.stationCode.toUpperCase() === toCode.toUpperCase());

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
      const fromStop = stops[fromIndex];
      const toStop = stops[toIndex];
      const segmentDistance = (toStop.distanceKm || 0) - (fromStop.distanceKm || 0);

      // Filter classes for this train
      let availableClasses = train.classes || [];
      if (classCode && classCode !== 'ALL') {
        availableClasses = availableClasses.filter(c => c.code === classCode);
      }

      if (availableClasses.length > 0) {
        matchingTrains.push({
          ...train,
          fromStationCode: fromStop.stationCode,
          fromStationName: fromStop.stationName,
          toStationCode: toStop.stationCode,
          toStationName: toStop.stationName,
          departure: fromStop.departure || '05:50 AM',
          arrival: toStop.arrival || '10:20 AM',
          segmentDistance: segmentDistance > 0 ? segmentDistance : train.distanceKm || 359,
          availableClasses
        });
      }
    }
  }

  return matchingTrains;
};

/**
 * RAC Waitlist Priority Queue for Autonomous Seat Allocation
 */
export const INITIAL_RAC_QUEUE = [
  {
    racId: 'RAC01',
    mainPnr: '7821940129',
    subPnr: 'PA01',
    name: 'Vikramaditya Rao',
    mobile: '+91 94441 23456',
    normalizedMobile: '9444123456',
    age: 28,
    gender: 'Male',
    class: 'CC',
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
    mobile: '+91 98840 98765',
    normalizedMobile: '9884098765',
    age: 26,
    gender: 'Female',
    class: 'CC',
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
    mobile: '+91 97910 11223',
    normalizedMobile: '9791011223',
    age: 42,
    gender: 'Male',
    class: 'CC',
    trainNumber: '20607',
    quota: 'Senior',
    priorityScore: 89.0,
    status: 'RAC_WAITING',
    checkinComplete: false,
    boardingStation: 'MAS',
    allocatedSeat: null
  }
];

/**
 * Initial Coach C2 Passengers Baseline
 */
export const INITIAL_COACH_PASSENGERS = [
  { seat: 1, subPnr: 'P901', name: 'R. K. Sharma', status: 'BOARDED', time: '05:22 AM', mainPnr: '9000100001' },
  { seat: 2, subPnr: 'P902', name: 'Sunita Sharma', status: 'BOARDED', time: '05:22 AM', mainPnr: '9000100001' },
  { seat: 3, subPnr: 'P903', name: 'G. Balachandar', status: 'BOARDED', time: '05:25 AM', mainPnr: '9000100002' },
  { seat: 4, subPnr: 'P904', name: 'Lakshmi B', status: 'BOARDED', time: '05:26 AM', mainPnr: '9000100003' },
  { seat: 5, subPnr: 'P905', name: 'Karthik N', status: 'BOARDED', time: '05:28 AM', mainPnr: '9000100004' },
  { seat: 6, subPnr: 'P906', name: 'Divya M', status: 'BOARDED', time: '05:30 AM', mainPnr: '9000100005' },
  { seat: 7, subPnr: 'P907', name: 'V. Sundaresan', status: 'BOARDED', time: '05:31 AM', mainPnr: '9000100006' },
  { seat: 8, subPnr: 'P908', name: 'Shanti S', status: 'BOARDED', time: '05:31 AM', mainPnr: '9000100007' },
  { seat: 9, subPnr: 'P909', name: 'Naveen Raj', status: 'BOARDED', time: '05:33 AM', mainPnr: '9000100008' },
  { seat: 10, subPnr: 'P910', name: 'Meera N', status: 'BOARDED', time: '05:33 AM', mainPnr: '9000100009' },
  { seat: 11, subPnr: 'P911', name: 'Sanjay Dutt', status: 'BOARDED', time: '05:35 AM', mainPnr: '9000100010' },
  { seat: 12, subPnr: 'P912', name: 'Ayesha Khan', status: 'BOARDED', time: '05:35 AM', mainPnr: '9000100011' },
  { seat: 13, subPnr: 'P913', name: 'C. Venkatesh', status: 'BOARDED', time: '05:37 AM', mainPnr: '9000100012' },
  { seat: 14, subPnr: 'P914', name: 'Radha V', status: 'BOARDED', time: '05:37 AM', mainPnr: '9000100013' },
  { seat: 15, subPnr: 'P915', name: 'Gautam Menon', status: 'BOARDED', time: '05:38 AM', mainPnr: '9000100014' },
  { seat: 16, subPnr: 'P916', name: 'Anu Emmanuel', status: 'BOARDED', time: '05:38 AM', mainPnr: '9000100015' },
  { seat: 17, subPnr: 'P917', name: 'Rajesh V', status: 'BOARDED', time: '05:39 AM', mainPnr: '9000100016' },
  { seat: 18, subPnr: 'P918', name: 'Pooja R', status: 'BOARDED', time: '05:39 AM', mainPnr: '9000100017' },
  { seat: 19, subPnr: 'P919', name: 'Sudhir Nayak', status: 'BOARDED', time: '05:40 AM', mainPnr: '9000100018' },
  { seat: 20, subPnr: 'P920', name: 'Aparna S', status: 'BOARDED', time: '05:40 AM', mainPnr: '9000100019' },

  // Seat 38: Unboarded passenger for "Next Station + 15 km" prototype test
  { seat: 38, subPnr: 'P938', name: 'S. Ranganathan', status: 'PENDING', time: null, mainPnr: '9000100038' }
];

/**
 * Standard Demo System Users
 */
export const DEMO_USERS = {
  passenger: {
    email: 'harshavardhan@gmail.com',
    pin: '1234',
    name: 'Harshavardhan S',
    role: 'passenger',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    normalizedMobile: '9876543210',
    googleConnected: true,
    biometricRegistered: true,
    firstTimeSetupDone: true
  },
  meenakshi: {
    email: 'meenakshi@gmail.com',
    pin: '1234',
    name: 'Meenakshi S',
    role: 'passenger',
    phone: '+91 98765 00001',
    normalizedMobile: '9876500001',
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
    trainAssigned: '20607',
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
