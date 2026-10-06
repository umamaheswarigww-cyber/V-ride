// V-Ride V2.0 types — extended from V1 to support the full ride lifecycle.

export type VehicleType = "bike" | "auto" | "car";

export type RideStatus =
  | "upcoming"
  | "confirmed"
  | "arriving"
  | "started"
  | "on_the_way"
  | "arriving_soon"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid";

export type Location = {
  id: string;
  label: string;
  area?: string;
};

export type Student = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  rides: number;
  verified: boolean;
  branch: string;
  year: string;
};

export type RideMember = {
  studentId: string;
  pickup: string;
  seat: number;
  payment: PaymentStatus;
};

export type Ride = {
  id: string;
  from: string;
  to: string;
  pickup: string;
  date: string;
  time: string;
  timeValue: number;
  totalFare: number;
  perHead: number;
  seatsTotal: number;
  seatsTaken: number;
  organizer: string;
  organizerId: string;
  note: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  matchScore: number;
  members: string[];
  distanceKm: number;
  durationMin: number;
  fareBreakdown: {
    base: number;
    distanceCharge: number;
    serviceCharge: number;
    total: number;
  };
};

export type ChatMessage = {
  id: string;
  rideId: string;
  senderId: string; // "me" for the current user
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
};

export type RideHistoryEntry = {
  id: string;
  rideId: string;
  date: string;
  from: string;
  to: string;
  vehicleType: VehicleType;
  distanceKm: number;
  durationMin: number;
  totalFare: number;
  perHead: number;
  passengers: number;
  status: RideStatus;
  paymentStatus: PaymentStatus;
};

export type Vehicle = {
  type: VehicleType;
  label: string;
  icon: "bike" | "car" | "auto";
  capacity: number;
  ratePerKm: number;
  baseFare: number;
  speedKmH: number;
  recommended?: boolean;
};
