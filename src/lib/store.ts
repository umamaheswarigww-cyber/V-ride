"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Ride,
  ChatMessage,
  RideHistoryEntry,
  RideStatus,
  PaymentStatus,
  VehicleType,
} from "./types";
import {
  RIDES,
  RECENT_RIDES,
  CHAT_SEED,
  STUDENTS,
  DASHBOARD_STATS,
} from "./mock";

/**
 * Central V-Ride store. Drives state synchronization across views:
 * joining a ride updates Dashboard, Chat, History, Profile stats;
 * starting a ride updates Live Ride + status; completing updates payment
 * + history + profile stats.
 */

type VRideState = {
  // Mock ride pool (always available)
  pool: Ride[];

  // Rides created by the user (Offer Ride flow)
  offered: Ride[];

  // IDs of rides the user has joined
  joinedIds: string[];

  // Currently active ride ID for Live Ride view
  activeRideId: string | null;

  // Per-ride status (overrides pool status when user joins)
  rideStatus: Record<string, RideStatus>;

  // Per-ride payment status (per member student id)
  payments: Record<string, Record<string, PaymentStatus>>;

  // Chat messages keyed by rideId
  chats: Record<string, ChatMessage[]>;

  // Ride history
  history: RideHistoryEntry[];

  // Actions
  joinRide: (rideId: string) => void;
  leaveRide: (rideId: string) => void;
  offerRide: (ride: Ride) => void;
  setActiveRide: (rideId: string | null) => void;
  setRideStatus: (rideId: string, status: RideStatus) => void;
  markPaid: (rideId: string, studentId: string) => void;
  sendMessage: (rideId: string, text: string) => void;
  getRide: (rideId: string) => Ride | undefined;
  isJoined: (rideId: string) => boolean;
  completeActiveRide: () => void;
};

export const useVRideStore = create<VRideState>()(
  persist(
    (set, get) => ({
      pool: RIDES,
      offered: [],
      joinedIds: [],
      activeRideId: null,
      rideStatus: {},
      payments: {},
      chats: { "ride-101": CHAT_SEED },
      history: RECENT_RIDES,

      joinRide: (rideId) =>
        set((s) => {
          if (s.joinedIds.includes(rideId)) return s;
          const ride = [...s.offered, ...s.pool].find((r) => r.id === rideId);
          const memberPayments = Object.fromEntries(
            (ride?.members ?? []).map((id) => [id, "paid" as PaymentStatus]),
          );
          return {
            ...s,
            joinedIds: [...s.joinedIds, rideId],
            rideStatus: { ...s.rideStatus, [rideId]: "confirmed" },
            payments: {
              ...s.payments,
              [rideId]: {
                "stu-6": "pending", // me — I owe money
                ...memberPayments,
              },
            },
          };
        }),

      leaveRide: (rideId) =>
        set((s) => {
          const joinedIds = s.joinedIds.filter((id) => id !== rideId);
          const { [rideId]: _omit, ...rideStatus } = s.rideStatus;
          const { [rideId]: _omitPay, ...payments } = s.payments;
          return {
            ...s,
            joinedIds,
            rideStatus,
            payments,
            activeRideId: s.activeRideId === rideId ? null : s.activeRideId,
          };
        }),

      offerRide: (ride) =>
        set((s) => ({
          ...s,
          offered: [ride, ...s.offered],
          joinedIds: s.joinedIds.includes(ride.id)
            ? s.joinedIds
            : [...s.joinedIds, ride.id],
          rideStatus: { ...s.rideStatus, [ride.id]: "confirmed" },
        })),

      setActiveRide: (rideId) => set((s) => ({ ...s, activeRideId: rideId })),

      setRideStatus: (rideId, status) =>
        set((s) => ({ ...s, rideStatus: { ...s.rideStatus, [rideId]: status } })),

      markPaid: (rideId, studentId) =>
        set((s) => ({
          ...s,
          payments: {
            ...s.payments,
            [rideId]: {
              ...(s.payments[rideId] ?? {}),
              [studentId]: "paid",
            },
          },
        })),

      sendMessage: (rideId, text) =>
        set((s) => {
          const msgs = s.chats[rideId] ?? [];
          const newMsg: ChatMessage = {
            id: `m-${Date.now()}`,
            rideId,
            senderId: "me",
            text,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            status: "sent",
          };
          return {
            ...s,
            chats: { ...s.chats, [rideId]: [...msgs, newMsg] },
          };
        }),

      getRide: (rideId) => {
        const s = get();
        return [...s.offered, ...s.pool].find((r) => r.id === rideId);
      },

      isJoined: (rideId) => get().joinedIds.includes(rideId),

      completeActiveRide: () => {
        const s = get();
        const rideId = s.activeRideId;
        if (!rideId) return;
        const ride = s.getRide(rideId);
        if (!ride) return;
        const historyEntry: RideHistoryEntry = {
          id: `h-${Date.now()}`,
          rideId,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          from: ride.from,
          to: ride.to,
          vehicleType: ride.vehicleType,
          distanceKm: ride.distanceKm,
          durationMin: ride.durationMin,
          totalFare: ride.totalFare,
          perHead: ride.perHead,
          passengers: ride.seatsTaken + 1,
          status: "completed",
          paymentStatus: "paid",
        };
        set({
          ...s,
          rideStatus: { ...s.rideStatus, [rideId]: "completed" },
          history: [historyEntry, ...s.history],
          activeRideId: null,
        });
      },
    }),
    {
      name: "vride-store-v2",
      storage: createJSONStorage(() => localStorage),
      // Don't persist the pool (it's static) but persist everything else
      partialize: (s) => ({
        offered: s.offered,
        joinedIds: s.joinedIds,
        activeRideId: s.activeRideId,
        rideStatus: s.rideStatus,
        payments: s.payments,
        chats: s.chats,
        history: s.history,
      }),
    },
  ),
);

// Selector helpers
export const useRideStatus = (rideId: string): RideStatus => {
  return useVRideStore((s) => s.rideStatus[rideId] ?? "upcoming");
};

export const DEMO_USER = STUDENTS.find((s) => s.id === "stu-6")!;
export const DEMO_STATS = DASHBOARD_STATS;
