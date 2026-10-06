// V-Ride V2.0 mock data — extended from V1 with vehicles, locations, chat,
// ride history, and a consistent demo user (Lokesh).

import type {
  Vehicle,
  Location,
  Student,
  Ride,
  ChatMessage,
  RideHistoryEntry,
} from "./types";

export const LOCATIONS: Location[] = [
  { id: "loc-1", label: "Vijayawada Railway Station", area: "Vijayawada" },
  { id: "loc-2", label: "Benz Circle", area: "Vijayawada" },
  { id: "loc-3", label: "PNBS Bus Stand", area: "Vijayawada" },
  { id: "loc-4", label: "Mangalagiri", area: "Mangalagiri" },
  { id: "loc-5", label: "Guntur Bus Stand", area: "Guntur" },
  { id: "loc-6", label: "VIT-AP University", area: "Amaravati" },
  { id: "loc-7", label: "Gannavaram Junction", area: "Gannavaram" },
  { id: "loc-8", label: "Amaravati Town", area: "Amaravati" },
  { id: "loc-9", label: "Tenali Junction", area: "Tenali" },
];

export const RECENT_LOCATIONS: Location[] = [
  LOCATIONS[0],
  LOCATIONS[1],
  LOCATIONS[5],
  LOCATIONS[4],
];

export const SAVED_LOCATIONS: Location[] = [
  { id: "save-home", label: "Home (Hostel Block C)", area: "VIT-AP" },
  { id: "save-class", label: "VIT-AP CB类Classroom", area: "VIT-AP" },
];

export const VEHICLES: Vehicle[] = [
  {
    type: "bike",
    label: "Bike",
    icon: "bike",
    capacity: 2,
    ratePerKm: 8,
    baseFare: 30,
    speedKmH: 45,
  },
  {
    type: "auto",
    label: "Auto",
    icon: "auto",
    capacity: 4,
    ratePerKm: 12,
    baseFare: 40,
    speedKmH: 35,
    recommended: true,
  },
  {
    type: "car",
    label: "Car",
    icon: "car",
    capacity: 4,
    ratePerKm: 18,
    baseFare: 80,
    speedKmH: 50,
  },
];

export const STUDENTS: Student[] = [
  {
    id: "stu-1",
    name: "Rahul Verma",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 4.9,
    rides: 18,
    verified: true,
    branch: "CSE",
    year: "3rd Year",
  },
  {
    id: "stu-2",
    name: "Sneha Reddy",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 4.8,
    rides: 12,
    verified: true,
    branch: "ECE",
    year: "2nd Year",
  },
  {
    id: "stu-3",
    name: "Arjun Naidu",
    avatar: "https://i.pravatar.cc/120?img=14",
    rating: 5.0,
    rides: 24,
    verified: true,
    branch: "Mech",
    year: "4th Year",
  },
  {
    id: "stu-4",
    name: "Ananya Rao",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: 4.7,
    rides: 9,
    verified: true,
    branch: "IT",
    year: "2nd Year",
  },
  {
    id: "stu-5",
    name: "Karthik S.",
    avatar: "https://i.pravatar.cc/120?img=15",
    rating: 4.9,
    rides: 16,
    verified: true,
    branch: "CSE-AI",
    year: "3rd Year",
  },
  {
    id: "stu-6",
    name: "Lokesh Kumar",
    avatar: "https://i.pravatar.cc/120?img=33",
    rating: 4.9,
    rides: 18,
    verified: true,
    branch: "CSE",
    year: "2nd Year",
  },
];

// Distances between locations (km). Used by the fare engine.
export const ROUTE_DISTANCES: Record<string, number> = {
  "Vijayawada Railway Station→VIT-AP University": 31.4,
  "Benz Circle→VIT-AP University": 28.0,
  "PNBS Bus Stand→VIT-AP University": 26.5,
  "Mangalagiri→VIT-AP University": 12.0,
  "Guntur Bus Stand→VIT-AP University": 35.2,
  "Gannavaram Junction→VIT-AP University": 22.5,
  "Amaravati Town→VIT-AP University": 6.5,
  "Tenali Junction→VIT-AP University": 42.0,
  "Vijayawada→VIT-AP University": 28.0,
  "Vijayawada→VIT-AP University ": 28.0,
};

export function getDistance(from: string, to: string): number {
  return (
    ROUTE_DISTANCES[`${from}→${to}`] ??
    ROUTE_DISTANCES[`${from}→${to} `] ??
    25 // fallback
  );
}

export function getDuration(distanceKm: number, vehicle: Vehicle): number {
  return Math.round((distanceKm / vehicle.speedKmH) * 60);
}

export function computeFare(
  vehicle: Vehicle,
  distanceKm: number,
): { base: number; distanceCharge: number; serviceCharge: number; total: number } {
  const base = vehicle.baseFare;
  const distanceCharge = Math.round(vehicle.ratePerKm * distanceKm);
  const serviceCharge = Math.round(base * 0.15);
  const total = base + distanceCharge + serviceCharge;
  return { base, distanceCharge, serviceCharge, total };
}

export const RIDES: Ride[] = [
  {
    id: "ride-101",
    from: "Vijayawada Railway Station",
    to: "VIT-AP University",
    pickup: "Benz Circle",
    date: "Today",
    time: "8:00 AM",
    timeValue: 8,
    totalFare: 320,
    perHead: 80,
    seatsTotal: 4,
    seatsTaken: 2,
    organizer: "Rahul Verma",
    organizerId: "stu-1",
    note: "Leaving Benz Circle, will pickup near PNBS if needed.",
    vehicleType: "car",
    vehicleNumber: "AP 39 XY 1234 (Demo)",
    matchScore: 96,
    members: ["stu-1", "stu-2"],
    distanceKm: 31.4,
    durationMin: 48,
    fareBreakdown: { base: 80, distanceCharge: 200, serviceCharge: 40, total: 320 },
  },
  {
    id: "ride-102",
    from: "Benz Circle",
    to: "VIT-AP University",
    pickup: "PNBS Bus Stand",
    date: "Today",
    time: "8:30 AM",
    timeValue: 8.5,
    totalFare: 280,
    perHead: 70,
    seatsTotal: 4,
    seatsTaken: 3,
    organizer: "Sneha Reddy",
    organizerId: "stu-2",
    note: "Pickup near PNBS, smooth ride with AC cab.",
    vehicleType: "car",
    vehicleNumber: "AP 39 AB 4321 (Demo)",
    matchScore: 92,
    members: ["stu-2", "stu-1", "stu-4"],
    distanceKm: 28.0,
    durationMin: 42,
    fareBreakdown: { base: 80, distanceCharge: 160, serviceCharge: 40, total: 280 },
  },
  {
    id: "ride-103",
    from: "Guntur Bus Stand",
    to: "VIT-AP University",
    pickup: "Guntur Bus Stand",
    date: "Today",
    time: "9:00 AM",
    timeValue: 9,
    totalFare: 420,
    perHead: 105,
    seatsTotal: 4,
    seatsTaken: 2,
    organizer: "Arjun Naidu",
    organizerId: "stu-3",
    note: "Departing from Guntur Bus Stand at 9 sharp.",
    vehicleType: "car",
    vehicleNumber: "AP 39 GH 5678 (Demo)",
    matchScore: 88,
    members: ["stu-3", "stu-5"],
    distanceKm: 35.2,
    durationMin: 52,
    fareBreakdown: { base: 80, distanceCharge: 290, serviceCharge: 50, total: 420 },
  },
  {
    id: "ride-104",
    from: "Mangalagiri",
    to: "VIT-AP University",
    pickup: "Mangalagiri Center",
    date: "Today",
    time: "7:45 AM",
    timeValue: 7.75,
    totalFare: 180,
    perHead: 45,
    seatsTotal: 4,
    seatsTaken: 2,
    organizer: "Karthik S.",
    organizerId: "stu-5",
    note: "Quick ride from Mangalagiri, room for 2 more.",
    vehicleType: "auto",
    vehicleNumber: "AP 39 MN 9012 (Demo)",
    matchScore: 85,
    members: ["stu-5", "stu-6"],
    distanceKm: 12.0,
    durationMin: 22,
    fareBreakdown: { base: 40, distanceCharge: 120, serviceCharge: 20, total: 180 },
  },
  {
    id: "ride-105",
    from: "Benz Circle",
    to: "VIT-AP University",
    pickup: "Benz Circle",
    date: "Today",
    time: "10:15 AM",
    timeValue: 10.25,
    totalFare: 280,
    perHead: 70,
    seatsTotal: 4,
    seatsTaken: 1,
    organizer: "Ananya Rao",
    organizerId: "stu-4",
    note: "Late morning ride, perfect for late classes.",
    vehicleType: "car",
    vehicleNumber: "AP 39 PQ 3456 (Demo)",
    matchScore: 80,
    members: ["stu-4"],
    distanceKm: 28.0,
    durationMin: 42,
    fareBreakdown: { base: 80, distanceCharge: 160, serviceCharge: 40, total: 280 },
  },
  {
    id: "ride-106",
    from: "Gannavaram Junction",
    to: "VIT-AP University",
    pickup: "Gannavaram Junction",
    date: "Today",
    time: "8:45 AM",
    timeValue: 8.75,
    totalFare: 200,
    perHead: 67,
    seatsTotal: 3,
    seatsTaken: 1,
    organizer: "Lokesh Kumar",
    organizerId: "stu-6",
    note: "Heading out from Gannavaram, 2 seats free.",
    vehicleType: "auto",
    vehicleNumber: "AP 39 RS 7788 (Demo)",
    matchScore: 78,
    members: ["stu-6"],
    distanceKm: 22.5,
    durationMin: 35,
    fareBreakdown: { base: 40, distanceCharge: 140, serviceCharge: 20, total: 200 },
  },
];

export const DASHBOARD_STATS = {
  upcomingRide: {
    from: "Vijayawada Railway Station",
    to: "VIT-AP University",
    pickup: "Benz Circle",
    time: "8:00 AM",
    fare: 80,
    organizer: "Rahul Verma",
    seats: "2 / 4",
    members: ["stu-1", "stu-2", "stu-6"],
    vehicleType: "car" as Vehicle["type"],
    rideId: "ride-101",
  },
  moneySaved: 1240,
  ridesShared: 18,
  ridesCompleted: 16,
  ridesCancelled: 2,
  co2Saved: 24.8,
  rating: 4.9,
};

export const RECENT_RIDES: RideHistoryEntry[] = [
  {
    id: "r1",
    rideId: "ride-101",
    date: "Oct 4, 2026",
    from: "Vijayawada Railway Station",
    to: "VIT-AP University",
    vehicleType: "car",
    distanceKm: 31.4,
    durationMin: 48,
    totalFare: 320,
    perHead: 80,
    passengers: 4,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "r2",
    rideId: "ride-102",
    date: "Oct 2, 2026",
    from: "Benz Circle",
    to: "VIT-AP University",
    vehicleType: "car",
    distanceKm: 28.0,
    durationMin: 42,
    totalFare: 280,
    perHead: 70,
    passengers: 4,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "r3",
    date: "Sep 29, 2026",
    rideId: "ride-103",
    from: "Guntur Bus Stand",
    to: "VIT-AP University",
    vehicleType: "auto",
    distanceKm: 35.2,
    durationMin: 52,
    totalFare: 420,
    perHead: 105,
    passengers: 4,
    status: "completed",
    paymentStatus: "pending",
  },
  {
    id: "r4",
    date: "Sep 25, 2026",
    rideId: "ride-104",
    from: "Mangalagiri",
    to: "VIT-AP University",
    vehicleType: "auto",
    distanceKm: 12.0,
    durationMin: 22,
    totalFare: 180,
    perHead: 45,
    passengers: 4,
    status: "cancelled",
    paymentStatus: "pending",
  },
  {
    id: "r5",
    date: "Sep 22, 2026",
    rideId: "ride-105",
    from: "Benz Circle",
    to: "VIT-AP University",
    vehicleType: "car",
    distanceKm: 28.0,
    durationMin: 42,
    totalFare: 280,
    perHead: 70,
    passengers: 4,
    status: "completed",
    paymentStatus: "paid",
  },
];

export const CHAT_SEED: ChatMessage[] = [
  {
    id: "m1",
    rideId: "ride-101",
    senderId: "stu-1",
    text: "Hey everyone! Leaving Benz Circle at 8 sharp. Be there 5 min early.",
    timestamp: "07:42 AM",
    status: "read",
  },
  {
    id: "m2",
    rideId: "ride-101",
    senderId: "stu-2",
    text: "Sounds good! I'll be at the pickup point by 7:55.",
    timestamp: "07:48 AM",
    status: "read",
  },
  {
    id: "m3",
    rideId: "ride-101",
    senderId: "me",
    text: "Perfect, I'm on my way. Should I bring anything for the ride?",
    timestamp: "07:51 AM",
    status: "delivered",
  },
  {
    id: "m4",
    rideId: "ride-101",
    senderId: "stu-1",
    text: "Just yourself 😄 We'll be there in 5.",
    timestamp: "07:53 AM",
    status: "delivered",
  },
];

export const QUICK_REPLIES = [
  "Where should we meet?",
  "I'm near the station.",
  "I'll be there in 5 minutes.",
  "I'm running late.",
  "Which pickup point?",
  "On my way!",
];

export const STUDENT_PROFILE = {
  ...STUDENTS.find((s) => s.id === "stu-6")!,
  university: "VIT-AP University",
  joinedAt: "Aug 2024",
  greenKms: 248,
  carbonSaved: 12.4,
  totalSaved: 1240,
  totalRides: 18,
  completedRides: 16,
  cancelledRides: 2,
  reviews: [
    {
      from: "Rahul Verma",
      rating: 5,
      text: "Punctual, friendly, and respectful rider. Would share a ride again.",
    },
    {
      from: "Sneha Reddy",
      rating: 5,
      text: "Lokesh is super chill and always on time at the pickup point.",
    },
    {
      from: "Ananya Rao",
      rating: 4,
      text: "Easy to coordinate with, would recommend.",
    },
  ],
};

export function getStudentById(id: string): Student | undefined {
  return STUDENTS.find((s) => s.id === id);
}

export function getVehicleByType(type: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.type === type);
}
